package nl.hva.sensors;

import java.text.DecimalFormat;

public abstract class Sensor {
    public static final DecimalFormat df = new DecimalFormat("0.00");
    float value;

    public Sensor() {
    }

    public abstract void takeMeasurement();

    public float getMeasurement() {
        return value;
    }
}
