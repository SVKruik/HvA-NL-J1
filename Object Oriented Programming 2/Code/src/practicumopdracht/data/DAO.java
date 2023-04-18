package practicumopdracht.data;

import practicumopdracht.models.Customer;
import practicumopdracht.models.DiscordBot;

import java.util.List;

public interface DAO<T> {
    List<T> getAll();

    void addOrUpdate(T model);

    void remove(T model);

    T getById(int id);

    int getIdFor(Customer model);

    List<DiscordBot> getAllFor(Customer model);

    boolean load();

    boolean save();
}
