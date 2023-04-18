package practicumopdracht.data;

import practicumopdracht.models.Customer;
import practicumopdracht.models.DiscordBot;

import java.util.ArrayList;
import java.util.List;

public abstract class DiscordBotDAO implements DAO<DiscordBot> {
    protected ArrayList<DiscordBot> discordBots;

    /**
     * Constructor of DAO. Creates empty list of Discord Bots.
     */
    public DiscordBotDAO() {
        discordBots = new ArrayList<>();
    }

    /**
     * Get all Discord Bots.
     *
     * @return — ArrayList of Discord Bots.
     */
    @Override
    public List<DiscordBot> getAll() {
        return discordBots;
    }

    /**
     * Adds the Discord Bot if it does not yet exist.
     * Update the Discord Bot if it exists already.
     *
     * @param discordBot — The Discord Bot to add or update.
     */
    @Override
    public void addOrUpdate(DiscordBot discordBot) {
        if (discordBots.contains(discordBot)) {
            return;
        }
        discordBots.add(discordBot);
    }

    /**
     * Remove a specific Discord Bot from the list.
     *
     * @param discordBot — The Discord Bot to remove.
     */
    @Override
    public void remove(DiscordBot discordBot) {
        discordBots.remove(discordBot);
    }

    /**
     * Get a specific Discord Bot by its ID in the list.
     *
     * @param id — The ID of the Discord Bot.
     * @return — The Discord Bot with a matching ID.
     */
    public DiscordBot getById(int id) {
        try {
            return discordBots.get(id);
        } catch (Exception exception) {
            return null;
        }
    }

    /**
     * Does not apply to Discord Bot.
     *
     * @return - null
     */
    @Override
    public int getIdFor(Customer model) {
        return -1;
    }

    /**
     * Gets a list of all Discord Bots that belong to a
     * specific Customer.
     *
     * @param model — The parent Customer.
     * @return — A list of all Discord Bots that belong to
     * the input Customer.
     */
    @Override
    public List<DiscordBot> getAllFor(Customer model) {
        List<DiscordBot> discordBotList = new ArrayList<>();
        for (DiscordBot discordBot : this.discordBots) {
            if (discordBot.getBelongsTo().equals(model)) {
                discordBotList.add(discordBot);
            }
        }
        return discordBotList;
    }
}
