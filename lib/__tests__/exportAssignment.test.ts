import {ContextFlags, create, emit} from "../index"

describe("an export assignment", () => {
    describe("with isExportEquals set to true", () => {
        it("matches the snapshot", () => {
            const exportAssignment = create.exportAssignment('test', true);
            expect(emit(exportAssignment)).toMatchSnapshot();
        });
    });

    describe("with isExportEquals set to false", () => {
        it("matches the snapshot", () => {
            const exportAssignment = create.exportAssignment('test', false);
            expect(emit(exportAssignment)).toMatchSnapshot();
        });
    });

    describe("with isExportEquals omitted", () => {
        it("matches the snapshot", () => {
            const exportAssignment = create.exportAssignment('test');
            expect(emit(exportAssignment)).toMatchSnapshot();
        });
    });

    describe("as module member", () => {
        it("matches the snapshot", () => {
            const module = create.module('my-module');
            const constDeclaration = create.const('test', 'string');
            const exportAssignment = create.exportAssignment('test');
            module.members.push(constDeclaration, exportAssignment);
            expect(emit(module)).toMatchSnapshot();
        });
    });
});
