/**
 * @file This script binds the HTML+CSS UI of the calculator with the
 * CanOverhead.js library, which performs the actual computation.
 *
 * This file performs minor input sanitization and conversion from strings
 * to the required input format of the library.
 *
 * @licence BSD 3-clause license. See LICENSE.md for details.
 */

// TODO press enter to run compute

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
 * Prints a generic error message related to an invalid input.
 * @param {string} msg
 */
function displayUnknownError(msg) {
    display("input_unknown_error", msg);
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
    clear("output_can_whole_frame_stuffed");
    clear("output_max_length");
    // Clear outputs about the frame fields
    clear("output_can_field01");
    clear("output_can_field02");
    clear("output_can_field03");
    clear("output_can_field04");
    clear("output_can_field05");
    clear("output_can_field06");
    clear("output_can_field07");
    clear("output_can_field08");
    clear("output_can_field09");
    clear("output_can_field10");
    clear("output_can_field11");
    clear("output_can_field12");
    clear("output_can_field13");
}


/**
 * Computes and prints the whole CAN frame with 11 bit ID as bit sequence.
 * @param {CanFrame11Bit} canFrame
 */
function displayCanFrame11BitWholeFrame(canFrame) {
    // Without stuffing
    let bits = canFrame.wholeFrame();
    let frameAsString = `[${bits.length()} bits]<br/>`
        + bits.toBinStringWithSpacesLeftAlign();
    display("output_can_whole_frame", frameAsString);
    // With stuffing
    let bitsWithStuffs = canFrame.wholeFrameStuffed();
    let stuffBitsAmount = bitsWithStuffs.length() - bits.length();
    frameAsString = `[${bitsWithStuffs.length()} bits, `
        + `of which ${stuffBitsAmount} stuff bits]<br/>`
        + bitsWithStuffs.toBinStringWithSpacesLeftAlign();
    display("output_can_whole_frame_stuffed", frameAsString);
    // Max theoretical length
    display("output_max_length", `${canFrame.maxLengthAfterStuffing()} bits`);
}

/**
 * Computes and prints all fields of a CAN frame with 11 bit ID, along with
 * their length in bits.
 * @param {CanFrame11Bit} canFrame
 */
function displayCanFrame11BitFields(canFrame) {
    let field;
    field = canFrame.field01_startOfFrame();
    display("output_can_field01",
        `[${field.length()} bits] ${field.toBinString()}`);
    field = canFrame.field02_identifier();
    display("output_can_field02",
        `[${field.length()} bits] ${field.toBinStringWithSpacesRightAlign()}`);
    field = canFrame.field03_remoteTransmissionRequest();
    display("output_can_field03",
        `[${field.length()} bits] ${field.toBinString()}`);
    field = canFrame.field04_identifierExtensionBit();
    display("output_can_field04",
        `[${field.length()} bits] ${field.toBinString()}`);
    field = canFrame.field05_reservedBit();
    display("output_can_field05",
        `[${field.length()} bits] ${field.toBinString()}`);
    field = canFrame.field06_dataLengthCode();
    display("output_can_field06",
        `[${field.length()} bits] ${field.toBinString()}`);
    field = canFrame.field07_dataField();
    display("output_can_field07",
        `[${field.length() / 8} bytes] `
        + `${field.toBinStringWithSpacesRightAlign()}`);
    field = canFrame.field08_crc();
    display("output_can_field08",
        `[${field.length()} bits] ${field.toBinStringWithSpacesRightAlign()}`);
    field = canFrame.field09_crcDelimiter();
    display("output_can_field09",
        `[${field.length()} bits] ${field.toBinString()}`);
    field = canFrame.field10_ackSlot();
    display("output_can_field10",
        `[${field.length()} bits] ${field.toBinString()}`);
    field = canFrame.field11_ackDelimiter();
    display("output_can_field11",
        `[${field.length()} bits] ${field.toBinString()}`);
    field = canFrame.field12_endOfFrame();
    display("output_can_field12",
        `[${field.length()} bits] ${field.toBinString()}`);
    field = canFrame.field13_pauseAfterFrame();
    display("output_can_field13",
        `[${field.length()} bits] ${field.toBinString()}`);
}

