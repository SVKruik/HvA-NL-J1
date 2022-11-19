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
        System.out.println();
        double vakCijfer = scanner.nextDouble();

        fys.setCijfer(vakCijfer);

        System.out.println("Vak/Project: " + fys.getNaam() + ": " + fys.getCijfer() + "Punten: " + fys.getPunten());
    }
}
