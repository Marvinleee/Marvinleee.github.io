---
layout: post
title: "特性阻抗到底是什么？从万用表、反射到四分之一波长线"
date: 2026-09-25 09:00:00 +0800
categories: [电子工程]
tags: [特性阻抗, 传输线, 阻抗匹配, TDR, 射频工程]
description: "从‘为什么万用表测不到 75 Ω’出发，用六个章节建立传输线的完整直觉：传播、分布参数、反射、驻波、四分之一波长变换、测量与天线。"
math: true
toc: true
---

一根标着 **75 Ω** 的同轴电缆，用万用表去量，为什么不是接近 75 Ω？

- 末端开路时，万用表最终读到近似无穷大；
- 末端短路时，万用表读到接近 0 Ω；
- 只有在线缆末端接入一个 75 Ω 电阻，表上才会出现大约 75 Ω。

这不是线缆标错，也不是测量仪器坏了。真正的问题是：**万用表测的是直流稳态下的端口电阻，而 75 Ω 描述的是一个正在传播的波。**

本文把特性阻抗拆成六个可以逐步建立直觉的章节。读完以后，你应该能区分三个看似相同、实际上完全不同的问题：

1. 这是一根多少欧姆的传输线？——问的是特性阻抗 $Z_0$。
2. 从这个端口向里看，是多少欧姆？——问的是输入阻抗 $Z_{in}$。
3. 线缆末端接了多少欧姆的负载？——问的是负载阻抗 $Z_L$。

> 本文依据日文教材《特性インピーダンスってなんだ？》重新组织和改写，不是逐段翻译。计算例使用理想或低损耗传输线模型；真实电缆还会受到频率、损耗、连接器和环境的影响。

<!--
ARTICLE_ARCHITECTURE
Future interactive route: /assets/interactive/characteristic-impedance-lab/
Recommended embed position: immediately after this introduction.
Required views:
  1. tdr         - wave propagation timeline
  2. geometry    - coax / twin-lead Z0 calculator
  3. reflection  - Gamma / VSWR / return-loss calculator
  4. standing    - V, I and Zin versus position
  5. stub        - quarter-wave stub explorer
  6. measurement - open/short, LCR and TDR workflows
Query/hash API: #tdr, #geometry, #reflection, #standing, #stub, #measurement
The article below is a complete no-JavaScript fallback.
-->

