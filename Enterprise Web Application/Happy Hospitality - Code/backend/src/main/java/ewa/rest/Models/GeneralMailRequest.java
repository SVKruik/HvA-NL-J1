package ewa.rest.Models;

public class GeneralMailRequest {
    private final String[] receivers;
    private final String content;

    public GeneralMailRequest(String[] receiver, String content) {
        this.receivers = receiver;
        this.content = content;
    }

    public String[] getReceivers() {
        return receivers;
    }

    public String getContent() {
        return content;
    }

    @Override
    public String toString() {
        return "General Mail Request [ First Receiver: " + this.getReceivers()[0] + ", Content: " + this.getContent() + " ]";
    }
}
