import java.util.Scanner;

/**
 * Dit programma is een rekenmachine. Geef de karakter en je getallen aan,
 * en hij berekent de uitkomst.
 *
 * @author Stefan Kruik
 */

public class Main {
    static boolean isGeldigeOperator(char karakter) {
        boolean karakterCheck;
        if (karakter != '+' && karakter != '-' && karakter != '*' && karakter != '/' && karakter != '%' && karakter != 'S' && karakter != 's') {
            karakterCheck = false;
        } else {
            karakterCheck = true;
        }

        while (karakterCheck == false) {
            System.out.println("Operator is ongeldig.");
        }
        return karakterCheck;
    }

    static void printBerekening(char operator, double getal1, double getal2) {
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
        } else if (operator == 'S' || operator == 's') {
            
        }   
        System.out.println(getal1 + " " + operator  + " " + getal2 + " = " + uitkomst);
    }
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        System.out.println("Operator (S = stoppen): ");
        char operator = scanner.next().charAt(0);

        System.out.println("Eerste getal: ");
        double getal1 = scanner.nextDouble();

        System.out.println("Tweede getal: ");
        double getal2 = scanner.nextDouble();
        scanner.close();

        printBerekening(operator, getal1, getal2);
    }
}