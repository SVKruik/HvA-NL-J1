package nl.hva.sensors;

import java.util.Random;

public class Hygrometer extends Sensor {

    @Override
    public void takeMeasurement() {
        float leftLimit = 0F;
        float rightLimit = 100F;
        value = leftLimit + new Random().nextFloat() * (rightLimit - leftLimit);
    }

    @Override
    public String toString() {
        return "Hygrometer{" +
                "value=" + df.format(value) +
                "%}";
    }
}
