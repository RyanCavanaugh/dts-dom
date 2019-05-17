import {create, emit, type} from "../index"

describe("an emitted type alias", () => {
    describe("with a single type parameter", () => {
        it("matches the snapshot", () => {
            const typeParameter = create.typeParameter('T');
            const typeParameterReference = create.namedTypeReference(typeParameter.name)
            const typeAlias = create.alias('test', typeParameterReference);
            typeAlias.typeParameters.push(typeParameter);

            expect(emit(typeAlias)).toMatchSnapshot();
        });

        describe("with a default type", () => {
            it("matches the snapshot", () => {
                const defaultType = type.number;
                const typeParameter = create.typeParameter('T');
                typeParameter.defaultType = defaultType;
                const typeParameterReference = create.namedTypeReference(typeParameter.name)
                const typeAlias = create.alias('test', typeParameterReference);
                typeAlias.typeParameters.push(typeParameter);

                expect(emit(typeAlias)).toMatchSnapshot();
            });
        });

        describe("with a base type", () => {
            it("matches the snapshot", () => {
                const baseType = create.interface('interfc');
                const typeParameter = create.typeParameter('T', baseType);
                const typeParameterReference = create.namedTypeReference(typeParameter.name)
                const typeAlias = create.alias('test', typeParameterReference);
                typeAlias.typeParameters.push(typeParameter);
    
                expect(emit(typeAlias)).toMatchSnapshot();
            });
        });

        describe("with a base type and a default type", () => {
            it("matches the snapshot", () => {
                const baseType = create.interface('interfc');
                const typeParameter = create.typeParameter('T', baseType);
                typeParameter.defaultType = type.any;
                const typeParameterReference = create.namedTypeReference(typeParameter.name)
                const typeAlias = create.alias('test', typeParameterReference);
                typeAlias.typeParameters.push(typeParameter);
    
                expect(emit(typeAlias)).toMatchSnapshot();
            });
        });
    });

    describe("with multiple type parameters", () => {
        it("matches the snapshot", () => {
            const typeParameters = [
                create.typeParameter('T'),
                create.typeParameter('K'),
            ];
            const typeParameterReferences = typeParameters.map(typeParameter => create.namedTypeReference(typeParameter.name));
            const typeAlias = create.alias('test', create.union(typeParameterReferences));
            typeAlias.typeParameters.push(...typeParameters);

            expect(emit(typeAlias)).toMatchSnapshot();
        });

        describe("with a default type", () => {
            it("matches the snapshot", () => {
                const typeParameters = [
                    create.typeParameter('T'),
                    create.typeParameter('K'),
                ];
                typeParameters.forEach(typeParameter => {
                    typeParameter.defaultType = type.object;
                });

                const typeParameterReferences = typeParameters.map(typeParameter => create.namedTypeReference(typeParameter.name));
                const typeAlias = create.alias('test', create.union(typeParameterReferences));
                typeAlias.typeParameters.push(...typeParameters);

                expect(emit(typeAlias)).toMatchSnapshot();
            });
        });

        describe("with a base type", () => {
            it("matches the snapshot", () => {
                const baseType = create.interface('interfc');
                const typeParameters = [
                    create.typeParameter('T', baseType),
                    create.typeParameter('K', baseType),
                ];

                const typeParameterReferences = typeParameters.map(typeParameter => create.namedTypeReference(typeParameter.name));
                const typeAlias = create.alias('test', create.union(typeParameterReferences));
                typeAlias.typeParameters.push(...typeParameters);

                expect(emit(typeAlias)).toMatchSnapshot();
            });
        });

        describe("with a base type and a default type", () => {
            it("matches the snapshot", () => {
                const baseType = create.interface('interfc');
                const typeParameters = [
                    create.typeParameter('T', baseType),
                    create.typeParameter('K', baseType),
                ];
                typeParameters.forEach(typeParameter => {
                    typeParameter.defaultType = type.boolean;
                });

                const typeParameterReferences = typeParameters.map(typeParameter => create.namedTypeReference(typeParameter.name));
                const typeAlias = create.alias('test', create.union(typeParameterReferences));
                typeAlias.typeParameters.push(...typeParameters);

                expect(emit(typeAlias)).toMatchSnapshot();
            });
        });
    });
});
