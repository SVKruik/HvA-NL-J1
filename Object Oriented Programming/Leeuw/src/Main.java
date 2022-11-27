public class Main {
    public static void main(String[] args) {
        Leeuw leeuwA = new Leeuw("A", true, 5, true);
        Leeuw leeuwB = new Leeuw("B", false, 0, false);

        System.out.println(leeuwA.getNaam() + " " + leeuwA.getHeeftGroteManen() + " " + leeuwA.getBrullen() + " " + leeuwA.getLuieren());
        System.out.println(" ");
        System.out.println(leeuwB.getNaam() + " " + leeuwB.getHeeftGroteManen() + " " + leeuwB.getBrullen() + " " + leeuwB.getLuieren());

//        Boom boom = new Boom(, 100, 100, 4);
    }
}