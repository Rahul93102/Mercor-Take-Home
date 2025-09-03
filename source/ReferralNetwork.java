import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.Map;
import java.util.Queue;
import java.util.Set;

/**
 * Implements the core data structure for a referral network. [cite: 17, 20]
 * This class stores users and their directed referral relationships,
 * enforcing rules such as no self-referrals, unique referrers for each candidate,
 * and maintaining an acyclic graph structure. [cite: 21, 26, 27, 28]
 */
public class ReferralNetwork {

    // Adjacency list to represent the graph: Referrer -> Set of Candidates
    private final Map<String, Set<String>> graph;

    // Map to enforce unique referrer constraint: Candidate -> Referrer
    private final Map<String, String> referredCandidates;

    public ReferralNetwork() {
        this.graph = new HashMap<>();
        this.referredCandidates = new HashMap<>();
    }

    /**
     * Adds a new, directed referral link from a referrer to a candidate. [cite: 22]
     * This operation is transactional: it succeeds only if all constraints are met.
     *
     * @param referrer  The ID of the user making the referral.
     * @param candidate The ID of the user being referred.
     * @return true if the referral was added successfully, false otherwise.
     */
    public boolean addReferral(String referrer, String candidate) {
        // Constraint 1: No Self-Referrals [cite: 26]
        if (referrer.equals(candidate)) {
            System.err.println("Error: A user cannot refer themselves.");
            return false;
        }

        // Constraint 2: A candidate can only be referred by one user. [cite: 27]
        if (referredCandidates.containsKey(candidate)) {
            System.err.println("Error: Candidate '" + candidate + "' has already been referred by '" + referredCandidates.get(candidate) + "'.");
            return false;
        }

        // Constraint 3: The graph must remain acyclic. [cite: 28]
        // To check, we verify if a path already exists from the candidate to the referrer.
        // If it does, adding an edge from referrer to candidate would create a cycle.
        if (pathExists(candidate, referrer)) {
            System.err.println("Error: Adding this referral would create a cycle in the network.");
            return false;
        }

        // If all constraints pass, add the referral
        graph.computeIfAbsent(referrer, k -> new HashSet<>()).add(candidate);
        referredCandidates.put(candidate, referrer);

        return true;
    }

    /**
     * Queries for a user's direct referrals. [cite: 23]
     *
     * @param user The ID of the user.
     * @return An unmodifiable set of the user's direct referrals. Returns an empty set if the user has no referrals.
     */
    public Set<String> getDirectReferrals(String user) {
        return Collections.unmodifiableSet(graph.getOrDefault(user, Collections.emptySet()));
    }

    /**
     * Checks if a directed path exists from a start node to an end node using Breadth-First Search (BFS).
     *
     * @param startNode The starting user ID.
     * @param endNode   The target user ID.
     * @return true if a path exists, false otherwise.
     */
    private boolean pathExists(String startNode, String endNode) {
        if (!graph.containsKey(startNode)) {
            return false;
        }

        Queue<String> queue = new LinkedList<>();
        Set<String> visited = new HashSet<>();

        queue.add(startNode);
        visited.add(startNode);

        while (!queue.isEmpty()) {
            String currentUser = queue.poll();

            if (currentUser.equals(endNode)) {
                return true;
            }

            for (String neighbor : getDirectReferrals(currentUser)) {
                if (!visited.contains(neighbor)) {
                    visited.add(neighbor);
                    queue.add(neighbor);
                }
            }
        }
        return false;
    }
}