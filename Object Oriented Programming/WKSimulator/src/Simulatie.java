import java.util.Random;

public class Simulatie {
    private String thuisteam;
    private String uitteam;

    private int thuisscore;
    private int uitscore;

    /**
     * @param thuisteam - tekst weergave thuisteam
     * @param uitteam - tekst weergave uitteam
     */
    Simulatie(String thuisteam, String uitteam) {
        this.thuisteam = thuisteam;
        this.uitteam = uitteam;
    }

    /**
     * Simuleer score voor thuis en uitteam
     */
    public void simuleer() {
        Random random = new Random();
        this.thuisscore = random.nextInt(0, 8);
        this.uitscore = random.nextInt(0, 8);

        if(this.thuisscore > this.uitscore) {
            System.out.println("Thuisteam wint.");
        } else if (this.thuisscore < this.uitscore) {
            System.out.println("Uitteam wint.");
        } else {
            System.out.println("Het is gelijkspel.");
        }

        System.out.printf("Score %d - %d \n", this.thuisscore, this.uitscore);
    }

    public String getThuisteam() {
        return this.thuisteam;
    }

    public void setThuisteam(String thuisteam) {
        this.thuisteam = thuisteam;
    }

    public String getUitteam() {
        return this.uitteam;
    }

    public void setUitteam(String uitteam) {
        this.uitteam = uitteam;
    }
}
