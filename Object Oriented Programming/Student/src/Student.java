import java.time.LocalDate;

public class Student {
    private int studentnummer;
    private String voornaam;
    private String achternaam;
    private LocalDate geboortedatum;

    private Adres adres;

    /**
     * @param studentnummer
     * @param voornaam
     * @param achternaam
     * @param geboortedatum
     * @param adres - inherit van Adres
     */
    public Student(int studentnummer, String voornaam, String achternaam, LocalDate geboortedatum, Adres adres) {
        this.studentnummer = studentnummer;
        this.voornaam = voornaam;
        this.achternaam = achternaam;
        this.geboortedatum = geboortedatum;
        this.adres = adres;
    }

    /**
     * Print studentinfo in mooi format.
     * @return - geformatteerde studentinfo.
     */
    public String toString() {
        return (studentnummer + " " + voornaam + " " + achternaam + " (" + krijgKorteGeboortedatum() + ")" + "\n Adres:" + adres.toString());
    }

    /**
     * Print geboortedatum in mooi format.
     * @return - geformatteerde geboortedatum
     */
    private String krijgKorteGeboortedatum() {
        return geboortedatum.getYear() + "-" + geboortedatum.getMonthValue() + "-" + geboortedatum.getDayOfMonth();
    }
}
