"use strict";

const $ = (id) => document.getElementById(id);
const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));
const controls = {
  wavelength: $("wavelength"), channels: $("channels"), spacing: $("spacing"),
  modulation: $("modulation"), pattern: $("pattern"), baud: $("baud"),
  electricalLoss: $("electrical-loss"), jitter: $("jitter"), temperature: $("temperature"),
  opticalLoss: $("optical-loss"), launchPower: $("launch-power")
};
const canvases = { scene: $("link-scene"), waveform: $("waveform"), eye: $("eye"), spectrum: $("spectrum") };
const reduced = matchMedia("(prefers-reduced-motion: reduce)");
let moving = !reduced.matches;
let phase = 0;
let lastTime = performance.now();

const presets = {
  nominal: { wavelength: 1311, channels: 4, spacing: 800, modulation: "PAM4", pattern: "prbs15", baud: 53.125, electricalLoss: 6, jitter: .4, temperature: 35, opticalLoss: 4, launchPower: 2 },
  detune: { wavelength: 1311, channels: 8, spacing: 800, modulation: "PAM4", pattern: "prbs15", baud: 53.125, electricalLoss: 6, jitter: .5, temperature: 57, opticalLoss: 4, launchPower: 2 },
  loss: { wavelength: 1311, channels: 4, spacing: 800, modulation: "PAM4", pattern: "prbs31", baud: 106.25, electricalLoss: 15, jitter: .8, temperature: 35, opticalLoss: 5, launchPower: 2 },
  noise: { wavelength: 1291, channels: 4, spacing: 800, modulation: "NRZ", pattern: "prbs7", baud: 112, electricalLoss: 10, jitter: 2.4, temperature: 42, opticalLoss: 8, launchPower: 0 }
};

function state() {
  return Object.fromEntries(Object.entries(controls).map(([key, control]) => [key, control.tagName === "SELECT" && ["modulation", "pattern"].includes(key) ? control.value : Number(control.value)]));
}

function prbs(name, count) {
  if (name === "clock") return Array.from({ length: count }, (_, i) => i % 2);
  const order = Number(name.replace("prbs", ""));
  const secondTap = { 7: 6, 15: 14, 31: 28 }[order];
  let register = order === 31 ? 0x7fffffff : (1 << order) - 1;
  const bits = [];
  for (let i = 0; i < count; i++) {
    bits.push(register & 1);
    const feedback = (register ^ (register >>> (order - secondTap))) & 1;
    register = (register >>> 1) | (feedback << (order - 1));
  }
  return bits;
}

function symbols(s, count = 192) {
  const bits = prbs(s.pattern, count * 2 + 4);
  if (s.modulation === "NRZ") return bits.slice(0, count).map((bit) => bit ? 1 : -1);
  const gray = { "00": -1, "01": -1 / 3, "11": 1 / 3, "10": 1 };
  return Array.from({ length: count }, (_, i) => gray[`${bits[i * 2]}${bits[i * 2 + 1]}`]);
}

function derive(s) {
  const bitsPerSymbol = s.modulation === "PAM4" ? 2 : 1;
  const uiPs = 1000 / s.baud;
  const thermalDetune = .08 * (s.temperature - 35);
  const ringLinewidth = 1.5;
  const opticalTransmission = 1 / (1 + Math.pow((2 * thermalDetune) / ringLinewidth, 2));
  const detunePenalty = -10 * Math.log10(opticalTransmission);
  const rxPower = s.launchPower - s.opticalLoss - detunePenalty;
  const sensitivity = s.modulation === "PAM4" ? -7 : -10;
  const margin = rxPower - sensitivity;
  const lossPenalty = clamp((s.electricalLoss - 2) / 20, 0, .8);
  const jitterPenalty = clamp((s.jitter / uiPs) * 2.2, 0, .8);
  const formatPenalty = s.modulation === "PAM4" ? .1 : 0;
  const powerPenalty = margin < 0 ? clamp(-margin / 10, 0, .85) : 0;
  const eye = clamp((1 - lossPenalty - jitterPenalty - formatPenalty) * Math.sqrt(opticalTransmission) - powerPenalty, .015, .96);
  const ber = Math.min(.25, Math.pow(10, -2.6 - eye * 10.2));
  const fecThreshold = 2e-4;
  const status = ber < 1e-8 ? "ok" : ber < fecThreshold ? "warn" : "fail";
  return { bitsPerSymbol, uiPs, thermalDetune, opticalTransmission, detunePenalty, rxPower, sensitivity, margin, eye, ber, fecThreshold, status, grossGbps: s.baud * bitsPerSymbol * s.channels };
}

