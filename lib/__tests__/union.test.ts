import {ParameterFlags, create, emit} from "../index"

describe("an emitted union type", () => {
    describe("with a function and a string", () => {
        it("matches the snapshot", () => {
            const parameters = [
                create.parameter('args', create.array('any'), ParameterFlags.Rest)
            ];
            const functionType = create.functionType(parameters, 'any');
            const union = create.union([functionType, 'string']);
            const typeAlias = create.alias('testUnion', union);

            expect(emit(typeAlias)).toMatchSnapshot();
        });
    });
});
