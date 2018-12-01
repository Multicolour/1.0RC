let payload = "{a: '"

for (let i = 0, max = 1e4; i <= max; i++)
  payload += ("a").repeat(1e5)

module.exports = payload + "'}"
