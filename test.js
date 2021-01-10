let check = console.assert; // Shorter-name alias
// TODO make check function write large warning into the HTML in case something
/**
 * Compares two arrays for equality of type, length and content.
 * @param {Array|Uint8Array} a first array
 * @param {Array|Uint8Array} b second array
 * @returns {boolean} true if they are equal, false otherwise
 */
function arrayEqual(a, b) {
    let bothArraysOfSameSize = (Array.isArray(a) && Array.isArray(b) && a.length === b.length);
    let bothUint8ArraysOfSameSize = (a instanceof Uint8Array && b instanceof Uint8Array && a.length === b.length);
    if (bothArraysOfSameSize || bothUint8ArraysOfSameSize) {
        // Compare them field by field
        for (let i = 0; i < a.length; i++) {
            if (a[i] !== b[i]) return false;
        }
        return true;
    } else {
        return false;
    }
}

console.log("Starting unit tests.");

// maxAmountOfStuffBits
check(BitSequence.maxAmountOfStuffBits(0) === 0);
check(BitSequence.maxAmountOfStuffBits(1) === 0);
check(BitSequence.maxAmountOfStuffBits(2) === 0);
check(BitSequence.maxAmountOfStuffBits(3) === 0);
check(BitSequence.maxAmountOfStuffBits(4) === 0);
check(BitSequence.maxAmountOfStuffBits(5) === 1);
check(BitSequence.maxAmountOfStuffBits(6) === 1);
check(BitSequence.maxAmountOfStuffBits(7) === 1);
check(BitSequence.maxAmountOfStuffBits(8) === 1);
check(BitSequence.maxAmountOfStuffBits(9) === 2);
check(BitSequence.maxAmountOfStuffBits(10) === 2);
check(BitSequence.maxAmountOfStuffBits(11) === 2);
check(BitSequence.maxAmountOfStuffBits(12) === 2);
check(BitSequence.maxAmountOfStuffBits(13) === 3);
check(BitSequence.maxAmountOfStuffBits(14) === 3);
check(BitSequence.maxAmountOfStuffBits(15) === 3);
check(BitSequence.maxAmountOfStuffBits(16) === 3);
check(BitSequence.maxAmountOfStuffBits(17) === 4);
check(BitSequence.maxAmountOfStuffBits(18) === 4);
check(BitSequence.maxAmountOfStuffBits(19) === 4);
check(BitSequence.maxAmountOfStuffBits(20) === 4);
check(BitSequence.maxAmountOfStuffBits(21) === 5);

// maxLengthAfterStuffing
check(BitSequence.maxLengthAfterStuffing(0) === 0);
check(BitSequence.maxLengthAfterStuffing(1) === 1);
check(BitSequence.maxLengthAfterStuffing(2) === 2);
check(BitSequence.maxLengthAfterStuffing(3) === 3);
check(BitSequence.maxLengthAfterStuffing(4) === 4);
check(BitSequence.maxLengthAfterStuffing(5) === 6);
check(BitSequence.maxLengthAfterStuffing(6) === 7);
check(BitSequence.maxLengthAfterStuffing(7) === 8);
check(BitSequence.maxLengthAfterStuffing(8) === 9);
check(BitSequence.maxLengthAfterStuffing(9) === 11);
check(BitSequence.maxLengthAfterStuffing(10) === 12);
check(BitSequence.maxLengthAfterStuffing(11) === 13);
check(BitSequence.maxLengthAfterStuffing(12) === 14);
check(BitSequence.maxLengthAfterStuffing(13) === 16);
check(BitSequence.maxLengthAfterStuffing(14) === 17);
check(BitSequence.maxLengthAfterStuffing(15) === 18);
check(BitSequence.maxLengthAfterStuffing(16) === 19);
check(BitSequence.maxLengthAfterStuffing(17) === 21);
check(BitSequence.maxLengthAfterStuffing(18) === 22);
check(BitSequence.maxLengthAfterStuffing(19) === 23);
check(BitSequence.maxLengthAfterStuffing(20) === 24);
check(BitSequence.maxLengthAfterStuffing(21) === 26);

