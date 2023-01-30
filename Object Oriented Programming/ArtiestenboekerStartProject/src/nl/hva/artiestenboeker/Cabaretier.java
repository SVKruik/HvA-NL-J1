package nl.hva.artiestenboeker;

import java.time.LocalDate;
import java.util.Objects;

public class Cabaretier extends Artiest {
    private String voornaam;
    private String achternaam;
    private String artiestennaam;
    private LocalDate geboortedatum;

    public Cabaretier(String genre, String voornaam, String achternaam, String artiestennaam, LocalDate geboortedatum) {
        super(genre);

        this.voornaam = voornaam;
        this.achternaam = achternaam;
        this.artiestennaam = artiestennaam;
        this.geboortedatum = geboortedatum;
    }

    public Cabaretier(String genre, String voornaam, String achternaam, LocalDate geboortedatum) {
        super(genre);

        this.voornaam = voornaam;
        this.achternaam = achternaam;
        this.geboortedatum = geboortedatum;
    }

    @Override
    public String krijgNaam() {
        if (artiestennaam == "" || artiestennaam == " ") {
            return voornaam + " " + achternaam;
        } else {
            return achternaam;
        }
    }

    @Override
    public String toString() {
        return super.toString() + ", geboortedatum: " + geboortedatum;
    }
}
