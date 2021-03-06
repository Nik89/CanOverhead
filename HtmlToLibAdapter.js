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
    document.getElementById(id).style.display = 'none';
}

/**
 * Shows the previously-hidden document element.
 *
 * It's basically just syntax sugar to shorten other code lines.
 *
 * @param {string} id identifier of the element to sho
 */
function unhide(id) {
    document.getElementById(id).style.display = 'block';
}

/**
 * Prints the error message about incorrect user input.
 * @param {string} msg
 */
function displayInputFormError(msg) {
    display("input_error", msg);
}

/**
 * Prints a generic error message related to an invalid input, also logging it
 * to the console.
 * @param {Error} err
 */
function displayUnknownError(err) {
    display("input_error",
        "An unexpected error occurred :( Please " +
        "<a href=\"https://github.com/Nik89/CanOverhead/issues\">" +
        "report</a> the conditions leading to your bug! " +
        "Here is some debug information: " + err.message);
    console.error(err);
}

/**
 * Shows a red border around an input field.
 *
 * It's basically just syntax sugar to shorten other code lines.
 *
 * @param {string} id identifier of the element to highlight
 */
function highlightIncorrectInput(id) {
    document.getElementById(id).style.borderColor = "#ff3c3c";
}

/**
 * Removes the colored border around an input field, reverting the effect
 * of highlightIncorrectInput().
 *
 * It's basically just syntax sugar to shorten other code lines.
 *
 * @param {string} id identifier of the element to clear the highlight of
 */
function clearHighlight(id) {
    document.getElementById(id).style.borderColor = "";
}

/**
 * Erases the text on the page displaying any error messages and any
 * output from the previous calculation.
 */
