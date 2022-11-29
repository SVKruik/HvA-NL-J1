import java.util.Scanner;

/**
 * Auto
 * @author Stefan Kruik
 */

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.print("Hoeveel cylinders heeft de motor? ");
        int cylinder = scanner.nextInt();

        System.out.print("Hoeveel PK heeft de motor? ");
        int pk = scanner.nextInt();

        Motor motor = new Motor(cylinder, pk);

        // Veranderen naar 8 cylinders
        motor.setCyclinders(8);

        System.out.println(motor.getCyclinders());

        // Auto
        Auto auto = new Auto("BWM", 4, motor);
        System.out.println(" ");
        auto.printAutoEigenschappen();
    }
}