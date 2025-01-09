package nl.hva.ict.ads.elections;

import nl.hva.ict.ads.elections.models.Election;
import nl.hva.ict.ads.utils.PathUtils;

import javax.xml.stream.XMLStreamException;
import java.io.IOException;

public class ElectionsMain {

    public static void main(String[] args) throws XMLStreamException, IOException {

        final int VOLT_PARTY_ID = 10;

        // Switch between full and testing data set.
        final Election election = Election.importFromDataFolder(PathUtils.getResourcePath("/EML_bestanden_TK2023"));
        // final Election election = Election.importFromDataFolder(PathUtils.getResourcePath("/EML_bestanden_TK2023_HvA_UvA"));

        System.out.println(election.prepareSummary());
        System.out.println(election.prepareSummary(VOLT_PARTY_ID));
    }
}
