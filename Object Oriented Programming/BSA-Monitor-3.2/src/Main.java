import java.util.Scanner;
import java.util.stream.IntStream;

/**
 * BSA Monitor V3.2, nu met OOP.
 *
 * @author Stefan Kruik
 */
public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        final int STUDIEPUNTEN_MAX = 32;

        // Vakken aanmaken
        Vak[] vakken = new Vak[6];
        vakken[0] = new Vak("Fasten your Seatbelts", 12);
        vakken[1] = new Vak("Programming Java", 3);
        vakken[2] = new Vak("English", 2);
        vakken[3] = new Vak("Personal and Project skills", 12);
        vakken[4] = new Vak("User Interaction", 3);
        vakken[5] = new Vak("Wiskunde", 1);

        // Vak cijfers inlezen
        double[] vakCijfers = new double[6];
        System.out.println("Voer behaalde cijfers in.");
        for (int i = 0; i < vakken.length; i++) {
            System.out.print(vakken[i].getNaam() + ": ");
            double cijfer = scanner.nextDouble();
            vakken[i].setCijfer(cijfer);
        }

        // Vak resultaten printen
        System.out.println(" ");
        for (int i = 0; i < vakken.length; i++) {
            System.out.printf("Vak/Project: %-30s Cijfer: %-5.1f Behaalde punten: %d \n" , vakken[i].getNaam(), vakken[i].getCijfer(), vakken[i].gehaaldePunten());
        }

        // Conclusie
        int behaaldeStudiepunten = vakken[0].gehaaldePunten() + vakken[1].gehaaldePunten() + vakken[2].gehaaldePunten() + vakken[3].gehaaldePunten() + vakken[4].gehaaldePunten() + vakken[5].gehaaldePunten();
        System.out.println(" ");
        System.out.println("Totaal behaalde studiepunten: " + behaaldeStudiepunten + "/" + STUDIEPUNTEN_MAX);
        double totaalStudiepuntenMinimum = STUDIEPUNTEN_MAX / 6 * 5;

        if (behaaldeStudiepunten < totaalStudiepuntenMinimum) {
            System.out.println("PAS OP: je ligt op schema voor een negatief BSA!");
        } else {
            System.out.println("Je ligt op schema voor een positief BSA.");
        }
    }
}
