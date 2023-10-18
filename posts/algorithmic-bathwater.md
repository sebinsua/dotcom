---
title: Is dismissing the algorithmic tech interview a memetic hazard?
slug: algorithmic-bathwater
date: "2023-09-08"
description: "Master algorithmic design. A step-by-step guide to selecting the optimal technique when solving a programming problem including greedy algorithms, dynamic programming, depth-first search and backtracking."
---

### Algorithmic bathwater

https://twitter.com/yacineMTB/status/1687126523910799360

The belief that algorithmic tech interviews do not test for real-world programming skills is a memetic hazard. There might be truth to it but it serves as displacement from what is often the real underlying reason for resistance: the fear of negative judgement.

Without passing judgement on whether these tests are a good way to assess skill level, it’s crucial to realise that dismissing them has drawbacks. These problems often contain different ways of thinking and require novel techniques or hard-won algorithms, and their deliberate practice can be a valuable way to improve your problem-solving skills. While uncomfortable, acknowledging this offers us an opportunity to grow.

### Not going in blind

https://twitter.com/var_epsilon/status/1690755091052077056

Mastering a few fundamental problems can make you more effective at a wide range of challenges, but how do you go about truly understanding these _‘eigenproblems’_?

It’s commonly heard that if you ever need an algorithm you’ll “just Google it”, however this belief is quite suspect as you’re unlikely to reach for Google without awareness of the techniques that might be applicable. Having a foundational understanding can help you to recognise opportunities for application in the first place.

