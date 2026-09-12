# -*- coding: utf-8 -*-
"""
tests/conftest.py — Pytest configuration for pipeline safety test suite.
Sets up sys.path so that scratch/lib/ modules can be imported correctly.
"""
import sys
import os

# Add scratch/ to path so tests can import lib.safety, lib.md_compiler, etc.
REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
SCRATCH_DIR = os.path.join(REPO_ROOT, "scratch")

for path in [REPO_ROOT, SCRATCH_DIR]:
    if path not in sys.path:
        sys.path.insert(0, path)
