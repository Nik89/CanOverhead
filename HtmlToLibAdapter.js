/**
 * @file This script binds the HTML+CSS UI of the calculator with the
 * CanOverhead.js library, which performs the actual computation.
 *
 * This file performs minor input sanitization and conversion from strings
 * to the required input format of the library.
 *
 * @licence BSD 3-clause license. See LICENSE.md for details.
 */

/**
 * Writes (thus displays) the inner HTML into a div with the given ID.
 *
 * It's basically just syntax sugar to shorten other code lines.
 *
 * @param {string} id identifier of the div where to write
 * @param {string} innerHtml HTML string to display
 */
function display(id, innerHtml) {
    document.getElementById(id).innerHTML = innerHtml;
}

/**
 * Erases the inner HTML of the div with the given ID, removing any
 * previously displayed content.
 *
 * It's basically just syntax sugar to shorten other code lines.
 *
 * @param {string} id identifier of the div where to remove content
 */
function clear(id) {
    display(id, "");
}

/**
 * Reads (gets) the value of the input form with the given ID.
 *
 * It's basically just syntax sugar to shorten other code lines.
 *
 * @param {string} id identifier of the div where to write
 * @return {string} content of the form
 */
function read(id) {
    return document.getElementById(id).value;
}

/**
 * Hides the document element from view.
 *
 * It's basically just syntax sugar to shorten other code lines.
 *
 * @param {string} id identifier of the element to hide
 */
function hide(id) {
    document.getElementById(id).style.display='none';
}

/**
 * Shows the previously-hidden document element.
 *
 * It's basically just syntax sugar to shorten other code lines.
 *
 * @param {string} id identifier of the element to sho
 */
function unhide(id) {
    document.getElementById(id).style.display='block';
}

/**
 * Prints the error message related to an invalid input of the CAN identifier.
 * @param {string} msg
 */
function displayCanIdentifierError(msg) {
    display("input_can_identifier_error", msg);
}

/**
 * Prints the error message related to an invalid input of the CAN payload.
 * @param {string} msg
 */
function displayCanPayloadError(msg) {
    display("input_can_payload_error", msg);
}

/**
 * Prints a generic error message related to an invalid input, also logging it
 * to the console.
 * @param {Error} err
 */
function displayUnknownError(err) {
    display("input_unknown_error",
        "An unexpected error occurred :( Please " +
        "<a href=\"https://github.com/Nik89/CanOverhead/issues\">" +
        "report</a> the conditions leading to your bug! " +
        "Here is some debug information: " + err.message);
    console.error(err);
}

/**
 * Erases the text on the page displaying any error messages and any
 * output from the previous calculation.
 */
