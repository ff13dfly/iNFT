const self = {
  stamp: () => {
    return new Date().getTime();
  },
  rand: (m, n) => {
    return Math.round(Math.random() * (m - n) + n);
  },
  char: (n, pre) => {
    n = n || 7;
    pre = pre || "";
    for (let i = 0; i < n; i++)
      pre +=
        i % 2
          ? String.fromCharCode(self.rand(65, 90))
          : String.fromCharCode(self.rand(97, 122));
    return pre;
  },
  shorten: (addr, n) => {
    if (n === undefined) n = 10;
    return addr.substr(0, n) + "..." + addr.substr(addr.length - n, n);
  },
  copy: (arr_obj) => {
    return JSON.parse(JSON.stringify(arr_obj));
  },
  clean: (arr) => {
    return Array.from(new Set(arr));
  },
  tail: (str, n) => {
    return str.substr(0, n) + "...";
  },
  empty: (obj) => {
    if (JSON.stringify(obj) === "{}") return true;
    return false;
  },
  toDate: (stamp) => {
    return new Date(stamp).toLocaleString();
  },
  device: () => {
    return {
      width: window.screen.width,
      height: window.screen.height,
      rate: window.devicePixelRatio,
    }
  },
  toF: (a, fix) => {
    fix = fix || 3; return parseFloat(a.toFixed(fix))
  },
  download: (filename, text, type) => {
    var element = document.createElement('a');

    switch (type) {
      case "image":
        element.setAttribute('href', text);
        break;

      default:
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        break;
    }

    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();
    document.body.removeChild(element);
  },
  u8aToBs58: (uint8Array) => {
    const BASE58_CHARS = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
    let base58String = '';
    let value = 0n;
    let base = 1n;

    // Convert Uint8Array to BigInt
    for (let i = uint8Array.length - 1; i >= 0; i--) {
      value += window.BigInt(uint8Array[i]) * base;
      base *= 256n;
    }

    // Convert BigInt to Base58 string
    while (value > 0n) {
      const remainder = value % 58n;
      value = value / 58n;
      base58String = BASE58_CHARS[Number(remainder)] + base58String;
    }

    // Prefix leading zero bytes in Uint8Array with '1' in Base58 string
    for (let i = 0; i < uint8Array.length && uint8Array[i] === 0; i++) {
      base58String = '1' + base58String;
    }

    return base58String;
  },
  bs58ToU8a: (str) => {
    return Uint8Array.from(Array.from(str).map(letter => letter.charCodeAt(0)));
},
};

module.exports = self;