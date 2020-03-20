import {ParameterFlags, create, emit, type} from "../index"

describe("an interface type", () => {
    describe("with call signature", () => {
        it("matches the snapshot", () => {
            const parameters = [
                create.parameter('first', type.string, ParameterFlags.Optional),
                create.parameter('second', create.array('any'), ParameterFlags.Rest)
            ];
            const cs = create.callSignature(parameters, type.string);
            const iface = create.interface('iface');
          
            iface.members.push(cs);
          
            expect(emit(iface)).toMatchSnapshot();
        });
    });
});
