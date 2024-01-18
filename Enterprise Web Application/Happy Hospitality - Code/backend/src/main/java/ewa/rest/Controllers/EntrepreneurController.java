package ewa.rest.Controllers;

import ewa.rest.Models.Entrepreneur;
import ewa.rest.Repositories.EntrepreneurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/entrepreneurs")
public class EntrepreneurController {
    @Autowired
    private EntrepreneurRepository entrepreneurRepository;

    // Default
    @GetMapping(value = {"", "/"})
    public ResponseEntity<String> defaultRoute() {
        return new ResponseEntity<>("Entity Routes - Entrepreneur", HttpStatus.OK);
    }

    // Get All
    @GetMapping(value = "/all")
    public ResponseEntity<List<Entrepreneur>> getEntrepreneurs() {
        return new ResponseEntity<>(entrepreneurRepository.findAll(), HttpStatus.OK);
    }

    // Get By Email
    @GetMapping(value = "/findByEmail/{email}")
    public ResponseEntity<Entrepreneur> findByEmail(@PathVariable String email) {
        try {
            Entrepreneur entrepreneur = entrepreneurRepository.findByEmail(email).orElse(null);
            if (entrepreneur != null) {
                return new ResponseEntity<>(entrepreneur, HttpStatus.OK);
            } else return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception exception) {
            System.out.println("--- Error: " + exception.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get By Company name and User
    @GetMapping(value = "/findProfile/{companyName}/{name}")
    public ResponseEntity<Entrepreneur> findProfile(@PathVariable String companyName, @PathVariable String name) {
        try {
            Entrepreneur entrepreneur = entrepreneurRepository.findProfile(companyName, name).orElse(null);
            if (entrepreneur != null) {
                return new ResponseEntity<>(entrepreneur, HttpStatus.OK);
            } else return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception exception) {
            System.out.println("--- Error: " + exception.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Create New
    @PostMapping(value = "/save")
    public ResponseEntity<String> saveEntrepreneur(@RequestBody Entrepreneur entrepreneur) {
        try {
            entrepreneurRepository.save(entrepreneur);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception exception) {
            System.out.println("--- Error: " + exception.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Update Specific
    @PutMapping(value = "/update/{email}")
    public ResponseEntity<Entrepreneur> updateEntrepreneur(@PathVariable String email, @RequestBody Entrepreneur updatedEntrepreneur) {
        try {
            entrepreneurRepository.updateEntrepreneurData(
                    updatedEntrepreneur.getAddress(),
                    updatedEntrepreneur.getAge(),
                    updatedEntrepreneur.getCompanyFunction(),
                    updatedEntrepreneur.getCompanyName(),
                    updatedEntrepreneur.getGender(),
                    updatedEntrepreneur.getIndustry(),
                    updatedEntrepreneur.getName(),
                    updatedEntrepreneur.getPostalCode(),
                    email
            );
            return ResponseEntity.ok(updatedEntrepreneur);
        } catch (Exception exception) {
            System.out.println("--- Error: " + exception.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Update password
    @PutMapping(value = "/update/password/{email}/{password}")
    public ResponseEntity<Entrepreneur> updatePassword(@PathVariable String email, @PathVariable String password) {
        try {
            entrepreneurRepository.updatePassword(
                    password,
                    email
            );
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception exception) {
            System.out.println("--- Error: " + exception.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // (Un)Block Specific
    @PutMapping(value = "/toggleBlock/{id}")
    public ResponseEntity<HttpStatus> toggleBlockEntrepreneur(@PathVariable Long id) {
        try {
            entrepreneurRepository.toggleBlockEntrepreneur(id);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception exception) {
            System.out.println("--- Error: " + exception.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Delete Specific
    @DeleteMapping(value = "/delete/{id}")
    public ResponseEntity<Entrepreneur> deleteEntrepreneur(@PathVariable Long id) {
        try {
            Entrepreneur entrepreneur = entrepreneurRepository.findById(id).orElse(null);
            if (entrepreneur != null) {
                entrepreneurRepository.delete(entrepreneur);
                return new ResponseEntity<>(entrepreneur, HttpStatus.OK);
            } else return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception exception) {
            System.out.println("--- Error: " + exception.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}



