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
 * Erases the text on the page displaying any error messages and any
 * output from the previous calculation.
 */
function clearErrorsAndOutputs() {
    // Clear errors
    document.getElementById("input_can_identifier_error").innerHTML = "";
    document.getElementById("input_can_payload_error").innerHTML = "";
    document.getElementById("input_unknown_error").innerHTML = "";
    // Clear outputs
    document.getElementById("output_can_whole_frame").innerHTML = "";
    document.getElementById("output_can_whole_frame_stuffed").innerHTML = "";
    document.getElementById("output_can_field01").innerHTML = "";
    document.getElementById("output_can_field02").innerHTML = "";
    document.getElementById("output_can_field03").innerHTML = "";
    document.getElementById("output_can_field04").innerHTML = "";
    document.getElementById("output_can_field05").innerHTML = "";
    document.getElementById("output_can_field06").innerHTML = "";
    document.getElementById("output_can_field07").innerHTML = "";
    document.getElementById("output_can_field08").innerHTML = "";
    document.getElementById("output_can_field09").innerHTML = "";
    document.getElementById("output_can_field10").innerHTML = "";
    document.getElementById("output_can_field11").innerHTML = "";
    document.getElementById("output_can_field12").innerHTML = "";
    document.getElementById("output_can_field13").innerHTML = "";
}

/**
 * Prints the error message related to an invalid input of the CAN identifier.
 * @param {string} msg
 */
function displayCanIdentifierError(msg) {
    document.getElementById("input_can_identifier_error").innerHTML = msg;
}

/**
 * Prints the error message related to an invalid input of the CAN payload.
 * @param {string} msg
 */
function displayCanPayloadError(msg) {
    document.getElementById("input_can_payload_error").innerHTML = msg;
}

/**
 * Prints a generic error message related to an invalid input.
 * @param {string} msg
 */
function printUnknownError(msg) {
    document.getElementById("input_unknown_error").innerHTML = msg;
}

/**
 * Computes and prints all fields of the CAN frame with 11 bit ID.
 * @param {CanFrame11Bit} canFrame
 */
function displayCanFrame11BitFields(canFrame) {
    document.getElementById("output_can_whole_frame").innerHTML =
        canFrame.wholeFrame().toBinStringWithSpacesLeftAlign();
    document.getElementById("output_can_whole_frame_stuffed").innerHTML =
        canFrame.wholeFrameStuffed().toBinStringWithSpacesLeftAlign();
    document.getElementById("output_can_field01").innerHTML =
        canFrame.field01_startOfFrame().toBinString();
    document.getElementById("output_can_field02").innerHTML =
        canFrame.field02_identifier().toBinStringWithSpacesRightAlign();
    document.getElementById("output_can_field03").innerHTML =
        canFrame.field03_remoteTransmissionRequest().toBinString();
    document.getElementById("output_can_field04").innerHTML =
        canFrame.field04_identifierExtensionBit().toBinString();
    document.getElementById("output_can_field05").innerHTML =
        canFrame.field05_reservedBit().toBinString();
    document.getElementById("output_can_field06").innerHTML =
        canFrame.field06_dataLengthCode().toBinString();
    document.getElementById("output_can_field07").innerHTML =
        canFrame.field07_dataField().toBinStringWithSpacesRightAlign();
    document.getElementById("output_can_field08").innerHTML =
        canFrame.field08_crc().toBinStringWithSpacesRightAlign();
    document.getElementById("output_can_field09").innerHTML =
        canFrame.field09_crcDelimiter().toBinString();
    document.getElementById("output_can_field10").innerHTML =
        canFrame.field10_ackSlot().toBinString();
    document.getElementById("output_can_field11").innerHTML =
        canFrame.field11_ackDelimiter().toBinString();
    document.getElementById("output_can_field12").innerHTML =
        canFrame.field12_endOfFrame().toBinString();
    document.getElementById("output_can_field13").innerHTML =
        canFrame.field13_pauseAfterFrame().toBinString();
    // TODO add max frame length and other fields
    // TODO add amount of stuff bits added + exact length
    // TODO add estimated max length for arbitrary ID and payload?
}

/**
 * Obtains, parses and validates the user input for the CAN identifier.
 */
function parseCanIdentifierFromInputForm() {
    const identifierStr =
        document.getElementById("input_can_identifier").value;
    // Parse decimal, 0x hex input and 0b binary input
    const identifier = Number(identifierStr);
    if (isNaN(identifier)) {
        return null;
    }
    return identifier;
}

/**
 * Obtains, parses and validates the user input for the CAN Payload.
 */
function parseCanPayloadFromInputForm() {
    let payloadStr = document.getElementById("input_can_payload").value;
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
    clearErrorsAndOutputs();
    // Parse input fields
    const identifier = parseCanIdentifierFromInputForm();
    if (identifier === null) {
        displayCanIdentifierError(
            "Incorrect identifier format. " +
            "The input is in base 10 by default. " +
            "For base 16, use the '0x' prefix; " +
            "for base 2 use the '0b' prefix.");
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
        } else {
            // Other errors, but they "should never happen".
            printUnknownError(
                "An unexpected error occurred :( Please " +
                "<a href=\"https://github.com/Nik89/CanOverhead/issues\">" +
                "report</a> the conditions leading to your bug!");
            console.error(err);
        }
    }
}
