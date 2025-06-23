package nl.hva.sensors;

import java.util.Random;

public class Anemometer extends Sensor {

    @Override
    public void takeMeasurement() {
        float leftLimit = 0F;
        float rightLimit = 80F;
        value = leftLimit + new Random().nextFloat() * (rightLimit - leftLimit);
    }

    @Override
    public float getMeasurement() {
        return super.getMeasurement();
    }

    @Override
    public String toString() {
        return "Anemometer{" +
                "value=" + df.format(value) +
                " knots}";
    }
}
