package nl.hva.artiestenboeker;

import java.time.LocalDate;
import java.util.ArrayList;

public class Toneelgezelschap extends Artiest {
    private String naam;
    private int jaarOprichting;
    private ArrayList<Acteur> acteurs = new ArrayList<>();

    /**
     *
     * @param genre
     * @param naam
     * @param jaarOprichting
     */
    public Toneelgezelschap(String genre, String naam, int jaarOprichting) {
        super(genre);
        this.naam = naam;
        this.jaarOprichting = jaarOprichting;
    }

    public void voegActeurToe(Acteur acteur) {
        acteurs.add(acteur);
    }


    @Override
    public String krijgNaam() {
        return naam;
    }

    public int getJaarOprichting() {
        return jaarOprichting;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append(super.toString()).append(", oprichtingsjaar: ").append(jaarOprichting);
        sb.append("\n\tActeurs: ");
        for (Acteur acteur : acteurs) {
            sb.append(acteur).append(" ");
        }

        return sb.toString();
    }
}
