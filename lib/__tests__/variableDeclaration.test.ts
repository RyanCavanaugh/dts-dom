import * as dom from "../index"

describe("an emitted variable definition", () => {
    it("matches the snapshot", () => {
        let variable = dom.create.variable(
            "myVar",
            dom.create.union([
                dom.type.string,
                dom.type.boolean
            ])
        );

        expect(dom.emit(variable)).toMatchSnapshot();
    });

    describe("in a module", () => {
        it("matches the snapshot", () => {
            let myModule = dom.create.module("myTestModule");
            let variable = dom.create.variable(
                "myVar",
                dom.create.union([
                    dom.type.string,
                    dom.type.boolean
                ])
            );
            myModule.members.push(variable);

            expect(dom.emit(myModule)).toMatchSnapshot();
        });
    });

    describe("in a namespace", () => {
        it("matches the snapshot", () => {
            let myNamespace = dom.create.namespace("myTestNamespace");
            let variable = dom.create.variable(
                "myVar",
                dom.create.union([
                    dom.type.string,
                    dom.type.boolean
                ])
            );
            myNamespace.members.push(variable);

            expect(dom.emit(myNamespace)).toMatchSnapshot();
        });
    });
});