function fit(canvas) {
  const rect = canvas.getBoundingClientRect();
  const ratio = Math.min(devicePixelRatio || 1, 2);
  const width = Math.max(1, Math.round(rect.width * ratio));
  const height = Math.max(1, Math.round(rect.height * ratio));
  if (canvas.width !== width || canvas.height !== height) { canvas.width = width; canvas.height = height; }
  const ctx = canvas.getContext("2d");
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  return { ctx, w: rect.width, h: rect.height };
}

function grid(ctx, w, h, xStep = 40, yStep = 32) {
  ctx.strokeStyle = "rgba(133,176,194,.10)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let x = 0; x <= w; x += xStep) { ctx.moveTo(x, 0); ctx.lineTo(x, h); }
  for (let y = 0; y <= h; y += yStep) { ctx.moveTo(0, y); ctx.lineTo(w, y); }
  ctx.stroke();
}

function wavelengthColor(wavelength, alpha = 1) {
  const hue = 175 + clamp((wavelength - 1260) / 100) * 105;
  return `hsla(${hue},88%,66%,${alpha})`;
}

function channelWavelengths(s) {
  const c = 299792.458;
  const centerFrequency = c / s.wavelength;
  const spacingThz = s.spacing / 1000;
  return Array.from({ length: s.channels }, (_, i) => c / (centerFrequency + (i - (s.channels - 1) / 2) * spacingThz));
}

function roundedBox(ctx, x, y, w, h, label, sublabel, color) {
  ctx.fillStyle = "rgba(15,25,34,.96)";
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.2;
  ctx.beginPath(); ctx.roundRect(x, y, w, h, 10); ctx.fill(); ctx.stroke();
  ctx.fillStyle = "#e7f0f2"; ctx.font = "700 12px system-ui"; ctx.textAlign = "center"; ctx.fillText(label, x + w / 2, y + h / 2 - 4);
  ctx.fillStyle = "#8197a0"; ctx.font = "10px ui-monospace, monospace"; ctx.fillText(sublabel, x + w / 2, y + h / 2 + 13);
}

