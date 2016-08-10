import * as tsdom from './';

const intf = tsdom.create.interface('foo');
console.log(tsdom.emit(intf));

intf.members.push(tsdom.create.property("thing", tsdom.type.string, tsdom.MemberFlags.None));

console.log(tsdom.emit(intf));

intf.members.push(tsdom.create.property("self", intf, tsdom.MemberFlags.None));
console.log(tsdom.emit(intf));

intf.members.push(tsdom.create.method("someFunc", [{ name: 's', kind: 'parameter', type: 'string' }], tsdom.type.number ));
console.log(tsdom.emit(intf));
