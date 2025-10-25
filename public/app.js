const userInput = document.getElementById('user');
const titleInput = document.getElementById('title');
const descInput = document.getElementById('description');
const createBtn = document.getElementById('createBtn');
const issuesTableBody = document.querySelector('#issuesTable tbody');
const refreshBtn = document.getElementById('refresh');
const detail = document.getElementById('detail');
const detailContent = document.getElementById('detailContent');
const closeDetail = document.getElementById('closeDetail');

let state = { issues: [], nextId: 1 };


const ws = new WebSocket((location.protocol === 'https:' ? 'wss://' : 'ws://') + location.host);
ws.addEventListener('open', () => console.log('ws open'));
ws.addEventListener('message', (ev) => {
const msg = JSON.parse(ev.data);
if (msg.type === 'init') {
state = msg.data;
render();
} else if (msg.type === 'created') {
state.issues.push(msg.issue);
render();
} else if (msg.type === 'updated') {
const idx = state.issues.findIndex(i => i.id === msg.issue.id);
if (idx >= 0) state.issues[idx] = msg.issue;
render();
} else if (msg.type === 'commented') {
const idx = state.issues.findIndex(i => i.id === msg.issue.id);
if (idx >= 0) state.issues[idx] = msg.issue;
render();
showDetail(msg.issue.id);
}
});

function send(type, payload) {
const user = (userInput.value || 'Anonymous').trim();
ws.send(JSON.stringify(Object.assign({ type, user }, payload)));
}


createBtn.addEventListener('click', () => {
const title = titleInput.value.trim();
if (!title) return alert('Title required');
send('create', { title, description: descInput.value });
titleInput.value = '';
descInput.value = '';
});

refreshBtn.addEventListener('click', () => fetch('/api/issues').then(r=>r.json()).then(j=>{ state = j; render(); }));


function render() {
issuesTableBody.innerHTML = '';
state.issues.slice().reverse().forEach(issue => {
const tr = document.createElement('tr');
tr.innerHTML = `<td>${issue.id}</td><td>${escapeHtml(issue.title)}</td><td>${issue.status}</td><td>${escapeHtml(issue.createdBy)}</td><td><button data-id="${issue.id}" class="view">View</button></td>`;
issuesTableBody.appendChild(tr);
});
document.querySelectorAll('.view').forEach(btn => btn.onclick = () => showDetail(Number(btn.dataset.id)));
}

function showDetail(id) {
const issue = state.issues.find(i => i.id === id);
if (!issue) return;
detailContent.innerHTML = `\n <h3>${escapeHtml(issue.title)} (#${issue.id})</h3>\n <p><strong>Status:</strong> ${issue.status}</p>\n <p><strong>Description:</strong><br>${escapeHtml(issue.description)}</p>\n <p><strong>Created:</strong> ${issue.createdBy} at ${issue.createdAt}</p>\n <hr>\n <h4>Comments</h4>\n <div id=comments>${issue.comments.map(c=>`<div><em>${escapeHtml(c.by)}</em> at ${c.at}:<div>${escapeHtml(c.text)}</div></div>`).join('')}</div>\n <hr>\n <textarea id="newComment" placeholder="Write a comment"></textarea>\n <br>\n <select id="newStatus"><option>Open</option><option>In Progress</option><option>Closed</option></select>\n <button id="saveUpdate">Save</button>\n `;
detail.classList.remove('hidden');


document.getElementById('saveUpdate').onclick = () => {
const text = document.getElementById('newComment').value.trim();
const status = document.getElementById('newStatus').value;
if (text) send('comment', { id, text });
send('update', { id, status });
};
}

closeDetail.onclick = () => detail.classList.add('hidden');


function escapeHtml(s){
if (!s) return '';
return s.replace(/[&<>\"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[c]));
}


// initial render
render();