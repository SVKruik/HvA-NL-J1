public interface SimpleList<I> {
    int size();
    void add(I item);
    I get(int index);
    int indexOf(I item);
    I remove(int index);
}