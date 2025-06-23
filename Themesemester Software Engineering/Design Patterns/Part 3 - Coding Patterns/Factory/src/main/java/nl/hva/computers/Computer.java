package nl.hva.computers;

import nl.hva.components.*;
import nl.hva.factories.ComputerComponentFactory;

/**
 * This
 */
public abstract class Computer {
    ComputerComponentFactory computerComponentFactory;
    String name;
    ComputerCase computerCase;
    MotherBoard motherBoard;
    Processor processor;
    Memory[] memory;
    Storage[] storage;
    GraphicsCard graphicsCard;
    PowerSupply powerSupply;

    public Computer(ComputerComponentFactory factory) {
        computerComponentFactory = factory;
    }

    public abstract void prepare();

    public void burnInTest() {
        System.out.println("Running the computer for 60 minutes");
    }

    public void bootUpTest() {
        System.out.println("Boot up test");
    }

    public void box() {
        System.out.println("Place computer in computer shop box");
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getName() {
        return this.name;
    }

    public String toString() {
        StringBuffer result = new StringBuffer();
        result.append("---- " + name + " ----\n");
        if (computerCase != null) {
            result.append(computerCase.getDetails());
            result.append("\n");
        }
        if (powerSupply != null) {
            result.append(powerSupply.getDetails());
            result.append("\n");
        }
        if (motherBoard != null) {
            result.append(motherBoard.getDetails());
            result.append("\n");
        }
        if (processor != null) {
            result.append(processor.getDetails());
            result.append("\n");
        }
        if (graphicsCard != null) {
            result.append(graphicsCard.getDetails());
            result.append("\n");
        }
        if (memory != null) {
            for (int i = 0; i < memory.length; i++) {
                result.append(memory[i].getDetails());
                if (i < memory.length - 1) {
                    result.append(", ");
                }
            }
            result.append("\n");
        }

        if (storage != null) {
            for (int i = 0; i < storage.length; i++) {
                result.append(storage[i].getDetails());
                if (i < storage.length - 1) {
                    result.append(", ");
                }
            }
            result.append("\n");
        }
        return result.toString();
    }

    public ComputerCase getComputerCase() {
        return computerCase;
    }

    public MotherBoard getMotherBoard() {
        return motherBoard;
    }

    public Processor getProcessor() {
        return processor;
    }

    public Memory[] getMemory() {
        return memory;
    }

    public Storage[] getStorage() {
        return storage;
    }

    public GraphicsCard getGraphicsCard() {
        return graphicsCard;
    }

    public PowerSupply getPowerSupply() {
        return powerSupply;
    }
}
