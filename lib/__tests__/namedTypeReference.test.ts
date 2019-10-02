import * as dom from "../index"

describe("an emitted named reference", () => {
    describe("without type arguments", () => {
        it("matches the snapshot", () => {
            let typeReference = dom.create.namedTypeReference(
                "MyInterface"
            );
            let alias = dom.create.alias('Alias', typeReference);

            expect(dom.emit(alias)).toMatchSnapshot();
        });
    });

    describe("with single type argument", () => {
        it("matches the snapshot", () => {
            let typeReference = dom.create.namedTypeReference(
                "Promise"
            );
            typeReference.typeArguments.push(dom.type.string);
            let alias = dom.create.alias('Alias', typeReference);

            expect(dom.emit(alias)).toMatchSnapshot();
        });
    });
    
    describe("with multiple type arguments", () => {
        it("matches the snapshot", () => {
            let typeReference = dom.create.namedTypeReference(
                "Generator"
            );
            typeReference.typeArguments.push(dom.type.string);
            typeReference.typeArguments.push(dom.type.number);
            let alias = dom.create.alias('Alias', typeReference);

            expect(dom.emit(alias)).toMatchSnapshot();
        });
    });
});
