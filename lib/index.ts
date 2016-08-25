export interface DeclarationBase {
    jsDocComment?: string;
    comment?: string;
}

export interface PropertyDeclaration extends DeclarationBase {
    kind: "property";
    name: string;
    type: Type;
    flags?: MemberFlags;
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
    flags?: MemberFlags;
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
    flags: MemberFlags;
}

export interface ClassDeclaration extends DeclarationBase {
    kind: "class";
    name: string;
    members: Array<ClassMember>;
}

export interface InterfaceDeclaration extends DeclarationBase {
    kind: "interface";
    name: string;
    members: ObjectTypeMember[];
    baseTypes?: TypeReference[];
}

export interface NamespaceDeclaration extends DeclarationBase {
    kind: "namespace";
    name: string;
    members: TopLevelDeclaration[];
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

export interface NamespaceDeclaration extends DeclarationBase {
    kind: "namespace";
    members: TopLevelDeclaration[];
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

export type PrimitiveType = "string" | "number" | "boolean" | "any" | "void";

export type TypeReference = TopLevelDeclaration | NamedTypeReference | ArrayTypeReference | PrimitiveType;

export type ObjectTypeMember = PropertyDeclaration | MethodDeclaration;
export type ClassMember = ObjectTypeMember | ConstructorDeclaration;

export type Type = TypeReference | UnionType | IntersectionType | PrimitiveType | ObjectType;
export type TopLevelDeclaration = InterfaceDeclaration | TypeAliasDeclaration | ClassDeclaration | NamespaceDeclaration | ExportEqualsDeclaration | ConstDeclaration | FunctionDeclaration | NamespaceDeclaration;

export enum MemberFlags {
    None = 0,
    Private = 1 << 0,
    Protected = 1 << 1,
    Static = 1 << 2,
    Optional = 1 << 3,
    Export = 1 << 4
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
            members: []
        };
    },

    property(name: string, type: Type, flags = MemberFlags.None): PropertyDeclaration {
        return {
            kind: "property",
            name, type, flags
        };
    },

    method(name: string, parameters: Parameter[], returnType: Type, flags = MemberFlags.None): MethodDeclaration {
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

    parameter(name: string, type: Type, flags = ParameterFlags.None): Parameter {
        return {
            kind: "parameter",
            name, type, flags
        };
    },

    constructor(parameters: Parameter[], flags = MemberFlags.None): ConstructorDeclaration {
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

    function startWithDeclare(s: string) {
        if (getContextFlags() & ContextFlags.InAmbientNamespace) {
            start(s);
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
                    if (member.flags & MemberFlags.Optional) print('?');
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
                    if (member.flags & MemberFlags.Optional) print('?');
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

                default:
                    throw new Error(`Unknown kind ${d.kind}`);
            }

        }
    }

    function writeInterface(d: InterfaceDeclaration) {
        printDeclarationComments(d);
        start(`interface ${d.name} `);
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
    }

    function writeFunction(f: FunctionDeclaration) {
        printDeclarationComments(f);
        if (!isIdentifier(f.name)) {
            start(`/* Illegal functoin name '${f.name}' can't be used here`);
            newline();
        }

        startWithDeclare(`function ${f.name}(`);

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
        startWithDeclare(`class ${c.name} {`);
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
        start(`${quoteIfNeeded(p.name)}: `);
        writeReference(p.type);
        print(';');
        newline();
    }

    function writeMethodDeclaration(m: MethodDeclaration) {
        printDeclarationComments(m);
        start(`${quoteIfNeeded(m.name)}(`);
        writeDelimited(m.parameters, ', ', writeParameter);
        print('): ');
        writeReference(m.returnType);
        print(';');
        newline();
    }

    function writeNamespace(ns: NamespaceDeclaration) {
        printDeclarationComments(ns);
        startWithDeclare(`namespace ${ns.name} {`);
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
        startWithDeclare(`const ${c.name}: `);
        writeReference(c.type);
        print(';');
        newline();
    }

    function writeAlias(a: TypeAliasDeclaration) {
        throw new Error("NYI");
    }

    function writeExportEquals(e: ExportEqualsDeclaration) {
        throw new Error("NYI");
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

                default:
                    return never(d, `Unknown declaration kind ${(d as TopLevelDeclaration).kind}`);
            }
        }
    }
}
