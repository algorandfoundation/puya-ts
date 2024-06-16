# User Feedback

This directory contains documents that offer a streamlined walkthrough of the potential options being discussed in ADRs. The goal is to expose users to various experiences without explaining too much rationale up front. This process allows us to distill the experience users want to help guide us on product decisions.

## Users

Profiles of the users that provide feedback will be included in [users.md](./users.md). The users provided feedback can choose to be anonymous or not. Anonymous feedback will be attributed to "User 1", "User 2", etc. Developer numbering will be consistent across all documents, meaning "User 1" in one document is the same person as "User 1" in another document. A user should write and/or approve of their own profile.

## Guided Walkthroughs

Each guided walkthrough will contain the following secions (if applicable)

### TypeScript Equivalent

This section will contain a TypeScript snippet that demonstrates the feature we are trying to replicate in PuyaTS. There shouldn't be much feedback relevant to this section. It exists to simply set the stage of what we are trying to accomplish.

If not applicable (ie. ABI routing) this section can be omitted.

### Reasons for Deviation

This section will contain a brief explanation of why the TypeScript snippet cannot work in PuyaTS as is. In most cases this will be due to semantic incompatability.

### Proposed Solutions

This section will have one or more proposed solutions to the problem. If there are multiple solutions, we should start with the solution that is most similar to the TypeScript equvalent. Each solution should have a code snippet and perhaps some guided questions, but not detailed rationale.

## Feedback Summaries

Each guided walkthrough will have a corresponding feedback document. The feeback document will contain sub-sections summarizing the feedback from specific users.

Users should not look at the feedback until they've provided feedback themselves.
