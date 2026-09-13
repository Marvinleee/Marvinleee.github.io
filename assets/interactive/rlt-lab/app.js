const $ = (id) => document.getElementById(id);
const controls = { tokenCount: $('tokenCount'), split: $('split'), layers: $('layers'), window: $('window') };
let selected = 8;
let timer = null;

function sub(n) {
  return String(n).replace(/\d/g, d => '₀₁₂₃₄₅₆₇₈₉'[Number(d)]);
}

function cellList(count, start = 1, local = false) {
  const el = document.createElement('div');
  el.className = `cells${local ? ' local' : ''}`;
  for (let i = 0; i < count; i++) {
    const cell = document.createElement('span');
    cell.textContent = `x${sub(start + i)}`;
    el.appendChild(cell);
  }
  return el.innerHTML;
}

function render() {
  const count = +controls.tokenCount.value;
  controls.split.max = Math.max(1, count - 1);
  if (+controls.split.value >= count) controls.split.value = count - 1;
  const split = +controls.split.value;
  const layers = +controls.layers.value;
  const win = +controls.window.value;
  selected = Math.min(selected, count);
  $('tokenCountOut').textContent = count;
  $('splitOut').textContent = split;
  $('layersOut').textContent = layers;
  $('windowOut').textContent = win;

  const timeline = $('timeline');
  timeline.style.setProperty('--count', count);
  timeline.innerHTML = '';
  for (let t = 1; t <= count; t++) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `token-step ${t > split ? 'response' : 'prompt'}${t === selected ? ' active' : ''}`;
    button.setAttribute('aria-label', `查看第 ${t} 个 Token`);
    button.innerHTML = `${t === split + 1 ? '<span class="boundary">RESPONSE →</span>' : ''}<span class="kind">${t <= split ? 'PROMPT' : 'RESPONSE'} · x${sub(t)}</span><span class="encoder">Encoder → e${sub(t)}</span><span class="decoder">Merge<br>↓<br>Dφ × ${layers}</span><span class="state">H${sub(t)} →</span>`;
    button.addEventListener('click', () => { selected = t; render(); });
    timeline.appendChild(button);
  }

  $('stepLabel').textContent = `x${sub(selected)} · ${selected <= split ? 'Prompt' : 'Response'}`;
  $('pathDepth').textContent = selected * layers;
  $('perToken').textContent = layers * 2;
  $('globalCount').textContent = selected;
  $('globalCells').innerHTML = cellList(selected);
  const localCount = Math.min(selected, Math.max(0, win - 1));
  $('localCount').textContent = localCount;
  $('localCells').className = 'cells local';
  $('localCells').innerHTML = cellList(localCount, Math.max(1, selected - localCount + 1), true);
}

Object.values(controls).forEach(input => input.addEventListener('input', render));

document.querySelectorAll('.tabs button').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.tabs button').forEach(b => { b.classList.toggle('active', b === button); b.setAttribute('aria-pressed', b === button ? 'true' : 'false'); });
    document.querySelectorAll('.view').forEach(view => { view.hidden = true; view.classList.remove('active-view'); });
    const view = $(`${button.dataset.view}View`);
    view.hidden = false;
    view.classList.add('active-view');
  });
});

$('play').addEventListener('click', () => {
  if (timer) { clearInterval(timer); timer = null; $('play').textContent = '▶ 逐 Token 播放'; return; }
  selected = 1; render(); $('play').textContent = '■ 停止';
  timer = setInterval(() => {
    if (selected >= +controls.tokenCount.value) { clearInterval(timer); timer = null; $('play').textContent = '▶ 重新播放'; return; }
    selected += 1; render();
  }, 700);
});

let stale = false;
$('toggleStale').addEventListener('click', () => {
  stale = !stale;
  const result = $('replayResult');
  if (stale) {
    result.className = 'replay-result error';
    result.innerHTML = '<strong>不再是当前策略状态</strong><p>旧 sₜ、Encoder KV 与 Decoder KV 都依赖旧参数；直接复用会把另一个计算图的中间结果塞进当前策略。</p>';
    $('toggleStale').textContent = '改为当前参数完整回放';
  } else {
    result.className = 'replay-result ok';
    result.innerHTML = '<strong>状态与当前参数重新对齐</strong><p>从相同起点消费相同 Token，重建完整状态；行为概率 log μ 仍保留为重要性比率的分母。</p>';
    $('toggleStale').textContent = '再次尝试复用旧状态';
  }
});

render();
