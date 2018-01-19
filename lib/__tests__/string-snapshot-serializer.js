module.exports = {
    print(val, serialize, indent) {
        return val;
    },

    test(val) {
        return typeof val === "string";
    },
};
