/**
 * @file CAN bus overhead, stuffing and bitrate calculation library.
 *
 * This is the core of the CanOverhead project, performing the actual
 * computations on the bits and bytes. It has no interactions with
 * any HTML page, so it can be used also as a stand-alone data-processing
 * library in Node, for example.
 *
 * @licence BSD 3-clause license. See LICENSE.md for details.
 */

/**
 * Wrapper of an array of bits with the ability to add stuff bits and
 * format the bits in many ways.
 */
class BitSequence {
    /**
     * Constructs an empty array of bits, optionally initialising with a
     * string of bits like " 11 0110".
     *
     * @param {string|boolean[]|number[]|number|boolean|BitSequence} bits -
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
     * @param {boolean[]|string|number[]|number|boolean|BitSequence} newTail -
     *     bits to append at the end of this sequence:
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
        if (!(other instanceof BitSequence)) {
            return false;
        }
        if (other._sequence.length !== this._sequence.length) {
            return false;
        }
        if (other._isStuffed !== this._isStuffed) {
            return false;
        }
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
            return 0;
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


const idSize = {
    BASE_11_BIT: 11,
    EXTENDED_29_BIT: 29,
}
const bit = {
    DOMINANT: false,
    RECESSIVE: true,
}
const fieldRtr = {
    DATA_FRAME: bit.DOMINANT,
    RTR_FRAME: bit.RECESSIVE,
}
const fieldIde = {
    BASE_11_BIT: bit.DOMINANT,
    EXTENDED_29_BIT: bit.RECESSIVE,
}

/**
 * Data structure representing a Classic CAN data frame with 11-bit identifier.
 *
 * Provide an ID and the payload, the query the various methods to obtain
 * the fields of the frame or all of them together (also with stuff bits)
 * as BitSequences.
 */
class CanFrame11Bit {
    static MAX_ID_VALUE_11_BIT = 0x7FF;
    static MIN_ID_VALUE = 0;
    static MAX_PAYLOAD_BYTES = 8;

    id;
    payload;

    /**
     * Constructs a Classic CAN frame with an 11-bit ID.
     *
     * @param {number} id integer of the CAN ID. Most significant bit is the
     *        first transmitted
     * @param {Uint8Array} payload array of integers. Most significant bit
     *        of the first byte (at index 0) is the first transmitted
     */
    constructor(id, payload) {
        // Check ID
        if (typeof (id) !== "number") {
            throw new TypeError("Identifier must be a number.");
        }
        if (id < CanFrame11Bit.MIN_ID_VALUE
            || id > CanFrame11Bit.MAX_ID_VALUE_11_BIT) {
            throw new RangeError("Identifier out of bounds.");
        }
        // Check Payload
        if (!(payload instanceof Uint8Array)) {
            throw new TypeError("Payload must be a Uint8Array.");
        }
        if (payload.length > CanFrame11Bit.MAX_PAYLOAD_BYTES) {
            throw new RangeError("Payload too long.");
        }
        // Everything valid
        this.id = id;
        this.payload = payload;
    }

    /**
     * Provides the start of frame field wrapped in a BitSequence.
     *
     * Length: 1 bit. This field is stuffable.
     *
     * Always dominant.
     *
     * @returns {BitSequence} SOF
     */
    field01_startOfFrame() {
        return new BitSequence(bit.DOMINANT);
    }

    /**
     * Provides the identifier field as BitSequence.
     *
     * Length: 11 bits. This field is stuffable.
     *
     * @returns {BitSequence} ID
     */
    field02_identifier() {
        return new BitSequence(this.id.toString(2)
            .padStart(idSize.BASE_11_BIT, "0"));
    }

    /**
     * Provides the remote transmission request field as BitSequence.
     *
     * Length: 1 bit. This field is stuffable.
     *
     * Dominant for data frames, recessive for RTR frames.
     *
     * @returns {BitSequence} RTR
     */
    field03_remoteTransmissionRequest() {
        return new BitSequence(fieldRtr.DATA_FRAME);
    }

    /**
     * Provides the identifier extension field as BitSequence.
     *
     * Length: 1 bit. This field is stuffable.
     *
     * Dominant for 11-bit IDs (base frame format), recessive for 29-bit IDs
     * (extended frame format).
     *
     * @returns {BitSequence} IDE
     */
    field04_identifierExtensionBit() {
        return new BitSequence(fieldIde.BASE_11_BIT);
    }

