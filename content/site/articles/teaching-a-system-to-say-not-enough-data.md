---
title: Teaching a System to Say "Not Enough Data"
slug: teaching-a-system-to-say-not-enough-data
excerpt: >-
  A research tool that invents confident-looking numbers is worse than no tool
  at all. Here is why I made honesty a feature, and the three rules I use to
  decide when software should refuse to answer.
author: Rauhan Sheikh
publishedAt: '2026-10-20T00:00:00.000Z'
readingTime: 4 min read
tags:
  - Data Quality
  - Product Engineering
  - Machine Learning
  - Reliability
isFeatured: true
isPublished: false
---
## The number that looked right

Early in a product I build, there was a column of estimates. Every row had a number. The numbers looked reasonable, they sorted nicely, and the screen felt complete.

Then someone pointed at a product that had not even launched yet and asked why it already had sales.

Nothing was broken in the code. The estimate was doing exactly what I had asked: take whatever signals exist, fill the gaps with category averages, and always return something. The problem was the word *always*.

**A system that always answers is not confident. It is just never allowed to say it doesn't know.**

## Why an invented number is worse than no number

If a tool shows nothing, the user knows they have to look elsewhere. If it shows a plausible number, they act on it. In my case the people acting were sellers deciding what to put real money into. A wrong figure that looks precise is the most expensive kind of wrong, because nobody questions it.

That changed how I thought about the work. The goal was not a model with a smaller error. The goal was a system whose *errors are visible*, so that a bad answer announces itself instead of blending in.

## Rule 1: Separate "unknown" from "low"

The first fix is mostly a data-modelling one. "Zero", "very low" and "we have no idea" are three different states, and a single numeric column cannot tell them apart.

So the output stopped being a number and became a number *plus a reason*:

- **A measured value**, when there is a reliable signal behind it.
- **A range or a floor**, when the signal only tells us "less than something".
- **Not enough data**, when there is nothing trustworthy to say.
- **New listing**, when the item is too young for any history to mean anything.

Those last two are not error messages. They are answers. A user who sees "not enough data" learns something true; a user who sees an invented figure learns something false.

## Rule 2: Never dress an average up as a measurement

The sneakiest failure is the fallback. When a product has no history, it is tempting to borrow its category's average, because the average is *a* number and the screen stays full.

But an average describes the category, not the product. Showing it in the product's row says "this item sells about this much", which is a claim about the item. It is the same lie with better manners.

My rule became: a category-level value may be used to **rank**, but it may not be displayed as the item's own measurement. If a number is borrowed, the interface should say it is borrowed, or say nothing at all.

## Rule 3: Keep the judgement where nobody can copy it

There was a practical reason to keep all of this on the server. If the scoring logic lives in the client, anyone can open the browser tools and read it. If it lives behind an API, the client only ever sees an answer and its reason.

That turned out to help honesty too. With one place that decides what is "enough evidence", the rule is applied the same way on every screen. There is no second copy that quietly disagrees.

## What it costs

Honesty is not free, and it is worth being clear about the trade:

- **Screens look emptier at first.** Rows that used to show a number now show a state. Some stakeholders will read that as the product being less capable. I think of it as the product being less *wrong*.
- **You have to explain the states.** A short, plain explanation on hover ("we don't have enough reliable data on this product yet") does more for trust than any decimal place.
- **The model has to be retrained and checked.** Once estimates are precomputed and stored rather than recalculated on every read, you need a routine that retrains, compares the new output to the old, and refuses to publish a regression.

None of that is exotic. It is just the maintenance cost of treating a number as something you are accountable for.

## The test I use now

Before any estimate, score or recommendation goes on a screen, I ask one question:

> If this is wrong, will the person using it be able to tell?

If the answer is no, the feature is not finished. Either the system needs a way to say it is unsure, or it should not speak.

The most useful thing I have added to that product was not a smarter calculation. It was the permission to say: *I don't know yet.*
