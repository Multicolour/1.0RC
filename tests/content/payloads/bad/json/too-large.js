const size = 21e6
const buff = new Buffer(size)

while (buff.length < size)
  buff.write("\u00bd")

module.exports = `{a: "${buff.toString("utf8")}"}`
