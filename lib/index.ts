export interface DeclarationBase {
    jsDocComment?: string;
    comment?: string;
    flags?: DeclarationFlags;
}

export interface PropertyDeclaration extends DeclarationBase {
    kind: "property";
    name: string;
    type: Type;
}

export interface Parameter {
    kind: "parameter";
    name: string;
    type: Type;
    flags?: ParameterFlags;
}

export interface MethodDeclaration extends DeclarationBase {
    kind: "method";
    name: string;
    parameters: Parameter[];
    returnType: Type;
}

export interface FunctionDeclaration extends DeclarationBase {
    kind: "function";
    name: string;
    parameters: Parameter[];
    returnType: Type;
}

export interface ConstructorDeclaration extends DeclarationBase {
    kind: "constructor";
    parameters: Parameter[];
}

export interface ClassDeclaration extends DeclarationBase {
    kind: "class";
    name: string;
    members: ClassMember[];
    implements: InterfaceDeclaration[];
    baseType?: ObjectTypeReference;
}

export interface InterfaceDeclaration extends DeclarationBase {
    kind: "interface";
    name: string;
    members: ObjectTypeMember[];
    baseTypes?: ObjectTypeReference[];
}

export interface ImportAllDeclaration extends DeclarationBase {
    kind: "importAll";
    name: string;
    from: string;
}

export interface ImportDefaultDeclaration extends DeclarationBase {
    kind: "importDefault";
    name: string;
    from: string;
}

export interface NamespaceDeclaration extends DeclarationBase {
    kind: "namespace";
    name: string;
    members: NamespaceMember[];
}

export interface ConstDeclaration extends DeclarationBase {
    kind: "const";
    name: string;
    type: Type;
}

export interface ExportEqualsDeclaration extends DeclarationBase {
    kind: "export=";
    target: string;
}

export interface ModuleDeclaration extends DeclarationBase {
    kind: "module";
    name: string;
    members: ModuleMember[];
}

export interface ObjectType {
    kind: "object";
    members: ObjectTypeMember[];
}

export interface UnionType {
    kind: "union";
    members: Type[];
}

export interface IntersectionType {
    kind: "intersection";
    members: Type[];
}

export interface FunctionType {
    kind: "function-type";
    parameters: Parameter[];
    returnType: Type;
}

export interface TypeAliasDeclaration extends DeclarationBase {
    kind: "alias";
    name: string;
    type: Type;
}

export interface ArrayTypeReference {
    kind: "array";
    type: Type;
}

export interface NamedTypeReference {
    kind: "name";
    name: string;
}

export interface TypeofReference {
    kind: "typeof";
    type: NamedTypeReference;
}

export type PrimitiveType = "string" | "number" | "boolean" | "any" | "void";

export type TypeReference = TopLevelDeclaration | NamedTypeReference | ArrayTypeReference | PrimitiveType;

export type ObjectTypeReference = ClassDeclaration | InterfaceDeclaration;
export type ObjectTypeMember = PropertyDeclaration | MethodDeclaration;
export type ClassMember = ObjectTypeMember | ConstructorDeclaration;

export type Type = TypeReference | UnionType | IntersectionType | PrimitiveType | ObjectType | TypeofReference | FunctionType;

export type Import = ImportAllDeclaration | ImportDefaultDeclaration;

export type NamespaceMember = InterfaceDeclaration | TypeAliasDeclaration | ClassDeclaration | NamespaceDeclaration | ConstDeclaration | FunctionDeclaration;
export type ModuleMember = InterfaceDeclaration | TypeAliasDeclaration | ClassDeclaration | NamespaceDeclaration | ConstDeclaration | FunctionDeclaration | Import;
export type TopLevelDeclaration =  NamespaceMember | ExportEqualsDeclaration | ModuleDeclaration | Import;

export enum DeclarationFlags {
    None = 0,
    Private = 1 << 0,
    Protected = 1 << 1,
    Static = 1 << 2,
    Optional = 1 << 3,
    Export = 1 << 4,
    Abstract = 1 << 5,
    ExportDefault = 1 << 6,
}

export enum ParameterFlags {
    None = 0,
    Optional = 1 << 0,
    Rest = 1 << 1
}

