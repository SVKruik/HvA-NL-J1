package nl.hva.shops;

import nl.hva.computers.Computer;
import nl.hva.computers.ComputerTypes;

public class ComputerMegaStore {
    public static void main(String args[]) {
        ComputerShop intelShop = new IntelComputerShop();
        ComputerShop amdShop = new AMDComputerShop();

        Computer intelBasic = intelShop.prepareComputer(ComputerTypes.BASIC_COMPUTER);
        Computer amdBasic = amdShop.prepareComputer(ComputerTypes.BASIC_COMPUTER);

        System.out.println(intelBasic);
        System.out.println(amdBasic);
    }
}
