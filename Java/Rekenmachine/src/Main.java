import java.util.Scanner;

/**
 * Dit programma is een rekenmachine. Geef de karakter en je getallen aan,
 * en hij berekent de uitkomst. Checkt ook of de invoer correct is.
 *
 * @author Stefan Kruik
 */

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        System.out.print("Operator (S = stoppen): ");
        char karakter = scanner.next().charAt(0);

        while (!isGeldigeOperator(karakter)) {
            System.out.println("Operator is ongeldig.");
            System.out.print("Operator (S = stoppen): ");
            karakter = scanner.next().charAt(0);
        }
        System.out.print("Operator (S = stoppen): ");
        karakter = scanner.next().charAt(0);
        while (isGeldigeOperator(karakter)) {
            if (karakter == 's' || karakter == 'S') {
                break;
            } else if (karakter == '+' || karakter == '-' || karakter == '*' || karakter == '/' || karakter == '%'){
                System.out.print("Eerste getal: ");
                double getal1 = scanner.nextDouble();

                System.out.print("Tweede getal: ");
                double getal2 = scanner.nextDouble();

                printBerekening(karakter, getal1, getal2);
            }
        }
    }

    public static boolean isGeldigeOperator(char karakter) {
        boolean karakterCheck;
        if (karakter == '+' || karakter == '-' || karakter == '*' || karakter == '/' || karakter == '%' || karakter == 'S' || karakter == 's') {
            karakterCheck = true;
        } else {
            karakterCheck = false;
        }

        return karakterCheck;
    }

    public static void printBerekening(char karakter, double getal1, double getal2) {
        double uitkomst = 0;

        if (karakter == '+') {
            uitkomst = getal1 + getal2;
        } else if (karakter == '-') {
            uitkomst = getal1 - getal2;
        } else if (karakter == '*') {
            uitkomst = getal1 * getal2;
        } else if (karakter == '/') {
            uitkomst = getal1 / getal2;
        } else if (karakter == '%') {
            uitkomst = getal1 % getal2;
        }

        System.out.println(getal1 + " " + karakter + " " + getal2 + " = " + uitkomst);
    }
}