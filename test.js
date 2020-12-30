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

