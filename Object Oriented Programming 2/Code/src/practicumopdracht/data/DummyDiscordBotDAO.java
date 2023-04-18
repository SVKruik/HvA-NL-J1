package practicumopdracht.data;

import practicumopdracht.MainApplication;
import practicumopdracht.models.Customer;
import practicumopdracht.models.DiscordBot;

import java.util.Random;

public class DummyDiscordBotDAO extends DiscordBotDAO {
    private final DAO<Customer> customerDAO = MainApplication.getCustomerDAO();

    /**
     * Create and append test Discord Bots.
     *
     * @return - Status boolean.
     */
    @Override
    public boolean load() {
        Random random = new Random();
        DiscordBot discordBot1 = new DiscordBot(customerDAO.getAll().get(0), "Luscinia", "#680303", random.nextInt(999999), "DisCloud", 0.38, 3000, true, 400);
        DiscordBot discordBot2 = new DiscordBot(customerDAO.getAll().get(1), "Falco", "#ECC85D", random.nextInt(999999), "Digital Ocean", 0.45, 3000, true, 550);
        DiscordBot discordBot3 = new DiscordBot(customerDAO.getAll().get(2), "Alcedo", "#8CA989", random.nextInt(999999), "Linode", 0.64, 3000, true, 800);
        addOrUpdate(discordBot1);
        addOrUpdate(discordBot2);
        addOrUpdate(discordBot3);
        return true;
    }

    /**
     * Does not apply to dummy.
     *
     * @return - Status boolean.
     */
    @Override
    public boolean save() {
        return false;
    }
}
