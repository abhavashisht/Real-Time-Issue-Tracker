const express = require('express');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
const WebSocket = require('ws');
const bodyParser = require('body-parser');

const DATA_FILE = path.join(__dirname, 'issues.json');


function loadIssues() {
try {
const raw = fs.readFileSync(DATA_FILE, 'utf8');
return JSON.parse(raw);
} catch (e) {
return { issues: [], nextId: 1 };
}
}
function saveIssues(data) {
fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}


function gitCommit(message, cb = () => {}) {
// Ensure we commit only if inside a git repo; otherwise skip with message.
exec('git rev-parse --is-inside-work-tree', (err, stdout) => {
if (err) {
console.warn('Not a git repo — skipping commit');
cb(err);
return;
}
exec(`git add ${DATA_FILE} && git commit -m "${message.replace(/"/g, '\\"')}"`, (err2, out2, stderr2) => {
if (err2) console.warn('git commit failed:', stderr2 || err2);
cb(err2, out2);
});
});
}

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));


const server = require('http').createServer(app);
const wss = new WebSocket.Server({ server });


let data = loadIssues();


function broadcast(payload) {
const raw = JSON.stringify(payload);
wss.clients.forEach(client => {
if (client.readyState === WebSocket.OPEN) client.send(raw);
});
}
wss.on('connection', (ws) => {
// send current state
ws.send(JSON.stringify({ type: 'init', data }));


ws.on('message', (message) => {
try {
const msg = JSON.parse(message);
handleMessage(msg, ws);
} catch (e) {
console.warn('bad message', e);
}
});
});


function handleMessage(msg, ws) {
if (!msg || !msg.type) return;
const user = msg.user || 'Unknown';


if (msg.type === 'create') {
const issue = {
id: data.nextId++,
title: String(msg.title || '').slice(0, 200),
description: String(msg.description || ''),
status: 'Open',
createdBy: user,
createdAt: new Date().toISOString(),
comments: []
};
data.issues.push(issue);
saveIssues(data);
const commitMsg = `Issue #${issue.id} created by ${user}: ${issue.title}`;
gitCommit(commitMsg);
broadcast({ type: 'created', issue });
}
else if (msg.type === 'update') {
const id = Number(msg.id);
const issue = data.issues.find(i => i.id === id);
if (!issue) return;
const updates = {};
if (msg.title) { issue.title = String(msg.title); updates.title = issue.title; }
if (msg.description) { issue.description = String(msg.description); updates.description = issue.description; }
if (msg.status) { issue.status = msg.status; updates.status = issue.status; }
issue.updatedAt = new Date().toISOString();


saveIssues(data);
const commitMsg = `Issue #${issue.id} updated by ${user}${Object.keys(updates).length? ' ('+Object.keys(updates).join(',') +')':''}`;
gitCommit(commitMsg);
broadcast({ type: 'updated', issue });
}
else if (msg.type === 'comment') {
const id = Number(msg.id);
const issue = data.issues.find(i => i.id === id);
if (!issue) return;
const comment = {
id: issue.comments.length + 1,
by: user,
text: String(msg.text || ''),
at: new Date().toISOString()
};
issue.comments.push(comment);
issue.updatedAt = comment.at;
saveIssues(data);
const commitMsg = `Comment on Issue #${issue.id} by ${user}`;
gitCommit(commitMsg);
broadcast({ type: 'commented', issue, comment });
}
}


// Simple REST endpoint to get issues (optional)
app.get('/api/issues', (req, res) => {
res.json(data);
});
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));