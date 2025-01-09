package models;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.function.BinaryOperator;
import java.util.function.Function;

public class OrderedArrayList<E>
        extends ArrayList<E>
        implements OrderedList<E> {

    protected Comparator<? super E> sortOrder;   // the comparator that has been used with the latest sort
    protected int nSorted;                       // the number of sorted items in the first section of the list
    // representation-invariant
    //      all items at index positions 0 <= index < nSorted have been ordered by the given sortOrder comparator
    //      other items at index position nSorted <= index < size() can be in any order amongst themselves
    //              and also relative to the sorted section

    public OrderedArrayList() {
        this(null);
    }

    public OrderedArrayList(Comparator<? super E> sortOrder) {
        super();
        this.sortOrder = sortOrder;
        this.nSorted = 0;
    }

    public Comparator<? super E> getSortOrder() {
        return this.sortOrder;
    }

    @Override
    public void clear() {
        super.clear();
        this.nSorted = 0;
    }

    @Override
    public void sort(Comparator<? super E> c) {
        super.sort(c);
        this.sortOrder = c;
        this.nSorted = this.size();
    }

    @Override
    public void add(int index, E e) {
        if (index <= this.nSorted) this.nSorted = index;
        super.add(index, e);
    }

    @Override
    public E remove(int index) {
        if (index <= this.nSorted) this.nSorted--;
        return super.remove(index);
    }

    @Override
    public boolean remove(Object o) {
        int index = this.indexOf(o);
        if (index >= 0) {
            this.remove(index);
            return true;
        } else return false;
    }

    @Override
    public void sort() {
        if (this.nSorted < this.size()) this.sort(this.sortOrder);
    }

    @Override
    public int indexOf(Object item) {
        if (this.getSortOrder() != null) {
            return this.indexOfByIterativeBinarySearch((E) item);
        } else return super.indexOf(item);
    }

    /**
     * Searches for an element in the list using binary search.
     *
     * @param searchItem The item to search for.
     * @return The index of the found item if it exists, or a negative value indicating the insertion point if not found.
     */
    @Override
    public int indexOfByBinarySearch(E searchItem) {
        return this.binarySearch(searchItem, 0, nSorted - 1);
    }

    /**
     * Finds the position of the searchItem by an iterative binary search algorithm in the
     * sorted section of the arrayList, using the this.sortOrder comparator for comparison and equality test.
     * If the item is not found in the sorted section, the unsorted section of the arrayList shall be searched by linear search.
     * The found item shall yield a 0 result from the this.sortOrder comparator, and that need not to be in agreement with the .equals test.
     * Here we follow the comparator for sorting items and for deciding on equality.
     *
     * @param searchItem the item to be searched on the basis of comparison by this.sortOrder
     * @return the position index of the found item in the arrayList, or -1 if no item matches the search item.
     */
    public int indexOfByIterativeBinarySearch(E searchItem) {
        int result = this.binarySearch(searchItem, 0, nSorted - 1);

        // Sorted Section
        if (result >= 0) return result;

        // Search Unsorted Section
        for (int i = this.nSorted; i < this.size(); i++) {
            if (this.sortOrder.compare(this.get(i), searchItem) == 0) return i;
        }

        // No Match
        return -1;
    }

    /**
     * Generic binary search implementation for others to use.
     *
     * @param searchItem The item to find.
     * @param low        Lower bound
     * @param high       Upper bound
     * @return Index of the searchItem.
     */
    private int binarySearch(E searchItem, int low, int high) {
        while (low <= high) {
            int mid = low + (high - low) / 2;
            int cmp = this.sortOrder.compare(this.get(mid), searchItem);

            if (cmp == 0) {
                return mid;
            } else if (cmp < 0) {
                low = mid + 1;
            } else high = mid - 1;
        }

        // No Match
        return -(low + 1);
    }

    /**
     * finds the position of the searchItem by a recursive binary search algorithm in the
     * sorted section of the arrayList, using the this.sortOrder comparator for comparison and equality test.
     * If the item is not found in the sorted section, the unsorted section of the arrayList shall be searched by linear search.
     * The found item shall yield a 0 result from the this.sortOrder comparator, and that need not to be in agreement with the .equals test.
     * Here we follow the comparator for sorting items and for deciding on equality.
     *
     * @param searchItem the item to be searched on the basis of comparison by this.sortOrder
     * @return the position index of the found item in the arrayList, or -1 if no item matches the search item.
     */
    public int indexOfByRecursiveBinarySearch(E searchItem) {
        return this.indexOfByRecursiveBinarySearch(searchItem, 0, nSorted - 1);
    }

    /**
     * Overloaded method for starting the recursive search.
     * Entry point of the binary search.
     *
     * @param searchItem The item to search for.
     * @return Position of the searchItem.
     */
    public int indexOfByRecursiveBinarySearch(E searchItem, int low, int high) {
        // Sorted Section
        if (low <= high) {
            int mid = low + (high - low) / 2;
            int cmp = this.sortOrder.compare(this.get(mid), searchItem);

            if (cmp == 0) {
                return mid;
            } else if (cmp < 0) {
                return this.indexOfByRecursiveBinarySearch(searchItem, mid + 1, high);
            } else return this.indexOfByRecursiveBinarySearch(searchItem, low, mid - 1);
        }

        // Unsorted Section
        for (int i = nSorted; i < this.size(); i++) {
            if (this.sortOrder.compare(this.get(i), searchItem) == 0) return i;
        }

        // No Match
        return -1;
    }

    /**
     * finds a match of newItem in the list and applies the merger operator with the newItem to that match
     * i.e. the found match is replaced by the outcome of the merge between the match and the newItem
     * If no match is found in the list, the newItem is added to the list.
     *
     * @param newItem
     * @param merger  a function that takes two items and returns an item that contains the merged content of
     *                the two items according to some merging rule.
     *                e.g. a merger could add the value of attribute X of the second item
     *                to attribute X of the first item and then return the first item
     * @return whether a new item was added to the list or not
     */
    @Override
    public boolean merge(E newItem, BinaryOperator<E> merger) {
        if (newItem == null) return false;
        int matchedItemIndex = this.indexOfByRecursiveBinarySearch(newItem);

        if (matchedItemIndex < 0) {
            this.add(newItem);
            return true;
        } else {
            E matchedItem = this.get(matchedItemIndex);
            E mergedItem = merger.apply(newItem, matchedItem);

            this.set(matchedItemIndex, mergedItem);
            return false;
        }
    }

    /**
     * Calculates the total sum of contributions of all items in the list.
     *
     * @param mapper A function that calculates the contribution of a single item.
     * @return The total sum of all contributions.
     */
    @Override
    public double aggregate(Function<E, Double> mapper) {
        double sum = 0.0;
        for (E e : this) {
            // Applies the mapper to each item and accumulates the contributions.
            sum += mapper.apply(e);
        }
        return sum;
    }
}
