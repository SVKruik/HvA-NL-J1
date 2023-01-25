/**
 * @author Stefan Kruik
 * Brons 3
 */
public class Main {
    public static void main(String[] args) {
        // als eerste maken we de Aanval, die moeten we straks meegeven aan Pokemon
        Aanval quickAttack = new Aanval("Quick Attack", "Normal", 20);
        Aanval fireBlast = new Aanval("Fire Blast", "Fire", 40);
        Aanval fly = new Aanval("Fly", "Flying", 30);

        Aanval[] aanvallen = new Aanval[3];
        aanvallen[0] = quickAttack;
        aanvallen[1] = fireBlast;
        aanvallen[2] = fly;

        // dan het object welke de aanvallen in zich krijgt via de constructor
        Pokemon pokemon = new Pokemon("Charizard", "Fire", 200, aanvallen);

        pokemon.printEigenschappen();
    }
}