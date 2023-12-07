function compressObject(obj) {
  const result = Object.keys(obj).map(key => {
    const value = obj[key];
    let compressedValue;

    if (Array.isArray(value) && value.length === 0) {
      compressedValue = '%';
    } else if (value === "") {
      compressedValue = '*';
    } else if (value === '') {
      compressedValue = '+';
    } else if (value === true) {
      compressedValue = '$';
    } else if (value === false) {
      compressedValue = '&';
    } else if (typeof value === 'object' && Object.keys(value).length === 0) {
      compressedValue = '@';
    } else if (typeof value === 'object' && Object.keys(value).length > 0) {
      const innerStr = compressObject(value);
      compressedValue = `|${innerStr}|`;
    } else {
      compressedValue = JSON.stringify(value);
    }

    return `${key}:${compressedValue}`;
  }).join(',');

  return result;
}

export default function HyperJSONMinify(obj) {
  return reverseString(compressObject(obj))
}

// function calcRatio(original, compressed) {
//   const originalLength = original.length;
//   const compressedLength = compressed.length;
//   const ratio = (compressedLength / originalLength) * 100;
//   return ratio.toFixed(2);
// }
//
// 例
// const obj = {
//   "a": "a",
//   "b": '',
//   "c": 0,
//   "d": {
//     "r": true
//   },
//   "k": "",
//   "arr": [],
//   "str1": "",
//   "str2": ''
// };

// const originalStr = JSON.stringify(obj);
// const compressedStr = compressObject(obj);

// console.log("Original String:", originalStr);
// console.log("Compressed String:", compressedStr);
// console.log("Compression Ratio:", calcRatio(originalStr, compressedStr) + "%");
