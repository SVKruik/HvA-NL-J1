package spotifycharts;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Random;
import java.util.function.Consumer;

public class SortingEfficiencyTest {
    private static final int MAX_SIZE = 5000000; // The maximum size of the song list
    private static final long MAX_TIME_MILLIS = 20000; // The maximum allowed time for sorting in milliseconds

    /**
     * Main method to run the sorting efficiency tests.
     */
    public static void main(String[] args) {
        SorterImpl<Song> sorter = new SorterImpl<>();
        Comparator<Song> comparator = Comparator.comparing(Song::getStreamsCountTotal);

        for (int size = 100; size <= MAX_SIZE && size <= MAX_TIME_MILLIS; size *= 2) {
            List<Song> baseList = createRandomSongList(size);

            System.out.println("Testing with list size: " + size);

            // Test and calculate average time for selInsBubSort
            double avgTimeSelInsBubSort = testSortingPerformance(baseList, (songs) -> sorter.selInsBubSort(songs, comparator));
            // Test and calculate average time for quickSort
            double avgTimeQuickSort = testSortingPerformance(baseList, (songs) -> sorter.quickSort(songs, comparator));
            // Test and calculate average time for topsHeapSort
            int finalSize = size;
            double avgTimeTopsHeapSort = testSortingPerformance(baseList, (songs) -> sorter.topsHeapSort(finalSize, songs, comparator));

            System.out.println("Average Time selInsBubSort: " + avgTimeSelInsBubSort + "ms");
            System.out.println("Average Time quickSort: " + avgTimeQuickSort + "ms");
            System.out.println("Average Time topsHeapSort: " + avgTimeTopsHeapSort + "ms");
        }
    }

    /**
     * Tests the performance of a given sorting method on a list of songs.
     *
     * @param baseList      The base list of songs to be sorted.
     * @param sortingMethod The sorting method to be tested.
     * @return The average time taken for sorting in milliseconds.
     */
    private static double testSortingPerformance(List<Song> baseList, Consumer<List<Song>> sortingMethod) {
        long totalTime = 0;

        for (int i = 0; i < 10; i++) {
            List<Song> testList = new ArrayList<>(baseList);
            System.gc(); // Minimize garbage collection impact

            long startTime = System.currentTimeMillis();
            sortingMethod.accept(testList);
            long endTime = System.currentTimeMillis();

            totalTime += (endTime - startTime);
        }

        return totalTime / 10.0;
    }

    /**
     * Creates a list of songs using predefined titles from SongBuilder.
     *
     * @param size The number of songs in the list.
     * @return A list of songs created from predefined titles.
     */
    private static List<Song> createRandomSongList(int size) {
        List<Song> songs = new ArrayList<>();
        SongBuilder.reSeed(2L); // fixed seed value

        for (int i = 0; i < size; i++) {
            Song song = SongBuilder.createSample(i);
            songs.add(song);
            // The streams per country are randomly assigned
            randomizeStreamCounts(song);
        }

        System.out.println(songs);

        return songs;
    }

    /**
     * Randomizes the streams per country for a given song.
     *
     * @param song The song to randomize streams for.
     */
    private static void randomizeStreamCounts(Song song) {
        Random random = new Random();
        for (Song.Country country : Song.Country.values()) {
            song.setStreamsCountOfCountry(country, random.nextInt(1000));
        }
    }
}