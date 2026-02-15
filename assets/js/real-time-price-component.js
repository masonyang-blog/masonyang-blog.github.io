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

            this.shadowRoot = this.hostElement.attachShadow({ mode: 'closed' });
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
                this.priceElement.style.color = '#0ecb81'; // Green
            } else if (price < this.lastPrice) {
                this.priceElement.style.color = '#f6465d'; // Red
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
                    background: #f8fafc;
                    padding: 0.5rem 1rem;
                    border-radius: 0.5rem;
                    border: 1px solid #e2e8f0;
                }

                .symbol {
                    font-weight: 700;
                    color: #64748b;
                }

                .price {
                    font-weight: 700;
                    color: #0f172a;
                    transition: color 0.3s ease;
                }

                .status-dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background-color: #cbd5e1; /* slate-300 */
                    margin-left: auto; /* Push to right */
                    transition: background-color 0.3s;
                }
                .status-dot.connected {
                    background-color: #0ecb81; /* green */
                    box-shadow: 0 0 4px rgba(14, 203, 129, 0.4);
                }
                .status-dot.disconnected {
                    background-color: #f6465d; /* red */
                }

                .percent {
                    font-size: 0.875rem;
                    font-weight: 600;
                    padding: 0.1rem 0.4rem;
                    border-radius: 0.25rem;
                }

                .percent.up {
                    background-color: rgba(14, 203, 129, 0.1);
                    color: #0ecb81;
                }

                .percent.down {
                    background-color: rgba(246, 70, 93, 0.1);
                    color: #f6465d;
                }

                /* Dark Mode */
                :host-context(html.dark) .ticker-container {
                    background: #1e293b;
                    border-color: #334155;
                }
                :host-context(html.dark) .price {
                    color: #f1f5f9;
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
