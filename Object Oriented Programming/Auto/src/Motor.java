/**
 * Motor met eigenschappen.
 */
public class Motor {
    private int cyclinders;
    private int pk;

    /**
     * @param cyclinders - aantal cylincers
     * @param pk - vermogen van motor
     */
    Motor(int cyclinders, int pk) {
        this.cyclinders = cyclinders;
        this.pk = pk;
    }

    public void setCyclinders(int cyclinders) {
        this.cyclinders = cyclinders;
    }

    public int getCyclinders() {
        return cyclinders;
    }

    public int getPk() {
        return pk;
    }

}
