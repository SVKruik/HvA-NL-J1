package ewa.rest.Controllers;

import ewa.rest.Models.ChartResponse;
import ewa.rest.Models.CumulativeChartResponse;
import ewa.rest.Models.SuperUser;
import ewa.rest.Repositories.SuperUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/superUsers")
public class SuperUserController {
    @Autowired
    private SuperUserRepository superUserRepository;

    // Default
    @GetMapping(value = {"", "/"})
    public ResponseEntity<String> defaultRoute() {
        return new ResponseEntity<>("Entity Routes - Super User", HttpStatus.OK);
    }

    // Get All
    @GetMapping(value = "/all")
    public ResponseEntity<List<SuperUser>> getSuperUsers() {
        return new ResponseEntity<>(superUserRepository.findAll(), HttpStatus.OK);
    }

    // Get By Email
    @GetMapping(value = "/getByEmail/{email}")
    public ResponseEntity<SuperUser> getSuperUserByEmail(@PathVariable String email) {
        return new ResponseEntity<>(superUserRepository.findByEmail(email), HttpStatus.OK);
    }

    // Get By ID
    @GetMapping(value = "/findById/{id}")
    public ResponseEntity<SuperUser> findById(@PathVariable Long id) {
        try {
            SuperUser superUser = superUserRepository.findById(id).orElse(null);
            if (superUser != null) {
                return new ResponseEntity<>(superUser, HttpStatus.OK);
            } else return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception exception) {
            System.out.println("--- Error: " + exception.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Main Statistics
    @GetMapping(value = "/mainStatistics")
    public ResponseEntity<Object[]> getMainStatistics() {
        try {
            return new ResponseEntity<>(superUserRepository.mainStatistics(), HttpStatus.OK);
        } catch (Exception exception) {
            System.out.println("--- Error: " + exception.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Update Rank
    @PutMapping(value = "/updateRank/{email}/{value}")
    public ResponseEntity<HttpStatus> updateRank(@PathVariable String email, @PathVariable Boolean value) {
        try {
            superUserRepository.updateRank(value, email);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception exception) {
            System.out.println("--- Error: " + exception.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Update password
    @PutMapping(value = "/update/password/{email}/{password}")
    public ResponseEntity<SuperUser> updatePassword(@PathVariable String email, @PathVariable String password) {
        try {
            superUserRepository.updatePassword(
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
    @PutMapping(value = "/toggleBlock/{email}")
    public ResponseEntity<HttpStatus> toggleBlockSuperUser(@PathVariable String email) {
        try {
            superUserRepository.toggleBlockSuperUser(email);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception exception) {
            System.out.println("--- Error: " + exception.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Delete Specific
    @DeleteMapping(value = "/delete/{email}")
    public ResponseEntity<SuperUser> deleteSuperUser(@PathVariable String email) {
        try {
            superUserRepository.delete(superUserRepository.findByEmail(email));
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception exception) {
            System.out.println("--- Error: " + exception.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get Chart Data
    @GetMapping(value = "/chart")
    public ResponseEntity<ChartResponse> chartData() {
        try {
            Object[] posts = superUserRepository.getPostChartData();
            Object[] events = superUserRepository.getEventChartData();
            Object[] partners = superUserRepository.getPartnerChartData();
            Object[] entrepreneurs = superUserRepository.getEntrepreneurChartData();

            ChartResponse chartResponse = new ChartResponse(posts, events, partners, entrepreneurs);

            return new ResponseEntity<>(chartResponse, HttpStatus.OK);
        } catch (Exception exception) {
            System.out.println("--- Error: " + exception.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get Cumulative Count
    @GetMapping(value = "/chart/cumulative")
    public List<CumulativeChartResponse> retrieveCumulativeCounts() {
        List<Map<String, Object>> resultMapList = superUserRepository.retrieveCumulativeCounts();
        return resultMapList.stream().map(CumulativeChartResponse::new).collect(Collectors.toList());
    }

    // New Super User
    @PostMapping(value = "/new")
    public ResponseEntity<String> newSuperUser(@RequestBody SuperUser superUser) {
        try {
            superUserRepository.save(superUser);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (DataIntegrityViolationException exception) {
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        } catch (Exception exception) {
            System.out.println("--- Error: " + exception.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
