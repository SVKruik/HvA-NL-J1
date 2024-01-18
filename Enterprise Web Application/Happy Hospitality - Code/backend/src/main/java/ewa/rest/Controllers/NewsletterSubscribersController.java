package ewa.rest.Controllers;

import ewa.rest.Repositories.NewsletterSubscribersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/newsletter")
public class NewsletterSubscribersController {

    @Autowired
    private NewsletterSubscribersRepository newsletterSubscribersRepository;

    //Save email
    @PostMapping(value = "/save/{email}")
    public ResponseEntity<String> saveEmail(@PathVariable String email) {
        try {
            newsletterSubscribersRepository.save(email);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (DataIntegrityViolationException exception) {
            return new ResponseEntity<>(exception.getRootCause().getMessage(), HttpStatus.CONFLICT);
        } catch (Exception exception) {
            System.out.println("--- Error: " + exception.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
