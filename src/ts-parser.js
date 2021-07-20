var fs = require("fs");

const SYNCBYTE = 0x47;
const PACKETLENGTH = 188;

let ptr = 0; // point to the beginning of a packet
let readbuffer = true;
let end = PACKETLENGTH; // points the end of a packet
let result = [],
  pids = [];
let errorcode = "";
let packetIndex = 0;

let file = process.argv[2];
file &&
  fs.readFile(file, function (err, contents) {
    if (err) throw err;
    let payload = new Uint8Array(contents.buffer);

    while (readbuffer) {
      ptr === 0 ? (end = ptr + PACKETLENGTH) : "";
      // check if packet length = 188
      if (end - ptr === PACKETLENGTH) {
        // check if packet does not begin with SYNCBYTE  set errorcode and stop reading
        if (payload[ptr] !== SYNCBYTE) {
          // if no SYNCBYTE, display error message with the packet index and offset
          result.push(
            `Error: No sync byte present in packet ${packetIndex}, offset ${ptr}`
          );
          errorcode = 1;
          break;
        }
        // get PID from the packet
        // PID  = last 5 bits from the second byte and all 8 bits from the third byte of a packet

        let pid = ((payload[ptr + 1] & 0x1f) << 8) | payload[ptr + 2];

        pids.push(pid);
        errorcode = 0;
      }
      ptr = end;
      end = ptr + PACKETLENGTH;
      packetIndex += 1;
      // stop reading buffer when end >= given buffer payload
      if (end >= payload.length) {
        readbuffer = false;
      }
    }

    if (errorcode === 0) {
      // if no errors, find unique PIDs and display
      let uniquePids = pids.filter(
        (val, index, arr) => arr.indexOf(val) === index
      );
      sortAndConvertToHex(uniquePids, errorcode);
    } else {
      // if any error found, display error summary
      process.stdout.write(`\n${errorcode}\n${result[0]}\n`);
    }
  });

// sort PIDs in ascending order, convert and display the
// values in hexadecimal values
sortAndConvertToHex = (pids, err) => {
  pids.sort((a, b) => {
    return a - b;
  });
  let len = pids.length;
  process.stdout.write(`${err}\n`);
  for (let i = 0; i < len; i++) {
    process.stdout.write(`0x${pids[i].toString(16)}\n`);
  }
  return;
};
