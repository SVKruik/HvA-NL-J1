import java.util.List;

public class ASimpleList implements SimpleList<Object> {
    List<Object> list;

    @Override
    public int size() {
        return list.size();
    }

    @Override
    public void add(Object item) {
        list.add(item);
    }

    @Override
    public Object get(int index) {
        try {
            return list.get(index);
        } catch (IndexOutOfBoundsException exception) {
            System.out.println("Invalid index.");
            return false;
        }
    }

    @Override
    public int indexOf(Object item) {
        return list.indexOf(item);
    }

    @Override
    public Object remove(int index) {
        try {
            return list.remove(index);
        } catch (IndexOutOfBoundsException exception) {
            System.out.println("Invalid index.");
            return false;
        }
    }
}
