public class IronMan extends Superheld {
    private int iq;

    /**
     * @param leeftijd
     * @param iq
     */
    IronMan(int leeftijd, int iq) {
        super(leeftijd);
        this.iq = iq;
    }

    /**
     * Gebruik de auto piloot.
     */
    public void gebruikAutoPiloot() {
        System.out.println("Gebruik Auto Piloot");
    }

    /**
     * Gebruik superkracht van main.
     */
    @Override
    public void gebruikerSuperKracht() {
        System.out.println("Iron Man Gebruikt Super Kracht");
    }
}
