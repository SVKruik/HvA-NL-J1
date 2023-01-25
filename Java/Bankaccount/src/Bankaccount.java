public class Bankaccount {
    public static final int LIMIET_SALDO = 100000;
    private String iban;
    private double saldo;

    /**
     * Constructor om met de bankaccount gegevens te kunnen werken.
     * @param iban - banknummer
     * @param saldo - hoeveelheid geld
     */
    Bankaccount(String iban, double saldo) {
        this.iban = iban;
        this.saldo = saldo;
    }

    public String getIban() {
        return this.iban;
    }

    public void setIban(String iban) {
        this.iban = iban;
    }

    public double getSaldo() {
        return saldo;
    }

    public void setSaldo(double saldo) {
        this.saldo = saldo;
    }
}
