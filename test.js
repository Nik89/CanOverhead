let check = console.assert; // Shorter-name alias
function arrayEqual(a, b) {
    if (!Array.isArray(a)
        || !Array.isArray(b)
        || a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) return false;
    }
    return true;
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
check(BitSequence.maxAmountOfStuffBits(9) === 1);
check(BitSequence.maxAmountOfStuffBits(10) === 2);
check(BitSequence.maxAmountOfStuffBits(11) === 2);
check(BitSequence.maxAmountOfStuffBits(14) === 2);
check(BitSequence.maxAmountOfStuffBits(15) === 3);
check(BitSequence.maxAmountOfStuffBits(16) === 3);
check(BitSequence.maxAmountOfStuffBits(21) === 4);


// maxLengthAfterStuffing
check(BitSequence.maxLengthAfterStuffing(0) === 0);
check(BitSequence.maxLengthAfterStuffing(1) === 1);
check(BitSequence.maxLengthAfterStuffing(2) === 2);
check(BitSequence.maxLengthAfterStuffing(3) === 3);
check(BitSequence.maxLengthAfterStuffing(4) === 4);
check(BitSequence.maxLengthAfterStuffing(5) === 6);
check(BitSequence.maxLengthAfterStuffing(6) === 7);
check(BitSequence.maxLengthAfterStuffing(9) === 10);
check(BitSequence.maxLengthAfterStuffing(10) === 12);
check(BitSequence.maxLengthAfterStuffing(11) === 13);
check(BitSequence.maxLengthAfterStuffing(14) === 16);
check(BitSequence.maxLengthAfterStuffing(15) === 18);
check(BitSequence.maxLengthAfterStuffing(16) === 19);
check(BitSequence.maxLengthAfterStuffing(21) === 25);

// BitSequence constructor
let bits;
bits = new BitSequence();
check(arrayEqual(bits.sequence, []), bits.sequence);
check(bits.isStuffed === false);
bits = new BitSequence("    1 ")
check(arrayEqual(bits.sequence, [true]));
check(bits.isStuffed === false);
bits = new BitSequence("      0  1    ");
check(arrayEqual(bits.sequence, [false, true]));
check(bits.isStuffed === false);
bits = new BitSequence("      0  1  101    ");
check(arrayEqual(bits.sequence, [false, true, true, false, true]));
check(bits.isStuffed === false);
bits = new BitSequence("      0  1  101    ", true);
check(arrayEqual(bits.sequence, [false, true, true, false, true]));
check(bits.isStuffed === true);
bits = new BitSequence(0);
check(arrayEqual(bits.sequence, [false]));
check(bits.isStuffed === false);
bits = new BitSequence(4);
check(arrayEqual(bits.sequence, [true, false, false]));
check(bits.isStuffed === false);

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

// leftPadWithZeros
check(new BitSequence("").leftZeroPadToLength(0).toBinString() === "");
check(new BitSequence("").leftZeroPadToLength(1).toBinString() === "0");
check(new BitSequence("").leftZeroPadToLength(2).toBinString() === "00");
check(new BitSequence("1").leftZeroPadToLength(1).toBinString() === "1");
check(new BitSequence("1").leftZeroPadToLength(2).toBinString() === "01");
check(new BitSequence("01").leftZeroPadToLength(2).toBinString() === "01");
check(new BitSequence("11").leftZeroPadToLength(6).toBinString() === "000011");