// BitSequence constructor
let bits;
// Default
bits = new BitSequence();
check(arrayEqual(bits._sequence, []), bits._sequence);
check(bits._isStuffed === false);
// Binary string
bits = new BitSequence("    1 ")
check(arrayEqual(bits._sequence, [true]));
check(bits._isStuffed === false);
bits = new BitSequence("      0  1    ");
check(arrayEqual(bits._sequence, [false, true]));
check(bits._isStuffed === false);
bits = new BitSequence("      0  1  101    ");
check(arrayEqual(bits._sequence, [false, true, true, false, true]));
check(bits._isStuffed === false);
bits = new BitSequence("      0  1  101    ", true);
check(arrayEqual(bits._sequence, [false, true, true, false, true]));
check(bits._isStuffed === true);
// Array of ints
bits = new BitSequence([0, 1, 0]);
check(arrayEqual(bits._sequence, [false, true, false]));
check(bits._isStuffed === false);
// Array of booleans
bits = new BitSequence([false, true, false]);
check(arrayEqual(bits._sequence, [false, true, false]));
check(bits._isStuffed === false);
// Hybrid array
bits = new BitSequence([1, false, "0"]);
check(arrayEqual(bits._sequence, [true, false, false]));
check(bits._isStuffed === false);
// Single bit integer
bits = new BitSequence(0);
check(arrayEqual(bits._sequence, [false]));
check(bits._isStuffed === false);
bits = new BitSequence(1);
check(arrayEqual(bits._sequence, [true]));
check(bits._isStuffed === false);
// Single bit boolean
bits = new BitSequence(false);
check(arrayEqual(bits._sequence, [false]));
check(bits._isStuffed === false);
bits = new BitSequence(true);
check(arrayEqual(bits._sequence, [true]));
check(bits._isStuffed === false);

// exactAmountOfStuffBits
check(new BitSequence().exactAmountOfStuffBits()
    === 0);
check(new BitSequence("1").exactAmountOfStuffBits()
    === 0);
check(new BitSequence("1110101010").exactAmountOfStuffBits()
    === 0);
check(new BitSequence("11111").exactAmountOfStuffBits()
    === 1);
check(new BitSequence("111110000").exactAmountOfStuffBits()
    === 2);

// applyBitStuffing
check(new BitSequence().applyBitStuffing()
    .equal(new BitSequence("", true)));
check(new BitSequence("1").applyBitStuffing()
    .equal(new BitSequence("1", true)));
check(new BitSequence("1110101010").applyBitStuffing()
    .equal(new BitSequence("1110101010", true)));
check(new BitSequence("11111").applyBitStuffing()
    .equal(new BitSequence("111110", true)));
check(new BitSequence("111110000").applyBitStuffing()
    .equal(new BitSequence("11111000001", true)));

// Cannot double-stuff
try {
    new BitSequence("111110", true).applyBitStuffing();
    check(false, "Error nor raised");
} catch (TypeError) {
    // Error as expected
}

// length
check(new BitSequence().length() === 0);
check(new BitSequence("1").length() === 1);
check(new BitSequence("1110101010").length() === 10);
check(new BitSequence("11111").length() === 5);
check(new BitSequence("11111000001", true).length() === 11);

// length after stuffing
check(new BitSequence().exactLengthAfterStuffing() === 0);
check(new BitSequence("1").exactLengthAfterStuffing() === 1);
check(new BitSequence("1110101010").exactLengthAfterStuffing() === 10);
check(new BitSequence("11111").exactLengthAfterStuffing() === 6);
check(new BitSequence("111110000").exactLengthAfterStuffing() === 11);

// toBinString
check(new BitSequence("").toBinString() === "");
check(new BitSequence("0").toBinString() === "0");
check(new BitSequence("10").toBinString() === "10");
check(new BitSequence("0010").toBinString() === "0010");
check(new BitSequence("0110101").toBinString() === "0110101");