<section id="ci-lab" class="ci-lab" aria-label="特性阻抗交互实验室">
  <div class="ci-head">
    <div>
      <span class="ci-kicker">INTERACTIVE LAB</span>
      <h2>特性阻抗交互实验室</h2>
      <p>切换六个实验，拖动参数，再回到下方正文理解公式。</p>
    </div>
    <button type="button" class="ci-reset" data-action="reset">恢复默认</button>
  </div>

  <div class="ci-tabs" role="tablist" aria-label="实验选择">
    <button type="button" role="tab" aria-selected="true" data-view="tdr">1 · 波传播</button>
    <button type="button" role="tab" aria-selected="false" data-view="geometry">2 · 截面与 Z₀</button>
    <button type="button" role="tab" aria-selected="false" data-view="reflection">3 · 反射实验</button>
    <button type="button" role="tab" aria-selected="false" data-view="standing">4 · 驻波观察</button>
    <button type="button" role="tab" aria-selected="false" data-view="stub">5 · λ/4 支节</button>
    <button type="button" role="tab" aria-selected="false" data-view="measurement">6 · 测量方法</button>
  </div>

  <div class="ci-panel is-active" data-panel="tdr" role="tabpanel">
    <div class="ci-controls">
      <label>线长 <output data-out="tdr-length"></output>
        <input data-key="tdr-length" type="range" min="1" max="30" step="0.5" value="10">
      </label>
      <label>速度系数 <output data-out="tdr-vf"></output>
        <input data-key="tdr-vf" type="range" min="0.4" max="0.95" step="0.01" value="0.67">
      </label>
      <label>终端
        <select data-key="tdr-load">
          <option value="open">开路</option>
          <option value="short">短路</option>
          <option value="match">匹配</option>
        </select>
      </label>
      <label>时间 <output data-out="tdr-time"></output>
        <input data-key="tdr-time" type="range" min="0" max="200" step="1" value="0">
      </label>
      <button type="button" class="ci-primary" data-action="animate">播放往返过程</button>
    </div>
    <canvas data-canvas="tdr" width="960" height="330" aria-label="入射波与反射波传播动画"></canvas>
    <div class="ci-readout" data-readout="tdr" aria-live="polite"></div>
  </div>

  <div class="ci-panel" data-panel="geometry" role="tabpanel" hidden>
    <div class="ci-controls">
      <label>结构
        <select data-key="geo-type">
          <option value="coax">同轴线</option>
          <option value="twin">平衡双线</option>
        </select>
      </label>
      <label>比值 <output data-out="geo-ratio"></output>
        <input data-key="geo-ratio" type="range" min="1.2" max="12" step="0.05" value="6.52">
      </label>
      <label>相对介电常数 εᵣ <output data-out="geo-er"></output>
        <input data-key="geo-er" type="range" min="1" max="4" step="0.01" value="2.25">
      </label>
    </div>
    <canvas data-canvas="geometry" width="960" height="360" aria-label="同轴或平衡双线截面示意"></canvas>
    <div class="ci-readout" data-readout="geometry" aria-live="polite"></div>
  </div>

  <div class="ci-panel" data-panel="reflection" role="tabpanel" hidden>
    <div class="ci-controls ci-controls-4">
      <label>Z₀ / Ω <output data-out="ref-z0"></output>
        <input data-key="ref-z0" type="range" min="20" max="150" step="1" value="75">
      </label>
      <label>负载电阻 R / Ω <output data-out="ref-r"></output>
        <input data-key="ref-r" type="range" min="0" max="300" step="1" value="150">
      </label>
      <label>负载电抗 X / Ω <output data-out="ref-x"></output>
        <input data-key="ref-x" type="range" min="-200" max="200" step="1" value="0">
      </label>
    </div>
    <canvas data-canvas="reflection" width="960" height="380" aria-label="复反射系数与功率分配图"></canvas>
    <div class="ci-metrics" data-readout="reflection" aria-live="polite"></div>
  </div>

  <div class="ci-panel" data-panel="standing" role="tabpanel" hidden>
    <div class="ci-controls ci-controls-4">
      <label>Z₀ / Ω <output data-out="sw-z0"></output>
        <input data-key="sw-z0" type="range" min="20" max="150" step="1" value="75">
      </label>
      <label>|Γ| <output data-out="sw-mag"></output>
        <input data-key="sw-mag" type="range" min="0" max="0.95" step="0.01" value="0.33">
      </label>
      <label>负载处相位 <output data-out="sw-phase"></output>
        <input data-key="sw-phase" type="range" min="-180" max="180" step="1" value="0">
      </label>
      <label>探针距负载 <output data-out="sw-pos"></output>
        <input data-key="sw-pos" type="range" min="0" max="0.5" step="0.0025" value="0.25">
      </label>
    </div>
    <canvas data-canvas="standing" width="960" height="390" aria-label="电压和电流驻波曲线"></canvas>
    <div class="ci-readout" data-readout="standing" aria-live="polite"></div>
  </div>

  <div class="ci-panel" data-panel="stub" role="tabpanel" hidden>
    <div class="ci-controls ci-controls-4">
      <label>支节
        <select data-key="stub-type"><option value="open">开路</option><option value="short">短路</option></select>
      </label>
      <label>频率 <output data-out="stub-f"></output>
        <input data-key="stub-f" type="range" min="10" max="500" step="1" value="100">
      </label>
      <label>长度 <output data-out="stub-l"></output>
        <input data-key="stub-l" type="range" min="0.05" max="2" step="0.005" value="0.495">
      </label>
      <label>速度系数 <output data-out="stub-vf"></output>
        <input data-key="stub-vf" type="range" min="0.3" max="1" step="0.01" value="0.66">
      </label>
    </div>
    <canvas data-canvas="stub" width="960" height="390" aria-label="支节输入电抗与并联陷波趋势"></canvas>
    <div class="ci-readout" data-readout="stub" aria-live="polite"></div>
  </div>

  <div class="ci-panel" data-panel="measurement" role="tabpanel" hidden>
    <div class="ci-controls">
      <label>测量方法
        <select data-key="meas-type">
          <option value="os">VNA 开路—短路法</option>
          <option value="lcr">LCR 法</option>
          <option value="tdr">TDR 法</option>
        </select>
      </label>
    </div>
    <div class="ci-meas-group" data-meas="os">
      <div class="ci-number-grid">
        <label>开路 R / Ω<input data-key="os-or" type="number" value="0" step="0.1"></label>
        <label>开路 X / Ω<input data-key="os-ox" type="number" value="-129.9" step="0.1"></label>
        <label>短路 R / Ω<input data-key="os-sr" type="number" value="0" step="0.1"></label>
        <label>短路 X / Ω<input data-key="os-sx" type="number" value="43.3" step="0.1"></label>
      </div>
    </div>
    <div class="ci-meas-group" data-meas="lcr" hidden>
      <div class="ci-number-grid">
        <label>短路电感 / μH<input data-key="lcr-l" type="number" value="3.75" step="0.01"></label>
        <label>开路电容 / pF<input data-key="lcr-c" type="number" value="667" step="1"></label>
        <label>线长 / m<input data-key="lcr-length" type="number" value="10" step="0.1"></label>
      </div>
    </div>
    <div class="ci-meas-group" data-meas="tdr" hidden>
      <div class="ci-number-grid">
        <label>源电阻 Rₛ / Ω<input data-key="mtdr-rs" type="number" value="50" step="1"></label>
        <label>开路阶跃 Vₛ / V<input data-key="mtdr-vs" type="number" value="1" step="0.01"></label>
        <label>初始平台 V₁ / V<input data-key="mtdr-v1" type="number" value="0.6" step="0.01"></label>
        <label>反射往返时间 / ns<input data-key="mtdr-dt" type="number" value="100" step="1"></label>
        <label>速度系数<input data-key="mtdr-vf" type="number" value="0.667" step="0.001"></label>
      </div>
    </div>
    <div class="ci-formula-card" data-readout="measurement" aria-live="polite"></div>
  </div>
</section>

