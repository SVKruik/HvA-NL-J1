import java.util.Scanner;

/**
 * Hello world test programma.
 * 
 * @author Stefan Kruik
 */
public class Main {
    public static void main(String[] args) {
        int random = (int) (Math.random() * 100);

        Scanner scanner = new Scanner(System.in);
        System.out.println("Wat is het nummer?");
        int poging = scanner.nextInt();

        for (int i = 10; i > 0; i--) {
            if (random != poging) {
                System.out.println("Dat is niet correct!");
                if (random < poging) {
                    System.out.println("Het getal is kleiner!");
                } else {
                    System.out.println("Het getal is groter!");
                }
                System.out.println("Nog " + i + " pogingen over.");
                poging = scanner.nextInt();
            }
        }

        System.out.println("Geen pogingen meer over.");

        scanner.close();
    }
}
