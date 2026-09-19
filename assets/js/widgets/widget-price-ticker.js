/**
 * Real Time Price Component
 * @class RealTimePriceComponent
 * @description Connects to Binance WebSocket Stream to display real-time crypto prices.
 * Uses Shadow DOM for encapsulation.
 */
(function (global) {
    "use strict";

    class RealTimePriceComponent {
        constructor() {
            this._config = {
                debug: false,
                targetId: 'crypto-ticker-target',
                symbol: 'BTCUSDT', // Default
                displaySymbol: 'BTC'
            };

            this.socket = null;
            this.hostElement = null;
            this.shadowRoot = null;
            this.priceElement = null;
            this.percentElement = null;
            this.lastPrice = 0;
        }

        init() {
            this.hostElement = document.getElementById(this._config.targetId);
            if (!this.hostElement) {
                this._log('warn', `Host element #${this._config.targetId} not found`);
                return this;
            }

            // Setup Shadow DOM (Closed mode with private property)
            if (!this.hostElement._shadowRoot) {
                this.shadowRoot = this.hostElement.attachShadow({ mode: 'closed' });
                this.hostElement._shadowRoot = this.shadowRoot;
            } else {
                this.shadowRoot = this.hostElement._shadowRoot;
                this.shadowRoot.innerHTML = '';
            }
            this._render();
            this._connectWebSocket();

            return this;
        }

        _connectWebSocket() {
            // Binance Stream: <symbol>@ticker
            // symbol must be lowercase
            const pair = this._config.symbol.toLowerCase();
            const wsUrl = `wss://stream.binance.com:9443/ws/${pair}@ticker`;

            this._log('info', `Connecting to ${wsUrl}`);

            this.socket = new WebSocket(wsUrl);

            this.socket.onopen = () => {
                this._log('info', 'WebSocket Connected');
                this._setConnectionStatus('connected');
            };

            this.socket.onmessage = (event) => {
                const data = JSON.parse(event.data);
                // Payload e.g. { c: "current price", P: "price change percent", ... }
                this._updateUI(parseFloat(data.c), parseFloat(data.P));
            };

            this.socket.onerror = (error) => {
                this._log('error', error);
            };

            this.socket.onclose = () => {
                this._log('info', 'WebSocket Closed');
                this._setConnectionStatus('disconnected');
            };
        }

        _updateUI(price, percentChange) {
            if (!this.priceElement) return;

            // Format Price
            // If price < 1, show more decimals. Else 2.
            const formattedPrice = price < 1 ? price.toFixed(4) : price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

            this.priceElement.innerText = `$${formattedPrice}`;

            // Color update based on tick
            if (price > this.lastPrice) {
                this.priceElement.style.color = 'var(--c-bull)';
            } else if (price < this.lastPrice) {
                this.priceElement.style.color = 'var(--c-bear)';
            }
            this.lastPrice = price;

            // Percent Change
            if (this.percentElement) {
                const sign = percentChange >= 0 ? '+' : '';
                this.percentElement.innerText = `${sign}${percentChange.toFixed(2)}%`;

                if (percentChange >= 0) {
                    this.percentElement.className = 'percent up';
                } else {
                    this.percentElement.className = 'percent down';
                }
            }
        }

        _render() {
            const style = document.createElement('style');
            style.textContent = `
                :host {
                    display: inline-block;
                    font-family: 'Roboto Mono', monospace;
                }
                
                .ticker-container {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    background: var(--c-bg-card);
                    padding: 0.5rem 1rem;
                    border-radius: 0.5rem;
                    border: 1px solid var(--c-border);
                    transition: background-color 0.3s ease, border-color 0.3s ease;
                }

                .symbol {
                    font-weight: 700;
                    color: var(--c-text-secondary);
                }

                .price {
                    font-weight: 700;
                    color: var(--c-text-primary);
                    transition: color 0.3s ease;
                }

                .status-dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background-color: var(--c-divider);
                    margin-left: auto; /* Push to right */
                    transition: background-color 0.3s, box-shadow 0.3s;
                }
                .status-dot.connected {
                    background-color: var(--c-bull);
                    box-shadow: 0 0 4px var(--c-bull-bg);
                }
                .status-dot.disconnected {
                    background-color: var(--c-bear);
                }

                .percent {
                    font-size: 0.875rem;
                    font-weight: 600;
                    padding: 0.1rem 0.4rem;
                    border-radius: 0.25rem;
                    transition: background-color 0.3s ease, color 0.3s ease;
                }

                .percent.up {
                    background-color: var(--c-bull-bg);
                    color: var(--c-bull);
                }

                .percent.down {
                    background-color: var(--c-bear-bg);
                    color: var(--c-bear);
                }
            `;
            this.shadowRoot.appendChild(style);

            const container = document.createElement('div');
            container.className = 'ticker-container';
            container.innerHTML = `
                <span class="symbol">${this._config.displaySymbol}</span>
                <span class="price">Connecting...</span>
                <span class="percent">--%</span>
                <div class="status-dot disconnected"></div>
            `;

            this.priceElement = container.querySelector('.price');
            this.percentElement = container.querySelector('.percent');
            this.statusDot = container.querySelector('.status-dot');

            this.shadowRoot.appendChild(container);
        }

        _log(level, msg) {
            if (this._config.debug) {
                console[level](`[RealTimePrice] ${msg}`);
            }
        }

        destroy() {
            if (this.socket) {
                this.socket.close();
            }
        }

        // --- Setters ---

        setSymbol(symbol) {
            // Assume format "BTC" -> "BTCUSDT"
            const cleanSym = symbol.toUpperCase();
            this._config.displaySymbol = cleanSym;
            this._config.symbol = `${cleanSym}USDT`;
            return this;
        }

        setTargetId(id) {
            this._config.targetId = id;
            return this;
        }

        setDebug(enabled) {
            this._config.debug = !!enabled;
            return this;
        }
    }

    global.RealTimePriceComponent = RealTimePriceComponent;

})(window);
