(() => {
  'use strict';

  const initialIssue = { id: 'ENG-42', title: '发布同步引擎教程', assignee: 'Alice', status: 'Todo' };
  const lessons = [
    { kicker: '先建立直觉', title: '一次修改，为什么要走这么远？', body: '在本地优先应用里，界面先响应，网络随后追赶。跟着一条标题修改，观察它如何从内存穿过服务器，再抵达另一台设备。', action: '播放这一课', duration: '约 2 分钟', demo: 'basic' },
    { kicker: '对象不是一行 JSON', title: 'Model：带行为的业务对象', body: 'Issue、User 和 Team 都是 Model。属性、引用和加载策略组成元数据，让同一套同步机制服务许多不同的数据结构。', action: '查看模型元数据', duration: '约 2 分钟', demo: 'model' },
    { kicker: '先拿到可以工作的世界', title: 'Bootstrap：从空白到可交互', body: '客户端先建立存储结构，写入服务器快照，把立即需要的对象装入内存，最后接上增量消息。顺序错误会留下难以发现的状态缺口。', action: '逐步启动客户端', duration: '约 3 分钟', demo: 'bootstrap' },
    { kicker: '需要时才拿', title: 'Lazy Hydration：把等待推迟到访问那一刻', body: '模型可以只保留负责人 ID。真正读取负责人对象时，系统先查 Object Pool 和 IndexedDB，缺失时才请求服务器。', action: '触发懒加载', duration: '约 2 分钟', demo: 'hydrate' },
    { kicker: '用户意图进入队列', title: 'Transaction：乐观更新，但不冒失', body: '保存修改会生成可逆事务。内存立即变化，事务同时进入持久化队列；即使刷新或断网，用户意图仍能在恢复连接后重发。', action: '制造一次离线修改', duration: '约 3 分钟', demo: 'offline' },
    { kicker: '服务器广播事实', title: 'Delta Packet：确认不是一句“收到”', body: '服务器执行事务后产生带 sync ID 的增量包，并广播给所有客户端，包括发起者。包里可能包含服务端产生的历史记录等副作用。', action: '观察一次广播', duration: '约 3 分钟', demo: 'delta' },
    { kicker: '把意图放到新基线上', title: 'Rebase：两个人同时修改怎么办？', body: '远端变化抵达时，本地可能还有未确认事务。客户端先接受新的权威基线，再重放本地意图；最终顺序由服务器的 sync ID 决定。', action: '运行并发冲突', duration: '约 4 分钟', demo: 'conflict' },
    { kicker: '撤销也必须同步', title: 'Undo：不是倒带，而是一次新修改', body: '在协作系统里，历史不能被私自抹去。撤销会创建一笔反向事务，让其他客户端也收到同一个新事实。', action: '执行修改与撤销', duration: '约 3 分钟', demo: 'undo' }
  ];

  const clone = value => JSON.parse(JSON.stringify(value));
  const makeClient = () => ({ online: true, memory: clone(initialIssue), db: clone(initialIssue), dbSyncId: 1042, queue: [], missed: [], userHydrated: true });
  let state;
  let lessonIndex = 0;
  let activeTab = 'memory';
  let txSequence = 1;
  let timers = [];
  let toastTimer;

  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const delay = () => $('#slowNetwork').checked ? 1450 : 520;
  const schedule = (fn, ms) => { const id = window.setTimeout(fn, ms); timers.push(id); return id; };
  const wait = ms => new Promise(resolve => schedule(resolve, ms));

  function clearTimers() { timers.forEach(clearTimeout); timers = []; }

  function freshState() {
    return {
      server: { issue: clone(initialIssue), syncId: 1042, processed: 0, history: [] },
      a: makeClient(),
      b: makeClient(),
      snapshots: []
    };
  }

  function reset(showMessage = true) {
    clearTimers();
    state = freshState();
    txSequence = 1;
    $('#slowNetwork').checked = false;
    $('#dropNext').checked = false;
    $('#eventLog').innerHTML = '';
    log('SYS', '实验状态重置为 sync ID 1042', 'ok');
    render();
    if (showMessage) toast('实验已重置');
  }

  function log(source, message, type = '') {
    const li = document.createElement('li');
    li.className = type;
    const now = new Date();
    li.innerHTML = `<time>${now.toLocaleTimeString('zh-CN', { hour12: false, minute: '2-digit', second: '2-digit' })}</time><b>${source}</b><span>${message}</span>`;
    $('#eventLog').prepend(li);
  }

  function toast(message) {
    const el = $('#toast');
    el.textContent = message;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 2100);
  }

  function pulse(selector) {
    const el = $(selector);
    el.classList.remove('flash');
    void el.offsetWidth;
    el.classList.add('flash');
  }

  function animatePacket(lane, direction, label) {
    const packet = lane === 'a' ? $('#packetA') : $('#packetB');
    packet.textContent = label;
    packet.className = `packet ${direction}`;
    schedule(() => { packet.className = 'packet'; }, 950);
  }

  function readInputs(key) {
    return { title: $(`#${key}Title`).value.trim() || initialIssue.title, assignee: $(`#${key}Assignee`).value };
  }

  function createTransaction(key, changes, kind = 'update') {
    const client = state[key];
    const before = clone(client.memory);
    Object.assign(client.memory, changes);
    const tx = { id: `tx-${txSequence++}`, client: key, kind, before, changes: clone(changes), status: 'queued' };
    client.queue.push(tx);
    state.snapshots.push({ client: key, before, after: clone(client.memory) });
    log(key.toUpperCase(), `${tx.id} 已写入持久化事务队列`, 'warn');
    render();
    pulse(`#client${key.toUpperCase()}`);
    if (client.online) sendNext(key);
    else toast(`客户端 ${key.toUpperCase()} 离线：事务已安全保存在本地`);
    return tx;
  }

  function commit(key) {
    const values = readInputs(key);
    const current = state[key].memory;
    const changes = {};
    if (values.title !== current.title) changes.title = values.title;
    if (values.assignee !== current.assignee) changes.assignee = values.assignee;
    if (!Object.keys(changes).length) { toast('先修改标题或负责人'); return; }
    createTransaction(key, changes);
  }

  function sendNext(key) {
    const client = state[key];
    if (!client.online) return;
    const tx = client.queue.find(item => item.status === 'queued');
    if (!tx) return;
    tx.status = 'sending';
    animatePacket(key, key === 'a' ? 'travel-right' : 'travel-left', 'TX');
    log(key.toUpperCase(), `${tx.id} 正在发往服务器`);
    render();
    schedule(() => processTransaction(tx), delay());
  }

  function processTransaction(tx) {
    const client = state[tx.client];
    if (!client.online) { tx.status = 'queued'; render(); return; }
    Object.assign(state.server.issue, tx.changes);
    state.server.syncId += 1;
    state.server.processed += 1;
    state.server.history.push({ syncId: state.server.syncId, txId: tx.id, client: tx.client, changes: clone(tx.changes) });
    tx.status = 'accepted';
    log('SERVER', `${tx.id} 已执行，生成 Δ${state.server.syncId}`, 'ok');
    pulse('#serverNode');
    render();
    const delta = { syncId: state.server.syncId, txId: tx.id, origin: tx.client, issue: clone(state.server.issue) };
    schedule(() => broadcast(delta), Math.max(240, delay() * .65));
  }

  function broadcast(delta) {
    log('SERVER', `广播 Δ${delta.syncId} 给全部客户端`);
    animatePacket('a', 'travel-left', 'Δ');
    animatePacket('b', 'travel-right', 'Δ');
    ['a', 'b'].forEach(key => receiveDelta(key, delta));
  }

  function receiveDelta(key, delta) {
    const client = state[key];
    if (!client.online) {
      client.missed.push(clone(delta));
      log(key.toUpperCase(), `离线，暂未接收 Δ${delta.syncId}`, 'warn');
      return;
    }
    if ($('#dropNext').checked) {
      $('#dropNext').checked = false;
      client.missed.push(clone(delta));
      log(key.toUpperCase(), `故障注入：Δ${delta.syncId} 被丢弃`, 'error');
      toast(`已模拟 ${key.toUpperCase()} 丢包`);
      return;
    }
    applyDelta(key, delta);
  }

  function applyDelta(key, delta) {
    const client = state[key];
    if (delta.syncId <= client.dbSyncId) return;
    client.db = clone(delta.issue);
    client.dbSyncId = delta.syncId;
    client.queue = client.queue.filter(tx => tx.id !== delta.txId);
    client.memory = clone(delta.issue);
    const pending = client.queue.filter(tx => tx.status !== 'accepted');
    pending.forEach(tx => Object.assign(client.memory, tx.changes));
    if (pending.length) log(key.toUpperCase(), `应用 Δ${delta.syncId}，再重放 ${pending.length} 笔本地事务（Rebase）`, 'warn');
    else log(key.toUpperCase(), `已应用 Δ${delta.syncId}，内存与 IndexedDB 更新`, 'ok');
    pulse(`#client${key.toUpperCase()}`);
    render();
    sendNext(key);
  }

  function toggleConnection(key, force) {
    const client = state[key];
    client.online = typeof force === 'boolean' ? force : !client.online;
    log(key.toUpperCase(), client.online ? '连接恢复，开始校验 sync ID' : '网络连接已断开', client.online ? 'ok' : 'error');
    if (client.online) {
      const missing = client.missed.sort((a, b) => a.syncId - b.syncId);
      client.missed = [];
      if (missing.length) {
        log(key.toUpperCase(), `发现 ${missing.length} 个缺失增量包，开始补齐`, 'warn');
        missing.forEach(delta => applyDelta(key, delta));
      }
      if (client.dbSyncId < state.server.syncId && !missing.length) {
        applyDelta(key, { syncId: state.server.syncId, txId: null, origin: 'server', issue: clone(state.server.issue) });
      }
      sendNext(key);
    }
    render();
  }

  function undo(key = 'a') {
    const snapshot = [...state.snapshots].reverse().find(item => item.client === key);
    if (!snapshot) { toast('还没有可以撤销的修改'); return; }
    state.snapshots = state.snapshots.filter(item => item !== snapshot);
    log(key.toUpperCase(), 'Undo 创建了一笔新的反向事务，而非删除历史', 'warn');
    createTransaction(key, { title: snapshot.before.title, assignee: snapshot.before.assignee }, 'undo');
  }

  function renderClient(key) {
    const client = state[key];
    const prefix = key;
    const title = $(`#${prefix}Title`);
    const assignee = $(`#${prefix}Assignee`);
    if (document.activeElement !== title) title.value = client.memory.title;
    if (document.activeElement !== assignee) assignee.value = client.memory.assignee;
    $(`#${prefix}Memory`).textContent = client.queue.length ? '乐观态' : '已同步';
    $(`#${prefix}Db`).textContent = `v${client.dbSyncId}`;
    $(`#${prefix}Queue`).textContent = String(client.queue.length);
    const button = $(`.connection[data-client="${key}"]`);
    button.classList.toggle('online', client.online);
    button.classList.toggle('offline', !client.online);
    button.setAttribute('aria-pressed', String(!client.online));
    button.querySelector('span').textContent = client.online ? '在线' : '离线';
  }

  function inspectorData() {
    if (activeTab === 'database') return {
      clientA_IndexedDB: { syncId: state.a.dbSyncId, Issue: state.a.db },
      server_database: { syncId: state.server.syncId, Issue: state.server.issue },
      clientB_IndexedDB: { syncId: state.b.dbSyncId, Issue: state.b.db }
    };
    if (activeTab === 'queue') return {
      clientA_transactions: state.a.queue,
      clientA_missing_deltas: state.a.missed.map(d => d.syncId),
      clientB_transactions: state.b.queue,
      clientB_missing_deltas: state.b.missed.map(d => d.syncId)
    };
    return {
      clientA_memory: state.a.memory,
      objectPool_A: state.a.userHydrated ? ['Issue:ENG-42', `User:${state.a.memory.assignee}`] : ['Issue:ENG-42'],
      clientB_memory: state.b.memory,
      objectPool_B: state.b.userHydrated ? ['Issue:ENG-42', `User:${state.b.memory.assignee}`] : ['Issue:ENG-42']
    };
  }

  function render() {
    renderClient('a'); renderClient('b');
    $('#serverSyncId').textContent = state.server.syncId;
    $('#serverTitle').textContent = state.server.issue.title;
    $('#serverAssignee').textContent = `负责人 · ${state.server.issue.assignee}`;
    $('#processedCount').textContent = state.server.processed;
    $('#historyCount').textContent = state.server.history.length;
    $('#inspectorOutput').textContent = JSON.stringify(inspectorData(), null, 2);
  }

  function renderLesson() {
    const lesson = lessons[lessonIndex];
    $('#lessonNumber').textContent = `${String(lessonIndex + 1).padStart(2, '0')} / ${String(lessons.length).padStart(2, '0')}`;
    $('#lessonDuration').textContent = lesson.duration;
    $('#lessonKicker').textContent = lesson.kicker;
    $('#lessonTitle').textContent = lesson.title;
    $('#lessonBody').textContent = lesson.body;
    $('#lessonAction').textContent = lesson.action;
    $('#progressFill').style.width = `${((lessonIndex + 1) / lessons.length) * 100}%`;
  }

  async function runDemo(name) {
    reset(false);
    if (name === 'model') {
      activeTab = 'memory';
      log('MODEL', 'Issue 通过 UUID 进入 Object Pool，属性由元数据描述', 'ok');
      $('#inspectorOutput').textContent = JSON.stringify({
        ModelRegistry: { Issue: { loadStrategy: 'instant', properties: ['title', 'assigneeId', 'status'], observable: true }, User: { loadStrategy: 'lazy', properties: ['name'] } },
        ObjectPool: { 'Issue:ENG-42': state.a.memory }
      }, null, 2);
      pulse('#clientA'); toast('元数据决定对象如何加载、观察与同步'); return;
    }
    if (name === 'bootstrap') {
      state.a.memory = {}; state.a.db = {}; state.a.dbSyncId = 0; state.a.userHydrated = false; render();
      log('A', '① 创建 IndexedDB 与 Object Store'); await wait(650);
      log('A', '② 请求服务器快照与 lastSyncId'); animatePacket('a', 'travel-right', 'GET'); await wait(750);
      state.a.db = clone(state.server.issue); state.a.dbSyncId = state.server.syncId; render(); log('A', '③ 快照写入 IndexedDB', 'ok'); await wait(700);
      state.a.memory = clone(state.a.db); render(); log('A', '④ 即时模型进入 Object Pool 并启用观察', 'ok'); await wait(600);
      log('A', '⑤ 建立 WebSocket，开始接收 Delta', 'ok'); pulse('#clientA'); toast('客户端 A 已完成启动'); return;
    }
    if (name === 'hydrate') {
      state.a.userHydrated = false; activeTab = 'memory'; render(); log('A', 'Issue 只有 assigneeId，User 尚未装入内存'); await wait(650);
      animatePacket('a', 'travel-right', 'GET'); log('A', '访问 issue.assignee：Object Pool 未命中，请求 User'); await wait(800);
      state.a.userHydrated = true; render(); log('A', 'User:Alice 写入本地并完成 Hydration', 'ok'); toast('懒加载只在真正访问对象时发生'); return;
    }
    if (name === 'offline') return runOfflineScenario();
    if (name === 'delta') {
      $('#aTitle').value = '理解 Delta Packet'; commit('a'); toast('留意事务和增量包的两个方向'); return;
    }
    if (name === 'conflict') return runConflictScenario();
    if (name === 'undo') return runUndoScenario();
    $('#aTitle').value = '从一次修改看懂同步'; commit('a');
  }

  async function runOfflineScenario() {
    reset(false); toggleConnection('a', false); await wait(450);
    $('#aTitle').value = '离线写下的标题'; commit('a'); await wait(900);
    toggleConnection('a', true); toast('恢复连接：持久化事务开始重发');
  }

  async function runConflictScenario() {
    reset(false); toggleConnection('a', false); await wait(350);
    $('#aAssignee').value = 'Bob'; commit('a'); await wait(500);
    $('#bAssignee').value = 'Carol'; commit('b'); await wait(delay() * 2.3);
    toggleConnection('a', true); toast('A 的事务后到服务器，因此最终 Bob 获胜');
  }

  async function runUndoScenario() {
    reset(false); $('#aTitle').value = '一个需要撤销的标题'; commit('a'); await wait(delay() * 2.6); undo('a'); toast('Undo 已生成一笔新的反向事务');
  }

  $$('.connection').forEach(button => button.addEventListener('click', () => toggleConnection(button.dataset.client)));
  $$('[data-commit]').forEach(button => button.addEventListener('click', () => commit(button.dataset.commit)));
  $$('.tab').forEach(button => button.addEventListener('click', () => {
    activeTab = button.dataset.tab;
    $$('.tab').forEach(tab => tab.classList.toggle('active', tab === button));
    render();
  }));
  $('#lessonAction').addEventListener('click', () => runDemo(lessons[lessonIndex].demo));
  $('#prevLesson').addEventListener('click', () => { lessonIndex = (lessonIndex - 1 + lessons.length) % lessons.length; renderLesson(); });
  $('#nextLesson').addEventListener('click', () => { lessonIndex = (lessonIndex + 1) % lessons.length; renderLesson(); });
  $('#resetButton').addEventListener('click', () => reset());
  $('#offlineScenario').addEventListener('click', runOfflineScenario);
  $('#conflictScenario').addEventListener('click', runConflictScenario);
  $('#undoScenario').addEventListener('click', runUndoScenario);
  $('#clearLog').addEventListener('click', () => { $('#eventLog').innerHTML = ''; log('SYS', '事件流已清空'); });
  document.addEventListener('keydown', event => { if (event.key.toLowerCase() === 'r' && !/INPUT|SELECT/.test(document.activeElement.tagName)) reset(); });

  reset(false);
  renderLesson();
})();