// toBinStringWithSpaces
check(new BitSequence("").toBinStringWithSpaces() === "");
check(new BitSequence("0").toBinStringWithSpaces() === "0");
check(new BitSequence("10").toBinStringWithSpaces() === "10");
check(new BitSequence("0010").toBinStringWithSpaces() === "0010");
check(new BitSequence("0110101").toBinStringWithSpaces() === "011 0101");
check(new BitSequence("010110101").toBinStringWithSpaces() === "0 1011 0101");

// toHexString
check(new BitSequence("").toHexString() === "");
check(new BitSequence("0").toHexString() === "0");
check(new BitSequence("00 0000 0000").toHexString() === "000");
check(new BitSequence("10").toHexString() === "2");
check(new BitSequence("0010").toHexString() === "2");
check(new BitSequence("0110101").toHexString() === "35");
check(new BitSequence("0 0001 1111").toHexString() === "01F");
check(new BitSequence("1 0001 1111").toHexString() === "11F");
check(new BitSequence("10 1111 1111").toHexString() === "2FF");

// Extend
check(new BitSequence("").extend("").toBinString() === "");
check(new BitSequence("").extend("0").toBinString() === "0");
check(new BitSequence("").extend("1").toBinString() === "1");
check(new BitSequence("").extend("01").toBinString() === "01");
check(new BitSequence("1").extend("00").toBinString() === "100");
check(new BitSequence("0").extend("11").toBinString() === "011");
check(new BitSequence("01").extend("00").toBinString() === "0100");
check(new BitSequence("01").extend(0).toBinString() === "010");
check(new BitSequence("01").extend(1).toBinString() === "011");
check(new BitSequence("01").extend(false).toBinString() === "010");
check(new BitSequence("01").extend(true).toBinString() === "011");

// Iterability
bits = new BitSequence("");
for (let b of bits) {
    check(false, "This should not be executed.");
}
bits = new BitSequence("1");
for (let b of bits) {
    check(b === true);
}
bits = new BitSequence("101");
for (let b of bits) {
    check(b === true || b === false);
}


// CRC
// The tested values in hex are: 0x0, 0xF1, 0x833, 0x34ec
// Test expected results are computed with
// https://www.ghsi.de/pages/subpages/Online%20CRC%20Calculation/index.php
// CRC 15 bits for classic CAN
check(CanFrame11Bit.crc15([0]) === 0);
check(CanFrame11Bit.crc15([1, 1, 1, 1, 0, 0, 0, 1]) === 0b110001011110110);
check(CanFrame11Bit.crc15([true, true, true, true, 0, 0, false, 1]) === 0b110001011110110);
check(CanFrame11Bit.crc15([1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1]) === 0b000010001110100);
check(CanFrame11Bit.crc15([1, 1, 0, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0, 0]) === 0b010001010101010);

// CRC 17 bits for CAN FD
check(crc17([0]) === 0);
check(crc17([1, 1, 1, 1, 0, 0, 0, 1]) === 0b00000001000111100);
check(crc17([1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1]) === 0b00100010111100111);
check(crc17([1, 1, 0, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0, 0])
    === 0b00000111010101101);

// CRC 21 bits for CAN FD
check(crc21([0]) === 0);
check(crc21([1, 1, 1, 1, 0, 0, 0, 1]) === 0b000010111011100111001);
check(crc21([1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1]) === 0b100110110111010101101);
check(crc21([1, 1, 0, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0, 0])
    === 0b001001011010101011100);


// CanFrame11Bit fields and whole frame
let frame;
let toComputeCrcOn;
let expectedWholeFrame;
let expectedWholeFrameStuffed;
let crcBits;

