package nl.hva.observablestation;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.io.ByteArrayOutputStream;
import java.io.PrintStream;

import static org.junit.jupiter.api.Assertions.*;

public class ObservableWeatherStationTest {

    ObservableWeatherStation observableWeatherStation;
    WeatherDisplay livingRoomDisplay;
    WeatherDisplay bedroomDisplay;

    private final PrintStream standardOut = System.out;
    private final ByteArrayOutputStream outputStreamCaptor = new ByteArrayOutputStream();

    @BeforeEach
    void setUp() {
        observableWeatherStation = new ObservableWeatherStation();
        livingRoomDisplay = new WeatherDisplay("Living Room");
        bedroomDisplay = new WeatherDisplay("Bedroom");
        System.setOut(new PrintStream(outputStreamCaptor));
    }

    @AfterEach
    public void tearDown() {
        System.setOut(standardOut);
    }

    @Test
    void weatherStation_implements_Subject() {
        assertTrue(observableWeatherStation instanceof Subject);
    }

    @Test
    void display_implements_observer() {
        assertTrue(livingRoomDisplay instanceof Observer);
    }

    @Test
    void constructed_station_has_no_observers() {
        assertEquals(0, observableWeatherStation.getNumberOfObservers());

    }

    @Test
    void station_with_no_observers_prints_nothing() {

        observableWeatherStation.checkSensors();

        assertEquals("", outputStreamCaptor.toString());
    }

    @Test
    void observer_can_be_registered() {
        observableWeatherStation.registerObserver(bedroomDisplay);
        observableWeatherStation.registerObserver(livingRoomDisplay);

        assertEquals(2, observableWeatherStation.getNumberOfObservers());
    }

    @Test
    void observer_can_be_deregistered() {
        observableWeatherStation.registerObserver(bedroomDisplay);
        observableWeatherStation.registerObserver(livingRoomDisplay);
        observableWeatherStation.removeObserver(livingRoomDisplay);

        assertEquals(1, observableWeatherStation.getNumberOfObservers());
    }

    @Test
    void display_reports_its_name() {
        observableWeatherStation.registerObserver(bedroomDisplay);
        observableWeatherStation.checkSensors();

        assertTrue(outputStreamCaptor.toString().contains("Bedroom"));
    }

    @Test
    void display_deregistration_removes_name() {
        observableWeatherStation.registerObserver(bedroomDisplay);
        observableWeatherStation.checkSensors();
        observableWeatherStation.removeObserver(bedroomDisplay);
        outputStreamCaptor.reset();
        observableWeatherStation.checkSensors();

        assertFalse(outputStreamCaptor.toString().contains("Bedroom"));
    }
}
