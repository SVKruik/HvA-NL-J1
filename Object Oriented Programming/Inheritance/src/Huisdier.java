/**
 * Parent class huisdier met gedeeld gedrag en eigenschappen
 */
public class Huisdier {
    private String naam;

    /**
     * Maken van huisdier
     * @param naam
     */
    Huisdier(String naam) {
        this.naam = naam;
    };

    /**
     * Maak een geluid.
     */
    public void maakGeluid() {
        System.out.println("Maakt nog even geen geluid.");
    }
}
