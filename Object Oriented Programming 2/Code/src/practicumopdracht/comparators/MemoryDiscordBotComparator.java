package practicumopdracht.comparators;

import practicumopdracht.models.DiscordBot;

import java.util.Comparator;

public class MemoryDiscordBotComparator implements Comparator<DiscordBot> {
    /**
     * Sorts the Discord Bots based on their memory amount, in descending order.
     *
     * @param o1 — the first object to be compared.
     * @param o2 — the second object to be compared.
     * @return — Compare value.
     */
    @Override
    public int compare(DiscordBot o1, DiscordBot o2) {
        if (o1.getMemory() != o2.getMemory()) {
            return Integer.compare(o1.getMemory(), o2.getMemory());
        } else {
            return o1.getName().compareTo(o2.getName());
        }
    }
}
