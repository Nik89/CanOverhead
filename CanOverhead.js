class Bits {
    // "  1101 0011 1" -> [true, true, false, ...]
    constructor(binString) {
        this.bitsArray = [];
        if (typeof (binString) === "string") {
            for (let bit_char of binString) {
                if (bit_char === "1") {
                    this.bitsArray.push(true);
                } else if (bit_char === "0") {
                    this.bitsArray.push(false);
                } else if (bit_char.trim() === "") {
                    /* Skip whitespace char */
                } else {
                    throw new RangeError("Unsupported character: " + bit_char);
                }
            }
        } else {
            throw new TypeError(
                "Unsupported type for construction of Bits: "
                + typeof (binString));
        }
    }

    /**
     * Returns the maximum amount of stuff bits that could be added, given the
     * length of the array of bits.
     *
     * @param {Number} amountOfBits - Length of the array of bits
     * @returns {Number} Amount of maximum stuff bits needed for the considered
     * array of bits
     */
    maxAmountOfStuffBits(amountOfBits) {
        return Math.floor(amountOfBits / 5);
    }

    /**
     * Returns the maximum length of the array of bits including the maximum stuff
     * bits, given the length of the array of bits.
     *
     * @param {Number} amountOfBits - Length of the array of bits
     * @returns {Number} maximum length of the considered array of bits plus the
     * maximum stuff bits needed.
     */
    maxBitsAfterStuffing(amountOfBits) {
        return amountOfBits + maxAmountOfStuffBits(amountOfBits);
    }

    /**
     * Returns the exact amount of stuff bits, given the array of bits
     * Example (using 0 and 1 instead of true and false):
     *         Input:    11111 0000
     *         Output:    11111000001        -> 2 bits of stuffing required
     * @returns {Number} Amount of stuff bits needed for the considered array of bits
     */
    exactAmountOfStuffBits() {
        let amountOfStuffBits = 0;
        let repeatedBits = 1;
        let previousBit = undefined;
        for (let bit of this.bitsArray) {
            if (bit === previousBit) {
                repeatedBits++;
            } else {
                repeatedBits = 1;
            }
            if (repeatedBits === 5) {
                amountOfStuffBits++;
                repeatedBits = 1;
                previousBit = !bit;
            } else {
                previousBit = bit;
            }
        }
        return amountOfStuffBits;
    }

    /**
     * Returns the exact amount of stuff bits, given the array of bits
     * Example (using 0 and 1 instead of true and false):
     *         Input:    11111 0000
     *         Output:   11111000001
     * @returns {Number} Amount of stuff bits needed for the considered array of bits
     */
    applyBitStuffing() {
        let bitsAfterStuffing = [];
        let repeatedBits = 1;
        let previousBit = undefined;
        for (let bit of this.bitsArray) {
            if (bit === previousBit) {
                repeatedBits++;
            } else {
                repeatedBits = 1;
            }
            if (repeatedBits === 5) {
                repeatedBits = 1;
                bitsAfterStuffing.push(bit);
                bitsAfterStuffing.push(!bit);    // Stuffing bit
                previousBit = !bit;
            } else {
                bitsAfterStuffing.push(bit);
                previousBit = bit;
            }
        }
        return bitsAfterStuffing;
    }

    // [true, true, false, ...] -> "1101001011"
    boolArrayToBinaryString() {
        let str = "";
        for (let bit of this.bitsArray) {
            if (bit) {
                str += "1";
            } else {
                str += "0";
            }
        }
        return str;
    }

    // [true, false, true, ... ] -> "01 1111 1100"
    boolArrayToPrettyBinaryString() {
        let str = "";
        let count = this.bitsArray.length;
        for (let bit of this.bitsArray) {
            if (bit) {
                str += "1";
            } else {
                str += "0";
            }
            count--;
            if (count % 4 === 0 && count > 0) {
                str += " ";
            }
        }
        return str;
    }

    // [true, false, true, ... ] -> "17A"
    boolArrayToHexString() {
        let str = "";
        let nibble_value = 0;
        let bits_in_nibble = 0;
        for (let i = this.bitsArray.length - 1; i >= 0; i--) {
            if (this.bitsArray[i]) {
                nibble_value |= 1 << bits_in_nibble;
            }
            bits_in_nibble++;
            if (bits_in_nibble === 4) {
                str = nibble_value.toString(16) + str; // Prepend
                bits_in_nibble = 0;
                nibble_value = 0;
            }
        }
        // Handle any leftover less-than-4 bits
        if (bits_in_nibble > 0) {
            str = nibble_value.toString(16) + str; // Prepend
        }
        return str.toUpperCase();
    }
}
