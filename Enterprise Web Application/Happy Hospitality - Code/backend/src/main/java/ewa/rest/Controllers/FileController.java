package ewa.rest.Controllers;

import com.jcraft.jsch.ChannelSftp;
import ewa.rest.Services.SftpService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartException;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;

@RestController
@RequestMapping(value = "/files")
public class FileController {
    // Default
    @GetMapping(value = {"", "/"})
    public ResponseEntity<String> defaultRoute() {
        return new ResponseEntity<>("Entity Routes - File", HttpStatus.OK);
    }

    // SFTP Upload
    @PostMapping("/upload/{type}/{name}")
    public ResponseEntity<String> uploadFile(@PathVariable String type, @PathVariable String name,
                                             @RequestParam("file") MultipartFile file) throws MultipartException {
        try {
            SftpService sftpService = new SftpService();
            ChannelSftp channelSftp = sftpService.setupJsch();
            if (channelSftp == null)
                return new ResponseEntity<>("Uploading went wrong.", HttpStatus.INTERNAL_SERVER_ERROR);
            channelSftp.connect();

            String remoteFileName = name + ".png";
            String remoteDir = "/files/uploads/" + type + "/" + remoteFileName;
            InputStream inputStream = file.getInputStream();
            channelSftp.put(inputStream, remoteDir);
            channelSftp.exit();

            return new ResponseEntity<>("File upload complete. File name: " + name, HttpStatus.OK);
        } catch (Exception exception) {
            System.out.println(exception.getMessage());
            return new ResponseEntity<>("Uploading went wrong.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
