package nl.hva.factories;

import nl.hva.components.*;

public class IntelBasicComputerComponentFactory implements ComputerComponentFactory {

    @Override
    public ComputerCase selectCase() {
        return new BasicComputerCase();
    }

    @Override
    public PowerSupply selectPowerSupply() {
        return new BasicPowerSupply();
    }

    @Override
    public Processor selectProcessor() {
        return new IntelProcessor();
    }

    @Override
    public MotherBoard selectMotherBoard() {
        return new IntelMotherBoard();
    }

    @Override
    public Memory[] selectMemory() {
        return new Memory[] { new FourGBRam(), new FourGBRam() };
    }

    @Override
    public GraphicsCard selectGraphicsCard() {
        return null;
    }

    @Override
    public Storage[] selectStorage(StorageType... types) {
        if (types.length == 0)
            return new Storage[] { new HardDrive() };

        Storage[] storages = new Storage[types.length];
        for (int i = 0; i < types.length; i++) {
            switch (types[i]) {
                case HardDrive:
                    storages[i] = new HardDrive();
                    break;
                case SolidStateDrive:
                    storages[i] = new SSD();
                    break;
            }
        }
        return storages;
    }
}