export const create = {
    interface(name: string): InterfaceDeclaration {
        return {
            name,
            baseTypes: [],
            kind: "interface",
            members: []
        };
    },

    class(name: string): ClassDeclaration {
        return {
            kind: 'class',
            name,
            members: [],
            implements: []
        };
    },

    property(name: string, type: Type, flags = DeclarationFlags.None): PropertyDeclaration {
        return {
            kind: "property",
            name, type, flags
        };
    },

    method(name: string, parameters: Parameter[], returnType: Type, flags = DeclarationFlags.None): MethodDeclaration {
        return {
            kind: "method",
            name, parameters, returnType, flags
        };
    },

    function(name: string, parameters: Parameter[], returnType: Type): FunctionDeclaration {
        return {
            kind: "function",
            name, parameters, returnType
        };
    },

    functionType(parameters: Parameter[], returnType: Type): FunctionType {
        return {
            kind: "function-type",
            parameters, returnType
        };
    },

    parameter(name: string, type: Type, flags = ParameterFlags.None): Parameter {
        return {
            kind: "parameter",
            name, type, flags
        };
    },

    constructor(parameters: Parameter[], flags = DeclarationFlags.None): ConstructorDeclaration {
        return {
            kind: "constructor",
            parameters,
            flags
        };
    },

    const(name: string, type: Type): ConstDeclaration {
        return {
            kind: "const", name, type
        };
    },

    alias(name: string, type: Type): TypeAliasDeclaration {
        return {
            kind: "alias", name, type
        };
    },

    namespace(name: string): NamespaceDeclaration {
        return {
            kind: "namespace", name,
            members: []
        };
    },

    objectType(members: ObjectTypeMember[]): ObjectType {
        return {
            kind: "object",
            members
        };
    },

    array(type: Type): ArrayTypeReference {
        return {
            kind: "array",
            type
        };
    },

    namedTypeReference(name: string): NamedTypeReference {
        return {
            kind: 'name',
            name
        };
    },

    exportEquals(target: string): ExportEqualsDeclaration {
        return {
            kind: 'export=',
            target
        };
    },

    module(name: string): ModuleDeclaration {
        return {
            kind: 'module',
            name,
            members: []
        };
    },

    importAll(name: string, from: string): ImportAllDeclaration {
        return {
            kind: 'importAll',
            name,
            from
        };
    },

    importDefault(name: string, from: string): ImportDefaultDeclaration {
        return {
            kind: 'importDefault',
            name,
            from
        };
    },

    union(members: Type[]): UnionType {
        return {
            kind: 'union',
            members
        };
    },

    typeof(type: NamedTypeReference): TypeofReference {
        return {
            kind: 'typeof',
            type
        };
    }
};

export const type = {
    array(type: Type): ArrayTypeReference {
        return {
            kind: "array",
            type
        }
    },
    string: <PrimitiveType>"string",
    number: <PrimitiveType>"number",
    boolean: <PrimitiveType>"boolean",
    any: <PrimitiveType>"any",
    void: <PrimitiveType>"void"
};

export const reservedWords = ['abstract', 'await', 'boolean', 'break', 'byte', 'case',
	'catch', 'char', 'class', 'const', 'continue', 'debugger', 'default',
	'delete', 'do', 'double', 'else', 'enum', 'export', 'extends', 'false',
	'final', 'finally', 'float', 'for', 'function', 'goto', 'if', 'implements',
	'import', 'in', 'instanceof', 'int', 'interface', 'let', 'long', 'native',
	'new', 'null', 'package', 'private', 'protected', 'public', 'return', 'short',
	'static', 'super', 'switch', 'synchronized', 'this', 'throw', 'throws',
	'transient', 'true', 'try', 'typeof', 'var', 'void', 'volatile', 'while', 'with', 'yield'];

/** IdentifierName can be written as unquoted property names, but may be reserved words. */
export function isIdentifierName(s: string) {
    return /^[$A-Z_][0-9A-Z_$]*$/i.test(s);
}

/** Identifiers are e.g. legal variable names. They may not be reserved words */
export function isIdentifier(s: string) {
    return isIdentifierName(s) && reservedWords.indexOf(s) < 0;
}

function quoteIfNeeded(s: string) {
    if (isIdentifierName(s)) {
        return s;
    } else {
        // JSON.stringify handles escaping quotes for us. Handy!
        return JSON.stringify(s);
    }
}

export const enum ContextFlags {
    None = 0,
    Module = 1 << 0,
    InAmbientNamespace = 1 << 1
}

export function never(x: never, err: string): never {
    throw new Error(err);
}

