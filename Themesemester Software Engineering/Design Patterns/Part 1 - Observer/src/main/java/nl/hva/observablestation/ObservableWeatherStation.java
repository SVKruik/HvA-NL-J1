package nl.hva.observablestation;

import java.util.ArrayList;

import nl.hva.sensors.Anemometer;
import nl.hva.sensors.Hygrometer;
import nl.hva.sensors.RainGauge;
import nl.hva.sensors.Sensor;
import nl.hva.sensors.Thermometer;

public class ObservableWeatherStation implements Subject {
    private ArrayList<Observer> observers;
    private ArrayList<String> measurements;
    private final ArrayList<Sensor> sensors = new ArrayList<>();

    public ObservableWeatherStation() {
        this.observers = new ArrayList<>();

        this.sensors.add(new RainGauge());
        this.sensors.add(new Thermometer());
        this.sensors.add(new Hygrometer());
        this.sensors.add(new Anemometer());
    }

    /**
     * Check all sensors and notify all observers.
     */
    public void checkSensors() {
        if (this.observers.size() == 0) {
            return;
        }

        this.measurements = new ArrayList<>();
        for (Sensor sensor : sensors) {
            sensor.takeMeasurement();
            this.measurements.add(sensor.toString());
        }

        this.notifyObservers();
    }

    /**
     * Register an observer to the list of observers.
     */
    @Override
    public void registerObserver(Observer observer) {
        this.observers.add(observer);
    }

    /**
     * Remove an observer from the list of observers.
     */
    @Override
    public void removeObserver(Observer observer) {
        this.observers.remove(observer);
    }

    /**
     * Notify all observers of the changes.
     */
    @Override
    public void notifyObservers() {
        for (Observer observer : observers) {
            observer.update(this.measurements);
        }
    }

    /**
     * Get the number of listening observers.
     * 
     * @return The number of listening observers.
     */
    public int getNumberOfObservers() {
        return this.observers.size();
    }
}