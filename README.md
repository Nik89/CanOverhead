CAN bus overhead, stuff bits and effective bitrate calculator
===============================================================================

### [Click here to try it in your browser!](https://nik89.github.io/CanOverhead/)

The [CAN bus](https://en.wikipedia.org/wiki/CAN_bus)
is a robust communication bus and protocol used in vehicle,
allowing frames with 11 or 29-bit identifiers in the header and payload sizes
of up to 8 bytes for classic CAN and up to 64 for the
[CAN FD](https://en.m.wikipedia.org/wiki/CAN_FD) variant.

This JavaScript in-browser calculator helps you compute:

- the overhead of a frame in space: size of header and trailer
- the stuff bits: these are bits injected after each streak of 5 bits
- the effective bitrate: compute the transfer speed and time of your data taking
  into account also the time it takes to transfer the frame overhead.


Usage
---------------------------------------

Head over to the
[**website of the calculator**](https://nik89.github.io/CanOverhead/)
to use it. Simple as that! The calculator has no backend server, works only
in your browser locally, no data is transferred. You can verify this by
setting your browser to stay offline after loading the page and our calculator
still operates! In Firefox: _File > Work Offline_.

A more development-oriented way of using it, is to download or clone the
repository and simply open the `index.html` in your favourite browser.
