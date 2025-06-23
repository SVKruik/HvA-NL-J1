package tse.cicd.Models;

import tse.cicd.Helpers.BSNHelper;

/**
 * Model for a BSN.
 */
public class BSN {
    private String bsn;

    public BSN(String bsn) {
        this.bsn = bsn;
    }

    public String getBsn() {
        return bsn;
    }

    public void setBsn(String bsn) {
        this.bsn = bsn;
    }

    public boolean isValid() {
        return new BSNHelper().validate(bsn) == BsnValidationMessage.VALID;
    }
}
