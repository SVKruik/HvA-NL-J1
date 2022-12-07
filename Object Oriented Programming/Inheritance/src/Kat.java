public class Kat extends Huisdier {
    private int aantalLevens;

    Kat(String naam, int aantalLevens) {
        super(naam);
        this.aantalLevens = aantalLevens;
    }

    @Override
    public void maakGeluid() {
        System.out.println("Kat houd nog even zijn bek.");
    }
}
