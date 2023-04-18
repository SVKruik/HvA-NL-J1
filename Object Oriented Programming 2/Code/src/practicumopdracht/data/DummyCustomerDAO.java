package practicumopdracht.data;

import practicumopdracht.models.Customer;

import java.time.LocalDate;

public class DummyCustomerDAO extends CustomerDAO {
    /**
     * Create and append test Customers.
     *
     * @return - Status boolean.
     */
    @Override
    public boolean load() {
        Customer customer1 = new Customer("Stefan Kruik", "Profiel 1", true, "Nederlands", LocalDate.now(), "Dummy Beschrijving.");
        Customer customer2 = new Customer("Test Data1", "Profiel 2", true, "English", LocalDate.now(), "Dummy Description.");
        Customer customer3 = new Customer("Test Data2", "Profiel 3", true, "Deutsch", LocalDate.now(), "Dummy Beschreibung.");
        addOrUpdate(customer1);
        addOrUpdate(customer2);
        addOrUpdate(customer3);
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
