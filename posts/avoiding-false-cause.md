---
title: Avoiding false cause
slug: avoiding-false-cause
date: "2017-01-12"
---

Tech teams often cargo-cult the practices and patterns that are established earlier on by their creators.

This can lead to useless boilerplate proliferating and sometimes to the creators eventually deciding that they have no choice but to disavow their earlier approaches.

https://twitter.com/dan_abramov/status/802571906385932288

### Dogma is bad but noticing things is hard

Dogma is bad because it leads to poorly-fit solutions.

However, in the absence of dogma, a greater problem can reveal itself: _it’s hard to correctly notice the causes of problems_.

Dogma might not be the right solution, but it does serve a purpose. Without frameworks to act as guard rails, patterns and best-practices are needed to help less experienced engineers find their feet and avoid wasting time.

### Problem solving

The central instruments of problem-solving are:

1. Carefully _noticing_ things.
2. Correctly _establishing_ cause-and-effect.
3. Effectively _implementing_ solutions.

As engineers we often focus our energy on the final item, however here we will concentrate on ‘noticing things’ and avoiding [false causes](https://en.wikipedia.org/wiki/Questionable_cause) and the bad solutions that arise from these and which result in wasted developer productivity.

In writing this essay my hope to to inform those that create libraries or tools on how to best increase accessibility for both beginners and experts and to provide a high-level framework for thinking about some of the problems that we encounter.

## Noticing things

Over the last few years, I’ve spent quite a bit of time as a consultant technical lead, often advising teams made up of very junior software engineers. This has given me a lot of exposure to the problems that they face.

Some of the problems that I noticed are already in the process of being fixed (e.g. complex build processes should no longer be the default as better tools attempt to provide good default choices), however I also encountered a number of problems that surprised me. This lead me to believe that (1) there are still many ways in which we are too permissive even as we reject past dogma, and (2) there are useful patterns and heuristics that are either unwritten or overlooked.

Here are some of the issues I encountered:

### Mismanagement of salience

> **salience**
>
> ˈseɪlɪəns/
> _noun_
>
> noun: **salience**; noun: **saliency**; plural noun: **saliencies**
>
> the quality of being particularly noticeable or important; prominence.
>
> “the political salience of religion has a considerable impact”

Great developer experience (DX) is largely about control over salience. Software and its outputs should be understood by all engineers that contribute to them.

Here are a few examples of how problems of saliency can occur:

#### Silent failures or overly noisy output

<u>Silence</u>

I once worked on a codebase which was very heavily tooled, and on which one of the more junior engineers often complained about having difficulties getting his code to work. From time to time I would come over to provide direction and help them to fix logical issues, often relying on my ability to quickly understand what was being coded rather than reaching for any particular debugging technique. Since this generally helped, I incorrectly assumed that their complaint was due to the occasional mistakes I spotted within their code.

A few weeks later, I made a linting error in my own code, started the app and got a white screen of death. I checked the Developer Console and to my surprise saw a `404 Not Found` error against the HTTP request for JavaScript.

It turned out that the build process had been misconfigured and it would exit without outputting code if it found any linting error. To make matters worse it emitted no errors when it did this. Failure was silent.

This behaviour primarily affected junior engineers on the team, since many senior engineers program within the linters rules by default and hence rarely see its errors. Ironically, a process that had originally been setup to help engineers write consistent code was hindering their understanding by making their logic fail for irrelevant reasons. And, since those that wrote the build process were less exposed to linting errors the problem was effectively invisible to them.

This class of problem is likely more common than you’d expect. Build processes are quite often cobbled together at the start of projects by lead/senior engineers, who often hit different edge-cases than beginners.

Lessons learned:

- A build process should have invariants for its expected outputs and should error loudly when it fails any of these.
- Junior engineers are important customers of build processes and developer tools. They are more reliant on these tools and therefore we should seek their feedback and centre it creating or combining these tools.
- It’s a good idea to use an off-the-shelf build process and to avoid hacking together a new one for every project you create.

<u>Noise</u>

On the other end of the spectrum is the [Tragedy of the Commons](https://en.wikipedia.org/wiki/Tragedy_of_the_commons) that occurs when combining lots of disparate tools into a single process.

A popular software principle is the [Unix Philosophy](https://en.wikipedia.org/wiki/Unix_philosophy)’s [Rule of Silence](http://www.linfo.org/rule_of_silence.html). This states:

> Developers should design programs so that they do not print unnecessary output. This rule aims to allow other programs and developers to pick out the information they need from a program’s output without having to parse verbosity.

Often individual tools will follow this principle, or at least provide options to help reduce the default verbosity (e.g. `npm run -s`). However, as engineers begin to combine them the total output will tend to become noisy and difficult to parse, reducing its usability.

#### Defactoring to understand code and hence leaving a larger surface area for errors

Beginners tend to understand and debug problems through tinkering and excavation instead of through contextual readings of the code or situation.

This will sometimes lead them to [defactor](http://raganwald.com/2013/10/08/defactoring.html) logic towards units of meaning that are easier for them to granularly understand and observe. This can lead to a loss of salience for more experienced engineers that have learnt to work at a higher-level of abstraction due to its greater expressivity, and reduced surface area for errors.

Unless we retreat back up the ladder of abstraction after gaining understanding this can aggravate future problems.

#### Unamenabilility to laddering

<u>A preference for trees or forests</u>

A suspicion I have is that in order to gain understanding and debug problems different engineers require different things to be salient. Senior engineers might prefer for the overall approach and context to be expressive and concise so that it can be checked against their [previous experiences](https://en.wikipedia.org/wiki/Indexicality), while junior engineers might need the individual details of the problem to be most salient so they can build understanding from scratch.

<u>Laddering</u>

https://twitter.com/worrydream/status/812369681075965952

Maybe a useful way of looking at the developer experience of a codebase is to try to judge it by the quality of the abstraction ladder that has been embedded within it? How easy is it for engineers with differing preferences towards granularities of abstraction to move up-and-down this ladder? Can they do so non-destructively?

![Abstraction Ladder](http://i.imgur.com/tRf29Nx.gif)

_“Language in Thought and Action” by S.I. Hayakawa_

I have recently seen valuable work being done [improving error messages](http://elm-lang.org/blog/compilers-as-assistants) by expressing them as a granular detail (including a diff of expected to actual) alongside context and beginner hints. This is analogous to Bret Victor’s tweet on stories and stats:

https://twitter.com/worrydream/status/812369540386459648

### Deep-nesting and nullability

When programming in JavaScript, it’s not unusual to run into errors like `TypeError: props.service.manufacturingService is undefined`.

In general, in the absence of [static typing](https://en.wikipedia.org/wiki/Type_system#Static_type_checking) deeply-nested object properties signal that some code is likely to be fragile.

For example:

```javascript
import React from 'react';

const roleNames = {
    CHAIRMAN: 'Chairman',
    CEO: 'Chief Executive Officer',
    MD: 'Managing Director'
};

export function SomeComponentDeepWithinHierarchy(props) {
    return (
        <div className="service-box">
            <h2>{props.service.name}<h2>
            <div className="service-box__info">
                <p>{props.service.description}</p>
                {props.service.manufacturingService.factories[0]
                    ?
                        <ul>
                            <li>Primary Factory: {props.service.manufacturingService.factories[0].name}</li>
                            <li>Owner Role: {roleNames[props.service.manufacturingService.factories[0].owners[0].roleType]}</li>
                        </ul>
                    : ''}
            </div>
        </div>
    );
}
```

The logic shown above has many opportunities to throw `TypeError`s:

- `props.service` could be null.
- `props.service.manufacturingService` could be null.
- `props.service.manufacturingService.factories[0]` could be null or empty.
- `props.service.manufacturingService.factories[0].owners[0]` could be null or empty.
- `roleNames` could be missing a key-value mapping for `props.service.manufacturingService.factories[0].owners[0].role`.
  - This won’t even throw an error, but instead will silently evaluate to `undefined`.

Every time `service` is passed down the component hierarchy into a component that will read from it, it endows a stealth requirement to either trust that the data is there or to manually check before each property access.

Often back-end engineers that work in languages with static typing produce deeply-nested objects like these without thinking twice. And, if the shape of the object hasn’t yet been stabilised on the back-end, uncertainty on the front-end can quickly cause a proliferation of defensive programming throughout the component hierarchy (e.g. if-else checks on `props.service && props.service.manufacturingService && props.service.manufacturingService.factories.length && ...`). Over time these checks become FUD that clouds other team member’s understanding of data contracts.

Engineers with less experience working with JavaScript won’t realise that they have a problem until it’s too late. And, they will sometimes [exasperate the problem](https://en.wikipedia.org/wiki/Law_of_Demeter) often attempting to resolve the problem while also trying to reduce key strokes: for example, by choosing to pass through kitchen-and-sink objects so function signatures look simpler.

Of course, there are best practices. For example: objects can be flattened, nullability reduced at the source, defaults can be provided, [TypeScript](hhttps://www.typescriptlang.org) definitions setup, [transforms](https://github.com/yury-dymov/json-api-normalizer) moved to the edges, [selectors](https://github.com/reduxjs/reselect) configured, and finally when there is no other choice careful use of [deep property selector functions](http://ramdajs.com/docs/#prop).

### Too many potential output shapes

The best way I can explain this one is to intentionally write bad code:

```javascript
const initialState = {
  priceToggle: false,
  userConfig: {},
};

export default function reducer(state = initialState, action) {
  const newState = cloneDeep(state);

  switch (action.type) {
    case "SET_CONFIG_DATA":
      return {
        userConfig: action.payload.userConfig,
      };
    case "FETCH_USER_SUCCESS":
      newState.currentUser = action.payload;
      break;
    case "FETCH_PRODUCTS_SUCCESS":
      newState.products = action.payload;
      break;
    case "MARK_AS_EDITING_PRODUCT":
      const { productIndex } = action.payload;
      newState.editingProductIndex = productIndex;
      newState.products[productIndex].originalData =
        newState.products[productIndex];
      newState.products[productIndex].editing = true;
      break;
    case "UPDATE_PRODUCT_KEY":
      const { productIndex, propertyName, propertyValue } = action.payload;
      if (newState.products[productIndex][propertyName] !== propertyValue) {
        newState.products[productIndex].changed = true;
      }
      newState.products[productIndex][propertyName] = propertyValue;
      break;
    case "MARK_AS_NO_LONGER_EDITING_PRODUCT":
      const { productIndex } = action.payload;
      newState.products[productIndex] =
        newState.products[productIndex].originalData;
      break;
    case "CREATE_PRODUCT_SUCCESS":
      const { productIndex } = action.payload;
      newState.products[productIndex].editing = false;
      delete newState.products[productIndex].originalData;
      break;
    case "FETCH_SUPERSTORES_SUCCESS":
      newState.superstores = action.payload;
      if (!newState.currentSuperstoreId) {
        newState.currentSuperstoreId = newState.superstores[0].id;
      }
      break;
    case "SELECT_SUPERSTORE":
      newState.currentSuperstoreId = action.payload;
      break;
    case "TOGGLE_PRICE":
      newState.priceToggle = !newState.priceToggle;
      break;
  }

  return newState;
}
```

Here, various problems arise:

- **Difficulty determining the reducer’s output shape**: By default it will contain a boolean for `priceToggle` and an empty object for `userConfig`, but almost every other property might be `null`, and in fact `products` can have dynamic properties.
- **Difficulty reading the state mutations within branches**: It’s also hard to read since step-by-step mutations are applied to `newState` in order to generate the correct object.
- **Reducer’s output shape is dependent on the order of the actions received**: Depending on the collection of and order of the actions that are received, the reducer will output a different shaped object. In fact, in this example, if `SET_CONFIG_DATA` is called after the other actions it will destroy the state they’d setup.

This problem is considerably worse when a function has over 20 branches or is over 1000 lines long. In one project I consulted on, a decision had been made to store all of the state required for each page in a respective `reducer` function, and this combined with a lack of experience handling data made it very difficult to reason when there were bugs. As more features were added to pages, the number of branches increased and the number of possible output shapes increased combinatorially.

Nowadays I recommend using static typing in your app. But, the underlying theory is to reduce the number of possible shapes that your data can take, as this affords you the ability to reason about your application’s state more easily while also requiring less complication in your logic.

### Use of mutable global state

Within the earlier `reducer` code example, there are also a few other issues:

#### Switching into ‘editing’ mode, and then resetting state on cancellation

Mutating the data that is currently displayed on the screen, and then resetting it if the edit is cancelled is a bad pattern. It’s preferable to mimic [transactions](https://en.wikipedia.org/wiki/Database_transaction) by placing the data that is going to be edited into another store where it can be mutated, and then only choosing to mutate the original data if the operation is successful. This is better since it is less destructive by default, and side-effects only when it needs to.

#### Making multiple, dynamic key-value changes

Functions of the form `setProductProperty(propertyName: string, propertyValue: any | undefined)` allow you to write any value into an object. This is problematic since it is so general that it is descriptive of almost any mutation. There are a few cases in which it might be the right solution, however in most cases we should constrain signatures in a way that they are descriptive of more specific intentions and name these so that they describe the _action that should occur_ instead of the _state that should be set_.

#### Mutating cached API responses

Pages that receive data from an API, display it, update it and then send it back to the server should not mutate the cache of the original data that was received from the server. The reason for this is that it’s confusing for the client and the server to be out-of-sync and buggy if other pages or components rely on this data being correct. Instead it’s better to treat the server data as if it is immutable, and to store it separately from the data that the client is preparing for the server. A benefit of this is that it makes it much more explicit whether the data that is being sent back was provided by the server or whether it has been created or modified client-side.
