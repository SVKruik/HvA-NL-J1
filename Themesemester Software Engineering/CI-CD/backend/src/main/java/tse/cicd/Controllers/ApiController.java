package tse.cicd.Controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ApiController {

    @GetMapping(value = "/")
    public String homePage() {
        return "Stefan Kruik - TSE - BSN Validator";
    }
}
