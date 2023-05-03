---
title: Type-safe tensors
slug: type-safe-tensors
date: "2023-05-02"
hidden: true
---

Recently, [Ben Newhouse](http://bennewhouse.com) released a TypeScript-based implementation of GPT called `potatogpt`. Although the performance may be slow, it [contains a very interesting approach to type-checking tensor arithmetic](https://github.com/newhouseb/potatogpt/tree/main#-fully-typed-tensors). This approach eliminates the need to run your code to verify whether operations are allowed or to keep track of the sizes of tensors in your head.

The implementation is quite complex, employing several advanced TypeScript techniques. In order to make it more accessible and easier to understand, I've attempted to simplify and explain the implementation with clarifying comments below.

Finally, I show how this approach allows us to easily create type-safe versions of functions like `zip`.

### Exact dimensions

In order that `Tensor`s can have exact dimensions we need to support only numeric literals (e.g. `16`, `768`, etc) for sizes known at compile time, and "branded types" for sizes only known at runtime. We must disallow non-literal `number` types or unions of `number`s (e.g. `16 | 768`) as if these get introduced into an application, data produced using these would also lack exact dimensions.

```typescript twoslash
// We check whether `T` is a numeric literal by checking that `number`
// does not extend from `T` but that `T` does extend from `number`.
type IsNumericLiteral<T> = number extends T
  ? false
  : T extends number
  ? true
  : false;

// In order to support runtime-determined sizes we use a "branded type"
// to give these dimensions labels that they can be type-checked with
// and a function `Var` to generate values with this type.
export type Var<Label extends string> = number & { label: Label };
export const Var = <Label extends string>(size: number, label: Label) => {
  return size as Var<Label>;
};
type IsVar<T> = T extends Var<string> ? true : false;

// For type-checking of tensors to work they must only ever be
// created using numeric literals (e.g. `5`)  or `Var<string>`
// and never from types like `number` or `1 | 2 | 3`.
type IsNumericLiteralOrVar<T extends number | Var<string>> = And<
  // We disallow `T` to be a union of types.
  Not<IsUnion<T>>,
  Or<
    // We allow `T` to be a numeric literal but not a number.
    IsNumericLiteral<T>,
    // We allow `T` to be a `Var`.
    IsVar<T>
  >
>;

// Utilities
type And<A, B> = A extends true ? (B extends true ? true : false) : false;
type Or<A, B> = A extends true ? true : B extends true ? true : false;
type Not<A> = A extends true ? false : true;

// `IsUnion` is based on the principle that a union like `A | B` does not
// extend an intersection like `A & B`. The conditional type uses a
// "tuple trick" technique that avoids distributing the type `T` over
// `UnionToIntersection` by wrapping the type into a one-element tuple.
// This means that if `T` is `'A' | 'B'` the expression is evaluated
// as `['A' | 'B'] extends [UnionToIntersection<'A' | 'B'>]` instead of
// `'A' | 'B' extends UnionToIntersection<'A'> | UnionToIntersection<'B'>`.
type IsUnion<T> = [T] extends [UnionToIntersection<T>] ? false : true;

// `UnionToIntersection` takes a union type and uses a "distributive
// conditional type" to map over each element of the union and create a
// series of function types with each element as their argument. It then
// infers the first argument of each of these functions to create a new
// type that is the intersection of all the types in the original union.
type UnionToIntersection<Union> = (
  Union extends unknown ? (distributedUnion: Union) => void : never
) extends (mergedIntersection: infer Intersection) => void
  ? Intersection
  : never;
```

If you need to, you can read further on the more advanced TypeScript techniques here:

- [`IsUnion`](https://stackoverflow.com/a/53955431).
- [`UnionToIntersection`](https://stackoverflow.com/a/50375286/9259778).
- ["distributive conditional types"](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html#distributive-conditional-types).

### `Tensor`

We can then implement a type-safe `Tensor` using these. TypeScript currently has a limitation that stops us from applying the `IsNumericLiteralOrVar` constraint at the argument-level so instead we make TypeScript produce `InvalidTensor` return types if
the `shape` argument is not valid using a conditional return type.

```typescript twoslash
type IsNumericLiteral<T> = number extends T
  ? false
  : T extends number
  ? true
  : false;

export type Var<Label extends string> = number & { label: Label };
export const Var = <Label extends string>(size: number, label: Label) => {
  return size as Var<Label>;
};
type IsVar<T> = T extends Var<string> ? true : false;

type IsNumericLiteralOrVar<T extends number | Var<string>> = And<
  // We disallow `T` to be a union of types.
  Not<IsUnion<T>>,
  Or<
    // We allow `T` to be a numeric literal but not a number.
    IsNumericLiteral<T>,
    // We allow `T` to be a `Var`.
    IsVar<T>
  >
>;

type And<A, B> = A extends true ? (B extends true ? true : false) : false;
type Or<A, B> = A extends true ? true : B extends true ? true : false;
type Not<A> = A extends true ? false : true;

type IsUnion<T> = [T] extends [UnionToIntersection<T>] ? false : true;
type UnionToIntersection<Union> = (
  Union extends unknown ? (distributedUnion: Union) => void : never
) extends (mergedIntersection: infer Intersection) => void
  ? Intersection
  : never;

/// ---cut---

export type Dimension = number | Var<string>;
export type Tensor<Shape extends readonly Dimension[]> = {
  data: Float32Array;
  shape: Shape;
};
export type InvalidTensor<Shape extends readonly Dimension[]> = [
  never,
  "Invalid tensor: please provide an array of only numeric literals or `Var`s.",
  Shape
];
// Due to TypeScript limitations, we can't apply constraints like
// `ArrayEveryElementIsNumericLiteralOrVar` directly to the generic
// `Shape` argument. Instead, we use a conditional type in the
// return type. This results in a type mismatch, requiring the use
// of `as any` to return the expected `Tensor`.
export function tensor<const Shape extends readonly Dimension[]>(
  shape: Shape,
  init?: number[]
): true extends ArrayEveryElementIsNumericLiteralOrVar<Shape>
  ? Tensor<Shape>
  : InvalidTensor<Shape> {
  return {
    data: init
      ? new Float32Array(init)
      : new Float32Array(shape.reduce((a, b) => a * b, 1)),
    shape,
  } as any;
}

// `ArrayEveryElementIsNumericLiteralOrVar` is similar to JavaScript's
// `Array#every` in that it checks that a particular condition is true of
// every element in an array and returns `true` if this is the case. In
// TypeScript we have to hardcode our condition (`IsNumericLiteralOrVar`)
// as we do not yet have higher-kinded generic types that can take in
// other generic types and apply these.
//
// In the code below we create a "mapped object type" from an array type
// and then apply the condition to each value in the mapped object type.
// We then use a conditional type to check whether the type outputted
// extends from a type in which the value at every key is `true`.
type ArrayEveryElementIsNumericLiteralOrVar<
  T extends ReadonlyArray<number | Var<string>>
> = T extends ReadonlyArray<unknown>
  ? { [K in keyof T]: IsNumericLiteralOrVar<T[K]> } extends {
      [K in keyof T]: true;
    }
    ? true
    : false
  : false;

// Tests
const fourDimensionalTensorWithStaticSizes = tensor([10, 100, 1000, 10000]);
const threeDimensionalTensorWithRuntimeSize = tensor([5, Var(3, "dim"), 10]);
```

If you need to, you can read further on the more advanced TypeScript techniques here:

- ["mapped types"](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html).
- ["conditional types"](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html).

### `Matrix`

```typescript twoslash
type IsNumericLiteral<T> = number extends T
  ? false
  : T extends number
  ? true
  : false;

export type Var<Label extends string> = number & { label: Label };
export const Var = <Label extends string>(size: number, label: Label) => {
  return size as Var<Label>;
};
type IsVar<T> = T extends Var<string> ? true : false;

type IsNumericLiteralOrVar<T extends number | Var<string>> = And<
  // We disallow `T` to be a union of types.
  Not<IsUnion<T>>,
  Or<
    // We allow `T` to be a numeric literal but not a number.
    IsNumericLiteral<T>,
    // We allow `T` to be a `Var`.
    IsVar<T>
  >
>;

type And<A, B> = A extends true ? (B extends true ? true : false) : false;
type Or<A, B> = A extends true ? true : B extends true ? true : false;
type Not<A> = A extends true ? false : true;

type IsUnion<T> = [T] extends [UnionToIntersection<T>] ? false : true;
type UnionToIntersection<Union> = (
  Union extends unknown ? (distributedUnion: Union) => void : never
) extends (mergedIntersection: infer Intersection) => void
  ? Intersection
  : never;

export type Dimension = number | Var<string>;
export type Tensor<Shape extends readonly Dimension[]> = {
  data: Float32Array;
  shape: Shape;
};
export type InvalidTensor<Shape extends readonly Dimension[]> = [
  never,
  "Invalid tensor: please provide an array of only numeric literals or `Var`s.",
  Shape
];
export function tensor<const Shape extends readonly Dimension[]>(
  shape: Shape,
  init?: number[]
): true extends ArrayEveryElementIsNumericLiteralOrVar<Shape>
  ? Tensor<Shape>
  : InvalidTensor<Shape> {
  return {
    data: init
      ? new Float32Array(init)
      : new Float32Array(shape.reduce((a, b) => a * b, 1)),
    shape,
  } as any;
}

type ArrayEveryElementIsNumericLiteralOrVar<
  T extends ReadonlyArray<number | Var<string>>
> = T extends ReadonlyArray<unknown>
  ? { [K in keyof T]: IsNumericLiteralOrVar<T[K]> } extends {
      [K in keyof T]: true;
    }
    ? true
    : false
  : false;

/// ---cut---

export type Matrix<Rows extends Dimension, Columns extends Dimension> = Tensor<
  [Rows, Columns]
>;
export type InvalidMatrix<Shape extends readonly [Dimension, Dimension]> = [
  never,
  "Invalid matrix: please provide an array of only numeric literals or `Var`s.",
  Shape
];
export function matrix<const Shape extends readonly [Dimension, Dimension]>(
  shape: Shape,
  init?: number[]
): true extends ArrayEveryElementIsNumericLiteralOrVar<Shape>
  ? Matrix<Shape[0], Shape[1]>
  : InvalidMatrix<Shape> {
  return tensor(shape, init) as any;
}

// Tests
const matrixWithStaticSizes = matrix([25, 50]);
const matrixWithRuntimeSize = matrix([10, Var(100, "configuredDimensionName")]);
```

### `Vector`

```typescript twoslash
type IsNumericLiteral<T> = number extends T
  ? false
  : T extends number
  ? true
  : false;

export type Var<Label extends string> = number & { label: Label };
export const Var = <Label extends string>(size: number, label: Label) => {
  return size as Var<Label>;
};
type IsVar<T> = T extends Var<string> ? true : false;

type IsNumericLiteralOrVar<T extends number | Var<string>> = And<
  // We disallow `T` to be a union of types.
  Not<IsUnion<T>>,
  Or<
    // We allow `T` to be a numeric literal but not a number.
    IsNumericLiteral<T>,
    // We allow `T` to be a `Var`.
    IsVar<T>
  >
>;

type And<A, B> = A extends true ? (B extends true ? true : false) : false;
type Or<A, B> = A extends true ? true : B extends true ? true : false;
type Not<A> = A extends true ? false : true;

type IsUnion<T> = [T] extends [UnionToIntersection<T>] ? false : true;
type UnionToIntersection<Union> = (
  Union extends unknown ? (distributedUnion: Union) => void : never
) extends (mergedIntersection: infer Intersection) => void
  ? Intersection
  : never;

export type Dimension = number | Var<string>;
export type Tensor<Shape extends readonly Dimension[]> = {
  data: Float32Array;
  shape: Shape;
};
export type InvalidTensor<Shape extends readonly Dimension[]> = [
  never,
  "Invalid tensor: please provide an array of only numeric literals or `Var`s.",
  Shape
];
export function tensor<const Shape extends readonly Dimension[]>(
  shape: Shape,
  init?: number[]
): true extends ArrayEveryElementIsNumericLiteralOrVar<Shape>
  ? Tensor<Shape>
  : InvalidTensor<Shape> {
  return {
    data: init
      ? new Float32Array(init)
      : new Float32Array(shape.reduce((a, b) => a * b, 1)),
    shape,
  } as any;
}

type ArrayEveryElementIsNumericLiteralOrVar<
  T extends ReadonlyArray<number | Var<string>>
> = T extends ReadonlyArray<unknown>
  ? { [K in keyof T]: IsNumericLiteralOrVar<T[K]> } extends {
      [K in keyof T]: true;
    }
    ? true
    : false
  : false;

export type Matrix<Rows extends Dimension, Columns extends Dimension> = Tensor<
  [Rows, Columns]
>;
export type InvalidMatrix<Shape extends readonly [Dimension, Dimension]> = [
  never,
  "Invalid matrix: please provide an array of only numeric literals or `Var`s.",
  Shape
];
export function matrix<const Shape extends readonly [Dimension, Dimension]>(
  shape: Shape,
  init?: number[]
): true extends ArrayEveryElementIsNumericLiteralOrVar<Shape>
  ? Matrix<Shape[0], Shape[1]>
  : InvalidMatrix<Shape> {
  return tensor(shape, init) as any;
}

/// ---cut---

export type RowVector<Size extends number> = Tensor<[1, Size]>;
export type Vector<Size extends number> = RowVector<Size>;
export type InvalidVector<Size extends Dimension | readonly number[]> = [
  never,
  "Invalid vector: please provide either a numeric literal or a `Var`.",
  Size
];
export function vector<const Size extends number>(
  size: Size,
  init?: number[]
): true extends IsNumericLiteralOrVar<Size>
  ? Vector<Size>
  : InvalidVector<Size>;
export function vector<const Size extends Dimension>(
  size: Size,
  init?: number[]
): true extends IsNumericLiteralOrVar<Size>
  ? Vector<Size>
  : InvalidVector<Size>;
export function vector<const Array extends readonly [number, ...number[]]>(
  init: Array
): Vector<Array["length"]>;
export function vector<
  const Size extends number | Var<string> | readonly number[]
>(size: Size, init?: number[]): Vector<any> {
  let shape: Dimension[];
  if (typeof size === "number") {
    shape = [1, size];
  } else if (Array.isArray(size)) {
    shape = [1, size.length];
    init = size;
  } else {
    throw new Error("Invalid input type for vector.");
  }

  return tensor(shape, init) as any;
}

// Tests
const vectorWithStaticSize = vector(2);
const vectorWithRuntimeSize = vector(Var(4, "configuredDimensionName"));
const vectorWithSizeFromData = vector([1, 2, 3]);
```

### `zip`

```typescript twoslash
type IsNumericLiteral<T> = number extends T
  ? false
  : T extends number
  ? true
  : false;

export type Var<Label extends string> = number & { label: Label };
export const Var = <Label extends string>(size: number, label: Label) => {
  return size as Var<Label>;
};
type IsVar<T> = T extends Var<string> ? true : false;

type IsNumericLiteralOrVar<T extends number | Var<string>> = And<
  // We disallow `T` to be a union of types.
  Not<IsUnion<T>>,
  Or<
    // We allow `T` to be a numeric literal but not a number.
    IsNumericLiteral<T>,
    // We allow `T` to be a `Var`.
    IsVar<T>
  >
>;

type And<A, B> = A extends true ? (B extends true ? true : false) : false;
type Or<A, B> = A extends true ? true : B extends true ? true : false;
type Not<A> = A extends true ? false : true;

type IsUnion<T> = [T] extends [UnionToIntersection<T>] ? false : true;
type UnionToIntersection<Union> = (
  Union extends unknown ? (distributedUnion: Union) => void : never
) extends (mergedIntersection: infer Intersection) => void
  ? Intersection
  : never;

export type Dimension = number | Var<string>;
export type Tensor<Shape extends readonly Dimension[]> = {
  data: Float32Array;
  shape: Shape;
};
export type InvalidTensor<Shape extends readonly Dimension[]> = [
  never,
  "Invalid tensor: please provide an array of only numeric literals or `Var`s.",
  Shape
];
export function tensor<const Shape extends readonly Dimension[]>(
  shape: Shape,
  init?: number[]
): true extends ArrayEveryElementIsNumericLiteralOrVar<Shape>
  ? Tensor<Shape>
  : InvalidTensor<Shape> {
  return {
    data: init
      ? new Float32Array(init)
      : new Float32Array(shape.reduce((a, b) => a * b, 1)),
    shape,
  } as any;
}

type ArrayEveryElementIsNumericLiteralOrVar<
  T extends ReadonlyArray<number | Var<string>>
> = T extends ReadonlyArray<unknown>
  ? { [K in keyof T]: IsNumericLiteralOrVar<T[K]> } extends {
      [K in keyof T]: true;
    }
    ? true
    : false
  : false;

export type Matrix<Rows extends Dimension, Columns extends Dimension> = Tensor<
  [Rows, Columns]
>;
export type InvalidMatrix<Shape extends readonly [Dimension, Dimension]> = [
  never,
  "Invalid matrix: please provide an array of only numeric literals or `Var`s.",
  Shape
];
export function matrix<const Shape extends readonly [Dimension, Dimension]>(
  shape: Shape,
  init?: number[]
): true extends ArrayEveryElementIsNumericLiteralOrVar<Shape>
  ? Matrix<Shape[0], Shape[1]>
  : InvalidMatrix<Shape> {
  return tensor(shape, init) as any;
}

export type RowVector<Size extends number> = Tensor<[1, Size]>;
export type Vector<Size extends number> = RowVector<Size>;
export type InvalidVector<Size extends Dimension | readonly number[]> = [
  never,
  "Invalid vector: please provide either a numeric literal or a `Var`.",
  Size
];
export function vector<const Size extends number>(
  size: Size,
  init?: number[]
): true extends IsNumericLiteralOrVar<Size>
  ? Vector<Size>
  : InvalidVector<Size>;
export function vector<const Size extends Dimension>(
  size: Size,
  init?: number[]
): true extends IsNumericLiteralOrVar<Size>
  ? Vector<Size>
  : InvalidVector<Size>;
export function vector<const Array extends readonly [number, ...number[]]>(
  init: Array
): Vector<Array["length"]>;
export function vector<
  const Size extends number | Var<string> | readonly number[]
>(size: Size, init?: number[]): Vector<any> {
  let shape: Dimension[];
  if (typeof size === "number") {
    shape = [1, size];
  } else if (Array.isArray(size)) {
    shape = [1, size.length];
    init = size;
  } else {
    throw new Error("Invalid input type for vector.");
  }

  return tensor(shape, init) as any;
}

/// ---cut---

/**
 * The `zip` function combines two vectors of the same length into a matrix
 * where each row contains a pair of corresponding elements from the input
 * vectors. The output matrix's data is stored in a `Float32Array` with an
 * interleaved arrangement of elements (row-major storage order) for efficient
 * access.
 *
 * Example:
 * Input vectors: [a1, a2, a3] and [b1, b2, b3]
 * Output matrix:
 * | a1 b1 |
 * | a2 b2 |
 * | a3 b3 |
 *
 * Memory layout in Float32Array: [a1, b1, a2, b2, a3, b3]
 */
function zip<SameVector extends Vector<number>>(
  a: SameVector,
  b: SameVector
): Matrix<SameVector["shape"][1], 2> {
  if (a.shape[1] !== b.shape[1]) {
    throw new Error(
      `zip cannot operate on different length vectors; ${a.shape[1]} !== ${b.shape[1]}`
    );
  }

  const length = a.shape[1];
  const resultData: number[] = [];
  for (let i = 0; i < length; i++) {
    resultData.push(a.data[i], b.data[i]);
  }

  return matrix([length, 2], resultData) as any;
}

// Tests
const threeElementVector1 = vector([1, 2, 3]);
const threeElementVector2 = vector([4, 5, 6]);
const fourElementVector1 = vector([7, 8, 9, 10]);

const zipped = zip(threeElementVector1, threeElementVector2);
// @errors: 2345
const zippedError = zip(threeElementVector1, fourElementVector1);

const threeElementVector3 = vector(Var(3, "three"), [1, 2, 3]);
const threeElementVector4 = vector(Var(3, "three"), [5, 10, 15]);
const fourElementVector2 = vector(Var(4, "four"), [10, 11, 12, 13]);

const zipped2 = zip(threeElementVector3, threeElementVector4);
// @errors: 2345
const zippedError2 = zip(threeElementVector3, fourElementVector2);
```
