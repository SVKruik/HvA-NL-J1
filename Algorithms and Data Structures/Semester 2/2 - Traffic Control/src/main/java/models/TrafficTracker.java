package models;

import java.io.File;
import java.io.FileNotFoundException;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.*;
import java.util.function.Function;

public class TrafficTracker {
    private final String TRAFFIC_FILE_EXTENSION = ".txt";
    private final String TRAFFIC_FILE_PATTERN = ".+\\" + TRAFFIC_FILE_EXTENSION;

    private final OrderedList<Car> cars;                  // the reference list of all known Cars registered by the RDW
    private final OrderedList<Violation> violations;      // the accumulation of all offences by car and by city

    public TrafficTracker() {
        cars = new OrderedArrayList<>(Comparator.comparing(Car::getLicensePlate));
        violations = new OrderedArrayList<>(Violation::compareByLicensePlateAndCity);
    }

    /**
     * imports a collection of items from a text file which provides one line for each item
     *
     * @param items     the list to which imported items shall be added
     * @param file      the source text file
     * @param converter a function that can convert a text line into a new item instance
     * @param <E>       the (generic) type of each item
     */
    public static <E> int importItemsFromFile(List<E> items, File file, Function<String, E> converter) {
        int numberOfLines = 0;
        Scanner scanner = createFileScanner(file);

        while (scanner.hasNext()) {
            String line = scanner.nextLine();
            numberOfLines++;

            // Convert & Add
            E item = converter.apply(line);
            if (item != null) items.add(item);
        }

        return numberOfLines;
    }

    /**
     * Helper method to create a scanner on a file and handle the exception.
     *
     * @param file
     * @return
     */
    private static Scanner createFileScanner(File file) {
        try {
            return new Scanner(file);
        } catch (FileNotFoundException e) {
            throw new RuntimeException("FileNotFound exception on path: " + file.getPath());
        }
    }

    private static File createFileFromURL(URL url) {
        try {
            return new File(url.toURI().getPath());
        } catch (URISyntaxException e) {
            throw new RuntimeException("URI syntax error found on URL: " + url.getPath());
        }
    }

    /**
     * imports all registered cars from a resource file that has been provided by the RDW
     *
     * @param resourceName
     */
    public void importCarsFromVault(String resourceName) {
        this.cars.clear();
        URL resource = TrafficTracker.class.getResource(resourceName);
        if (resource == null) return;
        int numberOfLines = importItemsFromFile(this.cars,
                createFileFromURL(resource),
                Car::fromLine);
        this.cars.sort();
        System.out.printf("Imported %d cars from %d lines in %s.\n", this.cars.size(), numberOfLines, resourceName);
    }

    /**
     * imports and merges all raw detection data of all entry gates of all cities from the hierarchical file structure of the vault
     * accumulates any offences against purple rules into this.violations
     *
     * @param resourceName
     */
    public void importDetectionsFromVault(String resourceName) {
        this.violations.clear();

        URL resource = TrafficTracker.class.getResource(resourceName);
        if (resource == null) return;
        int totalNumberOfOffences = this.mergeDetectionsFromVaultRecursively(createFileFromURL(resource));

        System.out.printf("Found %d offences among detections imported from files in %s.\n",
                totalNumberOfOffences, resourceName);
    }

    /**
     * traverses the detections vault recursively and processes every data file that it finds
     *
     * @param file The single file or directory to process.
     */
    private int mergeDetectionsFromVaultRecursively(File file) {
        int totalNumberOfOffences = 0;

        if (file.isDirectory()) {
            // Retrieve all files.
            File[] filesInDirectory = Objects.requireNonNullElse(file.listFiles(), new File[0]);

            for (File subFile : filesInDirectory) {
                totalNumberOfOffences += mergeDetectionsFromVaultRecursively(subFile);
            }
        } else if (file.getName().matches(TRAFFIC_FILE_PATTERN)) {
            // Single file, process directly.
            totalNumberOfOffences += this.mergeDetectionsFromFile(file);
        }

        return totalNumberOfOffences;
    }

    /**
     * Imports traffic violation data from the specified file, validates against "purple car" criteria,
     * and merges violations with existing data.
     *
     * @param file The file containing traffic violation data to be imported.
     * @return The total number of offences found and processed from the data in the file.
     */
    private int mergeDetectionsFromFile(File file) {
        this.violations.sort();
        int totalNumberOfOffences = 0;

        List<Detection> newDetections = new ArrayList<>();
        importItemsFromFile(newDetections, file, line -> Detection.fromLine(line, cars));
        System.out.printf("Imported %d detections from %s.\n", newDetections.size(), file.getPath());

        for (Detection detection : newDetections) {
            Violation violation = detection.validatePurple();
            if (violation != null) {
                this.getViolations().merge(violation, Violation::combineOffencesCounts);
                totalNumberOfOffences++;
            }
        }

        return totalNumberOfOffences;
    }

    /**
     * calculates the total revenue of fines from all violations,
     * Trucks pay €25 per offence, Coaches €35 per offence
     *
     * @return the total amount of money recovered from all violations
     */
    public double calculateTotalFines() {
        return this.violations.aggregate(violation -> {
            if (violation.getCar().getCarType() == Car.CarType.Truck) {
                return 25.0;
            } else if (violation.getCar().getCarType() == Car.CarType.Coach) {
                return 35.0;
            }
            return 0.0;
        });
    }

    /**
     * Prepares a list of topNumber of violations that show the highest offencesCount
     * when this.violations are aggregated by car across all cities.
     *
     * @param topNumber the requested top number of violations in the result list
     * @return a list of topNum items that provides the top aggregated violations
     */
    public List<Violation> topViolationsByCar(int topNumber) {
        return this.topViolations(topNumber, Comparator.comparing(Violation::getCar));
    }

    /**
     * Prepares a list of topNumber of violations that show the highest offencesCount
     * when this.violations are aggregated by city across all cars.
     *
     * @param topNumber the requested top number of violations in the result list
     * @return a list of topNum items that provides the top aggregated violations
     */
    public List<Violation> topViolationsByCity(int topNumber) {
        return this.topViolations(topNumber, Comparator.comparing(Violation::getCity));
    }

    /**
     * Generic top violations method.
     *
     * @param topNumber the requested top number of violations in the result list
     * @param type      the comparator to use to order the array.
     * @return a list of topNum items that provides the top aggregated violations
     */
    private List<Violation> topViolations(int topNumber, Comparator<Violation> type) {
        OrderedArrayList<Violation> violations = new OrderedArrayList<>(type);
        violations.addAll(this.violations);
        violations.sort(Comparator.comparingInt(Violation::getOffencesCount).reversed());
        return violations.subList(0, Math.min(topNumber, violations.size()));
    }

    public OrderedList<Car> getCars() {
        return this.cars;
    }

    public OrderedList<Violation> getViolations() {
        return this.violations;
    }
}