function drawScene(s, d) {
  const { ctx, w, h } = fit(canvases.scene);
  ctx.clearRect(0, 0, w, h); grid(ctx, w, h, 54, 42);
  const compact = w < 700;
  const y = compact ? h * .28 : h * .38;
  const nodes = compact
    ? [{ x: .03, y: .10, w: .22, h: .18, a: "交换 ASIC", b: "PCS · FEC · SerDes", c: "#62a9ff" }, { x: .39, y: .10, w: .24, h: .18, a: "NPO 光引擎", b: "EIC · Driver · PIC", c: "#55f2d1" }, { x: .75, y: .10, w: .22, h: .18, a: "接收端", b: "PD · TIA · CDR", c: "#b59bff" }]
    : [{ x: .035, y: .28, w: .19, h: .23, a: "交换 ASIC", b: "PCS · FEC · SerDes", c: "#62a9ff" }, { x: .405, y: .24, w: .20, h: .31, a: "NPO 光引擎", b: "EIC · Driver · PIC", c: "#55f2d1" }, { x: .79, y: .28, w: .17, h: .23, a: "接收端", b: "PD · TIA · CDR", c: "#b59bff" }];
  nodes.forEach((n) => roundedBox(ctx, n.x * w, n.y * h, n.w * w, n.h * h, n.a, n.b, n.c));
  const startX = nodes[0].x * w + nodes[0].w * w;
  const engineX = nodes[1].x * w;
  const engineOut = (nodes[1].x + nodes[1].w) * w;
  const receiverX = nodes[2].x * w;
  const pathY = y;
  ctx.lineCap = "round";
  ctx.strokeStyle = "rgba(255,197,108,.42)"; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(startX, pathY); ctx.lineTo(engineX, pathY); ctx.stroke();
  const waves = channelWavelengths(s);
  waves.forEach((lambda, i) => {
    const offset = (i - (waves.length - 1) / 2) * Math.min(2.4, 15 / waves.length);
    ctx.strokeStyle = wavelengthColor(lambda, .56); ctx.lineWidth = Math.max(1.2, 5 / Math.sqrt(waves.length));
    ctx.beginPath(); ctx.moveTo(engineOut, pathY + offset); ctx.bezierCurveTo((engineOut + receiverX) / 2, pathY + offset - 18, (engineOut + receiverX) / 2, pathY + offset + 18, receiverX, pathY + offset); ctx.stroke();
  });
  const symbolList = symbols(s, 24);
  for (let i = 0; i < 8; i++) {
    const t = (phase + i / 8) % 1;
    const x = startX + (engineX - startX) * t;
    const level = symbolList[i] || 0;
    ctx.fillStyle = d.status === "fail" ? "#ff6f7f" : "#ffc56c";
    ctx.beginPath(); ctx.arc(x, pathY - level * 13, 3.4, 0, Math.PI * 2); ctx.fill();
  }
  for (let i = 0; i < Math.min(14, s.channels * 2); i++) {
    const t = (phase * .72 + i / Math.min(14, s.channels * 2)) % 1;
    const x = engineOut + (receiverX - engineOut) * t;
    const lambda = waves[i % waves.length];
    const alpha = .35 + .65 * d.opticalTransmission;
    ctx.fillStyle = wavelengthColor(lambda, alpha);
    ctx.shadowColor = wavelengthColor(lambda, .7); ctx.shadowBlur = 10;
    ctx.beginPath(); ctx.arc(x, pathY + Math.sin(t * 18 + i) * 9, 3.8, 0, Math.PI * 2); ctx.fill();
  }
  ctx.shadowBlur = 0;
  ctx.fillStyle = "#728993"; ctx.font = "10px ui-monospace, monospace"; ctx.textAlign = "center";
  ctx.fillText(`XSR+ electrical · ${s.electricalLoss.toFixed(1)} dB`, (startX + engineX) / 2, pathY + 31);
  ctx.fillText(`fiber · ${s.channels}λ · ${s.opticalLoss.toFixed(1)} dB`, (engineOut + receiverX) / 2, pathY + 31);
  if (!compact) {
    ctx.fillStyle = "rgba(85,242,209,.07)"; ctx.fillRect(engineX - 18, h * .12, engineOut - engineX + 36, h * .60);
    ctx.fillStyle = "#69808b"; ctx.fillText("NEAR-PACKAGE OPTICAL ENGINE", (engineX + engineOut) / 2, h * .68);
  }
}

function sampledSignal(list, x, s, d, trace = 0) {
  const index = Math.floor(x);
  const fraction = x - index;
  const current = list[((index % list.length) + list.length) % list.length];
  const previous = list[(((index - 1) % list.length) + list.length) % list.length];
  const bandwidth = clamp(1.25 - s.electricalLoss / 21, .22, 1);
  const transition = 1 - Math.exp(-fraction * (2.2 + bandwidth * 7));
  const isi = previous + (current - previous) * transition;
  const deterministicNoise = Math.sin(x * 19.7 + trace * 4.13) * (.015 + s.jitter / d.uiPs * .38);
  const crosstalk = Math.sin(x * 5.1 + trace * 1.7) * (s.electricalLoss / 18) * .045;
  return clamp(isi * (1 - s.electricalLoss / 55) + deterministicNoise + crosstalk, -1.25, 1.25);
}

function drawAxes(ctx, w, h, xLabel, yLabel) {
  ctx.strokeStyle = "rgba(154,190,203,.28)"; ctx.lineWidth = 1;
  ctx.strokeRect(36.5, 10.5, w - 48, h - 35);
  ctx.fillStyle = "#708690"; ctx.font = "9px ui-monospace, monospace";
  ctx.textAlign = "right"; ctx.fillText(yLabel, 32, 18);
  ctx.textAlign = "right"; ctx.fillText(xLabel, w - 12, h - 7);
}