function clearErrorsAndOutputs() {
    // Clear errors
    clear("input_can_identifier_error");
    clear("input_can_payload_error");
    clear("input_unknown_error");
    // Clear outputs about the whole frame
    clear("output_can_whole_frame");
    clear("output_can_whole_frame_len");
    clear("output_can_whole_frame_stuffed");
    clear("output_can_whole_frame_stuffed_len");
    clear("output_max_length");
    // Clear outputs about the frame fields for data 11-bit frames
    clear("output_can_data11_field01");
    clear("output_can_data11_field01_len");
    clear("output_can_data11_field01_hex");
    clear("output_can_data11_field02");
    clear("output_can_data11_field02_len");
    clear("output_can_data11_field02_hex");
    clear("output_can_data11_field03");
    clear("output_can_data11_field03_len");
    clear("output_can_data11_field03_hex");
    clear("output_can_data11_field04");
    clear("output_can_data11_field04_len");
    clear("output_can_data11_field04_hex");
    clear("output_can_data11_field05");
    clear("output_can_data11_field05_len");
    clear("output_can_data11_field05_hex");
    clear("output_can_data11_field06");
    clear("output_can_data11_field06_len");
    clear("output_can_data11_field06_hex");
    clear("output_can_data11_field07");
    clear("output_can_data11_field07_len");
    clear("output_can_data11_field07_hex");
    clear("output_can_data11_field08");
    clear("output_can_data11_field08_len");
    clear("output_can_data11_field08_hex");
    clear("output_can_data11_field09");
    clear("output_can_data11_field09_len");
    clear("output_can_data11_field09_hex");
    clear("output_can_data11_field10");
    clear("output_can_data11_field10_len");
    clear("output_can_data11_field10_hex");
    clear("output_can_data11_field11");
    clear("output_can_data11_field11_len");
    clear("output_can_data11_field11_hex");
    clear("output_can_data11_field12");
    clear("output_can_data11_field12_len");
    clear("output_can_data11_field12_hex");
    clear("output_can_data11_field13");
    clear("output_can_data11_field13_len");
    clear("output_can_data11_field13_hex");
    // Clear outputs about the frame fields for data 29-bit frames
    clear("output_can_data29_field01");
    clear("output_can_data29_field01_len");
    clear("output_can_data29_field01_hex");
    clear("output_can_data29_field02");
    clear("output_can_data29_field02_len");
    clear("output_can_data29_field02_hex");
    clear("output_can_data29_field03");
    clear("output_can_data29_field03_len");
    clear("output_can_data29_field03_hex");
    clear("output_can_data29_field04");
    clear("output_can_data29_field04_len");
    clear("output_can_data29_field04_hex");
    clear("output_can_data29_field05");
    clear("output_can_data29_field05_len");
    clear("output_can_data29_field05_hex");
    clear("output_can_data29_field06");
    clear("output_can_data29_field06_len");
    clear("output_can_data29_field06_hex");
    clear("output_can_data29_field07");
    clear("output_can_data29_field07_len");
    clear("output_can_data29_field07_hex");
    clear("output_can_data29_field08");
    clear("output_can_data29_field08_len");
    clear("output_can_data29_field08_hex");
    clear("output_can_data29_field09");
    clear("output_can_data29_field09_len");
    clear("output_can_data29_field09_hex");
    clear("output_can_data29_field10");
    clear("output_can_data29_field10_len");
    clear("output_can_data29_field10_hex");
    clear("output_can_data29_field11");
    clear("output_can_data29_field11_len");
    clear("output_can_data29_field11_hex");
    clear("output_can_data29_field12");
    clear("output_can_data29_field12_len");
    clear("output_can_data29_field12_hex");
    clear("output_can_data29_field13");
    clear("output_can_data29_field13_len");
    clear("output_can_data29_field13_hex");
    clear("output_can_data29_field14");
    clear("output_can_data29_field14_len");
    clear("output_can_data29_field14_hex");
    clear("output_can_data29_field15");
    clear("output_can_data29_field15_len");
    clear("output_can_data29_field15_hex");
    clear("output_can_data29_field16");
    clear("output_can_data29_field16_len");
    clear("output_can_data29_field16_hex");
    clear("output_can_data29_field16_hex");
    // Hide all output fields
    hide("output_list_title");
    hide("output_list");
    hide("output_table_title");
    hide("output_table_data11bit");
    hide("output_table_data29bit");
}


/**
 * Computes and prints the whole CAN frame as bit sequence.
 * @param {CanFrame11Bit|CanFrame29Bit} canFrame
 */
function displayCanFrameWholeFrame(canFrame) {
    // Without stuffing
    const bits = canFrame.wholeFrame();
    display("output_can_whole_frame_len", `[${bits.length()} bits]`);
    display("output_can_whole_frame", bits.toBinStringWithSpacesLeftAlign());
    // With stuffing
    let stuffedBits = canFrame.wholeFrameStuffed();
    let stuffBitsAmount = stuffedBits.length() - bits.length();
    display("output_can_whole_frame_stuffed_len",
        `[${stuffedBits.length()} bits, of which `
        + `<span class="stuff_bit">${stuffBitsAmount} stuff bits</span>]`);
    display("output_can_whole_frame_stuffed",
        stuffedBits.toBinStringWithSpacesLeftAlign(
            "<span class=\"stuff_bit\">", "</span>"));
    // Max theoretical length
    display("output_max_length", `${canFrame.maxLengthAfterStuffing()} bits`);
    unhide("output_list_title");
    unhide("output_list");
}

/**
 * Computes and prints all fields of a CAN frame with 11 bit ID, along with
 * their length in bits.
 * @param {CanFrame11Bit} canFrame
 */
