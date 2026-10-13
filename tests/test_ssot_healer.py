# -*- coding: utf-8 -*-
"""
Tests for SSOT Auto-Healing Pipeline (tests/test_ssot_healer.py)
"""

import sys
import json
import subprocess
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(REPO_ROOT / "scratch"))

from lib.ssot_healer import SSOTHealer

def test_ssot_healer_run_structure():
    """驗證 SSOTHealer.run 返回結構完整性"""
    res = SSOTHealer.run(repo_root=REPO_ROOT, compact=False, quiet=True)
    assert isinstance(res, dict)
    assert res["status"] in ("clean", "healed")
    assert res["drift_exit"] == 0
    assert "steps" in res
    assert "sync_articles_db" in res["steps"]
    assert "update_breadcrumbs" in res["steps"]
    assert "audit_markdown_links" in res["steps"]
    assert "extract_ssot_entities" in res["steps"]
    assert "check_ssot_drift" in res["steps"]

def test_ssot_healer_compact_json_stdout(capsys):
    """驗證 compact 模式輸出合法 JSON 格式"""
    res = SSOTHealer.run(repo_root=REPO_ROOT, compact=True)
    captured = capsys.readouterr()
    lines = [line.strip() for line in captured.out.strip().splitlines() if line.strip()]
    assert len(lines) == 1
    data = json.loads(lines[0])
    assert data["status"] in ("clean", "healed")
    assert "fixed_count" in data
    assert data["drift_exit"] == 0

def test_manage_py_ssot_heal_cli():
    """驗證 scratch/manage.py ssot-heal CLI 命令整合與退出碼"""
    cmd = [sys.executable, str(REPO_ROOT / "scratch" / "manage.py"), "ssot-heal", "--compact"]
    proc = subprocess.run(cmd, cwd=str(REPO_ROOT), capture_output=True, text=True, encoding="utf-8")
    assert proc.returncode == 0
    raw_out = proc.stdout.strip()
    data = json.loads(raw_out)
    assert data["status"] in ("clean", "healed")
    assert data["drift_exit"] == 0

def test_hook_installer_and_cli():
    """驗證 HookInstaller 能夠正常安裝 pre-commit 鉤子"""
    from lib.hook_installer import HookInstaller
    res = HookInstaller.install(repo_root=str(REPO_ROOT), force=False)
    assert res is True
    hook_path = REPO_ROOT / ".git" / "hooks" / "pre-commit"
    assert hook_path.exists()
    content = hook_path.read_text(encoding="utf-8")
    assert "scratch/manage.py pre-commit" in content

def test_manage_py_install_hooks_cli():
    """驗證 scratch/manage.py install-hooks CLI 命令整合"""
    cmd = [sys.executable, str(REPO_ROOT / "scratch" / "manage.py"), "install-hooks"]
    proc = subprocess.run(cmd, cwd=str(REPO_ROOT), capture_output=True, text=True, encoding="utf-8")
    assert proc.returncode == 0

