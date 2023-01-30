package nl.hva.artiestenboeker;

public class Acteur {
    private String naam;
    private String land;

    public Acteur(String naam, String land) {
        this.naam = naam;
        this.land = land;
    }

    @Override
    public String toString() {
        return naam + " (" + land + ")";
    }
}
