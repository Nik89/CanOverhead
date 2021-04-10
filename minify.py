#!/usr/bin/env python3
# coding: utf-8
#
# Published under the terms of the BSD 3-Clause license. See LICENSE.md for
# details.

"""
Deployment script to prepare the web pages of CanOverhead project
to be published on the GitHub pages.

What it does:
1. Creates a "builds/" directory next to this file, deleting any previous one.
   Our ready-for-production web pages will end up here.
2. Converts markdown files to HTML. No CSS is being added, but it's still
   nicer than reading txt files in the browser. Outputs the html files
   in the build directory.
3. Minifies the HTML, CSS and JS files, outputting them into the build
   directory.
4. Inlines the CSS and JS files into the HTML file to have a single output
   file, easier to deploy and/or send around (e.g. email attachment).
   It's also simpler to download from a static server.
"""

import os
import re
import shutil

import markdown
import requests

THIS_FILE_ABS_DIR = os.path.dirname(__file__)
# Force working dir to be the one where this file is,
# allowing us to create the output directory next to this file instead of
# where the file is called from.
os.chdir(THIS_FILE_ABS_DIR)
BUILD_DIR = os.path.join(THIS_FILE_ABS_DIR, "docs")


def cleanup():
    """Removes all files in the build directory, creating it if necessary"""
    shutil.rmtree(BUILD_DIR, ignore_errors=True)
    os.mkdir(BUILD_DIR)


def md2html(input_file_name: str):
    """
    Converts a given Markdown file into an HTML file into the build directory
    Args:
        input_file_name: file name of the MD input file
    """
    output_file_name = input_file_name.lower().rsplit(".", maxsplit=1)[0]
    output_file_name += ".html"
    output_file_name = os.path.join(BUILD_DIR, output_file_name)
    markdown.markdownFromFile(input=input_file_name, output=output_file_name,
                              encoding="UTF-8", output_format="html",
                              tab_length=2)


def prepend_comment_in_index_file():
    """Prepend some comment lines in index.html file"""
    filename = os.path.join(BUILD_DIR, "index.html")
    line = ("<!-- Oh hi there! If you want to see the "
            "non-minified source code, check\n"
            "the project GitHub repository: "
            "https://github.com/Nik89/CanOverhead -->\n")
    with open(filename, 'r+', encoding="UTF-8") as file:
        content = file.read()
        file.seek(0)
        file.write(line + content)


def minify_html(input_file_name: str):
    """
    Minify a given HTML file into the build directory
    Args:
        input_file_name: file name of the HTML input file
    """
    _minify(input_file_name, 'https://html-minifier.com/raw')


def minify_css(input_file_name: str):
    """
    Minify a given CSS file into the build directory
    Args:
        input_file_name: file name of the CSS input file
    """
    _minify(input_file_name, 'https://cssminifier.com/raw')


def minify_js(input_file_name: str):
    """
    Minify a given JS file into the build directory
    Args:
        input_file_name: file name of the JS input file
    """
    _minify(input_file_name, 'https://javascript-minifier.com/raw')


def _minify(input_file_name: str, web_api_url: str) -> None:
    """
    Minify a given file into the build directory using the given
    web API.
    Args:
        input_file_name: file name of the JS input file
        web_api_url: URL of the compression web API
    """
    output_file_name = os.path.join(BUILD_DIR, input_file_name)
    file_content = open(input_file_name, mode='rb').read()
    response = requests.post(web_api_url, data={'input': file_content})
    minified = response.text
    if minified.startswith('// Error'):
        raise RuntimeError(
            'File cannot be compressed correctly:\n' + minified)
    open(output_file_name, "w", encoding="UTF-8").write(minified)


def inline_js_and_css_into_html(html_file_name: str) -> None:
    """Inline the .css files found in the <link> tags
    and inline the .js files found in <script> tags
    into the html file in-place to combine them into a single file."""
    html_file_name = os.path.join(BUILD_DIR, html_file_name)
    html = open(html_file_name).readlines()
    inlined = []
    for line in html:
        if '<link' in line and 'stylesheet' in line:
            css_file = re.search(r'[a-zA-Z0-9_.]+\.css', line)
            if css_file is None:
                raise RuntimeError("Can't extract CSS file name from HTML.")
            css_file = os.path.join(BUILD_DIR, css_file.group(0))
            inlined.append('<style>' + open(css_file).read() + '</style>\n')
            os.remove(css_file)
        elif '<script' in line:
            js_file = re.search(r'[a-zA-Z0-9_.]+\.js', line)
            if js_file is None:
                raise RuntimeError("Can't extract JS file name from HTML.")
            js_file = os.path.join(BUILD_DIR, js_file.group(0))
            inlined.append('<script>' + open(js_file).read() + '</script>\n')
            os.remove(js_file)
        else:
            inlined.append(line)
    open(html_file_name, 'w').writelines(inlined)


def build():
    """Converts the Markdown files in the repo to html, minifies the html,
    css and js files, inlines them into a single html file and provides all
    of the results in the builds directory, ready to be deployed."""
    cleanup()
    md2html("CHANGELOG.md")
    md2html("LICENSE.md")
    md2html("README.md")
    md2html("ROADMAP.md")
    # Note: minifying first, then inlining, as it's much easier to scan
    # a minified index.html file; additionally the HTML minifier does not
    # properly minify inlined CSS and JS, so we minify them separately
    # and then perform the inlining.
    minify_html("index.html")
    minify_css("style.css")
    minify_js("CanOverhead.js")
    minify_js("HtmlToLibAdapter.js")
    minify_js("TestCanOverhead.js")
    inline_js_and_css_into_html("index.html")
    prepend_comment_in_index_file()


if __name__ == "__main__":
    build()
