package maze_escape;

import java.util.*;
import java.util.function.BiFunction;

public abstract class AbstractGraph<V> {

    /**
     * Graph representation:
     * this class implements graph search algorithms on a graph with abstract vertex type V
     * for every vertex in the graph, its neighbours can be found by use of abstract method getNeighbours(fromVertex)
     * this abstraction can be used for both directed and undirected graphs
     **/

    public AbstractGraph() {
    }

    /**
     * retrieves all neighbours of the given fromVertex
     * if the graph is directed, the implementation of this method shall follow the outgoing edges of fromVertex
     *
     * @param fromVertex
     * @return
     */
    public abstract Set<V> getNeighbours(V fromVertex);

    /**
     * retrieves all vertices that can be reached directly or indirectly from the given firstVertex
     * if the graph is directed, only outgoing edges shall be traversed
     * firstVertex shall be included in the result as well
     * if the graph is connected, all vertices shall be found
     *
     * @param firstVertex the start vertex for the retrieval
     * @return
     */
    public Set<V> getAllVertices(V firstVertex) {
        Set<V> visited = new HashSet<>();
        Deque<V> stack = new ArrayDeque<>();
        stack.push(firstVertex);

        while (!stack.isEmpty()) {
            V current = stack.pop();
            if (!visited.contains(current)) {
                visited.add(current);
                for (V neighbor : getNeighbours(current)) {
                    stack.push(neighbor);
                }
            }
        }

        return visited;
    }

    /**
     * Formats the adjacency list of the subgraph starting at the given firstVertex
     * according to the format:
     * vertex1: [neighbour11,neighbour12,…]
     * vertex2: [neighbour21,neighbour22,…]
     * …
     * Uses a pre-order traversal of a spanning tree of the sub-graph starting with firstVertex as the root
     * if the graph is directed, only outgoing edges shall be traversed
     * , and using the getNeighbours() method to retrieve the roots of the child subtrees.
     *
     * @param firstVertex
     * @return
     */
    public String formatAdjacencyList(V firstVertex) {
        StringBuilder result = new StringBuilder("Graph adjacency list:\n");
        Set<V> visited = new LinkedHashSet<>();
        formatAdjacencyListHelper(firstVertex, visited, result);
        return result.toString();
    }

    private void formatAdjacencyListHelper(V current, Set<V> visited, StringBuilder result) {
        if (visited.contains(current)) {
            return;
        }
        visited.add(current);

        result.append(current.toString()).append(": [");
        StringJoiner neighboursJoiner = new StringJoiner(",");
        for (V neighbour : getNeighbours(current)) {
            neighboursJoiner.add(neighbour.toString());
        }
        result.append(neighboursJoiner).append("]\n");

        for (V neighbour : getNeighbours(current)) {
            if (!visited.contains(neighbour)) {
                formatAdjacencyListHelper(neighbour, visited, result);
            }
        }
    }

    /**
     * represents a directed path of connected vertices in the graph
     */
    public class GPath {
        private final Deque<V> vertices = new LinkedList<>();
        private double totalWeight = 0.0;
        private final Set<V> visited = new HashSet<>();

        /**
         * representation invariants:
         * 1. vertices contains a sequence of vertices that are neighbours in the graph,
         * i.e. FOR ALL i: 1 < i < vertices.length: getNeighbours(vertices[i-1]).contains(vertices[i])
         * 2. a path with one vertex equal start and target vertex
         * 3. a path without vertices is empty, does not have a start nor a target
         * totalWeight is a helper attribute to capture total path length from a function on two neighbouring vertices
         * visited is a helper set to be able to track visited vertices in searches, only for analysis purposes
         **/
        private static final int DISPLAY_CUT = 10;

        @Override
        public String toString() {
            StringBuilder sb = new StringBuilder(
                    String.format("Weight=%.2f Length=%d visited=%d (",
                            this.totalWeight, this.vertices.size(), this.visited.size()));
            String separator = "";
            int count = 0;
            final int tailCut = this.vertices.size() - 1 - DISPLAY_CUT;
            for (V v : this.vertices) {
                // limit the length of the text representation for long paths.
                if (count < DISPLAY_CUT || count > tailCut) {
                    sb.append(separator).append(v.toString());
                    separator = ", ";
                } else if (count == DISPLAY_CUT) {
                    sb.append(separator).append("...");
                }
                count++;
            }
            sb.append(")");
            return sb.toString();
        }

        /**
         * recalculates the total weight of the path from a given weightMapper that calculates the weight of
         * the path segment between two neighbouring vertices.
         *
         * @param weightMapper
         */
        public void reCalculateTotalWeight(BiFunction<V, V, Double> weightMapper) {
            this.totalWeight = 0.0;
            V previous = null;
            for (V v : this.vertices) {
                // the first vertex of the iterator has no predecessor and hence no weight contribution
                if (previous != null) this.totalWeight += weightMapper.apply(previous, v);
                previous = v;
            }
        }

        public Queue<V> getVertices() {
            return this.vertices;
        }

        public double getTotalWeight() {
            return this.totalWeight;
        }

        public Set<V> getVisited() {
            return this.visited;
        }
    }

    /**
     * Uses a depth-first search algorithm to find a path from the startVertex to targetVertex in the subgraph
     * All vertices that are being visited by the search should also be registered in path.visited
     *
     * @param startVertex
     * @param targetVertex
     * @return the path from startVertex to targetVertex
     * or null if target cannot be matched with a vertex in the sub-graph from startVertex
     */
    public GPath depthFirstSearch(V startVertex, V targetVertex) {
        if (startVertex == null || targetVertex == null) return null;

        Set<V> visited = new HashSet<>();
        Map<V, V> pathMap = new HashMap<>();
        GPath path = new GPath();

        if (depthFirstSearchRecursive(startVertex, targetVertex, visited, pathMap)) {
            return constructPath(startVertex, targetVertex, pathMap, visited);
        }

        return null;
    }

