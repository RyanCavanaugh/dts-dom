import {ContextFlags, create, emit} from "../index"

describe("an export default assignment", () => {
    it("matches the snapshot", () => {
        const exportDefault = create.exportDefault('test');
        expect(emit(exportDefault)).toMatchSnapshot();
    });

    describe("as module member", () => {
        it("matches the snapshot", () => {
            const module = create.module('my-module');
            const constDeclaration = create.const('test', 'string');
            const exportDefault = create.exportDefault('test');
            module.members.push(constDeclaration, exportDefault);
            expect(emit(module)).toMatchSnapshot();
        });
    });
});
