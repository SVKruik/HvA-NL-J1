package spotifycharts;

import java.util.Collections;
import java.util.Comparator;
import java.util.List;

public class SorterImpl<E> implements Sorter<E> {

    /**
     * Sorts all items by selection or insertion sort using the provided comparator
     * for deciding relative ordening of two items
     * Items are sorted 'in place' without use of an auxiliary list or array
     *
     * @param items
     * @param comparator
     * @return the items sorted in place
     */
    public List<E> selInsBubSort(List<E> items, Comparator<E> comparator) {
        for (int i = 0; i < items.size(); i++) {
            for (int j = 0; j < items.size() - i - 1; j++) {
                if (comparator.compare(items.get(j), items.get(j + 1)) > 0) {
                    E temp = items.get(j);
                    items.set(j, items.get(j + 1));
                    items.set(j + 1, temp);
                }
            }
        }
        return items;
    }

    /**
     * Sorts all items by quick sort using the provided comparator
     * for deciding relative ordening of two items
     * Items are sorted 'in place' without use of an auxiliary list or array
     *
     * @param items
     * @param comparator
     * @return the items sorted in place
     */
    public List<E> quickSort(List<E> items, Comparator<E> comparator) {
        return quickSortHelper(items, 0, items.size() - 1, comparator);
    }

    private List<E> quickSortHelper(List<E> items, int low, int high, Comparator<E> comparator) {
        if (low < high) {
            int pi = partition(items, low, high, comparator);
            quickSortHelper(items, low, pi - 1, comparator);
            quickSortHelper(items, pi + 1, high, comparator);
        }
        return items;
    }

    private int partition(List<E> items, int low, int high, Comparator<E> comparator) {
        E pivot = items.get(high);
        int i = (low - 1);
        for (int j = low; j < high; j++) {
            if (comparator.compare(items.get(j), pivot) <= 0) {
                i++;
                E temp = items.get(i);
                items.set(i, items.get(j));
                items.set(j, temp);
            }
        }
        E temp = items.get(i + 1);
        items.set(i + 1, items.get(high));
        items.set(high, temp);
        return i + 1;
    }

    /**
     * Identifies the lead collection of numTops items according to the ordening
     * criteria of comparator
     * and organizes and sorts this lead collection into the first numTops positions
     * of the list
     * with use of (zero-based) heapSwim and heapSink operations.
     * The remaining items are kept in the tail of the list, in arbitrary order.
     * Items are sorted 'in place' without use of an auxiliary list or array or
     * other positions in items
     *
     * @param numTops    the size of the lead collection of items to be found and
     *                   sorted
     * @param items
     * @param comparator
     * @return the items list with its first numTops items sorted according to
     * comparator
     * all other items >= any item in the lead collection
     */
    public List<E> topsHeapSort(int numTops, List<E> items, Comparator<E> comparator) {

        // the lead collection of numTops items will be organised into a (zero-based)
        // heap structure
        // in the first numTops list positions using the reverseComparator for the heap
        // condition.
        // that way the root of the heap will contain the worst item of the lead
        // collection
        // which can be compared easily against other candidates from the remainder of
        // the list
        Comparator<E> reverseComparator = comparator.reversed();

        // initialise the lead collection with the first numTops items in the list
        for (int heapSize = 2; heapSize <= numTops; heapSize++) {
            // repair the heap condition of items[0..heapSize-2] to include new item
            // items[heapSize-1]
            heapSwim(items, heapSize, reverseComparator);
        }

        // insert remaining items into the lead collection as appropriate
        for (int i = numTops; i < items.size(); i++) {
            // loop-invariant: items[0..numTops-1] represents the current lead collection in
            // a heap data structure
            // the root of the heap is the currently trailing item in the lead collection,
            // which will lose its membership if a better item is found from position i
            // onwards
            E item = items.get(i);
            E worstLeadItem = items.get(0);
            if (comparator.compare(item, worstLeadItem) < 0) {
                // item < worstLeadItem, so shall be included in the lead collection
                items.set(0, item);
                // demote worstLeadItem back to the tail collection, at the orginal position of
                // item
                items.set(i, worstLeadItem);
                // repair the heap condition of the lead collection
                heapSink(items, numTops, reverseComparator);
            }
        }

        // the first numTops positions of the list now contain the lead collection
        // the reverseComparator heap condition applies to this lead collection
        // now use heapSort to realise full ordening of this collection
        for (int i = numTops - 1; i > 0; i--) {
            // loop-invariant: items[i+1..numTops-1] contains the tail part of the sorted
            // lead collection
            // position 0 holds the root item of a heap of size i+1 organised by
            // reverseComparator
            // this root item is the worst item of the remaining front part of the lead
            // collection

            // Swap item[0] with item[i]
            E temp = items.get(0);
            items.set(0, items.get(i));
            items.set(i, temp);

            // Repair the heap condition
            heapSink(items, i, reverseComparator);
        }

        return items;
    }

    /**
     * Repairs the zero-based heap condition for items[heapSize-1] on the basis of
     * the comparator
     * all items[0..heapSize-2] are assumed to satisfy the heap condition
     * The zero-bases heap condition says:
     * all items[i] <= items[2*i+1] and items[i] <= items[2*i+2], if any
     * or equivalently: all items[i] >= items[(i-1)/2]
     *
     * @param items
     * @param heapSize
     * @param comparator
     */
    protected void heapSwim(List<E> items, int heapSize, Comparator<E> comparator) {
        int i = heapSize - 1;
        while (i > 0 && comparator.compare(items.get((i - 1) / 2), items.get(i)) > 0) {
            E temp = items.get(i);
            items.set(i, items.get((i - 1) / 2));
            items.set((i - 1) / 2, temp);
            i = (i - 1) / 2;
        }

    }

    /**
     * Repairs the zero-based heap condition for its root items[0] on the basis of
     * the comparator
     * all items[1..heapSize-1] are assumed to satisfy the heap condition
     * The zero-bases heap condition says:
     * all items[i] <= items[2*i+1] and items[i] <= items[2*i+2], if any
     * or equivalently: all items[i] >= items[(i-1)/2]
     *
     * @param items
     * @param heapSize
     * @param comparator
     */
    protected void heapSink(List<E> items, int heapSize, Comparator<E> comparator) {
        int i = 0;
        while (2 * i + 1 < heapSize) {
            int leftChild = 2 * i + 1;
            int rightChild = 2 * i + 2;
            int smallestChild = leftChild;

            if (rightChild < heapSize && comparator.compare(items.get(rightChild), items.get(leftChild)) < 0) {
                smallestChild = rightChild;
            }

            if (comparator.compare(items.get(i), items.get(smallestChild)) > 0) {
                Collections.swap(items, i, smallestChild);
                i = smallestChild;
            } else {
                break;
            }
        }
    }
}
