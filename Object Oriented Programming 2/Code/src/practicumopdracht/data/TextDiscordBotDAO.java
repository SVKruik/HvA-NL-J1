package practicumopdracht.data;

import practicumopdracht.MainApplication;
import practicumopdracht.models.Customer;
import practicumopdracht.models.DiscordBot;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.PrintWriter;
import java.util.NoSuchElementException;
import java.util.Scanner;

public class TextDiscordBotDAO extends DiscordBotDAO {
    private final String FILENAME = "./src/practicumopdracht/discordBots.txt";
    DAO<Customer> customerDAO = MainApplication.getCustomerDAO();

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
            printWriter.println(discordBots.size());
            printWriter.println("");
            for (DiscordBot discordBot : discordBots) {
                if (customerDAO.getIdFor(discordBot.getBelongsTo()) != -1) {
                    printWriter.println(customerDAO.getIdFor(discordBot.getBelongsTo()));
                    printWriter.println(discordBot.getName());
                    printWriter.println(discordBot.getAccentColor());
                    printWriter.println(discordBot.getMemory());
                    printWriter.println(discordBot.getHost());
                    printWriter.println(discordBot.getHostingPriceHour());
                    printWriter.println(discordBot.getPort());
                    printWriter.println(discordBot.getAutoRestart());
                    printWriter.println(discordBot.getClientId());
                    printWriter.println("---");
                }
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
        File file = new File("./src/practicumopdracht/discordBots.txt");

        try (Scanner scanner = new Scanner(file)) {
            int discordBotAmount = scanner.nextInt();
            for (int i = 0; i < discordBotAmount; i++) {
                int belongsTo = scanner.nextInt();
                scanner.nextLine();
                String name = scanner.nextLine();
                String color = scanner.nextLine();
                int memory = scanner.nextInt();
                scanner.nextLine();
                String host = scanner.nextLine();
                double hostingPrice = scanner.nextDouble();
                int port = scanner.nextInt();
                boolean autoRestart = scanner.nextBoolean();
                int clientId = scanner.nextInt();
                scanner.nextLine();
                scanner.nextLine();

                Customer customer = MainApplication.getCustomerDAO().getById(belongsTo);
                DiscordBot discordBot = new DiscordBot(customer, name, color, clientId, host, hostingPrice, port, autoRestart, memory);
                discordBots.add(discordBot);
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