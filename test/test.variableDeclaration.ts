import * as dom from "../lib/index"
// import { expect } from "chai";

describe("variable definition", () => {

	it("checks the emitted output for a variable definition", () => {
		let variable = dom.create.variable(
			"myVar",
			dom.create.union([
				dom.type.string,
				dom.type.boolean
			])
		);

		dom.emit(variable);
		// expect(output).to.eql("declare var myVar: string | boolean;\r\n\r\n");
	});

	it("checks the emitted output for a variable definition in a module", () => {
		let myModule = dom.create.module("myTestModule");
		let variable = dom.create.variable(
			"myVar",
			dom.create.union([
				dom.type.string,
				dom.type.boolean
			])
		);
		myModule.members.push(variable);

		dom.emit(myModule);
		// expect(output).to.eql("declare module 'myTestModule' {\r\n    declare var myVar: string | boolean;\r\n\r\n}\r\n\r\n");
	});

	it("checks the emitted output for a variable definition in a namespace", () => {
		let myNamespace = dom.create.namespace("myTestNamespace");
		let variable = dom.create.variable(
			"myVar",
			dom.create.union([
				dom.type.string,
				dom.type.boolean
			])
		);
		myNamespace.members.push(variable);

		dom.emit(myNamespace);
		// expect(output).to.eql("declare namespace myTestNamespace {\r\n    var myVar: string | boolean;\r\n\r\n}\r\n\r\n");
	});

});
