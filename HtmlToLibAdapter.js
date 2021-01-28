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

function displayCanIdentifierError(msg) {
    document.getElementById("input_can_identifier_error").innerHTML = msg;
}

function displayPayloadError(msg) {
    document.getElementById("input_can_payload_error").innerHTML = msg;
}

function printUnknownError(msg) {
    document.getElementById("input_unknown_error").innerHTML = msg;
}

function displayCanFrame11BitFields(canFrame) {
    // TODO use bits with spaces aligned to the left!
    document.getElementById("output_can_whole_frame").innerHTML = canFrame.wholeFrame().toBinStringWithSpacesLeftAlign();
    document.getElementById("output_can_whole_frame_stuffed").innerHTML = canFrame.wholeFrameStuffed().toBinStringWithSpacesLeftAlign();
    document.getElementById("output_can_field01").innerHTML = canFrame.field01_startOfFrame().toBinString();
    document.getElementById("output_can_field02").innerHTML = canFrame.field02_identifier().toBinStringWithSpacesRightAlign();
    document.getElementById("output_can_field03").innerHTML = canFrame.field03_remoteTransmissionRequest().toBinString();
    document.getElementById("output_can_field04").innerHTML = canFrame.field04_identifierExtensionBit().toBinString();
    document.getElementById("output_can_field05").innerHTML = canFrame.field05_reservedBit().toBinString();
    document.getElementById("output_can_field06").innerHTML = canFrame.field06_dataLengthCode().toBinString();
    document.getElementById("output_can_field07").innerHTML = canFrame.field07_dataField().toBinStringWithSpacesRightAlign();
    document.getElementById("output_can_field08").innerHTML = canFrame.field08_crc().toBinStringWithSpacesRightAlign();
    document.getElementById("output_can_field09").innerHTML = canFrame.field09_crcDelimiter().toBinString();
    document.getElementById("output_can_field10").innerHTML = canFrame.field10_ackSlot().toBinString();
    document.getElementById("output_can_field11").innerHTML = canFrame.field11_ackDelimiter().toBinString();
    document.getElementById("output_can_field12").innerHTML = canFrame.field12_endOfFrame().toBinString();
    document.getElementById("output_can_field13").innerHTML = canFrame.field13_pauseAfterFrame().toBinString();
    // TODO add max frame length and other fields
    // TODO add amount of stuff bits added + exact length
    // TODO add estimated max length for arbitrary ID and payload?
}

function parseCanIdentifierFromInputForm() {
    const identifierStr = document.getElementById("input_can_identifier").value;
    // Parse decimal, 0x hex input and 0b binary input
    const identifier = Number(identifierStr);
    if (isNaN(identifier)) {
        return null;
    }
    return identifier;
}

function parsePayloadFromInputForm() {
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

function calculate() {
    clearErrorsAndOutputs();
    // Parse input fields
    const identifier = parseCanIdentifierFromInputForm();
    if (identifier === null) {
        displayCanIdentifierError("Incorrect identifier format."); // TODO better msg
        return;
    }
    const payload = parsePayloadFromInputForm();
    if (payload === null) {
        displayPayloadError("Payload must have an even amount of hex characters.");
        return;
    }
    // Pass everything to the CanOverhead library
    try {
        // Successful conversion and output
        let canFrame = new CanFrame11Bit(identifier, payload);
        displayCanFrame11BitFields(canFrame);
    } catch (err) {
        //
        if (err instanceof RangeError && err.message.startsWith("Identifier")) {
            // Error of the identifier
            displayCanIdentifierError(err.message);
        } else if (err instanceof RangeError && err.message.startsWith("Payload")) {
            // Error of the identifier
            displayPayloadError(err.message);
        } else {
            // Other errors, but they "should never happen".
            printUnknownError("An unexpected error occurred :( Please <a href=\"https://github.com/Nik89/CanOverhead/issues\">report</a> the conditions leading to your bug!");
            console.error(err);
        }
    }
}
