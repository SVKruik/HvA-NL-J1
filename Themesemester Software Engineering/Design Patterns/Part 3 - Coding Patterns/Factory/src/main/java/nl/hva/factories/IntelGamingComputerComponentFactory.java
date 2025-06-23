package nl.hva.factories;

import nl.hva.components.*;

public class IntelGamingComputerComponentFactory implements ComputerComponentFactory {

    @Override
    public ComputerCase selectCase() {
        return new GamingComputerCase();
    }

    @Override
    public PowerSupply selectPowerSupply() {
        return new GamingPowerSupply();
    }

    @Override
    public Processor selectProcessor() {
        return new IntelFastProcessor();
    }

    @Override
    public MotherBoard selectMotherBoard() {
        return new IntelMotherBoard();
    }

    @Override
    public Memory[] selectMemory() {
        return new Memory[] { new EightGBRam(), new EightGBRam(), new EightGBRam(), new EightGBRam() };
    }

    @Override
    public GraphicsCard selectGraphicsCard() {
        return new NVidiaGraphicsCard();
    }

    @Override
    public Storage[] selectStorage(StorageType... types) {
        if (types.length == 0)
            return new Storage[] { new SSD(), new HardDrive() };

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
