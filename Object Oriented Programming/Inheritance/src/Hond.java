public class Hond extends Huisdier {
    private boolean isGevaarlijk;

    Hond(String naam, boolean isGevaarlijk) {
        super(naam);
        this.isGevaarlijk = isGevaarlijk;
    }

    /**
     * Overwrite het default geluid.
     */
    @Override
    public void maakGeluid() {
        System.out.println("Woef");
    }
}
