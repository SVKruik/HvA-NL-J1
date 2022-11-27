/**
 * WK simulator
 * @author Stefan Kruik
 */

public class Main {
    public static void main(String[] args) {
        Simulatie simulatie = new Simulatie("Quatar", "Senegal");

        System.out.println("Wedstrijd is tussen " + simulatie.getThuisteam() + " - " + simulatie.getUitteam());
        simulatie.simuleer();

//        System.out.println(simulatie.getThuisteam());
//        simuleerWedstrijden(simulatie);
//        System.out.println(simulatie.getThuisteam());
        simuleerWedstrijden();
    }

    public static void simuleerWedstrijden() {
//        simulatie.setThuisteam("Nederland");
//        System.out.println(simulatie.getThuisteam());

        Simulatie[] simulaties =  new Simulatie[10];

        simulaties[0] = new Simulatie("Quatar", "Senegal");
        simulaties[1] = new Simulatie("Ecuador", "Nederland");
        simulaties[2] = new Simulatie("Spanje", "Costa-rica");
        simulaties[3] = new Simulatie("Brazilië", "Servië");
        simulaties[4] = new Simulatie("Iran", "Argentinië");
        simulaties[5] = new Simulatie("Zuid Afrika", "Duitsland");
        simulaties[6] = new Simulatie("Polen", "Frankrijk");
        simulaties[7] = new Simulatie("Portugal", "Indonesië");
        simulaties[8] = new Simulatie("China", "Australië");
        simulaties[9] = new Simulatie("Zweden", "Italië");

        for (int i = 0; i < simulaties.length; i++) {
            Simulatie simulatie = simulaties[i];
            System.out.println(" ");
            System.out.println(simulatie.getThuisteam() + " - " + simulatie.getUitteam());
            simulatie.simuleer();
        }
    }
}