function displayCanFrame11BitFields(canFrame) {
    let field;
    field = canFrame.field01_startOfFrame();
    display("output_can_data11_field01_len", field.length().toString());
    display("output_can_data11_field01", field.toBinString());
    display("output_can_data11_field01_hex", field.toHexString());
    field = canFrame.field02_identifier();
    display("output_can_data11_field02_len", field.length().toString());
    display("output_can_data11_field02", field.toBinStringWithSpacesRightAlign());
    display("output_can_data11_field02_hex", field.toHexString());
    field = canFrame.field03_remoteTransmissionRequest();
    display("output_can_data11_field03_len", field.length().toString());
    display("output_can_data11_field03", field.toBinString());
    display("output_can_data11_field03_hex", field.toHexString());
    field = canFrame.field04_identifierExtensionBit();
    display("output_can_data11_field04_len", field.length().toString());
    display("output_can_data11_field04", field.toBinString());
    display("output_can_data11_field04_hex", field.toHexString());
    field = canFrame.field05_reservedBit();
    display("output_can_data11_field05_len", field.length().toString());
    display("output_can_data11_field05", field.toBinString());
    display("output_can_data11_field05_hex", field.toHexString());
    field = canFrame.field06_dataLengthCode();
    display("output_can_data11_field06_len", field.length().toString());
    display("output_can_data11_field06", field.toBinString());
    display("output_can_data11_field06_hex", field.toHexString());
    field = canFrame.field07_dataField();
    display("output_can_data11_field07_len", field.length().toString());
    display("output_can_data11_field07", field.toBinStringWithSpacesRightAlign());
    display("output_can_data11_field07_hex", field.toHexString());
    field = canFrame.field08_crc();
    display("output_can_data11_field08_len", field.length().toString());
    display("output_can_data11_field08", field.toBinStringWithSpacesRightAlign());
    display("output_can_data11_field08_hex", field.toHexString());
    field = canFrame.field09_crcDelimiter();
    display("output_can_data11_field09_len", field.length().toString());
    display("output_can_data11_field09", field.toBinString());
    display("output_can_data11_field09_hex", field.toHexString());
    field = canFrame.field10_ackSlot();
    display("output_can_data11_field10_len", field.length().toString());
    display("output_can_data11_field10", field.toBinString());
    display("output_can_data11_field10_hex", field.toHexString());
    field = canFrame.field11_ackDelimiter();
    display("output_can_data11_field11_len", field.length().toString());
    display("output_can_data11_field11", field.toBinString());
    display("output_can_data11_field11_hex", field.toHexString());
    field = canFrame.field12_endOfFrame();
    display("output_can_data11_field12_len", field.length().toString());
    display("output_can_data11_field12", field.toBinStringWithSpacesRightAlign());
    display("output_can_data11_field12_hex", field.toHexString());
    field = canFrame.field13_interFrameSpace();
    display("output_can_data11_field13_len", field.length().toString());
    display("output_can_data11_field13", field.toBinString());
    display("output_can_data11_field13_hex", field.toHexString());
    unhide("output_table_title");
    unhide("output_table_data11bit");
}

/**
 * Computes and prints all fields of a CAN frame with 29 bit ID, along with
 * their length in bits.
 * @param {CanFrame29Bit} canFrame
 */
