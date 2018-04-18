[![npm version](https://badge.fury.io/js/dts-dom.svg)](https://badge.fury.io/js/dts-dom)

`dts-dom` is a library for programatically generating TypeScript declaration files.
It is based mostly on the same [CodeDOM provided for C# and other .NET languages](https://msdn.microsoft.com/en-us/library/y2k85ax6(v=vs.110).aspx).

`dts-dom` automatically handles indentation, formatting, and proper placement of `declare` and `export` keywords.

As with other CodeDOM libraries, this is overkill for small projects, but is useful in more complex code generation scenarios.

PRs gladly accepted as this is mostly implemented on an as-needed basis for another project. 

# Usage

> `npm install --save dts-dom`

```ts
import * as dom from 'dts-dom';

const intf = dom.create.interface('MyInterface');
intf.jsDocComment = 'This is my nice interface';
intf.members.push(dom.create.method(
    'getThing',
    [dom.create.parameter('x', dom.type.number)],
    dom.type.void,
    dom.DeclarationFlags.Optional));

const ns = dom.create.namespace('SomeNamespace');
ns.members.push(intf);

console.log(dom.emit(ns));
```
This writes out the block:
```ts
declare namespace SomeNamespace {
    /**
     * This is my nice interface
     */
    interface MyInterface {
        getThing?(x: number): void;
    }
}
```

# Version History

## 3.1.1
 * **New Functionality**: Added the ability to emit intersection types

## 3.0.0
 * **Breaking change**: generic type parameters on methods were incorrectly not being emitted; see #42

## 2.1.0
 * **New Functionality**: Added the ability to emit `export default` assignments
    ```ts
    const module = create.module('my-module');
    const constDeclaration = create.const('test', 'string');
    const exportDefault = create.exportDefault('test');
    module.members.push(constDeclaration, exportDefault);
    const s = emit(module);
    ```

    Produces:
    ```ts
    declare module 'my-module' {
        const test: string;
        export default test;
    }
    ```
 * **Non-breaking Change**: Superfluous `declare` keywords are no longer emitted inside `module` declarations

## 2.0.0
 * **New Functionality**: Added the ability to emit [triple-slash directives](https://www.typescriptlang.org/docs/handbook/triple-slash-directives.html) #39
    ```ts
    const tripleSlashDirectives = [create.tripleSlashReferenceTypesDirective("react")];
    const returnType = create.namedTypeReference('JSX.Element');
    const component = create.function('Component', [], returnType, DeclarationFlags.Export);
    const s = emit(component, { tripleSlashDirectives });
    ```

    Produces:
    ```ts
    /// <reference types="react" />
    export function Component(): JSX.Element;
    ```
 * **Breaking Change**: Changed the second parameter of `emit` from `ContextFlags` to `EmitOptions` #39
    ```ts
    // 1.0
    const s = emit(tree, ContextFlags.Module);
    // 2.0
    const s = emit(tree, { rootFlags: ContextFlags.Module });
    ```

## 1.0.0

The same as 0.1.25

# Semver Policy

The major version will be bumped if:
 * The *semantics* of emitted code changes, even if the prior emit was categorically wrong
 * The API surface changes in a way that could break the runtime behavior of extant working code

The major version will *not* be bumped if:
 * New API surface is added
 * The *formatting* of emitted code changes

# Contributors

The following people have contributed features and/or bug fixes. Thank you!
 * [Sean Barag](https://www.github.com/sjbarag)
 * [wehrstedt](https://www.github.com/wehrstedt)
 * [New Future](https://www.github.com/NewFuture)
 * [Leonard Thieu](https://www.github.com/leonard-thieu)
 * [Ryan McNeely](https://www.github.com/RMcNeely)
 * [Markus Wolf](https://www.github.com/KnisterPeter)
 * [Joshua Skrzypek](https://www.github.com/jskrzypek)
 * [Chad Engler](https://www.github.com/englercj)
 * [Morlay](https://www.github.com/morlay)
 * [Jeremy Danyow](https://www.github.com/jdanyow)
 * [Hendrik Liebau](https://github.com/KingHenne)
 * [Timur Amirov](https://github.com/DeTeam)
