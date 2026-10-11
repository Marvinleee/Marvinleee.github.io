(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  // Reading progress + generated table of contents.
  const sections = $$('section[data-section]');
  const toc = $('#toc');
  sections.forEach((section, index) => {
    const heading = $('h2', section);
    if (!heading) return;
    const link = document.createElement('a');
    link.href = `#${section.id}`;
    link.dataset.index = String(index + 1).padStart(2, '0');
    link.textContent = heading.textContent;
    toc.appendChild(link);
  });

  const updateProgress = () => {
    const root = document.documentElement;
    const total = root.scrollHeight - root.clientHeight;
    const pct = total > 0 ? Math.min(100, Math.max(0, (root.scrollTop / total) * 100)) : 0;
    $('#reading-progress').style.width = `${pct}%`;
    $('#progress-label').textContent = `${Math.round(pct)}%`;
  };
  updateProgress();
  addEventListener('scroll', updateProgress, { passive: true });

  const tocLinks = $$('#toc a');
  const observer = new IntersectionObserver((entries) => {
    const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
    if (!visible.length) return;
    const id = visible[0].target.id;
    tocLinks.forEach(link => link.classList.toggle('active', link.hash === `#${id}`));
  }, { rootMargin: '-18% 0px -66% 0px', threshold: [0, .1] });
  sections.forEach(section => observer.observe(section));

  const tocToggle = $('#toc-toggle');
  const tocPanel = $('#toc-panel');
  tocToggle.addEventListener('click', () => {
    const open = tocPanel.classList.toggle('open');
    tocToggle.setAttribute('aria-expanded', String(open));
  });
  tocLinks.forEach(link => link.addEventListener('click', () => {
    tocPanel.classList.remove('open');
    tocToggle.setAttribute('aria-expanded', 'false');
  }));

  // Paragraph anchors.
  const toast = $('#toast');
  let toastTimer;
  $$('section[data-section] > p').forEach((paragraph, index) => {
    if (!paragraph.id) paragraph.id = `p-${String(index + 1).padStart(3, '0')}`;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'paragraph-anchor';
    button.title = '复制本段链接';
    button.setAttribute('aria-label', '复制本段链接');
    button.textContent = '#';
    button.addEventListener('click', async () => {
      const url = `${location.href.split('#')[0]}#${paragraph.id}`;
      try { await navigator.clipboard.writeText(url); } catch { location.hash = paragraph.id; }
      toast.classList.add('show');
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => toast.classList.remove('show'), 1600);
    });
    paragraph.prepend(button);
  });

  // Transformer Math Explorer.
  const explorerInput = $('#transformer-input');
  const tokenStrip = $('#token-strip');
  const temperature = $('#temperature');
  let selectedToken = 0;

  const segment = (text) => {
    const clean = text.trim();
    if (!clean) return ['Token'];
    if (Intl.Segmenter) {
      const seg = new Intl.Segmenter('zh-CN', { granularity: 'word' });
      const parts = [...seg.segment(clean)].map(item => item.segment).filter(part => part.trim());
      if (parts.length > 1 && parts.length <= 12) return parts;
    }
    return [...clean.replace(/\s+/g, '')].slice(0, 12);
  };
  const hash = (value) => {
    let h = 2166136261;
    for (let i = 0; i < value.length; i++) { h ^= value.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  };
  const vector = (token, channel) => {
    let seed = hash(`${token}:${channel}`);
    return Array.from({ length: 4 }, () => {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      return ((seed / 4294967295) * 2 - 1);
    });
  };
  const fmtVec = (vec) => `[${vec.map(v => v.toFixed(2)).join(', ')}]`;
  const softmax = (values, temp) => {
    const scaled = values.map(v => v / temp);
    const max = Math.max(...scaled);
    const exps = scaled.map(v => Math.exp(v - max));
    const sum = exps.reduce((a, b) => a + b, 0);
    return exps.map(v => v / sum);
  };
  const renderExplorer = () => {
    const tokens = segment(explorerInput.value);
    selectedToken = Math.min(selectedToken, tokens.length - 1);
    tokenStrip.replaceChildren(...tokens.map((token, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = token;
      button.classList.toggle('active', index === selectedToken);
      button.addEventListener('click', () => { selectedToken = index; renderExplorer(); });
      return button;
    }));
    const q = vector(tokens[selectedToken], 'q');
    const k = tokens.map(token => vector(token, 'k'));
    const v = tokens.map(token => vector(token, 'v'));
    const scores = k.map(key => q.reduce((sum, n, i) => sum + n * key[i], 0) / 2);
    const weights = softmax(scores, Number(temperature.value));
    const output = [0, 0, 0, 0];
    weights.forEach((weight, tokenIndex) => v[tokenIndex].forEach((n, i) => { output[i] += weight * n; }));

    $('#temperature-value').textContent = Number(temperature.value).toFixed(2);
    $('#query-label').textContent = `QUERY / ${tokens[selectedToken]}`;
    $('#vector-grid').innerHTML = [
      ['Q', q], ['K', k[selectedToken]], ['V', v[selectedToken]]
    ].map(([label, vec]) => `<div class="vector"><span>${label}</span><code>${fmtVec(vec)}</code></div>`).join('');
    $('#attention-bars').innerHTML = tokens.map((token, i) => `<div class="attn-row"><span>${token}</span><div class="bar-track"><div class="bar-fill" style="width:${(weights[i] * 100).toFixed(1)}%"></div></div><b>${(weights[i] * 100).toFixed(1)}%</b></div>`).join('');
    $('#attention-result').innerHTML = `加权输出 <strong>O</strong> = ${fmtVec(output)}<br>最高注意力：<strong>${tokens[weights.indexOf(Math.max(...weights))]}</strong>`;
  };
  explorerInput.addEventListener('input', () => { selectedToken = 0; renderExplorer(); });
  temperature.addEventListener('input', renderExplorer);
  renderExplorer();

  // DeepSeek resource calculator.
  const formatBytes = (bytes) => {
    const units = ['B', 'KiB', 'MiB', 'GiB', 'TiB'];
    let value = bytes, unit = 0;
    while (value >= 1024 && unit < units.length - 1) { value /= 1024; unit++; }
    return `${value >= 100 ? value.toFixed(0) : value >= 10 ? value.toFixed(1) : value.toFixed(2)} ${units[unit]}`;
  };
  const compact = (value) => value >= 1e12 ? `${(value / 1e12).toFixed(1)} T` : value >= 1e9 ? `${(value / 1e9).toFixed(1)} G` : `${value.toFixed(0)}`;
  const updateCalculator = () => {
    const context = Number($('#context').value);
    const batch = Number($('#batch').value);
    const weightBytes = Number($('#weight-precision').value);
    const kvBytes = Number($('#kv-precision').value);
    const ep = Number($('#expert-parallel').value);
    const accelerators = Number($('#accelerators').value);

    const modelWeight = 671e9 * weightBytes;
    const activeWeight = 37e9 * weightBytes;
    const kvPerToken = 61 * (512 + 64) * kvBytes;
    const kvPerRequest = context * kvPerToken;
    const flopsPerToken = 2 * 37e9;
    const hbmPerToken = activeWeight / batch + kvPerRequest;
    const maxMoePayload = 58 * 7168 * 2 * 2 * 8;
    const remoteFraction = ep === 1 ? 0 : (ep - 1) / ep;
    const moePayload = maxMoePayload * remoteFraction;
    const capacityPerAccelerator = modelWeight / accelerators;

    $('#context-out').textContent = `${Math.round(context / 1024)}K`;
    $('#batch-out').textContent = String(batch);
    $('#accelerators-out').textContent = String(accelerators);
    $('#metric-model-weight').textContent = formatBytes(modelWeight);
    $('#metric-active-weight').textContent = formatBytes(activeWeight);
    $('#metric-kv').textContent = formatBytes(kvPerRequest);
    $('#metric-flops').textContent = `${compact(flopsPerToken)}F`;
    $('#metric-hbm').textContent = formatBytes(hbmPerToken);
    $('#metric-moe').textContent = formatBytes(moePayload);

    const dominant = activeWeight / batch > kvPerRequest ? '权重读取仍占主导' : 'KV 扫描已超过摊销后的权重读取';
    $('#calc-reading').innerHTML = `每颗 accelerator 平均承载 <strong>${formatBytes(capacityPerAccelerator)}</strong> 权重；当前设置下，${dominant}。EP=${ep} 的极简均匀放置假设给出约 <strong>${(remoteFraction * 100).toFixed(0)}%</strong> 的远端专家比例。`;
  };
  $$('#calc-form input, #calc-form select').forEach(control => control.addEventListener('input', updateCalculator));
  updateCalculator();

  // Scale map.
  const mapData = [
    { title: 'Tensor Core', object: 'MMA tile', bandwidth: 'Register-class', latency: 'ns 以内', energy: '最低', description: '矩阵被切成 tile；数据尽量驻留寄存器与片上数据通路。此时主要问题是数据复用、占用率和流水线。' },
    { title: 'GPU Die', object: 'Activation tile', bandwidth: 'TB/s 级片上', latency: 'ns 级', energy: '低', description: '多个 SM/Tensor Core 通过片上网络协作。L2 与 SRAM 的命中决定 HBM 往返次数。' },
    { title: 'GPU + HBM', object: 'Weights / KV', bandwidth: 'TB/s 级 HBM', latency: '100ns 量级', energy: '中', description: 'Decode 常在这里暴露 memory wall。FlashAttention 与 MLA 都在减少跨过这一边界的数据量。' },
    { title: 'Scale-up Domain', object: 'Collective / MoE', bandwidth: 'TB/s 级 / GPU', latency: 'μs 级', energy: '中高', description: 'Tensor Parallel 的 collective 与 Expert Parallel 的 dispatch 进入执行关键路径；拓扑和拥塞开始决定有效算力。' },
    { title: 'Rack', object: 'Batched tokens', bandwidth: '百 TB/s 聚合', latency: '数 μs', energy: '高', description: '计算、供电、液冷与 NVSwitch/UnifiedBus 被当作一个系统共同设计。容量已不是唯一问题，资源利用率成为核心。' },
    { title: 'Pod / SuperPoD', object: 'Expert traffic', bandwidth: '多机柜聚合', latency: 'μs—十 μs', energy: '更高', description: '系统边界开始分叉：以 rack 为 scale-up 单元继续 scale-out，或扩大统一内存语义的超节点范围。' },
    { title: 'AI Factory', object: 'Token streams', bandwidth: 'Pb/s 级 fabric', latency: '拓扑相关', energy: '系统级', description: '网络、电力、冷却、调度与故障域共同决定 Tokens/s/MW 和 Cost/Token。光互联承担更长距离的高带宽传输。' }
  ];
  const shortLabels = ['TENSOR', 'DIE', 'HBM', 'SCALE-UP', 'RACK', 'SUPERPOD', 'FACTORY'];
  const labels = $('#map-labels');
  labels.innerHTML = shortLabels.map(label => `<span>${label}</span>`).join('');
  const scale = $('#map-scale');
  const renderMap = () => {
    const index = Number(scale.value);
    const item = mapData[index];
    $('#map-step').textContent = `${String(index + 1).padStart(2, '0')} / 07`;
    $('#map-title').textContent = item.title;
    $('#map-description').textContent = item.description;
    $('#map-object').textContent = item.object;
    $('#map-bandwidth').textContent = item.bandwidth;
    $('#map-latency').textContent = item.latency;
    $('#map-energy').textContent = item.energy;
    $$('.orbit').forEach((orbit, orbitIndex) => orbit.classList.toggle('active', orbitIndex === 6 - index));
    $$('#map-labels span').forEach((label, labelIndex) => label.classList.toggle('active', labelIndex === index));
  };
  scale.addEventListener('input', renderMap);
  $('#map-prev').addEventListener('click', () => { scale.value = Math.max(0, Number(scale.value) - 1); renderMap(); });
  $('#map-next').addEventListener('click', () => { scale.value = Math.min(6, Number(scale.value) + 1); renderMap(); });
  renderMap();
})();
