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

## 3.6.0
 * **New Functionality**: [Namespaces may now contain enums](https://github.com/RyanCavanaugh/dts-dom/pull/62)

## 3.5.0
 * **New Functionality**: [Type arguments for type references](https://github.com/RyanCavanaugh/dts-dom/pull/54)

## 3.4.0
 * **New Functionality**: [Generic function declarations](https://github.com/RyanCavanaugh/dts-dom/pull/52)

## 3.3.0
 * **New Functionality**: [Generic defaults](https://github.com/RyanCavanaugh/dts-dom/pull/49)

## 3.2.0
 * **New Functionality**: [Single-line JSDoc Comment option](https://github.com/RyanCavanaugh/dts-dom/pull/49)

## 3.1.1
 * **Bugfix**: Enum members with falsy values like `0` are now correctly printed

## 3.1.0
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
 * The *semantics* of emitted code changes, *unless* the prior emit was *clearly* a bug (e.g. members being simply skipped or printed with incorrect semantics)
 * The API surface changes in a way that could break the runtime behavior of extant working code

The major version will *not* be bumped if:
 * New API surface is added
 * The *formatting* of emitted code changes

# Contributors

The following people have contributed features and/or bug fixes. Thank you!
 * [juno suárez](https://github.com/junoatscroll)
 * [Andrew Bradley](https://github.com/cspotcode)
 * [Karin Agan](https://github.com/agankarin)
 * [Sean Barag](https://github.com/sjbarag)
 * [wehrstedt](https://github.com/wehrstedt)
 * [New Future](https://github.com/NewFuture)
 * [Leonard Thieu](https://github.com/leonard-thieu)
 * [Ryan McNeely](https://github.com/RMcNeely)
 * [Markus Wolf](https://github.com/KnisterPeter)
 * [Joshua Skrzypek](https://github.com/jskrzypek)
 * [Chad Engler](https://github.com/englercj)
 * [Morlay](https://github.com/morlay)
 * [Jeremy Danyow](https://github.com/jdanyow)
 * [Hendrik Liebau](https://github.com/KingHenne)
 * [Timur Amirov](https://github.com/DeTeam)
 * [ark120202](https://github.com/ark120202)
 * [wulunyi](https://github.com/wulunyi)
 * [Harry Park](https://github.com/harryparkdotio)
 
