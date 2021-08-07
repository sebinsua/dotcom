---
title: TypeScript Example 0
slug: typescript-example-0
date: "2019-09-19"
---

Here is some text.

```json
{ "json": true }
```

And some more text. And some more text. And some more text. And some more text. And some more text. And some more text. And some more text. And some more text. And some more text. And some more text. And some _more_ text. And some **more** text. And a `variable`. And a [link](http://google.co.uk).

```ts twoslash
interface Properties {
  id: number;
  name: string;
}

// ---cut---
function createLabel(idOrName: Properties): void {
  throw "unimplemented";
}

let a = createLabel({ id: 123, name: "typescript" });
```

Then a quote:

> Hear me. Hear me. Hear me. Hear me. Hear me. Hear me. Hear me. Hear me. Hear me. Hear me. Hear me. Hear me. Hear me. Hear me.

Finally we finish writing.
