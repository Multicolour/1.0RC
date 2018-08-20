// @flow

const validLanguages = new Set([
  "en"
])

module.exports = (language: "en", messageId: string) => {
  if (!validLanguages.has(validLanguages))
    throw new Error("Invalid language specified while getting message.")

  return require(`../translations/${language}.json`)[messageId]
}
