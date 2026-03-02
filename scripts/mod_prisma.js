import fs from 'fs';

let content = fs.readFileSync('prisma/schema.prisma', 'utf8');

content = content.replace(/provider\s*=\s*"sqlite"/, 'provider = "postgresql"');
content = content.replace(/url\s*=\s*"file:\.\/dev\.db"/, 'url      = env("DATABASE_URL")');

fs.writeFileSync('prisma/schema.prisma', content);
console.log('Updated schema.prisma to postgresql');
