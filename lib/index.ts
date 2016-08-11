export interface PropertyDeclaration {
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

export interface MethodDeclaration {
	kind: "method";
	name: string;
	parameters: Parameter[];
	returnType: Type;
	flags?: MemberFlags;
}

export interface FunctionDeclaration {
	kind: "function";
	name: string;
	parameters: Parameter[];
	returnType: Type;
}

export interface ConstructorDeclaration {
	kind: "constructor";
	parameters: Parameter[];
	flags: MemberFlags;
}

export interface ClassDeclaration {
	kind: "class";
	name: string;
	members: Array<ClassMember>;
}

export interface InterfaceDeclaration {
	kind: "interface";
	name: string;
	members: ObjectTypeMember[];
	baseTypes?: TypeReference[];
}

export interface NamespaceDeclaration {
	kind: "namespace";
	name: string;
	members: TopLevelDeclaration[];
}

export interface ConstDeclaration {
	kind: "const";
	name: string;
	type: Type;
}

export interface ExportEqualsDeclaration {
	kind: "export=";
	target: string;
}

export interface NamespaceDeclaration {
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

export interface TypeAliasDeclaration {
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

export type TypeReference = TopLevelDeclaration | NamedTypeReference | ArrayTypeReference;
export type AnonymousType = ObjectType | PrimitiveType;

export type ObjectTypeMember = PropertyDeclaration | MethodDeclaration;
export type ClassMember = ObjectTypeMember | ConstructorDeclaration;

export type Type = TypeReference | AnonymousType | UnionType | IntersectionType | PrimitiveType;
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

const reservedWords = 'instanceof typeof break do new var case else return void catch finally continue for switch while this with debugger function throw default if try delete in'.split(/ /g);
function canEmitAsIdentifier(s: string) {
	return /^[$A-Z_][0-9A-Z_$]*$/i.test(s) && reservedWords.indexOf(s) < 0;
}

export const enum ContextFlags {
	None = 0,
	Module = 1 << 0,
	InAmbientNamespace = 1 << 1
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
		for(let i = 0; i < indentLevel; i++) {
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

	function printObjectTypeMembers(members: Array<PropertyDeclaration|MethodDeclaration>) {
		print ('{');
		newline();
		indentLevel++;
		for(const member of members) {
			if (member.kind === 'property') {
				tab();
				print(`${member.name}`);
				if(member.flags & MemberFlags.Optional) print('?');
				print(': ');
				writeReference(member.type);
				print(';');
				newline();
			} else if (member.kind === "method") {
				tab();
				print(`${member.name}`);
				if(member.flags & MemberFlags.Optional) print('?');
				print('(');
				let first = true;
				for(const param of member.parameters) {
					if(!first) print(', ');
					first = false;
					print(param.name);
					print(': ');
					writeReference(param.type);
				}
				print('): ');
				writeReference(member.returnType);
				print(';');
				newline();
			}
		}
		indentLevel--;
		tab();
		print('}');
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
		start(`interface ${d.name} `);
		if (d.baseTypes && d.baseTypes.length) {
			print(`extends `);
			let first = true;
			for(const baseType of d.baseTypes) {
				if (!first) print(', ');
				writeReference(baseType);
				first = false;
			}
		}
		printObjectTypeMembers(d.members);
	}

	function writeFunction(f: FunctionDeclaration) {
		if (!canEmitAsIdentifier(f.name)) {
			start(`/* Unspeakable name '${f.name}'`);
			newline();
		}

		startWithDeclare(`function ${f.name}(`);

		writeDelimited(f.parameters, ', ', writeParameter);
		print('): ');
		writeReference(f.returnType);
		print(';');
		newline();

		if (!canEmitAsIdentifier(f.name)) {
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
		for(const el of arr) {
			if (!first) {
				print(sep);
			}
			printer(el);
			first = false;
		}
	}

	function writeClass(c: ClassDeclaration) {
		startWithDeclare(`class ${c.name} {`);
		newline();
		indentLevel++;
		for(const m of c.members) {
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
		start('constructor(');
		writeDelimited(ctor.parameters, ', ', writeParameter);
		print(');')
		newline();
	}

	function writePropertyDeclaration(p: PropertyDeclaration) {
		start(`${p.name}: `);
		writeReference(p.type);
		print(';');
		newline();
	}

	function writeMethodDeclaration(m: MethodDeclaration) {
		start(`${m.name}(`);
		writeDelimited(m.parameters, ', ', writeParameter);
		print('): ');
		writeReference(m.returnType);
		print(';');
		newline();
	}

	function writeNamespace(ns: NamespaceDeclaration) {
		startWithDeclare(`namespace ${ns.name} {`);
		contextStack.push(ContextFlags.InAmbientNamespace);
		newline();
		indentLevel++;
		for(const member of ns.members) {
			writeDeclaration(member);
		}
		indentLevel--;
		start(`}`);
		contextStack.pop();
		newline();
	}

	function writeConst(c: ConstDeclaration) {
		startWithDeclare(`const ${c.name}: `);
		writeReference(c.type);
		print(';');
		newline();
	}

	function writeDeclaration(d: TopLevelDeclaration) {
		if (typeof d === 'string') {
			print(d);
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

				default:
					throw new Error(`Unknown declaration kind ${d.kind}`);
			}

		}
	}
}
