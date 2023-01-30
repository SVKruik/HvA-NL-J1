package nl.hva.artiestenboeker;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Locale;

/**
 * Silver 6
 *
 * @author Stefan Kruik
 */

public class Main {

    private static ArrayList<Artiest> artiesten;

    public static void main(String[] args) {
        Locale.setDefault(Locale.ENGLISH); // Hierdoor worden kommagetallen met punten getoond i.p.v. komma's.

        System.out.println("Welkom bij het tentamen Artiestenboeker: Stefan Kruik, IS110, 500895667\n");

        // test stap 1
        artiesten = testStap1();

        // test stap 2
        artiesten.addAll(testStap2());

        // test stap 3
        testStap3();

        //test stap 4
        testStap4();

        // test stap 5
//        testStap5();
    }

    //     test stap 1
    private static ArrayList<Artiest> testStap1() {

        System.out.println("\n--- TEST STAP 1 ---");

        ArrayList<Artiest> caberetiers = new ArrayList<>();
        caberetiers.add(new Cabaretier("Actualiteit", "Jaap", "Teeuwen", "The Dutch Joker", LocalDate.of(1975, 4, 8)));
        caberetiers.add(new Cabaretier("Nonsens", "Najib", "Amhali", "Comedy daddy", LocalDate.of(1994, 10, 15)));
        caberetiers.add(new Cabaretier("Nonsens", "Bertje", "Visser", "", LocalDate.of(1994, 1, 21)));
        caberetiers.add(new Cabaretier("Stand-up", "Jorgen", "Raymann", " ", LocalDate.of(1980, 3, 13)));
        caberetiers.add(new Cabaretier("Actualiteit", "Mo", "Botan", LocalDate.of(1966, 12, 21)));

        for (Artiest artiest : caberetiers) {
            System.out.println(artiest);
        }

        return caberetiers;
    }

    // test stap 2
    private static ArrayList<Artiest> testStap2() {

        System.out.println("\n--- TEST STAP 2 ---");

        ArrayList<Artiest> toneelgezelschappen = new ArrayList<>();

        Toneelgezelschap toneelgezelschap = new Toneelgezelschap("Musical", "Wild musical rabbits", 1997);
        toneelgezelschap.voegActeurToe(new Acteur("Bart van der Weide", "Nederland"));
        toneelgezelschap.voegActeurToe(new Acteur("Wayne Gibbs", "Engeland"));
        toneelgezelschap.voegActeurToe(new Acteur("Dennis Huige", "Nederland"));
        toneelgezelschap.voegActeurToe(new Acteur("Sarah Cabrairo", "Spanje"));
        toneelgezelschappen.add(toneelgezelschap);

        toneelgezelschap = new Toneelgezelschap("Dans", "Black swans", 2005);
        toneelgezelschap.voegActeurToe(new Acteur("Willie Wartaal", "Nederland"));
        toneelgezelschap.voegActeurToe(new Acteur("Dario Cvitanich", "Spanje"));
        toneelgezelschap.voegActeurToe(new Acteur("Faberyayo", "Nederland"));
        toneelgezelschappen.add(toneelgezelschap);

        toneelgezelschap = new Toneelgezelschap("Western-films", "Country side guys", 2004);
        toneelgezelschap.voegActeurToe(new Acteur("Eloi Youssef", "Nederland"));
        toneelgezelschap.voegActeurToe(new Acteur("Casper Stitcher", "Engeland"));
        toneelgezelschap.voegActeurToe(new Acteur("Damian Dunn", "Schotland"));
        toneelgezelschap.voegActeurToe(new Acteur("Niles Fletcher", "Engeland"));
        toneelgezelschappen.add(toneelgezelschap);

        for (Artiest artiest : toneelgezelschappen) {
            System.out.println(artiest);
        }

        return toneelgezelschappen;
    }

    public static void printToneelgezelschappenInJaar(int jaar) {
        for (Artiest artiest : artiesten) {
            if (artiest instanceof Toneelgezelschap toneelgezelschap) {
                if (toneelgezelschap.getJaarOprichting() <= jaar) {
                    System.out.println(toneelgezelschap);
                }
            }
        }
    }

    private static void testStap3() {
        System.out.println("\n--- TEST STAP 3 ---");
        System.out.println("Toneelgezelschappen die bestonden in 2005:");
        printToneelgezelschappenInJaar(2005);
    }

    //
    private static void printArtiestenPerGenre() {
        Collections.sort(artiesten);
        for (Artiest artiest : artiesten) {
            System.out.println(artiest);
        }
    }

    private static void testStap4() {
        System.out.println("\n--- TEST STAP 4 ---");
        System.out.println("Artiesten geordend op genre:");
        printArtiestenPerGenre();
    }

//
//    private static void testStap5() {
//        System.out.println("\n--- TEST STAP 5 ---");
//        System.out.println("Boekingen:");
//
//        boekArtiest("The Dutch Joker", LocalDate.of(2019, 6, 12));
//        boekArtiest("Mo Botan", LocalDate.of(2019, 7, 2));
//        boekArtiest("Black swans", LocalDate.of(2019, 7, 2));
//        boekArtiest("The Dutch Joker", LocalDate.of(2019, 6, 12));
//        boekArtiest("Black swans", LocalDate.of(2019, 6, 19));
//        boekArtiest("Mo Botan", LocalDate.of(2019, 7, 2));
//        boekArtiest("Black swans", LocalDate.of(2019, 7, 3));
//        System.out.println("\nDe volgende artiesten zijn minimaal één keer geboekt:");
//        for (Artiest artiest : artiesten) {
//            if (artiest.krijgAantalBoekingen() > 0) {
//                System.out.println(artiest);
//            }
//        }
//    }

}
