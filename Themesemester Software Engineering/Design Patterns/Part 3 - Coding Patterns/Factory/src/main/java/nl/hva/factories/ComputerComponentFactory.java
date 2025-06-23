package nl.hva.factories;

import nl.hva.components.*;

public interface ComputerComponentFactory {
        ComputerCase selectCase();

        PowerSupply selectPowerSupply();

        Processor selectProcessor();

        MotherBoard selectMotherBoard();

        Memory[] selectMemory();

        GraphicsCard selectGraphicsCard();

        /**
         * This allows the configuration of a computer with variable storage options.
         * 
         * @param type
         * @return the storage types configured for this computer. An example might be
         *         one SSD and one HardDrive
         */
        Storage[] selectStorage(StorageType... type);
}
