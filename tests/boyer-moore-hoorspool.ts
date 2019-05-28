import BoyerMooreHorspool from "@lib/content-negotiators/multipart/boyer-moore"
// import { readFileSync } from "fs"

[
  /*{
    text: "a".repeat(10) + "b",
    pattern: "aab",
    expected: [8],
  },
  {
    text: Buffer.concat([
      Buffer.from("\r\nContent-Disposition: form-data; name=\"json\"\r\n\r\n"),
      readFileSync("./tests/content/mc-logo.png"),
      Buffer.from("\r\nContent-Disposition: form-data; name=\"textField\"\r\n\r\nText field with some value"),
    ]),
    pattern: "\r\n\r\n",
    expected: [45],
  },
  {
    text: "aab" + "1".repeat(10),
    pattern: "aab",
    expected: [0],
  },
  {
    text: "aab".repeat(3),
    pattern: "aab",
    expected: [0, 3, 6],
  },
  {
    text: "toothbrushestoothbrushes",
    pattern: "tooth",
    expected: [0, 12],
  },
  {
    text: "trusthardtoothbrushes",
    pattern: "tooth",
    expected: [9],
  },
  {
    text: "👍👎🖐❤🌷🍀🌱🐕",
    pattern: "👍",
    expected: [0],
  },
  {
    text: "aaaaaaaa\r\n\r\niiii",
    pattern: "\r\n\r\n",
    expected: [8],
  },*/
  {
    // tslint:disable-next-line:max-line-length
    text: "TGRW<S1BW8CT@>IYF@FMLL;O2?BJX?CUUYKY@N?EE<PETH:?55XXM>OOLYSXBFC<3FJPRFW7OPAE<KY79OME;TQWNWJ8R7TCAKP<LEQ79;?@EK5AIX9?TF>W<2K9?K6?OE?FE7:2DKI8X1ERRTA@DP7YL60>S;U53JBT@VV?96FSW79C9R>SI:21>C;X2VKT6L5DESDXSJ8=9RY?<2RL:VP0O<YRUCT5T>PVV@R5MHUOEH0262U8>FP:H;O918O<RVRLWE:?P:J:JOPOUI6B;P9YQ@3JMD1H9J3D8C?82VQ?7QSCB1:QQNSB2=>GC;RXDI=;D95KI:CB@8T1S=U<S35G1F1ATJNLPX:8MVDY<2972;H>MSAX@>D5XSDK=FDO86FC@50WLON1JU<4OT?P0SQ5FACB>A2K8SK@U9A8LIV:F=NX?40Q5FB>FQ<8:T7>P60RA9C1OXO1Y8774Q0S8@0JDLAGP=X@IL0PRIPRUKPGS7>:DKU",
    pattern: "9R>SI:21>C;X2VKT6L5DESDXSJ8=9RY?<2RL:VP0O<YRUC",
    expected: [176],
  },
].forEach((payload) => {
  test("ensuring Boyer Moore Hoorspool algorithm works with static payload: " + payload.pattern, () => {
    const instance = new BoyerMooreHorspool(payload.pattern)
    const indices = instance.search(Buffer.from(payload.text),/* instanceof Buffer
      ? payload.text
      : Buffer.from(payload.text),
    */)

    expect(indices).toEqual(payload.expected)
  })
})

/*function getRandomString(): string {
  let out = ""
  for (let i = 1, max = 500; i < max; i++) {
    out += String.fromCharCode(48 + ~~(Math.random() * 42))
  }
  return out
}

for (let testIndex = 0, maxTests = 25; testIndex <= maxTests; testIndex++) {
  const testText = getRandomString()
  const expected = Math.floor(Math.random() * testText.length)

  // Skip over tiny payloads.
  if (testText.length < 5) {
    continue
  }

  const pattern = testText.substr(expected, Math.floor(Math.random() * 51))

  if (pattern.length < 5) {
    continue
  }

  test("ensuring Boyer Moore Hoorspool algorithm works with random payload: " + pattern, () => {
    const instance = new BoyerMooreHorspool(pattern)
    expect(instance.search(Buffer.from(testText))).toEqual([expected])
  })
}*/

