---
title: Bridging the gap between neural networks and functions
slug: bridging-the-gap
date: "2023-04-19"
---

As AI increasingly affects our lives, businesses may look to their software engineers for explanations regarding AI model outputs and guidance implementing and integrating these systems. Understanding the foundations of AI may become essential, even for software engineers that do not aspire to becoming AI researchers. In this series of articles, I shall attempt to produce a layperson software engineer’s guide to understanding neural networks, transformers and mechanistic interpretability. Instead of the guide serving as a fully comprehensive reference, I’m aiming for it to be approachable yet detailed deep-dive into necessary intuitions for understanding and complementary to existing educational materials (which I will link to where I can).

A fundamental technique in AI is the application of neural networks, which are proven by the [“universal approximation theorem”](https://ai.stackexchange.com/a/13319) to be “universal function approximators”. They can reproduce the behaviour of any continuous function within a specified domain, provided they have the appropriate structure and size. In practice, neural networks can also reproduce functions with [discontinuities](https://en.wikipedia.org/wiki/Classification_of_discontinuities) and capture trends in non-deterministic processes by smoothing over issues and learning expected behaviours.

### Interpretability

As software engineers, we construct functions by arranging syntax to express our logical intent — e.g. `if n <= 1 { n } else { fn(n-1) + fn(n-2) }`. This naturally leads to functions that are easy for humans to understand and interpret, because (1) they are written in a way that is similar to how we would explain the function to others, (2) we have a full range of high-level programming syntaxes and library calls available to us instead of only a limited set of mathematical operations, and finally (3) related logic is generally refactored so as to be [colocated](https://kentcdodds.com/blog/colocation), [SOLID](https://softwareengineering.stackexchange.com/a/73069), etc.

Unfortunately, the functions modeled by neural networks are not inherently human-interpretable due to the way they are constructed. A neural network is essentially an incomprehensibly large mathematical expression composed of stacked layers. Each layer forwards its outputs to another layer, and is made up from mathematical expressions representing [artificial neurons](https://en.wikipedia.org/wiki/Artificial_neuron) computing the weighted sum of inputs plus a bias (an affine transformation but sometimes referred to as a “linear map”) followed by a non-linear activation function (e.g. `activation(sum(weights * inputs) + bias)`). There is nothing other than the overall mathematical expression formulated by the neural network, the numeric weights and biases used alongside it that are known to produce accurate results, and the scaffolding used to “train” the expression to perform as expected. This does not lead to natural interpretability and represents a significant issue for businesses reliant on being able to provide authentic explanations to clients on outputs or decisions that are called into question.

### Backpropagation is _just_ the chain rule, what’s the problem?

The reason modern neural networks are constructed as giant mathematical expressions, isn’t merely due to computational efficiency, but is substantially because training them requires a process called “backpropagation” (also known as reverse-mode automatic differentiation).

Backpropagation is, in essence, _just_ the chain rule on [(multivariate)](https://www.khanacademy.org/math/multivariable-calculus/thinking-about-multivariable-function/ways-to-represent-multivariable-functions/a/multivariable-functions) functions, and the chain rule is _just_ a way to calculate the derivative (read “rate of change”) of a composite function by multiplying the derivatives of the functions within the composition.

If you haven’t used calculus much since school and have forgotten this, an intuitive understanding of the chain rule is that it allows us to understand the relationships between different rates of change that can be observed in nature.

> _“If a car travels twice as fast as a bicycle and the bicycle is four times as fast as a walking man, then the car travels `2 * 4 = 8` times as fast as the man.”_
>
> — George F. Simmons

As an example, suppose we have a balloon being inflated such that its volume and radius are changing over time. We can use the chain rule to find out how fast the volume is changing by multiplying the rate of radius change with the rate of radius change per unit volume.

There are two ways this can be expressed. The first highlights the derivative as a composition of functions (Lagrange’s notation), while the latter is the more common form and uses the symbol `∂` to denote [“partial derivative”](https://www.khanacademy.org/math/multivariable-calculus/multivariable-derivatives/partial-derivative-and-gradient-articles/a/introduction-to-partial-derivatives) (Leibniz’s notation).

$$
V(r(t))' =  \cdot r'(t) \cdot V'(r)
$$

$$
\frac{∂V}{∂t} = \frac{∂r}{∂t} \cdot \frac{∂V}{∂r}
$$

The equations above represent the chain rule applied to the balloon example, where $r$ is the radius, $V$ is the volume, and $t$ is time. The left-hand side represents _“the rate of change of the volume with respect to time”_, while the right-hand side represents the product of _“the rate of change of the radius with respect to time”_ and _“the rate of change of the volume with respect to the radius”_.

If you still feel unclear on the chain rule check out the article [“You Already Know Calculus: Derivatives” (2011)](https://christopherolah.wordpress.com/2011/07/31/you-already-know-calculus-derivatives/) which skillfully uses everyday examples to explain calculus rules including the chain rule.

Returning to neural networks, a common pattern is to implement the mathematical expressions within it so that instead of only computing outputs they build a computional graph on application of each operation/function. This computational graph can later be traversed outwards-in to compute the derivatives of each value with respect to the final output value.

To vastly over-simplify, in psuedo-code it looks like this:

```javascript
function neuron(inputs) {
  // ...`weights` and `bias` available for each neuron...
  //
  // Note: In languages with operator overloading (e.g. Python)
  //       you can avoid creating functions for every mathematical
  //       operation through the use of operator overloading.
  //       This leads to easier to read mathematical expressions,
  //       however, the con is that the creation of the compuational
  //       graph might not be clear to whoever reads the code.
  return activation(add(sum(multiply(weights, inputs)), bias));
}

function layer(inputs) {
  // ...`neurons` available for each layer...
  return neurons.map((neuron) => neuron(inputs));
}

function model(input) {
  // ...layers would be pre-configured instead of hardcoded...

  // Output Layer
  return layer(
    // Hidden Layer 3
    layer(
      // Hidden Layer 2
      layer(
        // Hidden Layer 1
        layer(
          // Input Layer
          layer(inputs)
        )
      )
    )
  );
}

// The computational tree looks like a "parse tree" or "directed acyclic graph"
// (DAG), in that, it is a a hierarchical data structure representing the
// computations of the function.
//
// e.g.
//
// [
//   {
//     operation: 'activation',
//     output: 5,
//     inputs: [
//       {
//         operation: 'add',
//         output: 5,
//         inputs: [
//           {
//             operation: 'add',
//             output: 3,
//             inputs: [
//               {
//                 operation: 'source',
//                 output: 1,
//                 inputs: []
//               },
//               {
//                 operation: 'source',
//                 output: 2,
//                 inputs: []
//               }
//             ]
//           },
//           {
//             operation: 'source',
//             output: 2,
//             inputs: []
//           }
//         ]
//       }
//     ]
//   },
//   ...
// ]
const computationalGraph = model(inputs);
```

Being able to decompose large functions into compositions of many smaller functions is helpful when implementing a neural network, as when coupled with the chain rule and the ability to calculate the local derivative of an input with respect to its output, this allows us to decompose the relative “impact” of each input parameter on the final output. This is incredibly useful as it means we can determine the impact of each weight and bias on the overall model outputs.

$$
\frac{∂L}{∂input\_weight\_or\_bias} \mathrel{+}= \frac{∂current\_weight\_or\_bias}{∂input\_weight\_or\_bias} \cdot \frac{∂L}{∂current\_weight\_or\_bias}
$$

The equation above represents the chain rule applied to a node within a neural network’s computational graph and shows how we can compute the partial derivative of _“the loss function with respect to an input weight or bias”_ by multiplying the local derivative of the _“current weight or bias with respect to its input weight or bias”_ by the partial derivative of _“the loss function with respect to the current weight or bias”_. (Note: we’ll discuss loss functions later on — for now substitute the final output wherever you see the loss function $L$ mentioned.)

- In the example above $\frac{∂L}{∂current\_weight\_or\_bias}$ (the `gradient`) would have been computed as $\frac{∂L}{∂input\_weight\_or\_bias}$ by a prior iteration of the backpropagation algorithm and therefore can be substituted with the value of the `gradient`.
- On the other hand, $\frac{∂current\_weight\_or\_bias}{∂input\_weight\_or\_bias}$ is the local derivative and must be computed based on the type of operation/function and its input values.
  - A function is differentiable if it is continuous and has a derivative at every point in its domain.
  - Mathematical operators like multiply and add are [trivially differentiable](https://github.com/sebinsua/micrograd-rs/blob/8dfd2edc5b9f1521bd0d9884c2933803ff4ba3cc/src/engine.rs#L635-L667).
  - Discontinuities in a function can make it non-differentiable at those specific points. For example, the non-linear activation function $ReLU(x) = max(0, x)$ is discontinuous at $x = 0$ and therefore is not differentiable at that point, however, it is still differentiable otherwise (e.g. $ReLU'(x) = 0, x < 0$ or $ReLU'(x) = 1, x > 0$). In practice, $x = 0$ is very rare and we can safely set the subderivative to 0 at that point.
- We accumulate (e.g. $\mathrel{+}=$) the result of multiplying these two partial derivatives into $\frac{∂L}{∂input\_weight\_or\_bias}$ which means that multiple output values of the network could contribute to the gradient of a single input weight or bias. Only after all functions/operations that an input weight or bias is involved in have been processed will the $\frac{∂L}{∂input\_weight\_or\_bias}$ have been computed and be ready for use as a $\frac{∂L}{∂current\_weight\_or\_bias}$ in a future iteration of the backpropagation algorithm. A topological sort may be used to ensure that this is the case.

As long as there is a way to compute or approximate the local derivative of every function/operation, we can use this to help compute the derivative of the loss function with respect to every input weight and bias in the neural network.

For further discussion on computational graphs and the efficiency benefits of applying derivatives using these I can’t recommend [“Calculus on Computational Graphs: Backpropagation” (2015)](https://colah.github.io/posts/2015-08-Backprop/) highly enough. It’s a very easy-to-understand guide to computing derivatives that is detailed as well as economical with your time.

### Optimizing the model by minimizing the loss through updates to the weights and biases

It’s not enough to merely have a function that can be used to “predict” values by repeatedly computing weighted sums of inputs, adding biases and passing their results through activation functions. Even if we had a way to compute derivatives of these outputs with respect to their weights and biases, it would still tell us nothing about how to improve the performance of the network. What we need is a way to measure how well the network is performing and a method of using this information to update weights and biases.

That is where the [“loss” function](https://stackoverflow.com/q/42877989) comes in. The loss function (sometimes known as a cost function or error function) is a function that compares the predicted value produced by the model with the actual value that we want the model to produce. It provides both a performance metric and an optimization objective, with the goal of minimizing the loss function during training to improve the network’s performance.

$$
\begin{array}{c}

\mathcal{L}(\text{predicted}, \text{actual}) = \frac{1}{n} \sum_{i=1}^{n} (\text{predicted}_i - \text{actual}_i)^2
\\
\\
\text{Mean squared error (MSE) loss function}

\end{array}
$$

The lower the loss, the less information the model loses and the better it performs; the higher the loss, the worse the model performs.

Once your neural network’s huge mathematical expression is producing a loss value as its output, backpropagation can be used to compute the derivative of the loss function with respect to each weight or bias in the network — known as its `gradient`. It’s important to note that the `gradient` of a weight or bias is not the same as the weight or bias itself. The `gradient` is the name given to the derivative (“rate of change”) of the loss function with respect to the weight or bias and represents the impact of a small change in the weight or bias on the loss function.

This `gradient` can then be used in a process called “gradient descent” to update the weight or bias in a way that reduces the total loss of the network — e.g. if the `gradient` of a weight is positive, then the weight should be decreased, while if the `gradient` of a weight is negative, then the weight should be increased; similarly if the `gradient` is large, then the weight should be updated by a large amount, while if the `gradient` is small, then the weight should be updated by a small amount.

The process described above is repeated for each “epoch” (iteration) of the training loop, and the magnitude of these updates to the weights and biases are also controlled by a “learning rate”. Both the learning rate and the number of epochs are hyperparameters that can be tuned to improve the performance of the network, alongside other aspects of the network such as the number of layers, the number of neurons in each layer, the activation function used in each layer, amongst other things.

### Neural networks: magical function approximators that sacrifice interpretability

In our pursuit of computers that can autonomously figure out how to achieve desired outcomes, we discovered that neural networks are “universal function approximators” capable of approximating arbitrary functions.

To achieve this, we stack layers (parameterised affine transformations followed by non-linear activation functions) and train our model by repeatedly adjusting its parameters until it behaves like the function we’d like to approximate.

As layers are stacked, the overall function becomes increasingly non-linear, allowing the model to represent more complex functions. However, this comes with a bit of a devil’s bargain, as the mathematics behind neural networks constrain our ability to represent functions in ways that are naturally interpretable:

1.  All operations/functions used by a neural network to produce its output _must be_ differentiable.

2.  Any logic or understanding learnt will be generically represented by the network’s weights and biases (its parameters) and because these participate in the calculations of derivatives these _must be_ real-valued numeric values.

3.  Mathematical expressions and parameter initializations must be carefully designed to avoid issues such as _“symmetry”_ (neurons that produce the same outputs), _“dead neurons”_ (neurons that always output zero), _“exploding gradients”_ (gradients that grow exponentially in magnitude), and _“vanishing gradients”_ (gradients that shrink exponentially in magnitude), as well as other numerical stability issues.

The price of magic was interpretability — whether we can get this back is a question for another day.

---

If you want to learn further about neural networks, I highly recommend following along with [“The spelled-out intro to neural networks and backpropagation: building micrograd”](https://youtu.be/VMj-3S1tku0) and implementing your own version of `micrograd` in a language of your choosing ([see my heavily-commented Rust version here](https://github.com/sebinsua/micrograd-rs)).
