import java.time.LocalDate;

public class Student {
    private LocalDate geboortedatum;

    public Student(LocalDate geboortedatum) {
        this.geboortedatum = geboortedatum;
    }

    private String krijgKorteGeboortedatum() {
        String kort = geboortedatum.getYear() + "-" + geboortedatum.getMonthValue() + "-" + geboortedatum.getDayOfMonth();

    }
}
