/**
 * Inheritance Demo
 * @author Stefan Kruik
 */
public class Main {
    public static void main(String[] args) {
        Huisdier huisdier = new Huisdier("Petra");
        huisdier.maakGeluid();

        Kat kat = new Kat("Hennie", 20);
        Hond hond = new Hond("Freddie", true);

        kat.maakGeluid();
        hond.maakGeluid();
    }
}