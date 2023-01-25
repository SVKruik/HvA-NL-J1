/**
 * @author Stefan Kruik
 * Superheld
 */
public class Main {
    public static void main(String[] args) {
        IronMan ironman = new IronMan(50, 120);
        Hulk hulk = new Hulk(3000, 9);

        hulk.kalmeer();
        hulk.trekPakAan();
        hulk.gebruikerSuperKracht();

        System.out.println(" ");

        ironman.gebruikAutoPiloot();
        ironman.trekPakAan();
        ironman.gebruikerSuperKracht();
    }
}