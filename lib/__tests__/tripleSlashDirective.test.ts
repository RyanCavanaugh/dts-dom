import {ContextFlags, TripleSlashDirective, create, emit} from "../index"

describe("an emitted module with triple slash directives", () => {
    it("matches the snapshot", () => {
        const tripleSlashDirectives: TripleSlashDirective[] = [];

        tripleSlashDirectives.push(create.tripleSlashReferencePathDirective("./test"));
        tripleSlashDirectives.push(create.tripleSlashReferenceTypesDirective("test"));
        tripleSlashDirectives.push(create.tripleSlashReferenceNoDefaultLibDirective());
        tripleSlashDirectives.push(create.tripleSlashAmdModuleDirective());
        tripleSlashDirectives.push(create.tripleSlashAmdModuleDirective("test"));

        const module = create.module("test");
        const emitOptions = {tripleSlashDirectives};

        expect(emit(module, emitOptions)).toMatchSnapshot();
    });
});

describe("an emitted module without triple slash directives", () => {
    it("matches the snapshot", () => {
        const module = create.module("test");

        expect(emit(module)).toMatchSnapshot();
    });
});
