package ewa.rest.Services;

import jakarta.mail.Message;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.util.FileCopyUtils;

import java.nio.charset.StandardCharsets;
import java.nio.file.NoSuchFileException;

@Service
public class MailService {
    private final JavaMailSender mailSender = new MailConfig().getJavaMailSender();

    public ResponseEntity<String> sendMail(String[] receivers, String content) throws MessagingException {
        // Setup
        if (receivers.length == 0 || content == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        MimeMessage message = mailSender.createMimeMessage();
        message.setFrom(new InternetAddress("no-reply@stefankruik.com"));
        InternetAddress[] recipientAddresses = new InternetAddress[receivers.length];
        int counter = 0;
        for (String newRecipient : receivers) {
            recipientAddresses[counter] = new InternetAddress(newRecipient.trim());
            counter++;
        }
        message.setRecipients(Message.RecipientType.TO, recipientAddresses);
        message.setSubject("Happy Hospitality Collective");

        // Read HTML File
        String html;
        try {
            Resource resource = new ClassPathResource("templates/mail-nl.html");
            if (resource.exists()) {
                byte[] htmlBytes = FileCopyUtils.copyToByteArray(resource.getInputStream());
                html = new String(htmlBytes, StandardCharsets.UTF_8);
            } else throw new NoSuchFileException("File not found.");
        } catch (OutOfMemoryError | Exception error) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }

        // Replace Placeholders
        html = html.replace("${content}", content);

        // Finish Up
        message.setContent(html, "text/html; charset=utf-8");
        mailSender.send(message);
        return new ResponseEntity<>("Mail sent.", HttpStatus.OK);
    }
}
