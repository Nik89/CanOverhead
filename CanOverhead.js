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
 * @private
 * Enumeration of internal representation of bits in a BitSequence,
 * distinguishing between regular and stuff bits.
 * The enum entries are designed in such way that the least significant bit
 * (entry & 0b01) represents the bit value, while the immediately higher bit
 * represents the stuffing (entry & 0b10).
 * @type {{ZERO: number, ONE_STUFF: number, ONE: number, ZERO_STUFF: number}}
 */
const _Seqbit = {
    ZERO: 0,
    ONE: 1,
    ZERO_STUFF: 2,
    ONE_STUFF: 3,
}

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
     *     Other values of SeqBit are also acceptable for both single-bit and
     *     sequences, indicating the bits are stuff bits.
     * @returns {BitSequence} self useful to method concatenation
     */
    extend(newTail) {
        try {
            // Check if it's a single-bit first
            this._appendOneBit(newTail);
        } catch (RangeError) {
            // Fallback to iterating the tail
            for (let bit of newTail) {
                if (typeof bit === "string" && bit.trim() === "") {
                    /* Skip whitespace char */
                } else {
                    this._appendOneBit(bit);
                }
            }
        }
        return this;
    }

    /**
     * @private
     * Append one single bit to the sequence.
     * @param {string|number|boolean} bit a single bit, expressed as boolean
     *     or integer from SeqBit, indicating also if the bit is a stuff bit.
     */
    _appendOneBit(bit) {
        switch (bit) {
            case _Seqbit.ZERO:
            case false:
            case "0":
                this._sequence.push(_Seqbit.ZERO);
                break;
            case _Seqbit.ONE:
            case true:
            case "1":
                this._sequence.push(_Seqbit.ONE);
                break;
            case _Seqbit.ZERO_STUFF:
            case "2":
                this._sequence.push(_Seqbit.ZERO_STUFF);
                break;
            case _Seqbit.ONE_STUFF:
            case "3":
                this._sequence.push(_Seqbit.ONE_STUFF);
                break;
            default:
                throw new RangeError("Unsupported character: " + bit);
        }
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
     * Provides a copy of a sequence of bits with stuff bits added to it.
     *
     * Example:
     *     Input:    11111 0000
     *     Stuffing:      0    1
     *     Output:   11111000001
     *
     * Note that the internal encoding of the sequence uses different values
     * than 0 and 1 for stuff bits, so internally it looks like this:
     *     Input:    11111 0000
     *     Stuffing:      2    3
     *     Output:   11111200003
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
                // The previous bit is the stuffing one, but without stuffing
                // info, to allow easier comparison.
                let stuffingBit;
                if (bit === _Seqbit.ZERO) {
                    stuffingBit = _Seqbit.ONE_STUFF;
                    previousBit = _Seqbit.ONE;
                } else {
                    stuffingBit = _Seqbit.ZERO_STUFF;
                    previousBit = _Seqbit.ZERO;
                }
                sequenceAfterStuffing.push(stuffingBit);
                repeatedBits = 1;
            } else {
                previousBit = bit;
            }
        }
        return new BitSequence(sequenceAfterStuffing, true);
    }

    /**
     * Provides a copy of a sequence of bits with stuff bits removed from it.
     *
     * Example:
     *     Input:    11111000001
     *     Stuffing:      0    1
     *     Output:   11111 0000
     *
     * Note that the internal encoding of the sequence uses different values
     * than 0 and 1 for stuff bits, so internally it looks like this:
     *     Input:    11111200003
     *     Stuffing:      2    3
     *     Output:   11111 0000
     *
     * @returns {BitSequence} clone of this object without stuff bits applied
     *     to it
     */
    removeBitStuffing() {
        if (!this._isStuffed) {
            // Prevent de-stuffing twice.
            throw new TypeError("Bits sequence already de-stuffed.");
        }
        // Copy over only the non-stuff bits
        const sequenceWithoutStuffing = this._sequence.filter(
            bit => bit === _Seqbit.ZERO || bit === _Seqbit.ONE);
        return new BitSequence(sequenceWithoutStuffing, false);
    }

    /**
     * @private
     * Converts a sequence bit (SeqBit) to string, with optional formatting
     * for stuff bits
     * @param {number} bit to convert
     * @param {string} stuffBitPrefix string prepended to the stuff bit string
     *     representation
     * @param {string} stuffBitSuffix string appended to the stuff bit string
     *     representation
     */
    static _seqBitToString(bit, stuffBitPrefix = "", stuffBitSuffix = "") {
        switch (bit) {
            case _Seqbit.ZERO:
                return "0";
            case _Seqbit.ONE:
                return "1";
            case _Seqbit.ZERO_STUFF:
                return stuffBitPrefix + "0" + stuffBitSuffix;
            case _Seqbit.ONE_STUFF:
                return stuffBitPrefix + "1" + stuffBitSuffix;
            default:
                throw new RangeError("Unsupported sequence bit: " + bit);
        }
    }

    /**
     * Binary string representation of the sequence of bits.
     *
     * Example: "0001100100110". Left-most bit is the first found in the
     * bit sequence, right-most one is the last.
     *
     * @param {string} stuffBitPrefix string prepended to the stuff bit string
     *     representation
     * @param {string} stuffBitSuffix string appended to the stuff bit string
     *     representation
     * @returns {string} string with only "1" and "0" characters
     */
    toBinString(stuffBitPrefix = "", stuffBitSuffix = "") {
        let str = "";
        for (let bit of this._sequence) {
            str += BitSequence._seqBitToString(
                bit, stuffBitPrefix, stuffBitSuffix);
        }
        return str;
    }

    /**
     * Binary string representation of the sequence of bits with spaces every
     * 4 bits for better readability, aligned to the right.
     *
     * Example: "0 0011 0010 0110". Left-most bit is the first found in the
     * bit sequence, right-most one is the last.
     *
     * @param {string} stuffBitPrefix string prepended to the stuff bit string
     *     representation
     * @param {string} stuffBitSuffix string appended to the stuff bit string
     *     representation
     *
     * @returns {string} string with only "1", "0" and " " characters
     */
    toBinStringWithSpacesRightAlign(stuffBitPrefix = "", stuffBitSuffix = "") {
        let str = "";
        let count = this._sequence.length;
        for (let bit of this._sequence) {
            str += BitSequence._seqBitToString(
                bit, stuffBitPrefix, stuffBitSuffix);
            count--;
            if (count % 4 === 0 && count > 0) {
                str += " ";
            }
        }
        return str;
    }

    /**
     * Binary string representation of the sequence of bits with spaces every
     * 4 bits for better readability, aligned to the left.
     *
     * Example: "0011 0010 0110 11". Left-most bit is the first found in the
     * bit sequence, right-most one is the last.
     *
     * @param {string} stuffBitPrefix string prepended to the stuff bit string
     *     representation
     * @param {string} stuffBitSuffix string appended to the stuff bit string
     *     representation
     *
     * @returns {string} string with only "1", "0" and " " characters
     */
    toBinStringWithSpacesLeftAlign(stuffBitPrefix = "", stuffBitSuffix = "") {
        let str = "";
        let count = 0;
        for (let bit of this._sequence) {
            if (count === 4) {
                str += " ";
                count = 0;
            }
            str += BitSequence._seqBitToString(
                bit, stuffBitPrefix, stuffBitSuffix);
            count++;
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
            if (this._sequence[i] === _Seqbit.ONE
                || this._sequence[i] === _Seqbit.ONE_STUFF) {
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

const Bit = {
    DOMINANT: false,
    RECESSIVE: true,
}

const MAX_ID_VALUE_11_BIT = 0x7FF;
const MAX_ID_VALUE_29_BIT = 0x1FFFFFFF;
const MIN_ID_VALUE = 0;
const MAX_PAYLOAD_BYTES = 8;

const Field = {
    ID: 1,
    PAYLOAD: 2,
}

/**
 * Custom error class for input validation issues.
 */
class ValidationError extends Error {
    /**
     * Constructs a new ValidationError.
     * @param {string} message to display to the user
     * @param {Field} field type of the field causing the error
     */
    constructor(message, field) {
        super(message);
        this.name = "ValidationError";
        this.field = field;
    }
}

/**
 * @private
 * Internal class with some shared code for other specialised CAN frames.
 */
class _CanFrame {
    /**
     * Validates the constructor inputs for a Classic CAN frame.
     *
     * @param {number} id integer of the CAN ID. Most significant bit is the
     *        first transmitted
     * @param {Uint8Array} payload array of integers. Most significant bit
     *        of the first byte (at index 0) is the first transmitted
     * @param {number} maxId max value the ID can have
     */
    constructor(id, payload, maxId) {
        // Check ID
        if (typeof (id) !== "number") {
            throw new TypeError("Identifier must be a number.");
        }
        if (id < MIN_ID_VALUE || id > maxId) {
            throw new ValidationError(
                "Identifier out of bounds. Valid range: ["
                + MIN_ID_VALUE
                + ", "
                + maxId
                + "] = [0x"
                + MIN_ID_VALUE
                    .toString(16)
                    .toUpperCase()
                    .padStart(3, "0")
                + ", 0x"
                + maxId
                    .toString(16)
                    .toUpperCase()
                    .padStart(3, "0")
                + "] = [0b"
                + MIN_ID_VALUE
                    .toString(2)
                    .toUpperCase()
                    .padStart(11, "0")
                + ", 0b"
                + maxId
                    .toString(2)
                    .toUpperCase()
                    .padStart(11, "0")
                + "]",
                Field.ID);
        }
        // Check Payload
        if (!(payload instanceof Uint8Array)) {
            throw new TypeError("Payload must be a Uint8Array.");
        }
        if (payload.length > MAX_PAYLOAD_BYTES) {
            throw new ValidationError(
                "Payload too long. Valid length range: [0, "
                + MAX_PAYLOAD_BYTES
                + "] bytes",
                Field.PAYLOAD);
        }
        this.id = id;
        this.payload = payload;
    }
}

/**
 * Data structure representing a Classic CAN data frame with 11-bit identifier.
 *
 * Provide an ID and the payload, the query the various methods to obtain
 * the fields of the frame or all of them together (also with stuff bits)
 * as BitSequences.
 */
class CanFrame11Bit extends _CanFrame {
    /**
     * Constructs a Classic CAN frame with an 11-bit ID.
     *
     * @param {number} id integer of the CAN ID. Most significant bit is the
     *        first transmitted
     * @param {Uint8Array} payload array of integers. Most significant bit
     *        of the first byte (at index 0) is the first transmitted
     */
    constructor(id, payload) {
        super(id, payload, MAX_ID_VALUE_11_BIT);
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
        return new BitSequence(Bit.DOMINANT);
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
            .padStart(11, "0"));
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
        return new BitSequence(Bit.DOMINANT);
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
        return new BitSequence(Bit.DOMINANT);
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
        return new BitSequence(Bit.DOMINANT);
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
        let crcAsInteger = crc15(preCrc);
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
        return new BitSequence(Bit.RECESSIVE);
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
        return new BitSequence(Bit.RECESSIVE);
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
        return new BitSequence(Bit.RECESSIVE);
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
            Bit.RECESSIVE, Bit.RECESSIVE, Bit.RECESSIVE, Bit.RECESSIVE,
            Bit.RECESSIVE, Bit.RECESSIVE, Bit.RECESSIVE,
        ]);
    }

    /**
     * Provides the empty Inter-Frame Space required between two immediately
     * successive CAN frames as BitSequence.
     *
     * Length: 3 bits. This field is *not* stuffable.
     *
     * Always recessive bits.
     *
     * @returns {BitSequence} IFS
     */
    field13_interFrameSpace() {
        return new BitSequence([
            Bit.RECESSIVE, Bit.RECESSIVE, Bit.RECESSIVE,
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
        frame.extend(this.field13_interFrameSpace());
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
        frame.extend(this.field13_interFrameSpace());
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
}


/**
 * Data structure representing a Classic CAN extended data frame with 29-bit ID.
 *
 * Provide an ID and the payload, the query the various methods to obtain
 * the fields of the frame or all of them together (also with stuff bits)
 * as BitSequences.
 */
class CanFrame29Bit extends _CanFrame {
    /**
     * Constructs a Classic CAN extended frame with 29-bit ID.
     *
     * @param {number} id integer of the CAN ID. Most significant bit is the
     *        first transmitted
     * @param {Uint8Array} payload array of integers. Most significant bit
     *        of the first byte (at index 0) is the first transmitted
     */
    constructor(id, payload) {
        super(id, payload, MAX_ID_VALUE_29_BIT);
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
        return new BitSequence(Bit.DOMINANT);
    }

    /**
     * Provides the first part of the identifier as BitSequence.
     *
     * Length: 11 bits. This field is stuffable.
     *
     * @returns {BitSequence} IDA
     */
    field02_identifierPartA() {
        const mostSignificant11Bits = (this.id >> 18) & 0x7FF;
        return new BitSequence(
            mostSignificant11Bits.toString(2).padStart(11, "0"));
    }

    /**
     * Provides the substitute remote request field as BitSequence.
     *
     * Length: 1 bit. This field is stuffable.
     *
     * Always recessive for classic CAN frames.
     *
     * @returns {BitSequence} SRR
     */
    field03_substituteRemoteRequest() {
        return new BitSequence(Bit.RECESSIVE);
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
        return new BitSequence(Bit.RECESSIVE);
    }

    /**
     * Provides the second part of the identifier as BitSequence.
     *
     * Length: 18 bits. This field is stuffable.
     *
     * @returns {BitSequence} IDB
     */
    field05_identifierPartB() {
        const leastSignificant18Bits = this.id & 0x3FFFF;
        return new BitSequence(
            leastSignificant18Bits.toString(2).padStart(18, "0"));
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
    field06_remoteTransmissionRequest() {
        return new BitSequence(Bit.DOMINANT);
    }

    /**
     * Provides the reserved field #1 as BitSequence.
     *
     * Length: 1 bit. This field is stuffable.
     *
     * Always dominant for classic CAN frames.
     *
     * @returns {BitSequence} R1
     */
    field07_reservedBit1() {
        return new BitSequence(Bit.DOMINANT);
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
    field08_reservedBit0() {
        return new BitSequence(Bit.DOMINANT);
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
    field09_dataLengthCode() {
        return new BitSequence(
            this.payload.length.toString(2).padStart(4, "0"));
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
    field10_dataField() {
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
    field11_crc() {
        let preCrc = new BitSequence();
        preCrc.extend(this.field01_startOfFrame());
        preCrc.extend(this.field02_identifierPartA());
        preCrc.extend(this.field03_substituteRemoteRequest());
        preCrc.extend(this.field04_identifierExtensionBit());
        preCrc.extend(this.field05_identifierPartB());
        preCrc.extend(this.field06_remoteTransmissionRequest());
        preCrc.extend(this.field07_reservedBit1());
        preCrc.extend(this.field08_reservedBit0());
        preCrc.extend(this.field09_dataLengthCode());
        preCrc.extend(this.field10_dataField());
        const crcAsInteger = crc15(preCrc);
        return new BitSequence(crcAsInteger.toString(2).padStart(15, "0"));
    }

    /**
     * Provides the CRC delimiter field as BitSequence.
     *
     * Length: 1 bit. This field is *not* stuffable.
     *
     * @returns {BitSequence} CRC Delimiter
     */
    field12_crcDelimiter() {
        return new BitSequence(Bit.RECESSIVE);
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
    field13_ackSlot() {
        return new BitSequence(Bit.RECESSIVE);
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
    field14_ackDelimiter() {
        return new BitSequence(Bit.RECESSIVE);
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
    field15_endOfFrame() {
        return new BitSequence([
            Bit.RECESSIVE, Bit.RECESSIVE, Bit.RECESSIVE, Bit.RECESSIVE,
            Bit.RECESSIVE, Bit.RECESSIVE, Bit.RECESSIVE,
        ]);
    }

    /**
     * Provides the empty Inter-Frame Space required between two immediately
     * successive CAN frames as BitSequence.
     *
     * Length: 3 bits. This field is *not* stuffable.
     *
     * Always recessive bits.
     *
     * @returns {BitSequence} IFS
     */
    field16_interFrameSpace() {
        return new BitSequence([
            Bit.RECESSIVE, Bit.RECESSIVE, Bit.RECESSIVE,
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
        frame.extend(this.field02_identifierPartA());
        frame.extend(this.field03_substituteRemoteRequest());
        frame.extend(this.field04_identifierExtensionBit());
        frame.extend(this.field05_identifierPartB());
        frame.extend(this.field06_remoteTransmissionRequest());
        frame.extend(this.field07_reservedBit1());
        frame.extend(this.field08_reservedBit0());
        frame.extend(this.field09_dataLengthCode());
        frame.extend(this.field10_dataField());
        frame.extend(this.field11_crc());
        frame.extend(this.field12_crcDelimiter());
        frame.extend(this.field13_ackSlot());
        frame.extend(this.field14_ackDelimiter());
        frame.extend(this.field15_endOfFrame());
        frame.extend(this.field16_interFrameSpace());
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
        frame.extend(this.field02_identifierPartA());
        frame.extend(this.field03_substituteRemoteRequest());
        frame.extend(this.field04_identifierExtensionBit());
        frame.extend(this.field05_identifierPartB());
        frame.extend(this.field06_remoteTransmissionRequest());
        frame.extend(this.field07_reservedBit1());
        frame.extend(this.field08_reservedBit0());
        frame.extend(this.field09_dataLengthCode());
        frame.extend(this.field10_dataField());
        frame.extend(this.field11_crc());
        frame = frame.applyBitStuffing();
        frame.extend(this.field12_crcDelimiter());
        frame.extend(this.field13_ackSlot());
        frame.extend(this.field14_ackDelimiter());
        frame.extend(this.field15_endOfFrame());
        frame.extend(this.field16_interFrameSpace());
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
        amountOfStuffableBits += 11; // CAN ID part A
        amountOfStuffableBits += 1; // Substitute Remote Request
        amountOfStuffableBits += 1; // Identifier Extension
        amountOfStuffableBits += 18; // CAN ID part B
        amountOfStuffableBits += 1; // Remote Transmission Request
        amountOfStuffableBits += 1; // Reserved bit 1
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
function crc15(bits) {
    return crc(bits, 0xC599, 15);
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
