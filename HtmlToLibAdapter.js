/**
 * @file This script binds the HTML+CSS UI of the calculator with the
 * CanOverhead.js library, which performs the actual computation.
 *
 * This file performs minor input sanitization and conversion from strings
 * to the required input format of the library.
 *
 * @licence BSD 3-clause license. See LICENSE.md for details.
 */

let compute = () => {
    // Clear errors
    document.getElementById("input_can_identifier_error").innerHTML = "";
    document.getElementById("input_can_payload_error").innerHTML = "";
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
    /*
        // DRAFT BUT MORE COMPLETE
        // Split at any whitespace or some common separators
        const separators = /[,;'"|\s]/g;
        // "0xA, BB 0X0c" => ["0xA", "", "BB", "0X0c"]
        let bytesStrings = payloadStr.split(separators);
        // Remove empty strings from array of strings
        // ["0xA", "", "BB", "0x0c"] => ["0xA", "BB", "0x0c"]
        bytesStrings = bytesStrings.filter(byteStr => byteStr.length !== 0);
        // Add "0x" to bytes that don't have it to parse them with Number() in hex
        // ["0xA", "BB", "0X0c"] => ["0xA", "0xBB", "0X0c"]
        // If input did not have any separators, thus looks like "AABBCC", then
        // split it every 2 characters.
        bytesStrings.forEach(byteStr => {
            if (!byteStr.toLowerCase().startsWith("0x")) {
                byteStr = "0x" + byteStr;
            }
            return byteStr;
        });
        // Convert to Uint8Array
        // ["0xA", "0xBB", "0X0c"] => [10, 187, 12]
        const payload = bytesStrings =>
            new Uint8Array(bytesStrings.map(byteStr => Number(byteStr)));
    */
}
