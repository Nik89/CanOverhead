#!/usr/bin/env python3
# coding: utf-8
import os
import shutil

import markdown

THIS_FILE_ABS_DIR = os.path.dirname(__file__)
BUILD_DIR = os.path.join(THIS_FILE_ABS_DIR, "builds")


def cleanup():
    """Removes all files in the build directory, creating it if necessary"""
    shutil.rmtree(BUILD_DIR, ignore_errors=True)
    os.mkdir(BUILD_DIR)


def md2html(input_file_name: str):
    output_file_name = input_file_name.lower().rsplit(".", maxsplit=1)[0]
    output_file_name += ".html"
    output_file_name = os.path.join(BUILD_DIR, output_file_name)
    markdown.markdownFromFile(input=input_file_name, output=output_file_name,
                              encoding="UTF-8", output_format="html")


def deploy():
    cleanup()
    md2html("CHANGELOG.md")
    md2html("LICENSE.md")
    md2html("README.md")
    md2html("ROADMAP.md")


if __name__ == "__main__":
    deploy()
