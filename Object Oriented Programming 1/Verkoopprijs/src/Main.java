/* Dit programma print berekent de verkoopprijs exlcusief en inclusief BTW, met eigen input van de console.
*
* @author Stefan Kruik
*/

import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.println("Inkoopprijs:");
        double inkoopPrijs = scanner.nextDouble();

        System.out.println("Winstmarge (in %):");
        int winstMarge = scanner.nextInt();
        double winstMargeFactor = (winstMarge / 100.0) + 1;

        System.out.println(winstMargeFactor);
        double verkoopprijsEx = inkoopPrijs * winstMargeFactor;

        double verkoopprijsInc6 = verkoopprijsEx * 1.06;
        double verkoopprijsInc21 = verkoopprijsEx * 1.21;

        System.out.println("Verkoopprijs exclusief BTW: " + verkoopprijsEx);
        System.out.println("Verkoopprijs inclusief 6% BTW: " + verkoopprijsInc6);
        System.out.println("Verkoopprijs inclusief 21% BTW: " + verkoopprijsInc21);
        scanner.close();

    }
}