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


// maxBitsAfterStuffing
check(BitSequence.maxBitsAfterStuffing(0) === 0);
check(BitSequence.maxBitsAfterStuffing(1) === 1);
check(BitSequence.maxBitsAfterStuffing(2) === 2);
check(BitSequence.maxBitsAfterStuffing(3) === 3);
check(BitSequence.maxBitsAfterStuffing(4) === 4);
check(BitSequence.maxBitsAfterStuffing(5) === 6);
check(BitSequence.maxBitsAfterStuffing(6) === 7);
check(BitSequence.maxBitsAfterStuffing(9) === 10);
check(BitSequence.maxBitsAfterStuffing(10) === 12);
check(BitSequence.maxBitsAfterStuffing(11) === 13);
check(BitSequence.maxBitsAfterStuffing(14) === 16);
check(BitSequence.maxBitsAfterStuffing(15) === 18);
check(BitSequence.maxBitsAfterStuffing(16) === 19);
check(BitSequence.maxBitsAfterStuffing(21) === 25);

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
}
catch (TypeError) {
    // Error as expected
}

console.log("Unit tests completed.");
