Changelog
===============================================================================

All notable changes to this project will be documented in this file.

The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

*******************************************************************************

[UNRELEASED]
----------------------------------------

### Changed

- Show payload (data field) length in bytes instead of bits.
- Autofocus on CAN ID input field


### Fixed

- Broken links in readme to the deployed web page (missing "/" at URL end).



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
