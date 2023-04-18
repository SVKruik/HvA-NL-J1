package practicumopdracht.data;

import practicumopdracht.models.Customer;
import practicumopdracht.models.DiscordBot;

import java.util.ArrayList;
import java.util.List;

public abstract class CustomerDAO implements DAO<Customer> {
    protected ArrayList<Customer> customers;

    /**
     * Constructor of DAO. Creates empty list of Customers.
     */
    public CustomerDAO() {
        customers = new ArrayList<>();
    }

    /**
     * Get all Customers.
     *
     * @return — ArrayList of Customers.
     */
    @Override
    public List<Customer> getAll() {
        return customers;
    }

    /**
     * Adds the Customer if it does not yet exist.
     * Update the Customer if it exists already.
     *
     * @param customer — The Customer to add or update.
     */
    @Override
    public void addOrUpdate(Customer customer) {
        if (customers.contains(customer)) {
            return;
        }
        customers.add(customer);
    }

    /**
     * Remove a specific Customer from the list.
     *
     * @param customer — The Customer to remove.
     */
    @Override
    public void remove(Customer customer) {
        customers.remove(customer);
    }

    /**
     * Get a specific Customer by its ID in the list.
     *
     * @param id — The ID of the Customer.
     * @return — The Customer with a matching ID.
     */
    @Override
    public Customer getById(int id) {
        try {
            return customers.get(id);
        } catch (Exception exception) {
            return null;
        }
    }

    /**
     * Get the ID of a specific Customer
     *
     * @param inputCustomer — The Customer to get the ID for.
     * @return — The ID of the Customer in the list.
     */
    public int getIdFor(Customer inputCustomer) {
        return customers.indexOf(inputCustomer);
    }

    /**
     * Does not apply to Customer.
     *
     * @param model - null
     * @return - null
     */
    @Override
    public List<DiscordBot> getAllFor(Customer model) {
        return null;
    }
}
