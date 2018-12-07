const size = 21000000
const buff = new Buffer(size)

while (buff.length < size)
  buff.write("\u00bd")

module.exports = `{a: "${buff.toString("utf8")}"}`
