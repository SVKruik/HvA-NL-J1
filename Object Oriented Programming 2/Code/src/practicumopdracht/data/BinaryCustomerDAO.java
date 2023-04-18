package practicumopdracht.data;

import practicumopdracht.models.Customer;

import java.io.*;
import java.time.LocalDate;
import java.util.NoSuchElementException;

public class BinaryCustomerDAO extends CustomerDAO {
    private final String FILENAME = "./src/practicumopdracht/customers.dat";

    /**
     * Write data to the target file.
     *
     * @return - Status boolean.
     */
    @Override
    public boolean save() {
        File file = new File(this.FILENAME);
        try (DataOutputStream output = new DataOutputStream(new FileOutputStream(file))) {
            output.writeInt(customers.size());
            for (Customer customer : customers) {
                output.writeUTF(customer.getName());
                output.writeUTF(customer.getProfileName());
                output.writeBoolean(customer.getVerified());
                output.writeUTF(customer.getLanguage());
                output.writeUTF(String.valueOf(customer.getCreatedOn()));
                output.writeUTF(customer.getDescription());
            }
            output.close();
            return true;
        } catch (FileNotFoundException exception) {
            System.err.println("Bestand is niet gevonden.");
        } catch (Exception exception) {
            System.err.println("Er ging iets fout tijdens het opslaan.");
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
        File file = new File("./src/practicumopdracht/customers.dat");
        try (DataInputStream input = new DataInputStream(new FileInputStream(file))) {
            customers.clear();
            int customerAmount = input.readInt();
            for (int i = 0; i < customerAmount; i++) {
                String name = input.readUTF();
                String profileName = input.readUTF();
                boolean verified = input.readBoolean();
                String language = input.readUTF();
                LocalDate createdOn = LocalDate.parse(input.readUTF());
                String description = input.readUTF();
                Customer customer = new Customer(name, profileName, verified, language, createdOn, description);
                customers.add(customer);
            }
            input.close();
            return true;
        } catch (NoSuchElementException | EOFException exception) {
            System.out.println("Bestand is nog leeg.");
        } catch (FileNotFoundException exception) {
            System.out.println("Bestand is niet gevonden.");
        } catch (Exception exception) {
            System.out.println("Er ging iets fout tijdens het laden.");
        }
        return false;
    }
}
