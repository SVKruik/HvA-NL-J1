public class Main {
    public static void main(String[] args) {
        StringBuilder sb = new StringBuilder();

        for (int i = 0; i < 10; i++) {
            sb.append(i);
        }

        System.out.println(sb);

        //

        String letternummer = "2";
        int nummer = Integer.parseInt(letternummer);

        int uitkomst = nummer * 10;
        System.out.println(uitkomst);

        String postcode = "1601AT";
        char eersteKarakter = postcode.charAt(0);
    }
}