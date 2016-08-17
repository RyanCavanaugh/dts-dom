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
    dom.MemberFlags.Optional));

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
}```