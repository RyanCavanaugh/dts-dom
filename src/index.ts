export interface DeclarationBase {
	name: string;
}

export interface Property {
	kind: "property";
	name: string;
	type: Type;
	isOptional?: boolean;
}

export interface Parameter {
	name: string;
	type: Type;
	isOptional?: boolean;
}

export interface Method {
	kind: "method";
	name: string;
	parameters: Parameter[];
	returnType: Type;
	restArgName?: string;
	restArgElementType?: Type;
	isOptional?: boolean;
}

export interface ObjectType {
	kind: "object";
	members: Array<Property | Method>;
}

export interface UnionType {
	kind: "union";
	members: Type[];
}

export interface IntersectionType {
	kind: "intersection";
	members: Type[];
}

export interface InterfaceDeclaration extends DeclarationBase {
	kind: "interface";
	members: Property[]
	baseTypes?: TypeReference[];
}

export interface TypeAlias extends DeclarationBase {
	kind: "alias";
	type: Type;
}

export interface ArrayType {
	kind: "array";
	type: Type;
}

export interface NamedTypeReference {
	kind: "name";
	name: string;
}

export type PrimitiveType = "string" | "number" | "boolean" | "any";

export type TypeReference = Declaration | NamedTypeReference;
export type AnonymousType = ObjectType | PrimitiveType;

export type Type = TypeReference | AnonymousType | UnionType | IntersectionType | ArrayType | PrimitiveType;
export type Declaration = InterfaceDeclaration | TypeAlias;

export const create = {
	interface(name: string): InterfaceDeclaration {
		return {
			name,
			baseTypes: [],
			kind: "interface",
			members: []
		}
	},

	property(name: string, type: Type, isOptional = false): Property {
		return {
			kind: "property",
			name, type, isOptional
		}
	},

	method(name: string, parameters: Parameter[], returnType: Type): Method {
		return {
			kind: "method",
			name, parameters, returnType
		}
	}
};

export const primitive = {
	string: <PrimitiveType>"string",
	number: <PrimitiveType>"number",
	boolean: <PrimitiveType>"boolean"
};

export function emit(rootDecl: Declaration): string {
	let output = "";
	let indentLevel = 0;
	writeDeclaration(rootDecl);
	return output;

	function tab() {
		for(let i = 0; i < indentLevel; i++) {
			output = output + '    ';
		}
	}

	function print(s: string) {
		output = output + s;
	}

	function newline() {
		output = output + '\r\n';
	}

	function needsParens(d: Type) {
		return typeof d !== 'string' &&
			d.kind !== 'name' &&
			d.kind !== 'array' &&
			d.kind !== 'alias' &&
			d.kind !== 'interface' &&
			d.kind !== 'object';
	}

	function printObjectTypeMembers(members: Array<Property|Method>) {
		print ('{');
		newline();
		indentLevel++;
		for(const member of members) {
			if (member.kind === 'property') {
				tab();
				print(`${member.name}`);
				if(member.isOptional) print('?');
				print(': ');
				writeReference(member.type);
				print(';');
				newline();
			} else {
				tab();
				print(`${member.name}`);
				if(member.isOptional) print('?');
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
				writeReference(member.type);
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
			switch (d.kind) {
				case "name":
					print(d.name);
					break;

				case "array":
					if (needsParens(d)) print('(');
					writeReference(d.type);
					if (needsParens(d)) print(')');
					print('[]');
					break;

				case "interface":
					print(d.name);
					break;

				case "object":
					printObjectTypeMembers(d.members);
					break;

				default:
					throw new Error(`Unknown kind ${d.kind}`);
			}

		}
	}

	function writeDeclaration(d: Declaration) {
		if (typeof d === 'string') {
			print(d);
		} else {
			switch (d.kind) {
				case "interface":
					tab();
					print(`interface ${d.name} `);
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
					break;

				default:
					throw new Error(`Unknown declaration kind ${d.kind}`);
			}

		}
	}
}
