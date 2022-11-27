/**
 * @author Stefan Kruik
 * Deze klasse is een ontwerp voor een kopje zijn eigenscahppen en gedrag.
 */

public class Kopje {
    // Attributen - Eigenschappen
    private double inhoud;
    private String materiaal;
    private String kleur;

    public static final int MAX_INHOUD = 500;
    public static final String OPDRUK = "Opdruk tekst.";

    // Constructor
    Kopje(double inhoud, String materiaal, String kleur) {
        this.inhoud = inhoud;
        this.materiaal = materiaal;
        this.kleur = kleur;
    }

    // Inhoud
    public double getInhoud(){
        return this.inhoud;
    }

    public void setInhoud(int inhoud){
        this.inhoud = inhoud;
    }

    // Materiaal
    public String getMateriaal(){
        return this.materiaal;
    }

    public void setMateriaal(String materiaal){
        this.materiaal = materiaal;
    }

    // Kleur
    public String getKleur(){
        return this.kleur;
    }

    public void setKleur(String kleur){
        this.kleur = kleur;
    }

    // Attributen - Gedrag
    void drinken() {
        System.out.println("Kopje leegdrinken.");
    }
    void afwassen() {
        System.out.println("Kopje afwassen.");
    }
}
