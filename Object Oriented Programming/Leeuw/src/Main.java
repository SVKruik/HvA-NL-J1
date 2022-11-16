public class Main {
    public static void main(String[] args) {
        Leeuw leeuwA = new Leeuw("Henk", true, 5, true);
        Leeuw leeuwB = new Leeuw("Bas", false, 0, false);

        System.out.println(leeuwA.naam + leeuwA.heeftGroteManen + leeuwA.brullen + leeuwA.luieren);
        System.out.println(" ");
        System.out.println(leeuwB.naam + leeuwB.heeftGroteManen + leeuwB.brullen + leeuwB.luieren);
    }
}