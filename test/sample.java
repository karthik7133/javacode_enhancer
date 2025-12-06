import java.util.*;

public class LegacyCodeExample {

    private Vector<String> data = new Vector<>();
    private Hashtable<String, Integer> cache = new Hashtable<>();

    public void processData(String input) {
        if (input != null) {
            if (input.length() > 0) {
                for (int i = 0; i < input.length(); i++) {
                    char c = input.charAt(i);
                    if (c == 'a' || c == 'e' || c == 'i') {
                        System.out.println(c);
                    } else if (c == 'o' || c == 'u') {
                        System.out.println("vowel: " + c);
                    }
                }
            }
        }
    }

    public String formatDate(Date date) {
        int year = date.getYear();
        return "Year: " + year;
    }

    public void manageThread(Thread thread) {
        thread.stop();
    }

    public String buildString(List<String> items) {
        StringBuffer sb = new StringBuffer();
        for (int i = 0; i < items.size(); i++) {
            sb.append(items.get(i));
        }
        return sb.toString();
    }

    public int calculateComplexity(int a, int b, int c) {
        int result = 0;

        if (a > 0) {
            if (b > 0) {
                if (c > 0) {
                    result = a + b + c;
                } else {
                    result = a + b;
                }
            } else if (c > 0) {
                result = a + c;
            } else {
                result = a;
            }
        } else if (b > 0) {
            if (c > 0) {
                result = b + c;
            } else {
                result = b;
            }
        } else {
            result = c;
        }

        return result;
    }
}
