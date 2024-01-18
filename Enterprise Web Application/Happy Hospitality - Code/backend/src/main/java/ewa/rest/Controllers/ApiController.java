package ewa.rest.Controllers;

import ewa.rest.Repositories.EventRepository;
import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.BufferedReader;
import java.io.InputStreamReader;

@RestController
public class ApiController implements ErrorController {
    @Autowired
    private EventRepository eventRepository;

    @GetMapping(value = "/")
    public String homePage() {
        return "Welcome to the EWA happy-2 RESTful API!";
    }

    // Reload Ubuntu Nginx Service
    @GetMapping(value = "/api/reload")
    public ResponseEntity<String> reloadApi() {
        try {
            if (System.getProperty("os.name").toLowerCase().contains("linux")) {
                ProcessBuilder builder = new ProcessBuilder("/bin/sh", "-c", "systemctl restart ewarest.service");
                builder.redirectErrorStream(true);
                Process p = builder.start();
                BufferedReader r = new BufferedReader(new InputStreamReader(p.getInputStream()));
                String line;
                while (true) {
                    line = r.readLine();
                    if (line == null) break;
                    System.out.println(line);
                }
                return new ResponseEntity<>("API reloaded.", HttpStatusCode.valueOf(200));
            } else {
                return new ResponseEntity<>("Reload not available on current Operating System. Try running it in production or a Linux computer.", HttpStatusCode.valueOf(403));
            }
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatusCode.valueOf(500));
        }
    }

    @RequestMapping("/error")
    public ResponseEntity<Number> handleError(HttpServletRequest request) {
        Object status = request.getAttribute(RequestDispatcher.ERROR_STATUS_CODE);
        int statusCode = Integer.parseInt(status.toString());

        return new ResponseEntity<>(statusCode, HttpStatusCode.valueOf(statusCode));
    }

    @GetMapping(value = "/ticket")
    public ResponseEntity<String> ticket() {
        String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        StringBuilder ticket = new StringBuilder();

        for (int i = 0; i < 8; i++) {
            int randomIndex = (int) Math.floor(Math.random() * characters.length());
            ticket.append(characters.charAt(randomIndex));
        }

        return new ResponseEntity<>(ticket.toString(), HttpStatus.OK);
    }

    @GetMapping(value = "/database")
    public ResponseEntity<Integer> database() {
        return new ResponseEntity<>(eventRepository.checkDatabase(), HttpStatus.OK);
    }
}
