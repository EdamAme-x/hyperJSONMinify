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

function reverseString(str) {
  return str.split('').reverse().join('');
}

export default function HyperJSONMinify(obj) {
  return reverseString(compressObject(obj))
}

export default function HyperJSONDenify(str) {
  const reversedStr = reverseString(str);

  const decodedObject = reversedStr.split(',').reduce((acc, pair) => {
    const [key, compressedValue] = pair.split(':');
    let value;

    switch (compressedValue) {
      case '%':
        value = [];
        break;
      case '*':
        value = "";
        break;
      case '+':
        value = '';
        break;
      case '$':
        value = true;
        break;
      case '&':
        value = false;
        break;
      case '@':
        value = {};
        break;
      default:
        if (compressedValue.startsWith('|') && compressedValue.endsWith('|')) {
          const innerStr = compressedValue.slice(1, -1);
          value = HyperJSONDenify(innerStr);
        } else {
          value = JSON.parse(compressedValue);
        }
        break;
    }

    acc[key] = value;
    return acc;
  }, {});

  return decodedObject;
}


// function calcRatio(original, compressed) {
//   const originalLength = original.length;
//   const compressedLength = compressed.length;
//   const ratio = (compressedLength / originalLength) * 100;
//   return ratio.toFixed(2);
// }
//
// // 例
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
