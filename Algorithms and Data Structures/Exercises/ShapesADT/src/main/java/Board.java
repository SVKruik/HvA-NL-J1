public class Board {
    private final Shape[][] shapes;
    private int boardSize;
    public Board(int boardSize) {
        shapes = new Shape[boardSize][boardSize];
        this.boardSize = boardSize;
    }

    public double getShapesArea() {
        double totalArea = 0;
        for (int i = 0; i < shapes.length; i++) {
            for (int j = 0; j < shapes[i].length; j++) {
                if (shapes[i][j] != null) {
                    totalArea += shapes[i][j].getArea();
                }
            }
        }
        return totalArea;
    }

    public boolean add(Shape shape, int x, int y) {
        try {
            if (shapes[x][y] != null) return false;
            shapes[x][y] = shape;
            return true;
        } catch (IndexOutOfBoundsException e) {
            throw new IndexOutOfBoundsException("Position "+ x + "," + y + " is not available on a board of size " + this.boardSize);
        }
    }

    public Shape remove(int x, int y) throws IndexOutOfBoundsException {
        Shape targetShape;
        try {
            targetShape = shapes[x][y];
            shapes[x][y] = null;
            return targetShape;
        } catch (IndexOutOfBoundsException e) {
            throw new IndexOutOfBoundsException("Position "+ x + "," + y + " is not available on a board of size " + this.boardSize);
        }
    }

    public Shape[][] getGrid() {
        return this.shapes;
    }
}
