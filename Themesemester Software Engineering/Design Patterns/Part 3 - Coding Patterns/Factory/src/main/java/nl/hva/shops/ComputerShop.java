package nl.hva.shops;

import nl.hva.computers.Computer;

public abstract class ComputerShop {
    protected abstract Computer buildComputer(String computerType);

    protected Computer prepareComputer(String computerType) {
        Computer computer = buildComputer(computerType);
        System.out.println("--- Making an " + computer.getName() + " ---");
        computer.prepare();
        computer.bootUpTest();
        computer.burnInTest();
        computer.box();
        return computer;
    }
}
