module.exports = {
  schema: {
    id: [
      "primary",
      "increments"
    ],
    name: [
      "string",
      "notNullable"
    ],
    year: [
      "integer",
      "notNullable"
    ]
  }
}
