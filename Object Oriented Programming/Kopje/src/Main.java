public class Main {
    public static void main(String[] args) {
        // Steen
        Kopje stenenkopje = new Kopje(500, "Steen", "Grijs");
        System.out.println("Kopje: " + stenenkopje.getInhoud() + " " + stenenkopje.getMateriaal()  + " " + stenenkopje.getKleur());

        // Glas
        Kopje glazenkopje = new Kopje(300, "Glas", "Transparant");
        System.out.println("Kopje: " + glazenkopje.getInhoud() + " " + glazenkopje.getMateriaal()  + " " + glazenkopje.getKleur());

        System.out.println(" ");
        stenenkopje.afwassen();
        stenenkopje.drinken();

        System.out.println("Public static waardes: " + Kopje.MAX_INHOUD + Kopje.OPDRUK);
    }
}