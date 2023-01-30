package nl.hva.artiestenboeker;

import java.time.LocalDate;
import java.util.ArrayList;

public abstract class Artiest implements Comparable<Artiest> {
    private String genre;
    private ArrayList<LocalDate> boekingen = new ArrayList<>();

    public Artiest(String genre) {
        this.genre = genre;
    }

    public int krijgAantalBoekingen() {
        return this.boekingen.size();
    }

    public abstract String krijgNaam();

    @Override
    public String toString() {
        return krijgNaam() + "(" + genre + "), aantal boekingen: " + krijgAantalBoekingen();
    }

    @Override
    public int compareTo(Artiest andereArtiest) {
        return this.genre.compareTo(andereArtiest.genre);
    }

    public static void boekArtiest(String artiestnaam, LocalDate datum) {
        
    }
}