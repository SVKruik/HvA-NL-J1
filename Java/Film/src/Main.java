/**
 * @author Stefan Kruik
 * Brons 1
 */
public class Main {
    public static void main(String[] args) {
        Film film = new Film();

        film.titel = "2012";
        film.beoordeling = 10;
        film.duur = 220;

        System.out.printf("Film: %s -- Duur: %d -- Beoordeling %d.%n", film.titel, film.duur, film.beoordeling);

        film.afspelen();
        film.pauzeren();
        film.stoppen();
    }
}