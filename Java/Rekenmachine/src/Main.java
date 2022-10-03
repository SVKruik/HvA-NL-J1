import java.util.Scanner;

/**
 * Dit programma is een rekenmachine. Geef de karakter en je getallen aan,
 * en hij berekent de uitkomst.
 *
 * @author Stefan Kruik
 */

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        char karakter;
        do {
            System.out.print("Operator (S = stoppen): ");
            karakter = scanner.next().charAt(0);

            if (karakter == 's' || karakter == 'S') {
                break;
            } else {
                System.out.print("Eerste getal: ");
                double getal1 = scanner.nextDouble();

                System.out.print("Tweede getal: ");
                double getal2 = scanner.nextDouble();

                printBerekening(karakter, getal1, getal2);
            }
        } while (!isGeldigeOperator(karakter));
        scanner.close();
    }

    public static boolean isGeldigeOperator(char karakter) {
        boolean karakterCheck;
        if (karakter != '+' && karakter != '-' && karakter != '*' && karakter != '/' && karakter != '%' && karakter != 'S' && karakter != 's') {
            karakterCheck = false;
        } else {
            karakterCheck = true;
        }

        return karakterCheck;
    }

    public static void printBerekening(char operator, double getal1, double getal2) {
        double uitkomst = 0;

        if (operator == '+') {
            uitkomst = getal1 + getal2;
        } else if (operator == '-') {
            uitkomst = getal1 - getal2;
        } else if (operator == '*') {
            uitkomst = getal1 * getal2;
        } else if (operator == '/') {
            uitkomst = getal1 / getal2;
        } else if (operator == '%') {
            uitkomst = getal1 % getal2;
        }

        System.out.println(getal1 + " " + operator  + " " + getal2 + " = " + uitkomst);
    }
}