import {create, DeclarationFlags, emit, type} from "../index"

describe("a file declaration", () => {
    it("matches the snapshot", () => {
        const file = create.file('MyFile.d.ts')

        expect(emit(file)).toMatchSnapshot();
    });

    it("with imports and members", () => {
      const importName = 'MyNamedImport'
      const file = create.file()

      file.imports.push(create.importNamed(importName, '', importName))
      file.members.push(create.const('MY_CONST', create.interface(importName), DeclarationFlags.Export))
      file.members.push(create.const('YOUR_CONST', type.stringLiteral('Literally'), DeclarationFlags.Export))

      expect(emit(file)).toMatchSnapshot();
  });
});
