import * as dom from "../index";

describe("an emitted namespace", () => {
  describe("without members", () => {
    it("matches the snapshot", () => {
      let namespace = dom.create.namespace("Namespace");

      expect(dom.emit(namespace)).toMatchSnapshot();
    });
  });
  describe("with several members", () => {
    it("matches the snapshot", () => {
      let namespace = dom.create.namespace("Namespace");

      namespace.members.push(
        dom.create.interface("interfaceMember"),
        dom.create.alias("aliasMember", dom.type.string),
        dom.create.class("ClassMember"),
        dom.create.namespace("namespaceMember"),
        dom.create.const("constMember", dom.type.number),
        dom.create.variable("varMember", dom.type.boolean),
        dom.create.function("functionMember", [], dom.type.void),
        dom.create.enum("enumMember")
      );

      expect(dom.emit(namespace)).toMatchSnapshot();
    });
  });
});
