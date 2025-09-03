import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import java.util.Set;
import static org.junit.jupiter.api.Assertions.*;

/**
 * A comprehensive test suite for the ReferralNetwork class. [cite: 111]
 * It validates core functionality and all constraints from Part 1. 
 */
class ReferralNetworkTest {

    private ReferralNetwork network;

    @BeforeEach
    void setUp() {
        // A new instance is created before each test to ensure isolation.
        network = new ReferralNetwork();
    }

    @Test
    void addReferral_shouldSucceedForValidReferral() {
        assertTrue(network.addReferral("Alice", "Bob"), "Should allow a valid referral.");
        Set<String> referrals = network.getDirectReferrals("Alice");
        assertEquals(1, referrals.size(), "Alice should have 1 direct referral.");
        assertTrue(referrals.contains("Bob"), "Alice's referral should be Bob.");
    }

    @Test
    void getDirectReferrals_shouldReturnEmptySetForUserWithNoReferrals() {
        network.addReferral("Alice", "Bob");
        assertTrue(network.getDirectReferrals("Bob").isEmpty(), "Bob has not referred anyone, so his referrals should be an empty set.");
    }

    // --- CONSTRAINT TESTS ---

    @Test
    void addReferral_shouldFailOnSelfReferral() {
        assertFalse(network.addReferral("Alice", "Alice"), "A user should not be able to refer themselves.");
        assertTrue(network.getDirectReferrals("Alice").isEmpty(), "Graph should not be modified after a failed self-referral.");
    }

    @Test
    void addReferral_shouldFailWhenCandidateIsAlreadyReferred() {
        network.addReferral("Alice", "Bob"); // Alice refers Bob successfully.
        assertFalse(network.addReferral("Charlie", "Bob"), "Charlie should not be able to refer Bob, who is already referred.");
        
        Set<String> aliceReferrals = network.getDirectReferrals("Alice");
        assertEquals(1, aliceReferrals.size());
        assertTrue(aliceReferrals.contains("Bob"));

        assertTrue(network.getDirectReferrals("Charlie").isEmpty(), "Charlie's failed referral should not be added.");
    }

    @Test
    void addReferral_shouldFailOnSimpleCycle() {
        assertTrue(network.addReferral("Alice", "Bob"));
        assertFalse(network.addReferral("Bob", "Alice"), "Adding a referral from Bob to Alice should create a cycle and fail.");
        
        assertEquals(1, network.getDirectReferrals("Alice").size());
        assertTrue(network.getDirectReferrals("Bob").isEmpty());
    }

    @Test
    void addReferral_shouldFailOnComplexCycle() {
        // Create a path: Alice -> Bob -> Charlie -> David
        network.addReferral("Alice", "Bob");
        network.addReferral("Bob", "Charlie");
        network.addReferral("Charlie", "David");

        // Attempt to close the loop: David -> Alice
        assertFalse(network.addReferral("David", "Alice"), "Adding a referral from David to Alice should create a long cycle and fail.");
        
        assertTrue(network.getDirectReferrals("David").isEmpty(), "David's failed referral should not be recorded.");
    }

    @Test
    void getDirectReferrals_returnsUnmodifiableSet() {
        network.addReferral("Alice", "Bob");
        Set<String> referrals = network.getDirectReferrals("Alice");

        // This should throw an UnsupportedOperationException
        assertThrows(UnsupportedOperationException.class, () -> {
            referrals.add("Charlie");
        }, "The returned set of referrals should be unmodifiable.");
    }
}