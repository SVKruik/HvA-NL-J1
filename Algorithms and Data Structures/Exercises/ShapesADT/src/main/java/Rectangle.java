import java.awt.*;
import java.util.Objects;

public class Rectangle extends Shape {
    private final int width;
    private final int length;

    public Rectangle(Color color, int width, int length) {
        super(color);
        this.width = width;
        this.length = length;
    }

    @Override
    public double getArea() {
        return this.width * this.length;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        if (!super.equals(o)) return false;
        Rectangle rectangle = (Rectangle) o;
        return width == rectangle.width && length == rectangle.length;
    }

    @Override
    public int hashCode() {
        return Objects.hash(super.hashCode(), width, length);
    }
}
