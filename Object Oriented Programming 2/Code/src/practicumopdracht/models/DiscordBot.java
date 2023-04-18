package practicumopdracht.models;

import java.io.Serializable;

public class DiscordBot implements Serializable {
    private Customer belongsTo;
    private String name;
    private String accentColor;
    private int clientId;
    private String host;
    private double hostingPriceHour;
    private int port;
    private boolean autoRestart;
    private int memory;

    public DiscordBot(Customer belongsTo, String name, String accentColor, int clientId, String host,
                      double hostingPriceHour, int port, boolean autoRestart, int memory) {
        this.belongsTo = belongsTo;
        this.name = name;
        this.accentColor = accentColor;
        this.clientId = clientId;
        this.host = host;
        this.hostingPriceHour = hostingPriceHour;
        this.port = port;
        this.autoRestart = autoRestart;
        this.memory = memory;
    }

    public Customer getBelongsTo() {
        return this.belongsTo;
    }

    public void setBelongsTo(Customer belongsTo) {
        this.belongsTo = belongsTo;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAccentColor() {
        return this.accentColor;
    }

    public void setAccentColor(String accentColor) {
        this.accentColor = accentColor;
    }

    public int getMemory() {
        return memory;
    }

    public void setMemory(int memory) {
        this.memory = memory;
    }

    public int getClientId() {
        return this.clientId;
    }

    public void setClientId(int clientId) {
        this.clientId = clientId;
    }

    public String getHost() {
        return this.host;
    }

    public void setHost(String host) {
        this.host = host;
    }

    public double getHostingPriceHour() {
        return this.hostingPriceHour;
    }

    public void setHostingPriceHour(double hostingPriceHour) {
        this.hostingPriceHour = hostingPriceHour;
    }

    public int getPort() {
        return this.port;
    }

    public void setPort(int port) {
        this.port = port;
    }

    public boolean getAutoRestart() {
        return this.autoRestart;
    }

    public void setAutoRestart(boolean autoRestart) {
        this.autoRestart = autoRestart;
    }

    @Override
    public String toString() {
        return this.name;
    }
}
