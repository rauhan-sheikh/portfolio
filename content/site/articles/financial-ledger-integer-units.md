---
title: Building a Financial Ledger Without Floating-Point Money
slug: financial-ledger-integer-units
excerpt: >-
  Why storing currency in floats will inevitably corrupt your accounting, and
  how we architected BusinessOS around integer minor units and BigInt.
author: Rauhan Sheikh
publishedAt: '2025-06-20T00:00:00.000Z'
readingTime: 7 min read
tags:
  - Fintech
  - PostgreSQL
  - Prisma
  - Databases
  - Accounting
isFeatured: true
isPublished: true
coverImage: /articles/ledger.png
---
## The IEEE 754 Trap

Open your browser console and type:
```js
0.1 + 0.2 === 0.3
// false: 0.30000000000000004
```

Everyone knows this as a funny trivia question. But when you are calculating tax splits across a multi-item purchase order, that tiny four at the end becomes a real discrepancy on a balance sheet.

### Minor Units Are Not An Option; They Are The Rule
In **BusinessOS**, no floating-point number is ever allowed to represent monetary amounts.
- $19.99 is stored as `1999`
- ₹1,500.50 is stored as `150050`
- Quantities are stored as exact integers or fixed-precision ratios.

### Handling Division & Remainder Distribution
What happens when you divide ₹100.00 among three parties?
```text
10000 / 3 = 3333 with 1 remainder
```
If you truncate: each party gets 3333 paise (total 9999). You lost 1 paisa.
If you round up: total becomes 10002. You invented 2 paise out of thin air.

In double-entry bookkeeping, the ledger **must balance to zero**. We implemented deterministic remainder allocation: the leftover units are distributed sequentially to the highest-weighted balancing entries. Every single unit is accounted for.
