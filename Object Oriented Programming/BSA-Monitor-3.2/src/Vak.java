public class Vak {
    private String naam;
    private int punten;
    private double cijfer;

    final double ONVOLDOENDE = 5.4;

    /**
     * Kopiëren van waardes naar dit bestand.
     * @param nieuweNaam - naam
     * @param nieuwePunten - punten
     */
    public Vak(String nieuweNaam, int nieuwePunten) {
        this.naam = nieuweNaam;
        this.punten = nieuwePunten;
    }

    String getNaam(){
        return naam;
    }

    int getPunten() {
        return punten;
    }

    double getCijfer() {
        return cijfer;
    }

    void setCijfer(double cijfer) {
        this.cijfer = cijfer;
    }

    /**
     * Check of je punten gehaald hebt voor het vak.
     * @return - de hoeveelheid punten die je krijgt.
     */
    int gehaaldePunten(){
        int gehaaldePunten;
        if (this.cijfer > ONVOLDOENDE) {
            gehaaldePunten = getPunten();
        } else {
            gehaaldePunten = 0;
        }
        return gehaaldePunten;
    }
}