function displayCanFrame29BitFields(canFrame) {
    let field;
    field = canFrame.field01_startOfFrame();
    display("output_can_data29_field01_len", field.length().toString());
    display("output_can_data29_field01", field.toBinString());
    display("output_can_data29_field01_hex", field.toHexString());
    field = canFrame.field02_identifierPartA();
    display("output_can_data29_field02_len", field.length().toString());
    display("output_can_data29_field02", field.toBinStringWithSpacesRightAlign());
    display("output_can_data29_field02_hex", field.toHexString());
    field = canFrame.field03_substituteRemoteRequest();
    display("output_can_data29_field03_len", field.length().toString());
    display("output_can_data29_field03", field.toBinString());
    display("output_can_data29_field03_hex", field.toHexString());
    field = canFrame.field04_identifierExtensionBit();
    display("output_can_data29_field04_len", field.length().toString());
    display("output_can_data29_field04", field.toBinString());
    display("output_can_data29_field04_hex", field.toHexString());
    field = canFrame.field05_identifierPartB();
    display("output_can_data29_field05_len", field.length().toString());
    display("output_can_data29_field05", field.toBinStringWithSpacesRightAlign());
    display("output_can_data29_field05_hex", field.toHexString());
    field = canFrame.field06_remoteTransmissionRequest();
    display("output_can_data29_field06_len", field.length().toString());
    display("output_can_data29_field06", field.toBinString());
    display("output_can_data29_field06_hex", field.toHexString());
    field = canFrame.field07_reservedBit1();
    display("output_can_data29_field07_len", field.length().toString());
    display("output_can_data29_field07", field.toBinString());
    display("output_can_data29_field07_hex", field.toHexString());
    field = canFrame.field08_reservedBit0();
    display("output_can_data29_field08_len", field.length().toString());
    display("output_can_data29_field08", field.toBinString());
    display("output_can_data29_field08_hex", field.toHexString());
    field = canFrame.field09_dataLengthCode();
    display("output_can_data29_field09_len", field.length().toString());
    display("output_can_data29_field09", field.toBinString());
    display("output_can_data29_field09_hex", field.toHexString());
    field = canFrame.field10_dataField();
    display("output_can_data29_field10_len", field.length().toString());
    display("output_can_data29_field10", field.toBinStringWithSpacesRightAlign());
    display("output_can_data29_field10_hex", field.toHexString());
    field = canFrame.field11_crc();
    display("output_can_data29_field11_len", field.length().toString());
    display("output_can_data29_field11", field.toBinStringWithSpacesRightAlign());
    display("output_can_data29_field11_hex", field.toHexString());
    field = canFrame.field12_crcDelimiter();
    display("output_can_data29_field12_len", field.length().toString());
    display("output_can_data29_field12", field.toBinString());
    display("output_can_data29_field12_hex", field.toHexString());
    field = canFrame.field13_ackSlot();
    display("output_can_data29_field13_len", field.length().toString());
    display("output_can_data29_field13", field.toBinString());
    display("output_can_data29_field13_hex", field.toHexString());
    field = canFrame.field14_ackDelimiter();
    display("output_can_data29_field14_len", field.length().toString());
    display("output_can_data29_field14", field.toBinString());
    display("output_can_data29_field14_hex", field.toHexString());
    field = canFrame.field15_endOfFrame();
    display("output_can_data29_field15_len", field.length().toString());
    display("output_can_data29_field15", field.toBinStringWithSpacesRightAlign());
    display("output_can_data29_field15_hex", field.toHexString());
    field = canFrame.field16_interFrameSpace();
    display("output_can_data29_field16_len", field.length().toString());
    display("output_can_data29_field16", field.toBinString());
    display("output_can_data29_field16_hex", field.toHexString());
    unhide("output_table_title");
    unhide("output_table_data29bit");
}

/**
 * Obtains, parses and validates the user input for the CAN identifier size.
 *
 * @return {number} ID size in bits
 * @throws ValidationError in case of problems
 */
function parseCanIdentifierSizeFromInputForm() {
    const identifierSizeStr = read("input_can_identifier_bits");
    switch (identifierSizeStr) {
        case "11":
            return 11;
        case "29":
            return 29;
        default:
            // Impossible case, input was manipulated into something not
            // supported.
            throw new ValidationError(
                "Unsupported identifier size " + identifierSizeStr, Field.ID);
    }
}

/**
 * Obtains, parses and validates the user input for the CAN identifier.
 *
 * Takes care of reading the base of the value from the dropdown value
 * and clears any base prefix "0b" / "0x" from the number if it defines
 * the same base as in the dropdown menu.
 * @return {number} parsed ID
 * @throws ValidationError in case of problems
 */
