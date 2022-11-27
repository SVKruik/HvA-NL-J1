import java.util.Scanner;
/**
 * BSA Monitor V3.2, nu met OOP.
 *
 * @author Stefan Kruik
 */
public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        Vak[] vakken = new Vak[6];

        vakken[0] = new Vak("Fasten your Seatbelts", 12);
        vakken[1] = new Vak("Programming Java", 3);
        vakken[2] = new Vak("English", 9);
        vakken[3] = new Vak("Personal and Project skills", 100);
        vakken[4] = new Vak("User Interaction", 1);
        vakken[5] = new Vak("Wiskunde", 1);

        double[] vakCijfers = new double[6];

        for (int i = 0; i < vakken.length; i++) {
            System.out.print("Voer behaalde cijfer voor " + vakken[i].getNaam() + " in: ");
            vakCijfers[i] = scanner.nextDouble();
        }

        System.out.println(" ");
        for (int i = 0; i < vakken.length; i++) {
            System.out.printf("Vak/Project: %-30s Cijfer: %-5.1f Behaalde punten: %d \n" , vakken[i].getNaam(), vakCijfers[i], vakken[i].gehaaldePunten(vakCijfers[i]));
        }
    }
}
