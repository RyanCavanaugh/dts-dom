import * as tsdom from './';

const intf = tsdom.create.interface('foo');
console.log(tsdom.emit(intf));

intf.members.push(tsdom.create.property("thing", tsdom.primitive.string));

console.log(tsdom.emit(intf));

intf.members.push(tsdom.create.property("self", intf));
console.log(tsdom.emit(intf));

intf.members.push(tsdom.create.method("someFunc", { 'name', 'string' } ));
console.log(tsdom.emit(intf));
