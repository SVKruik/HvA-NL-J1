import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.println("Valuta (1 = US dollar, 2 = GB pounds, 3 = Yen):");
        int valutaNummer = scanner.nextInt();
        System.out.println("In te wisselen bedrag (alleen gehele getallen):");
        int valutaHoeveelheid = scanner.nextInt();

        String valutaNaam = "Valuta";
        double koers = 0.0;



        if(valutaNummer == 1) {
            valutaNaam = "US dollar";
            koers = 1.0151;
        } else if (valutaNummer == 2) {
            valutaNaam = "GB pounds";
            koers = 1.1430;
        } else if (valutaNummer == 3) {
            valutaNaam = "Yen";
            koers = 0.00698;
        } else {
            System.out.println("Ongeldige valuta.");
        }

        double euroHoeveelheidOnafgerond = valutaHoeveelheid * koers;
        double euroHoeveelheid = Math.round(euroHoeveelheidOnafgerond * 100.0) / 100.0;
        double transactieKosten = euroHoeveelheid * 0.015;

        if (transactieKosten < 2) {
            transactieKosten = 2;
        } else if (transactieKosten > 15) {
            transactieKosten = 15;
        }

        double totaalOntvangen = euroHoeveelheid - transactieKosten;

        System.out.println("Voor " + valutaHoeveelheid + " " + valutaNaam + " krijgt u " + euroHoeveelheid + " Euro.");
        System.out.println("De transactiekosten bedragen " + transactieKosten + " Euro.");
        System.out.println("U ontvangt " + totaalOntvangen + " Euro.");
    }
}