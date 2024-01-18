package ewa.rest.Controllers;

import ewa.rest.Models.Partner;
import ewa.rest.Repositories.PartnerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/partners")
public class PartnerController {
    @Autowired
    private PartnerRepository partnerRepository;

    // Default
    @GetMapping(value = {"", "/"})
    public ResponseEntity<String> defaultRoute() {
        return new ResponseEntity<>("Entity Routes - Partner", HttpStatus.OK);
    }

    // Get All
    @GetMapping(value = "/all")
    public ResponseEntity<List<Partner>> getPartners() {
        return new ResponseEntity<>(partnerRepository.findAll(), HttpStatus.OK);
    }

    // Get By ID
    @GetMapping(value = "/findById/{id}")
    public ResponseEntity<Partner> findById(@PathVariable Long id) {
        try {
            Partner partner = partnerRepository.findById(id).orElse(null);
            if (partner != null) {
                return new ResponseEntity<>(partner, HttpStatus.OK);
            } else return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception exception) {
            System.out.println("--- Error: " + exception.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get By Email
    @GetMapping(value = "/findByContactMail/{email}")
    public ResponseEntity<Partner> findByContactMail(@PathVariable String email) {
        try {
            Partner partner = partnerRepository.findByEmail(email).orElse(null);
            if (partner != null) {
                return new ResponseEntity<>(partner, HttpStatus.OK);
            } else return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception exception) {
            System.out.println("--- Error: " + exception.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get By Company name and User
    @GetMapping(value = "/findProfile/{companyName}/{name}")
    public ResponseEntity<Partner> findProfile(@PathVariable String companyName, @PathVariable String name) {
        try {
            Partner Partner = partnerRepository.findProfile(companyName, name).orElse(null);
            if (Partner != null) {
                return new ResponseEntity<>(Partner, HttpStatus.OK);
            } else return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception exception) {
            System.out.println("--- Error: " + exception.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Create New
    @PostMapping(value = "/save")
    public ResponseEntity<String> savePartner(@RequestBody Partner partner) {
        try {
            partnerRepository.save(partner);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception exception) {
            System.out.println("--- Error: " + exception.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Update Specific
    @PutMapping(value = "/update/{email}")
    public ResponseEntity<Partner> updatePartner(@PathVariable String email, @RequestBody Partner updatePartnerData) {
        try {
            partnerRepository.updatePartnerData(
                    updatePartnerData.getAddress(),
                    updatePartnerData.getAge(),
                    updatePartnerData.getCompanyFunction(),
                    updatePartnerData.getCompanyName(),
                    updatePartnerData.getGender(),
                    updatePartnerData.getIndustry(),
                    updatePartnerData.getName(),
                    updatePartnerData.getPostalCode(),
                    updatePartnerData.getKvk(),
                    updatePartnerData.getTag(),
                    email
            );
            return ResponseEntity.ok(updatePartnerData);
        } catch (Exception exception) {
            System.out.println("--- Error: " + exception.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Update password
    @PutMapping(value = "/update/password/{email}/{password}")
    public ResponseEntity<Partner> updatePassword(@PathVariable String email, @PathVariable String password) {
        try {
            partnerRepository.updatePassword(
                    password,
                    email
            );
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception exception) {
            System.out.println("--- Error: " + exception.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Delete Specific
    @DeleteMapping(value = "/delete/{id}")
    public ResponseEntity<Partner> deletePartner(@PathVariable Long id) {
        try {
            Partner targetPartner = partnerRepository.findById(id).orElse(null);
            if (targetPartner != null) {
                partnerRepository.delete(targetPartner);
                return new ResponseEntity<>(targetPartner, HttpStatus.OK);
            } else return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception exception) {
            System.out.println("--- Error: " + exception.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // (Un)Block Specific
    @PutMapping(value = "/toggleBlock/{id}")
    public ResponseEntity<HttpStatus> toggleBlockPartner(@PathVariable Long id) {
        try {
            partnerRepository.toggleBlockPartner(id);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception exception) {
            System.out.println("--- Error: " + exception.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
