import java.util.Scanner;

/**
 * Dit programma rolt een dobbelsteen in een ASCII tekening.
 * Het programma stopt als er een 6 wordt gegooid.
 *
 * @author Stefan Kruik
 */

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        System.out.println("Welk karakter moet ik gebruiken voor het oog:");
        String oogType = scanner.next();
        scanner.close();

        String dobbelEen = " " + " " + " \n" +
                " " + oogType + " \n" +
                " " + " " + " ";

        String dobbelTwee = oogType + " " + " \n" +
                " " + " " + " \n" +
                " " + " " + oogType;

        String dobbelDrie = oogType + " " + " \n" +
                " " + oogType + " \n" +
                " " + " " + oogType;

        String dobbelVier = oogType + " " + oogType + "\n" +
                " " + " " + " \n" +
                oogType + " " + oogType;

        String dobbelVijf = oogType + " " + oogType + "\n" +
                " " + oogType + " \n" +
                oogType + " " + oogType;

        String dobbelZes = oogType + " " + oogType + "\n" +
                oogType + " " + oogType + "\n" +
                oogType + " " + oogType;

        int random = 0;
        while (random < 6) {
            random = (int) ((Math.random() * 6) + 1);
            if (random == 1) {
                System.out.println(dobbelEen);
                System.out.println(" ");
            } else if (random == 2) {
                System.out.println(dobbelTwee);
                System.out.println(" ");
            } else if (random == 3) {
                System.out.println(dobbelDrie);
                System.out.println(" ");
            } else if (random == 4) {
                System.out.println(dobbelVier);
                System.out.println(" ");
            } else if (random == 5) {
                System.out.println(dobbelVijf);
                System.out.println(" ");
            } else if (random == 6) {
                System.out.println(dobbelZes);
                System.out.println(" ");
            }
        }
    }
}