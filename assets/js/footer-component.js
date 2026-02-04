/**
 * Footer 組件 - Shadow DOM 封裝
 * @class FooterComponent
 * @description Crypto Compound 部落格的標準頁尾組件
 */
(function (global) {
    "use strict";

    class FooterComponent {
        constructor(hostElement) {
            this.hostElement = hostElement || document.querySelector('#footer-host');
            if (!this.hostElement) {
                console.warn('FooterComponent: Host element not found');
                return;
            }
            this.shadowRoot = this.hostElement.attachShadow({ mode: "open" });

            // Default Configuration
            this._config = {
                debug: false,
                copyrightYear: "2026",
                siteName: "Crypto Compound",
                disclaimer: "免責聲明：本站內容僅供資訊參考，不構成任何投資建議。"
            };
        }

        init() {
            this.createStyles();
            this.createContent();
            if (this._config.debug) console.log("Footer initialized");
            return this;
        }

        createStyles() {
            const style = document.createElement("style");
            style.textContent = `
                :host {
                    display: block;
                    font-family: 'Inter', 'Noto Sans TC', sans-serif;
                    margin-top: 4rem; /* mt-16 */
                }
                
                footer {
                    background-color: #0f172a; /* Default / Light Mode Footer (Dark Slate) */
                    color: #94a3b8;
                    padding: 2rem 0;
                    transition: background-color 0.3s ease;
                }

                :host-context(html.dark) footer {
                    background-color: #131722; /* TV Main BG */
                    color: #787B86; /* TV Secondary Text */
                    border-top: 1px solid #2A2E39;
                }

                .container {
                    max-width: 80rem; /* 7xl */
                    margin: 0 auto;
                    padding: 0 1rem;
                    text-align: center;
                }

                @media (min-width: 640px) { .container { padding: 0 1.5rem; } }
                @media (min-width: 1024px) { .container { padding: 0 2rem; } }

                .copyright {
                    font-size: 0.875rem; /* sm */
                    margin-bottom: 0.5rem;
                }

                .disclaimer {
                    font-size: 0.875rem; /* sm */
                    opacity: 0.8;
                }
            `;
            this.shadowRoot.appendChild(style);
        }

        createContent() {
            const footer = document.createElement("footer");

            footer.innerHTML = `
                <div class="container">
                    <p class="copyright">&copy; ${this._config.copyrightYear} ${this._config.siteName}. All Rights Reserved.</p>
                    <p class="disclaimer">${this._config.disclaimer}</p>
                </div>
            `;

            this.shadowRoot.appendChild(footer);
        }

        // --- Chainable Setters ---

        setDebug(debug) {
            this._config.debug = !!debug;
            return this;
        }

        setCopyrightYear(year) {
            this._config.copyrightYear = year;
            return this;
        }

        setSiteName(name) {
            this._config.siteName = name;
            return this;
        }

        setDisclaimer(text) {
            this._config.disclaimer = text;
            return this;
        }
    }

    global.FooterComponent = FooterComponent;

})(window);
