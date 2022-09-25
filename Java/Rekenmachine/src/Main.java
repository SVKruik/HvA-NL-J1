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
        System.out.println("Operator (S = stoppen): ");
        char karakter = scanner.next().charAt(0);

        boolean karakterCheck = isGeldigeOperator(karakter);
        double printBerkening = printBerkening(uitkomst);

        while (karakterCheck == false) {
            System.out.println("Operator is ongeldig.");
            karakter = scanner.next().charAt(0);
            karakterCheck = isGeldigeOperator(karakter);
        }
        scanner.close();

        System.out.println(getal1 + operator + getal2 + " = " + uitkomst);
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

    public static double printBerkening(char karakter, double getal1, double getal2) {
        Scanner scanner = new Scanner(System.in);
        System.out.println("Eerste getal: ");
        getal1 = scanner.nextDouble();

        System.out.println("Tweede getal: ");
        getal2 = scanner.nextDouble();
        scanner.close();

        
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
        } else if (karakter == 'S' || karakter == 's') {
            
        }
        return uitkomst;
    }
}