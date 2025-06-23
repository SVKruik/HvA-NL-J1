package nl.hva.palindrome;

import java.util.ArrayList;
import java.util.Scanner;

public class PalindromeMain {
    private final ArrayList<String> palindromes = new ArrayList<>();

    public static void main(String[] args) {
        PalindromeMain palindromeMain = new PalindromeMain();
        Scanner scanner = new Scanner(System.in);

        while (true) {
            System.out.println("Enter a string to check if it is a palindrome:");
            System.out.println(
                    "Type 'exit' to exit the program. Type 'palindromes' to see all valid palindromes entered so far.\n");
            String input = scanner.nextLine();

            if (!palindromeMain.inputHandler(input)) {
                break;
            }
        }

        scanner.close();
    }

    public boolean inputHandler(String input) {
        switch (input) {
            case "exit":
                System.out.println("Exiting...");
                return false;
            case "palindromes":
                System.out.println("Palindromes entered so far:");
                for (String palindrome : this.getPalindromes()) {
                    System.out.println(palindrome);
                }
                System.out.println();
                break;
            default:
                this.isPalindrome(input);
        }

        return true;
    }

    public boolean isPalindrome(String input) {
        boolean isPalindrome = input.trim().equalsIgnoreCase(new StringBuilder(input).reverse().toString());

        if (isPalindrome) {
            System.out.println("'" + input + "' is a palindrome!\n");
            this.palindromes.add(input);
        } else {
            System.out.println("'" + input + "' is not a palindrome!\n");
        }

        return isPalindrome;
    }

    public ArrayList<String> getPalindromes() {
        return this.palindromes;
    }

    public void clearPalindromes() {
        this.palindromes.clear();
    }
}