// Case 1: simple ID and empty payload
frame = new CanFrame11Bit(0, new Uint8Array(0));
check(frame.id === 0);
check(arrayEqual(frame.payload, new Uint8Array(0)));
check(frame.field01_startOfFrame().equal(new BitSequence(0)));
check(frame.field02_identifier().equal(new BitSequence("000 0000 0000")));
check(frame.field03_remoteTransmissionRequest().equal(new BitSequence(0)));
check(frame.field04_identifierExtensionBit().equal(new BitSequence(0)));
check(frame.field05_reservedBit().equal(new BitSequence(0)));
check(frame.field06_dataLengthCode().equal(new BitSequence("0000")));
check(frame.field07_dataField().equal(new BitSequence()));
toComputeCrcOn = new BitSequence("0  000 0000 0000  0  0  0000");
check(frame.field08_crc().equal(new BitSequence("000 0000 0000 0000")));
check(frame.field09_crcDelimiter().equal(new BitSequence(1)));
check(frame.field10_ackSlot().equal(new BitSequence(1)));
check(frame.field11_ackDelimiter().equal(new BitSequence(1)));
check(frame.field12_endOfFrame().equal(new BitSequence("111 1111")));
check(frame.field13_pauseAfterFrame().equal(new BitSequence("111")));
expectedWholeFrame = new BitSequence(
    "0  000 0000 0000  0  0  0  0000  " // Header
    + "" // Payload
    + "000 0000 0000 0000  " // CRC
    + "1  1  1  111 1111  111" // Rest of the trailer
);
check(frame.wholeFrame().equal(expectedWholeFrame));
expectedWholeFrameStuffed = new BitSequence(
    "0  000 01000 00100  0  0  01  0000  " // Header
    + "" // Payload
    + "0100 00010 0000 10000  " // CRC
    + "1  1  1  111 1111  111", // Rest of the trailer (unstuffed)
    true // This sequence is already stuffed
);
check(frame.wholeFrameStuffed().equal(expectedWholeFrameStuffed));

// Case 2: simple ID and payload with 1 byte
frame = new CanFrame11Bit(0, new Uint8Array(1));
check(frame.id === 0);
check(arrayEqual(frame.payload, new Uint8Array(1)));
check(frame.field01_startOfFrame().equal(new BitSequence(0)));
check(frame.field02_identifier().equal(new BitSequence("000 0000 0000")));
check(frame.field03_remoteTransmissionRequest().equal(new BitSequence(0)));
check(frame.field04_identifierExtensionBit().equal(new BitSequence(0)));
check(frame.field05_reservedBit().equal(new BitSequence(0)));
check(frame.field06_dataLengthCode().equal(new BitSequence("0001")));
check(frame.field07_dataField().equal(new BitSequence("0000 0000")));
toComputeCrcOn = new BitSequence("0  000 0000 0000  0  0  0001  0000 0000");
crcBits = new BitSequence(
    CanFrame11Bit.crc15(toComputeCrcOn).toString(2).padStart(15, "0"));
check(frame.field08_crc().equal(crcBits));
check(frame.field09_crcDelimiter().equal(new BitSequence(1)));
check(frame.field10_ackSlot().equal(new BitSequence(1)));
check(frame.field11_ackDelimiter().equal(new BitSequence(1)));
check(frame.field12_endOfFrame().equal(new BitSequence("111 1111")));
check(frame.field13_pauseAfterFrame().equal(new BitSequence("111")));
expectedWholeFrame = new BitSequence(
    "0  000 0000 0000  0  0  0  0001  " // Header
    + "0000 0000" // Payload
    + "100 0100 0010 0110" // CRC
    + "1  1  1  111 1111  111" // Rest of the trailer
);
check(frame.wholeFrame().equal(expectedWholeFrame));
expectedWholeFrameStuffed = new BitSequence(
    "0  000 01000 00100  0  0  01  0001  " // Header
    + "0000 01000" // Payload
    + "100 0100 0010 0110" // CRC
    + "1  1  1  111 1111  111", // Rest of the trailer (unstuffed)
    true // This sequence is already stuffed
);
check(frame.wholeFrameStuffed().equal(expectedWholeFrameStuffed));

