public class Main {
    public static void main(String[] args) {
        // Steen
        Kopje stenenkopje = new Kopje(500, "Steen", "Grijs");
        System.out.println("Kopje: " + stenenkopje.inhoud + " " + stenenkopje.inhoud);

        // Glas
        Kopje glazenkopje = new Kopje(300, "Glas", "Transparant");
        System.out.println("Kopje: " + glazenkopje.inhoud + " " + glazenkopje.inhoud);

        stenenkopje.afwassen();
        stenenkopje.drinken();
    }
}