function drawWaveform(s, d) {
  const { ctx, w, h } = fit(canvases.waveform); ctx.clearRect(0, 0, w, h); grid(ctx, w, h, 34, 28); drawAxes(ctx, w, h, "symbol", "level");
  const list = symbols(s, 96), left = 37, top = 12, pw = w - 50, ph = h - 38;
  const draw = (distorted, color) => {
    ctx.strokeStyle = color; ctx.lineWidth = distorted ? 1.8 : 1.1; ctx.beginPath();
    for (let i = 0; i <= Math.floor(pw); i++) {
      const x = i / pw * 12;
      const raw = list[Math.floor(x) % list.length];
      const value = distorted ? sampledSignal(list, x, s, d) : raw;
      const px = left + i, py = top + ph * (.5 - value * .36);
      i ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
    }
    ctx.stroke();
  };
  draw(false, "rgba(98,169,255,.42)"); draw(true, d.status === "fail" ? "#ff6f7f" : "#ffc56c");
}

function drawEye(s, d) {
  const { ctx, w, h } = fit(canvases.eye); ctx.clearRect(0, 0, w, h); grid(ctx, w, h, 34, 28); drawAxes(ctx, w, h, "2 UI", "level");
  const list = symbols(s, 320), left = 37, top = 12, pw = w - 50, ph = h - 38;
  ctx.globalCompositeOperation = "lighter";
  for (let trace = 4; trace < 150; trace += 2) {
    ctx.strokeStyle = d.status === "fail" ? "rgba(255,91,111,.07)" : "rgba(85,242,209,.07)"; ctx.lineWidth = 1; ctx.beginPath();
    for (let i = 0; i <= Math.floor(pw); i++) {
      const x = trace + i / pw * 2 + Math.sin(trace * 1.31) * s.jitter / d.uiPs;
      const value = sampledSignal(list, x, s, d, trace);
      const px = left + i, py = top + ph * (.5 - value * .36 * (.55 + .45 * d.eye));
      i ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
    }
    ctx.stroke();
  }
  ctx.globalCompositeOperation = "source-over";
  ctx.strokeStyle = d.status === "fail" ? "rgba(255,111,127,.65)" : "rgba(255,197,108,.45)";
  const maskH = ph * d.eye * .36;
  ctx.strokeRect(left + pw * .39, top + ph / 2 - maskH, pw * .22, maskH * 2);
}

function drawSpectrum(s, d) {
  const { ctx, w, h } = fit(canvases.spectrum); ctx.clearRect(0, 0, w, h); grid(ctx, w, h, 34, 28); drawAxes(ctx, w, h, "wavelength", "dBm");
  const waves = channelWavelengths(s), min = Math.min(...waves) - 4, max = Math.max(...waves) + 4;
  const left = 37, top = 12, pw = w - 50, ph = h - 38;
  waves.forEach((lambda) => {
    ctx.strokeStyle = wavelengthColor(lambda, .78); ctx.lineWidth = 1.6; ctx.beginPath();
    for (let i = 0; i <= Math.floor(pw); i++) {
      const xLambda = min + i / pw * (max - min);
      const width = .28 + s.baud / 260;
      const normalized = Math.exp(-.5 * Math.pow((xLambda - lambda) / width, 2));
      const floor = .08 + .03 * (1 - d.eye);
      const value = floor + normalized * (.78 * d.opticalTransmission);
      const px = left + i, py = top + ph * (1 - value);
      i ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
    }
    ctx.stroke();
  });
  ctx.fillStyle = "#718791"; ctx.font = "9px ui-monospace, monospace"; ctx.textAlign = "left";
  ctx.fillText(`${min.toFixed(1)} nm`, left, h - 7); ctx.textAlign = "right"; ctx.fillText(`${max.toFixed(1)} nm`, w - 12, h - 7);
}

function formatBer(value) {
  const [mantissa, exponent] = value.toExponential(1).split("e");
  return `${mantissa}e${Number(exponent) < 0 ? "−" : "+"}${Math.abs(Number(exponent))}`;
}

