# Referral Network Analytics - Complete Implementation

A comprehensive React application implementing all five parts of the Mercor referral network challenge. This solution provides interactive interfaces for building referral networks, analyzing reach patterns, identifying influencers, simulating growth, and optimizing bonus strategies.

## 🚀 Features Overview

### Part 1: Referral Graph Structure
- **Core Data Structure**: Directed Acyclic Graph (DAG) implementation
- **Constraints Enforced**: 
  - No self-referrals
  - Unique referrer per candidate
  - Acyclic graph maintenance
- **Interactive Builder**: Add users and referral relationships with real-time validation

### Part 2: Network Reach Analysis
- **BFS-based Reach Calculation**: Efficient traversal for total referral counting
- **Top Referrer Identification**: Ranked lists with configurable k values
- **Statistical Analytics**: Comprehensive reach metrics and distribution analysis
- **Depth Analysis**: Multi-level network exploration

### Part 3: Advanced Influencer Identification
- **Unique Reach Expansion**: Greedy algorithm for maximum unique coverage
- **Flow Centrality**: Betweenness centrality for critical network brokers
- **Business Scenario Mapping**: Clear guidance for metric selection
- **Comparative Analysis**: Side-by-side metric evaluation

### Part 4: Network Growth Simulation
- **Probabilistic Growth Model**: Configurable daily referral probabilities
- **Time-based Analysis**: Days-to-target calculations with binary search optimization
- **Scenario Comparison**: Multi-probability comparative analysis
- **Growth Analytics**: Peak growth detection, acceleration analysis

### Part 5: Bonus Optimization
- **Binary Search Algorithm**: Efficient minimum bonus calculation
- **Adoption Function Modeling**: Multiple probability curves (sigmoid, linear, exponential, etc.)
- **Sensitivity Analysis**: Cost-effectiveness evaluation across bonus ranges
- **Business Recommendations**: Actionable insights with confidence levels

## 🏗️ Architecture

### Core Classes

#### `ReferralNetwork`
- **Purpose**: Base graph implementation with referral management
- **Key Methods**: 
  - `addReferral(referrerId, candidateId)`: Validates and adds referral relationships
  - `getDirectReferrals(userId)`: Returns immediate referrals
  - `wouldCreateCycle(from, to)`: Prevents cycle creation

#### `NetworkAnalysis`
- **Purpose**: Extends ReferralNetwork with reach analysis
- **Key Methods**:
  - `calculateReach(userId)`: BFS-based total reach calculation
  - `getTopReferrersByReach(k)`: Ranked referrer identification
  - `getReachAnalysis()`: Comprehensive statistical analysis

#### `InfluencerAnalysis`
- **Purpose**: Advanced influence metrics implementation
- **Key Methods**:
  - `calculateUniqueReachExpansion(maxReferrers)`: Greedy coverage optimization
  - `calculateFlowCentrality(topK)`: Betweenness centrality calculation
  - `computeAllPairsDistances()`: Shortest path matrix computation

#### `NetworkGrowthSimulation`
- **Purpose**: Probabilistic growth modeling
- **Key Methods**:
  - `simulate(probability, days)`: Monte Carlo-style growth simulation
  - `daysToTarget(probability, target)`: Efficient target timeline calculation
  - `getSimulationAnalytics(p, days)`: Comprehensive growth analysis

#### `BonusOptimization`
- **Purpose**: Bonus strategy optimization
- **Key Methods**:
  - `minBonusForTarget(days, target, adoptionProb, eps)`: Binary search optimization
  - `analyzeBonusSensitivity()`: Cost-effectiveness analysis
  - `getBonusRecommendation()`: Business-ready recommendations

## 🧮 Algorithm Complexity Analysis

### Time Complexities

1. **Reach Calculation**: O(V + E) per user using BFS
2. **Top Referrers**: O(V² + VE) for all users
3. **Unique Reach Expansion**: O(k × V²) greedy algorithm
4. **Flow Centrality**: O(V³) all-pairs shortest paths + O(V³) centrality calculation
5. **Growth Simulation**: O(days) per simulation
6. **Bonus Optimization**: O(days × log(max_bonus)) binary search

## 🎯 Business Use Cases

### Metric Selection Guide

1. **Reach Metric**
   - **Best for**: Viral marketing campaigns, brand awareness
   - **Use when**: Maximum exposure is the primary goal
   - **Example**: "We want to reach the maximum number of people for our product launch"

2. **Unique Reach Expansion**
   - **Best for**: Budget-constrained marketing, diverse audience targeting
   - **Use when**: Cost efficiency and minimal overlap matter
   - **Example**: "We have $10K budget and want maximum unique customer acquisition"

3. **Flow Centrality**
   - **Best for**: Network resilience, organizational design, knowledge sharing
   - **Use when**: Network stability and information flow are critical
   - **Example**: "Identify key employees whose departure would fragment team communication"

## 🛠️ Installation & Usage

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation
```bash
cd frontend
npm install
npm run dev
```

## 📊 Sample Data & Testing

The application includes comprehensive sample data for testing all features:

### Sample Network Structure
- **Users**: alice, bob, charlie, david, eve, frank, george, helen, ivan, jack, kate
- **Relationships**: Hierarchical structure with multiple levels
- **Metrics**: Varied reach patterns for algorithm validation

## 🎨 User Interface Features

### Interactive Elements
- **Real-time Validation**: Immediate feedback on invalid operations
- **Progressive Loading**: Async calculations with loading states
- **Responsive Design**: Mobile-friendly layouts and interactions
- **Visual Feedback**: Charts, progress bars, and color-coded metrics

## 📈 Performance Optimizations

### Computational Efficiency
1. **Memoization**: Cached reach calculations and distance matrices
2. **Binary Search**: Efficient target finding in bonus optimization
3. **Greedy Algorithms**: Optimal unique reach selection
4. **BFS Implementation**: Efficient graph traversal

### UI Performance
1. **Component Memoization**: React.memo for expensive components
2. **State Management**: Efficient state updates with useCallback
3. **Lazy Loading**: Async calculations with loading states

---

**Built with**: React 19, Modern JavaScript (ES6+), CSS3, HTML5
**Algorithms**: Graph theory, optimization, probabilistic modeling, greedy algorithms
**Architecture**: Component-based design, functional programming principles+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
