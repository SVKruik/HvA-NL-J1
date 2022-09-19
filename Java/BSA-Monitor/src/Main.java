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
        int fysStudiepuntenMax = 12;
        int programmingStudiepuntenMax = 3;
        int databasesStudiepuntenMax = 3;
        int ppsStudiepuntenMax = 4;
        int uiStudiepuntenMax = 3;
        int rcsStudiepuntenMax = 4;

        int totaalStudiepunten = fysStudiepuntenMax + programmingStudiepuntenMax + databasesStudiepuntenMax + ppsStudiepuntenMax + uiStudiepuntenMax + rcsStudiepuntenMax;

        double cijferOntoereikend = 5.5;
        
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


        if (fysCijfer < cijferOntoereikend) {
            System.out.println("Vak/project: Fasten Your Seatbelts " + "\t\t\tCijfer: " + fysCijfer + "\t\tBehaalde punten: 0");
            int fysBehaald = 0;
        } else if (fysCijfer >= cijferOntoereikend) {
            System.out.println("Vak/project: Fasten Your Seatbelts " + "\t\t\tCijfer: " + fysCijfer + "\t\tBehaalde punten: " + fysStudiepuntenMax);
            int fysBehaald = fysStudiepuntenMax;
        }

        if (programmingCijfer < cijferOntoereikend) {
            System.out.println("Vak/project: Programming " + "\t\t\t\tCijfer: " + programmingCijfer + "\t\tBehaalde punten: 0");
            int programmingBehaald = 0;
        } else if (programmingCijfer >= cijferOntoereikend) {
            System.out.println("Vak/project: Programming " + "\t\t\t\tCijfer: " + programmingCijfer + "\t\tBehaalde punten: " + programmingStudiepuntenMax);
            int programmingBehaald = programmingStudiepuntenMax;
        }

        if (databasesCijfer < cijferOntoereikend) {
            System.out.println("Vak/project: Databases " + "\t\t\t\t\tCijfer: " + databasesCijfer + "\t\tBehaalde punten: 0");
            int databasesBehaald = 0;
        } else if (databasesCijfer >= cijferOntoereikend) {
            System.out.println("Vak/project: Databases " + "\t\t\t\t\tCijfer: " + databasesCijfer + "\t\tBehaalde punten: " + databasesStudiepuntenMax);
            int databasesBehaald = databasesStudiepuntenMax;
        }

        if (ppsCijfer < cijferOntoereikend) {
            System.out.println("Vak/project: Personal and Project Skills " + "\t\tCijfer: " + ppsCijfer + "\t\tBehaalde punten: 0");
            int ppsBehaald = 0;
        } else if (ppsCijfer >= cijferOntoereikend) {
            System.out.println("Vak/project: Personal and Project Skills " + "\t\tCijfer: " + ppsCijfer + "\t\tBehaalde punten: " + ppsStudiepuntenMax);
            int ppsBehaald = ppsStudiepuntenMax;
        }

        if (uiCijfer < cijferOntoereikend) {
            System.out.println("Vak/project: User Interaction: " + "\t\t\t\tCijfer: " + uiCijfer + "\t\tBehaalde punten: 0");
            int uiBehaald = 0;
        } else if (uiCijfer >= cijferOntoereikend) {
            System.out.println("Vak/project: User Interaction: " + "\t\t\t\tCijfer: " + uiCijfer + "\t\tBehaalde punten: " + uiStudiepuntenMax);
            int uiBehaald = uiStudiepuntenMax;
        }

        if (rcsCijfer < cijferOntoereikend) {
            System.out.println("Vak/project: Research and Communication Skills " + "\t\tCijfer: " + rcsCijfer + "\t\tBehaalde punten: 0");
            int rcsBehaald = 0;
        } else if (rcsCijfer >= cijferOntoereikend) {
            System.out.println("Vak/project: Research and Communication Skills " + "\t\tCijfer: " + rcsCijfer + "\t\tBehaalde punten: " + rcsStudiepuntenMax);
            int rcsBehaald = rcsStudiepuntenMax;
        }

        double behaaldeStudiepunten = 0;
        
        System.out.println("Totaal behaalde studiepunten: " + behaaldeStudiepunten + "/" + totaalStudiepunten);

        double totaalStudiepuntenMinimum = totaalStudiepunten * (5/6);

        if (behaaldeStudiepunten < totaalStudiepuntenMinimum) {
            System.out.println("PAS OP: je ligt op schema voor een negatief BSA!");
        }


        scanner.close();
    }
}