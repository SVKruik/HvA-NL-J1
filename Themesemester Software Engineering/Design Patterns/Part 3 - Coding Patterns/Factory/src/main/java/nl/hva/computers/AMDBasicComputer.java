package nl.hva.computers;

import nl.hva.factories.AMDBasicComputerComponentFactory;

public class AMDBasicComputer extends Computer {

    public AMDBasicComputer() {
        super(new AMDBasicComputerComponentFactory());
        super.setName("AMD Basic PC");
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
