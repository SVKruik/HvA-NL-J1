package practicumopdracht.data;

import practicumopdracht.MainApplication;
import practicumopdracht.models.Customer;
import practicumopdracht.models.DiscordBot;

import java.io.*;
import java.util.NoSuchElementException;

public class ObjectDiscordBotDAO extends DiscordBotDAO {
    private final String FILENAME = "./src/practicumopdracht/discordBots.obj";

    /**
     * Write data to the target file.
     *
     * @return - Status boolean.
     */
    @Override
    public boolean save() {
        File file = new File(this.FILENAME);
        try (ObjectOutputStream output = new ObjectOutputStream(new FileOutputStream(file))) {
            output.writeInt(discordBots.size());
            for (DiscordBot discordBot : discordBots) {
                output.writeObject(discordBot);
                output.writeInt(MainApplication.getCustomerDAO().getIdFor(discordBot.getBelongsTo()));
            }
            output.close();
            return true;
        } catch (FileNotFoundException exception) {
            System.err.println("Bestand is niet gevonden.");
        } catch (Exception exception) {
            System.err.println("Er ging iets fout tijdens het opslaan.");
            exception.printStackTrace();
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
        try (ObjectInputStream input = new ObjectInputStream(new FileInputStream(file))) {
            discordBots.clear();
            int discordBotAmount = input.readInt();
            for (int i = 0; i < discordBotAmount; i++) {
                DiscordBot inputBot = (DiscordBot) input.readObject();
                Customer inputCustomer = MainApplication.getCustomerDAO().getById(input.readInt());
                inputBot.setBelongsTo(inputCustomer);
                discordBots.add(inputBot);
            }
            input.close();
            return true;
        } catch (NoSuchElementException | EOFException exception) {
            System.out.println("Bestand is nog leeg.");
        } catch (FileNotFoundException exception) {
            System.out.println("Bestand is niet gevonden.");
        } catch (Exception exception) {
            System.out.println("Er ging iets fout tijdens het laden.");
            exception.printStackTrace();
        }
        return false;
    }
}
