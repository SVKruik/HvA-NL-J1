package maze_escape;

import java.util.*;
import java.util.function.BiFunction;
import java.util.stream.Collectors;

public abstract class AbstractGraph<V> {

    /** Graph representation:
     *  this class implements graph search algorithms on a graph with abstract vertex type V
     *  for every vertex in the graph, its neighbours can be found by use of abstract method getNeighbours(fromVertex)
     *  this abstraction can be used for both directed and undirected graphs
     **/

    public AbstractGraph() { }

    /**
     * retrieves all neighbours of the given fromVertex
     * if the graph is directed, the implementation of this method shall follow the outgoing edges of fromVertex
     * @param fromVertex
     * @return
     */
    public abstract Set<V> getNeighbours(V fromVertex);

    /**
     * retrieves all vertices that can be reached directly or indirectly from the given firstVertex
     * if the graph is directed, only outgoing edges shall be traversed
     * firstVertex shall be included in the result as well
     * if the graph is connected, all vertices shall be found
     * @param firstVertex   the start vertex for the retrieval
     * @return
     */
    public Set<V> getAllVertices(V firstVertex) {
        Set<V> visited = new HashSet<>();
        collectVertices(firstVertex, visited);
        return visited;
    }

    private void collectVertices(V current, Set<V> visited) {
        if (!visited.add(current)) return;

        for (V neighbor : getNeighbours(current)) {
            collectVertices(neighbor, visited);
        }
    }

