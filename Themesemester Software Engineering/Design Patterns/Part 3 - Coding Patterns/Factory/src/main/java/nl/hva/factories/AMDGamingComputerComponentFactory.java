package nl.hva.factories;

import nl.hva.components.*;

public class AMDGamingComputerComponentFactory implements ComputerComponentFactory {

    @Override
    public ComputerCase selectCase() {
        return null;
    }

    @Override
    public PowerSupply selectPowerSupply() {
        return null;
    }

    @Override
    public Processor selectProcessor() {
        return null;
    }

    @Override
    public MotherBoard selectMotherBoard() {
        return null;
    }

    @Override
    public Memory[] selectMemory() {
        return null;
    }

    @Override
    public GraphicsCard selectGraphicsCard() {
        return null;
    }

    @Override
    public Storage[] selectStorage(StorageType... types) {
        return null;
    }
}
