// @flow

module.exports = {
  schema: {
    id: [
      "primary",
      "increments"
    ],
    name: [
      "string",
      "unique"
    ],
    notableWork: [
      ["references", "works.id"],
      ["inTable", "works"]
    ]
  }
}
