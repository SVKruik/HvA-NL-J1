package nl.hva.shops;

import nl.hva.computers.Computer;
import nl.hva.computers.ComputerTypes;
import nl.hva.computers.IntelBasicComputer;
import nl.hva.computers.IntelGamingComputer;

public class IntelComputerShop extends ComputerShop {

    @Override
    public Computer buildComputer(String computerType) {
        switch (computerType) {
            case ComputerTypes.BASIC_COMPUTER:
                return new IntelBasicComputer();
            case ComputerTypes.GAMING_COMPUTER:
                return new IntelGamingComputer();
            default:
                return null;
        }
    }
}
