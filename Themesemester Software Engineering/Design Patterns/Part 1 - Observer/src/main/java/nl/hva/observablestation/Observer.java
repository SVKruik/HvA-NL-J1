package nl.hva.observablestation;

import java.util.ArrayList;

public interface Observer {
    void update(ArrayList<String> measurements);
}
