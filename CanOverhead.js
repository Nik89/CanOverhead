/**
 * Wrapper of an array of bits.
 */
class BitSequence {
    /**
     * Constructs an empty array of bits, optionally initialising with a
     * string of bits like " 11 0110".
     *
     * @param {string|boolean[]|number[]|number|boolean} bits -
     *     iterable sequence of bits
     *     as binary string ("01 0011", white spaces are skipped)
     *     or boolean array ([true, true, false])
     *     or integer array ([1, 1, 0])
     *     or a hybrid array ([true, "1", 0])
     *     or also a plain single bit, expressed as boolean or integer
     *     like 0, 1 or false, true.
     * @param {boolean} isStuffed true when the provided sequence is already
     *     stuffed
     */
    constructor(bits = [], isStuffed = false) {
        this._isStuffed = Boolean(isStuffed);
        this._sequence = [];
        this.extend(bits);
    }

    /**
     * Concatenates the given sequence of bits (in multiple formats)
     * to the end (right-side) of this sequence, changing the BitSequence
     * object.
     *
     * @param {boolean[]|string|number[]|number|boolean} newTail - bits to
     * append at the end of this sequence:
     *     could be an iterable sequence of bits
     *     as binary string ("01 0011", white spaces are skipped)
     *     or boolean array ([true, true, false])
     *     or integer array ([1, 1, 0])
     *     or a hybrid array ([true, "1", 0])
     *     or also a plain single bit, expressed as boolean or integer
     *     like 0, 1 or false, true.
     * @returns {BitSequence} self useful to method concatenation
     */
    extend(newTail) {
        // Check if it's a single-bit first
        if (newTail === 1 || newTail === true) {
            this._sequence.push(true);
        } else if (newTail === 0 || newTail === false) {
            this._sequence.push(false);
        } else {
            for (let bit of newTail) {
                if (bit === "1" || bit === true || bit === 1) {
                    this._sequence.push(true);
                } else if (bit === "0" || bit === false || bit === 0) {
                    this._sequence.push(false);
                } else if (bit.trim() === "") {
                    /* Skip whitespace char */
                } else {
                    throw new RangeError("Unsupported character: " + bit);
                }
            }
        }
        return this;
    }

    /**
     * Provides the amount of bits in the sequence.
     * @returns {number} length of the sequence.
     */
    length() {
        return this._sequence.length;
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
        if (typeof (other._isStuffed) !== "boolean"
            || other._isStuffed !== this._isStuffed
            || !Array.isArray(other._sequence)
            || other._sequence.length !== this._sequence.length) return false;
        for (let i = 0; i < this._sequence.length; i++) {
            if (this._sequence[i] !== other._sequence[i]) return false;
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
        // TODO change into maxFrameLengthAfterStuffing()
        // and use the wikipedia formula
        // 8*n + 44 + Math.ceil((34+8*n-1)/4) for base frame
        // 8*n + 64 + Math.ceil((54+8*n-1)/4) for base frame
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
        for (let bit of this._sequence) {
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
        if (this._isStuffed) {
            // Prevent stuffing twice.
            throw new TypeError("Bits sequence already stuffed.");
        }
        let bitsAfterStuffing = [];
        let repeatedBits = 1;
        let previousBit = undefined;
        for (let bit of this._sequence) {
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
        // TODO change this object?
        this._sequence = bitsAfterStuffing;
        this._isStuffed = true;
        //return new BitSequence(bitsAfterStuffing, true);
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
        for (let bit of this._sequence) {
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
        let count = this._sequence.length;
        for (let bit of this._sequence) {
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
        for (let i = this._sequence.length - 1; i >= 0; i--) {
            if (this._sequence[i]) {
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

const RECESSIVE = true;
const DOMINANT = false;
const START_OF_FRAME = DOMINANT;
const RTR_IS_DATA_FRAME = DOMINANT;
const RTR_IS_RTR_FRAME = RECESSIVE;
const SRR = RECESSIVE;
const IDE_IS_11_BIT = DOMINANT;
const IDE_IS_29_BIT = RECESSIVE;
const R0 = DOMINANT;
const R1 = DOMINANT;
const CRC_DELIMITER = RECESSIVE;
const ACK_SLOT = RECESSIVE;
const ACK_DELIMITER = RECESSIVE;
const END_OF_FRAME = [
    RECESSIVE, RECESSIVE, RECESSIVE, RECESSIVE,
    RECESSIVE, RECESSIVE, RECESSIVE];
const PAUSE_AFTER_EOF = [RECESSIVE, RECESSIVE, RECESSIVE];


/**
 * Data structure representing a Classic CAN frame with 11-bit identifier.
 */
class CanFrame11Bit {
    /**
     * Constructs a Classic CAN frame with an 11-bit ID.
     *
     * @param {number|string} id integer of binary string of the CAN ID
     * @param {number[]|string} payload array of integers or hex string
     */
    constructor(id, payload) {
        // TODO check ID is 11 bits max
        this.id = id;
        this.remoteTransmissionRequest = false; // Hardcoded, for now
        if (payload.length > 8) {
            throw new RangeError("Classic CAN supports payloads of up to 8 B.");
        }
        this.payload = payload;
    }

    /**
     * Computes the length of the whole frame with a given payload length
     * without including the stuff bits.
     *
     * @param {number} payloadLength - size of the payload in bytes
     * @returns {number} whole frame length in bits
     */
    static exactLengthBeforeStuffing(payloadLength) {

    }

    /**
     * Computes the maximum possible length of the whole frame with a given
     * payload length after the addition of the stuff bits.
     *
     * @param {number} payloadLength - size of the payload in bytes
     * @returns {number} max whole frame length in bits, including stuff bits
     */
    static maxLengthAfterStuffing(payloadLength) {

    }

    /**
     * Provides the DLC header field as BitSequence.
     *
     * @returns {BitSequence} the DLC padded to 4 bits.
     */
    dataLengthCode() {
        return new BitSequence(this.payload.length.toString(2).padStart(4, "0"))
    }

    /**
     * Computes the length of the whole frame after the addition of the stuff
     * bits.
     *
     * @returns {number} exact whole frame length in bits, including stuff bits
     */
    exactLengthAfterStuffing() {

    }


    /**
     * Computes the Cyclic Redundancy Check (CRC-15) field of the frame
     * without the inclusion of any stuff bits.
     *
     * Used polynomial: 0xC599 = x^15 + x^14 + x^10 + x^8 + x^7 + x^4 + x^3 + 1
     *
     * @returns {BitSequence} CRC-15 sequence of bits.
     */
    crc() {

    }

    /**
     * Concatenates all frame fields together into a contiguous BitSequence
     * which does not include any stuff bits.
     *
     * @returns {BitSequence} all the bits in the frame.
     */
    toBitSequence() {
        let frame = new BitSequence();
        frame.extend(START_OF_FRAME);
        // TODO complete
    }

    /**
     * Concatenates all frame fields together into a contiguous BitSequence
     * which does include any stuff bits.
     *
     * Stuff bits are not included in the CRC delimiter, ACK field and the end
     * of frame bits. In other words: anything after the CRC (which is stuffed).
     *
     * @returns {BitSequence} all the bits in the frame, including stuff bits.
     */
    toBitSequenceAfterStuffing() {

    }
}
