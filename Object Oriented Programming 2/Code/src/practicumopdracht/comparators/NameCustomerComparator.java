package practicumopdracht.comparators;

import practicumopdracht.models.Customer;

import java.util.Comparator;

public class NameCustomerComparator implements Comparator<Customer> {
    /**
     * Sorts the Customers based on their name, in descending order.
     *
     * @param o1 — the first object to be compared.
     * @param o2 — the second object to be compared.
     * @return — Compare value.
     */
    @Override
    public int compare(Customer o1, Customer o2) {
        return o1.getProfileName().compareTo(o2.getProfileName());
    }
}
