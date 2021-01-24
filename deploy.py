#!/usr/bin/env python3
# coding: utf-8
#
# Deployment script to prepare the web pages of CanOverhead project
# to be published on the GitHub pages.
#
# What it does:
# 1. Creates a "builds/" directory next to this file, deleting any previous one.
#    Our ready-for-production web pages will end up here.
# 2. Converts markdown files to HTML. No CSS is being added, but it's still
#    nicer than reading txt files in the browser. Outputs the html files
#    in the build directory.
# 3. Minifies the HTML, CSS and JS files, outputting them into the buil
#    directory.
#
# Published under the terms of the BSD 3-Clause license. See LICENSE.md for
# details.

import os
import requests
import shutil

import markdown

THIS_FILE_ABS_DIR = os.path.dirname(__file__)
BUILD_DIR = os.path.join(THIS_FILE_ABS_DIR, "builds")


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
                              encoding="UTF-8", output_format="html")


def prepend_comment_in_index_file():
    """
    Prepend some comment lines in index.html file
    """
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


def deploy():
    cleanup()
    md2html("CHANGELOG.md")
    md2html("LICENSE.md")
    md2html("README.md")
    md2html("ROADMAP.md")
    minify_html("index.html")
    minify_css("style.css")
    minify_js("CanOverhead.js")
    minify_js("HtmlToLibAdapter.js")
    minify_js("TestCanOverhead.js")
    prepend_comment_in_index_file()


if __name__ == "__main__":
    deploy()
