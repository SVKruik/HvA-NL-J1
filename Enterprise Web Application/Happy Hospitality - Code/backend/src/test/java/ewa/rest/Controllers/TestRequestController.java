package ewa.rest.Controllers;

import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;

public class TestRequestController {

    public ResponseEntity doTestRequest(TestRestTemplate testRestTemplate, Class targetClass, String route, HttpMethod method, Object requestBody) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("X-API-Key", "AndYebweTqwb");

        HttpEntity<Object> entity = new HttpEntity<>(requestBody, headers);

        return testRestTemplate.exchange(route, method, entity, targetClass);
    }
}
