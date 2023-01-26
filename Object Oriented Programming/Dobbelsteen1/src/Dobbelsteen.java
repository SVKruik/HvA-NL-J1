import java.util.Random;

public class Dobbelsteen {
    public int worp;
    public char karakter;
    public Random getalGenerator = new Random();

    Dobbelsteen() {

    }

    Dobbelsteen(char karakter) {
        this.karakter = karakter;
    }

    void gooi() {
        getalGenerator.nextInt(7);
    }

    void print() {

    }
}
