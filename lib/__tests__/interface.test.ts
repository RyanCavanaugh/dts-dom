import * as dom from "../index";

describe("an emitted interface", () => {
  describe("empty", () => {
    it("matches the snapshot", () => {
      let iface = dom.create.interface("Interface");

      expect(dom.emit(iface)).toMatchSnapshot();
    });
  });
  describe("with type parameters", () => {
    it("matches the snapshot", () => {
      let clazz = dom.create.class("BaseFoo");
      let iface = dom.create.interface("Interface");
      iface.typeParameters.push(dom.create.typeParameter("T1"));
      iface.typeParameters.push(
        dom.create.typeParameter("T2", dom.type.object)
      );
      iface.typeParameters.push(dom.create.typeParameter("T3", clazz));

      expect(dom.emit(iface)).toMatchSnapshot();
    });
  });
});
