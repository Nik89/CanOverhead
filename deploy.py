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
import subprocess as sub
import glob
import sys
import gzip

import markdown

THIS_FILE_ABS_DIR = os.path.dirname(__file__)
# Force working dir to be the one where this file is
os.chdir(THIS_FILE_ABS_DIR)
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


def _shell(cmd: str) -> str:
    # TODO make it internal
    """Launches a simple shell command as a subprocess, returning its stdout."""
    return sub.run(cmd, shell=True, check=True, stdout=sub.PIPE).stdout.decode(
        'UTF-8')


def _remove_ignore_if_non_existing(filename: str):
    # TODO docstring
    try:
        os.remove(filename)
    except FileNotFoundError:
        pass


def build_dir_to_gh_pages():
    """
    Move built files to root level on the gh-pages branch.

    - Check that git status is clean
    - Git checkout gh-pages
    - Remove the following files from the project root: .editorconfig, *.html,
      *.css, *.js, *.md
    - copy the whole content of the builds dir into project root
    - commit with message "Minified and deployed ${git hash of the minified}"
    - Git checkout develop
    - No pushing performed (that must be done manually for security reasons)
    """
    if not os.path.isdir('.git'):
        raise RuntimeError("Deployment to GH Pages can only be performed "
                           "when in the repository root directory.")
    if len(_shell('git status --porcelain').strip()) > 0:
        raise RuntimeError("Git status is not clean. "
                           "Cannot deploy to GH Pages branch.")
    git_head_hash = _shell('git rev-parse HEAD').strip()
    _shell('git checkout gh-pages')
    _remove_ignore_if_non_existing('.editorconfig')
    to_remove = glob.glob('*.html')
    to_remove.extend(glob.glob('*.css'))
    to_remove.extend(glob.glob('*.js'))
    to_remove.extend(glob.glob('*.md'))
    to_remove.extend(glob.glob('*.py'))
    to_remove.extend(glob.glob('*.txt'))
    to_remove.extend(glob.glob('*.gz'))
    for file in to_remove:
        _remove_ignore_if_non_existing(file)
    for file in os.listdir(BUILD_DIR):
        shutil.copy2(os.path.join(BUILD_DIR, file), os.curdir)
    commit_msg = 'Minified and deployed commit {}'.format(git_head_hash[:10])
    _shell('git add --all')
    _shell('git commit -a -m"{}"'.format(commit_msg))
    _shell('git checkout develop')


def compress_file(input_file_name: str):
    """
    Compress input file in GZIP format
    Args:
        input_file_name: Input file path
    """
    input_file_name_in_build_dir = os.path.join(BUILD_DIR, input_file_name)
    output_file_name_in_build_dir = input_file_name_in_build_dir + '.gz'
    with open(input_file_name_in_build_dir, 'rb') as file_in,\
            gzip.open(output_file_name_in_build_dir, 'wb') as file_out:
        shutil.copyfileobj(file_in, file_out)


def build():
    # TODO docstring
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
    compress_file("index.html")
    compress_file("style.css")
    compress_file("CanOverhead.js")
    compress_file("HtmlToLibAdapter.js")
    compress_file("TestCanOverhead.js")
    compress_file("changelog.html")
    compress_file("license.html")
    compress_file("readme.html")
    compress_file("roadmap.html")


if __name__ == "__main__":
    # TODO documentation
    build()
    try:
        if sys.argv[1].strip() == '--commit':
            build_dir_to_gh_pages()
    except IndexError:
        # No main args
        pass
