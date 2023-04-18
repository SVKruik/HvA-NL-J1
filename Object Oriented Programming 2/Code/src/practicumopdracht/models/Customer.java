package practicumopdracht.models;

import java.io.Serializable;
import java.time.LocalDate;

public class Customer implements Serializable {
    private String name;
    private String profileName;
    private boolean verified;
    private String language;
    private LocalDate createdOn;
    private String description;

    public Customer(String name, String profileName, boolean verified, String language, LocalDate createdOn, String description) {
        this.name = name;
        this.profileName = profileName;
        this.verified = verified;
        this.language = language;
        this.createdOn = createdOn;
        this.description = description;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getProfileName() {
        return this.profileName;
    }

    public void setProfileName(String profileName) {
        this.profileName = profileName;
    }

    public boolean getVerified() {
        return this.verified;
    }

    public void setVerified(boolean verified) {
        this.verified = verified;
    }

    public String getLanguage() {
        return this.language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public LocalDate getCreatedOn() {
        return this.createdOn;
    }

    public void setCreatedOn(LocalDate createdOn) {
        this.createdOn = createdOn;
    }

    public String getDescription() {
        return this.description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    // The label for the profile ListView item
    @Override
    public String toString() {
        return this.profileName;
    }
}
