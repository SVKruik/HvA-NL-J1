/**
 * @author Stefan Kruik
 * Deze klasse is een ontwerp voor een kopje zijn eigenscahppen en gedrag.
 */

public class Kopje {
    // Attributen - Eigenschappen
    double inhoud;
    String kleur;
    String materiaal;

    // Constructor
    Kopje(double inhoud, String materiaal, String kleur) {
        this.inhoud = inhoud;
        this.materiaal = materiaal;
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
