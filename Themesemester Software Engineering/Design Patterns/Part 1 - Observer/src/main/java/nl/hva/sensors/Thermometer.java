package nl.hva.sensors;

import java.util.Random;

public class Thermometer extends Sensor {

    @Override
    public void takeMeasurement() {
        float leftLimit = -30F;
        float rightLimit = 50F;
        value = leftLimit + new Random().nextFloat() * (rightLimit - leftLimit);
    }

    @Override
    public String toString() {
        return "Thermometer{" +
                "value=" + df.format(value) +
                " degrees C}";
    }
}