/**
 * Obtains, parses and validates the user input for the CAN identifier.
 *
 * Takes care of reading the base of the value from the dropdown value
 * and clears any base prefix "0b" / "0x" from the number if it defines
 * the same base as in the dropdown menu.
 */
function parseCanIdentifierFromInputForm() {
    // Get ID
    let identifierStr = document.getElementById("input_can_identifier").value;
    identifierStr = identifierStr.trim().toLowerCase();
    if (identifierStr.length === 0) {
        // Empty or whitespace-only user input
        return null;
    }
    // Get the base of the ID
    const basePrefix =
        document.getElementById("input_can_identifier_base").value;
    // Remove any existing "0x"/"0b" prefix from the identifier
    // in the cases where it makes sense.
    switch (basePrefix) {
        case "0b":
            // Binary. Strip any "0b" prefix, which defines the base again.
            // Hex prefixes are not acceptable.
            if (identifierStr.startsWith("0b")) {
                identifierStr = identifierStr.substring(2);
            } else if (identifierStr.startsWith("0x")) {
                return null;
            }
            break;
        case "":
            // Decimal. Any base prefix is not acceptable
            if (identifierStr.startsWith("0b")
                || identifierStr.startsWith("0x")) {
                return null;
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
        return null;
    }
    return identifier;
}

/**
 * Obtains, parses and validates the user input for the CAN Payload.
 */
function parseCanPayloadFromInputForm() {
    let payloadStr = document.getElementById("input_can_payload").value;
    if (payloadStr.trim().length === 0) {
        // Empty or whitespace-only user input. This is an empty payload, 0 B.
        return new Uint8Array(0);
    }
    // Strip hex prefixes, any whitespace and some common separators
    const hexPrefixOrNonHexChars = /0[xX]|[^0-9a-fA-F]/g;
    payloadStr = payloadStr.replaceAll(hexPrefixOrNonHexChars, "");
    if (payloadStr.length % 2 !== 0) {
        return null;
    }
    // Split into strings of 2 hex characters
    payloadStr = payloadStr.match(/../g);
    // Convert array of hex strings to array of bytes
    return new Uint8Array(payloadStr.map(byteStr => parseInt(byteStr, 16)));
}

/**
 * Main function, triggering the construction of the CAN frame, stuffing etc.
 * and displaying all of the output fields or errors.
 */
function calculate() {
    try {
        clearErrorsAndOutputs();
        // Parse input fields
        const identifier = parseCanIdentifierFromInputForm();
        if (identifier === null) {
            displayCanIdentifierError(
                "Incorrect identifier format.");
            return; // Early exit
        }
        const payload = parseCanPayloadFromInputForm();
        if (payload === null) {
            displayCanPayloadError(
                "Payload must have an even amount of hex characters.");
            return; // Early exit
        }
        // Pass everything to the CanOverhead library
        try {
            let canFrame = new CanFrame11Bit(identifier, payload);
            displayCanFrame11BitWholeFrame(canFrame);
            displayCanFrame11BitFields(canFrame);
            // Successful conversion and output
        } catch (err) {
            if (err instanceof RangeError
                && err.message.startsWith("Identifier")) {
                // Error of the identifier
                displayCanIdentifierError(err.message);
            } else if (err instanceof RangeError
                && err.message.startsWith("Payload")) {
                // Error of the identifier
                displayCanPayloadError(err.message);
            }
        }
    } catch (err) {
        // Other errors, but they "should never happen".
        displayUnknownError(
            "An unexpected error occurred :( Please " +
            "<a href=\"https://github.com/Nik89/CanOverhead/issues\">" +
            "report</a> the conditions leading to your bug! " +
            "Here is some debug information: " + err.message);
        console.error(err);
    }
}
