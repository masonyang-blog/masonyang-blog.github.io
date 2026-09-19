/**
 * Knowledge Graph Component
 * @class KnowledgeGraphComponent
 * @description Visualizes relationships between knowledge entities using Vis-network.
 * Supports Shadow DOM encapsulation and Zero-Build architecture.
 */
(function (global) {
    "use strict";

    class KnowledgeGraphComponent {
        constructor() {
            this._config = {
                containerId: 'knowledge-graph-container',
                width: '100%',
                height: '500px',
                debug: false,
                theme: 'dark',
                highlightId: null // ID of the node to highlight (e.g., current page)
            };

            this.network = null;
            this.hostElement = null;
            this.shadowRoot = null;
        }

        /**
         * Initialize the component
         * @param {string} containerId Optional container ID override
         */
        init(containerId) {
            if (containerId) this._config.containerId = containerId;
            
            this.hostElement = document.getElementById(this._config.containerId);
            if (!this.hostElement) {
                this._log('warn', `Host element '#${this._config.containerId}' not found.`);
                return this;
            }

            // Setup Shadow DOM (Always use 'open' to allow presence check)
            if (!this.hostElement.shadowRoot) {
                this.shadowRoot = this.hostElement.attachShadow({ mode: 'open' });
            } else {
                this.shadowRoot = this.hostElement.shadowRoot;
                while (this.shadowRoot.firstChild) this.shadowRoot.removeChild(this.shadowRoot.firstChild);
            }

            // Auto-detect theme
            this._config.theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';

            // Check Repository Availability
            if (!global.CoreKnowledgeRepository) {
                this._log('warn', 'CoreKnowledgeRepository not found. Waiting for repository...');
                // Simple retry mechanism if data isn't loaded yet
                setTimeout(() => this.init(), 100);
                return this;
            }

            // Load Vis-network if not already loaded
            this._loadDependencies(() => {
                this._render();
            });

            return this;
        }

        /**
         * Load external script
         */
        _loadDependencies(callback) {
            if (global.vis) {
                callback();
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://unpkg.com/vis-network/standalone/umd/vis-network.min.js';
            script.async = true;
            script.onload = callback;
            document.head.appendChild(script);
        }

        /**
         * Main Render Logic
         */
        _render() {
            const container = document.createElement('div');
            container.style.width = this._config.width;
            container.style.height = this._config.height;
            container.style.position = 'relative';
            container.style.backgroundColor = this._config.theme === 'dark' ? '#0f172a' : '#f8fafc';
            container.style.borderRadius = '1rem';
            container.style.overflow = 'hidden';
            container.style.border = `1px solid ${this._config.theme === 'dark' ? '#1e293b' : '#e2e8f0'}`;

            this.shadowRoot.appendChild(container);

            // Prepare Data
            const repo = global.CoreKnowledgeRepository;
            const allNodes = repo ? repo.all : [];
            const allLinks = repo ? repo.links : [];
            const highlightId = this._config.highlightId;

            let filteredNodes = allNodes;
            let filteredLinks = allLinks;

            // --- Optimization: Hierarchical/Fishbone View (V3) ---
            const nodeLevels = {}; // Map to store levels for hierarchical layout

            if (highlightId) {
                const neighborSet = new Set();
                neighborSet.add(highlightId);
                nodeLevels[highlightId] = 1; // Center at level 1

                allLinks.forEach(link => {
                    if (link.from === highlightId) {
                        neighborSet.add(link.to);
                        nodeLevels[link.to] = 2; // Successors at level 2
                    }
                    if (link.to === highlightId) {
                        neighborSet.add(link.from);
                        nodeLevels[link.from] = 0; // Predecessors at level 0
                    }
                });

                filteredNodes = allNodes.filter(n => neighborSet.has(n.id));
                filteredLinks = allLinks.filter(l => neighborSet.has(l.from) && neighborSet.has(l.to));
            }

            const nodes = filteredNodes.map(item => {
                const isCenter = item.id === highlightId;
                return {
                    id: item.id,
                    level: nodeLevels[item.id] !== undefined ? nodeLevels[item.id] : 1, // Vis-network level
                    label: item.title.split('(')[0].trim(),
                    title: `<b>${item.title}</b><br>${item.desc}`,
                    color: this._getNodeColor(item.tag, isCenter),
                    size: isCenter ? 35 : 22,
                    font: { 
                        size: isCenter ? 14 : 12,
                        weight: isCenter ? 'bold' : 'normal',
                        color: this._config.theme === 'dark' ? '#f1f5f9' : '#0f172a' 
                    },
                    borderWidth: isCenter ? 4 : 1,
                    shadow: isCenter ? { enabled: true, color: 'rgba(59, 130, 246, 0.5)', size: 10 } : false
                };
            });

            const edges = filteredLinks.map(link => ({
                from: link.from,
                to: link.to,
                label: link.label,
                color: this._config.theme === 'dark' ? '#334155' : '#cbd5e1',
                font: { size: 10, align: 'middle', color: this._config.theme === 'dark' ? '#94a3b8' : '#64748b' },
                arrows: { to: { enabled: true, scaleFactor: 0.5 } },
                width: 1,
                smooth: { type: 'cubicBezier', forceDirection: 'horizontal' }
            }));

            const data = { nodes: new vis.DataSet(nodes), edges: new vis.DataSet(edges) };

            const options = {
                layout: {
                    hierarchical: {
                        enabled: !!highlightId,
                        direction: 'LR', // Left to Right
                        sortMethod: 'directed',
                        levelSeparation: 350,
                        nodeSpacing: 150,
                        treeSpacing: 200,
                        blockShifting: true,
                        edgeMinimization: true,
                        parentCentralization: true
                    }
                },
                physics: {
                    enabled: !highlightId, // Disable physics for fixed tree view
                    barnesHut: { gravitationalConstant: -8000 }
                },
                nodes: {
                    shape: 'dot',
                    font: { face: 'Inter, system-ui' }
                },
                interaction: {
                    hover: true,
                    tooltipDelay: 200,
                    dragNodes: false // Keep it static and clean
                }
            };

            this.network = new vis.Network(container, data, options);

            // Interaction: Double click to navigate
            this.network.on("doubleClick", (params) => {
                if (params.nodes.length > 0) {
                    const nodeId = params.nodes[0];
                    const item = repo.getById(nodeId);
                    if (item) {
                        // Resolve path relative to knowledge folder
                        const currentPath = window.location.pathname;
                        const prefix = currentPath.includes('/knowledge/') ? '' : 'knowledge/';
                        window.location.href = `${prefix}${nodeId}.html`;
                    }
                }
            });
        }

        _getNodeColor(tag, isHighlighted) {
            const colors = {
                'macro': { background: '#8b5cf6', border: '#7c3aed' }, // violet
                'valuation': { background: '#f59e0b', border: '#d97706' }, // amber
                'risk': { background: '#ef4444', border: '#dc2626' }, // red
                'default': { background: '#64748b', border: '#475569' } // slate
            };

            const base = colors[tag] || colors.default;
            if (isHighlighted) {
                return { background: '#3b82f6', border: '#2563eb' }; // blue
            }
            return base;
        }

        _log(level, msg) {
            if (this._config.debug) console[level](`[KnowledgeGraph] ${msg}`);
        }

        // --- Chainable Setters ---
        setContainerId(id) { this._config.containerId = id; return this; }
        setHeight(h) { this._config.height = h; return this; }
        setHighlightId(id) { this._config.highlightId = id; return this; }
        setDebug(enabled) { this._config.debug = !!enabled; return this; }
    }

    global.KnowledgeGraphComponent = KnowledgeGraphComponent;

})(window);
