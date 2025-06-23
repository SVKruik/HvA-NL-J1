package tse.cicd.Controllers;

import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import tse.cicd.Helpers.BSNHelper;
import tse.cicd.Models.BSN;
import tse.cicd.Models.BsnValidationMessage;

@RestController
@RequestMapping("/bsn")
public class BSNController {

    /**
     * Validates a BSN.
     * 
     * @param bsn The BSN to validate.
     * @return The validation message.
     */
    @GetMapping(value = "/validate/{bsn}")
    public ResponseEntity<BsnValidationMessage> validateBsn(@PathVariable BSN bsn) {
        BsnValidationMessage message = new BSNHelper().validate(bsn.getBsn());
        HttpStatusCode statusCode = message == BsnValidationMessage.VALID
                ? HttpStatusCode.valueOf(200)
                : HttpStatusCode.valueOf(400);
        return new ResponseEntity<>(message, statusCode);
    }
}
