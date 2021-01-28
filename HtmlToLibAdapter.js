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
// TODO use bits with spaces alighned to the left!

function clear() {
    // Clear errors
    document.getElementById("input_can_identifier_error").innerHTML = "";
    document.getElementById("input_can_payload_error").innerHTML = "";
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

function compute() {
    clear();
    // Parse input fields
    const identifierStr = document.getElementById("input_can_identifier").value;
    const identifier = Number(identifierStr);
    if (isNaN(identifier)) {
        document.getElementById("input_can_identifier_error").innerHTML = "Incorrect identifier format."; // TODO better msg
        return;
    }
    let payloadStr = document.getElementById("input_can_payload").value;
    // Strip any whitespace and some common separators
    const nonHexChars = /[^0-9a-fA-F]/g;
    payloadStr = payloadStr.replaceAll(/0[xX]/g, "").replaceAll(nonHexChars, "");
    if (payloadStr.length % 2 !== 0) {
        document.getElementById("input_can_payload_error").innerHTML = "Payload must have an even amount of hex characters.";
        return;
    }
    payloadStr = payloadStr.match(/../g);
    // Add "0x" to all bytes
    payloadStr.forEach(byteStr => byteStr = "0x" + byteStr);
    const payload = new Uint8Array(payloadStr.map(byteStr => Number(byteStr)));
    // Pass everything to the CanOverhead library
    try {
        let canFrame = new CanFrame11Bit(identifier, payload);
        // Set outputs
        document.getElementById("output_can_whole_frame").innerHTML = canFrame.wholeFrame().toBinStringWithSpaces();
        document.getElementById("output_can_whole_frame_stuffed").innerHTML = canFrame.wholeFrameStuffed().toBinStringWithSpaces();
        document.getElementById("output_can_field01").innerHTML = canFrame.field01_startOfFrame().toBinString();
        document.getElementById("output_can_field02").innerHTML = canFrame.field02_identifier().toBinStringWithSpaces();
        document.getElementById("output_can_field03").innerHTML = canFrame.field03_remoteTransmissionRequest().toBinString();
        document.getElementById("output_can_field04").innerHTML = canFrame.field04_identifierExtensionBit().toBinString();
        document.getElementById("output_can_field05").innerHTML = canFrame.field05_reservedBit().toBinString();
        document.getElementById("output_can_field06").innerHTML = canFrame.field06_dataLengthCode().toBinString();
        document.getElementById("output_can_field07").innerHTML = canFrame.field07_dataField().toBinStringWithSpaces();
        document.getElementById("output_can_field08").innerHTML = canFrame.field08_crc().toBinStringWithSpaces();
        document.getElementById("output_can_field09").innerHTML = canFrame.field09_crcDelimiter().toBinString();
        document.getElementById("output_can_field10").innerHTML = canFrame.field10_ackSlot().toBinString();
        document.getElementById("output_can_field11").innerHTML = canFrame.field11_ackDelimiter().toBinString();
        document.getElementById("output_can_field12").innerHTML = canFrame.field12_endOfFrame().toBinString();
        document.getElementById("output_can_field13").innerHTML = canFrame.field13_pauseAfterFrame().toBinString();
        // TODO add max frame length and other fields
        // TODO add amount of stuff bits added + exact length
        // TODO add estimated max length for arbitrary ID and payload?
    } catch (err) {
        if (err instanceof RangeError && err.message.startsWith("Identifier")) {
            // Error of the identifier
            document.getElementById("input_can_identifier_error").innerHTML = err.message;
        } else if (err instanceof RangeError && err.message.startsWith("Payload")) {
            // Error of the payload
            document.getElementById("input_can_payload_error").innerHTML = err.message;
        } else {
            // Other errors explode, but they should never happen.
            console.error(err);
        }
    }
}
