public class Vak {
    private String naam;
    private int punten;
    private double cijfer;

    final double VOLDOENDE = 5.5;

    /**
     * Kopiëren van waardes naar dit bestand.
     * @param nieuweNaam - naam
     * @param nieuwePunten - punten
     */

    Vak(String nieuweNaam, int nieuwePunten) {
        this.naam = nieuweNaam;
        this.punten = nieuwePunten;
    }

    String getNaam(){
        return naam;
    }

    int getPunten(){
        if (this.cijfer < VOLDOENDE) {
            return punten = 0;
        } else {
            return punten;
        }
    }

    double getCijfer() {
        return cijfer;
    }

    void setCijfer(double cijfer) {
        this.cijfer = cijfer;
    }
}
