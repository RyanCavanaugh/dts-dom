import {ParameterFlags, create, emit} from "../index"

describe("an emitted function type", () => {
    it("matches the snapshot", () => {
        const parameters = [
            create.parameter('args', create.array('any'), ParameterFlags.Rest)
        ];
        const functionType = create.functionType(parameters, 'any');
        const typeAlias = create.alias('testFunction', functionType);

        expect(emit(typeAlias)).toMatchSnapshot();
    });
});
