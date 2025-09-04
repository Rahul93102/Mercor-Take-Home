# Referral Network System

A comprehensive Java implementation of a referral network system that tracks direct and indirect referrals while maintaining graph constraints and providing advanced analytics.

## Architecture Overview

The system is built with a modular architecture consisting of:

### Core Components

1. **ReferralNetwork.java** - Main class implementing the referral graph
2. **ReferralNetworkTest.java** - Comprehensive test suite
3. **JUnit Platform** - Testing framework (included as standalone JAR)

### Data Structures

- **HashMap<String, Set<String>> graph** - Stores direct referral relationships
- **HashMap<String, String> referredCandidates** - Tracks who referred each candidate
- **BFS algorithms** - For cycle detection and network traversal

### Key Constraints

- No self-referrals allowed
- Each candidate can have only one referrer
- Acyclic graph structure maintained
- Thread-safe operations

## Features

### Part 1: Core Referral Graph
- **addReferral(referrer, candidate)** - Add referral relationships with constraint validation
- **getDirectReferrals(user)** - Get immediate referrals for a user

### Part 2: Network Reach Analysis
- **getTotalReferralCount(user)** - Calculate total direct + indirect referrals using BFS
- **getTopReferrersByReach(k)** - Get top k referrers ranked by total reach

### Part 3: Advanced Influencer Metrics
- **getUniqueReachExpansion(k)** - Greedy algorithm for maximum unique coverage
- **getFlowCentrality(k)** - Identify critical network brokers using shortest paths

### Business Applications

| Metric | Use Case | Example |
|--------|----------|----------|
| **Reach** | Sales performance tracking | Identify top performers for bonuses |
| **Unique Reach** | Marketing campaigns | Minimize audience overlap in promotions |
| **Flow Centrality** | Organizational analysis | Find key connectors in company networks |

## Project Structure

```
Mecror Take Home/
├── source/
│   ├── ReferralNetwork.java          # Main implementation
│   ├── ReferralNetwork.class          # Compiled bytecode
│   └── ReferralNetwork$UserReachPair.class
├── tests/
│   ├── ReferralNetworkTest.java       # Test suite (24 test cases)
│   └── ReferralNetworkTest.class      # Compiled test bytecode
├── junit-platform-console-standalone-1.10.0.jar  # Testing framework
├── README.md                          # This file
└── Mercor Take Home - Referral Network (2).pdf   # Problem statement
```

## Setup and Installation

### Prerequisites
- Java 8 or higher
- Terminal/Command Line access

### Quick Start

1. **Clone/Download the project**
   ```bash
   cd "Mecror Take Home"
   ```

2. **Compile the source code**
   ```bash
   javac source/ReferralNetwork.java
   ```

3. **Compile the tests**
   ```bash
   javac -cp ".:source:junit-platform-console-standalone-1.10.0.jar" tests/ReferralNetworkTest.java
   ```

4. **Run all tests**
   ```bash
   java -cp ".:source:tests:junit-platform-console-standalone-1.10.0.jar" org.junit.platform.console.ConsoleLauncher --class-path=".:source:tests" --scan-class-path
   ```

## Testing

### Test Coverage

The test suite includes **24 comprehensive test cases** covering:

- **Constraint Validation** (5 tests)
  - Self-referral prevention
  - Unique referrer enforcement
  - Cycle detection (simple & complex)
  - Unmodifiable return sets

- **Part 2 Functionality** (8 tests)
  - Total referral counting (direct & indirect)
  - Top referrers ranking
  - Edge cases (empty networks, zero k)

- **Part 3 Advanced Metrics** (10 tests)
  - Unique reach expansion algorithm
  - Flow centrality analysis
  - Linear chain handling
  - Result limiting

- **Integration Testing** (1 test)
  - Complex network with all metrics

### Running Specific Tests

**Run all tests:**
```bash
java -cp ".:source:tests:junit-platform-console-standalone-1.10.0.jar" org.junit.platform.console.ConsoleLauncher --class-path=".:source:tests" --scan-class-path
```

**Expected Output:**
```
Test run finished after ~100 ms
[         4 containers found      ]
[         0 containers skipped    ]
[         4 containers started    ]
[         0 containers aborted    ]
[         4 containers successful ]
[         0 containers failed     ]
[        24 tests found           ]
[         0 tests skipped         ]
[        24 tests started         ]
[         0 tests aborted         ]
[        24 tests successful      ]
[         0 tests failed          ]
```

## Usage Examples

### Basic Usage

```java
ReferralNetwork network = new ReferralNetwork();

// Add referrals
network.addReferral("CEO", "Manager1");
network.addReferral("Manager1", "Employee1");
network.addReferral("Employee1", "Intern1");

// Get direct referrals
Set<String> directReferrals = network.getDirectReferrals("Manager1");
// Returns: ["Employee1"]

// Get total referral count (direct + indirect)
int totalCount = network.getTotalReferralCount("CEO");
// Returns: 3 (Manager1, Employee1, Intern1)

// Get top referrers
List<String> topReferrers = network.getTopReferrersByReach(2);
// Returns: ["CEO", "Manager1"] (ranked by total reach)
```

### Advanced Analytics

```java
// Find referrers with maximum unique coverage
List<String> uniqueInfluencers = network.getUniqueReachExpansion(3);

// Identify critical network brokers
List<String> brokers = network.getFlowCentrality(2);
```

## Algorithm Complexity

| Operation | Time Complexity | Space Complexity |
|-----------|----------------|------------------|
| addReferral | O(V + E) | O(V) |
| getDirectReferrals | O(1) | O(1) |
| getTotalReferralCount | O(V + E) | O(V) |
| getTopReferrersByReach | O(V * (V + E) + V log V) | O(V) |
| getUniqueReachExpansion | O(k * V * (V + E)) | O(V) |
| getFlowCentrality | O(V² * (V + E)) | O(V²) |

Where V = number of users, E = number of referral edges, k = requested result count

## Error Handling

The system handles various edge cases:

- **Invalid referrals** - Returns false for constraint violations
- **Non-existent users** - Returns empty sets/zero counts gracefully
- **Negative k values** - Returns empty lists
- **Null inputs** - Proper null checking throughout

## Performance Considerations

- **Memory efficient** - Uses HashMaps for O(1) lookups
- **Scalable** - BFS algorithms handle large networks efficiently
- **Thread-safe** - Immutable return types prevent external modification
- **Optimized** - Greedy algorithms for NP-hard problems

## Contributing

To extend the system:

1. Add new methods to `ReferralNetwork.java`
2. Create corresponding tests in `ReferralNetworkTest.java`
3. Update this README with new functionality
4. Ensure all tests pass before committing

## License

This project is part of the Mercor Take Home assessment.

---

**Status**: All 24 tests passing | Full implementation complete | Production ready
