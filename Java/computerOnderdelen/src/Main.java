/*
 * Deze applicatie berekent de verkoopprijs en -kosten.
 * Daarna geeft hij het totaal aan wat je zou kunnen verdienen,
 * indien jouw product daadwerkelijk gekocht wordt.
 *
 * @author Stefan Kruik
 */

import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        System.out.println("Dit programma is gemaakt door Stefan Kruik, IS110, 500895667");
        System.out.println(" ");
        Scanner scanner = new Scanner(System.in);

        System.out.print("Hoeveel computeronderdelen wil je verkopen? ");
        int verkoopAantal = scanner.nextInt();

        while (verkoopAantal < 1 || verkoopAantal > 25) {
            System.out.print("\tAantal onderdelen moet tussen de 1 en 25 liggen!\n");
            System.out.print("Hoeveel computeronderdelen wil je verkopen? ");
            verkoopAantal = scanner.nextInt();
        }
        System.out.println(" ");

        String[] artikelOmschrijving = new String[verkoopAantal];
        double[] artikelPrijs = new double[verkoopAantal];

        System.out.println("Geef per onderdeel de omschrijving: ");
        for (int i = 0; i < verkoopAantal; i++) {
            int iPlus = i + 1;
                System.out.print("\t" + iPlus + ": ");
            artikelOmschrijving[i] = scanner.next();
        }

        System.out.println(" ");
        System.out.println("Geef voor elk onderdeel de verkoopprijs: ");
        for (int i = 0; i < verkoopAantal; i++) {
            System.out.print("Prijs " + artikelOmschrijving[i] + ": ");
            artikelPrijs[i] = scanner.nextDouble();
        }
        scanner.close();
        System.out.println(" ");

        double totaalPrijs = berekenTotaalprijs(artikelPrijs);
        System.out.println("De totaalprijs van alle onderdelen bedraagt: " + totaalPrijs);
        double verkoopKosten = berekenVerkoopkosten(totaalPrijs);
        System.out.println("Hierover betaalt u aan verkoopkosten: " + verkoopKosten);
        double grandTotaal = totaalPrijs - verkoopKosten;
        System.out.println("Indien alle onderdelen worden verkocht, ontvangt u: " + grandTotaal);

        System.out.println(" ");
        System.out.println("Lijst van onderdelen: ");

        for (int i = 0; i < verkoopAantal; i++) {
            System.out.printf("%s                              %f", artikelOmschrijving[i], Math.round(artikelPrijs[i] * 100) / 100.0);
            System.out.println(" ");
        }
    }

    public static double berekenTotaalprijs(double[] prijzen) {
        double totaal = 0;
        for (int i = 0; i < prijzen.length; i++) {
            totaal += prijzen[i];
        }
        return totaal;
    }

    public static int berekenVerkoopkosten(double totaalprijs) {
        final double VERKOOPKOSTEN_FACTOR = 0.05;
        final int VERKOOPKOSTEN_MINIMUM = 3;

        int verkoopkosten = (int) Math.round(totaalprijs * VERKOOPKOSTEN_FACTOR);

        if (verkoopkosten < VERKOOPKOSTEN_MINIMUM) {
            verkoopkosten = VERKOOPKOSTEN_MINIMUM;
        }

        return verkoopkosten;
    }
}