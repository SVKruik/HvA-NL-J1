package maze_escape;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class DijkstraShortestPathTest {
    private static final double DELTA = 100;

    @Test
    public void testDijkstraShortestPathTypicalCase() {
        Maze maze = new Maze(500, 500);
        maze.generateRandomizedPrim();
        maze.configureInnerEntry();
        maze.removeRandomWalls(1000);

        Maze.GPath path = maze.dijkstraShortestPath(maze.getStartNode(), maze.getExitNode(), maze::manhattanTime);
        assertNotNull(path, "Dijkstra's path should not be null");
        assertFalse(path.getVertices().isEmpty(), "Dijkstra's path should not be empty");
        assertEquals(maze.getStartNode(), path.getVertices().peek(), "First node of Dijkstra's path should be start node");

        Integer lastNode = null;
        for (Integer node : path.getVertices()) {
            lastNode = node;
        }

        assertEquals(maze.getExitNode(), lastNode, "Last node of Dijkstra's path should be exit node");
    }

    @Test
    public void testDijkstraShortestPathAccuracy() {
        Maze maze = new Maze(100, 100);
        maze.generateRandomizedPrim();
        maze.configureInnerEntry();
        maze.removeRandomWalls(250);

        Maze.GPath path = maze.dijkstraShortestPath(maze.getStartNode(), maze.getExitNode(), maze::manhattanTime);
        double expectedWeight = 225.00;
        assertEquals(expectedWeight, path.getTotalWeight(), DELTA, "Dijkstra's path weight should match the expected shortest path weight");
    }

    @Test
    public void testDijkstraShortestPathNoPath() {
        Maze maze = new Maze(150, 150);
        maze.generateRandomizedPrim();

        Maze.GPath path = maze.dijkstraShortestPath(null, null, maze::manhattanTime);
        assertNull(path, "Dijkstra's path should be null for no path");
    }
}