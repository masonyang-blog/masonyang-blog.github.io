const fs = require('fs');
const path = require('path');

function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            processDirectory(fullPath);
        } else if (fullPath.endsWith('.html') || fullPath.endsWith('.md')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let originalContent = content;

            // 1. Rename the initialization class
            content = content.replace(/RelatedArticlesComponent/g, 'WidgetRelatedArticles');

            // 2. Rename the script src
            content = content.replace(/related-articles-component\.js/g, 'widget-related-articles.js');

            // 3. Re-inject the script tag if the file initializes WidgetRelatedArticles but lacks the script tag
            if (content.includes('WidgetRelatedArticles') && !content.includes('widget-related-articles.js')) {
                // Find where to insert safely. Usually after ui-toc-responsive.js or ui-toc-desktop.js
                // HTML files in project/ or post/ typically have `<script src="../../assets/js/ui-toc-responsive.js"></script>`
                const scriptInsertionPoint1 = '<script src="../../assets/js/ui-toc-responsive.js"></script>';
                const scriptInsertionPoint2 = '<script src="../assets/js/ui-toc-responsive.js"></script>';

                if (content.includes(scriptInsertionPoint1)) {
                    content = content.replace(scriptInsertionPoint1, scriptInsertionPoint1 + '\n    <script src="../../assets/js/widget-related-articles.js"></script>');
                    console.log(`Re-injected script tag in ${fullPath}`);
                } else if (content.includes(scriptInsertionPoint2)) {
                    content = content.replace(scriptInsertionPoint2, scriptInsertionPoint2 + '\n    <script src="../assets/js/widget-related-articles.js"></script>');
                    console.log(`Re-injected script tag in ${fullPath}`);
                } else {
                    console.log(`Needs script tag but insertion point not found: ${fullPath}`);
                }
            }

            if (content !== originalContent) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated ${fullPath}`);
            }
        }
    }
}

// Target specific directories to avoid unnecessary processing
['project', 'post', 'doc'].forEach(dir => {
    if (fs.existsSync(dir)) {
        processDirectory(dir);
    }
});

// Also fix the main js file itself
const jsFile = 'assets/js/widget-related-articles.js';
if (fs.existsSync(jsFile)) {
    let jsContent = fs.readFileSync(jsFile, 'utf8');
    let newJsContent = jsContent.replace(/RelatedArticlesComponent/g, 'WidgetRelatedArticles');
    newJsContent = newJsContent.replace(/related-articles-component\.js/g, 'widget-related-articles.js');
    if (jsContent !== newJsContent) {
        fs.writeFileSync(jsFile, newJsContent, 'utf8');
        console.log(`Updated ${jsFile}`);
    }
}

console.log('Done.');
