public abstract class Persoon implements Comparable<Persoon> {
    private String naam;

    public Persoon(String naam) {
        this.naam = naam;
    }

    public abstract double berekenInkomsten();

    @Override
    public int compareTo(Persoon persoon) {
        return this.naam.compareTo(persoon.naam);
    }

    public String getNaam() {
        return naam;
    }

    @Override
    public String toString() {
        return super.toString();
    }
}
