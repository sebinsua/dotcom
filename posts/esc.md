---
title: Esc
slug: esc
date: "2026-06-17"
description: "What to type after wtf."
---

**LBA**: Load-bearing assumption. The basis of your understanding rests on an assumption. What are you assuming? How can you verify these assumptions? Every conclusion downstream from an unchecked assumption inherits its uncertainty.

**TEA**: Reading tea leaves. Don't assume that the information you currently hold is a useful diagnostic. What is salient to you right now might not be relevant unless you can connect it to the claim you're making and a true observation can still be irrelevant. You don't have to work from the signal you already have; go and get a signal that is relevant to the question: add logging, instrument the code, request a stack trace, create a unit test, take a screenshot, run a probe, use the app and watch. Before inferring, consider whether or why this signal should move belief about a claim, and what you'd expect to see if the claim were false.

**EXP**: Invalid experiment design. Your procedure couldn't have produced a result that would contradict you. A test written after a fix might prove nothing: you must see it fail against the broken code and it must test the right thing. It passing doesn't show it can detect the defect, as it may have already passed with the defect. Decide what outcome would falsify the claim, then proceed. For a bug: see the test fail on the unfixed code, then apply the fix and see it pass.

**UJI**: Unjustified intervention. You made a change without establishing it was the right one. The common failure is having a change in hand and treating that as reason enough to make it. But, it can be wrong for many reasons: wrong location, wrong approach, a misunderstanding of the goal, missing context/background for its decisions, over or under scoped, packaging arbitrary or incidental decisions that were not evaluated, being unreasonable about its cost, etc. A concrete example of this is patching where an error surfaced instead of finding or modelling its root cause. Before applying a change, make attempts to determine whether it's the right one!
