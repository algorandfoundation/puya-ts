# Walkthrough: Method Routing

This walkthrough will cover how method routing is handled in Algorand TypeScript.

# Problems

The AVM supports multiple "OnComplete" actions when calling a contract. There is also ARC4, which defines an ABI for the AVM which standardizes how to define handle method calling in a contract. Finally, it is common for a contract to behave differently depending on if the contract is being created (app ID === 0) or if a deployed contract is being called. All of these variables can make it difficult for a developer to succinctly describe the exact scenarios in which any given method should be callable.

## Proposed Solutions

In both solutions, by default, every public method will be a callable ARC4 ABI method when app ID > 0 (app is already deployed) and the OnCompelte is "NoOp". The options diverge when it comes to how we define the logic when app ID === 0 and/or the OnComplete is not "NoOp".

### Decorators

This option proposes to use decorators to define the logic for different scenarios. This would allow the developer to describe the exact scenarios in which any given method should be callable.

| Decorator                          | Action                                                                                  |
| ---------------------------------- | --------------------------------------------------------------------------------------- |
| `@allow.create("NoOp")`            | Allow the method to be called when app ID === 0 and the OnComplete is "NoOp"            |
| `@allow.call("UpdateApplication")` | Allow the method to be called when app ID > 0 and the OnComplete is "UpdateApplication" |
| `@allow.call("DeleteApplication")` | Allow the method to be called when app ID > 0 and the OnComplete is "DeleteApplication" |

### Special Method Names

Defining the logic for different scenarios, such as create, update, or delete will be done by implementing a method with a special name. For example, `createApplication`, `updateApplicaiton`, or `deleteApplication`.

| Method Name         | Action                                                                                  |
| ------------------- | --------------------------------------------------------------------------------------- |
| `createApplication` | Allow the method to be called when app ID === 0 and the OnComplete is "NoOp"            |
| `updateApplication` | Allow the method to be called when app ID > 0 and the OnComplete is "UpdateApplication" |
| `deleteApplication` | Allow the method to be called when app ID > 0 and the OnComplete is "DeleteApplication" |

It should be noted that decorators could also be used for more complex scenarios, for example a create method that has a "DeleteApplication" OnComplete.

# Feature Comparison

| Feature                    | Benefit                                                         | Decorators | Special Method Names |
| -------------------------- | --------------------------------------------------------------- | ---------- | -------------------- |
| Required use of decorators | Enforced explicitness of handled actions for every method       | ✅         | ❌                   |
| Conventional method names  | Contracts will use conventional method names for common actions | ❌         | ✅                   |

# Code Comparison

<table>
<tr>
<th>Decorators</th>
<th>Special Method Names</th>
</tr>

<tr>
<td>

```ts
@allow.create("NoOp")
myCreateMethod(): void {
    log("Application created");
}

@allow.call("UpdateApplication")
myUpdateMethod(): void {
    assert(this.txn.sender === this.app.creator)
    log("Application updated");
}

@allow.call("DeleteApplication")
myDeleteMethod(): void {
    assert(this.txn.sender === this.app.creator)
    log("Application deleted");
}
```

</td>
<td>

```ts
createApplication(): void {
    log("Application created");
}

updateApplication(): void {
    assert(this.txn.sender === this.app.creator)
    log("Application updated");
}

deleteApplication(): void {
    assert(this.txn.sender === this.app.creator)
    log("Application deleted");
}
```

</td>

</tr>
</table>