    /**
     * Formats the adjacency list of the subgraph starting at the given firstVertex
     * according to the format:
     *  	vertex1: [neighbour11,neighbour12,…]
     *  	vertex2: [neighbour21,neighbour22,…]
     *  	…
     * Uses a pre-order traversal of a spanning tree of the sub-graph starting with firstVertex as the root
     * if the graph is directed, only outgoing edges shall be traversed
     * , and using the getNeighbours() method to retrieve the roots of the child subtrees.
     * @param firstVertex
     * @return
     */
    public String formatAdjacencyList(V firstVertex) {
        StringBuilder stringBuilder = new StringBuilder("Graph adjacency list:\n");
        Set<V> visited = new LinkedHashSet<>();
        formatAdjacencyListHelper(firstVertex, visited, stringBuilder);
        return stringBuilder.toString();
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
        private Deque<V> vertices = new LinkedList<>();
        private double totalWeight = 0.0;
        private Set<V> visited = new HashSet<>();

        /**
         * representation invariants:
         * 1. vertices contains a sequence of vertices that are neighbours in the graph,
         *    i.e. FOR ALL i: 1 < i < vertices.length: getNeighbours(vertices[i-1]).contains(vertices[i])
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
            final int tailCut = this.vertices.size()-1 - DISPLAY_CUT;
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
         * @param weightMapper
         */
        public void reCalculateTotalWeight(BiFunction<V,V,Double> weightMapper) {
            this.totalWeight = 0.0;
            V previous = null;
            for (V v: this.vertices) {
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

        public Set<V> getVisited() { return this.visited; }
    }

    /**
     * Uses a depth-first search algorithm to find a path from the startVertex to targetVertex in the subgraph
     * All vertices that are being visited by the search should also be registered in path.visited
     * @param startVertex
     * @param targetVertex
     * @return  the path from startVertex to targetVertex
     *          or null if target cannot be matched with a vertex in the sub-graph from startVertex
     */
    public GPath depthFirstSearch(V startVertex, V targetVertex) {
        if (startVertex == null || targetVertex == null) return null;

        GPath path = new GPath();
        Set<V> visited = new HashSet<>();

        if (dfsHelper(startVertex, targetVertex, path, visited)) {
            return path;
        }
        return null;
    }

    private boolean dfsHelper(V current, V target, GPath path, Set<V> visited) {
        if (!visited.add(current)) return false;
        path.visited.add(current);
        path.vertices.addLast(current);

        if (current.equals(target)) return true;

        for (V neighbor : getNeighbours(current)) {
            if (dfsHelper(neighbor, target, path, visited)) {
                return true;
            }
        }

        path.vertices.removeLast();
        return false;
    }


    /**
     * Uses a breadth-first search algorithm to find a path from the startVertex to targetVertex in the subgraph
     * All vertices that are being visited by the search should also be registered in path.visited
     * @param startVertex
     * @param targetVertex
     * @return  the path from startVertex to targetVertex
     *          or null if target cannot be matched with a vertex in the sub-graph from startVertex
     */
    public GPath breadthFirstSearch(V startVertex, V targetVertex) {
        if (startVertex == null || targetVertex == null) return null;

        GPath path = new GPath();
        Queue<V> queue = new LinkedList<>();
        Map<V, V> parentMap = new HashMap<>();
        Set<V> visited = new HashSet<>();

        queue.add(startVertex);
        visited.add(startVertex);
        path.visited.add(startVertex);

        while (!queue.isEmpty()) {
            V current = queue.poll();

            if (current.equals(targetVertex)) {
                reconstructPath(path, parentMap, targetVertex);
                return path;
            }

            for (V neighbor : getNeighbours(current)) {
                if (visited.add(neighbor)) {
                    parentMap.put(neighbor, current);
                    queue.add(neighbor);
                    path.visited.add(neighbor);
                }
            }
        }
        return null;
    }

    private void reconstructPath(GPath path, Map<V, V> parentMap, V target) {
        Deque<V> reconstructedPath = new LinkedList<>();
        for (V at = target; at != null; at = parentMap.get(at)) {
            reconstructedPath.push(at);
        }
        path.vertices.addAll(reconstructedPath);
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
     * @param startVertex
     * @param targetVertex
     * @param weightMapper   provides a function(v1,v2) by which the weight of an edge from v1 to v2
     *                       can be retrieved or calculated
     * @return  the shortest path from startVertex to targetVertex
     *          or null if target cannot be matched with a vertex in the sub-graph from startVertex
     */
    public GPath dijkstraShortestPath(V startVertex, V targetVertex, BiFunction<V, V, Double> weightMapper) {
        if (startVertex == null || targetVertex == null) return null;

        GPath path = new GPath();
        Map<V, MSTNode> mst = new HashMap<>();
        PriorityQueue<MSTNode> priorityQueue = new PriorityQueue<>();

        MSTNode startNode = new MSTNode(startVertex);
        startNode.weightSumTo = 0.0;
        mst.put(startVertex, startNode);
        priorityQueue.add(startNode);

        while (!priorityQueue.isEmpty()) {
            MSTNode currentNode = priorityQueue.poll();

            if (currentNode.marked) continue;
            currentNode.marked = true;
            path.visited.add(currentNode.vertex);

            if (currentNode.vertex.equals(targetVertex)) {
                reconstructDijkstraPath(path, mst, targetVertex);
                return path;
            }

            for (V neighbor : getNeighbours(currentNode.vertex)) {
                double edgeWeight = weightMapper.apply(currentNode.vertex, neighbor);
                double newWeight = currentNode.weightSumTo + edgeWeight;

                MSTNode neighborNode = mst.getOrDefault(neighbor, new MSTNode(neighbor));
                if (newWeight < neighborNode.weightSumTo) {
                    neighborNode.weightSumTo = newWeight;
                    neighborNode.parentVertex = currentNode.vertex;

                    priorityQueue.remove(neighborNode);
                    priorityQueue.add(neighborNode);

                    mst.put(neighbor, neighborNode);
                }
            }
        }
        return null;
    }

    private void reconstructDijkstraPath(GPath path, Map<V, MSTNode> mst, V target) {
        Deque<V> reconstructedPath = new LinkedList<>();
        for (MSTNode node = mst.get(target); node != null; node = mst.get(node.parentVertex)) {
            reconstructedPath.push(node.vertex);
        }
        path.vertices.addAll(reconstructedPath);
        path.reCalculateTotalWeight((v1, v2) -> {
            MSTNode node1 = mst.get(v1);
            MSTNode node2 = mst.get(v2);
            return node2.weightSumTo - node1.weightSumTo;
        });
    }
}
