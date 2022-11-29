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

        // Vak punten aanmaken
        int[] punten = new int[6];
        punten[0] = 12;
        punten[1] = 3;
        punten[2] = 2;
        punten[3] = 12;
        punten[4] = 2;
        punten[5] = 1;
        final int STUDIEPUNTEN_MAX = IntStream.of(punten).sum();

        // Vakken aanmaken
        Vak[] vakken = new Vak[6];
        vakken[0] = new Vak("Fasten your Seatbelts", punten[0]);
        vakken[1] = new Vak("Programming Java", punten[1]);
        vakken[2] = new Vak("English", punten[2]);
        vakken[3] = new Vak("Personal and Project skills", punten[3]);
        vakken[4] = new Vak("User Interaction", punten[4]);
        vakken[5] = new Vak("Wiskunde", punten[5]);

        // Vak cijfers inlezen
        double[] vakCijfers = new double[6];
        System.out.println("Voer behaalde cijfers in.");
        for (int i = 0; i < vakken.length; i++) {
            System.out.print(vakken[i].getNaam() + ": ");
            vakCijfers[i] = scanner.nextDouble();
        }

        // Vak resultaten printen
        System.out.println(" ");
        for (int i = 0; i < vakken.length; i++) {
            System.out.printf("Vak/Project: %-30s Cijfer: %-5.1f Behaalde punten: %d \n" , vakken[i].getNaam(), vakCijfers[i], vakken[i].getPunten());
        }

        // Conclusie
        int behaaldeStudiepunten = vakken[0].getPunten() + vakken[1].getPunten() + vakken[2].getPunten() + vakken[3].getPunten() + vakken[4].getPunten() + vakken[5].getPunten();
        System.out.println(" ");
        System.out.println("Totaal behaalde studiepunten: " + behaaldeStudiepunten + "/" + STUDIEPUNTEN_MAX);
        double totaalStudiepuntenMinimum = STUDIEPUNTEN_MAX / 6 * 5;

        if (behaaldeStudiepunten < totaalStudiepuntenMinimum) {
            System.out.println("PAS OP: je ligt op schema voor een negatief BSA!");
        }
    }
}