    private boolean depthFirstSearchRecursive(V current, V target, Set<V> visited, Map<V, V> pathMap) {
        visited.add(current);

        if (current.equals(target)) {
            return true;
        }

        for (V neighbor : getNeighbours(current)) {
            if (!visited.contains(neighbor)) {
                pathMap.put(neighbor, current);
                if (depthFirstSearchRecursive(neighbor, target, visited, pathMap)) {
                    return true;
                }
            }
        }

        return false;
    }

    private GPath constructPath(V startVertex, V targetVertex, Map<V, V> pathMap, Set<V> visited) {
        GPath path = new GPath();
        V current = targetVertex;
        while (current != null) {
            path.vertices.addFirst(current);
            current = pathMap.get(current);
        }
        // Include all visited nodes
        path.visited.addAll(visited);
        return path;
    }


    /**
     * Uses a breadth-first search algorithm to find a path from the startVertex to targetVertex in the subgraph
     * All vertices that are being visited by the search should also be registered in path.visited
     *
     * @param startVertex
     * @param targetVertex
     * @return the path from startVertex to targetVertex
     * or null if target cannot be matched with a vertex in the sub-graph from startVertex
     */
    public GPath breadthFirstSearch(V startVertex, V targetVertex) {
        Set<V> visited = new HashSet<>();
        Map<V, V> predecessors = new HashMap<>();
        Queue<V> queue = new LinkedList<>();
        GPath path = new GPath();

        visited.add(startVertex);
        queue.add(startVertex);

        while (!queue.isEmpty()) {
            V current = queue.remove();

            // Check if the current node is the target
            if (current.equals(targetVertex)) {
                Deque<V> pathStack = new ArrayDeque<>();
                V step = current;
                pathStack.push(step);
                while (predecessors.containsKey(step)) {
                    step = predecessors.get(step);
                    pathStack.push(step);
                }

                while (!pathStack.isEmpty()) {
                    path.getVertices().add(pathStack.pop());
                }

                // Include all visited nodes
                path.visited.addAll(visited);
                return path;
            }

            for (V neighbor : getNeighbours(current)) {
                if (!visited.contains(neighbor)) {
                    visited.add(neighbor);
                    queue.add(neighbor);
                    predecessors.put(neighbor, current);
                }
            }
        }

        return null; // Return null if no path is found
    }

    // helper class to build the spanning tree of visited vertices in dijkstra's shortest path algorithm
    // your may change this class or delete it altogether follow a different approach in your implementation
    private class MSTNode implements Comparable<MSTNode> {
        protected V vertex;                // the graph vertex that is concerned with this MSTNode
        protected V parentVertex = null;     // the parent's node vertex that has an edge towards this node's vertex
        protected boolean marked = false;  // indicates DSP processing has been marked complete for this vertex
        protected double weightSumTo = Double.MAX_VALUE;   // sum of weights of current shortest path towards this node's vertex

        private MSTNode(V vertex) {
            this.vertex = vertex;
        }

        // comparable interface helps to find a node with the shortest current path, sofar
        @Override
        public int compareTo(MSTNode otherMSTNode) {
            return Double.compare(weightSumTo, otherMSTNode.weightSumTo);
        }
    }

    /**
     * Calculates the edge-weighted shortest path from the startVertex to targetVertex in the subgraph
     * according to Dijkstra's algorithm of a minimum spanning tree
     *
     * @param startVertex
     * @param targetVertex
     * @param weightMapper provides a function(v1,v2) by which the weight of an edge from v1 to v2
     *                     can be retrieved or calculated
     * @return the shortest path from startVertex to targetVertex
     * or null if target cannot be matched with a vertex in the sub-graph from startVertex
     */
    public GPath dijkstraShortestPath(V startVertex, V targetVertex, BiFunction<V, V, Double> weightMapper) {
        if (startVertex == null || targetVertex == null) return null;

        // Initialize the result path of the search
        GPath path = new GPath();

        // Special case: start vertex is the same as the target vertex
        if (startVertex.equals(targetVertex)) {
            path.vertices.add(startVertex);
            path.visited.add(startVertex);
            return path;
        }

        PriorityQueue<MSTNode> queue = new PriorityQueue<>(Comparator.comparingDouble(n -> n.weightSumTo));
        Map<V, MSTNode> nodes = new HashMap<>();
        MSTNode startNode = new MSTNode(startVertex);
        startNode.weightSumTo = 0;
        queue.add(startNode);
        nodes.put(startVertex, startNode);

        while (!queue.isEmpty()) {
            MSTNode currentNode = queue.poll();
            V currentVertex = currentNode.vertex;
            if (currentNode.marked) continue;

            currentNode.marked = true;
            path.visited.add(currentVertex);

            if (currentVertex.equals(targetVertex)) {
                while (currentVertex != null) {
                    path.vertices.addFirst(currentVertex);
                    MSTNode prev = nodes.get(currentVertex);
                    currentVertex = prev == null ? null : prev.parentVertex;
                }
                path.reCalculateTotalWeight(weightMapper);
                return path;
            }

            for (V neighbor : getNeighbours(currentVertex)) {
                MSTNode neighborNode = nodes.computeIfAbsent(neighbor, MSTNode::new);
                double newWeight = currentNode.weightSumTo + weightMapper.apply(currentVertex, neighbor);

                if (newWeight < neighborNode.weightSumTo) {
                    queue.remove(neighborNode);
                    neighborNode.weightSumTo = newWeight;
                    neighborNode.parentVertex = currentVertex;
                    queue.add(neighborNode);
                }
            }
        }

        return null; // No path found
    }

}
