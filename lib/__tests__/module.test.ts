import {ContextFlags, create, emit} from "../index"

describe("a module", () => {
    it("matches the snapshot", () => {
        const module = create.module('my-module')
        expect(emit(module)).toMatchSnapshot();
    });

    describe("with superfluous module rootFlag", () => {
        it("matches the snapshot", () => {
            const module = create.module('my-module')
            expect(emit(module, {rootFlags: ContextFlags.Module})).toMatchSnapshot();
        });
    });
});