function updateLabels(s, d) {
  $("wavelength-value").value = `${s.wavelength} nm`; $("channels-value").value = `${s.channels} λ`;
  $("spacing-value").value = `${s.spacing} GHz`; $("baud-value").value = `${s.baud.toFixed(1)} GBd`;
  $("electrical-loss-value").value = `${s.electricalLoss.toFixed(1)} dB`; $("jitter-value").value = `${s.jitter.toFixed(2)} ps RMS`;
  $("temperature-value").value = `${s.temperature} °C`; $("optical-loss-value").value = `${s.opticalLoss.toFixed(1)} dB`;
  $("launch-power-value").value = `${s.launchPower.toFixed(1)} dBm`;
  $("throughput").textContent = d.grossGbps >= 1000 ? `${(d.grossGbps / 1000).toFixed(2)} Tb/s` : `${Math.round(d.grossGbps)} Gb/s`;
  $("rx-power").textContent = `${d.rxPower < 0 ? "−" : "+"}${Math.abs(d.rxPower).toFixed(1)} dBm`;
  $("eye-opening").textContent = `${Math.round(d.eye * 100)}%`; $("ber").textContent = formatBer(d.ber);
  [$("rx-power"), $("eye-opening"), $("ber")].forEach((element) => { element.className = d.status === "ok" ? "" : d.status; });
  const messages = [];
  if (Math.abs(d.thermalDetune) > .8) messages.push(`温度使微环相对激光漂移 ${Math.abs(d.thermalDetune).toFixed(2)} nm，调制传输下降`);
  if (s.electricalLoss > 11) messages.push("XSR+ 电路径插损增大，边沿变慢并产生码间串扰");
  if (s.jitter / d.uiPs > .08) messages.push("抖动占据较多单位间隔，采样窗口缩窄");
  if (d.margin < 0) messages.push(`接收功率低于教学灵敏度 ${Math.abs(d.margin).toFixed(1)} dB`);
  if (!messages.length) messages.push("电眼图保持张开，光功率具有余量，FEC 只需处理少量随机错误");
  const tail = d.status === "fail" ? "原始 BER 超过示意 FEC 门限，链路失锁风险高。" : d.status === "warn" ? "FEC 预计可修正，但余量有限。" : "链路处于标称可用区。";
  $("causal").textContent = `${messages.join(" → ")} → ${tail}`;
  $("causal").className = `causal ${d.status === "ok" ? "" : d.status}`;
  $("accessible-summary").textContent = `${s.channels} 个波长通道，中心 ${s.wavelength} nm，${s.modulation} ${s.baud.toFixed(1)} GBd，原始总带宽 ${d.grossGbps.toFixed(0)} Gb/s。每通道接收功率 ${d.rxPower.toFixed(1)} dBm，眼图开度约 ${Math.round(d.eye * 100)}%，原始误码率约 ${formatBer(d.ber)}。${tail}`;
}

function render() {
  const s = state(), d = derive(s); updateLabels(s, d); drawScene(s, d); drawWaveform(s, d); drawEye(s, d); drawSpectrum(s, d);
}

function applyPreset(name) {
  const preset = presets[name];
  Object.entries(preset).forEach(([key, value]) => { controls[key].value = String(value); });
  document.querySelectorAll("[data-preset]").forEach((button) => button.classList.toggle("active", button.dataset.preset === name));
  render();
}

Object.values(controls).forEach((control) => control.addEventListener("input", () => {
  document.querySelectorAll("[data-preset]").forEach((button) => button.classList.remove("active")); render();
}));
document.querySelectorAll("[data-preset]").forEach((button) => button.addEventListener("click", () => applyPreset(button.dataset.preset)));
$("reset-view").addEventListener("click", () => applyPreset("nominal"));
$("motion-toggle").addEventListener("click", () => {
  moving = !moving; $("motion-toggle").setAttribute("aria-pressed", String(moving)); $("motion-toggle").textContent = moving ? "暂停信号" : "播放信号"; render();
});
reduced.addEventListener("change", (event) => {
  if (event.matches) { moving = false; $("motion-toggle").setAttribute("aria-pressed", "false"); $("motion-toggle").textContent = "播放信号"; }
});
new ResizeObserver(render).observe($("lab"));

function animate(now) {
  if (moving) { phase = (phase + Math.min(50, now - lastTime) * .00016) % 1; drawScene(state(), derive(state())); }
  lastTime = now; requestAnimationFrame(animate);
}

if (!moving) { $("motion-toggle").setAttribute("aria-pressed", "false"); $("motion-toggle").textContent = "播放信号"; }
applyPreset("nominal"); requestAnimationFrame(animate);
