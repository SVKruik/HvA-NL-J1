/**
 * @author Stefan Kruik
 * Brons 2
 */
public class Main {
    public static void main(String[] args) {
        Bankaccount[] bankaccounts = new Bankaccount[4];
        bankaccounts[0] = new Bankaccount("NL01RABO2", 1000);
        bankaccounts[1] = new Bankaccount("NL01RABO3", 200000);
        bankaccounts[2] = new Bankaccount("NL01RABO4", 250000);
        bankaccounts[3] = new Bankaccount("NL01RABO5", 50);

        for (Bankaccount bankaccount : bankaccounts) {
            if (bankaccount.getSaldo() <= Bankaccount.LIMIET_SALDO) {
                System.out.printf("Bankaccount iban: %s saldo: %.2f%n", bankaccount.getIban(), bankaccount.getSaldo());
            }
        }
    }
}