---
title: Is dismissing the algorithmic tech interview a memetic hazard?
slug: algorithmic-bathwater
date: "2023-09-07"
hidden: true
---

### Algorithmic bathwater

https://twitter.com/yacineMTB/status/1687126523910799360

The belief that algorithmic tech interviews do not test for real-world programming skills is a memetic hazard. There might be truth to it but it serves as displacement from what are often the real underlying reasons for resistance: insecurity and fear over being seen as inadequate.

It’s crucial to realise that whether or not these problems are a good way to assess skill levels, they often contain different ways of thinking and require novel techniques or hard-won algorithms. While uncomfortable, acknowledging this offers us an opportunity to grow. Learning to solve these problems can genuinely enrich your problem-solving skills and expand your toolkit.

### Not going in blind

https://twitter.com/var_epsilon/status/1690755091052077056

Mastering a few fundamental problems can make you more effective at a wide range of challenges, but how do you go about truly understanding these _‘eigenproblems’_?

The creator of the [“Blind 75” problem set](https://www.teamblind.com/post/New-Year-Gift---Curated-List-of-Top-75-LeetCode-Questions-to-Save-Your-Time-OaM1orEU), an engineer from Meta, attempted to distill the most useful questions for learning the core concepts and techniques for each category/type of problems from their experience doing 400-500 LeetCode questions during their last job hunt.

75 questions is still a very large time commitment, and the reality is that it’s even more time onerous than it might look as fluency generally requires [spaced repetition of the problems](https://old.reddit.com/r/leetcode/comments/15tcmwq/got_to_100_hards/jwk4e9r/) by doing a variety of topics each week and revisiting these again in subsequent weeks.

What we want to be able to do is to be able to identify and apply the right techniques given an unknown problem, and this is about grasping the intent, design, and the decision-making involved in this. This can certainly be picked up incidentally by doing lots of problems and eventually beginning to pattern-match them, but I’d argue that this isn’t the most efficient way to learn as a lot of the knowledge doesn’t appear to be naturally tacit.

Naturally it’s also quite common to hear people say that if they ever need an algorithm they’ll “just Google it”, however this belief is quite suspect as you’re unlikely to reach for Google without awareness of the techniques that might be applicable. Better understanding can help you to recognise opportunities for application in the first place.

This article aims to articulate what is often left unsaid, to make your practice more focused and effective. While it won’t replace hands-on experience in the nuances of implementation, it should be helpful in improving your understanding of technique _‘applicability’_.

> ### Note
>
> This is a work in progress and I’ll be adding more to this article over time.
> <a href="mailto:me@sebinsua.com">Please email me with any insights or suggestions you have for how to improve it.</a>

### What kind of problem do I have?

1. **Does a trivial solution to the problem result in a very expensive branching program suggesting that we might have an optimisation problem?**

   1. If local optimum decisions appear to lead to a global optimum:

      - Apply a **Greedy Algorithm**. Note that there’s no guaranteed way of knowing upfront whether local optimum decisions will lead to a global optimum, and it will require testing and analysis to determine whether this is the case.

      - If the solution to the problem seems to require future information to decide the current step, a greedy algorithm will not be appropriate and you will need to either use **Depth-first Search (DFS)** or switch to a **Dynamic Programming** approach involving **Top-down Memoisation**.

      - A greedy algorithm makes decisions at each step based solely on the current state and local considerations, and cannot require backtracking, reconsideration of previous decisions, or deeper exploration of decision paths (like depth-first search).

   2. If it seems to be possible to compute a solution from a combination of previously computed solutions (e.g. “optimal substructure”) then we can solve it using **Dynamic Programming**. Dynamic programming is particularly beneficial when the same subproblem reappears multiple times in a computation (e.g. “overlapping subproblems”).

      - Dynamic programming allows you to save time at the expense of space.

      - There are two high-level ways of implementing dynamic programming and the choice depends on the problem:

        - We can always apply **Top-down Memoisation**. This is effectively a DFS of the state space, generally implemented using recursive memoised function calls. It’s not always the most efficient way to solve the problem due to the overhead of recursion, but it does avoid the need to compute all possible subproblems first.

        - If the transitions between subproblems in the state space are computed in a fixed manner we can apply **Bottom-up Tabulation**. This computes all possible subproblems iteratively first and then uses these to compute the final solution, but it avoids the overhead of recursion by computing the subproblems one-by-one iteratively and is able to store these in an array for lower memory usage.

2. **Is the problem related to a linear/sequential data structure (e.g. array, linked list, string, search space)?**

   1. Are we being asked to find pairs, triplets or a sub-array that match a constraint?

      - To solve this optimally (e.g. $\mathcal{O}(N)$), we need to be able to easily compare elements in the sequence without using nested loops. We have at most two options:

        - _Ensuring the sequence is sorted_ and then applying the **Two Pointers** technique:

          - We can avoid the need for a nested loop if the sequence is sorted, as we can operate upon the sequence using two explicit pointers, one at the start and one at the end. The pointers clarify which elements are being considered for the condition being evaluated, and on each iteration we choose how to move these pointers based on the result of a comparison.

          - This is particularly useful when a deterministic order matters or when we are looking for unique pairs/triplets.

        - Using a **Hash Map**:

          - This allows us to store seen elements and to then look up the complement of the current element in the hash table. It’d be a more appropriate choice when the sequence is unsorted and sorting it would break problem constraints, or when we need to remember past elements for comparison but don’t care about their order.

   2. Are we being asked to find a longest/shortest substring or subsequence that matches a particular constraint or to compute aggregate statistics for a particular length subsequence?

      - To solve this optimally, we want to be able to re-use the computations from previous windows so that we can update our answer for each window in constant time (e.g. $\mathcal{O}(1)$) and the whole sequence can be completed in linear time (e.g. $\mathcal{O}(N)$).

      - We can do this by applying the **Sliding Window** technique, either using a fixed window size or a dynamic window size that can expand, shrink or reset based on certain conditions. Please note that these are not implemented in the same way as Two Pointers problems as explicit pointers towards the start and end of the window, but instead they generally use a single loop iterator and some additional variables to keep track of the window’s characteristics. This is a subtle but important distinction from the two-pointer technique.

   3. Are we being asked to find a target value or minimum/maximum value in this sequence?

      - If the sequence is unsorted, there is no way to do better than a linear scan of the sequence (e.g. $\mathcal{O}(N)$).

      - But, if the sequence is sorted we can apply the **Binary Search** technique.

      - In fact, we can apply the **Binary Search** technique if the sequence is _partially sorted_ as long as it is _partitionable_ (e.g. we can discern a sorted and unsorted partition on each iteration).

      - We can also apply the **Binary Search** technique to compute numerical approximations if a sequence is ordered but virtual (e.g. a search space).

   4. Are we being asked to detect cycles in a linked list or to find the middle element?

      - Use the **Fast-and-slow Pointers** technique. If the pointers meet, there is a cycle.

      - If we need to find the middle element, we can rely on the fact that the slow pointer will be at the middle element when the fast pointer reaches the end of the list.

   5. Are we being asked to find duplicates in a sequence?

      - If the sequence is sorted, then duplicate items will be next to each other and we can find them by comparing adjacent elements in the sequence.

      - If the sequence is unsorted, we can add elements that we see into a **Set** or **Hash Map** and then check whether the current element is within this.

   6. Does the problem require frequent and ordered access to recently processed elements?

      - In situations in which you need access to elements in some dynamic order you cannot just use a `for`-loop to iterate through some elements in a fixed order, and likely will need to append elements into a dynamically ordered sequence maintained within a **Stack** or **Queue**.

      - If we need to access the most recently processed elements we can use a **Stack**. This has $\mathcal{O}(1)$ access at the end that elements are appended.

        - Note that ‘stack’ is a bit of an overloaded term as it refers to any last-in first-out (LIFO) structures. They are often arrays (or linked lists) but this isn’t necessarily the case. For example, when executing programs we keep a stack of frames within a block of contiguous memory.

        - I think it can also be helpful to think of how other data structures can also have stack-like access patterns. For example, when given a decimal integer we can ‘peek’ at its last-most digit using `% 10` and then ‘pop’ this using a `// 10`.

      - If we need to access the least recently processed elements we can use a **Queue**. This has $\mathcal{O}(1)$ access at its start, at the opposite end to where elements are appended.

   7. Are we being asked to merge sorted lists?

      - Use a **Min-Heap**.

3. **Does the problem involve categorizing or identifying unique elements based on some aspect of them not immediately known?**

   - These are in fact conceptually **Hash Map** problems (because you cannot use **Set**s for identifying “uniqueness” as in this case it is not defined by the value of the element itself). However, the crux of these questions often lies not in the choice of data structure, but the creation of a hash-like bucketing function that can efficiently capture some invariant of the element that it can be grouped by. For example, anagrams can be grouped by the frequency of their characters, snowflakes by their lexicographically smallest rotation, and so on.

4. **Does the problem require you to perform efficient lookups of data?**

   1. Do we need to quickly store or lookup strings or provide autocomplete functionality?

      - Use a **Trie** data structure (also known as a prefix tree). This is a tree data structure that stores strings in a way that allows for fast (e.g. $\mathcal{O}(K)$) retrieval and updates of strings that share a common prefix.

   2. Are we being asked to query the smallest/largest/median values?

      - Use a **Min-Heap** or **Max-Heap** data structure to query for the smallest/largest values (in $\mathcal{O}(1)$).

      - You can use a combination of both **Min-Heap** and **Max-Heap** if you want to compute the median.

      - There are time/space costs to maintaining heaps (creating a heap costs $\mathcal{O}(N)$ but updates are $\mathcal{O}(\log N)$ due to the cost to `heapify`), so this makes more sense when you expect to make multiple queries over the lifetime of your program. The concept of amortised cost is also important when comparing min-heaps to algorithms like quickselect. While min-heaps offer a consistent update time of $\mathcal{O}(\log N)$, quickselect’s time complexity may be more efficient for one-off or occasional operations.

      - Heaps do not maintain sorted order of their elements, and therefore do not offer $\mathcal{O}(1)$ access to the $k$th smallest/largest element. If you need to do this, while still allowing for efficient updates, you can use a **Binary Search Tree (BST)** data structure, possibly augmented with additional information to make it self-balancing (e.g. **AVL Tree** or **Red-Black Tree**).

5. **Does the problem require you to recover the order of some elements or substrings within a sequence?**

   - If you are able to infer partial information about how particular elements are connected, for example, if they come before or after each other or if they overlap (or touch), you can use this information to help build a **Directed Graph**. Vertexes can represent elements, while edges can represent the information inferred from the data, and, once this is achieved, it’s often possible to recover the order by running something like a **Topological Sort**.

   - In general, graphs seem a good fit for problems involving recovering the order of a sequence, for example, “de Bruijn” graphs are used for the re-assembly of de-novo DNA sequences from k-mers in computational biology.

6. **Are you dealing with data points that are interconnected in some way, needing to generate and test paths or sequences, or wishing to traverse elements in a matrix?**

   > ### Note
   >
   > 1. Problems like this can often be solved using graph or tree data structures, but it’s important to note that these are not the only ways of representing data that is interconnected. For example, you can also use a matrix to represent a graph, or an array to represent a tree (as is done when implementing heaps). The choice of data structure is often a trade-off between memory usage and performance.
   > 2. There are similarities between iteration of sequences and traversals in graphs, trees or search spaces. Traversal is essentially an extended form of iteration, designed to handle dynamic, non-linear, branching data structures. Different traversal strategies, such as BFS (level-order) and DFS (pre-order, in-order, post-order), offer specific advantages tailored to the nature of the problem at hand.

   1. Have you been asked to find a combination or permutation of elements that match a constraint?

      - When you have a particular target or constraint that needs to be met, it generally suggests that you will need to go deeply into the search space to find and test each path. This suggests that you will need to use a **Depth-first Search (DFS)** approach, however, this will likely result in an explosion of paths that need to be explored and very slow performance as well as bad memory usage. To avoid this, you will need to prune paths early-on that cannot possibly lead to a solution, and, also due to the potential depth of the search space use a **Backtracking** approach to rollback any modifications to shared state that are made during the search.

      - **Depth-first Search (DFS)** has a lot of overlap with **Top-down Memoisation**. In fact, top-down memoisation is depth-first search but with a caching optimisation to avoid re-computing subproblems (e.g. “overlapping subproblems”). Top-down memoisation is generally assumed to be implemented using recursion, but in fact, it can also be implemented iteratively using a **Stack**.

      - The choice over whether to implement **Depth-first Search (DFS)** using recursion or with iteration and a stack isn’t only an aesthetic choice but also has practical implications:

        - Firstly, recursion presents you with limits due to the maximum recursion depth of your chosen programming language.

        - But more importantly, recursion provides a natural mechanism for backtracking as you can simply return from a recursive call to ‘undo’ the last step. On the other hand, iteration with an explicit stack requires you to implement backtracking manually by either copying data structures into each stack item (so that dropping stack items is effectively backtracking) or by using shared state and carefully rolling back changes to this.

   2. Do you need to fill or quantify contiguous regions in a matrix?

      - You can do so using a **Flood-fill** algorithm, which can be either a **Breadth-first Search (BFS)** or **Depth-first Search (DFS)** traversal from a starting point with the constraint that you can only move to adjacent cells that are the same ‘color’ as the starting point.

      - You can avoid accidentally re-visiting cells by placing them into a **Set** or **Hash Map** as you visit them, however, in order to save memory you can also mutate the matrix in-place by marking visited cells with a different ‘color’ (and then, if you wish to, reverting these changes once you have finished).

   3. Is searching for the shortest path or minimal steps between nodes your main concern?

      - Use **Breadth-first Search (BFS)**.

      - In general, BFS can actually use more memory than DFS, because BFS needs to keep all of the nodes at the current level in memory, while DFS only needs to store the nodes along a single path in the tree/graph as it traverses. Therefore, if memory usage is a concern, DFS could be the better choice.

      - BFS is also not suitable for weighted graphs which need an algorithm like Dijkstra’s or A\*.

   4. Are you being asked to determine whether nodes are connected, to count the number of components in a graph, or to detect cycles?

      - In an undirected graph? Use **Union-Find**. Note that Union-Find is not suitable for directed graphs because it inherently deals with undirected equivalence relations; it merges sets and loses the sense of direction between nodes.

      - In a directed or undirected graph? Use **Depth-first Search (DFS)**. Unlike Union-Find, DFS is suitable for directed graphs and can also provide information about the shape or structure of components.

### 🧪🤔📝

The following questions present scenarios that test your ability to select the most appropriate technique.

1. **Greedy Algorithm or Dynamic Programming?**

   - [Coin Change](https://leetcode.com/problems/coin-change/)
   - [Jump Game](https://leetcode.com/problems/jump-game/)

2. **Two Pointers or Sliding Window?**

   - [Container With Most Water](https://leetcode.com/problems/container-with-most-water/)
   - [Minimum Window Substring](https://leetcode.com/problems/minimum-window-substring/)

3. **Stack or Queue?**

   - [Rotting Oranges](https://leetcode.com/problems/rotting-oranges/)
   - [Valid Parentheses](https://leetcode.com/problems/valid-parentheses/)

4. **Backtracking or DFS?**

   - [Number of Islands](https://leetcode.com/problems/number-of-islands/)
   - [Combination Sum](https://leetcode.com/problems/combination-sum/)

5. **Union-Find or DFS?**

   - [Course Schedule](https://leetcode.com/problems/course-schedule/)
   - [Redundant Connection](https://leetcode.com/problems/redundant-connection/)

6. **DFS vs Dynamic Programming?**

   - [Pacific Atlantic Water Flow](https://leetcode.com/problems/pacific-atlantic-water-flow/)
   - [Minimum Path Sum](https://leetcode.com/problems/minimum-path-sum/)
