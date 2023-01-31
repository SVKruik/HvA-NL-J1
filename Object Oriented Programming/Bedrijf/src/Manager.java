public class Manager extends Werknemer {
    private double bonus;

    public Manager(double maandSalaris, String naam) {
        super(maandSalaris, naam);
    }

    public void kenBonusToe(double bonus) {
        this.bonus = bonus;
    }

    @Override
    public double berekenInkomsten() {
        return super.berekenInkomsten() + this.bonus;
    }
}
