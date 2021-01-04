#!/usr/bin/env python3
# coding: utf-8
import os
import shutil

import markdown
import css_html_js_minify as mfy

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


def minify_html(input_file_name: str):
    """
    Minify a given HTML file into the build directory
    Args:
        input_file_name: file name of the HTML input file
    """
    output_file_name = os.path.join(BUILD_DIR, input_file_name)
    mfy.process_single_html_file(input_file_name, output_path=output_file_name)


def minify_css(input_file_name: str):
    """
    Minify a given CSS file into the build directory
    Args:
        input_file_name: file name of the CSS input file
    """
    output_file_name = os.path.join(BUILD_DIR, input_file_name)
    mfy.process_single_css_file(input_file_name, output_path=output_file_name)


def minify_js(input_file_name: str):
    """
    Minify a given JS file into the build directory
    Args:
        input_file_name: file name of the JS input file
    """
    output_file_name = os.path.join(BUILD_DIR, input_file_name)
    mfy.process_single_css_file(input_file_name, output_path=output_file_name)


def deploy():
    cleanup()
    md2html("CHANGELOG.md")
    md2html("LICENSE.md")
    md2html("README.md")
    md2html("ROADMAP.md")
    minify_html("index.html")
    minify_css("style.css")
    minify_js("CanOverhead.js")
    minify_js("test.js")


if __name__ == "__main__":
    deploy()
