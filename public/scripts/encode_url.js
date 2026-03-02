import fs from 'fs';

let content = fs.readFileSync('.env', 'utf8');

const prefix = 'postgresql://postgres.kvwfauufaandkupkjswe:';
const passwd = 'DFsb%-3!E5v/mxr';
const encodedPasswd = encodeURIComponent(passwd);
const suffix = '@aws-0-us-west-2.pooler.supabase.com:5432/postgres?pgbouncer=true&connection_limit=1';

const fullUrl = 'DATABASE_URL="' + prefix + encodedPasswd + suffix + '"';

content = content.replace(/DATABASE_URL=".+"/, fullUrl);

fs.writeFileSync('.env', content);
console.log('Updated .env with encoded URL');