<style>
  .ci-lab{--ci-bg:#07111c;--ci-card:#0d1b2a;--ci-line:#29435a;--ci-text:#e8f1f8;--ci-muted:#9db1c2;--ci-cyan:#39d9d2;--ci-amber:#ffb44c;--ci-pink:#ff6f91;margin:2rem 0 2.6rem;padding:1rem;border:1px solid rgba(85,150,180,.35);border-radius:22px;background:radial-gradient(circle at 80% -10%,rgba(57,217,210,.16),transparent 35%),var(--ci-bg);color:var(--ci-text);box-shadow:0 20px 70px rgba(0,0,0,.24)}
  .ci-lab *{box-sizing:border-box}.ci-head{display:flex;gap:1rem;align-items:flex-start;justify-content:space-between;padding:.4rem .35rem 1rem}.ci-head h2{color:var(--ci-text);margin:.1rem 0 .25rem;font-size:clamp(1.35rem,3vw,2rem)}.ci-head p{margin:0;color:var(--ci-muted)}.ci-kicker{font:700 .7rem/1.2 ui-monospace,monospace;letter-spacing:.16em;color:var(--ci-cyan)}
  .ci-tabs{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:.4rem;margin-bottom:.8rem}.ci-tabs button,.ci-reset,.ci-primary{border:1px solid var(--ci-line);border-radius:11px;background:#102234;color:var(--ci-text);padding:.65rem .45rem;cursor:pointer;font-weight:700}.ci-tabs button[aria-selected="true"],.ci-primary{border-color:var(--ci-cyan);background:rgba(57,217,210,.14);color:#bffffb}.ci-tabs button:hover,.ci-reset:hover,.ci-primary:hover{filter:brightness(1.16)}
  .ci-panel{padding:1rem;border:1px solid var(--ci-line);border-radius:16px;background:linear-gradient(160deg,rgba(17,35,52,.96),rgba(7,16,27,.98))}.ci-controls{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:.8rem;margin-bottom:1rem}.ci-controls-4{grid-template-columns:repeat(4,minmax(0,1fr))}.ci-controls label,.ci-number-grid label{display:flex;flex-direction:column;gap:.35rem;color:var(--ci-muted);font-size:.82rem;font-weight:700}.ci-controls output{color:var(--ci-text);font-variant-numeric:tabular-nums}.ci-controls input[type="range"]{width:100%;accent-color:var(--ci-cyan)}.ci-controls select,.ci-number-grid input{width:100%;border:1px solid var(--ci-line);border-radius:9px;background:#081522;color:var(--ci-text);padding:.55rem}.ci-lab canvas{display:block;width:100%;height:auto;min-height:240px;border:1px solid rgba(90,145,175,.25);border-radius:13px;background:#071019}.ci-readout,.ci-formula-card{margin-top:.8rem;padding:.8rem 1rem;border-left:3px solid var(--ci-cyan);border-radius:8px;background:rgba(57,217,210,.07);color:var(--ci-text);font-variant-numeric:tabular-nums}.ci-metrics{display:grid;grid-template-columns:repeat(4,1fr);gap:.55rem;margin-top:.8rem}.ci-metrics span{padding:.7rem;border-radius:9px;background:rgba(57,217,210,.07);text-align:center}.ci-metrics b{display:block;color:var(--ci-cyan);font-size:1.08rem}.ci-number-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:.8rem}.ci-meas-group{margin:.4rem 0 1rem}
  @media(max-width:850px){.ci-tabs{grid-template-columns:repeat(3,1fr)}.ci-controls,.ci-controls-4,.ci-number-grid{grid-template-columns:repeat(2,1fr)}.ci-metrics{grid-template-columns:repeat(2,1fr)}}
  @media(max-width:540px){.ci-lab{padding:.65rem;border-radius:16px}.ci-head{display:block}.ci-reset{margin-top:.7rem}.ci-tabs,.ci-controls,.ci-controls-4,.ci-number-grid{grid-template-columns:1fr 1fr}.ci-tabs button{font-size:.76rem}.ci-panel{padding:.7rem}.ci-lab canvas{min-height:200px}}
  @media(prefers-reduced-motion:reduce){.ci-lab *{scroll-behavior:auto!important;transition:none!important}}
</style>

<script>
(() => {
  const root = document.getElementById('ci-lab');
  if (!root || root.dataset.ready) return;
  root.dataset.ready = '1';
  const C = 299792458;
  const q = (s) => root.querySelector(s);
  const qa = (s) => Array.from(root.querySelectorAll(s));
  const val = (key) => {
    const el = q('[data-key="' + key + '"]');
    if (!el) return NaN;
    return el.type === 'number' || el.type === 'range' ? Number(el.value) : el.value;
  };
  const setOut = (key, text) => { const el=q('[data-out="'+key+'"]'); if(el) el.textContent=text; };
  const cx = (a,b) => ({re:a.re+b.re,im:a.im+b.im});
  const cm = (a,b) => ({re:a.re*b.re-a.im*b.im,im:a.re*b.im+a.im*b.re});
  const cd = (a,b) => { const d=b.re*b.re+b.im*b.im; return {re:(a.re*b.re+a.im*b.im)/d,im:(a.im*b.re-a.re*b.im)/d}; };
  const cabs = (a) => Math.hypot(a.re,a.im);
  const fmt = (n,d=2) => Number.isFinite(n) ? n.toFixed(d) : '∞';
  const prep = (name) => {
    const canvas=q('[data-canvas="'+name+'"]'), ctx=canvas.getContext('2d');
    ctx.clearRect(0,0,canvas.width,canvas.height); ctx.lineCap='round'; ctx.lineJoin='round';
    return {canvas,ctx,w:canvas.width,h:canvas.height};
  };
  const text = (ctx,s,x,y,color='#9db1c2',size=24,align='left') => {ctx.fillStyle=color;ctx.font=size+'px system-ui,sans-serif';ctx.textAlign=align;ctx.fillText(s,x,y);};

  let current='tdr', raf=0, animStart=0;
  const show = (name) => {
    current=name;
    qa('[data-view]').forEach(b=>b.setAttribute('aria-selected',String(b.dataset.view===name)));
    qa('[data-panel]').forEach(p=>{const on=p.dataset.panel===name;p.hidden=!on;p.classList.toggle('is-active',on);});
    cancelAnimationFrame(raf); draw();
  };

  function drawTdr(){
    const L=val('tdr-length'), vf=val('tdr-vf'), load=val('tdr-load'), t=val('tdr-time');
    const one=L/(vf*C)*1e9, round=2*one, {ctx,w,h}=prep('tdr');
    setOut('tdr-length',fmt(L,1)+' m'); setOut('tdr-vf',fmt(vf,2)); setOut('tdr-time',fmt(t,0)+' ns');
    const x0=100,x1=w-100,y=165;
    ctx.strokeStyle='#54748c';ctx.lineWidth=8;ctx.beginPath();ctx.moveTo(x0,y);ctx.lineTo(x1,y);ctx.stroke();
    ctx.fillStyle='#173149';ctx.fillRect(35,y-55,90,110);ctx.fillRect(x1-10,y-55,75,110);
    text(ctx,'源',80,y+8,'#e8f1f8',28,'center');text(ctx,load==='open'?'开路':load==='short'?'短路':'匹配',x1+28,y+8,'#e8f1f8',24,'center');
    const inc=Math.min(1,t/one), xi=x0+(x1-x0)*Math.max(0,inc);
    if(t>0){ctx.strokeStyle='#39d9d2';ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(x0,y-24);ctx.lineTo(xi,y-24);ctx.stroke();ctx.fillStyle='#39d9d2';ctx.beginPath();ctx.moveTo(xi,y-24);ctx.lineTo(xi-20,y-36);ctx.lineTo(xi-20,y-12);ctx.closePath();ctx.fill();}
    let returned=false;
    if(t>one && load!=='match'){
      const p=Math.min(1,(t-one)/one), xr=x1-(x1-x0)*p; returned=p>=1;
      const color=load==='open'?'#ffb44c':'#ff6f91';ctx.strokeStyle=color;ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(x1,y+24);ctx.lineTo(xr,y+24);ctx.stroke();ctx.fillStyle=color;ctx.beginPath();ctx.moveTo(xr,y+24);ctx.lineTo(xr+20,y+12);ctx.lineTo(xr+20,y+36);ctx.closePath();ctx.fill();
      text(ctx,load==='open'?'同极性反射 Γ=+1':'反相反射 Γ=−1',(x0+x1)/2,y+74,color,23,'center');
    }
    text(ctx,'入射波',Math.min(xi-12,(x0+x1)/2),y-58,'#39d9d2',23,'center');
    text(ctx,'单程 '+fmt(one,1)+' ns',w/2,42,'#e8f1f8',25,'center');
    let sourceV=.5;if(returned)sourceV=load==='open'?1:0;
    q('[data-readout="tdr"]').innerHTML='单程延迟 <b>'+fmt(one,1)+' ns</b>，往返延迟 <b>'+fmt(round,1)+' ns</b>。当前源端电压约 <b>'+fmt(sourceV,2)+' V</b>。'+(t<round?'源端尚未收到完整的终端信息。':'反射已经返回源端。');
  }

  function drawGeometry(){
    const type=val('geo-type'), ratio=val('geo-ratio'), er=val('geo-er'), {ctx,w,h}=prep('geometry');
    let z0;
    if(type==='coax') z0=60/Math.sqrt(er)*Math.log(ratio); else z0=120/Math.sqrt(er)*Math.acosh(Math.max(1.0001,ratio));
    setOut('geo-ratio',(type==='coax'?'D/d = ':'s/d = ')+fmt(ratio,2));setOut('geo-er',fmt(er,2));
    const cy=h/2;
    if(type==='coax'){
      const ro=125,ri=Math.max(18,ro/Math.sqrt(ratio));ctx.strokeStyle='#9db1c2';ctx.lineWidth=22;ctx.beginPath();ctx.arc(w/2,cy,ro,0,Math.PI*2);ctx.stroke();ctx.fillStyle='#ffb44c';ctx.beginPath();ctx.arc(w/2,cy,ri,0,Math.PI*2);ctx.fill();
      for(let a=0;a<Math.PI*2;a+=Math.PI/8){ctx.strokeStyle='rgba(57,217,210,.65)';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(w/2+ri*Math.cos(a),cy+ri*Math.sin(a));ctx.lineTo(w/2+(ro-12)*Math.cos(a),cy+(ro-12)*Math.sin(a));ctx.stroke();}
      text(ctx,'内导体 d',w/2,cy+7,'#07111c',20,'center');text(ctx,'外导体内径 D',w/2,cy-ro-28,'#e8f1f8',23,'center');
    }else{
      const sep=Math.min(300,55*ratio),r=28;[-1,1].forEach(s=>{ctx.fillStyle='#ffb44c';ctx.beginPath();ctx.arc(w/2+s*sep/2,cy,r,0,Math.PI*2);ctx.fill();});
      for(let i=-4;i<=4;i++){ctx.strokeStyle='rgba(57,217,210,.58)';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(w/2-sep/2+r,cy+i*5);ctx.bezierCurveTo(w/2-sep/5,cy+i*17,w/2+sep/5,cy+i*17,w/2+sep/2-r,cy+i*5);ctx.stroke();}
      text(ctx,'中心距 s',w/2,cy-90,'#e8f1f8',23,'center');text(ctx,'线径 d',w/2-sep/2,cy+65,'#e8f1f8',21,'center');
    }
    q('[data-readout="geometry"]').innerHTML=(type==='coax'?'理想均匀介质同轴':'理想均匀介质平衡双线')+'的估算特性阻抗为 <b>'+fmt(z0,1)+' Ω</b>。截面尺寸整体同比例放大不会改变这个理想值。';
  }

  function drawReflection(){
    const z0=val('ref-z0'),r=val('ref-r'),x=val('ref-x'), {ctx,w,h}=prep('reflection');
    const g=cd({re:r-z0,im:x},{re:r+z0,im:x}), mag=cabs(g), phase=Math.atan2(g.im,g.re)*180/Math.PI;
    const vswr=mag>=.999999?Infinity:(1+mag)/(1-mag), rl=mag===0?Infinity:-20*Math.log10(mag), power=100*mag*mag;
    setOut('ref-z0',z0);setOut('ref-r',r);setOut('ref-x',(x>=0?'+':'')+x);
    const cx0=w*.3,cy=h/2,rad=130;ctx.strokeStyle='#54748c';ctx.lineWidth=3;ctx.beginPath();ctx.arc(cx0,cy,rad,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.moveTo(cx0-rad,cy);ctx.lineTo(cx0+rad,cy);ctx.moveTo(cx0,cy-rad);ctx.lineTo(cx0,cy+rad);ctx.stroke();
    const px=cx0+rad*g.re,py=cy-rad*g.im;ctx.strokeStyle='#39d9d2';ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(cx0,cy);ctx.lineTo(px,py);ctx.stroke();ctx.fillStyle='#39d9d2';ctx.beginPath();ctx.arc(px,py,9,0,Math.PI*2);ctx.fill();text(ctx,'Γ',px+18,py-10,'#39d9d2',28);
    const bx=w*.57,bw=w*.34; text(ctx,'功率去向',bx,h*.23,'#e8f1f8',25);ctx.fillStyle='#173149';ctx.fillRect(bx,h*.33,bw,38);ctx.fillStyle='#ff6f91';ctx.fillRect(bx,h*.33,bw*Math.min(1,power/100),38);text(ctx,'反射 '+fmt(power,1)+'%',bx,h*.33-12,'#ff9ab1',21);ctx.fillStyle='#39d9d2';ctx.fillRect(bx,h*.62,bw*Math.max(0,1-Math.min(1,power/100)),38);text(ctx,'进入负载 '+fmt(Math.max(0,100-power),1)+'%',bx,h*.62-12,'#86fff9',21);
    q('[data-readout="reflection"]').innerHTML='<span>Γ<b>'+fmt(g.re,3)+(g.im>=0?'+':'')+fmt(g.im,3)+'j</b></span><span>|Γ| / ∠Γ<b>'+fmt(mag,3)+' / '+fmt(phase,1)+'°</b></span><span>VSWR<b>'+fmt(vswr,2)+'</b></span><span>回波损耗<b>'+fmt(rl,2)+' dB</b></span>';
  }

  function drawStanding(){
    const z0=val('sw-z0'),mag=val('sw-mag'),ph=val('sw-phase')*Math.PI/180,pos=val('sw-pos'), {ctx,w,h}=prep('standing');
    setOut('sw-z0',z0);setOut('sw-mag',fmt(mag,2));setOut('sw-phase',fmt(val('sw-phase'),0)+'°');setOut('sw-pos',fmt(pos,3)+' λ');
    const left=75,right=w-35,top=45,bottom=h-65,maxY=2;ctx.strokeStyle='#54748c';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(left,top);ctx.lineTo(left,bottom);ctx.lineTo(right,bottom);ctx.stroke();
    const point=(d,sign)=>{const a=ph-4*Math.PI*d,gr={re:mag*Math.cos(a),im:mag*Math.sin(a)};return cabs({re:1+sign*gr.re,im:sign*gr.im});};
    [['#39d9d2',1],['#ffb44c',-1]].forEach(([color,sign])=>{ctx.strokeStyle=color;ctx.lineWidth=5;ctx.beginPath();for(let i=0;i<=300;i++){const d=.5*i/300,y=point(d,sign),xp=left+(right-left)*d/.5,yp=bottom-(bottom-top)*y/maxY;i?ctx.lineTo(xp,yp):ctx.moveTo(xp,yp);}ctx.stroke();});
    const xp=left+(right-left)*pos/.5;ctx.strokeStyle='#ff6f91';ctx.lineWidth=2;ctx.setLineDash([8,7]);ctx.beginPath();ctx.moveTo(xp,top);ctx.lineTo(xp,bottom);ctx.stroke();ctx.setLineDash([]);text(ctx,'|V|',right-100,top+24,'#39d9d2',23);text(ctx,'Z₀|I|',right-100,top+54,'#ffb44c',23);text(ctx,'距负载 / λ',(left+right)/2,h-20,'#9db1c2',21,'center');
    const a=ph-4*Math.PI*pos,g={re:mag*Math.cos(a),im:mag*Math.sin(a)},zn=cd({re:1+g.re,im:g.im},{re:1-g.re,im:-g.im});
    q('[data-readout="standing"]').innerHTML='探针处 |V|/|V⁺| = <b>'+fmt(point(pos,1),3)+'</b>，Z₀|I|/|V⁺| = <b>'+fmt(point(pos,-1),3)+'</b>，输入阻抗约 <b>'+fmt(z0*zn.re,1)+(zn.im>=0?'+':'')+fmt(z0*zn.im,1)+'j Ω</b>。';
  }

  function stubX(type,f,l,vf){const th=2*Math.PI*f*1e6*l/(vf*C),s=Math.sin(th),c=Math.cos(th);if(type==='open')return Math.abs(s)<1e-9?Infinity:-c/s;return Math.abs(c)<1e-9?Infinity:s/c;}
  function drawStub(){
    const type=val('stub-type'),f=val('stub-f'),l=val('stub-l'),vf=val('stub-vf'),z0=50,xn=stubX(type,f,l,vf), {ctx,w,h}=prep('stub');
    setOut('stub-f',f+' MHz');setOut('stub-l',fmt(l,3)+' m');setOut('stub-vf',fmt(vf,2));
    const left=70,right=w-35,top=45,bottom=h-65;ctx.strokeStyle='#54748c';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(left,top);ctx.lineTo(left,bottom);ctx.lineTo(right,bottom);ctx.stroke();
    ctx.strokeStyle='#39d9d2';ctx.lineWidth=5;ctx.beginPath();for(let i=0;i<=320;i++){const ff=f*.5+f*i/320,x=stubX(type,ff,l,vf),cl=Math.max(-5,Math.min(5,x)),xp=left+(right-left)*i/320,yp=(top+bottom)/2-cl*(bottom-top)/10;i?ctx.lineTo(xp,yp):ctx.moveTo(xp,yp);}ctx.stroke();
    const marker=left+(right-left)*.5;ctx.strokeStyle='#ff6f91';ctx.setLineDash([8,7]);ctx.beginPath();ctx.moveTo(marker,top);ctx.lineTo(marker,bottom);ctx.stroke();ctx.setLineDash([]);text(ctx,'X/Z₀',(left+right)/2,28,'#e8f1f8',22,'center');text(ctx,fmt(f*.5,0),left,bottom+30,'#9db1c2',18,'center');text(ctx,fmt(f*1.5,0)+' MHz',right,bottom+30,'#9db1c2',18,'center');
    const s21=!Number.isFinite(xn)?1:Math.abs(xn)<1e-9?0:2/Math.sqrt(4+1/(xn*xn)),quarter=vf*C/(4*f*1e6);
    q('[data-readout="stub"]').innerHTML=(type==='open'?'开路':'短路')+'支节当前电气长度为 <b>'+fmt(l/(vf*C/(f*1e6)),3)+' λg</b>，输入电抗约 <b>'+fmt(xn*z0,1)+' Ω</b>；作为 50 Ω 主线的并联枝时，理想 |S₂₁| 约 <b>'+fmt(s21,3)+'</b>。当前频率的 λg/4 长度为 <b>'+fmt(quarter,3)+' m</b>。';
  }

  function csqrt(z){const m=cabs(z),a=Math.sqrt((m+z.re)/2),b=(z.im<0?-1:1)*Math.sqrt(Math.max(0,(m-z.re)/2));return {re:a,im:b};}
  function drawMeasurement(){
    const type=val('meas-type');qa('[data-meas]').forEach(g=>g.hidden=g.dataset.meas!==type);let html='';
    if(type==='os'){
      const zo={re:val('os-or'),im:val('os-ox')},zs={re:val('os-sr'),im:val('os-sx')},z0=csqrt(cm(zo,zs));html='<b>开路—短路法：</b> Z₀ = √(Zopen · Zshort) = <strong>'+fmt(z0.re,2)+(z0.im>=0?'+':'')+fmt(z0.im,2)+'j Ω</strong>。应使用同一频率、同一线缆和同一参考面。';
    }else if(type==='lcr'){
      const L=val('lcr-l')*1e-6,Cp=val('lcr-c')*1e-12,len=val('lcr-length'),z0=Math.sqrt(L/Cp),delay=Math.sqrt(L*Cp),vf=len/(C*delay);html='<b>LCR 法：</b> Z₀ ≈ √(L/C) = <strong>'+fmt(z0,2)+' Ω</strong>；估算单程延迟 <strong>'+fmt(delay*1e9,2)+' ns</strong>，速度系数 <strong>'+fmt(vf,3)+'</strong>。';
    }else{
      const rs=val('mtdr-rs'),vs=val('mtdr-vs'),v1=val('mtdr-v1'),dt=val('mtdr-dt'),vf=val('mtdr-vf'),z0=rs*v1/(vs-v1),d=vf*C*dt*1e-9/2;html='<b>TDR 法：</b> Z₀ = RₛV₁/(Vₛ−V₁) = <strong>'+fmt(z0,2)+' Ω</strong>；该往返时间对应的不连续点距离约 <strong>'+fmt(d,2)+' m</strong>。';
    }
    q('[data-readout="measurement"]').innerHTML=html;
  }

  function draw(){if(current==='tdr')drawTdr();if(current==='geometry')drawGeometry();if(current==='reflection')drawReflection();if(current==='standing')drawStanding();if(current==='stub')drawStub();if(current==='measurement')drawMeasurement();}
  const defaults={};qa('input,select').forEach(el=>defaults[el.dataset.key]=el.value);
  qa('[data-view]').forEach(b=>b.addEventListener('click',()=>show(b.dataset.view)));
  qa('input,select').forEach(el=>el.addEventListener('input',draw));
  q('[data-key="meas-type"]').addEventListener('change',draw);
  q('[data-action="animate"]').addEventListener('click',()=>{cancelAnimationFrame(raf);animStart=performance.now();const max=Number(q('[data-key="tdr-time"]').max);const tick=(now)=>{const p=Math.min(1,(now-animStart)/4200);q('[data-key="tdr-time"]').value=Math.round(max*p);drawTdr();if(p<1)raf=requestAnimationFrame(tick);};raf=requestAnimationFrame(tick);});
  q('[data-action="reset"]').addEventListener('click',()=>{qa('input,select').forEach(el=>{if(el.dataset.key in defaults)el.value=defaults[el.dataset.key];});show(current);});
  show('tdr');
})();
</script>

## 第一章：为什么万用表测不到 75 Ω

### 先分清四种“欧姆”

| 名称 | 它描述什么 | 长度加倍后通常怎样 |
|---|---|---|
| 导体直流电阻 | 铜导体在稳态下消耗能量的能力 | 约加倍 |
| 线缆总电容 | 两个导体之间储存电荷的能力 | 约加倍 |
| 特性阻抗 $Z_0$ | 单向传播波的电压与电流之比 | 均匀截面下不变 |
| 输入阻抗 $Z_{in}$ | 从端口向负载方向看进去的电压与电流之比 | 随长度、频率和终端变化 |

特性阻抗最重要的一句话是：

$$
Z_0=\frac{V^+}{I^+}
$$

这里的 $V^+$ 和 $I^+$ 是**同一个向前传播的波**所携带的电压与电流。它们不是已经经历无数次反射后，在端口处测到的总电压和总电流。

普通万用表会施加很小的直流，等待瞬态结束，再计算 $V/I$。但对几米长的线缆来说，传播和反射通常在纳秒到数十纳秒内就已经结束。等万用表显示稳定读数时，它看到的只是末端最终是开路、短路还是接了一个电阻。

<details>
<summary><strong>先猜一下：</strong>把一根均匀的 75 Ω 同轴从 1 m 加长到 10 m，$Z_0$ 会变成 750 Ω 吗？</summary>

不会。总电容和导体电阻会随长度增加，但只要截面结构与材料没有改变，特性阻抗仍约为 75 Ω。变化的是延迟、损耗，以及在给定频率和终端下看到的输入阻抗。
</details>

## 第二章：先端发生了什么，信号源不会立刻知道

想象一根 10 m 长、速度系数 $VF=0.667$ 的同轴电缆。波在其中的速度约为：

$$
v_p=VF\cdot c\approx 0.667\times 3.00\times10^8
=2.00\times10^8\ \mathrm{m/s}
$$

于是传播延迟约为 $5\ \mathrm{ns/m}$：

- 波到达末端需要约 50 ns；
- 反射再回到起点需要约 100 ns。

在最初的 100 ns 里，信号源还没有收到关于末端的信息。末端究竟是开路、短路还是接了电阻，对起点的最初响应没有影响。

```text
时间 0 ns                         50 ns                         100 ns
信号源 ─────── 入射波向右 ───────► 负载 ─────── 反射波向左 ───────► 信号源
       起点只“看到”Z0                         到这里才知道末端条件
```

若一个开路电压为 1 V、内部电阻为 75 Ω 的信号源接到 75 Ω 线缆，反射返回前的入射电压和电流是：

$$
V^+=1\times\frac{75}{75+75}=0.5\ \mathrm{V}
$$

$$
I^+=\frac{0.5}{75}=6.67\ \mathrm{mA}
$$

这时线缆在源端看起来像一个 75 Ω 负载。但能量并没有在线缆入口变成热，而是作为电场和磁场的能量继续向前传播。

### 为什么没有电阻也能持续吸收电流

波头每前进一点，就要给新到达区域的分布电容充电，并在分布电感中建立电流。对于理想无损线，源送出的能量没有消失，而是跟着波向前移动。

这也是“无限长传输线”的含义：只要反射永远回不来，源端就会一直看到 $Z_0$。有限长线缆在反射返回之前，也与无限长线完全一样。

## 第三章：一根线缆为什么等价于无数个 L 和 C

两根导体之间存在电场，所以有单位长度电容 $C'$；电流建立磁场，所以有单位长度电感 $L'$。把线缆切成很多极短的小段，可以画成：

```text
      L'Δx        L'Δx        L'Δx
───LLLL───────LLLL───────LLLL──────►
      │           │           │
     C'Δx        C'Δx        C'Δx
      │           │           │
────────────────────────────────────
```

对于低损耗传输线：

$$
Z_0\approx\sqrt{\frac{L'}{C'}}
\qquad
v_p\approx\frac{1}{\sqrt{L'C'}}
$$

这两个式子揭示了一个非常有用的分工：

- $L'/C'$ 决定电压和电流的比例，也就是 $Z_0$；
- $L'C'$ 决定波传播的速度。

例如：

$$
L'=375\ \mathrm{nH/m},\qquad C'=66.7\ \mathrm{pF/m}
$$

则：

$$
Z_0\approx 75.0\ \Omega,
\qquad
v_p\approx2.00\times10^8\ \mathrm{m/s}
$$

### 截面形状决定阻抗

对于内导体直径为 $d$、外导体内径为 $D$、介质相对介电常数为 $\varepsilon_r$ 的理想同轴：

$$
Z_0\approx\frac{60}{\sqrt{\varepsilon_r}}
\ln\frac{D}{d}\ \Omega
$$

对于均匀介质中的同径平衡双线，中心距为 $s$、线径为 $d$：

$$
Z_0\approx\frac{120}{\sqrt{\varepsilon_r}}
\operatorname{arcosh}\frac{s}{d}\ \Omega
$$

因此，特性阻抗不是“藏在线缆中的电阻器”，而是由导体形状、间距和介质共同决定的传播条件。

| 改动 | 对 $Z_0$ 的典型影响 |
|---|---|
| 同轴内、外导体间距增大 | $Z_0$ 增大 |
| 双线间距增大 | $Z_0$ 增大 |
| 介电常数增大 | $Z_0$ 减小 |
| 截面按相同比例整体放大 | 理想 $Z_0$ 不变，但损耗和功率能力改变 |

线缆被压扁、连接器处剥线过长、差分对被拆开、平衡线贴近金属，都会改变局部的 $L'$ 与 $C'$。即使导通测试完全正常，也可能已经形成射频不连续点。

## 第四章：反射不是故障，而是边界条件的解

一条 75 Ω 线缆中有一个 $1\ \mathrm{V}$ 的入射波，它携带的电流是：

$$
I^+=\frac{1}{75}=13.3\ \mathrm{mA}
$$

如果末端接的是 150 Ω 电阻，这组电压和电流并不满足 $V=150I$。系统必须再产生一个向回传播的波，才能让负载端的总电压和总电流满足欧姆定律：

$$
V_L=V^++V^-
$$

$$
I_L=\frac{V^+-V^-}{Z_0}
$$

由此得到负载端电压反射系数：

$$
\Gamma_L=\frac{V^-}{V^+}
=\frac{Z_L-Z_0}{Z_L+Z_0}
$$

| 负载条件 | $\Gamma_L$ | 电压反射的含义 |
|---|---:|---|
| $Z_L=Z_0$ | 0 | 没有反射 |
| $Z_L>Z_0$ | 正值 | 反射电压同极性 |
| $Z_L<Z_0$ | 负值 | 反射电压反相 |
| 开路 | $+1$ | 电压完全同相反射 |
| 短路 | $-1$ | 电压完全反相反射 |

低损耗、实数 $Z_0$ 条件下，还可以直接得到：

$$
\mathrm{VSWR}=\frac{1+\lvert\Gamma\rvert}{1-\lvert\Gamma\rvert}
$$

$$
\mathrm{RL}=-20\log_{10}\lvert\Gamma\rvert
$$

$$
\mathrm{ML}=-10\log_{10}(1-\lvert\Gamma\rvert^2)
$$

其中 RL 是回波损耗，越大越好；ML 是仅由负载失配引起的不整合损耗，越小越好。

### 一个容易误判的例子

75 Ω 线接 50 Ω 负载：

$$
\Gamma=\frac{50-75}{50+75}=-0.2
$$

反射电压幅度为入射波的 20%，但反射功率比例是：

$$
\lvert\Gamma\rvert^2=0.04=4\%
$$

这对应 VSWR = 1.5，不整合损耗约 0.18 dB。它不是完美匹配，但也远没有“完全不可用”。工程判断不能只看到“50 Ω 和 75 Ω 不一样”，还要看差异到底造成多大后果。

<details>
<summary><strong>快速练习：</strong>50 Ω 线接 100 Ω 负载，反射系数、VSWR 和反射功率是多少？</summary>

$$
\Gamma=\frac{100-50}{100+50}=\frac13
$$

因此 VSWR = 2，反射功率比例为 $\lvert\Gamma\rvert^2=1/9\approx11.1\%$。
</details>

## 第五章：为什么同一根线，在不同位置看起来不是同一个阻抗

一条均匀传输线的 $Z_0$ 不随位置改变，但存在反射时，总电压和总电流是前进波与反射波的叠加：

$$
V(x)=V^+(x)+V^-(x)
$$

$$
I(x)=\frac{V^+(x)-V^-(x)}{Z_0}
$$

前进波与反射波的相位差随位置变化，因此 $V(x)/I(x)$ 也随位置变化。这就是“线缆本身的特性阻抗不变，但端口看到的输入阻抗会变”的原因。

对于长度为 $\ell$ 的无损线：

$$
Z_{in}=Z_0
\frac{Z_L+jZ_0\tan(\beta\ell)}
{Z_0+jZ_L\tan(\beta\ell)}
$$

其中：

$$
\beta=\frac{2\pi}{\lambda_g},
\qquad
\lambda_g=\frac{v_p}{f}=VF\cdot\lambda_0
$$

几个特殊长度尤其重要：

| 电气长度 | 输入端看到什么 |
|---|---|
| $Z_L=Z_0$ | 任意长度都看到 $Z_0$ |
| $\ell=\lambda_g/2$ | 重新看到 $Z_L$ |
| $\ell=\lambda_g/4$ | $Z_{in}=Z_0^2/Z_L$ |
| $\ell\ll\lambda_g$ | 通常可近似为直接看到 $Z_L$ |

### 四分之一波长为什么能“翻转”阻抗

若 75 Ω 传输线接 150 Ω 负载，长度恰好为 $\lambda_g/4$：

$$
Z_{in}=\frac{75^2}{150}=37.5\ \Omega
$$

负载明明是 150 Ω，输入端却看到 37.5 Ω；但线缆本身仍然是一条 75 Ω 线。

开路和短路支节是这个规律的极端情况：

$$
Z_{open}=-jZ_0\cot(\beta\ell)
$$

$$
Z_{short}=jZ_0\tan(\beta\ell)
$$

当 $\ell=\lambda_g/4$ 时：

- 开路支节的输入端接近短路；
- 短路支节的输入端接近开路。

这只是工作频率下的交流表现，并不改变直流导通状态。一个末端开路的支节，用万用表测仍然是开路，但在设计频率上可以表现为低阻抗陷波支路。

### 100 MHz 开路支节例子

假设同轴速度系数为 0.66：

$$
\ell\approx\frac{VF\cdot c}{4f}
=\frac{0.66\times3.00\times10^8}{4\times100\times10^6}
=0.495\ \mathrm{m}
$$

把约 49.5 cm 的开路同轴通过 T 型接头并联在 50 Ω 主线上，理想情况下会在 100 MHz 附近形成明显的传输谷。把支节剪短，陷波频率就会上升。

## 第六章：怎样把概念变成测量，以及它与天线有什么关系

### 方法一：开路—短路法

对同一条均匀线缆，在同一个频率分别测量末端开路和末端短路时的复输入阻抗：

$$
Z_0=\sqrt{Z_{open}Z_{short}}
$$

例如：

$$
Z_{open}=-j129.90\ \Omega,
\qquad
Z_{short}=+j43.30\ \Omega
$$

则：

$$
Z_0=\sqrt{(-j129.90)(+j43.30)}\approx75.0\ \Omega
$$

这里必须使用复数相乘，不能只拿两个万用表电阻值相乘。

### 方法二：低频 LCR 法

当线缆的电气长度很短时，末端开路近似为总电容，末端短路近似为总电感：

$$
Z_0\approx\sqrt{\frac{L_{short}}{C_{open}}}
$$

若一根 10 m 线缆测得：

$$
C_{open}=667\ \mathrm{pF},
\qquad
L_{short}=3.75\ \mu\mathrm{H}
$$

则估算得到 $Z_0\approx75\ \Omega$。

这种方法便宜直观，但治具残余电感、接触电阻、开路端浮游电容，以及低频材料参数，都可能让结果偏离实际 RF 工作频率下的 $Z_0$。

### 方法三：TDR

TDR 向线缆发出一个快速阶跃，再观察反射何时回来。若信号源内阻为 $R_S$、开路换算阶跃为 $V_S$、反射回来前的平台电压为 $V_1$：

$$
V_1=V_S\frac{Z_0}{R_S+Z_0}
$$

因此：

$$
Z_0=R_S\frac{V_1}{V_S-V_1}
$$

反射返回时间还可以定位不连续点：

$$
d=\frac{v_p\Delta t}{2}
$$

除以 2 是因为波走了一个来回。

### 从线缆走向天线

以下三个“欧姆”必须继续分开：

| 量 | 比值 | 主要由什么决定 |
|---|---|---|
| 传输线 $Z_0$ | 前进波端口电压 / 线电流 | 截面与介质 |
| 天线 $Z_A$ | 给电点电压 / 给电电流 | 电流分布、结构、环境和损耗 |
| 自由空间 $\eta_0$ | 平面波电场 $E$ / 磁场 $H$ | 空间的 $\mu$ 与 $\varepsilon$ |

自由空间波阻抗约为：

$$
\eta_0=\sqrt{\frac{\mu_0}{\varepsilon_0}}
\approx376.73\ \Omega
$$

但不能用 $(377-75)/(377+75)$ 去计算一个 75 Ω 天线向自由空间辐射时的反射。377 Ω 是场量 $E/H$，75 Ω 天线说的是端口量 $V/I$；它们比较的不是同一对物理量。

同样，**平衡—不平衡转换**和**阻抗变换**也是两件事：

- 1:1 电流巴伦可以抑制同轴外表面电流，但不会自动把 300 Ω 变成 75 Ω；
- 理想的 4:1 阻抗变换才会把 300 Ω 变换到 75 Ω；
- SWR 很低，也不等于馈线外侧的共模电流一定很小。

## 一张实务检查表

遇到传输线问题时，可以依次问：

1. **工作频率和边沿速度是多少？** 不要只看时钟基频。
2. **我说的是 $Z_0$、$Z_{in}$ 还是 $Z_L$？** 先把端口和线缆分开。
3. **测量基准面在哪里？** VNA 显示的是从校准面向里看的结果。
4. **截面是否连续？** 检查压扁、剥线、连接器、分支、差分对间距和金属邻近物。
5. **匹配与共模是否分别检查？** 巴伦、阻抗变换与共模扼流圈不要混为一谈。
6. **最终目标是什么？** 是功率、波形、接收灵敏度、辐射效率，还是仅仅一个漂亮的 SWR 数字？

## 最后，用一句话重新定义特性阻抗

> 特性阻抗是均匀传输线上单向传播波的电压与电流之比；它由截面结构和介质决定。终端满足同一比例时没有反射，不满足时会产生反射，而端口看到的输入阻抗会随长度和频率变化。

如果这句话已经能和“万用表为什么测不到 75 Ω”“开路为什么能在四分之一波长处看起来像短路”连起来，那么特性阻抗就不再只是电缆外皮上的一个数字。

下一步可以进入[《把史密斯圆图当作地图：从阻抗、反射系数到匹配路径》](/posts/smith-chart-interactive-workbench/)，把本文的 $Z_L$、$\Gamma$、线长和匹配过程放进同一个单位圆中观察。若想先了解圆图的历史背景，可阅读本站已有的[史密斯圆图历史与意义介绍](/posts/the-smith-chart-its-history-and-why-its-so-important/)。

## 参考资料

1. David H. Staelin, MIT OpenCourseWare, [Chapter 7: TEM Transmission Lines](https://ocw.mit.edu/courses/6-013-electromagnetics-and-applications-spring-2009/resources/mit6_013s09_chap07/).
2. Texas Instruments, [AN-991: Line Driving and System Design](https://www.ti.com/lit/an/snla043/snla043.pdf).
3. 《特性インピーダンスってなんだ？》：本文改写所依据的日文入门教材；其中图示、公式整理与计算例为原教材自制内容。
