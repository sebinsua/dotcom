---
title: Inverse number spiral
slug: inverse-number-spiral
date: "2023-05-11"
---

Recently, while working on a problem from the [CSES Problem Set](https://cses.fi/problemset/) known as [#1071: “Number Spiral”](https://cses.fi/problemset/task/1071), I accidentally misread the problem description and instead of finding $N$ for a given $[y, x]$, solved the inverse by finding $[y, x]$ for a given $N$. This problem turned out to have an interesting solution based on simple mathematical reasoning and as I couldn’t find any other solutions for this variant online, I thought I’d share my solution here.

I’ve named this the “Inverse Number Spiral” problem and here is the problem description:

## Problem

> # #$1071^{-1}$: Inverse Number Spiral
>
> <div style="text-align: center"><u><b>Time limit:</b> 1.00 s</u>&nbsp;&nbsp;&nbsp;&nbsp;<u><b>Memory limit:</b> 512 MB</u></div>
>
> A number spiral is an infinite grid whose upper-left square has number 1. Here are the first five layers of the spiral:
>
> <p align="center" width="100%">
>   <img alt="Number Spiral" src="./assets/posts/inverse-number-spiral/number-spiral-1.png" />
> </p>
>
> Your task is to find out the row $y$ and column $x$ given a number $N$.
>
> ### Input
>
> The first input line contains an integer $t$: the number of tests.
>
> After this, there are $t$ lines, each containing an integer $N$.
>
> ### Output
>
> For each test, print the row $y$ and column $x$.
>
> ### Constraints
>
> $$
> 1 ≤ t ≤ 10^{5}
> \\
> 1 ≤ y,x ≤ 10^{9}
> $$
>
> ### Example
>
> **Input:**
>
> ```
> 3
> 8
> 1
> 15
> ```
>
> **Output:**
>
> ```
> 2 3
> 1 1
> 4 2
> ```

## Analysis

My initial thought was that I could solve this problem by simply iterating over the spiral and checking if the current number is equal to the given number $N$. I imagined a robot starting at position $[1, 1]$, moving like a snake—right, down, left and up— while adjusting the number of steps in each direction. However, understanding the sequence of steps proved to be quite challenging. The pattern appeared complex and difficult to comprehend, making it difficult to implement (e.g. right 1, down 1, left 1, down 1, right 2, up 2, right 1, down 3, left 3, down 1, right 4, up 4).

Additionally, the time complexity of such an algorithm would be $O(N)$, and considering that the number of tests $t$ is also an input parameter the overall time complexity would be $O(t \cdot N)$. With potentially up to $10^{5}$ tests and $N$ values reaching up to $10^{9}$, the brute-force approach would require up to $10^{14}$ iterations which might cause the program to exceed the time limit.

Given these challenges, I decided to look to see whether I could find an alternative approach that would offer a more efficient and elegant solution.

As I contemplated the spiral grid, I recognized a familiar pattern at the end of each layer of the spiral:

$$
1, 4, 9, 16, 25
$$

It was the sequence of [square numbers](https://en.wikipedia.org/wiki/Square_number) (e.g. $n^2$), where $n$ was the layer of the spiral. This observation sparked my curiosity and led me to wonder if I could leverage this pattern to my advantage.

<p align="center" width="100%">
  <img alt="Layers" src="./assets/posts/inverse-number-spiral/number-spiral-2.png" />
</p>

I realised that the maximum value in each layer of the spiral was equal to the square of the layer number. For example, the maximum value in <span style="color: rgb(21, 52, 238)">layer 3 was $3^2 = 9$</span>, the maximum value in <span style="color: rgb(240, 80, 231)">layer 4 was $4^2 = 16$</span>, and so on. This meant that I could use the square root function to determine the layer number for a given value $N$. Only the square numbers of a layer would directly produce the layer number when taking a square root, however all values in the layer including its minimum produce a decimal value greater than the previous layer number and therefore as long as we round up this value to the nearest integer (e.g. `Math.ceil`) it produces the correct layer number.

```typescript twoslash
function layer(N: number) {
  return Math.ceil(Math.sqrt(N));
}

const L1 = layer(1); // 1
const L2 = layer(2); // 2
const L3 = layer(3); // 2
const L4 = layer(4); // 2
const L5 = layer(5); // 3
const L6 = layer(6); // 3
const L7 = layer(7); // 3
const L8 = layer(8); // 3
const L9 = layer(9); // 3
const L10 = layer(10); // 4
```

Once I had a layer $L$ number, I was able to use this to determine the range of values for that layer, as for a given layer $L$ the maximum value is $L^2$ and the minimum value is $(L-1)^2 + 1$ (if you add one to the maximum value of the previous layer you get the minimum of the layer that follows it).

```typescript twoslash
function layerRange(L: number) {
  const start = Math.pow(L - 1, 2) + 1;
  const end = Math.pow(L, 2);

  return [start, end] as const;
}

const R1 = layerRange(1); // [1, 1]
const R2 = layerRange(2); // [2, 4]
const R3 = layerRange(3); // [5, 9]
const R4 = layerRange(4); // [10, 16]
```

The way I saw it at this point was that a layer range represented a sort of one-dimensional version of each layer of the spiral. In order to determine the $[y, x]$ coordinates for a given value $N$, I needed to be able to determine the position of $N$ within this layer, and then to translate that position back into $[y, x]$ coordinates.

I found that I was able to get the position of $N$ within the one-dimensional layer range quite easily by subtracting the minimum value of the layer from $N$. For example, the position of $N = 7$ in layer 3 was $7 - 5 = 2$. However, in order to convert the one-dimensional position into two-dimensional $[y, x]$ coordinates within the grid, there were two further properties of the spiral that I needed to use to my advantage:

1. The spiral goes in a clockwise direction in even layers and an anti-clockwise direction in odd layers.
2. Depending on the position of $N$ in relation to the mid-point of the layer range and the direction of the spiral, the $y$ or $x$ coordinates are either set to the layer number $L$ or calculated. For example, the spiral travels clockwise in the 5th layer and therefore when the position of $N$ within the layer range is less than or equal to its mid-point, the $y$ coordinate of $N$ is the layer number $L$, however, when the position of $N$ within the layer range is greater than its mid-point, the $x$ coordinate of $N$ is the layer number $L$. The inverse is true for odd layers.

With all of this in mind, I was finally able to determine the $[y, x]$ coordinates for a given value $N$, like so:

```typescript twoslash
function layer(N: number) {
  return Math.ceil(Math.sqrt(N));
}

function layerRange(L: number) {
  const start = Math.pow(L - 1, 2) + 1;
  const end = Math.pow(L, 2);

  return [start, end] as const;
}

/// ---cut---

function direction(L: number, axis: "y" | "x") {
  switch (axis) {
    case "y": {
      // Determine the direction for the "y" axis based on the even/odd nature
      // of the layer (L). If L is even, the direction is down (1); otherwise,
      // it is up (-1).
      return L % 2 === 0 ? 1 : -1;
    }
    case "x": {
      // Determine the direction for the "x" axis based on the even/odd nature
      // of the layer (L). If L is even, the direction is left (-1); otherwise,
      // it is right (1).
      return L % 2 === 0 ? -1 : 1;
    }
    default: {
      throw new Error(`Invalid axis argument supplied: ${axis}`);
    }
  }
}

function coord(N: number, axis: "y" | "x") {
  const L = layer(N);

  const [start, end] = layerRange(L);

  // The sequence index is a zero-indexed "position" of N within the layer range.
  const sequenceIndex = N - start;

  // The mid index is the mid-point of the layer range.
  const midIndex = (end - start) / 2;

  // Depending on the direction of the spiral and the axis, the coordinate can be
  // either (1) the layer number (L), (2) a position of N computed by starting
  // from the beginning of the layer range, (3) a position of N computed by
  // starting from the end of the layer range and counting back towards the
  // center.
  const D = direction(L, axis);
  switch (D) {
    // If the direction is down or right.
    case 1: {
      if (sequenceIndex <= midIndex) {
        // For the first half of the sequence, the coordinate is simply the
        // sequence index incremented by one to convert it from zero-indexed
        // to one-indexed.
        return 1 + sequenceIndex;
      }

      // For the second half of the sequence, the coordinate is the layer (L)
      // itself.
      return L;
    }
    // If the direction is up or left.
    case -1: {
      if (sequenceIndex > midIndex) {
        // For the second half of the sequence, the coordinate is calculated
        // by counting back from the maximum value of the outer layer (L)
        // towards the center. We do this by subtracting the difference
        // between the sequence index and the midIndex from the layer (L).
        return L - (sequenceIndex - midIndex);
      }

      // For the first half of the sequence, the coordinate is the layer (L)
      // itself.
      return L;
    }
    default: {
      throw new Error(`Invalid direction generated: ${direction}`);
    }
  }
}

function y(N: number) {
  return coord(N, "y");
}

function x(N: number) {
  return coord(N, "x");
}

function f(N: number) {
  return [y(N), x(N)] as const;
}

const F1 = f(1); // [1, 1]
const F4 = f(4); // [2, 1]
const F7 = f(7); // [3, 3]
const F9 = f(9); // [1, 3]
const F11 = f(11); // [2, 4]
const F13 = f(13); // [4, 4]
const F14 = f(14); // [4, 3]
const F17 = f(17); // [5, 1]
const F18 = f(18); // [5, 2]
const F24 = f(24); // [2, 5]
const F25 = f(25); // [1, 5]
```

By identifying patterns in the number spiral and leveraging mathematical relationships, we were able to transform a seemingly complex problem into a solvable one. In the process, we developed an efficient algorithm that significantly reduces the time complexity compared to a brute-force approach.

Because we are able to calculate the coordinates for a given number $N$ using only constant-time mathematical operations, the time complexity of the solution is $O(1)$. When we execute `f(N)` for each test case $t$ in the input, the overall time complexity becomes $O(t)$, a substantial improvement over the brute-force approach which would have a time complexity of $O(t \cdot N)$.

Although further optimizations, such as memoizing the results of f(N) for each $N$ in the input to minimize duplicate calculations, could still be made, the current solution is both efficient and elegantly simple.

Now that you've seen our approach to solving this problem, we encourage you to try your hand at the original [“Number Spiral”](https://cses.fi/problemset/task/1071) problem. If you're looking for more challenges, the entire [CSES Problem Set](https://cses.fi/problemset/) is an excellent resource to explore, offering a wide range of problems to help hone your coding and problem-solving skills
