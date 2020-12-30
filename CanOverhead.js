/**
 * Wrapper of an array of bits.
 */
class BitSequence {
    /**
     * Constructs an empty array of bits, optionally initialising with a
     * string of bits like " 11 0110".
     *
     * @param {string|boolean[]|number} binString optional binary number as a
     *     string or as boolean array. White spaces in the string are skipped.
     * @param {boolean} isStuffed true when the provided sequence is already
     *     stuffed
     */
    constructor(binString = [], isStuffed = false) {
        this.isStuffed = Boolean(isStuffed);
        if (typeof binString === "number") {
            binString = binString.toString(2);
        }
        if (typeof binString === "string") {
            this.sequence = [];
            for (let bit_char of binString) {
                if (bit_char === "1") {
                    this.sequence.push(true);
                } else if (bit_char === "0") {
                    this.sequence.push(false);
                } else if (bit_char.trim() === "") {
                    /* Skip whitespace char */
                } else {
                    throw new RangeError("Unsupported character: " + bit_char);
                }
            }
        } else {
            this.sequence = binString;
        }
    }

    /**
     * Provides the amount of bits in the sequence.
     * @returns {number} length of the sequence.
     */
    length() {
        return this.sequence.length;
    }

    /**
     * Checks whether this object is equal to another, including the content
     * of its members.
     *
     * @param {BitSequence} other any other object
     * @returns {boolean} true when the other object has the same members
     * as this object and their same content (field-by-field array equality
     * included).
     */
    equal(other) {
        if (typeof (other.isStuffed) !== "boolean"
            || other.isStuffed !== this.isStuffed
            || !Array.isArray(other.sequence)
            || other.sequence.length !== this.sequence.length) return false;
        for (let i = 0; i < this.sequence.length; i++) {
            if (this.sequence[i] !== other.sequence[i]) return false;
        }
        return true;
    }

    /**
     * Provides the maximum possible amount of stuff bits that could be added to
     * a sequence of bits of a given length.
     *
     * @param {number} amountOfBits - length of the sequence of bits
     * @returns {number} maximum possible amount of stuff bits that could
     * be added to the sequence
     */
    static maxAmountOfStuffBits(amountOfBits) {
        return Math.floor(amountOfBits / 5);
    }

    /**
     * Provides the length of the sequence of bits after adding to it the
     * maximum possible amount of of stuff bits.
     *
     * @param {number} amountOfBits - length of the sequence of bits
     * @returns {number} maximum possible length of the sequence after the
     * stuff bits have been added to it
     */
    static maxLengthAfterStuffing(amountOfBits) {
        return amountOfBits + this.maxAmountOfStuffBits(amountOfBits);
    }

    /**
     * Provides the exact amount of stuff bits that would be added to the Bits.
     *
     * Example (using 0 and 1 instead of true and false):
     *     Before:    11111 0000
     *     Stuffing:       0    1 => returns 2
     *
     * @returns {number} exact amount of stuff bits for the given sequence of
     * bits
     */
    exactAmountOfStuffBits() {
        let amountOfStuffBits = 0;
        let repeatedBits = 1;
        let previousBit = undefined;
        for (let bit of this.sequence) {
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
     * Provides the exact length of the sequence after the addition
     * of the stuff bits to it
     *
     * @returns {number} exact length
     */
    exactLengthAfterStuffing() {
        return this.length() + this.exactAmountOfStuffBits();
    }

    /**
     * Provides a copy of a sequence of bits with stuff bits added to it.
     *
     * Example (using 0 and 1 instead of true and false):
     *     Input:    11111 0000
     *     Stuffing:      0    1
     *     Output:   11111000001
     *
     * @returns {BitSequence} clone of this object with stuff bits applied to it
     */
    applyBitStuffing() {
        if (this.isStuffed) {
            // Prevent stuffing twice.
            throw new TypeError("Bits sequence already stuffed.");
        }
        let bitsAfterStuffing = [];
        let repeatedBits = 1;
        let previousBit = undefined;
        for (let bit of this.sequence) {
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
        return new BitSequence(bitsAfterStuffing, true);
    }

    /**
     * Binary string representation of the sequence of bits.
     *
     * Example: "0001100100110". Left-most bit is the first found in the
     * bit sequence, right-most one is the last.
     *
     * @returns {string} string with only "1" and "0" characters
     */
    toBinString() {
        let str = "";
        for (let bit of this.sequence) {
            if (bit) {
                str += "1";
            } else {
                str += "0";
            }
        }
        return str;
    }

    /**
     * Binary string representation of the sequence of bits with spaces every
     * 4 bits for better readability.
     *
     * Example: "0 0011 0010 0110". Left-most bit is the first found in the
     * bit sequence, right-most one is the last.
     *
     * @returns {string} string with only "1", "0" and " " characters
     */
    toBinStringWithSpaces() {
        let str = "";
        let count = this.sequence.length;
        for (let bit of this.sequence) {
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

    /**
     * Hex string representation of the sequence of bits.
     *
     * Example: [1,0,1,1,1,1,0,1,0] -> "17A".
     *
     * The first bit of the sequence (left-most) is interpreted as the most
     * significant of the whole sequence and is represented in the left-most
     * character (nibble) of the hex string as the most-significant bit
     * of that nibble. (big-endian, but bit-wise instead of byte-wise)
     *
     * @returns {string} string with only "1", "0" and " " characters
     */
    toHexString() {
        let str = "";
        let nibble_value = 0;
        let bits_in_nibble = 0;
        for (let i = this.sequence.length - 1; i >= 0; i--) {
            if (this.sequence[i]) {
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
