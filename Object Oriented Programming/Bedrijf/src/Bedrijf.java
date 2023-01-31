import java.util.ArrayList;
import java.util.Collections;

public class Bedrijf {
    private String naam;
    private ArrayList<Persoon> medewerkers = new ArrayList<>();

    public Bedrijf(String naam) {
        this.naam = naam;
    }

    public void printInkomsten() {
        Collections.sort(medewerkers);
        System.out.println("Inkomsten van alle personen:");
        for (Persoon persoon : medewerkers) {
            if (persoon instanceof Vrijwilliger) {
                System.out.printf("\t%s, bedankt voor uw inzet!", persoon.getNaam());
            } else {
                System.out.printf("\t%s, inkomsten: %.2f", persoon.getNaam(), persoon.berekenInkomsten());
            }
            System.out.println(" ");
        }
    }

    public int aantalManagers() {
        int aantalManagers = 0;
        for (Persoon persoon : medewerkers) {
            if (persoon instanceof Manager) {
                aantalManagers++;
            }
        }
        return aantalManagers;
    }

    public void neemInDienst(Persoon persoon) {
        medewerkers.add(persoon);
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("Bedrijf HvA heeft ").append(medewerkers.size()).append(" medewerks:");
        for (Persoon persoon: medewerkers) {
            sb.append("\n\t").append(persoon.getNaam());
        }
        sb.append("\n");

        return sb.toString();
    }
}
