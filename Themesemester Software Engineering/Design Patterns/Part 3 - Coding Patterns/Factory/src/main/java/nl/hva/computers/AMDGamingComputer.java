package nl.hva.computers;

import nl.hva.factories.AMDGamingComputerComponentFactory;

public class AMDGamingComputer extends Computer {

    public AMDGamingComputer() {
        super(new AMDGamingComputerComponentFactory());
        super.setName("AMD Gaming PC");
    }

    @Override
    public void prepare() {
        System.out.println("Building " + super.getName());

        super.computerCase = super.computerComponentFactory.selectCase();
        super.motherBoard = super.computerComponentFactory.selectMotherBoard();
        super.processor = super.computerComponentFactory.selectProcessor();
        super.memory = super.computerComponentFactory.selectMemory();
        super.storage = super.computerComponentFactory.selectStorage();
        super.graphicsCard = super.computerComponentFactory.selectGraphicsCard();
        super.powerSupply = super.computerComponentFactory.selectPowerSupply();
    }
}
