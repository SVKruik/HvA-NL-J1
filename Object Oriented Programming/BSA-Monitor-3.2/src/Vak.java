public class Vak {
    private String naam;
    private int punten;
    private double cijfer;

    final double VOLDOENDE = 5.5;

    /**
     * Kopiëren van waardes naar dit bestand.
     * @param nieuweNaam
     * @param nieuwePunten
     */

    Vak(String nieuweNaam, int nieuwePunten) {
        this.naam = nieuweNaam;
        this.punten = nieuwePunten;
    }

    String getNaam(){
        return naam;
    }

    int getPunten(){
        return punten;
    }

    double getCijfer() {
        return cijfer;
    }

    void setCijfer(double cijfer) {
        this.cijfer = cijfer;
    }

    /**
     * Checkt of het cijfer toerijkend is voor punten.
     * @param cijfer - Vul het cijfer in
     * @return - Geeft behaalde punten terug
     */
    int gehaaldePunten(double cijfer){
        if (this.cijfer < VOLDOENDE) {
            return punten = 0;
        } else {
            return punten;
        }
    }
}
