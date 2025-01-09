package maze_escape;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class BreadthFirstSearchTest {
    @Test
    public void testBreadthFirstSearchTypicalCase() {
        Maze maze = new Maze(100, 100);
        maze.generateRandomizedPrim();
        maze.configureInnerEntry();
        maze.removeRandomWalls(250);

        Maze.GPath path = maze.breadthFirstSearch(maze.getStartNode(), maze.getExitNode());
        assertNotNull(path, "BFS path should not be null");
        assertFalse(path.getVertices().isEmpty(), "BFS path should not be empty");
        assertEquals(maze.getStartNode(), path.getVertices().peek(), "First node of BFS path should be start node");

        Integer lastNode = null;
        for (Integer node : path.getVertices()) {
            lastNode = node;
        }

        assertEquals(maze.getExitNode(), lastNode, "Last node of BFS path should be exit node");
    }

    @Test
    public void testBreadthFirstSearchPerformance() {
        Maze maze = new Maze(2000, 2000);
        maze.generateRandomizedPrim();
        maze.configureInnerEntry();
        maze.removeRandomWalls(4000);

        long startTime = System.currentTimeMillis();
        Maze.GPath path = maze.breadthFirstSearch(maze.getStartNode(), maze.getExitNode());
        long endTime = System.currentTimeMillis();
        long duration = endTime - startTime;

        assertTrue(duration < 5_000, "BFS should complete in a reasonable time");
    }

}