function clearErrorsAndOutputs() {
    // Clear errors
    clear("input_error");
    clearHighlight("input_can_identifier");
    clearHighlight("input_can_payload");
    clearHighlight("input_can_dlc");
    clearHighlight("input_frame_type");
    // Clear outputs about the whole frame
    clear("output_can_whole_frame");
    clear("output_can_whole_frame_len");
    clear("output_can_whole_frame_stuffed");
    clear("output_can_whole_frame_stuffed_len");
    clear("output_max_length");
    clear("output_transfer_time");
    clear("output_overhead_no_id");
    clear("output_overhead_with_id");
    clear("output_effective_bitrate_no_id");
    clear("output_effective_bitrate_with_id");
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
 * @param {number} bitrate in bits per second
 */
function displayCanFrameWholeFrame(canFrame, bitrate) {
    // Without stuffing
    const bits = canFrame.wholeFrame();
    display("output_can_whole_frame_len", `[${bits.length()} bits]`);
    display("output_can_whole_frame", bits.toBinStringWithSpacesLeftAlign());
    // With stuffing
    const stuffedBits = canFrame.wholeFrameStuffed();
    const stuffBitsAmount = stuffedBits.length() - bits.length();
    const transferTimeSeconds = stuffedBits.length() / bitrate;
    const transferTimeStrMillis = (transferTimeSeconds * 1e3).toFixed(3);
    const dataNoId = canFrame.dataBitLength();
    const dataWithId = canFrame.dataBitLength() + canFrame.idBitLength();
    const metadataWithId = stuffedBits.length() - dataNoId;
    const metadataNoId = stuffedBits.length() - dataWithId;
        display("output_can_whole_frame_stuffed_len",
        `[${stuffedBits.length()} bits, of which `
        + `<span class="stuff_bit">${stuffBitsAmount} stuff bits</span>]`);
    display("output_can_whole_frame_stuffed",
        stuffedBits.toBinStringWithSpacesLeftAlign(
            "<span class=\"stuff_bit\">", "</span>"));
    // Max theoretical length
    display("output_max_length", `${canFrame.maxLengthAfterStuffing()} bits`);
    display("output_transfer_time", `${transferTimeStrMillis} ms`);
    display("output_overhead_no_id", `Data (just payload): ${dataNoId.toString().padStart(2)} bits. Metadata: ${metadataWithId.toString().padStart(2)} bits = ${overheadPercentageStr(dataNoId, metadataWithId)}% of frame`);
    display("output_overhead_with_id", `Data (ID + payload): ${dataWithId.toString().padStart(2)} bits. Metadata: ${metadataNoId.toString().padStart(2)} bits = ${overheadPercentageStr(dataWithId, metadataNoId)}% of frame`);
    display("output_effective_bitrate_no_id", `Data (just payload): ${effectiveBitrateKbpsStr(dataNoId, transferTimeSeconds)} kbit/s`);
    display("output_effective_bitrate_with_id", `Data (ID + payload): ${effectiveBitrateKbpsStr(dataWithId, transferTimeSeconds)} kbit/s`);
    unhide("output_list_title");
    unhide("output_list");
    unhide("output_transfer_time");
    unhide("output_overhead_no_id");
    unhide("output_overhead_with_id");
    unhide("output_effective_bitrate_no_id");
    unhide("output_effective_bitrate_with_id");
}

function overheadPercentageStr(data, metadata) {
    const overhead = metadata / (data + metadata);
    return (overhead * 100).toFixed(2).padStart(6);
}

function effectiveBitrateKbpsStr(data, transferTimeSeconds) {
    const dataEffectiveBitrate = data / transferTimeSeconds;
    return (dataEffectiveBitrate / 1e3).toFixed(3).padStart(8);
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
 * Obtains, parses and validates the user input for the bitrate.
 *
 * @return {number} bitrate in bits per second
 * @throws ValidationError in case of problems
 */
function parseCanFrameBitrateFromInputForm() {
    const bitrateStr = read("input_can_bitrate").trim().toLowerCase();
    if (bitrateStr.length === 0) {
        throw new ValidationError("Empty bitrate", Field.BITRATE);
    }
    if (bitrateStr.startsWith("0x")
        || bitrateStr.startsWith("0b")
        || bitrateStr.startsWith("0o")) {
        throw new ValidationError(
            "Bitrate can be expressed only in base 10. Found: " + bitrateStr,
            Field.BITRATE);
    }
    const bitrate = Number(bitrateStr);
    if (isNaN(bitrate)) {
        throw new ValidationError(
            "Incorrect bitrate format. Cannot be parsed. Found: " + bitrateStr,
            Field.BITRATE);
    }
    return bitrate;
}

/**
 * Obtains, parses and validates the user input for the frame type value.
 *
 * @return {string} frame type
 * @throws ValidationError in case of problems
 */
function parseCanFrameTypeFromInputForm() {
    const typeStr = read("input_frame_type");
    switch (typeStr) {
        case "can_data11":
        case "can_data29":
        case "can_rtr11":
        case "can_rtr29":
            return typeStr;
        case "canfd_data11":
        case "canfd_data29":
        default:
            // Impossible case, input was manipulated into something not
            // supported.
            throw new ValidationError(
                "Unsupported frame type " + typeStr, Field.TYPE);
    }
}

/**
 * Obtains, parses and validates the user input for the DLC value.
 *
 * @return {number} DLC value
 * @throws ValidationError in case of problems
 */
function parseCanDlcFromInputForm() {
    const dlcStr = read("input_can_dlc").trim();
    // While a switch-case may seem a stupid way to validate an input being
    // an integer in [0, 8] in string format, using proper string validation
    // results in more complex and harder to debug code: the input string must
    // be converted to integer properly but
    // - parseInt() does not do a proper job, see comments in
    //   parseCanIdentifierFromInputForm()
    // - "012345678".indexOf(dlcStr) does not provide proper results for
    //   dlcStr being "" or being a multi-character substring such as "23".
    // So, as the possible inputs are only 9, it's just easier to hardcode
    // a short switch-case and call it a day.
    switch (dlcStr) {
        case "0":
            return 0;
        case "1":
            return 1;
        case "2":
            return 2;
        case "3":
            return 3;
        case "4":
            return 4;
        case "5":
            return 5;
        case "6":
            return 6;
        case "7":
            return 7;
        case "8":
            return 8;
        default :
            // Impossible case, input was manipulated into something not
            // supported.
            throw new ValidationError(
                "Unsupported DLC value " + dlcStr, Field.DLC);
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
 * Hides the CAN DLC input field and shows the Payload input field
 */
function displayInputFormForDataFrame() {
    hide("input_can_dlc_block");
    unhide("input_can_payload_block");
}

/**
 * Hides the CAN Paylaod input field and shows the DLC input field.
 */
function displayInputFormForRtrFrame() {
    hide("input_can_payload_block");
    unhide("input_can_dlc_block");
}

/**
 * Forces the input form back again to the initial content, as when the page
 * was initially filled.
 *
 * - frame type back to the default one (Base data frame)
 * - DLC back to the default one (0 bytes)
 * - identifier and payload cleared.
 *
 * This function is required as reloading the page in some browsers is not
 * enough to clear the input form. Additionally for dropdown menus,
 * having the "selected" option in HTML is not enough for
 * Firefox to reset the dropdown menu to that specific entry of the menu
 * when the page is reloaded. This leads to bugs in displaying of the
 * input form, where the CAN Payload input field is shown, but the dropdown
 * menu is still stuck on the RTR frame types, so a forced reset is required.
 */
function resetInputForm() {
    document.getElementById("input_frame_type").selectedIndex = 0;
    document.getElementById("input_can_identifier").value = "";
    document.getElementById("input_can_identifier_base").selectedIndex = 1;
    document.getElementById("input_can_payload").value = "";
    document.getElementById("input_can_dlc").selectedIndex = 0;
    document.getElementById("input_can_bitrate").selectedIndex = 6;
}

function alterInputFormOnFrameTypeChange(dropdown) {
    clearErrorsAndOutputs();
    switch (dropdown.value) {
        case "can_data11":
        case "can_data29":
        case "canfd_data11":
        case "canfd_data29":
            displayInputFormForDataFrame();
            break;
        case "can_rtr11":
        case "can_rtr29":
            displayInputFormForRtrFrame();
            break;
        default:
            // Impossible case, input was manipulated into something
            // not supported.
            let err = new ValidationError(
                "Unsupported frame type " + dropdown.value, Field.TYPE);
            displayUnknownError(err);
    }
}

/**
 * Main function, triggering the construction of the CAN frame, stuffing etc.
 * and displaying all of the output fields or errors.
 */
function calculate() {
    try {
        clearErrorsAndOutputs();
        // Parse input fields
        const frameType = parseCanFrameTypeFromInputForm();
        const identifier = parseCanIdentifierFromInputForm();
        const bitrate = parseCanFrameBitrateFromInputForm();
        let canFrame;
        let payload = null;
        let dlc = null;
        switch (frameType) {
            case "can_data11":
                payload = parseCanPayloadFromInputForm();
                canFrame = new CanFrame11Bit(identifier, payload, dlc);
                displayCanFrame11BitFields(canFrame);
                break;
            case "can_data29":
                payload = parseCanPayloadFromInputForm();
                canFrame = new CanFrame29Bit(identifier, payload, dlc);
                displayCanFrame29BitFields(canFrame);
                break;
            case "can_rtr11":
                dlc = parseCanDlcFromInputForm();
                canFrame = new CanFrame11Bit(identifier, payload, dlc);
                displayCanFrame11BitFields(canFrame);
                break;
            case "can_rtr29":
                dlc = parseCanDlcFromInputForm();
                canFrame = new CanFrame29Bit(identifier, payload, dlc);
                displayCanFrame29BitFields(canFrame);
                break;
            default:
                // Impossible case, probably bad programming.
                let err = new ValidationError(
                    "Unsupported frame type: " + frameType, Field.DLC);
                displayUnknownError(err)
        }
        displayCanFrameWholeFrame(canFrame, bitrate);
        // Successful conversion and output
    } catch (err) {
        displayError(err);
    }
}

/**
 * Displays the message of an exception to the user nicely, highlighting the
 * failing input field.
 *
 * @param {ValidationError} err to display
 */
function displayError(err) {
    if (err instanceof ValidationError) {
        switch (err.field) {
            case Field.ID:
                highlightIncorrectInput("input_can_identifier");
                displayInputFormError(err.message);
                break;
            case Field.PAYLOAD:
                highlightIncorrectInput("input_can_payload");
                displayInputFormError(err.message);
                break;
            case Field.DLC:
                highlightIncorrectInput("input_can_dlc");
                displayInputFormError(err.message);
                break;
            case Field.TYPE:
                highlightIncorrectInput("input_frame_type");
                displayInputFormError(err.message);
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

/**
 * Runs the computation when pressing the Enter key anywhere on the page.
 * @param {KeyboardEvent} keyBoardEvent event
 * @private
 */
function onKeyPress(keyBoardEvent) {
    if (keyBoardEvent.key === "Enter") {
        calculate();
    }
}

/* On page load. */
document.onkeydown = onKeyPress;
resetInputForm();
