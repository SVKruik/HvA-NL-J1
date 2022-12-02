/**
 * @author Stefan Kruik
 * Wrapper en StringBuilder test
 */
public class Main {
    public static void main(String[] args) {
        StringBuilder sb = new StringBuilder();
        String[] cijferLetters = new String[]{"1", "2", "3", "4", "5"};
        for (int i = 0; i < cijferLetters.length; i++) {
            final int CIJFERLETTERS_LENGTH_MAX = cijferLetters.length - 1;

            if (i < CIJFERLETTERS_LENGTH_MAX) {
                sb.append("Student ").append(cijferLetters[i]).append(", ");
            } else if (i == CIJFERLETTERS_LENGTH_MAX) {
                sb.append("Student ").append(cijferLetters[i]);
            }
        }

        System.out.println(" ");
        System.out.println(sb);
        System.out.println(" ");

        int[] cijfers = new int[cijferLetters.length];
        for (int i = 0; i < cijferLetters.length; i++) {
            cijfers[i] = Integer.parseInt(cijferLetters[i]);
            System.out.println(cijfers[i]);
        }
    }
}