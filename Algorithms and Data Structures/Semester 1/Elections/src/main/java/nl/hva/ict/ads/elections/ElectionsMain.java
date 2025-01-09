package nl.hva.ict.ads.elections;

import nl.hva.ict.ads.elections.models.Election;
import nl.hva.ict.ads.utils.PathUtils;

import javax.xml.stream.XMLStreamException;
import java.io.IOException;

public class ElectionsMain {

    public static void main(String[] args) throws XMLStreamException, IOException {

        final int CDA_PARTY_ID = 3;
        final int D66_PARTY_ID = 4;
        final int CODE_ORANJE_PARTY_ID = 16;
        final int VOLT_PARTY_ID = 17;

        // final Election election = Election.importFromDataFolder(PathUtils.getResourcePath("/EML_bestanden_TK2021_HvA_UvA"));
        final Election election = Election.importFromDataFolder(PathUtils.getResourcePath("/EML_bestanden_TK2021"));

        final int randomPartyId = 1 + (int) Math.floor(Math.random() * election.getParties().size());
        System.out.println(election.prepareSummary());
        System.out.println(election.prepareSummary(randomPartyId));
    }
}
