package practicumopdracht.data;

import practicumopdracht.models.Customer;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.PrintWriter;
import java.time.LocalDate;
import java.util.NoSuchElementException;
import java.util.Scanner;

public class TextCustomerDAO extends CustomerDAO {
    private final String FILENAME = "./src/practicumopdracht/customers.txt";

    /**
     * Write data to the target file.
     *
     * @return - Status boolean.
     */
    @Override
    public boolean save() {
        File file = new File(this.FILENAME);
        PrintWriter printWriter = null;
        try {
            printWriter = new PrintWriter(file);
            printWriter.println(customers.size());
            printWriter.println("");

            for (Customer customer : customers) {
                printWriter.println(customer.getName());
                printWriter.println(customer.getProfileName());
                printWriter.println(customer.getVerified());
                printWriter.println(customer.getLanguage());
                printWriter.println(customer.getCreatedOn());
                printWriter.println(customer.getDescription());
                printWriter.println("---");
            }
            return true;
        } catch (FileNotFoundException exception) {
            System.err.println("Bestand is niet gevonden.");
        } catch (Exception exception) {
            System.err.println("Er ging iets fout tijdens het opslaan.");
        } finally {
            assert printWriter != null;
            printWriter.close();
        }
        return false;
    }

    /**
     * Load data from the target file.
     *
     * @return - Status boolean.
     */
    @Override
    public boolean load() {
        File file = new File(this.FILENAME);
        try (Scanner scanner = new Scanner(file)) {
            int customerAmount = scanner.nextInt();
            scanner.nextLine();
            scanner.nextLine();
            customers.clear();
            for (int i = 0; i < customerAmount; i++) {
                String name = scanner.nextLine();
                String profileName = scanner.nextLine();
                boolean verified = Boolean.parseBoolean(scanner.nextLine());
                String language = scanner.nextLine();
                LocalDate createdOn = LocalDate.parse(scanner.nextLine());
                String description = scanner.nextLine();
                scanner.nextLine();
                Customer customer = new Customer(name, profileName, verified, language, createdOn, description);
                customers.add(customer);
            }
            return true;
        } catch (NoSuchElementException exception) {
            System.out.println("Bestand is nog leeg.");
        } catch (FileNotFoundException exception) {
            System.out.println("Bestand is niet gevonden.");
        } catch (Exception exception) {
            System.out.println("Er ging iets fout tijdens het laden.");
        }
        return false;
    }
}
