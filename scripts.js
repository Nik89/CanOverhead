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
    // Parse input fields
    let identifierStr = document.getElementById("v2-in-identified").value;
    let payloadStr = document.getElementById("v2-in-payload").value;

    if (identifierStr !== 11) {
        // Set error and clear existing output
        document.getElementById("v2-input-id-error").innerHTML = "The identifier should be of 11 bits";
        //document.getElementById("").innerHTML = "";
        //document.getElementById("").innerHTML = "";
    } else if (payloadStr > 64 || (payloadStr % 8 !== 0)) {
        // Set error and clear existing output
        document.getElementById("v2-input-pl-error").innerHTML = "Payload should be less than 64 bits and should be N bites long";
    } else {
        // Clear errors
        document.getElementById("v2-input-id-error").innerHTML = "";
        document.getElementById("v2-input-pl-error").innerHTML = "";

        // Calculate
        let payloadLengthBit = payloadLengthByte * 8;
        let payloadLengthBitMax = BitSequence.maxLengthAfterStuffing(payloadLengthBit);

        // Set outputs
        document.getElementById("v1-out-frames-bits-min").innerHTML = payloadLengthBit;
        document.getElementById("v1-out-frames-bits-max").innerHTML = payloadLengthBitMax;
    }
}