    /**
     * Provides the reserved field #0 as BitSequence.
     *
     * Length: 1 bit. This field is stuffable.
     *
     * Always dominant for classic CAN frames.
     *
     * @returns {BitSequence} R0
     */
    field05_reservedBit() {
        return new BitSequence(bit.DOMINANT);
    }

    /**
     * Provides the data length code as BitSequence.
     *
     * Length: 4 bits. This field is stuffable.
     *
     * First bit is the most significant one. Values are limited to [0, 8]
     * for classic CAN.
     *
     * @returns {BitSequence} DLC
     */
    field06_dataLengthCode() {
        return new BitSequence(this.payload.length.toString(2)
            .padStart(4, "0"));
    }

    /**
     * Provides the data field as BitSequence.
     *
     * Length: as many bits as in the this.payload field [0, 8, 16, ..., 64],
     * but always a multiple of 8, as the payload is in bytes.
     * This field is stuffable.
     *
     * @returns {BitSequence} Data
     */
    field07_dataField() {
        let payloadBits = new BitSequence();
        for (let byte of this.payload) {
            payloadBits.extend(byte.toString(2).padStart(8, "0"));
        }
        return payloadBits;
    }

    /**
     * Provides the CRC field as BitSequence, calculated on all the fields
     * appearing before the CRC itself.
     *
     * Length: 15 bits. This field is stuffable.
     *
     * @returns {BitSequence} CRC
     */
    field08_crc() {
        let preCrc = new BitSequence();
        preCrc.extend(this.field01_startOfFrame());
        preCrc.extend(this.field02_identifier());
        preCrc.extend(this.field03_remoteTransmissionRequest());
        preCrc.extend(this.field04_identifierExtensionBit());
        preCrc.extend(this.field05_reservedBit());
        preCrc.extend(this.field06_dataLengthCode());
        preCrc.extend(this.field07_dataField());
        let crcAsInteger = CanFrame11Bit.crc15(preCrc);
        return new BitSequence(crcAsInteger.toString(2).padStart(15, "0"));
    }

    /**
     * Provides the CRC delimiter field as BitSequence.
     *
     * Length: 1 bit. This field is *not* stuffable.
     *
     * @returns {BitSequence} CRC Delimiter
     */
    field09_crcDelimiter() {
        return new BitSequence(bit.RECESSIVE);
    }

    /**
     * Provides the acknowledgement slot field as BitSequence.
     *
     * Length: 1 bit. This field is *not* stuffable.
     *
     * Always recessive during transmission, set to dominant by the received to
     * acknowledge the transmission.s
     *
     * @returns {BitSequence} ACK slot
     */
    field10_ackSlot() {
        return new BitSequence(bit.RECESSIVE);
    }

    /**
     * Provides the acknowledgement slot delimiter field as BitSequence.
     *
     * Length: 1 bit. This field is *not* stuffable.
     *
     * Always recessive.
     *
     * @returns {BitSequence} ACK delimiter
     */
    field11_ackDelimiter() {
        return new BitSequence(bit.RECESSIVE);
    }

    /**
     * Provides the end of frame field as BitSequence.
     *
     * Length: 7 bits. This field is *not* stuffable.
     *
     * Always recessive bits.
     *
     * @returns {BitSequence} EOF
     */
    field12_endOfFrame() {
        return new BitSequence([
            bit.RECESSIVE, bit.RECESSIVE, bit.RECESSIVE, bit.RECESSIVE,
            bit.RECESSIVE, bit.RECESSIVE, bit.RECESSIVE,
        ]);
    }

    /**
     * Provides the empty space required between two immediately successive
     * CAN frames as BitSequence.
     *
     * Length: 3 bits. This field is *not* stuffable.
     *
     * Always recessive bits.
     *
     * @returns {BitSequence} Pause after EOF
     */
    field13_pauseAfterFrame() {
        return new BitSequence([
            bit.RECESSIVE, bit.RECESSIVE, bit.RECESSIVE,
        ]);
    }

    /**
     * Provides the whole frame as BitSequence, without stuff bits.
     *
     * @returns {BitSequence} whole frame
     */
    wholeFrame() {
        let frame = new BitSequence();
        frame.extend(this.field01_startOfFrame());
        frame.extend(this.field02_identifier());
        frame.extend(this.field03_remoteTransmissionRequest());
        frame.extend(this.field04_identifierExtensionBit());
        frame.extend(this.field05_reservedBit());
        frame.extend(this.field06_dataLengthCode());
        frame.extend(this.field07_dataField());
        frame.extend(this.field08_crc());
        frame.extend(this.field09_crcDelimiter());
        frame.extend(this.field10_ackSlot());
        frame.extend(this.field11_ackDelimiter());
        frame.extend(this.field12_endOfFrame());
        frame.extend(this.field13_pauseAfterFrame());
        return frame;
    }

