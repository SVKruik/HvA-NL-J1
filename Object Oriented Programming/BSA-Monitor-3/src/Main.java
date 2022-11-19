import java.util.Scanner;
/**
 * BSA Monitor V3, nu met OOP.
 *
 * @author Stefan Kruik
 */
public class Main {
    public static void main(String[] args) {
        Vak fys = new Vak("Fasten your Seatbelts", 12);

        Scanner scanner = new Scanner(System.in);
        System.out.print("Voer behaalde cijfer voor " + fys.naam + " in: ");
        double vakCijfer = scanner.nextDouble();

        fys.setCijfer(vakCijfer);

        System.out.println("Vak/Project: " + fys.getNaam() + "\t Cijfer: " + fys.getCijfer() + "\tPunten: " + fys.gehaaldePunten(vakCijfer));
    }
}
