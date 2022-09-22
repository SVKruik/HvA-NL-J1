import java.util.Scanner;

/**
 * Dit programma berekent je behaalde studiepunten aan het einde van het jaar.
 * Voer je behaalde cijfers in, en check hoeveel studiepunten je hebt gehaald.
 *
 * @author Stefan Kruik
 */
public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        final int FYS_STUDIEPUNTEN_MAX = 12;
        final int PROGRAMMING_STUDIEPUNTEN_MAX = 3;
        final int DATABASES_STUDIEPUNTEN_MAX = 3;
        final int PPS_STUDIEPUNTEN_MAX = 4;
        final int UI_STUDIEPUNTEN_MAX = 3;
        final int RCS_STUDIEPUNTEN_MAX = 4;

        final double VOLDOENDE = 5.5;

        int fysBehaald = 0;
        int programmingBehaald = 0;
        int databasesBehaald = 0;
        int ppsBehaald = 0;
        int uiBehaald = 0;
        int rcsBehaald = 0;

        final int TOTAAL_STUDIEPUNTEN = FYS_STUDIEPUNTEN_MAX + PROGRAMMING_STUDIEPUNTEN_MAX + DATABASES_STUDIEPUNTEN_MAX + PPS_STUDIEPUNTEN_MAX + UI_STUDIEPUNTEN_MAX + RCS_STUDIEPUNTEN_MAX;

        System.out.println("Voer behaalde cijfers in, gebruik comma voor decimalen.");

        System.out.println("Fasten Your Seatbelts:");
        double fysCijfer = scanner.nextDouble();

        System.out.println("Programming:");
        double programmingCijfer = scanner.nextDouble();

        System.out.println("Databases:");
        double databasesCijfer = scanner.nextDouble();

        System.out.println("Personal & Project Skills:");
        double ppsCijfer = scanner.nextDouble();

        System.out.println("User Interaction:");
        double uiCijfer = scanner.nextDouble();

        System.out.println("Research and Communication Skills:");
        double rcsCijfer = scanner.nextDouble();

        if (fysCijfer < VOLDOENDE) {
            fysBehaald = 0;
        } else if (fysCijfer >= VOLDOENDE) {
            fysBehaald = FYS_STUDIEPUNTEN_MAX;
        }

        if (programmingCijfer < VOLDOENDE) {
            programmingBehaald = 0;
        } else if (programmingCijfer >= VOLDOENDE) {
            programmingBehaald = PROGRAMMING_STUDIEPUNTEN_MAX;
        }

        if (databasesCijfer < VOLDOENDE) {
            databasesBehaald = 0;
        } else if (databasesCijfer >= VOLDOENDE) {
            databasesBehaald = DATABASES_STUDIEPUNTEN_MAX;
        }

        if (ppsCijfer < VOLDOENDE) {
            ppsBehaald = 0;
        } else if (ppsCijfer >= VOLDOENDE) {
            ppsBehaald = PPS_STUDIEPUNTEN_MAX;
        }

        if (uiCijfer < VOLDOENDE) {
            uiBehaald = 0;
        } else if (uiCijfer >= VOLDOENDE) {
            uiBehaald = UI_STUDIEPUNTEN_MAX;
        }
        if (rcsCijfer < VOLDOENDE) {
            rcsBehaald = 0;
        } else if (rcsCijfer >= VOLDOENDE) {
            rcsBehaald = RCS_STUDIEPUNTEN_MAX;
        }

        System.out.println("Vak/project: Fasten Your Seatbelts " + "\t\t\tCijfer: " + fysCijfer + "\t\tBehaalde punten: " + fysBehaald);
        System.out.println("Vak/project: Programming " + "\t\t\t\tCijfer: " + programmingCijfer + "\t\tBehaalde punten: " + programmingBehaald);
        System.out.println("Vak/project: Databases " + "\t\t\t\t\tCijfer: " + databasesCijfer + "\t\tBehaalde punten: " + databasesBehaald);
        System.out.println("Vak/project: Personal and Project Skills " + "\t\tCijfer: " + ppsCijfer + "\t\tBehaalde punten: " + ppsBehaald);
        System.out.println("Vak/project: User Interaction: " + "\t\t\t\tCijfer: " + uiCijfer + "\t\tBehaalde punten: " + uiBehaald);
        System.out.println("Vak/project: Research and Communication Skills " + "\t\tCijfer: " + rcsCijfer + "\t\tBehaalde punten: " + rcsBehaald);

        int behaaldeStudiepunten = fysBehaald + programmingBehaald + databasesBehaald + ppsBehaald + uiBehaald + rcsBehaald;
                
        System.out.println("Totaal behaalde studiepunten: " + behaaldeStudiepunten + "/" + TOTAAL_STUDIEPUNTEN);
        
        double totaalStudiepuntenMinimum = TOTAAL_STUDIEPUNTEN / 6 * 5;
                
        if (behaaldeStudiepunten < totaalStudiepuntenMinimum) {
            System.out.println("PAS OP: je ligt op schema voor een negatief BSA!");
        }


        scanner.close();
    }
}

        