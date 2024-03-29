---
title: Type-safe tensors
slug: type-safe-tensors
date: "2023-05-10"
---

Recently, [Ben Newhouse](http://bennewhouse.com) released a TypeScript-based implementation of GPT called `potatogpt`. Although the performance may be slow, it [contains a very interesting approach to type-checking tensor arithmetic](https://github.com/newhouseb/potatogpt/tree/main#-fully-typed-tensors). This approach eliminates the need to run your code to verify whether operations are allowed or to keep track of the sizes of tensors in your head.

The implementation is quite complex, employing several advanced TypeScript techniques. In order to make it more accessible and easier to understand, I’ve attempted to simplify and explain the implementation with clarifying comments below.

Finally, I show how this approach allows us to easily create type-safe versions of functions like `zip` and `matmul`.

### Exact dimensions

In order that `Tensor`s can have exact dimensions we need to support only numeric literals (e.g. `16`, `768`, etc) for sizes known at compile time, and “branded types” for sizes only known at runtime. We must disallow non-literal `number` types or unions of `number`s (e.g. `16 | 768`) as if these get introduced into an application, data produced using these would also lack exact dimensions.

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

- [`IsUnion`](https://stackoverflow.com/a/53955431)
- [`UnionToIntersection`](https://stackoverflow.com/a/50375286/9259778)
- [“distributive conditional types”](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html#distributive-conditional-types)

### Tensor

We can then implement a type-safe `Tensor` with a unique constraint: the dimensions must be specified using numeric literals or “branded types”. This approach pushes the limits of TypeScript’s standard type-checking capabilities and requires a non-idiomatic usage of conditional types to represent these errors. Note that, we diverged from Ben’s original implementation by enforcing this dimensional constraint at the argument-level instead of doing so [at the return-level with a conditional return type that produces an invalid tensor](https://github.com/newhouseb/potatogpt/blob/d2ee0cae82c7429bd5f8c140e64ff3d70ef7ff87/math.ts#L34). The downside of this is that you must use `as const` on the `shape` argument to prevent TypeScript from widening the literal types to `number`.

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
export function tensor<const Shape extends readonly Dimension[]>(
  shape: AssertShapeEveryElementIsNumericLiteralOrVar<Shape>,
  init?: number[]
): Tensor<Shape> {
  return {
    data: init
      ? new Float32Array(init)
      : new Float32Array((shape as Shape).reduce((a, b) => a * b, 1)),
    shape: shape as Shape,
  };
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

type InvalidArgument<T> = readonly [never, T];
type AssertShapeEveryElementIsNumericLiteralOrVar<
  T extends ReadonlyArray<number | Var<string>>
> = true extends ArrayEveryElementIsNumericLiteralOrVar<T>
  ? T
  : ReadonlyArray<
      InvalidArgument<"The `shape` argument must be marked `as const` and only contain number literals or branded types.">
    >;

// Tests
const fourDimensionalTensorWithStaticSizes = tensor([
  10, 100, 1000, 10000,
] as const);
const threeDimensionalTensorWithRuntimeSize = tensor([
  5,
  Var(3, "dim"),
  10,
] as const);

// @errors: 2322
const invalidTensor1 = tensor([10, 100, 1000, 10000]);
// @errors: 2322 2345
const invalidTensor2 = tensor([10 as number, 100, 1000, 10000] as const);
// @errors: 2322 2345
const invalidTensor3 = tensor([5, 3 as 3 | 6 | 9, 10] as const);
```

If you need to, you can read further on the more advanced TypeScript techniques here:

- [“mapped types”](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html)
- [“conditional types”](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)
- <a href="https://twitter.com/mattpocockuk/status/1625173884885401600">“branded types”</a>

### Matrix

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
export function tensor<const Shape extends readonly Dimension[]>(
  shape: AssertShapeEveryElementIsNumericLiteralOrVar<Shape>,
  init?: number[]
): Tensor<Shape> {
  return {
    data: init
      ? new Float32Array(init)
      : new Float32Array((shape as Shape).reduce((a, b) => a * b, 1)),
    shape: shape as Shape,
  };
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

type InvalidArgument<T> = readonly [never, T];
type AssertShapeEveryElementIsNumericLiteralOrVar<
  T extends ReadonlyArray<number | Var<string>>
> = true extends ArrayEveryElementIsNumericLiteralOrVar<T>
  ? T
  : ReadonlyArray<
      InvalidArgument<"The `shape` argument must be marked `as const` and only contain number literals or branded types.">
    >;

/// ---cut---

function isDimensionArray(
  maybeDimensionArray: any
): maybeDimensionArray is readonly Dimension[] {
  return (
    Array.isArray(maybeDimensionArray) &&
    maybeDimensionArray.some((d) => typeof d === "number")
  );
}
function is2DArray(maybe2DArray: any): maybe2DArray is number[][] {
  return (
    Array.isArray(maybe2DArray) &&
    maybe2DArray.some((row) => Array.isArray(row))
  );
}
function flat<T>(arr: T[][]): T[] {
  let result: T[] = [];
  for (let i = 0; i < arr.length; i++) {
    result.push.apply(result, arr[i]);
  }
  return result;
}

export type Matrix<Rows extends Dimension, Columns extends Dimension> = Tensor<
  readonly [Rows, Columns]
>;
export function matrix<
  const TwoDArray extends ReadonlyArray<ReadonlyArray<number>>
>(init: TwoDArray): Matrix<TwoDArray["length"], TwoDArray[0]["length"]>;
export function matrix<const Shape extends readonly [Dimension, Dimension]>(
  shape: AssertShapeEveryElementIsNumericLiteralOrVar<Shape>,
  init?: number[]
): Matrix<Shape[0], Shape[1]>;
export function matrix<const Shape extends readonly [Dimension, Dimension]>(
  shape: AssertShapeEveryElementIsNumericLiteralOrVar<Shape>,
  init?: number[]
): Matrix<Shape[0], Shape[1]> {
  let resolvedShape: readonly [any, any];
  if (isDimensionArray(shape)) {
    resolvedShape = shape;
  } else if (is2DArray(shape)) {
    resolvedShape = [shape.length, shape[0].length];
    init = flat(shape);
  } else {
    throw new Error("Invalid shape type for matrix.");
  }

  return tensor(resolvedShape, init);
}

// Tests
const matrixWithStaticSizes = matrix([25, 50] as const);
const matrixWithRuntimeSize = matrix([
  10,
  Var(100, "configuredDimensionName"),
] as const);
const matrixWithSizeFromData = matrix([
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
]);

// @errors: 2322 2769
const invalidMatrix1 = matrix([25, 50]);
// @errors: 2322 2345 2769
const invalidMatrix2 = matrix([25 as number, 50] as const);
// @errors: 2322 2345 2769
const invalidMatrix3 = matrix([10, 100 as 100 | 115] as const);
```

### Vector

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
export function tensor<const Shape extends readonly Dimension[]>(
  shape: AssertShapeEveryElementIsNumericLiteralOrVar<Shape>,
  init?: number[]
): Tensor<Shape> {
  return {
    data: init
      ? new Float32Array(init)
      : new Float32Array((shape as Shape).reduce((a, b) => a * b, 1)),
    shape: shape as Shape,
  };
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

type InvalidArgument<T> = readonly [never, T];
type AssertShapeEveryElementIsNumericLiteralOrVar<
  T extends ReadonlyArray<number | Var<string>>
> = true extends ArrayEveryElementIsNumericLiteralOrVar<T>
  ? T
  : ReadonlyArray<
      InvalidArgument<"The `shape` argument must be marked `as const` and only contain number literals or branded types.">
    >;

function isDimensionArray(
  maybeDimensionArray: any
): maybeDimensionArray is readonly Dimension[] {
  return (
    Array.isArray(maybeDimensionArray) &&
    maybeDimensionArray.some((d) => typeof d === "number")
  );
}
function is2DArray(maybe2DArray: any): maybe2DArray is number[][] {
  return (
    Array.isArray(maybe2DArray) &&
    maybe2DArray.some((row) => Array.isArray(row))
  );
}
function flat<T>(arr: T[][]): T[] {
  let result: T[] = [];
  for (let i = 0; i < arr.length; i++) {
    result.push.apply(result, arr[i]);
  }
  return result;
}

export type Matrix<Rows extends Dimension, Columns extends Dimension> = Tensor<
  readonly [Rows, Columns]
>;
export function matrix<
  const TwoDArray extends ReadonlyArray<ReadonlyArray<number>>
>(init: TwoDArray): Matrix<TwoDArray["length"], TwoDArray[0]["length"]>;
export function matrix<const Shape extends readonly [Dimension, Dimension]>(
  shape: AssertShapeEveryElementIsNumericLiteralOrVar<Shape>,
  init?: number[]
): Matrix<Shape[0], Shape[1]>;
export function matrix<const Shape extends readonly [Dimension, Dimension]>(
  shape: AssertShapeEveryElementIsNumericLiteralOrVar<Shape>,
  init?: number[]
): Matrix<Shape[0], Shape[1]> {
  let resolvedShape: readonly [any, any];
  if (isDimensionArray(shape)) {
    resolvedShape = shape;
  } else if (is2DArray(shape)) {
    resolvedShape = [shape.length, shape[0].length];
    init = flat(shape);
  } else {
    throw new Error("Invalid shape type for matrix.");
  }

  return tensor(resolvedShape, init);
}

/// ---cut---

type AssertSizeIsNumericLiteralOrVar<T extends Dimension> =
  true extends IsNumericLiteralOrVar<T>
    ? T
    : InvalidArgument<"The `size` argument must only contain number literals or branded types.">;

export type RowVector<Size extends Dimension> = Tensor<readonly [1, Size]>;
export type Vector<Size extends Dimension> = RowVector<Size>;
export function vector<const OneDArray extends readonly Dimension[]>(
  init: OneDArray
): Vector<OneDArray["length"]>;
export function vector<const Size extends Dimension>(
  size: AssertSizeIsNumericLiteralOrVar<Size>,
  init?: number[]
): Vector<Size>;
export function vector<const Size extends Dimension>(
  size: AssertSizeIsNumericLiteralOrVar<Size>,
  init?: number[]
): Vector<Size> {
  let shape: readonly [1, any];
  if (typeof size === "number") {
    shape = [1, size];
  } else if (Array.isArray(size)) {
    shape = [1, size.length];
    init = size;
  } else {
    throw new Error("Invalid size type for vector.");
  }

  return tensor(shape, init);
}

// Tests
const vectorWithStaticSize = vector(2);
const vectorWithRuntimeSize = vector(Var(4, "configuredDimensionName"));
const vectorWithSizeFromData = vector([1, 2, 3]);

// @errors: 2769
const invalidVector1 = vector(2 as number);
// @errors: 2769
const invalidVector2 = vector(100 as 100 | 115);
```

### zip

Once we have a `Vector` and `Matrix` type defined, we can use these to write a type-safe `zip` function that combines two `Vector`s of the same length into a `Matrix` of `[VectorLength, 2]`, like so:

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
export function tensor<const Shape extends readonly Dimension[]>(
  shape: AssertShapeEveryElementIsNumericLiteralOrVar<Shape>,
  init?: number[]
): Tensor<Shape> {
  return {
    data: init
      ? new Float32Array(init)
      : new Float32Array((shape as Shape).reduce((a, b) => a * b, 1)),
    shape: shape as Shape,
  };
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

type InvalidArgument<T> = readonly [never, T];
type AssertShapeEveryElementIsNumericLiteralOrVar<
  T extends ReadonlyArray<number | Var<string>>
> = true extends ArrayEveryElementIsNumericLiteralOrVar<T>
  ? T
  : ReadonlyArray<
      InvalidArgument<"The `shape` argument must be marked `as const` and only contain number literals or branded types.">
    >;

function isDimensionArray(
  maybeDimensionArray: any
): maybeDimensionArray is readonly Dimension[] {
  return (
    Array.isArray(maybeDimensionArray) &&
    maybeDimensionArray.some((d) => typeof d === "number")
  );
}
function is2DArray(maybe2DArray: any): maybe2DArray is number[][] {
  return (
    Array.isArray(maybe2DArray) &&
    maybe2DArray.some((row) => Array.isArray(row))
  );
}
function flat<T>(arr: T[][]): T[] {
  let result: T[] = [];
  for (let i = 0; i < arr.length; i++) {
    result.push.apply(result, arr[i]);
  }
  return result;
}

export type Matrix<Rows extends Dimension, Columns extends Dimension> = Tensor<
  readonly [Rows, Columns]
>;
export function matrix<
  const TwoDArray extends ReadonlyArray<ReadonlyArray<number>>
>(init: TwoDArray): Matrix<TwoDArray["length"], TwoDArray[0]["length"]>;
export function matrix<const Shape extends readonly [Dimension, Dimension]>(
  shape: AssertShapeEveryElementIsNumericLiteralOrVar<Shape>,
  init?: number[]
): Matrix<Shape[0], Shape[1]>;
export function matrix<const Shape extends readonly [Dimension, Dimension]>(
  shape: AssertShapeEveryElementIsNumericLiteralOrVar<Shape>,
  init?: number[]
): Matrix<Shape[0], Shape[1]> {
  let resolvedShape: readonly [any, any];
  if (isDimensionArray(shape)) {
    resolvedShape = shape;
  } else if (is2DArray(shape)) {
    resolvedShape = [shape.length, shape[0].length];
    init = flat(shape);
  } else {
    throw new Error("Invalid shape type for matrix.");
  }

  return tensor(resolvedShape, init);
}

type AssertSizeIsNumericLiteralOrVar<T extends Dimension> =
  true extends IsNumericLiteralOrVar<T>
    ? T
    : InvalidArgument<"The `size` argument must only contain number literals or branded types.">;

export type RowVector<Size extends Dimension> = Tensor<readonly [1, Size]>;
export type Vector<Size extends Dimension> = RowVector<Size>;
export function vector<const OneDArray extends readonly Dimension[]>(
  init: OneDArray
): Vector<OneDArray["length"]>;
export function vector<const Size extends Dimension>(
  size: AssertSizeIsNumericLiteralOrVar<Size>,
  init?: number[]
): Vector<Size>;
export function vector<const Size extends Dimension>(
  size: AssertSizeIsNumericLiteralOrVar<Size>,
  init?: number[]
): Vector<Size> {
  let shape: readonly [1, any];
  if (typeof size === "number") {
    shape = [1, size];
  } else if (Array.isArray(size)) {
    shape = [1, size.length];
    init = size;
  } else {
    throw new Error("Invalid size type for vector.");
  }

  return tensor(shape, init);
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
function zip<SameVector extends Vector<Dimension>>(
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

  return matrix([length as any, 2] as const, resultData);
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

### matmul

Finally, functions like [`matmul`](https://en.wikipedia.org/wiki/Matrix_multiplication) that expect two operands with different but compatible shapes, can be implemented using the same techniques:

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
export function tensor<const Shape extends readonly Dimension[]>(
  shape: AssertShapeEveryElementIsNumericLiteralOrVar<Shape>,
  init?: number[]
): Tensor<Shape> {
  return {
    data: init
      ? new Float32Array(init)
      : new Float32Array((shape as Shape).reduce((a, b) => a * b, 1)),
    shape: shape as Shape,
  };
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

type InvalidArgument<T> = readonly [never, T];
type AssertShapeEveryElementIsNumericLiteralOrVar<
  T extends ReadonlyArray<number | Var<string>>
> = true extends ArrayEveryElementIsNumericLiteralOrVar<T>
  ? T
  : ReadonlyArray<
      InvalidArgument<"The `shape` argument must be marked `as const` and only contain number literals or branded types.">
    >;

function isDimensionArray(
  maybeDimensionArray: any
): maybeDimensionArray is readonly Dimension[] {
  return (
    Array.isArray(maybeDimensionArray) &&
    maybeDimensionArray.some((d) => typeof d === "number")
  );
}
function is2DArray(maybe2DArray: any): maybe2DArray is number[][] {
  return (
    Array.isArray(maybe2DArray) &&
    maybe2DArray.some((row) => Array.isArray(row))
  );
}
function flat<T>(arr: T[][]): T[] {
  let result: T[] = [];
  for (let i = 0; i < arr.length; i++) {
    result.push.apply(result, arr[i]);
  }
  return result;
}

export type Matrix<Rows extends Dimension, Columns extends Dimension> = Tensor<
  readonly [Rows, Columns]
>;
export function matrix<
  const TwoDArray extends ReadonlyArray<ReadonlyArray<number>>
>(init: TwoDArray): Matrix<TwoDArray["length"], TwoDArray[0]["length"]>;
export function matrix<const Shape extends readonly [Dimension, Dimension]>(
  shape: AssertShapeEveryElementIsNumericLiteralOrVar<Shape>,
  init?: number[]
): Matrix<Shape[0], Shape[1]>;
export function matrix<const Shape extends readonly [Dimension, Dimension]>(
  shape: AssertShapeEveryElementIsNumericLiteralOrVar<Shape>,
  init?: number[]
): Matrix<Shape[0], Shape[1]> {
  let resolvedShape: readonly [any, any];
  if (isDimensionArray(shape)) {
    resolvedShape = shape;
  } else if (is2DArray(shape)) {
    resolvedShape = [shape.length, shape[0].length];
    init = flat(shape);
  } else {
    throw new Error("Invalid shape type for matrix.");
  }

  return tensor(resolvedShape, init);
}

type AssertSizeIsNumericLiteralOrVar<T extends Dimension> =
  true extends IsNumericLiteralOrVar<T>
    ? T
    : InvalidArgument<"The `size` argument must only contain number literals or branded types.">;

export type RowVector<Size extends Dimension> = Tensor<readonly [1, Size]>;
export type Vector<Size extends Dimension> = RowVector<Size>;
export function vector<const OneDArray extends readonly Dimension[]>(
  init: OneDArray
): Vector<OneDArray["length"]>;
export function vector<const Size extends Dimension>(
  size: AssertSizeIsNumericLiteralOrVar<Size>,
  init?: number[]
): Vector<Size>;
export function vector<const Size extends Dimension>(
  size: AssertSizeIsNumericLiteralOrVar<Size>,
  init?: number[]
): Vector<Size> {
  let shape: readonly [1, any];
  if (typeof size === "number") {
    shape = [1, size];
  } else if (Array.isArray(size)) {
    shape = [1, size.length];
    init = size;
  } else {
    throw new Error("Invalid size type for vector.");
  }

  return tensor(shape, init);
}

/// ---cut---

function matmul<
  RowsA extends Dimension,
  SharedDimension extends Dimension,
  ColumnsB extends Dimension
>(
  a: Matrix<RowsA, SharedDimension>,
  b: IsNumericLiteralOrVar<SharedDimension> extends true
    ? Matrix<SharedDimension, ColumnsB>
    : InvalidArgument<"The rows dimension of the `b` matrix must match the columns dimension of the `a` matrix.">
): Matrix<RowsA, ColumnsB> {
  const aMatrix = a;
  const bMatrix = b as Matrix<SharedDimension, ColumnsB>;

  const [aRows, aCols] = aMatrix.shape;
  const [bRows, bCols] = bMatrix.shape;
  if (aCols !== bRows) {
    throw new Error(
      "The rows dimension of the `b` matrix must match the columns dimension of the `a` matrix."
    );
  }

  const shape = [aRows, bCols] as AssertShapeEveryElementIsNumericLiteralOrVar<
    [RowsA, ColumnsB]
  >;
  const data = Array<number>(aRows * bCols).fill(0);
  for (let rowIndex = 0; rowIndex < aRows; rowIndex++) {
    for (let columnIndex = 0; columnIndex < bCols; columnIndex++) {
      let dotProduct = 0;
      for (
        let sharedDimensionIndex = 0;
        sharedDimensionIndex < aCols;
        sharedDimensionIndex++
      ) {
        const rowCellFromA =
          aMatrix.data[rowIndex * aCols + sharedDimensionIndex];
        const columnCellFromB =
          bMatrix.data[sharedDimensionIndex * bCols + columnIndex];
        dotProduct += rowCellFromA * columnCellFromB;
      }

      data[rowIndex * bCols + columnIndex] = dotProduct;
    }
  }

  return matrix(shape, data);
}

// Tests
const a = matrix([2, 3] as const);
const b = matrix([3, 2] as const);
const c = matrix([7, 7] as const);

const validMatmul = matmul(a, b);
// @errors: 2345
const invalidMatmul = matmul(a, c);
```
