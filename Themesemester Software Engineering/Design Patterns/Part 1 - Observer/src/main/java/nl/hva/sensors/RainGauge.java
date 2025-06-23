package nl.hva.sensors;

import java.util.Random;

public class RainGauge extends Sensor {

    @Override
    public void takeMeasurement() {
        float leftLimit = 0F;
        float rightLimit = 100F;
        value = leftLimit + new Random().nextFloat() * (rightLimit - leftLimit);
    }

    @Override
    public String toString() {
        return "RainGauge{" +
                "value=" + df.format(value) +
                " mm}";
    }
}
