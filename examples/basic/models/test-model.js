
module.exports = {
  columns: {
    name: {
      type: "string",
      required: true,
    },
  },

  toJSON(row) {
    return row
  },
}
