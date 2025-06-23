package nl.hva.observablestation;

import java.util.ArrayList;

public class WeatherDisplay implements Observer {
    private String name;
    private ArrayList<String> measurements;

    public WeatherDisplay(String name) {
        this.name = name;
    }

    /**
     * Update the measurements and display them.
     */
    @Override
    public void update(ArrayList<String> measurements) {
        this.measurements = measurements;
        this.display();
    }

    /**
     * Display the measurements.
     */
    public void display() {
        System.out.println(this.name);
        System.out.println("Current weather is:\n");
        for (String measurement : this.measurements) {
            System.out.println(measurement);
        }
    }

    public String getName() {
        return this.name;
    }
}
