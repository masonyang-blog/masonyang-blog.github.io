/**
 * Footer 組件 - Shadow DOM 封裝
 * @class FooterComponent
 * @description Mason Yang Blog 部落格的標準頁尾組件
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
            this.shadowRoot = this.hostElement.attachShadow({ mode: "closed" });

            // Default Configuration
            this._config = {
                debug: false,
                copyrightYear: "2026",
                siteName: "Mason Yang Blog",
                disclaimer: "這裡是我的個人寫作空間，客觀記錄關於科技產業投資研究、總體經濟、加密貨幣的觀察與思考。<br>免責聲明：本站內容僅供資訊參考，不構成任何投資建議。"
            };
        }

        getPathPrefix() {
            const path = window.location.pathname;
            if (path.includes('/post/') || path.includes('/knowledge/') || path.includes('/project/') || path.includes('/doc/') || path.includes('/news/')) {
                return '../';
            }
            return './';
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
                    margin-top: 5rem; /* mt-20 */
                }
                
                footer {
                    background-color: var(--c-bg-footer);
                    color: var(--c-text-footer);
                    padding: 3rem 0; /* 加深 padding 提高呼吸感 */
                    transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
                    border-top: 1px solid var(--c-border-footer);
                }

                .container {
                    max-width: 80rem; /* 7xl */
                    margin: 0 auto;
                    padding: 0 1.5rem;
                    text-align: center;
                }

                .copyright {
                    font-size: 0.8125rem; /* 稍微縮小更精緻 */
                    color: var(--c-text-footer-dim);
                    margin-bottom: 0.75rem;
                    letter-spacing: 0.025em;
                }

                .disclaimer {
                    font-size: 0.75rem; /* 縮小以呈現次要說明質感 */
                    color: var(--c-text-footer-decline);
                    line-height: 1.6;
                    max-width: 42rem;
                    margin: 0 auto;
                }

                .footer-links {
                    margin-bottom: 2rem;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 2rem; /* 使用 gap 排版 */
                }

                .footer-link {
                    position: relative;
                    color: var(--c-text-footer);
                    text-decoration: none;
                    font-size: 0.875rem; /* sm */
                    font-weight: 500;
                    transition: color 0.25s ease;
                    padding-bottom: 4px;
                }

                /* 精緻的自訂底線動畫 */
                .footer-link::before {
                    content: "";
                    position: absolute;
                    bottom: 0;
                    left: 50%;
                    width: 0;
                    height: 1.5px;
                    background-color: var(--c-primary);
                    transition: width 0.25s cubic-bezier(0.4, 0, 0.2, 1), left 0.25s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .footer-link:hover::before {
                    width: 100%;
                    left: 0;
                }

                .footer-link:hover {
                    color: var(--c-text-footer-hover);
                }

                /* 精細的垂直分割線，使用偽元素並透過 gap 自動居中 */
                .footer-link:not(:last-child)::after {
                    content: "";
                    position: absolute;
                    right: -1rem; /* 剛好置於 2rem gap 的正中間 */
                    top: 50%;
                    transform: translateY(-50%);
                    width: 1px;
                    height: 10px;
                    background-color: var(--c-divider-footer);
                    pointer-events: none;
                }

                /* 行動端優化 */
                @media (max-width: 640px) {
                    .footer-links {
                        gap: 1.25rem;
                    }
                    .footer-link:not(:last-child)::after {
                        right: -0.625rem;
                    }
                }
            `;
            this.shadowRoot.appendChild(style);
        }

        createContent() {
            const footer = document.createElement("footer");
            const prefix = this.getPathPrefix();

            footer.innerHTML = `
                <div class="container">
                    <div class="footer-links">
                        <a href="${prefix}about.html" class="footer-link">關於我</a>
                    </div>
                    <div class="footer-meta">
                        <p class="copyright">&copy; ${this._config.copyrightYear} ${this._config.siteName}. All Rights Reserved.</p>
                        <p class="disclaimer">${this._config.disclaimer}</p>
                    </div>
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
