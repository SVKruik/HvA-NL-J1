/**
 * Auto met eigenschappen en motor.
 */
public class Auto {
    private String merk;
    private int aantalDeuren;
    private Motor motor;

    /**
     * @param merk - autofabrikant
     * @param aantalDeuren - hoeveelheid deuren
     * @param motor - specifieke motor
     */
    Auto(String merk, int aantalDeuren, Motor motor) {
        this.merk = merk;
        this.aantalDeuren = aantalDeuren;
        this.motor = motor;
    }

    /**
     * Printen van eigenschappen van de auto
     */
    public void printAutoEigenschappen() {
        System.out.println("Merk: " + this.merk + ", Aantal deuren: " + this.aantalDeuren);
        System.out.println("Motor: " + this.motor.getCyclinders());
        System.out.println("PK: " + this.motor.getPk());
    }
}
