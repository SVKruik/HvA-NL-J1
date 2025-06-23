import java.util.Scanner;
import java.util.stream.IntStream;

/**
 * Een opgevoerde versie van de eerste BSA monitor.
 * Voer je cijfers in, en hij berekent je behaalde studiepunten.
 * Checkt ook of je op deze manier overgaat.
 *
 * @author Stefan Kruik
 */
public class Main {

    public static boolean isGeldigCijfer(double vakCijfer) {
        boolean isGeldigCijfer;

        if (vakCijfer < 1 || vakCijfer > 10) {
            isGeldigCijfer = false;
        } else {
            isGeldigCijfer = true;
        }
        return isGeldigCijfer;
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        String[] vakNamen = {"FYS", "Programming", "UI", "Engels", "Wiskunde", "PPS"};
        int[] vakPunten = {12, 3, 3, 1, 2, 4};
        double[] vakCijfer = new double[6];

        System.out.println("Voer behaalde cijfers in:");
        int i;
        for (i = 0; i < vakCijfer.length; i++) {
            switch (i) {
                case 0 -> {
                    System.out.print("Fasten Your Seatbelts: ");
                    vakCijfer[0] = scanner.nextDouble();
                    while (!isGeldigCijfer(vakCijfer[0])) {
                        System.out.println("Ongeldig cijfer, probeer opnieuw.");
                        System.out.print("Fasten Your Seatbelts: ");
                        vakCijfer[0] = scanner.nextDouble();
                    }
                }
                case 1 -> {
                    System.out.print("Programming: ");
                    vakCijfer[1] = scanner.nextDouble();
                    while (!isGeldigCijfer(vakCijfer[1])) {
                        System.out.println("Ongeldig cijfer, probeer opnieuw.");
                        System.out.print("Programming: ");
                        vakCijfer[1] = scanner.nextDouble();
                    }
                }
                case 2 -> {
                    System.out.print("User Interaction: ");
                    vakCijfer[2] = scanner.nextDouble();
                    while (!isGeldigCijfer(vakCijfer[2])) {
                        System.out.println("Ongeldig cijfer, probeer opnieuw.");
                        System.out.print("User Interaction: ");
                        vakCijfer[2] = scanner.nextDouble();
                    }
                }
                case 3 -> {
                    System.out.print("Engels: ");
                    vakCijfer[3] = scanner.nextDouble();
                    while (!isGeldigCijfer(vakCijfer[3])) {
                        System.out.println("Ongeldig cijfer, probeer opnieuw.");
                        System.out.print("Engels: ");
                        vakCijfer[3] = scanner.nextDouble();
                    }
                }
                case 4 -> {
                    System.out.print("Wiskunde: ");
                    vakCijfer[4] = scanner.nextDouble();
                    while (!isGeldigCijfer(vakCijfer[4])) {
                        System.out.println("Ongeldig cijfer, probeer opnieuw.");
                        System.out.print("Wiskunde: ");
                        vakCijfer[4] = scanner.nextDouble();
                    }
                }
                case 5 -> {
                    System.out.print("PPS: ");
                    vakCijfer[5] = scanner.nextDouble();
                    while (!isGeldigCijfer(vakCijfer[5])) {
                        System.out.println("Ongeldig cijfer, probeer opnieuw.");
                        System.out.print("PPS: ");
                        vakCijfer[5] = scanner.nextDouble();
                    }
                }
                default -> System.out.println("Error");
            }
        }
        scanner.close();

        final double VOLDOENDE = 5.5;

        int fysBehaald = 0;
        int programmingBehaald = 0;
        int uiBehaald = 0;
        int engelsBehaald = 0;
        int wiskundeBehaald = 0;
        int ppsBehaald = 0;

        final int STUDIEPUNTEN_MAX = IntStream.of(vakPunten).sum();

        if (vakCijfer[0] < VOLDOENDE) {
            fysBehaald = 0;
        } else if (vakCijfer[0] >= VOLDOENDE) {
            fysBehaald = vakPunten[0];
        }

        if (vakCijfer[1] < VOLDOENDE) {
            programmingBehaald = 0;
        } else if (vakCijfer[1] >= VOLDOENDE) {
            programmingBehaald = vakPunten[1];
        }
        if (vakCijfer[2] < VOLDOENDE) {
            uiBehaald = 0;
        } else if (vakCijfer[2] >= VOLDOENDE) {
            uiBehaald = vakPunten[2];
        }

        if (vakCijfer[3] < VOLDOENDE) {
            engelsBehaald = 0;
        } else if (vakCijfer[3] >= VOLDOENDE) {
            engelsBehaald = vakPunten[3];
        }

        if (vakCijfer[4] < VOLDOENDE) {
            wiskundeBehaald = 0;
        } else if (vakCijfer[4] >= VOLDOENDE) {
            wiskundeBehaald = vakPunten[4];
        }

        if (vakCijfer[5] < VOLDOENDE) {
            ppsBehaald = 0;
        } else if (vakCijfer[5] >= VOLDOENDE) {
            ppsBehaald = vakPunten[5];
        }

        System.out.printf("""
                Vak/project: Fasten Your Seatbelts            Cijfer: %.1f     Behaalde punten: %d
                Vak/project: Programming                      Cijfer: %.1f     Behaalde punten: %d
                Vak/project: User Interaction                 Cijfer: %.1f     Behaalde punten: %d
                Vak/project: Engels                           Cijfer: %.1f     Behaalde punten: %d
                Vak/project: Wiskunde                         Cijfer: %.1f     Behaalde punten: %d
                Vak/project: Personal and Project Skills      Cijfer: %.1f     Behaalde punten: %d
                
                """, vakCijfer[0], fysBehaald, vakCijfer[1], programmingBehaald, vakCijfer[2], uiBehaald, vakCijfer[3], engelsBehaald, vakCijfer[4], wiskundeBehaald, vakCijfer[5], ppsBehaald);

        int behaaldeStudiepunten = fysBehaald + programmingBehaald + uiBehaald + engelsBehaald + wiskundeBehaald + ppsBehaald;

        System.out.println("Totaal behaalde studiepunten: " + behaaldeStudiepunten + "/" + STUDIEPUNTEN_MAX);
        double totaalStudiepuntenMinimum = STUDIEPUNTEN_MAX / 6 * 5;

        if (behaaldeStudiepunten < totaalStudiepuntenMinimum) {
            System.out.println("PAS OP: je ligt op schema voor een negatief BSA!");
        }
    }
}