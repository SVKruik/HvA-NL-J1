public class Pokemon {
    private String naam;
    private String type;
    private int hp;
    private Aanval[] aanvallen;

    /**
     * Maak een niewe Pokemon
     * @param naam - naam van de Pokemon
     * @param type - soort Pokemon
     * @param hp - hoeveelheid levenspunten
     * @param aanvallen - aanval
     */
    public Pokemon(String naam, String type, int hp, Aanval[] aanvallen) {
        this.naam = naam;
        this.type = type;
        this.hp = hp;
        this.aanvallen = aanvallen;
    }

    /**
     * Print eigenschappen van Pokemon en Aanval
     * via this.aanval kunnen we dus de methodes uit Aanval aanroepen!
     */
    public void printEigenschappen() {
        System.out.printf("%s, %s, %d", this.naam, this.type, this.hp);

        StringBuilder sb = new StringBuilder();

        for (Aanval aanval : this.aanvallen) {
            sb.append("\n\tnaam aanval: ");
            sb.append(aanval.getNaam());
            sb.append(", type: ");
            sb.append(aanval.getType());
            sb.append(", schade: ");
            sb.append(aanval.getSchade());
        }

        System.out.println(sb.toString());
    }
}
