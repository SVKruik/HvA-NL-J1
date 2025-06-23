package nl.hva.shops;

import nl.hva.computers.Computer;
import nl.hva.computers.ComputerTypes;
import nl.hva.computers.AMDBasicComputer;
import nl.hva.computers.AMDGamingComputer;

public class AMDComputerShop extends ComputerShop {

    @Override
    public Computer buildComputer(String computerType) {
        switch (computerType) {
            case ComputerTypes.BASIC_COMPUTER:
                return new AMDBasicComputer();
            case ComputerTypes.GAMING_COMPUTER:
                return new AMDGamingComputer();
            default:
                return null;
        }
    }
}
