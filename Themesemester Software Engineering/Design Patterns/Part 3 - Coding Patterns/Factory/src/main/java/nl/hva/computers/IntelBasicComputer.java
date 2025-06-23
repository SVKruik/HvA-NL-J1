package nl.hva.computers;

import nl.hva.factories.IntelBasicComputerComponentFactory;

public class IntelBasicComputer extends Computer {
    public IntelBasicComputer() {
        super(new IntelBasicComputerComponentFactory());
        super.setName("Intel Basic PC");
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
