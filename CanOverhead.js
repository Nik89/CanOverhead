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
        if (amountOfBits < 1) {
            return amountOfBits;
        } else {
            return Math.floor((amountOfBits - 1) / 4);
        }
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
        let sequenceAfterStuffing = [];
        let repeatedBits = 1;
        let previousBit = undefined;
        for (let bit of this._sequence) {
            if (bit === previousBit) {
                repeatedBits++;
            } else {
                repeatedBits = 1;
            }
            sequenceAfterStuffing.push(bit);
            if (repeatedBits === 5) {
                // Apply stuffing bit, opposite of just processed bit
                let stuffingBit = !bit;
                sequenceAfterStuffing.push(stuffingBit);
                repeatedBits = 1;
                previousBit = stuffingBit;
            } else {
                previousBit = bit;
            }
        }
        return new BitSequence(sequenceAfterStuffing, true);
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

    /**
     * Makes this class iterable.
     * @returns {iterator} iterator of the bits as booleans
     */
    [Symbol.iterator]() {
        return this._sequence.values();
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

    f01_startOfFrame = START_OF_FRAME;
    f02_identifier;
    f03_remoteTransmissionRequest = RTR_IS_DATA_FRAME;
    f04_identifierExtensionBit = DOMINANT;
    f05_reservedBit = R0;
    f06_dataLengthCode;
    f07_dataField;
    f08_crc;
    f09_crcDelimiter = RECESSIVE;
    f10_ackSlot = RECESSIVE;
    f11_ackDelimiter = ACK_DELIMITER;
    f12_endOfFrame = END_OF_FRAME;

    /**
     * Constructs a Classic CAN frame with an 11-bit ID.
     *
     * @param {number|string} id integer of binary string of the CAN ID
     * @param {number[]|string} payload array of integers or hex string
     */
    constructor(id, payload) {
        // Check ID
        let identifierIsStringOfBits;
        if (typeof(id) === "number") {
            identifierIsStringOfBits = false;
            if (id < 0 || id > 2047) {
                throw new RangeError("Identifier not correct");
            }
        } else if (isStringOfBits(id)) {
            identifierIsStringOfBits = true;
            if (id.length > 11) {
                throw new RangeError("Identifier not correct");
            }
        } else {
            throw new RangeError("Identifier not correct");
        }

        // Check Payload
        let payloadIsStringOfBits;
        if (isArrayOfBits(payload)) {
            payloadIsStringOfBits = false;
            if (payload.length > 64) {
                throw new RangeError("Payload not correct");
            }
        } else if (isStringOfBits(payload)) {
            payloadIsStringOfBits = true;
            if (payload.length > 64) {
                throw new RangeError("Payload not correct");
            }
        } else {
            throw new RangeError("Payload not correct");
        }

        this.f02_identifier = (identifierIsStringOfBits) ? stringOfBits2arrayOfBool(id) : decimal2ArrayOfBool(id);
        this.f07_dataField = (payloadIsStringOfBits) ? stringOfBits2arrayOfBool(payload) : arrayOfBits2arrayOfBool(payload);

        this.f06_dataLengthCode = decimal2ArrayOfBool(this.f02_identifier.length);
        this.f08_crc = [];
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

/**
 * Computes a Cyclic Redundancy Check for a sequence of bits with a generic
 * polynomial, bit by bit.
 *
 * The polynomial can be provided with or without its most significant bit set.
 * The function internally needs the version without it being set, as it is
 * implicitly always 1 for a polynomial of grade n. Just to make sure to accept
 * both polynomial formats, its most significant bit is cleared before start.
 *
 * @param {boolean[]|number[]} bits - iterable of bits to compute the CRC for
 * @param {number} polynomial - positive integer representation of the
 *        polynomial
 * @param {number} n - positive integer number of bits of the output
 * @returns {number} the output CRC as non-negative integer
 */
function _crc(bits, polynomial, n) {
    let remainder = 0;
    let mostSignificantBitMask = 1 << n;
    // Clear the most significant bit of the polynomial, see docstring.
    polynomial &= ~mostSignificantBitMask;
    // Now update the mostSignificantBitMask to the new MS bit of the polynomial
    mostSignificantBitMask >>= 1;
    for (let bit of bits) {
        remainder = remainder ^ (bit << (n - 1));
        if (remainder & mostSignificantBitMask) {
            remainder = (remainder << 1) ^ polynomial;
        } else {
            remainder <<= 1;
        }
    }
    let nBitsMask = (1 << n) - 1;
    return remainder & nBitsMask;
}

/**
 * Computes the CRC of 15 bits for the classic CAN bus.
 *
 * Polynomial:
 * x^15 + x^14 + x^10 + x^8 + x^7 +x^4 +x^3 + x^0
 * = 0b1100010110011001 = 0xC599
 *
 * @param {boolean[]|number[]} bits - iterable of bits to compute the CRC for
 * @returns {number} the output CRC as non-negative integer
 */
function crc15(bits) {
    return _crc(bits, 0xC599, 15);
}

/**
 * Computes the CRC of 17 bits for the CAN FD bus.
 *
 * Polynomial: x^17 + x^16 + x^14 + x^13 + x^11 + x^6 + x^4 + x^3 + x^1 + x^0
 * = 0b110110100001011011 = 0x3685B
 * @param {boolean[]|number[]} bits - iterable of bits to compute the CRC for
 * @returns {number} the output CRC as non-negative integer
 */
function crc17(bits) {
    return _crc(bits, 0x3685B, 17);
}

/**
 * Computes the CRC of 21 bits for the CAN FD bus.
 *
 * Polynomial: x^21 + x^20 + x^13 + x^11 + x^7 + x^4 + x^3 + x^0
 * = 0b1100000010100010011001 = 0x302899
 *
 * @param {boolean[]|number[]} bits - iterable of bits to compute the CRC for
 * @returns {number} the output CRC as non-negative integer
 */
function crc21(bits) {
    return _crc(bits, 0x302899, 21);
}


let isArrayOfBits = (array) => {
    if (typeof(array) === "object" && Array.isArray(array)) {
        let isArrayOfBits = true;
        let i = 0;
        while ((i < array.length) && isArrayOfBits) {
            if (!(array[i] === 0 || array[i] === 1)) {
                isArrayOfBits = false;
            }
            i++;
        }
        return isArrayOfBits;
    } else {
        return false;
    }
}

let isStringOfBits = (string) => {
    if (typeof(string) === "string") {
        let isStringOfBits = true;
        let i = 0;
        while ((i < string.length) && isStringOfBits) {
            let char = string.substr(i, 1);
            if (!(char === "0" || char === "1")) {
                isStringOfBits = false;
            }
            i++;
        }
        return isStringOfBits;
    } else {
        return false;
    }
}

let arrayOfBits2arrayOfBool = (arrayOfBits) => {
    if (!isArrayOfBits(arrayOfBits)) {
        throw Error();
    }
    let arrayOfBool = [];
    arrayOfBits.forEach((el) => {
        arrayOfBool.push((el === 1));
    });

    return arrayOfBool;
}

let stringOfBits2arrayOfBool = (stringOfBits) => {
    if (!isStringOfBits(stringOfBits)) {
        throw Error();
    }
    let arrayOfBits = str.match(/.{1}/g);
    let arrayOfBool = [];
    arrayOfBits.forEach((el) => {
        arrayOfBool.push((el === "1"));
    });

    return arrayOfBool;
}

let decimal2ArrayOfBool = (decimal) => {
    if (typeof(decimal) !== "number") {
        throw Error();
    }
    let stringOfBits = Number(decimal).toString(2);
    return stringOfBits2arrayOfBool(stringOfBits);
}