export function emit(rootDecl: TopLevelDeclaration, rootFlags = ContextFlags.None): string {
    let output = "";
    let indentLevel = 0;
    let contextStack: ContextFlags[] = [rootFlags];

    writeDeclaration(rootDecl);
    return output;

    function getContextFlags() {
        return contextStack.reduce((a, b) => a | b, ContextFlags.None);
    }

    function tab() {
        for (let i = 0; i < indentLevel; i++) {
            output = output + '    ';
        }
    }

    function print(s: string) {
        output = output + s;
    }

    function start(s: string) {
        tab();
        print(s);
    }

    function classFlagsToString(flags: DeclarationFlags | undefined): string {
        let out = '';

        if (flags & DeclarationFlags.Abstract) {
            out += 'abstract ';
        }

        return out;
    }

    function memberFlagsToString(flags: DeclarationFlags | undefined): string {
        let out = '';

        if (flags & DeclarationFlags.Private) {
            out += 'private ';
        }
        else if (flags & DeclarationFlags.Protected) {
            out += 'protected ';
        }

        if (flags & DeclarationFlags.Static) {
            out += 'static ';
        }

        if (flags & DeclarationFlags.Abstract) {
            out += 'abstract ';
        }

        return out;
    }

    function startWithDeclareOrExport(s: string, flags: DeclarationFlags | undefined) {
        if (getContextFlags() & ContextFlags.InAmbientNamespace) {
            // Already in an all-export context
            start(s);
        } else if (flags & DeclarationFlags.Export) {
            start(`export ${s}`);
        } else if (flags & DeclarationFlags.ExportDefault) {
            start(`export default ${s}`);
        } else {
            start(`declare ${s}`);
        }
    }

    function newline() {
        output = output + '\r\n';
    }

    function needsParens(d: Type) {
        if (typeof d === 'string') {
            return false;
        }
        switch (d.kind) {
            case "array":
            case "alias":
            case "interface":
            case "class":
                return true;
            default:
                return false;
        }
    }

    function printDeclarationComments(decl: DeclarationBase) {
        if (decl.comment) {
            start(`// ${decl.comment}`);
            newline();
        }
        if (decl.jsDocComment) {
            start('/**');
            newline();
            for(const line of decl.jsDocComment.split(/\n/g)) {
                start(` * ${line}`);
                newline();
            }
            start(' */');
            newline();
        }
    }

    function printObjectTypeMembers(members: ObjectTypeMember[]) {
        print('{');
        newline();
        indentLevel++;
        for (const member of members) {
            printMember(member);
        }
        indentLevel--;
        tab();
        print('}');

        function printMember(member: ObjectTypeMember) {
            switch (member.kind) {
                case 'method':
                    printDeclarationComments(member);
                    tab();
                    print(quoteIfNeeded(member.name));
                    if (member.flags & DeclarationFlags.Optional) print('?');
                    print('(');
                    let first = true;
                    for (const param of member.parameters) {
                        if (!first) print(', ');
                        first = false;
                        print(param.name);
                        print(': ');
                        writeReference(param.type);
                    }
                    print('): ');
                    writeReference(member.returnType);
                    print(';');
                    newline();
                    return;
                case 'property':
                    printDeclarationComments(member);
                    tab();
                    print(quoteIfNeeded(member.name));
                    if (member.flags & DeclarationFlags.Optional) print('?');
                    print(': ');
                    writeReference(member.type);
                    print(';');
                    newline();
                    return;
            }
            never(member, `Unknown member kind ${(member as ObjectTypeMember).kind}`);
        }
    }

    function writeReference(d: Type) {
        if (typeof d === 'string') {
            print(d);
        } else {
            const e = d;
            switch (e.kind) {
                case "name":
                    print(e.name);
                    break;

                case "array":
                    if (needsParens(e.type)) print('(');
                    writeReference(e.type);
                    if (needsParens(e.type)) print(')');
                    print('[]');
                    break;

                case "interface":
                    print(e.name);
                    break;

                case "object":
                    printObjectTypeMembers(e.members);
                    break;

                case "function-type":
                    writeFunctionType(e);
                    break;

                case "union":
                    writeDelimited(e.members, ' | ', writeReference);
                    break;

                case "typeof":
                    print("typeof ");
                    writeReference(e.type);
                    break;

                default:
                    throw new Error(`Unknown kind ${d.kind}`);
            }

        }
    }

    function writeInterface(d: InterfaceDeclaration) {
        printDeclarationComments(d);
        startWithDeclareOrExport(`interface ${d.name} `, d.flags);
        if (d.baseTypes && d.baseTypes.length) {
            print(`extends `);
            let first = true;
            for (const baseType of d.baseTypes) {
                if (!first) print(', ');
                writeReference(baseType);
                first = false;
            }
        }
        printObjectTypeMembers(d.members);
        newline();
    }

    function writeFunctionType(f: FunctionType) {
        print('(');
        writeDelimited(f.parameters, ', ', writeParameter);
        print(')');
        print('=>');
        writeReference(f.returnType);
    }

    function writeFunction(f: FunctionDeclaration) {
        printDeclarationComments(f);
        if (!isIdentifier(f.name)) {
            start(`/* Illegal function name '${f.name}' can't be used here`);
            newline();
        }

        startWithDeclareOrExport(`function ${f.name}(`, f.flags);

        writeDelimited(f.parameters, ', ', writeParameter);
        print('): ');
        writeReference(f.returnType);
        print(';');
        newline();

        if (!isIdentifier(f.name)) {
            start(`*/`);
            newline();
        }
    }

    function writeParameter(p: Parameter) {
        print(`${p.flags & ParameterFlags.Rest ? '...' : ''}${p.name}${p.flags & ParameterFlags.Optional ? '?' : ''}: `);
        writeReference(p.type);
    }

    function writeDelimited<T>(arr: T[], sep: string, printer: (x: T) => void) {
        let first = true;
        for (const el of arr) {
            if (!first) {
                print(sep);
            }
            printer(el);
            first = false;
        }
    }

    function writeClass(c: ClassDeclaration) {
        printDeclarationComments(c);
        startWithDeclareOrExport(`${classFlagsToString(c.flags)}class ${c.name} `, c.flags);
        if (c.baseType) {
            print('extends ');
            writeReference(c.baseType);
        }
        if (c.implements && c.implements.length) {
            print(`implements `);
            let first = true;
            for (const impl of c.implements) {
                if (!first) print(', ');
                writeReference(impl);
                first = false;
            }
        }
        print('{');
        newline();
        indentLevel++;
        for (const m of c.members) {
            writeClassMember(m);
        }
        indentLevel--;
        start('}');
        newline();
    }

    function writeClassMember(c: ClassMember) {
        switch (c.kind) {
            case "property":
                return writePropertyDeclaration(c);
            case "method":
                return writeMethodDeclaration(c);
            case "constructor":
                return writeConstructorDeclaration(c);
        }
    }

    function writeConstructorDeclaration(ctor: ConstructorDeclaration) {
        printDeclarationComments(ctor);
        start('constructor(');
        writeDelimited(ctor.parameters, ', ', writeParameter);
        print(');')
        newline();
    }

    function writePropertyDeclaration(p: PropertyDeclaration) {
        printDeclarationComments(p);
        start(`${memberFlagsToString(p.flags)}${quoteIfNeeded(p.name)}: `);
        writeReference(p.type);
        print(';');
        newline();
    }

    function writeMethodDeclaration(m: MethodDeclaration) {
        printDeclarationComments(m);
        start(`${memberFlagsToString(m.flags)}${quoteIfNeeded(m.name)}(`);
        writeDelimited(m.parameters, ', ', writeParameter);
        print('): ');
        writeReference(m.returnType);
        print(';');
        newline();
    }

    function writeNamespace(ns: NamespaceDeclaration) {
        printDeclarationComments(ns);
        startWithDeclareOrExport(`namespace ${ns.name} {`, ns.flags);
        contextStack.push(ContextFlags.InAmbientNamespace);
        newline();
        indentLevel++;
        for (const member of ns.members) {
            writeDeclaration(member);
        }
        indentLevel--;
        start(`}`);
        contextStack.pop();
        newline();
    }

    function writeConst(c: ConstDeclaration) {
        printDeclarationComments(c);
        startWithDeclareOrExport(`const ${c.name}: `, c.flags);
        writeReference(c.type);
        print(';');
        newline();
    }

    function writeAlias(a: TypeAliasDeclaration) {
        printDeclarationComments(a);
        startWithDeclareOrExport(`type ${a.name} = `, a.flags);
        writeReference(a.type);
        print(';');
        newline();
    }

    function writeExportEquals(e: ExportEqualsDeclaration) {
        start(`export = ${e.target};`);
        newline();
    }

    function writeModule(m: ModuleDeclaration) {
        printDeclarationComments(m);
        startWithDeclareOrExport(`module '${m.name}' {`, m.flags);
        contextStack.push(ContextFlags.Module);
        newline();
        indentLevel++;
        for (const member of m.members) {
            writeDeclaration(member);
        }
        indentLevel--;
        start(`}`);
        contextStack.pop();
        newline();
    }

    function writeImportAll(i: ImportAllDeclaration) {
        start(`import * as ${i.name} from '${i.from}';`);
        newline();
    }

    function writeImportDefault(i: ImportDefaultDeclaration) {
        start(`import ${i.name} from '${i.from}';`);
        newline();
    }

    function writeDeclaration(d: TopLevelDeclaration) {
        if (typeof d === 'string') {
            return print(d);
        } else {
            switch (d.kind) {
                case "interface":
                    return writeInterface(d);
                case "function":
                    return writeFunction(d);
                case "class":
                    return writeClass(d);
                case "namespace":
                    return writeNamespace(d);
                case "const":
                    return writeConst(d);
                case "alias":
                    return writeAlias(d);
                case "export=":
                    return writeExportEquals(d);
                case "module":
                    return writeModule(d);
                case "importAll":
                    return writeImportAll(d);
                case "importDefault":
                    return writeImportDefault(d);

                default:
                    return never(d, `Unknown declaration kind ${(d as TopLevelDeclaration).kind}`);
            }
        }
    }
}
