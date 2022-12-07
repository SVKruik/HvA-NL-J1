public class Hulk extends Superheld {
    private int aggressieGraad;

    Hulk(int leeftijd, int aggressieGraad) {
        super(leeftijd);
        this.aggressieGraad = aggressieGraad;
    }

    /**
     * Kalmeer en wordt weer normale groote
     * @return - return of de Hulk kalmeert.
     */
    public boolean kalmeer() {
        return kalmeer();
    }

    @Override
    public void gebruikerSuperKracht() {
        System.out.println("Hulk Gebruikt Super Kracht");
    }
}
