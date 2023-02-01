/**
 * @author Stefan Kruik
 * Gold 4
 */
public class Main {

    public static void main(String[] args) {

        // Testcode Opdracht 4 LesEenheid

        // Opdracht A: test LesEenheid
        Leseenheid lesEenheid = new Leseenheid("Algemeen", 3 , 2);
        System.out.println(lesEenheid);

        // Opdracht A: test Vak
        Vak vak = new Vak(7.8, "OOP1", 3 , 1);
        System.out.println(vak);

        // Opdracht A: test ProfSkills
        ProfessionalSkills skill =
                new ProfessionalSkills(false, "Personal Skills", 2 , 1);
        System.out.println(skill);
        skill.setGehaald(true);
        System.out.println(skill);

        // Opdracht A: test Project
        Project project = new Project(7.4, 6.8, 8.0,
                "Fasten Your Seatbelts", 12 , 1);
        System.out.println(project);

        System.out.println();
        // Test opdracht B
        Vak nogEenVak = new Vak("Databases", 3, 1);
        System.out.println(nogEenVak.toString() + ", afgerond: " +
                nogEenVak.isAfgerond());
        nogEenVak.setCijfer(5.499999);
        System.out.println(nogEenVak.toString() + ", afgerond: " +
                nogEenVak.isAfgerond());
        nogEenVak.setCijfer(5.5);
        System.out.println(nogEenVak.toString() + ", afgerond: " +
                nogEenVak.isAfgerond());

        ProfessionalSkills nogEenSkill = new ProfessionalSkills("ICT Ethics", 2, 2 );
        System.out.println(nogEenSkill.toString() + ", afgerond: " +
                nogEenSkill.isAfgerond());
        nogEenSkill.setGehaald(true);
        System.out.println(nogEenSkill.toString() + ", afgerond: " +
                nogEenSkill.isAfgerond());

        Project nogEenProject = new Project("Agile Development", 12, 1);
        System.out.println(nogEenProject.toString() + ", afgerond: " +
                nogEenProject.isAfgerond());

        nogEenProject.setMethodenEnTechniekenCijfer(5.499999);
        nogEenProject.setProcescijfer(5.5);
        nogEenProject.setProductcijfer(5.5);
        System.out.println(nogEenProject.toString() + ", afgerond: " +
                nogEenProject.isAfgerond());

        nogEenProject.setMethodenEnTechniekenCijfer(5.5);
        nogEenProject.setProcescijfer(5.4999999);
        System.out.println(nogEenProject.toString() + ", afgerond: " +
                nogEenProject.isAfgerond());

        nogEenProject.setProcescijfer(10);
        nogEenProject.setProductcijfer(5.499999);
        System.out.println(nogEenProject.toString() + ", afgerond: " +
                nogEenProject.isAfgerond());

        nogEenProject.setProductcijfer(10);
        System.out.println(nogEenProject.toString() + ", afgerond: " +
                nogEenProject.isAfgerond());

        nogEenProject.setMethodenEnTechniekenCijfer(10);
        System.out.println(nogEenProject.toString() + ", afgerond: " +
                nogEenProject.isAfgerond());

    }
}
