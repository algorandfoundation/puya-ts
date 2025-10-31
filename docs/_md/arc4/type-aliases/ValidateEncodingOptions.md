---
title: ValidateEncodingOptions
type: doc
version: 1.0.0
generated: 2025-10-31
repo: puya-ts
---
[**Algorand TypeScript**](../../README.md)

***

[Algorand TypeScript](../../modules.md) / [arc4](../README.md) / ValidateEncodingOptions

# Type Alias: ValidateEncodingOptions

> **ValidateEncodingOptions** = `"unsafe-disabled"` \| `"args"`

Defined in: [arc4/index.ts:76](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/index.ts#L76)

The possible options for validation behaviour for this method
args: ABI arguments are validated automatically to ensure they are encoded correctly.
unsafe-disabled: No automatic validation occurs. Arguments can instead be validated manually.
