Changelog
===============================================================================

All notable changes to this project will be documented in this file.

The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

*******************************************************************************

[1.1.0] - 2021-03-xx TODO DATE
----------------------------------------

### Added

- Support for extended frames (29-bit CAN ID) and Remote Transmission Request
  (RTR frames). The frame type can be selected as first field of the form,
  impacting the input form itself (to ask for payload or DLC field)
  and obviously the resulting output.
- Dropdown menu to select the base of the CAN ID to avoid the user typing
  "0x" or "0b".  Defaults to hex. If the user also types the prefix "0x" or "0b"
  and it matches with the selected base, then the prefix is ignored.
- Run computation when pressing Enter keyboard key.
- Highlight incorrect input fields with a red border when the computation is
  run.
- Highlight stuff bits in the output: underlined and with a different color.


### Changed

- Improved style of the following parts into a more modern look-and-feel
  - input form
  - computing button
  - whole-frame bit sequence section
  - frame fields, now provided as a table. Includes alternating row colors,
    mouseover effects and hex format column
- More verbose and detailed error messages for the various incorrect inputs.
- Improved description of input form's payload field, clarifying what is ignored
  in the user input.
- Autofocus on CAN ID input field.
- Input text fields contain examples for the user input.
- Renamed _Pause-after-frame_ field to _Inter-Frame Space_ for clairity
  and to match with other descriptions of the CAN frames found online.
- Moved error messages to one location underneath the input form.


### Fixed

- Broken links in readme to the deployed web page (missing "/" at URL end).
- Display error msg in case of empty CAN ID instead of assuming the ID == 0.
- Handle empty or whitespace-only payloads as valid input (no data).
- Footer's too small bottom margin.
- Typo in footer disclaimer.
- noscript-message about JavaScript being required is not all-h2 anymore.
  Additional styling is added for it to make it at least slightly decent
  looking.
- Display a generic error message in case of unknown and uncaught errors
  at any level in the execution of the code instead of silently doing nothing
  and crashing the app.
- Fixed non-hex payload chars being parsed into a 0 value.
- Some fields of the CAN frame did not have space separators every 4 bits.
- Fully reset the input form, clearing its content on page reload/refresh.



[1.0.0] - 2021-01-31
----------------------------------------

First version, minimum sets of features.
Classic CAN 11-bit ID supported, listing all fields, whole frame as bits pre
and post-stuffing, max worst-case theoretical frame length.

### Added

- Classic CAN with 11-bit IDs with the CAN ID and payload content known:
  - CAN ID input accepted in binary, hex and decimal format, e.g. `0b0010010`,
    `0xAA`, `42`.
  - Payload content input accepted in hex format, e.g. `AA, 0x0C...`.
  - Compute and display the whole frame as bits (header, payload, trailer)
    with format `0110 1011 1001 1000 ...` without stuff bits.
    The computation of the
    [CRC-15](https://www.can-cia.org/can-knowledge/can/crc/)
    is included in the computation of the trailer.
  - Same as previous point but with stuff bits included.
  - Compute and display the exact amount of added stuff bits.
  - Compute the size in bits of the whole frame (header, payload, trailer)
    without stuff bits.
  - Compute the size range in bits of the whole frame when taking also
    stuff bits into account (min = no stuff bits applied, max = max stuff
    bits applied for CAN ID and payload).
  - Deployment script that prepares and minifies all the files and compresses
    them in `.gz` format
