# User Feedback

## Goals

The Algorand Foundation is working on developing tooling to make it easier for developers to build on Algorand. One of the key components of this tooling is smart contract languages. The Algorand Foundation has previously released Algorand Python, which enables developers to write smart contracts in Python. The compiler for Algorand Python is called Puya and can be leveraged by any other language. The next language being developed for Puya is Algorand TypeScript. The goal is Algorand TypeScript is to make it easy for TypeScript develoeprs to start building on Algorand. The full list of guiding principles can be found [here](../README.md#guiding-principals).

This directory contains documents that offer a streamlined walkthrough of the potential options being explored. The goal is to expose users to various experiences without explaining too much rationale up front. This process allows us to distill the experience users want to help guide us on product decisions.

## Users

Profiles of the users that provide feedback will be included in [users.md](./users.md). The users provided feedback can choose to be anonymous or not. Anonymous feedback will be attributed to "User 1", "User 2", etc. Developer numbering will be consistent across all documents, meaning "User 1" in one document is the same person as "User 1" in another document. A user should write and/or approve of their own profile.

## Guided Walkthroughs

Each guided walkthrough will contain the following secions (if applicable)

### Native TypeScript Baseline

This section will contain a TypeScript snippet that demonstrates the feature we are trying to replicate in PuyaTS. There shouldn't be much feedback relevant to this section. It exists to simply set the stage of what we are trying to accomplish.

If not applicable (ie. ABI routing) this section can be omitted.

### Problems

This section will contain a brief explanation of why the TypeScript snippet cannot work in PuyaTS as is. In most cases this will be due to semantic incompatability.

### Proposed Solutions

This section will have one or more proposed solutions to the problem. If there are multiple solutions, we should start with the solution that is most similar to the TypeScript equvalent. Each solution should have a code snippet and perhaps some guided questions, but not detailed rationale. The solutions will come from the [Architecture Decision Records (ADRs)](./../architecture-decisions/) that have been created to explore the full range of solutions in depth. The walkthroughs are meant to be a high-level overview of the solutions.

### Feature Comparison

This section will contain a table comparing the features of each proposed solution. This table should be concise and easy to read. The goal is to help users quickly understand the trade-offs between each solution.

### Code Comparison

This section will contain side-by-side snippets of the proposed solutions. If applicable, there will also be a side-by-side comparison of the TypeScript equivalent and how it would be treated with the proposed solutions.

## Feedback Summaries

Each guided walkthrough will have a corresponding feedback document. The feeback document will contain sub-sections summarizing the feedback from specific users.

Users should not look at the feedback until they've provided feedback themselves.

## Process

The Algorand Foundation team will be reaching out to users for guided sessions where we will be responsible for taking the users through the walkthrough and summarizing their feedback. Feedback summaries MUST be approved by the user. Users can also provide feedback on their own time by following the walkthroughs and making a PR to the relevant feedback document.
