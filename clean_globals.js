const fs = require('fs');
let content = fs.readFileSync('src/app/globals.css', 'utf8');

content = content.replace(/@keyframes hero-enter\s*\{[\s\S]*?\}\n\n/g, '');
content = content.replace(/\.hero-line-[12]\s*\{[\s\S]*?\}\n\n/g, '');
content = content.replace(/\.hero-body\s*\{[\s\S]*?\}\n/g, '');

fs.writeFileSync('src/app/globals.css', content);
