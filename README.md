## MPEG Transport Stream Parser

### Overview

MPEG Transport Stream format, it is a streaming standard used by broadcasters to distribute broadcast content from one point to another.Some useful aspects of
the standard are:

1. The streaming format is made up of individual packets
2. Each packet is 188 bytes long
3. Every packet begins with a “sync byte” which has hex value 0x47
4. Each packet has an ID, known as the PID that is 13 bits long. The PID is stored in the
   last 5 bits of the second byte, and all 8 bits of the third byte of a packet.

This is a simple MPEG TS parser that:

1. Reads a byte stream
2. Parses the byte stream to ensure it conforms that

   - The file contains a series of 188 byte packets, and each packet begins
     with the sync byte
   - Parse the Packet ID (PID) of each packet

3. Exits with a success code (0) if the byte stream conforms to the criteria, and a failure code (1) if it does not and outputs a summary

   - If there are any errors, exit and print the index and byte offset of the first TS packet where the error occurs.
     Eg. From the sample file `test_failure.ts`, the following output is expected

     ```
     Error: No sync byte present in packet 20535, offset 3860580
     ```

   - If there are no errors, lists all the unique PIDs present in the stream in ascending order in hex.
     Eg. From the sample file `test_success.ts`, the following output is expected

     ```
     0x0
     0x11
     0x20
     0x21
     0x22
     0x23
     0x24
     0x25
     0x1fff
     ```

### Technologies used

Node.js and JavaScript

### Usage

Execute the following command from `src` folder

```
node ts-parser.js <filename.ts>
```

For example: To read and parse the `test_failure.ts` file

```
node ts-parser.js test_failure.ts
```