The creator of the [“Blind 75” problem set](https://www.teamblind.com/post/New-Year-Gift---Curated-List-of-Top-75-LeetCode-Questions-to-Save-Your-Time-OaM1orEU), an engineer from Meta, attempted to distill the most useful questions for learning the core concepts and techniques for each category/type of problems from their experience doing 400-500 LeetCode questions during their last job hunt.

75 questions is still a very large time commitment, and the reality is that it’s even more time-consuming than it might look as fluency generally requires [spaced repetition of the problems](https://old.reddit.com/r/leetcode/comments/15tcmwq/got_to_100_hards/jwk4e9r/) by doing a variety of topics each week and revisiting these again in subsequent weeks.

We want the ability to be able to identify and apply the right techniques given an unknown problem, and this is about grasping the intent, design, and the decision-making involved in this. This ability can certainly be picked up incidentally by doing lots of problems and eventually beginning to pattern-match them, but I’d argue that this isn’t the most efficient way to learn as a lot of the knowledge doesn’t appear to be naturally tacit.

[Current](https://neetcode.io) [methods](https://www.techinterviewhandbook.org/grind75) [of teaching](https://cp-algorithms.com/index.html) often focus on mere implementation, overlooking the decision-making skills needed to identify the right techniques for a problem. This article aims to fill that gap, by articulating what is often left unsaid. While it won’t replace hands-on experience in the nuances of implementation, it should be helpful in improving your understanding of technique _‘applicability’_.

> ### Note
>
> 1. We’re intentionally not discussing the implementation details of these techniques, as this is already well-covered elsewhere. For deep explanations, video tutorials and code examples, we recommend:
>
>    - [NeetCode](https://neetcode.io/practice)
>    - [Grind 75](https://www.techinterviewhandbook.org/grind75)
>    - [LeetCode](https://leetcode.com)
>    - [CP-Algorithms](https://cp-algorithms.com)
>    - [Analysis of Algorithms Lectures](https://www3.cs.stonybrook.edu/~skiena/373/videos/)
>    - [The Stony Brook Algorithm Repository](https://www.algorist.com/algorist.html)
>    - [Red Blob Games](https://www.redblobgames.com)
>    - Searching Google
>
> 2. This article is a work in progress and I’ll be adding more to it over time. <a href="mailto:me@sebinsua.com">Please email me with any insights or suggestions you have for improvement.</a>

<a name="what-kind-of-problem-do-i-have"></a>

### What kind of problem do I have?

<p align="center" width="100%">
  <a href="./assets/posts/algorithmic-bathwater/algorithmic-bathwater-1.svg">
   <img alt="Flowchart" src="./assets/posts/algorithmic-bathwater/algorithmic-bathwater-1.svg" />
  </a>
</p>

1. **Is the problem related to a linear/sequential data structure (e.g. array, linked list, string, search space)?**

   1. Are we being asked to find pairs, triplets or sub-arrays that match a constraint?

      - To solve this optimally (e.g. $O(n)$), we need to be able to easily compare elements in the sequence without using nested loops. We have at most two options:

        - _Ensuring the sequence is sorted_ and then applying the **Two Pointers** technique:

          - We can avoid the need for a nested loop if the sequence is sorted, as we can operate upon the sequence using two explicit pointers, one at the start and one at the end. The pointers clarify which elements are being considered for the condition being evaluated, and [on each iteration we choose how to move these pointers based on the result of a comparison](https://archive.ph/y73um).

          - This is particularly useful when a deterministic order matters or when we are looking for unique pairs/triplets.

        - Using a **Hash Map**:

          - This allows us to store seen elements and to then look up the complement of the current element in the hash table. It’d be a more appropriate choice when the sequence is unsorted and sorting it would break problem constraints, or when we need to remember past elements for comparison but don’t care about their order.

   2. Are we being asked to find a longest/shortest substring or subsequence that matches a particular constraint or to compute aggregate statistics for a particular length subsequence?

      - To solve this optimally, we want to be able to re-use the computations from previous windows so that we can update our answer for each window in constant time (e.g. $O(1)$) and the whole sequence can be completed in linear time (e.g. $O(n)$).

      - We can do this by applying the **Sliding Window** technique, either using a fixed window size or a dynamic window size that can expand, shrink or reset based on certain conditions. Please note that these are not implemented in the same way as two pointers problems as explicit pointers towards the start and end of the window, but instead they generally use a single loop iterator and some additional variables to keep track of the window’s characteristics. This is a subtle but important distinction from the two-pointer technique.

      - See also: the Rabin-Karp string search algorithm which employs a specialised form of the sliding window technique that utilises rolling hashes to achieve efficient substring matching.

   3. Are we being asked to find a target value or minimum/maximum value in this sequence?

      - If the sequence is unsorted, there is no way to do better than a linear scan of the sequence (e.g. $O(n)$).

      - But, if the sequence is sorted we can apply the **Binary Search** technique.

      - In fact, we can apply the **Binary Search** technique if the sequence is _partially sorted_ as long as it is _partitionable_ (e.g. we can discern a sorted and unsorted partition on each iteration). For example, we can apply binary search to rotated sorted arrays or bitonic sequences.

      - We can also apply the **Binary Search** technique to compute numerical approximations if a sequence is ordered but virtual (e.g. a search space). For example, to approximate the square root of a number.

   4. Are we being asked to detect cycles in a linked list or to find the middle element?

      - Use the **Fast-And-Slow Pointers** technique. If the pointers meet, there is a cycle.

      - If we need to find the middle element, we can rely on the fact that the slow pointer will be at the middle element when the fast pointer reaches the end of the list.

   5. Are we being asked to find duplicates in a sequence?

      - If the sequence is sorted, then duplicate items will be next to each other and we can find them by comparing adjacent elements in the sequence.

      - If the sequence is unsorted, we can add elements that we see into a **Set** or **Hash Map** and then check whether the current element is within this.

   6. Does the problem require frequent and ordered access to recently processed elements?

      - In situations in which you need access to elements in some dynamic order you cannot just use a `for`-loop to iterate through some elements in a fixed order, and likely will need to append elements into a dynamically ordered sequence maintained within a **Stack** or **Queue**.

      - If we need to access the most recently processed elements we can use a **Stack**. This has $O(1)$ access at the end that elements are appended.

        - Note that ‘stack’ is a bit of an overloaded term as it refers to any last-in first-out (LIFO) structures. They are often arrays (or linked lists) but this isn’t necessarily the case. For example, when executing programs we keep a stack of frames within a block of contiguous memory.

        - Not all problems involving a ‘stack’ are similar. For example, there are some in which (1) you only ever need to access, check or pop the most recently appended element, while there are others in which (2) you will need to repeatedly traverse backwards through the stack while some condition is true. The latter approach would often use a nested `while`-loop and can allow you to gather information or maintain state using previous elements in the stack or even to maintain some invariant in the stack that can be depended upon by future iterations or even a second phase of the algorithm.

        - I think it can also be helpful to think of how other data structures can also have stack-like access patterns. For example, when given a decimal integer we can ‘peek’ at its last digit using `% 10` and then ‘pop’ this using a `// 10`.

      - If we need to access the least recently processed elements we can use a **Queue**. This has $O(1)$ access at its start, at the opposite end to where elements are appended.

   7. Are we being asked to merge sorted lists?

      - Use a **Min-Heap**. This approach is known as a k-way merge and is a generalisation of the two-way merge that is used in merge sort.

2. **Does the problem involve categorising or identifying unique elements based on some aspect of them not immediately known?**

   - These are in fact conceptually **Hash Map** problems (because you cannot use **Set**s for identifying “uniqueness” when it is not defined by the value of the element itself). However, the crux of these questions often lies not in the choice of data structure, but the creation of a hash-like bucketing function that can efficiently capture/compute some invariant of the element that it can be grouped by. For example, anagrams can be grouped by the frequency of their characters, snowflakes by their lexicographically smallest rotation, and so on.

3. **Does the problem require you to perform efficient lookups of data?**

   1. Do we need to quickly store or lookup strings or provide autocomplete functionality?

      - Use a **Trie** data structure (also known as a prefix tree). This is a tree data structure that stores strings in a way that allows for fast (e.g. $O(k)$) retrieval and updates of strings that share a common prefix.

   2. Are we being asked to query the smallest/largest/median values? Do you need to be able to read out a sorted sequence of elements?

      - Use a **Min-Heap** or **Max-Heap** data structure to query for the smallest/largest values (in $O(1)$).

      - You can use a combination of both **Min-Heap** and **Max-Heap** if you want to compute the median.

      - There are time/space costs to maintaining heaps (creating a heap costs $O(n)$ but updates are $O(\log n)$ due to the cost to `heapify`), so this makes more sense when you expect to make multiple queries over the lifetime of your program. The concept of [amortised cost](https://en.wikipedia.org/wiki/Amortized_analysis) is also important when comparing min-heaps to algorithms like quickselect. While min-heaps offer a consistent update time of $O(\log n)$, quickselect’s time complexity may be more efficient for one-off or occasional operations.

      - Heaps do not maintain sorted order of their elements, and instead only maintain a partial ordering. Because of this, they do not offer $O(1)$ access to the $k^{\text{\tiny th}}$ smallest/largest element or allow you to read out a sorted sequence of elements. If you need to be able to do this, while still allowing for efficient updates, you can use a **Binary Search Tree (BST)** data structure, possibly augmented with additional information to make it self-balancing (e.g. **AVL Tree** or **Red-Black Tree**).

4. **Does the problem require you to recover the order of some elements or substrings within a sequence?**

   - If you are able to infer partial information about how particular elements are connected, for example, if they come before or after each other or if they overlap (or touch), you can use this information to help build a **Directed Graph**. Vertices can represent elements, while edges can represent the information inferred from the data. Once this is achieved, it’s often possible to recover the order by running something like a **Topological Sort**.

   - In general, graphs seem a good fit for problems involving recovering the order of a sequence, for example, “de Bruijn” graphs are used for the re-assembly of de-novo DNA sequences from k-mers in computational biology.

5. **Are you dealing with data points that are interconnected in some way, needing to generate and test paths or sequences, or wishing to traverse elements in a matrix?**

   > ### Note
   >
   > 1. Problems like this can often be solved using graph or tree data structures, but it’s important to note that these are not the only ways of representing data that is interconnected. For example, rotating a tree 45-degrees gives you a grid, and you can use an adjacency matrix to represent a graph, or an array to represent a tree (as is done when implementing heaps). The choice of data structure is not only a trade-off between memory usage and performance, but can also lead to different ways of thinking about a problem.
   > 2. There are also similarities between iteration of sequences and traversals in graphs, trees or state-spaces. Traversal is essentially an extended form of iteration, designed to handle dynamic, non-linear, branching data structures. Different traversal strategies, such as BFS (level-order) and DFS (pre-order, in-order, post-order), offer specific advantages tailored to the nature of the problem at hand.
   > 3. An important insight is the fluidity and overlapping between techniques like trees, dynamic programming and path-finding. This allows for multiple perspectives on a problem and can occasionally offer more elegant or optimal solutions. For example, in Tristan Hume’s [“Designing a Tree Diff Algorithm Using Dynamic Programming and A\*”](https://thume.ca/2017/06/17/tree-diffing/), the problem of diffing begins as a decision tree before being transformed into a 2D grid that is amenable to dynamic programming style techniques and eventually the path-finding algorithm A\*.

   1. Have you been asked to find a combination or permutation of elements that match a constraint?

      - When you have a particular target or constraint that needs to be met, it generally suggests that you will need to go deeply into the search space to find and test each path. This suggests that you will need to use a **Depth-First Search (DFS)** approach, however, this will likely result in an explosion of paths that need to be explored and very slow performance as well as bad memory usage. To avoid this, you will need to prune paths early-on that cannot possibly lead to a solution, and, also due to the potential depth of the search space use a **Backtracking** approach to (a) invalidate any paths later shown to be impossible, and (b) rollback any modifications to shared state that are made during the search.

      - Another way of looking at things is that DFS doesn’t need to traverse a materialised tree or graph. They can be used to explore a more implicit solution space such as a “decision tree” in which each choice appends an item to a stack. For example, it would be possible to use something like a regular expression (e.g. ‘(ab[cd]e?)\*’) as a generative structure that creates a DFS-like search space that generates strings that match that expression.

      - **Depth-First Search (DFS)** has a lot of overlap with **Top-Down Memoisation**. In fact, top-down memoisation is depth-first search but with a caching optimisation to avoid re-computing subproblems (e.g. “overlapping subproblems”). Top-down memoisation is generally assumed to be implemented using recursion, but, it can also be implemented iteratively using a **Stack**.

      - The choice over whether to implement **Depth-First Search (DFS)** using recursion or with iteration and a stack isn’t merely an aesthetic choice but also has practical implications:

        - Firstly, recursion presents you with limits due to the maximum recursion depth of your chosen programming language.

        - But more importantly, recursion provides a natural mechanism for backtracking as you can simply return from a recursive call to ‘undo’ the last step. On the other hand, iteration with an explicit stack requires you to manually implement backtracking by either copying data structures into each stack item (so that dropping stack items is effectively backtracking) or by using shared state and carefully rolling back changes to this.

        - More subjectively, some people prefer recursion for its more intuitive mathematical representation of a problem, while others prefer iteration for its more explicit and easier to debug/trace states.

   2. Do you need to fill or quantify contiguous regions in a matrix?

      - You can do so using a **Flood-Fill** algorithm, which can be either a **Breadth-First Search (BFS)** or **Depth-First Search (DFS)** traversal from a starting point with the constraint that you can only move to adjacent cells that are the same ‘color’ as the starting point.

      - You can avoid accidentally revisiting cells by placing them into a **Set** or **Hash Map** as you visit them, however, in order to save memory you can also mutate the matrix in-place by marking visited cells with a different ‘color’ (and then, if you wish to, reverting these changes once you have finished).

   3. Is searching for the shortest path between some nodes or doing a ‘level-order’ traversal your main concern?

      - Use **Breadth-First Search (BFS)**.

      - Note that, BFS uses more memory than DFS because it needs to keep all of the nodes at the current level in memory, while DFS only needs to store the nodes along a single path in the tree/graph as it traverses. Therefore, if memory usage is a concern, DFS could be the better choice.

      - BFS traversals use a FIFO queue to traverse nodes and expect the edges to have uniform weights/costs. For non-uniform weight/cost graphs, we swap the FIFO queue for a priority queue (e.g. min-heap) to enable cost-aware traversals using **Dijkstra**'s or **A\***. Dijkstra's prioritises nodes based on cumulative cost from the start finding shortest paths to all nodes, while A\* also adds an ([admissible](https://en.wikipedia.org/wiki/Admissible_heuristic) and [consistent](https://en.wikipedia.org/wiki/Consistent_heuristic)) heuristic estimate towards the goal making it goal-oriented and often [more efficient for finding a specific target](https://www.redblobgames.com/pathfinding/a-star/introduction.html).

   4. Are you being asked to determine whether nodes are connected, to count the number of components in a graph, or to detect cycles?

      - In an undirected graph? Use **Union-Find**. Note that Union-Find is not suitable for directed graphs because it inherently deals with undirected equivalence relations; it merges sets and loses the sense of direction between nodes.

      - In a directed or undirected graph? Use **Depth-First Search (DFS)**. Unlike Union-Find, DFS is suitable for directed graphs and can also provide information about the shape or structure of components.

      - Being able to detect whether two nodes are connected can be a useful general optimisation technique when path-finding (e.g. BFS, DFS, Dijkstra or A\*) as it can allow you to “early exit” before beginning an invalid traversal.

6. **Does a solution to the problem result in a very expensive branching program suggesting that we might have an optimisation problem?**

   1. If local optimum decisions appear to lead to a global optimum:

      - Apply a **Greedy Algorithm**. Note that there’s no guaranteed way of knowing upfront whether local optimum decisions will lead to a global optimum, and it will require testing and analysis to determine whether this is the case.

      - If the solution to the problem seems to require future information to decide the current step, a greedy algorithm will not be appropriate and you will need to either use **Depth-First Search (DFS)** or switch to a **Dynamic Programming** approach involving **Top-Down Memoisation**.

      - A greedy algorithm makes decisions at each step based solely on the current state and local considerations, and cannot require backtracking, reconsideration of previous decisions, or deeper exploration of decision paths (like depth-first search).

   2. If it seems to be possible to compute a solution from a combination of previously computed solutions (e.g. “optimal substructure”) then we can solve it using **Dynamic Programming**. Dynamic programming is particularly beneficial when the same subproblem reappears multiple times in a computation (e.g. “overlapping subproblems”).

      - Dynamic programming allows you to save time at the expense of space.

      - There are two high-level ways of implementing dynamic programming and the choice depends on the problem:

        - We can always apply **Top-Down Memoisation**. This is effectively a DFS of the state space, generally implemented using recursive memoised function calls. It’s not always the most efficient way to solve the problem due to the overhead of recursion, but it does avoid the need to compute all possible subproblems first.

        - If the transitions between subproblems in the state space are computed in a fixed manner we can apply **Bottom-Up Tabulation**. This computes all possible subproblems iteratively first and then uses these to compute the final solution, but it avoids the overhead of recursion by computing the subproblems one-by-one iteratively and is able to store these in an array for lower memory usage.

### 🧪🤔📝

The following questions present scenarios that test your ability to select the most appropriate technique.

1. **Greedy Algorithm or Dynamic Programming?**

   - [Coin Change](https://leetcode.com/problems/coin-change/)
   - [Jump Game](https://leetcode.com/problems/jump-game/)

2. **Two Pointers or Sliding Window?**

   - [Container With Most Water](https://leetcode.com/problems/container-with-most-water/)
   - [Minimum Window Substring](https://leetcode.com/problems/minimum-window-substring/)

3. **Stack or Two Pointers?**

   - [Trapping Rain Water](https://leetcode.com/problems/trapping-rain-water/)
   - [Largest Rectangle in Histogram](https://leetcode.com/problems/largest-rectangle-in-histogram/)

4. **Stack or Queue?**

   - [Rotting Oranges](https://leetcode.com/problems/rotting-oranges/)
   - [Valid Parentheses](https://leetcode.com/problems/valid-parentheses/)

5. **Backtracking or DFS?**

   - [Number of Islands](https://leetcode.com/problems/number-of-islands/)
   - [Combination Sum](https://leetcode.com/problems/combination-sum/)

6. **Union-Find or DFS?**

   - [Course Schedule](https://leetcode.com/problems/course-schedule/)
   - [Redundant Connection](https://leetcode.com/problems/redundant-connection/)

7. **DFS or Dynamic Programming?**

   - [Pacific Atlantic Water Flow](https://leetcode.com/problems/pacific-atlantic-water-flow/)
   - [Minimum Path Sum](https://leetcode.com/problems/minimum-path-sum/)
