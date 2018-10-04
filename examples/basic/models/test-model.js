
module.exports = {
  attributes: {
    name: {
      type: "string",
      required: true,
    },
  },

  toJSON(row) {
    return row
  },
}