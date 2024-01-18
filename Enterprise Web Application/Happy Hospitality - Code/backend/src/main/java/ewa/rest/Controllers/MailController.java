package ewa.rest.Controllers;

import ewa.rest.Models.GeneralMailRequest;
import ewa.rest.Services.MailService;
import jakarta.mail.MessagingException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/mail")
public class MailController {
    private final MailService mailService = new MailService();

    // Default
    @GetMapping(value = {"", "/"})
    public ResponseEntity<String> defaultRoute() {
        return new ResponseEntity<>("Entity Routes - Mail", HttpStatus.OK);
    }

    // Non-Specific Mail
    @PostMapping(value = "/general")
    public ResponseEntity<String> generalMail(@RequestBody GeneralMailRequest generalMailRequest) throws MessagingException {
        return mailService.sendMail(generalMailRequest.getReceivers(), generalMailRequest.getContent());
    }

    // Event Delete
    // Only accessible via the application. Does not allow requests.
    public void eventDelete(String[] receivers, String content) throws MessagingException {
        mailService.sendMail(receivers, content);
    }
}
