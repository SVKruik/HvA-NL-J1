package maze_escape;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class DepthFirstSearchTest {
    @Test
    public void testDepthFirstSearchTypicalCase() {
        Maze maze = new Maze(100, 100);
        maze.generateRandomizedPrim();
        maze.configureInnerEntry();
        maze.removeRandomWalls(250);

        Maze.GPath path = maze.depthFirstSearch(maze.getStartNode(), maze.getExitNode());
        assertNotNull(path, "DFS path should not be null");
        assertFalse(path.getVertices().isEmpty(), "DFS path should not be empty");
        assertEquals(maze.getStartNode(), path.getVertices().peek(), "First node of DFS path should be start node");

        // Finding the last node in the path
        Integer lastNode = null;
        for (Integer node : path.getVertices()) {
            lastNode = node;
        }

        assertEquals(maze.getExitNode(), lastNode, "Last node of DFS path should be exit node");
    }

    @Test
    public void testDepthFirstSearchNoPath() {
        Maze maze = new Maze(150, 150);
        maze.generateRandomizedPrim();

        Maze.GPath path = maze.depthFirstSearch(null, null);
        assertNull(path, "DFS should return null for no path");
    }
}