#!/usr/bin/env python3
# coding: utf-8
import os
import shutil

BUILD_DIR = "builds"


def cleanup():
    shutil.rmtree(BUILD_DIR, ignore_errors=True)
    os.mkdir(BUILD_DIR)


def deploy():
    cleanup()


if __name__ == "__main__":
    deploy()
