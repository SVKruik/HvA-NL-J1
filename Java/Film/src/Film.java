public class Film {
    String titel;
    int duur;
    int beoordeling;

    /**
     * Speel de film af.
     */
    void afspelen() {
        System.out.printf("Film: %s starten.%n", titel);
    }

    /**
     * Pauzeer de film.
     */
    void pauzeren() {
        System.out.printf("Film: %s is gepauzeerd.%n", titel);
    }

    /**
     * Stop de film.
     */
    void stoppen() {
        System.out.printf("Film: %s is gestopt.%n", titel);
    }
}
