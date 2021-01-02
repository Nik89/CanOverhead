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
