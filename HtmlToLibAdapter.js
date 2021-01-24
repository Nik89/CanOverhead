/**
 * @file This script binds the HTML+CSS UI of the calculator with the
 * CanOverhead.js library, which performs the actual computation.
 *
 * This file performs minor input sanitization and conversion from strings
 * to the required input format of the library.
 *
 * @licence BSD 3-clause license. See LICENSE.md for details.
 */

let computeV1 = () => {
    // Parse input fields
    let payloadLengthByte = parseInt(
        document.getElementById("v1-in-payload-length").value);

    if (isNaN(payloadLengthByte)
        || payloadLengthByte < 0
        || payloadLengthByte > 8) {// TODO magic numbers
        // Set error and clear existing output
        document.getElementById("v1-input-error").innerHTML = "The value should be between 0 and 8 bytes";
        document.getElementById("v1-out-frames-bits-min").innerHTML = "";
        document.getElementById("v1-out-frames-bits-max").innerHTML = "";
    } else {
        // Clear errors
        document.getElementById("v1-input-error").innerHTML = "";

        // Calculate
        let payloadLengthBit = payloadLengthByte * 8;
        let payloadLengthBitMax = BitSequence.maxLengthAfterStuffing(payloadLengthBit);

        // Set outputs
        document.getElementById("v1-out-frames-bits-min").innerHTML = payloadLengthBit;
        document.getElementById("v1-out-frames-bits-max").innerHTML = payloadLengthBitMax;
    }
}
document.getElementById("v2-in-payload").value = "1111111111000000000011111111110000000000111111111100000000001111";
let computeV2 = () => {
    // TODO inputs reading, cleanup and conversion
    // ID in hex format as a number. Examples:
    // - 1F
    // - 0x1F
    // - 0X1F
    // - 0x1f
    // - f
    // - F
    // - 0xF
    // Idea: strip "0x"/"0X", uppercase, convert to Number
    //
    // Payload in hex format as a hex string. Examples:
    // - AA
    // - 0xAA
    // - 0Xaa
    // - A
    // - AA, BB, CC
    // - 0xAA, 0xBB, 0xCC
    // (As above)
    // Idea: strip same as above, convert to Uint8Array

    // TODO pass inputs to CanOverhead.js::CanFrame11Bit
    // TODO print CanFrame11Bit method results in pretty manner

    // Parse input fields
    let identifierStr = document.getElementById("v2-in-identified").value;
    let identifier = parseInt(identifierStr, 16);
    let payloadStr = document.getElementById("v2-in-payload").value;
    let payload; // TODO convert from payloadStr (expected hex string) to Uint8Array

    try {
        let canFrame = new CanFrame11Bit(identifier, payload);
        // Clear errors
        document.getElementById("v2-input-id-error").innerHTML = "";
        document.getElementById("v2-input-pl-error").innerHTML = "";

        // Get output
        canFrame.wholeFrame();
        canFrame.wholeFrameStuffed();

        // Set outputs
        document.getElementById("v1-out-frames-bits-min").innerHTML = ""; // TODO
        document.getElementById("v1-out-frames-bits-max").innerHTML = ""; // TODO
    } catch {
        // TODO print good error messages
        // TODO clean inputs
        document.getElementById("v2-input-id-error").innerHTML = ""; // TODO depends on error
        document.getElementById("v2-input-pl-error").innerHTML = ""; // TODO depends on error
    }
}