function parseCanIdentifierFromInputForm() {
    // Get ID
    let identifierStr = read("input_can_identifier");
    identifierStr = identifierStr.trim().toLowerCase();
    if (identifierStr.length === 0) {
        // Empty or whitespace-only user input
        throw new ValidationError("Insert an identifier value.", Field.ID);
    }
    // Get the base of the ID
    const basePrefix = read("input_can_identifier_base");
    // Remove any existing "0x"/"0b" prefix from the identifier
    // in the cases where it makes sense.
    switch (basePrefix) {
        case "0b":
            // Binary. Strip any "0b" prefix, which defines the base again.
            // Hex prefixes are not acceptable.
            if (identifierStr.startsWith("0b")) {
                identifierStr = identifierStr.substring(2);
            } else if (identifierStr.startsWith("0x")) {
                throw new ValidationError(
                    "'0x' prefix not supported for binary input.",
                    Field.ID);
            }
            break;
        case "":
            // Decimal. Any base prefix is not acceptable
            if (identifierStr.startsWith("0b")
                || identifierStr.startsWith("0x")) {
                throw new ValidationError(
                    "'0b' or '0x' prefixes not supported for decimal input.",
                    Field.ID);

            }
            break;
        case "0x":
            // Hexadecimal. Strip any "0x" prefix, which defines the base again.
            // "0b" prefixes are acceptable, as they could be a valid part
            // of the hex number.
            if (identifierStr.startsWith("0x")) {
                identifierStr = identifierStr.substring(2);
            }
            break;
        default:
            // Impossible case, input was manipulated into something not
            // supported.
            throw new ValidationError(
                "Unsupported base prefix " + basePrefix, Field.ID);
    }
    // Prepend "0x" or "0b" to the ID to enforce its base.
    // Note: we are NOT using parseInt(), which may seem as the most logical
    // solution as it does stop at the first character that is not valid for
    // the used base. E.g. parseInt("123A", 10) returns 123. The behaviour we
    // want here is for the function to complain in case an invalid character
    // is present ANYWHERE in the string, to avoid the user thinking that their
    // input was correctly parsed. Number() does this but has no base (radix)
    // parameter, so we need to prepend "0x" or "0b" to the string to explicitly
    // state the base.
    const identifier = Number(basePrefix + identifierStr);
    if (isNaN(identifier)) {
        // Not a number: user typed other characters or words
        throw new ValidationError(
            "Invalid identifier number format.", Field.ID);
    }
    return identifier;
}

/**
 * Obtains, parses and validates the user input for the CAN Payload.
 * @return {Uint8Array} parsed payload
 * @throws ValidationError in case of problems
 */
function parseCanPayloadFromInputForm() {
    let payloadStr = read("input_can_payload");
    // Strip hex prefixes, any whitespace and some common separators
    const toStrip = /0x|[\s,]/g;
    payloadStr = payloadStr.toLowerCase().replaceAll(toStrip, "");
    if (payloadStr.length === 0) {
        // Empty or whitespace-only user input. This is an empty payload, 0 B.
        return new Uint8Array(0);
    }
    const nonHexChars = payloadStr.match(/[^0-9a-f]/g);
    if (nonHexChars !== null) {
        throw new ValidationError(
            "Illegal characters found: " + nonHexChars + ".", Field.PAYLOAD);
    }
    if (payloadStr.length % 2 !== 0) {
        throw new ValidationError(
            "Odd amount of hex characters.", Field.PAYLOAD);
    }
    // Split into array of strings of 2 characters.
    const payloadHexPairs = payloadStr.match(/../g);
    const payloadInts = payloadHexPairs.map(byteStr => parseInt(byteStr, 16));
    if (payloadInts.includes(NaN)) {
        throw new ValidationError(
            "Failed parsing of hex characters.", Field.PAYLOAD);
    }
    // Convert array of hex strings to array of bytes
    return new Uint8Array(payloadInts);
}

/**
 * Main function, triggering the construction of the CAN frame, stuffing etc.
 * and displaying all of the output fields or errors.
 */
function calculate() {
    try {
        clearErrorsAndOutputs();
        // Parse input fields
        const identifierSize = parseCanIdentifierSizeFromInputForm();
        const identifier = parseCanIdentifierFromInputForm();
        const payload = parseCanPayloadFromInputForm();
        // Pass everything to the CanOverhead library and fill output fields
        if (identifierSize === 11) {
            const canFrame = new CanFrame11Bit(identifier, payload);
            displayCanFrameWholeFrame(canFrame);
            displayCanFrame11BitFields(canFrame);
        } else if (identifierSize === 29) {
            const canFrame = new CanFrame29Bit(identifier, payload);
            displayCanFrameWholeFrame(canFrame);
            displayCanFrame29BitFields(canFrame);
        }
        // Successful conversion and output
    } catch (err) {
        if (err instanceof ValidationError) {
            switch (err.field) {
                case Field.ID:
                    displayCanIdentifierError(err.message);
                    break;
                case Field.PAYLOAD:
                    displayCanPayloadError(err.message);
                    break;
                default:
                    // Unsupported field type, programming error.
                    displayUnknownError(err);
            }
        } else {
            // Other errors, but they "should never happen".
            displayUnknownError(err);
        }
    }
}

/**
 * Runs the computation when pressing the Enter key anywhere on the page.
 * @param {KeyboardEvent} keyBoardEvent event
 * @private
 */
function _onKeyPress(keyBoardEvent) {
    if (keyBoardEvent.key === "Enter") {
        calculate();
    }
}

document.onkeydown = _onKeyPress;
