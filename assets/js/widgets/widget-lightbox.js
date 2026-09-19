/**
 * Lightbox 組件 - Shadow DOM 封裝
 * @class LightboxComponent
 * @description 為 Mason Yang Blog 的文章圖片提供點擊放大的體驗
 */
(function (global) {
    "use strict";

    class LightboxComponent {
        constructor() {
            this.config = {
                // 針對 .prose 內的圖片，但排除有特別標記不放大的圖片
                imageSelector: '.prose img:not(.no-lightbox)'
            };
            this.lightboxHost = null;
            this.shadowRoot = null;
        }

        init() {
            this.attachEvents();
            return this;
        }

        attachEvents() {
            const images = document.querySelectorAll(this.config.imageSelector);
            images.forEach(img => {
                // 加上 cursor 暗示
                img.style.cursor = 'zoom-in';
                
                // 綁定點擊事件
                img.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.openLightbox(img.src, img.alt || 'Enlarged Image');
                });
            });

            // 綁定 ESC 鍵關閉
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.lightboxHost) {
                    this.closeLightbox();
                }
            });
        }

        openLightbox(src, alt) {
            if (this.lightboxHost) this.closeLightbox();

            // 建立 Host 節點
            this.lightboxHost = document.createElement('div');
            this.lightboxHost.id = 'widget-lightbox-host';
            document.body.appendChild(this.lightboxHost);

            // 啟用 Shadow DOM 封裝
            this.shadowRoot = this.lightboxHost.attachShadow({ mode: 'closed' });
            
            const style = document.createElement('style');
            style.textContent = `
                :host {
                    display: block;
                }
                .lightbox-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(15, 23, 42, 0.9);
                    backdrop-filter: blur(8px);
                    -webkit-backdrop-filter: blur(8px);
                    z-index: 999999;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    opacity: 0;
                    transition: opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                    cursor: zoom-out;
                    padding: 1rem;
                    box-sizing: border-box;
                }
                .lightbox-overlay.show {
                    opacity: 1;
                }
                .lightbox-img {
                    max-width: 100%;
                    max-height: 100%;
                    object-fit: contain;
                    border-radius: 0.5rem;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                    transform: scale(0.95) translateY(10px);
                    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                    user-select: none;
                    -webkit-user-select: none;
                }
                .lightbox-overlay.show .lightbox-img {
                    transform: scale(1) translateY(0);
                }
                
                /* Loading spinner for slow images if needed, but since it's already cached from the page, usually instant */
            `;
            
            const overlay = document.createElement('div');
            overlay.className = 'lightbox-overlay';
            
            const img = document.createElement('img');
            img.src = src;
            img.alt = alt;
            img.className = 'lightbox-img';
            
            // 阻止圖片拖曳
            img.ondragstart = () => false;

            overlay.appendChild(img);
            overlay.onclick = () => this.closeLightbox();
            
            this.shadowRoot.appendChild(style);
            this.shadowRoot.appendChild(overlay);
            
            // 觸發進場動畫
            requestAnimationFrame(() => {
                overlay.classList.add('show');
            });
            
            // 鎖定背景滾動
            document.body.style.overflow = 'hidden';
        }

        closeLightbox() {
            if (!this.lightboxHost || !this.shadowRoot) return;
            
            const overlay = this.shadowRoot.querySelector('.lightbox-overlay');
            if (overlay) {
                overlay.classList.remove('show');
            }
            
            // 等待動畫結束後移除 DOM
            setTimeout(() => {
                if (this.lightboxHost && this.lightboxHost.parentNode) {
                    this.lightboxHost.parentNode.removeChild(this.lightboxHost);
                }
                this.lightboxHost = null;
                this.shadowRoot = null;
                // 恢復背景滾動
                document.body.style.overflow = '';
            }, 300); // 對應 transition duration
        }
    }
    
    global.LightboxComponent = LightboxComponent;
    
    // 自動初始化 (綁定於 DOMContentLoaded)
    document.addEventListener('DOMContentLoaded', () => {
        new LightboxComponent().init();
    });

})(window);
