# -*- coding: utf-8 -*-
"""
tests/test_safety.py — Unit tests for scratch/lib/safety.py
Covers: get_managed_state, is_writable, is_appendable,
        get_freeze_zones, is_in_freeze_zone, content_hash, DryRunContext
"""
import pytest
from lib.safety import (
    get_managed_state,
    is_writable,
    is_appendable,
    get_freeze_zones,
    is_in_freeze_zone,
    content_hash,
    DryRunContext,
    MANAGED_AUTO,
    MANAGED_HUMAN,
    MANAGED_APPEND_ONLY,
    DEFAULT_HUMAN_IDS,
    DEFAULT_APPEND_IDS,
)


# ---- Helper ----

class MockTag:
    """Minimal BeautifulSoup Tag-like mock for testing."""
    def __init__(self, attrs: dict):
        self._attrs = attrs

    def get(self, key: str, default: str = "") -> str:
        return self._attrs.get(key, default)


# ---- Tests: get_managed_state ----

class TestGetManagedState:
    def test_explicit_human_attr(self):
        tag = MockTag({"data-managed": "human"})
        assert get_managed_state(tag) == MANAGED_HUMAN

    def test_explicit_auto_attr(self):
        tag = MockTag({"data-managed": "auto"})
        assert get_managed_state(tag) == MANAGED_AUTO

    def test_explicit_append_only_attr(self):
        tag = MockTag({"data-managed": "append-only"})
        assert get_managed_state(tag) == MANAGED_APPEND_ONLY

    def test_fallback_human_by_id(self):
        for hid in DEFAULT_HUMAN_IDS:
            tag = MockTag({"id": hid})
            assert get_managed_state(tag) == MANAGED_HUMAN, f"Failed for id={hid}"

    def test_fallback_append_by_id(self):
        for aid in DEFAULT_APPEND_IDS:
            tag = MockTag({"id": aid})
            assert get_managed_state(tag) == MANAGED_APPEND_ONLY, f"Failed for id={aid}"

    def test_fallback_auto_for_unknown_id(self):
        tag = MockTag({"id": "some-random-container"})
        assert get_managed_state(tag) == MANAGED_AUTO

    def test_explicit_attr_overrides_fallback(self):
        # Even if ID is in DEFAULT_HUMAN_IDS, explicit attr=auto should win
        tag = MockTag({"id": "mason-yang-observation", "data-managed": "auto"})
        assert get_managed_state(tag) == MANAGED_AUTO


# ---- Tests: is_writable ----

class TestIsWritable:
    def test_human_node_is_not_writable(self, capsys):
        tag = MockTag({"id": "mason-yang-observation"})
        result = is_writable(tag, "test_script")
        assert result is False
        captured = capsys.readouterr()
        assert "SKIP" in captured.out
        assert "human" in captured.out

    def test_auto_node_is_writable(self):
        tag = MockTag({"id": "toc-desktop-host"})
        assert is_writable(tag, "test_script") is True

    def test_append_only_node_is_writable(self):
        """append-only nodes can be written to (caller controls the append boundary)."""
        tag = MockTag({"id": "related-articles-container"})
        assert is_writable(tag, "test_script") is True


# ---- Tests: is_appendable ----

class TestIsAppendable:
    def test_human_node_is_not_appendable(self, capsys):
        tag = MockTag({"id": "article-analysis-header"})
        result = is_appendable(tag, "test_script")
        assert result is False

    def test_append_only_node_is_appendable(self):
        tag = MockTag({"id": "related-articles-container"})
        assert is_appendable(tag, "test_script") is True


# ---- Tests: Freeze Zone ----

class TestFreezeZones:
    HTML_WITH_ONE_ZONE = (
        "before content "
        "<!-- @AGENT-LOCK:START reason=\"test\" --> protected content <!-- @AGENT-LOCK:END --> "
        "after content"
    )

    def test_detects_single_zone(self):
        zones = get_freeze_zones(self.HTML_WITH_ONE_ZONE)
        assert len(zones) == 1

    def test_position_inside_zone(self):
        zones = get_freeze_zones(self.HTML_WITH_ONE_ZONE)
        start, end = zones[0]
        mid = (start + end) // 2
        assert is_in_freeze_zone(mid, zones) is True

    def test_position_outside_zone(self):
        zones = get_freeze_zones(self.HTML_WITH_ONE_ZONE)
        assert is_in_freeze_zone(0, zones) is False
        assert is_in_freeze_zone(len(self.HTML_WITH_ONE_ZONE) - 1, zones) is False

    def test_no_zones_in_clean_html(self):
        zones = get_freeze_zones("<p>No freeze zones here</p>")
        assert len(zones) == 0

    def test_multiple_zones(self):
        html = (
            "<!-- @AGENT-LOCK:START --> zone1 <!-- @AGENT-LOCK:END --> "
            "middle "
            "<!-- @AGENT-LOCK:START --> zone2 <!-- @AGENT-LOCK:END -->"
        )
        zones = get_freeze_zones(html)
        assert len(zones) == 2

    def test_unclosed_zone_locks_to_end(self):
        html = "<!-- @AGENT-LOCK:START --> no closing tag here"
        zones = get_freeze_zones(html)
        assert len(zones) == 1
        _, end = zones[0]
        assert end == len(html)


# ---- Tests: content_hash ----

class TestContentHash:
    def test_same_input_same_hash(self):
        assert content_hash("hello") == content_hash("hello")

    def test_different_input_different_hash(self):
        assert content_hash("hello") != content_hash("world")

    def test_hash_is_12_chars(self):
        assert len(content_hash("any text here")) == 12

    def test_empty_string(self):
        h = content_hash("")
        assert len(h) == 12


# ---- Tests: DryRunContext ----

class TestDryRunContext:
    def test_plan_count(self):
        ctx = DryRunContext(dry_run=True)
        assert ctx.plan_count() == 0
        ctx.plan("replace", node_id="toc")
        assert ctx.plan_count() == 1

    def test_has_plans(self):
        ctx = DryRunContext(dry_run=True)
        assert ctx.has_plans() is False
        ctx.plan("inject", node_id="section-5w1h-core", detail="test")
        assert ctx.has_plans() is True

    def test_print_summary_shows_plan_count(self, capsys):
        ctx = DryRunContext(dry_run=True)
        ctx.plan("replace", node_id="toc", before="old toc", after="new toc")
        ctx.plan("append", node_id="related-articles-container", detail="3 cards")
        ctx.print_summary("test_script")
        captured = capsys.readouterr()
        assert "2 planned change(s)" in captured.out
        assert "DRY-RUN" in captured.out

    def test_long_content_truncated(self):
        ctx = DryRunContext(dry_run=True)
        long_text = "x" * 200
        ctx.plan("replace", node_id="test", before=long_text, after=long_text)
        plan = ctx._plans[0]
        assert plan["before"].endswith("...")
        assert len(plan["before"]) <= 83  # 80 chars + "..."

    def test_dry_run_false_still_tracks_plans(self):
        """DryRunContext with dry_run=False still allows plan() calls (for future audit log use)."""
        ctx = DryRunContext(dry_run=False)
        ctx.plan("replace", node_id="toc")
        assert ctx.plan_count() == 1