    /**
     * Provides the whole frame as BitSequence, including stuff bits.
     *
     * @returns {BitSequence} whole frame
     */
    wholeFrameStuffed() {
        let frame = new BitSequence();
        frame.extend(this.field01_startOfFrame());
        frame.extend(this.field02_identifier());
        frame.extend(this.field03_remoteTransmissionRequest());
        frame.extend(this.field04_identifierExtensionBit());
        frame.extend(this.field05_reservedBit());
        frame.extend(this.field06_dataLengthCode());
        frame.extend(this.field07_dataField());
        frame.extend(this.field08_crc());
        frame = frame.applyBitStuffing();
        frame.extend(this.field09_crcDelimiter());
        frame.extend(this.field10_ackSlot());
        frame.extend(this.field11_ackDelimiter());
        frame.extend(this.field12_endOfFrame());
        frame.extend(this.field13_pauseAfterFrame());
        return frame;
    }

    /**
     * Provides the maximum possible (worst case) amount of bits of the whole
     * frame after stuffing with the same payload length.
     *
     * @returns {number} max amount of bits of the whole frame
     */
    maxLengthAfterStuffing() {
        let amountOfStuffableBits = 1; // Start of Frame
        amountOfStuffableBits += 11; // CAN ID
        amountOfStuffableBits += 1; // Remote Transmission Request
        amountOfStuffableBits += 1; // Identifier Extension
        amountOfStuffableBits += 1; // Reserved bit 0
        amountOfStuffableBits += 4; // Data Length Code
        amountOfStuffableBits += this.payload.length * 8; // Payload in bits
        amountOfStuffableBits += 15; // CRC
        let amountAfterStuffing =
            BitSequence.maxLengthAfterStuffing(amountOfStuffableBits);
        amountAfterStuffing += 1; // CRC delimiter
        amountAfterStuffing += 1; // ACK slot
        amountAfterStuffing += 1; // ACK delimiter
        amountAfterStuffing += 7; // End of frame
        amountAfterStuffing += 3; // Pause after end of frame
        return amountAfterStuffing;
    }

    /**
     * Computes the CRC of 15 bits for the classic CAN bus.
     *
     * Polynomial:
     * x^15 + x^14 + x^10 + x^8 + x^7 +x^4 +x^3 + x^0
     * = 0b1100010110011001 = 0xC599
     *
     * @param {boolean[]|number[]|BitSequence} bits - iterable of bits to
     *        compute the CRC for
     * @returns {number} the output CRC as non-negative integer
     */
    static crc15(bits) {
        return crc(bits, 0xC599, 15);
    }
}


class CanFrame29Bit {
    // As CanFrame11Bit but with 29 bit ID.
    // or is it better with a settings to switch between 11 and 29 bits?
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
 * @param {boolean[]|number[]|BitSequence} bits -
 *        iterable of bits to compute the CRC for
 * @param {number} polynomial - positive integer representation of the
 *        polynomial
 * @param {number} n - positive integer number of bits of the output
 * @returns {number} the output CRC as non-negative integer
 */
function crc(bits, polynomial, n) {
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
 * Computes the CRC of 17 bits for the CAN FD bus.
 *
 * Polynomial: x^17 + x^16 + x^14 + x^13 + x^11 + x^6 + x^4 + x^3 + x^1 + x^0
 * = 0b110110100001011011 = 0x3685B
 * @param {boolean[]|number[]|BitSequence} bits - iterable of bits to compute
 *        the CRC for
 * @returns {number} the output CRC as non-negative integer
 */
function crc17(bits) {
    return crc(bits, 0x3685B, 17);
}

/**
 * Computes the CRC of 21 bits for the CAN FD bus.
 *
 * Polynomial: x^21 + x^20 + x^13 + x^11 + x^7 + x^4 + x^3 + x^0
 * = 0b1100000010100010011001 = 0x302899
 *
 * @param {boolean[]|number[]|BitSequence} bits - iterable of bits to compute
 *        the CRC for
 * @returns {number} the output CRC as non-negative integer
 */
function crc21(bits) {
    return crc(bits, 0x302899, 21);
}
