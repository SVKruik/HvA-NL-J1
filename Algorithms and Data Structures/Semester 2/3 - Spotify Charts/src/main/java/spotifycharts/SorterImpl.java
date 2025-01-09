package spotifycharts;

import java.util.*;

public class SorterImpl<E> implements Sorter<E> {

    /**
     * Sorts all items by selection or insertion sort using the provided comparator
     * for deciding relative ordening of two items
     * Items are sorted 'in place' without use of an auxiliary list or array
     * @param items
     * @param comparator
     * @return  the items sorted in place
     */
    public List<E> selInsBubSort(List<E> items, Comparator<E> comparator) {
        if (items == null || items.size() <= 1) return items;

        for (int i = 0; i < items.size() - 1; i++) {
            int min = i;
            for (int j = i + 1; j < items.size(); j++) {
                if (comparator.compare(items.get(j), items.get(min)) < 0) {
                    min = j;
                }
            }

            Collections.swap(items, i, min);
        }

        return items;
    }

    /**
     * Sorts all items by quick sort using the provided comparator
     * for deciding relative ordening of two items
     * Items are sorted 'in place' without use of an auxiliary list or array
     * @param items
     * @param comparator
     * @return  the items sorted in place
     */
    public List<E> quickSort(List<E> items, Comparator<E> comparator) {
        if (items == null || items.size() <= 1) {
            return items; // If all the items are already sorted
        }
        return quickSortRecursive(items, 0, items.size() - 1, comparator);
    }

    private List<E> quickSortRecursive(List<E> items, int low, int high, Comparator<E> comparator) {
        if (low < high) {
            int partitionIndex = partition(items, low, high, comparator);
            quickSortRecursive(items, low, partitionIndex - 1, comparator);
            quickSortRecursive(items, partitionIndex + 1, high, comparator);
        }
        return items;
    }

    private int partition(List<E> items, int low, int high, Comparator<E> comparator) {
        E pivot = items.get(high);  // Last element as pivot
        int i = low - 1;

        for (int j = low; j < high; j++) {
            if (comparator.compare(items.get(j), pivot) <= 0) {
                i++;
                Collections.swap(items, i, j);  // Swap elements
            }
        }
        Collections.swap(items, i + 1, high);  // Relocate the pivot
        return i + 1;
    }

    /**
     * Identifies the lead collection of numTops items according to the ordening criteria of comparator
     * and organizes and sorts this lead collection into the first numTops positions of the list
     * with use of (zero-based) heapSwim and heapSink operations.
     * The remaining items are kept in the tail of the list, in arbitrary order.
     * Items are sorted 'in place' without use of an auxiliary list or array or other positions in items
     * @param numTops       the size of the lead collection of items to be found and sorted
     * @param items
     * @param comparator
     * @return              the items list with its first numTops items sorted according to comparator
     *                      all other items >= any item in the lead collection
     */
    public List<E> topsHeapSort(int numTops, List<E> items, Comparator<E> comparator) {

        Comparator<E> reverseComparator = comparator.reversed();

        for (int heapSize = 2; heapSize <= numTops; heapSize++) {
            heapSwim(items, heapSize, reverseComparator);
        }

        // insert remaining items into the lead collection as appropriate
        for (int i = numTops; i < items.size(); i++) {
            E item = items.get(i);
            E worstLeadItem = items.get(0);
            if (comparator.compare(item, worstLeadItem) < 0) {
                // item < worstLeadItem, so shall be included in the lead collection
                items.set(0, item);
                // demote worstLeadItem back to the tail collection, at the original position of item
                items.set(i, worstLeadItem);
                // repair the heap condition of the lead collection
                heapSink(items, numTops, reverseComparator);
            }
        }

        // the first numTops positions of the list now contain the lead collection
        for (int i = numTops - 1; i > 0; i--) {
            // Swap item[0] with item[i] to place the worst item in its correct position
            Collections.swap(items, 0, i);

            // Repair the heap condition on the remaining heap of size i
            heapSink(items, i, reverseComparator);
        }

        return items;
    }

    /**
     * Repairs the zero-based heap condition for items[heapSize-1] on the basis of the comparator
     * all items[0..heapSize-2] are assumed to satisfy the heap condition
     * The zero-bases heap condition says:
     *                      all items[i] <= items[2*i+1] and items[i] <= items[2*i+2], if any
     * or equivalently:     all items[i] >= items[(i-1)/2]
     * @param items
     * @param heapSize
     * @param comparator
     */
    protected void heapSwim(List<E> items, int heapSize, Comparator<E> comparator) {
        int i = heapSize - 1;
        while (i > 0) {
            int parent = (i - 1) / 2;
            if (comparator.compare(items.get(i), items.get(parent)) >= 0) break;

            // Swap items[i] with its parent
            Collections.swap(items, i, parent);
            i = parent;
        }
    }
    /**
     * Repairs the zero-based heap condition for its root items[0] on the basis of the comparator
     * all items[1..heapSize-1] are assumed to satisfy the heap condition
     * The zero-bases heap condition says:
     *                      all items[i] <= items[2*i+1] and items[i] <= items[2*i+2], if any
     * or equivalently:     all items[i] >= items[(i-1)/2]
     * @param items
     * @param heapSize
     * @param comparator
     */
    protected void heapSink(List<E> items, int heapSize, Comparator<E> comparator) {
        int i = 0;
        while (2 * i + 1 < heapSize) {
            int left = 2 * i + 1;
            int right = left + 1;
            int smallest = left;

            // Find the smallest child
            if (right < heapSize && comparator.compare(items.get(right), items.get(left)) < 0) smallest = right;
            if (comparator.compare(items.get(i), items.get(smallest)) <= 0) break;

            // Swap items[i] with its smallest child
            Collections.swap(items, i, smallest);
            i = smallest;
        }
    }
}
