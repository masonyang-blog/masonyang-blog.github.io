/**
 * <mason-knowledge-graph> Custom Element
 * Zero-Build, Shadow DOM 2D Force-Directed Knowledge Graph Engine
 * Saved under tools/topic-knowledge/ Directory
 * Integrates tech-data-architecture.md & tech-graphify-guide.md standards.
 */
(function (global) {
    "use strict";

    class MasonKnowledgeGraph extends HTMLElement {
        constructor() {
            super();
            // Encapsulate with Shadow DOM
            this._shadow = this.attachShadow({ mode: 'closed' });

            // State
            this._topology = { nodes: [], edges: [] };
            this._selectedNodeId = null;
            this._hoveredNodeId = null;
            this._viewMode = 'topology'; // 'topology' | 'tree'
            this._filterCategory = 'all';

            // Collapsible Tree State (Inspired by GRAPH_TREE.html)
            this._expandedCategories = new Set(['macro', 'onchain']); // Default expand popular categories

            // Physics Simulation Parameters
            this._alpha = 1.0;
            this._alphaDecay = 0.018;
            this._repulsion = 2200;
            this._springLength = 130;
            this._springStiffness = 0.04;
            this._centerGravity = 0.006;
            this._damping = 0.85;

            // Viewport Transform (Pan & Zoom)
            this._transform = { x: 0, y: 0, k: 1 };
            this._isDragging = false;
            this._draggedNode = null;
            this._dragStartPos = { x: 0, y: 0 };

            // Canvas & RAF
            this._canvas = null;
            this._ctx = null;
            this._animFrameId = null;
            this._width = 800;
            this._height = 520;
        }

        connectedCallback() {
            this._renderContainer();
            this._initCanvas();
            this._bindEvents();
            
            // Auto-load topology if repository is available
            if (global.CoreKnowledgeRepository && typeof global.CoreKnowledgeRepository.getGraphTopology === 'function') {
                this.setData(global.CoreKnowledgeRepository.getGraphTopology());
            }

            // Theme listener
            this._observer = new MutationObserver(() => this._updateThemeColors());
            this._observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
            this._updateThemeColors();
        }

        disconnectedCallback() {
            if (this._animFrameId) cancelAnimationFrame(this._animFrameId);
            if (this._observer) this._observer.disconnect();
        }

        // Public API
        setData(topologyData) {
            if (!topologyData || !Array.isArray(topologyData.nodes)) return;

            this._resizeCanvas();
            const width = (this._width && this._width > 0) ? this._width : 800;
            const height = (this._height && this._height > 0) ? this._height : 520;

            this._topology.nodes = topologyData.nodes.map(n => ({
                ...n,
                x: n.x !== undefined ? n.x : (Math.random() - 0.5) * width * 0.8 + width / 2,
                y: n.y !== undefined ? n.y : (Math.random() - 0.5) * height * 0.8 + height / 2,
                vx: 0,
                vy: 0,
                radius: n.type === 'Category' ? 18 : (n.type === 'Metric' ? 13 : 9)
            }));

            const nodeMap = new Map(this._topology.nodes.map(n => [n.id, n]));
            this._topology.edges = (topologyData.edges || [])
                .map(e => ({
                    ...e,
                    sourceNode: nodeMap.get(typeof e.source === 'object' ? e.source.id : e.source),
                    targetNode: nodeMap.get(typeof e.target === 'object' ? e.target.id : e.target)
                }))
                .filter(e => e.sourceNode && e.targetNode);

            this._computeTreeLayout();
            this._fitView();
            this._alpha = 1.0;
            this._startSimulation();
        }

        setFilterCategory(catId) {
            this._filterCategory = catId;
            if (catId !== 'all') {
                this._expandedCategories.add(catId);
            }
            this._computeTreeLayout();
            this._fitView();
            this._alpha = 1.0;
            this._startSimulation();
        }

        selectNode(nodeId) {
            this._selectedNodeId = nodeId;
            const node = this._topology.nodes.find(n => n.id === nodeId);
            if (node) {
                if (node.type === 'Category') {
                    const catKey = node.category || node.id.replace('cat-', '');
                    this._toggleCategoryExpand(catKey);
                } else if (node.category) {
                    this._expandedCategories.add(node.category);
                    this._computeTreeLayout();
                }

                const targetX = this._viewMode === 'tree' ? (node.treeX || node.x) : node.x;
                const targetY = this._viewMode === 'tree' ? (node.treeY || node.y) : node.y;
                this._transform.x = this._width / 2 - targetX * this._transform.k;
                this._transform.y = this._height / 2 - targetY * this._transform.k;
            }
            this._dispatchSelection(node);
            this._alpha = 0.5;
            this._startSimulation();
        }

        setViewMode(mode) {
            if (['topology', 'tree'].includes(mode)) {
                this._viewMode = mode;
                const container = this._shadow.querySelector('.graph-wrapper');
                if (container) {
                    container.setAttribute('data-mode', mode);
                }
                if (mode === 'tree') {
                    this._computeTreeLayout();
                }
                this._fitView();
                this._alpha = 1.0;
                this._startSimulation();
                this.dispatchEvent(new CustomEvent('graph-mode-change', { detail: { mode } }));
            }
        }

        _toggleCategoryExpand(catKey) {
            if (this._expandedCategories.has(catKey)) {
                this._expandedCategories.delete(catKey);
            } else {
                this._expandedCategories.add(catKey);
            }
            this._computeTreeLayout();
            this._fitView();
            this._alpha = 1.0;
            this._startSimulation();
        }

        _fitView() {
            if (!this._topology.nodes || this._topology.nodes.length === 0) return;

            let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
            const isTree = this._viewMode === 'tree';

            this._topology.nodes.forEach(n => {
                if (isTree && n.type !== 'Category' && !n.visibleInTree) return;

                const x = isTree ? (n.treeX !== undefined ? n.treeX : n.x) : n.x;
                const y = isTree ? (n.treeY !== undefined ? n.treeY : n.y) : n.y;
                if (x < minX) minX = x;
                if (x > maxX) maxX = x;
                if (y < minY) minY = y;
                if (y > maxY) maxY = y;
            });

            if (minX === Infinity) {
                minX = 0; maxX = this._width; minY = 0; maxY = this._height;
            }

            const graphWidth = (maxX - minX) || 100;
            const graphHeight = (maxY - minY) || 100;
            const padding = 70;

            const scaleX = (this._width - padding * 2) / graphWidth;
            const scaleY = (this._height - padding * 2) / graphHeight;
            let k = Math.min(scaleX, scaleY);
            k = Math.min(Math.max(k, 0.5), 1.15);

            const centerX = (minX + maxX) / 2;
            const centerY = (minY + maxY) / 2;

            this._transform = {
                x: this._width / 2 - centerX * k,
                y: this._height / 2 - centerY * k,
                k: k
            };
        }

        _renderContainer() {
            this._shadow.innerHTML = `
                <style>
                    :host {
                        display: block;
                        width: 100%;
                        height: 100%;
                        position: relative;
                        font-family: 'Inter', 'Noto Sans TC', sans-serif;
                    }

                    .graph-wrapper {
                        width: 100%;
                        height: 520px;
                        position: relative;
                        background: #0f172a;
                        border-radius: 1.25rem;
                        overflow: hidden;
                        border: 1px solid #1e293b;
                        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
                        transition: background-color 0.3s;
                    }

                    :host-context(.light) .graph-wrapper,
                    .graph-wrapper.light-mode {
                        background: #f8fafc;
                        border-color: #e2e8f0;
                    }

                    canvas {
                        width: 100%;
                        height: 100%;
                        display: block;
                        cursor: grab;
                    }

                    canvas:active {
                        cursor: grabbing;
                    }

                    .controls-bar {
                        position: absolute;
                        top: 1rem;
                        right: 1rem;
                        display: flex;
                        gap: 0.5rem;
                        z-index: 10;
                        background: rgba(15, 23, 42, 0.85);
                        backdrop-filter: blur(8px);
                        padding: 0.35rem 0.6rem;
                        border-radius: 2rem;
                        border: 1px solid rgba(255, 255, 255, 0.1);
                    }

                    .mode-btn {
                        background: transparent;
                        border: none;
                        color: #94a3b8;
                        font-size: 0.75rem;
                        font-weight: 600;
                        padding: 0.35rem 0.75rem;
                        border-radius: 1.5rem;
                        cursor: pointer;
                        transition: all 0.2s;
                    }

                    .mode-btn:hover {
                        color: white;
                        background: rgba(255, 255, 255, 0.1);
                    }

                    .mode-btn.active {
                        background: #0ea5e9;
                        color: white;
                        box-shadow: 0 2px 8px rgba(14, 165, 233, 0.4);
                    }

                    .tooltip {
                        position: absolute;
                        pointer-events: none;
                        background: rgba(15, 23, 42, 0.95);
                        color: white;
                        padding: 0.6rem 0.9rem;
                        border-radius: 0.75rem;
                        font-size: 0.8rem;
                        border: 1px solid #334155;
                        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
                        display: none;
                        z-index: 20;
                        max-width: 260px;
                        word-break: break-word;
                    }

                    .tooltip-title {
                        font-weight: 700;
                        margin-bottom: 0.2rem;
                        color: #38bdf8;
                    }

                    .tooltip-desc {
                        font-size: 0.75rem;
                        color: #cbd5e1;
                        line-height: 1.4;
                    }

                    .tooltip-badge {
                        display: inline-block;
                        font-size: 0.65rem;
                        padding: 0.1rem 0.4rem;
                        border-radius: 1rem;
                        background: #1e293b;
                        color: #94a3b8;
                        margin-top: 0.4rem;
                    }

                    .tree-hint {
                        position: absolute;
                        bottom: 1rem;
                        left: 1.25rem;
                        pointer-events: none;
                        font-size: 0.75rem;
                        color: #64748b;
                        background: rgba(15, 23, 42, 0.6);
                        padding: 0.3rem 0.75rem;
                        border-radius: 1rem;
                        border: 1px solid rgba(255, 255, 255, 0.05);
                    }
                </style>
                <div class="graph-wrapper">
                    <div class="controls-bar">
                        <button class="mode-btn active" data-mode="topology">拓撲圖 View</button>
                        <button class="mode-btn" data-mode="tree">樹狀圖 View</button>
                    </div>
                    <canvas></canvas>
                    <div class="tooltip"></div>
                    <div class="tree-hint">💡 點擊分類節點 (+) / (-) 可動態展開或收折主題樹狀分支</div>
                </div>
            `;
        }

        _initCanvas() {
            this._canvas = this._shadow.querySelector('canvas');
            this._ctx = this._canvas.getContext('2d');
            this._resizeCanvas();
            window.addEventListener('resize', () => {
                this._resizeCanvas();
                this._fitView();
                this._alpha = 1.0;
                this._startSimulation();
            });
        }

        _resizeCanvas() {
            const wrapper = this._shadow.querySelector('.graph-wrapper');
            if (!wrapper) return;
            const rect = wrapper.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            this._width = (rect.width && rect.width > 0) ? rect.width : 800;
            this._height = (rect.height && rect.height > 0) ? rect.height : 520;

            this._canvas.width = this._width * dpr;
            this._canvas.height = this._height * dpr;
            this._ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }

        _updateThemeColors() {
            const isDark = document.documentElement.classList.contains('dark');
            const wrapper = this._shadow.querySelector('.graph-wrapper');
            if (wrapper) {
                if (isDark) wrapper.classList.remove('light-mode');
                else wrapper.classList.add('light-mode');
            }
            this._theme = {
                isDark,
                bg: isDark ? '#0f172a' : '#f8fafc',
                text: isDark ? '#f8fafc' : '#0f172a',
                edge: isDark ? 'rgba(148, 163, 184, 0.2)' : 'rgba(100, 116, 139, 0.2)',
                edgeHighlight: '#0ea5e9'
            };
        }

        _bindEvents() {
            const buttons = this._shadow.querySelectorAll('.mode-btn');
            buttons.forEach(btn => {
                btn.addEventListener('click', () => {
                    buttons.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    this.setViewMode(btn.getAttribute('data-mode'));
                });
            });

            const canvas = this._canvas;

            canvas.addEventListener('mousedown', (e) => {
                const pos = this._getCanvasPos(e);
                const hitNode = this._hitTest(pos.x, pos.y);

                if (hitNode) {
                    this._draggedNode = hitNode;
                    hitNode.fx = hitNode.x;
                    hitNode.fy = hitNode.y;
                    this._alpha = 0.5;
                } else {
                    this._isDragging = true;
                    this._dragStartPos = { x: e.clientX - this._transform.x, y: e.clientY - this._transform.y };
                }
            });

            canvas.addEventListener('mousemove', (e) => {
                const pos = this._getCanvasPos(e);

                if (this._draggedNode) {
                    this._draggedNode.fx = pos.x;
                    this._draggedNode.fy = pos.y;
                    this._draggedNode.x = pos.x;
                    this._draggedNode.y = pos.y;
                    this._alpha = 0.5;
                    this._startSimulation();
                } else if (this._isDragging) {
                    this._transform.x = e.clientX - this._dragStartPos.x;
                    this._transform.y = e.clientY - this._dragStartPos.y;
                    this._alpha = 0.1;
                    this._startSimulation();
                } else {
                    const hitNode = this._hitTest(pos.x, pos.y);
                    this._hoveredNodeId = hitNode ? hitNode.id : null;
                    this._updateTooltip(hitNode, e);
                    canvas.style.cursor = hitNode ? 'pointer' : 'grab';
                    if (hitNode) {
                        this._alpha = 0.1;
                        this._startSimulation();
                    }
                }
            });

            canvas.addEventListener('mouseleave', () => {
                this._hoveredNodeId = null;
                this._isDragging = false;
                if (this._draggedNode) {
                    this._draggedNode.fx = null;
                    this._draggedNode.fy = null;
                    this._draggedNode = null;
                }
                const tooltip = this._shadow.querySelector('.tooltip');
                if (tooltip) tooltip.style.display = 'none';
                canvas.style.cursor = 'grab';
                this._alpha = 0.1;
                this._startSimulation();
            });

            window.addEventListener('mouseup', () => {
                if (this._draggedNode) {
                    this._draggedNode.fx = null;
                    this._draggedNode.fy = null;
                    this._draggedNode = null;
                }
                this._isDragging = false;
            });

            canvas.addEventListener('wheel', (e) => {
                e.preventDefault();
                const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
                const newK = Math.min(Math.max(0.3, this._transform.k * zoomFactor), 3.0);

                const mouseX = e.offsetX;
                const mouseY = e.offsetY;

                this._transform.x = mouseX - (mouseX - this._transform.x) * (newK / this._transform.k);
                this._transform.y = mouseY - (mouseY - this._transform.y) * (newK / this._transform.k);
                this._transform.k = newK;
                this._alpha = 0.1;
                this._startSimulation();
            });

            canvas.addEventListener('click', (e) => {
                const pos = this._getCanvasPos(e);
                const hitNode = this._hitTest(pos.x, pos.y);
                if (hitNode) {
                    this.selectNode(hitNode.id);
                }
            });
        }

        _getCanvasPos(e) {
            const rect = this._canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            return {
                x: (mouseX - this._transform.x) / this._transform.k,
                y: (mouseY - this._transform.y) / this._transform.k
            };
        }

        _hitTest(x, y) {
            const nodes = this._topology.nodes;
            const isTree = this._viewMode === 'tree';
            for (let i = nodes.length - 1; i >= 0; i--) {
                const n = nodes[i];
                if (isTree && n.type !== 'Category' && !n.visibleInTree) continue;
                const dx = n.x - x;
                const dy = n.y - y;
                if (Math.sqrt(dx * dx + dy * dy) <= (n.radius + 6)) {
                    return n;
                }
            }
            return null;
        }

        _updateTooltip(node, e) {
            const tooltip = this._shadow.querySelector('.tooltip');
            if (!node) {
                tooltip.style.display = 'none';
                return;
            }

            tooltip.style.display = 'block';
            tooltip.style.left = `${Math.min(e.offsetX + 15, this._width - 270)}px`;
            tooltip.style.top = `${Math.min(e.offsetY + 15, this._height - 100)}px`;
            tooltip.innerHTML = `
                <div class="tooltip-title">${node.label}</div>
                <div class="tooltip-desc">${(node.desc || node.summary || '').substring(0, 75)}${(node.desc || '').length > 75 ? '...' : ''}</div>
                <span class="tooltip-badge">${node.type} (${node.category})</span>
            `;
        }

        _dispatchSelection(node) {
            if (!node) return;
            const eventData = { detail: node };
            this.dispatchEvent(new CustomEvent('node-selected', eventData));
            window.dispatchEvent(new CustomEvent('graph-node-selected', eventData));
        }

        _computeTreeLayout() {
            const nodes = this._topology.nodes;
            const categories = nodes.filter(n => n.type === 'Category');
            const height = this._height || 520;
            const width = this._width || 800;

            // Space out categories vertically (Level 0: x = 90)
            const catStartY = 80;
            const catStepY = 110; // Generous vertical gap

            categories.forEach((cat, idx) => {
                const catKey = cat.category || cat.id.replace('cat-', '');
                cat.treeX = 90;
                cat.treeY = catStartY + idx * catStepY;
                cat.isExpanded = this._expandedCategories.has(catKey);

                // Children matching category
                const children = nodes.filter(n => n.type !== 'Category' && (n.category === catKey || n.category === cat.id));
                
                if (cat.isExpanded && children.length > 0) {
                    const stepY = 42; // Spacious vertical gap (42px)
                    const startY = cat.treeY - ((children.length - 1) * stepY) / 2;

                    children.forEach((child, cIdx) => {
                        const isArticle = child.type === 'Article';
                        child.treeX = isArticle ? 580 : 320;
                        child.treeY = startY + cIdx * stepY;
                        child.visibleInTree = true;
                    });
                } else {
                    // Collapsed state: pull nodes into parent category position
                    children.forEach(child => {
                        child.treeX = cat.treeX;
                        child.treeY = cat.treeY;
                        child.visibleInTree = false;
                    });
                }
            });

            // Fallback for orphan nodes
            nodes.forEach(n => {
                if (n.treeX === undefined || n.treeY === undefined) {
                    n.treeX = width / 2;
                    n.treeY = height / 2;
                    n.visibleInTree = false;
                }
            });
        }

        _startSimulation() {
            if (this._animFrameId) cancelAnimationFrame(this._animFrameId);
            const step = () => {
                this._tickPhysics();
                this._renderCanvas();
                if (this._alpha > 0.01 || this._draggedNode || this._isDragging) {
                    this._animFrameId = requestAnimationFrame(step);
                }
            };
            this._animFrameId = requestAnimationFrame(step);
        }

        _tickPhysics() {
            if (this._alpha <= 0.01 && !this._draggedNode && !this._isDragging) return;
            this._alpha *= (1 - this._alphaDecay);

            const nodes = this._topology.nodes;
            const edges = this._topology.edges;
            const cx = this._width / 2;
            const cy = this._height / 2;

            if (this._viewMode === 'tree') {
                nodes.forEach(n => {
                    if (n.fx !== null && n.fx !== undefined) {
                        n.x = n.fx;
                        n.y = n.fy;
                        return;
                    }
                    if (n.treeX !== undefined && n.treeY !== undefined) {
                        n.vx += (n.treeX - n.x) * 0.2;
                        n.vy += (n.treeY - n.y) * 0.2;
                    }
                    n.vx *= this._damping;
                    n.vy *= this._damping;
                    n.x += n.vx;
                    n.y += n.vy;
                });
                return;
            }

            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const n1 = nodes[i];
                    const n2 = nodes[j];
                    let dx = n2.x - n1.x;
                    let dy = n2.y - n1.y;
                    let dist = Math.sqrt(dx * dx + dy * dy) || 1;
                    if (dist < 450) {
                        let force = (this._repulsion / (dist * dist)) * this._alpha;
                        let fx = (dx / dist) * force;
                        let fy = (dy / dist) * force;
                        n1.vx -= fx;
                        n1.vy -= fy;
                        n2.vx += fx;
                        n2.vy += fy;
                    }
                }
            }

            edges.forEach(e => {
                const n1 = e.sourceNode;
                const n2 = e.targetNode;
                let dx = n2.x - n1.x;
                let dy = n2.y - n1.y;
                let dist = Math.sqrt(dx * dx + dy * dy) || 1;
                let force = (dist - this._springLength) * this._springStiffness * this._alpha;
                let fx = (dx / dist) * force;
                let fy = (dy / dist) * force;
                n1.vx += fx;
                n1.vy += fy;
                n2.vx -= fx;
                n2.vy -= fy;
            });

            nodes.forEach(n => {
                if (n.fx !== null && n.fx !== undefined) {
                    n.x = n.fx;
                    n.y = n.fy;
                    return;
                }
                n.vx += (cx - n.x) * this._centerGravity * this._alpha;
                n.vy += (cy - n.y) * this._centerGravity * this._alpha;
                n.vx *= this._damping;
                n.vy *= this._damping;
                n.x += n.vx;
                n.y += n.vy;
            });
        }

        _renderCanvas() {
            const ctx = this._ctx;
            const k = this._transform.k;
            const activeNodeId = this._hoveredNodeId || this._selectedNodeId;
            const isTree = this._viewMode === 'tree';

            ctx.save();
            ctx.clearRect(0, 0, this._width, this._height);

            ctx.translate(this._transform.x, this._transform.y);
            ctx.scale(k, k);

            // 1. Draw Edges
            this._topology.edges.forEach(e => {
                const sourceVisible = !isTree || e.sourceNode.type === 'Category' || e.sourceNode.visibleInTree;
                const targetVisible = !isTree || e.targetNode.type === 'Category' || e.targetNode.visibleInTree;
                if (isTree && (!sourceVisible || !targetVisible)) return;

                const isConnected = activeNodeId && 
                    (e.sourceNode.id === activeNodeId || e.targetNode.id === activeNodeId);

                ctx.beginPath();
                if (isTree) {
                    const dx = e.targetNode.x - e.sourceNode.x;
                    ctx.moveTo(e.sourceNode.x, e.sourceNode.y);
                    ctx.bezierCurveTo(
                        e.sourceNode.x + dx * 0.5, e.sourceNode.y,
                        e.targetNode.x - dx * 0.5, e.targetNode.y,
                        e.targetNode.x, e.targetNode.y
                    );
                } else {
                    ctx.moveTo(e.sourceNode.x, e.sourceNode.y);
                    ctx.lineTo(e.targetNode.x, e.targetNode.y);
                }

                if (isConnected) {
                    ctx.strokeStyle = '#38bdf8';
                    ctx.lineWidth = 2.5 / k;
                    ctx.shadowColor = '#38bdf8';
                    ctx.shadowBlur = 10;
                } else {
                    ctx.strokeStyle = activeNodeId ? 'rgba(148, 163, 184, 0.08)' : this._theme.edge;
                    ctx.lineWidth = (e.weight || 0.6) / k;
                    ctx.shadowBlur = 0;
                }
                ctx.stroke();
            });

            // 2. Draw Nodes
            this._topology.nodes.forEach(n => {
                if (isTree && n.type !== 'Category' && !n.visibleInTree) return;

                const isSelected = n.id === this._selectedNodeId;
                const isHovered = n.id === this._hoveredNodeId;
                const isNeighbor = activeNodeId && (activeNodeId === n.id || this._isNeighbor(n.id, activeNodeId));
                const color = this._getNodeColor(n);

                const opacity = (activeNodeId && !isNeighbor && n.type !== 'Category') ? 0.25 : 1.0;

                ctx.save();
                ctx.globalAlpha = opacity;

                ctx.beginPath();
                ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);

                if (isSelected || isHovered) {
                    ctx.shadowColor = color;
                    ctx.shadowBlur = isSelected ? 18 : 10;
                } else {
                    ctx.shadowBlur = 0;
                }

                ctx.fillStyle = color;
                ctx.fill();
                ctx.lineWidth = (isSelected ? 3 : (n.type === 'Category' ? 2 : 1)) / k;
                ctx.strokeStyle = isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.5)';
                ctx.stroke();

                // Draw (+) / (-) Indicator for Category in Tree View
                if (isTree && n.type === 'Category') {
                    const catKey = n.category || n.id.replace('cat-', '');
                    const isExpanded = this._expandedCategories.has(catKey);

                    ctx.beginPath();
                    ctx.arc(n.x + n.radius + 6, n.y, 7, 0, Math.PI * 2);
                    ctx.fillStyle = isExpanded ? '#38bdf8' : '#64748b';
                    ctx.fill();

                    ctx.font = 'bold 10px sans-serif';
                    ctx.fillStyle = '#ffffff';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(isExpanded ? '−' : '+', n.x + n.radius + 6, n.y);
                }

                // Smart Label Logic
                const shouldShowLabel = (n.type === 'Category') || isSelected || isHovered || isNeighbor || (k >= 1.2) || isTree;

                if (shouldShowLabel) {
                    ctx.font = `${n.type === 'Category' ? '800 13px' : '600 11px'} Inter, "Noto Sans TC", sans-serif`;
                    ctx.fillStyle = (isSelected || isHovered) ? '#38bdf8' : (n.type === 'Category' ? (this._theme.isDark ? '#ffffff' : '#0f172a') : this._theme.text);
                    ctx.textAlign = isTree && n.type !== 'Category' ? 'left' : 'center';
                    ctx.textBaseline = 'alphabetic';

                    let displayLabel = n.label;
                    if (n.type !== 'Category' && !isSelected && !isHovered && displayLabel.length > 18) {
                        displayLabel = displayLabel.substring(0, 16) + '..';
                    }

                    ctx.shadowColor = this._theme.isDark ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.9)';
                    ctx.shadowBlur = 4;
                    const labelX = isTree && n.type !== 'Category' ? n.x + n.radius + 8 : n.x;
                    const labelY = isTree && n.type !== 'Category' ? n.y + 4 : n.y + n.radius + 14;
                    ctx.fillText(displayLabel, labelX, labelY);
                }

                ctx.restore();
            });

            ctx.restore();
        }

        _isNeighbor(id1, id2) {
            if (!id1 || !id2) return false;
            return this._topology.edges.some(e => 
                (e.sourceNode.id === id1 && e.targetNode.id === id2) ||
                (e.sourceNode.id === id2 && e.targetNode.id === id1)
            );
        }

        _getNodeColor(node) {
            const colors = {
                'Category': '#0ea5e9',
                'Concept': '#f59e0b',
                'Metric': '#10b981',
                'Article': '#8b5cf6'
            };
            return colors[node.type] || '#64748b';
        }
    }

    if (!customElements.get('mason-knowledge-graph')) {
        customElements.define('mason-knowledge-graph', MasonKnowledgeGraph);
    }

})(window);
