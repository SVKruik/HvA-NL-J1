import java.util.Scanner;

/**
 * @author Stefan Kruik
 * Plof getal spel.
 */

public class Main {
    public static void main(String[] args) {
        Scanner input = new Scanner(System.in);
        System.out.print("Wat is het plofgetal (2..9)? ");
        int plofGetal = input.nextInt();

        if (plofGetal < 2) {
            System.out.print("Onjuist plofgetal! ");
        } else if (plofGetal > 9) {
            System.out.print("Onjuist plofgetal! ");
        } else {

            System.out.print("Tot en met welk getal moet ik tellen? ");
            int maximum = input.nextInt();

            input.close();

            for (int i = 1; i <= maximum; i++) {
                if (i % plofGetal == 0) {
                    System.out.print("Plof ");
                } else {
                    System.out.print(i + " ");
                }
            }
        }
    }
}