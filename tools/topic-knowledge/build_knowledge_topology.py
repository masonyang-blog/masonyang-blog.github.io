#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Graphify AST Topology & Integrity Checker for Topic Knowledge
Saved under tools/topic-knowledge/
"""

import os
import json
import re

WORKSPACE_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
DATA_JS_PATH = os.path.join(WORKSPACE_ROOT, "assets", "js", "app-knowledge-data.js")
OUTPUT_JSON_PATH = os.path.join(WORKSPACE_ROOT, "assets", "data", "knowledge-graph-topology.json")

def extract_knowledge_data():
    if not os.path.exists(DATA_JS_PATH):
        print(f"[Error] File not found: {DATA_JS_PATH}")
        return None, None

    with open(DATA_JS_PATH, "r", encoding="utf-8") as f:
        content = f.read()

    # Extract _knowledgeData items
    items = []
    matches = re.findall(r"\{\s*id:\s*['\"]([^'\"]+)['\"].*?title:\s*['\"]([^'\"]+)['\"]", content, re.DOTALL)
    print(f"[Info] Parsed {len(matches)} items from {DATA_JS_PATH}")
    return matches

def main():
    print("=== Graphify Knowledge Topology Build Tool ===")
    items = extract_knowledge_data()
    if items:
        nodes = []
        for item_id, title in items:
            nodes.append({
                "id": item_id,
                "label": title,
                "type": "Concept"
            })
        
        topology = {
            "version": "1.0",
            "nodesCount": len(nodes),
            "nodes": nodes
        }
        
        os.makedirs(os.path.dirname(OUTPUT_JSON_PATH), exist_ok=True)
        with open(OUTPUT_JSON_PATH, "w", encoding="utf-8") as f:
            json.dump(topology, f, ensure_ascii=False, indent=2)
        print(f"[Success] Exported topology to {OUTPUT_JSON_PATH}")

if __name__ == "__main__":
    main()
