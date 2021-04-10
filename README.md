CAN bus overhead, stuff bits and effective bitrate calculator
===============================================================================

### [Click to use it in your browser!](https://nik89.github.io/CanOverhead/)

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

### Online

Head over to the
[**website of the calculator**](https://nik89.github.io/CanOverhead/)
to use it. Simple as that!


### Locally

You can also directly download the page and use it in any modern browser,
also offline. **Right-click** on the
[website link](https://nik89.github.io/CanOverhead/)
and choose _"Save as..."_ to download the `index.html` page. Rename it
as you please.

We also make the same file available in the
[releases on GitHub](https://github.com/Nik89/CanOverhead/releases).



Privacy
---------------------------------------

The calculator has no backend server, works in your browser locally,
no data is transferred anywhere. If you are paranoid,
you can also use it after setting your browser to stay offline (in Firefox:
_File > Work Offline_) after loading the page and the calculator still operates
- completely disconnecting the computer from the internet also works.

Also: it does not use any cookies.



Compilation
---------------------------------------

The calculator is a set of HTML+CSS+JS files, so it does not need actual
compilation to work. You can simply download or clone the repository and
open the `index.html` file in your favourite browser for it to work
(except some URLs to license, changelog etc. may be broken).

To minify and merge all HTML, CSS and JS files into a single `index.html`
the Python3 script `minify.py` must be run. This will generate the compact
all-in-one `index.html` in the `minified` directory.
You will need some dependencies to run the script, so be sure to run
the following:
```
pip install -r requirements.txt
```
We recommend using a
[virtual environment](https://docs.python.org/3/tutorial/venv.html).
