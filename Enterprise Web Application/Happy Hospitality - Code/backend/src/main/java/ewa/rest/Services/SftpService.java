package ewa.rest.Services;

import com.jcraft.jsch.ChannelSftp;
import com.jcraft.jsch.JSch;
import com.jcraft.jsch.JSchException;
import com.jcraft.jsch.Session;

public class SftpService {
    public ChannelSftp setupJsch() {
        try {
            JSch jsch = new JSch();
            jsch.setKnownHosts("~/.ssh/known_hosts");
            java.util.Properties config = new java.util.Properties();
            config.put("StrictHostKeyChecking", "no");
            Session jschSession = jsch.getSession("", "", 22);
            jschSession.setPassword("");
            jschSession.setConfig(config);
            jschSession.connect();
            return (ChannelSftp) jschSession.openChannel("sftp");
        } catch (JSchException exception) {
            System.out.println(exception.getMessage());
            return null;
        }
    }
}