// Case 3: complex ID and payload with 8 bytes
frame = new CanFrame11Bit(0x133, new Uint8Array(8));
frame.payload[0] = 0xFF;
frame.payload[7] = 0xFF;
check(frame.id === 0x133);
check(frame.payload[0] === 0xFF);
check(frame.payload[1] === 0);
check(frame.payload[6] === 0);
check(frame.payload[7] === 0xFF);
check(frame.field01_startOfFrame().equal(new BitSequence(0)));
check(frame.field02_identifier().equal(new BitSequence("001 0011 0011")));
check(frame.field03_remoteTransmissionRequest().equal(new BitSequence(0)));
check(frame.field04_identifierExtensionBit().equal(new BitSequence(0)));
check(frame.field05_reservedBit().equal(new BitSequence(0)));
check(frame.field06_dataLengthCode().equal(new BitSequence("1000")));
check(frame.field07_dataField().equal(new BitSequence(
    "1111 1111  0000 0000  0000 0000  0000 0000" +
    "0000 0000  0000 0000  0000 0000  1111 1111")));
toComputeCrcOn = new BitSequence(
    "0  001 0011 0011  0  0  0  1000  "
    + "1111 1111  0000 0000  0000 0000  0000 0000"
    + "0000 0000  0000 0000  0000 0000  1111 1111");
crcBits = new BitSequence(
    CanFrame11Bit.crc15(toComputeCrcOn).toString(2).padStart(15, "0"));
check(frame.field08_crc().equal(crcBits));
check(frame.field09_crcDelimiter().equal(new BitSequence(1)));
check(frame.field10_ackSlot().equal(new BitSequence(1)));
check(frame.field11_ackDelimiter().equal(new BitSequence(1)));
check(frame.field12_endOfFrame().equal(new BitSequence("111 1111")));
check(frame.field13_pauseAfterFrame().equal(new BitSequence("111")));
expectedWholeFrame = new BitSequence(
    "0  001 0011 0011  0  0  0  1000  " // Header
    + "1111 1111  0000 0000  0000 0000  0000 0000" // Payload
    + "0000 0000  0000 0000  0000 0000  1111 1111"  // Payload
    + "001 1000 0101 1111"  // CRC
    + "1  1  1  111 1111  111" // Rest of the trailer
);
check(frame.wholeFrame().equal(expectedWholeFrame));
expectedWholeFrameStuffed = new BitSequence(
    "0  001 0011 0011  0  0  0  1000  " // Header
    + "1111 10111  0000 01000  00100 00010  00001 0000" // Payload
    + "01000 00100  00010 00001  0000 01000  1111 10111"  // Payload
    + "001 1000 0101 11110" // CRC
    + "1  1  1  111 1111  111", // Rest of the trailer (unstuffed)
    true // This sequence is already stuffed
);
check(frame.wholeFrameStuffed().equal(expectedWholeFrameStuffed));


// CanFrame11Bit max frame length
// In the CanFrame11Bit class, the length is computed field by field. Here
// we compute the expected value manually. Note that the part after the CRC
// is not stuffed, so we must not include it in the computation of the amount
// of stuff bits.

// Header = SOF + ID + RTR + IDE + R0 + DLC
const headerLength = 1 + 11 + 1 + 1 + 1 + 4;
const crcLength = 15;
// Post CRC = CRC del + ACK slot + ACK del + EOF + pause
const postCrcLength = 1 + 1 + 1 + 7 + 3;

// Try it over all payload lengths
for (let i = 0; i <= 8; i++) {
    let payload = new Uint8Array(i);
    frame = new CanFrame11Bit(0, payload);
    let expectedMaxFrameLenAfterStuffing =
        BitSequence.maxLengthAfterStuffing(
            headerLength + payload.length * 8 + crcLength)
        + postCrcLength;
    check(frame.maxLengthAfterStuffing()
        === expectedMaxFrameLenAfterStuffing, payload);
}
