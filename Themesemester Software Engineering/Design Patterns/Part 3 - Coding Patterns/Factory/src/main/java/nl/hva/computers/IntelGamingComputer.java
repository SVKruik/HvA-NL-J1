package nl.hva.computers;

import nl.hva.factories.IntelGamingComputerComponentFactory;

public class IntelGamingComputer extends Computer {

    public IntelGamingComputer() {
        super(new IntelGamingComputerComponentFactory());
        super.setName("Intel Gaming PC");
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
