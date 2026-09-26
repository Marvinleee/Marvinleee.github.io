---
layout: post
title: "拉普拉斯变换到底在做什么？从旋转、衰减到极点"
date: 2026-09-26 09:00:00 +0800
categories: [数学与工程]
tags: [拉普拉斯变换, 傅立叶变换, 信号与系统, 极点零点, 微分方程]
description: "面向有初步线性代数和微积分基础的读者，用六个交互实验理解复指数、Laplace 积分、s 平面、收敛域、微分方程与极点。"
math: true
toc: true
---

为什么要把一个随时间变化的信号，变成另一个以复数 $s$ 为自变量的函数？

拉普拉斯变换常常以一张公式表出现：阶跃变成 $1/s$，指数变成 $1/(s+a)$，微分变成乘以 $s$。这当然能帮助解题，却很容易遮住真正重要的图像：

> **拉普拉斯变换是在测试一个信号里含有多少“增长、衰减与旋转”的模式。**

如果你学过一点线性代数，可以先把它理解成一种“换坐标”。有限维向量可以投影到一组基向量上；函数则可以和一整族复指数比较。不同之处在于，这次的“坐标标签”不是整数，而是复数

$$
s=\sigma+j\omega.
$$

实部 $\sigma$ 负责增长或衰减，虚部 $\omega$ 负责旋转。下面的六个实验会把这两个作用拆开，再重新拼成 Laplace 变换、收敛域、传递函数和极点。

> 阅读准备：会向量的线性组合、导数和积分即可。复数、常微分方程和信号系统术语都会在文中现场解释；不需要先学复分析。

<section id="lp-lab" class="lp-lab" aria-label="拉普拉斯变换交互实验室">
  <div class="lp-head">
    <div>
      <span class="lp-kicker">INTERACTIVE LAB</span>
      <h2>拉普拉斯变换交互实验室</h2>
      <p>从复指数开始，逐步走到收敛域、微分方程和极点。</p>
    </div>
    <button type="button" class="lp-reset" data-action="reset">恢复默认</button>
  </div>

  <div class="lp-tabs" role="tablist" aria-label="实验选择">
    <button type="button" role="tab" aria-selected="true" data-view="mode">1 · 复指数</button>
    <button type="button" role="tab" aria-selected="false" data-view="winding">2 · 变换机器</button>
    <button type="button" role="tab" aria-selected="false" data-view="splane">3 · s 平面</button>
    <button type="button" role="tab" aria-selected="false" data-view="roc">4 · 收敛域</button>
    <button type="button" role="tab" aria-selected="false" data-view="ode">5 · 微分方程</button>
    <button type="button" role="tab" aria-selected="false" data-view="poles">6 · 极点与响应</button>
  </div>

  <div class="lp-panel is-active" data-panel="mode" role="tabpanel">
    <div class="lp-controls">
      <label>增长 / 衰减率 σ <output data-out="mode-sigma"></output>
        <input data-key="mode-sigma" type="range" min="-1.2" max="0.4" step="0.05" value="-0.35">
      </label>
      <label>角频率 ω <output data-out="mode-omega"></output>
        <input data-key="mode-omega" type="range" min="0" max="10" step="0.1" value="4">
      </label>
      <label>观察时间 <output data-out="mode-time"></output>
        <input data-key="mode-time" type="range" min="2" max="10" step="0.5" value="6">
      </label>
    </div>
    <canvas data-canvas="mode" width="960" height="390" aria-label="复指数的实部曲线和复平面螺旋轨迹"></canvas>
    <div class="lp-readout" data-readout="mode" aria-live="polite"></div>
  </div>

  <div class="lp-panel" data-panel="winding" role="tabpanel" hidden>
    <div class="lp-controls lp-controls-5">
      <label>输入信号
        <select data-key="wind-signal">
          <option value="decay">衰减指数</option>
          <option value="cos">余弦</option>
          <option value="damped">衰减余弦</option>
          <option value="pulse">有限脉冲</option>
        </select>
      </label>
      <label>信号衰减 a <output data-out="wind-a"></output>
        <input data-key="wind-a" type="range" min="0.1" max="3" step="0.05" value="0.8">
      </label>
      <label>信号频率 ω₀ <output data-out="wind-w0"></output>
        <input data-key="wind-w0" type="range" min="0" max="10" step="0.1" value="4">
      </label>
      <label>测试衰减 σ <output data-out="wind-sigma"></output>
        <input data-key="wind-sigma" type="range" min="-1.5" max="3" step="0.05" value="0.3">
      </label>
      <label>测试频率 ω <output data-out="wind-omega"></output>
        <input data-key="wind-omega" type="range" min="0" max="12" step="0.1" value="4">
      </label>
    </div>
    <canvas data-canvas="winding" width="960" height="410" aria-label="信号加权后绕在复平面上的轨迹"></canvas>
    <div class="lp-readout" data-readout="winding" aria-live="polite"></div>
  </div>

  <div class="lp-panel" data-panel="splane" role="tabpanel" hidden>
    <div class="lp-controls lp-controls-5">
      <label>信号
        <select data-key="map-signal">
          <option value="decay">e⁻ᵃᵗu(t)</option>
          <option value="damped">e⁻ᵃᵗcos(ω₀t)u(t)</option>
          <option value="step">u(t)</option>
          <option value="pulse">长度 2 s 的脉冲</option>
        </select>
      </label>
      <label>衰减 a <output data-out="map-a"></output>
        <input data-key="map-a" type="range" min="0.2" max="3" step="0.1" value="1">
      </label>
      <label>信号频率 ω₀ <output data-out="map-w0"></output>
        <input data-key="map-w0" type="range" min="0.5" max="8" step="0.1" value="4">
      </label>
      <label>探针 σ <output data-out="map-sigma"></output>
        <input data-key="map-sigma" type="range" min="-4" max="2" step="0.05" value="0.5">
      </label>
      <label>探针 ω <output data-out="map-omega"></output>
        <input data-key="map-omega" type="range" min="-10" max="10" step="0.1" value="4">
      </label>
    </div>
    <canvas data-canvas="splane" width="960" height="430" aria-label="拉普拉斯变换在 s 平面上的幅度热图"></canvas>
    <div class="lp-readout" data-readout="splane" aria-live="polite"></div>
  </div>

  <div class="lp-panel" data-panel="roc" role="tabpanel" hidden>
    <div class="lp-controls lp-controls-4">
      <label>时间支撑方向
        <select data-key="roc-side">
          <option value="right">右边信号：t ≥ 0</option>
          <option value="left">左边信号：t ≤ 0</option>
        </select>
      </label>
      <label>指数参数 a <output data-out="roc-a"></output>
        <input data-key="roc-a" type="range" min="0.2" max="2.5" step="0.1" value="1">
      </label>
      <label>测试位置 σ <output data-out="roc-sigma"></output>
        <input data-key="roc-sigma" type="range" min="-3" max="2" step="0.05" value="0">
      </label>
      <label>积分截断 R <output data-out="roc-r"></output>
        <input data-key="roc-r" type="range" min="1" max="12" step="0.5" value="8">
      </label>
    </div>
    <canvas data-canvas="roc" width="960" height="410" aria-label="相同代数表达式对应不同收敛域的比较"></canvas>
    <div class="lp-readout" data-readout="roc" aria-live="polite"></div>
  </div>

  <div class="lp-panel" data-panel="ode" role="tabpanel" hidden>
    <div class="lp-controls lp-controls-4">
      <label>输入
        <select data-key="ode-input">
          <option value="step">单位阶跃</option>
          <option value="impulse">单位脉冲</option>
          <option value="sine">正弦</option>
        </select>
      </label>
      <label>时间常数 τ <output data-out="ode-tau"></output>
        <input data-key="ode-tau" type="range" min="0.15" max="3" step="0.05" value="1">
      </label>
      <label>输入角频率 ω <output data-out="ode-omega"></output>
        <input data-key="ode-omega" type="range" min="0.2" max="10" step="0.1" value="3">
      </label>
      <label>初值 y(0⁻) <output data-out="ode-y0"></output>
        <input data-key="ode-y0" type="range" min="-1" max="1" step="0.05" value="0">
      </label>
    </div>
    <canvas data-canvas="ode" width="960" height="410" aria-label="一阶系统的输入与输出响应"></canvas>
    <div class="lp-readout" data-readout="ode" aria-live="polite"></div>
  </div>

  <div class="lp-panel" data-panel="poles" role="tabpanel" hidden>
    <div class="lp-controls">
      <label>自然角频率 ωₙ <output data-out="pole-wn"></output>
        <input data-key="pole-wn" type="range" min="0.5" max="6" step="0.1" value="3">
      </label>
      <label>阻尼比 ζ <output data-out="pole-zeta"></output>
        <input data-key="pole-zeta" type="range" min="0.05" max="2" step="0.05" value="0.35">
      </label>
      <label>频率探针 Ω/ωₙ <output data-out="pole-ratio"></output>
        <input data-key="pole-ratio" type="range" min="0.05" max="3" step="0.05" value="1">
      </label>
    </div>
    <canvas data-canvas="poles" width="960" height="480" aria-label="二阶系统极点、阶跃响应和频率响应"></canvas>
    <div class="lp-readout" data-readout="poles" aria-live="polite"></div>
  </div>
</section>

<style>
  .lp-lab{--lp-bg:#08111e;--lp-card:#0d1a2b;--lp-line:#29415c;--lp-text:#edf5ff;--lp-muted:#a2b3c8;--lp-blue:#57c7ff;--lp-cyan:#49e1c7;--lp-amber:#ffbd59;--lp-pink:#ff7396;--lp-violet:#a88cff;margin:2rem 0 2.8rem;padding:1rem;border:1px solid rgba(87,199,255,.32);border-radius:22px;background:radial-gradient(circle at 78% -8%,rgba(87,199,255,.16),transparent 36%),radial-gradient(circle at 15% 110%,rgba(168,140,255,.12),transparent 38%),var(--lp-bg);color:var(--lp-text);box-shadow:0 20px 70px rgba(0,0,0,.22)}
  .lp-lab *{box-sizing:border-box}.lp-head{display:flex;gap:1rem;align-items:flex-start;justify-content:space-between;padding:.4rem .35rem 1rem}.lp-head h2{margin:.1rem 0 .25rem;color:var(--lp-text);font-size:clamp(1.35rem,3vw,2rem)}.lp-head p{margin:0;color:var(--lp-muted)}.lp-kicker{font:700 .7rem/1.2 ui-monospace,monospace;letter-spacing:.16em;color:var(--lp-cyan)}
  .lp-tabs{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:.4rem;margin-bottom:.8rem}.lp-tabs button,.lp-reset{min-height:44px;border:1px solid var(--lp-line);border-radius:11px;background:#102238;color:var(--lp-text);padding:.65rem .45rem;cursor:pointer;font-weight:700}.lp-tabs button[aria-selected="true"]{border-color:var(--lp-cyan);background:rgba(73,225,199,.13);color:#c7fff5}.lp-tabs button:hover,.lp-reset:hover{filter:brightness(1.16)}
  .lp-panel{padding:1rem;border:1px solid var(--lp-line);border-radius:16px;background:linear-gradient(160deg,rgba(17,34,55,.97),rgba(7,15,27,.98))}.lp-controls{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:.8rem;margin-bottom:1rem}.lp-controls-4{grid-template-columns:repeat(4,minmax(0,1fr))}.lp-controls-5{grid-template-columns:repeat(5,minmax(0,1fr))}.lp-controls label{display:flex;flex-direction:column;gap:.35rem;color:var(--lp-muted);font-size:.82rem;font-weight:700}.lp-controls output{color:var(--lp-text);font-variant-numeric:tabular-nums}.lp-controls input[type="range"]{width:100%;accent-color:var(--lp-cyan)}.lp-controls select{width:100%;min-width:0;border:1px solid var(--lp-line);border-radius:9px;background:#081522;color:var(--lp-text);padding:.55rem}
  .lp-lab canvas{display:block;width:100%;height:auto;min-height:250px;border:1px solid rgba(92,146,183,.25);border-radius:13px;background:#07101b}.lp-readout{margin-top:.8rem;padding:.82rem 1rem;border-left:3px solid var(--lp-cyan);border-radius:8px;background:rgba(73,225,199,.07);color:var(--lp-text);font-variant-numeric:tabular-nums}.lp-readout b{color:#bffff4}.lp-readout .lp-warn{color:#ffb5c6}.lp-readout .lp-ok{color:#a9f6dc}
  @media(max-width:920px){.lp-tabs{grid-template-columns:repeat(3,1fr)}.lp-controls,.lp-controls-4,.lp-controls-5{grid-template-columns:repeat(2,1fr)}}
  @media(max-width:540px){.lp-lab{padding:.65rem;border-radius:16px}.lp-head{display:block}.lp-reset{margin-top:.7rem}.lp-tabs,.lp-controls,.lp-controls-4,.lp-controls-5{grid-template-columns:1fr 1fr}.lp-tabs button{font-size:.76rem}.lp-panel{padding:.7rem}.lp-lab canvas{min-height:220px}}
  @media(prefers-reduced-motion:reduce){.lp-lab *{scroll-behavior:auto!important;transition:none!important}}
</style>

<script>
(() => {
  const root = document.getElementById('lp-lab');
  if (!root || root.dataset.ready) return;
  root.dataset.ready = '1';
  const q = (s) => root.querySelector(s);
  const qa = (s) => Array.from(root.querySelectorAll(s));
  const val = (key) => {
    const el = q('[data-key="' + key + '"]');
    if (!el) return NaN;
    return el.type === 'range' || el.type === 'number' ? Number(el.value) : el.value;
  };
  const setOut = (key,text) => { const el=q('[data-out="'+key+'"]'); if(el) el.textContent=text; };
  const fmt = (n,d=2) => Number.isFinite(n) ? n.toFixed(d) : '∞';
  const cadd = (a,b) => ({re:a.re+b.re,im:a.im+b.im});
  const cmul = (a,b) => ({re:a.re*b.re-a.im*b.im,im:a.re*b.im+a.im*b.re});
  const cdiv = (a,b) => {const d=b.re*b.re+b.im*b.im;return {re:(a.re*b.re+a.im*b.im)/d,im:(a.im*b.re-a.re*b.im)/d};};
  const cexp = (z) => {const e=Math.exp(z.re);return {re:e*Math.cos(z.im),im:e*Math.sin(z.im)};};
  const cabs = (z) => Math.hypot(z.re,z.im);
  const cphase = (z) => Math.atan2(z.im,z.re);
  const prep = (name) => {
    const canvas=q('[data-canvas="'+name+'"]'),ctx=canvas.getContext('2d');
    ctx.clearRect(0,0,canvas.width,canvas.height);ctx.lineCap='round';ctx.lineJoin='round';
    return {canvas,ctx,w:canvas.width,h:canvas.height};
  };
  const text = (ctx,s,x,y,color='#a2b3c8',size=20,align='left') => {ctx.fillStyle=color;ctx.font=size+'px system-ui,sans-serif';ctx.textAlign=align;ctx.fillText(s,x,y);};
  const arrow = (ctx,x0,y0,x1,y1,color,width=4) => {
    const a=Math.atan2(y1-y0,x1-x0),head=13;ctx.strokeStyle=color;ctx.fillStyle=color;ctx.lineWidth=width;ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x1,y1);ctx.stroke();ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x1-head*Math.cos(a-.5),y1-head*Math.sin(a-.5));ctx.lineTo(x1-head*Math.cos(a+.5),y1-head*Math.sin(a+.5));ctx.closePath();ctx.fill();
  };
  const grid = (ctx,x0,y0,x1,y1,xt=5,yt=4) => {
    ctx.strokeStyle='rgba(120,154,184,.18)';ctx.lineWidth=1;
    for(let i=0;i<=xt;i++){const x=x0+(x1-x0)*i/xt;ctx.beginPath();ctx.moveTo(x,y0);ctx.lineTo(x,y1);ctx.stroke();}
    for(let i=0;i<=yt;i++){const y=y0+(y1-y0)*i/yt;ctx.beginPath();ctx.moveTo(x0,y);ctx.lineTo(x1,y);ctx.stroke();}
    ctx.strokeStyle='#45617b';ctx.lineWidth=2;ctx.strokeRect(x0,y0,x1-x0,y1-y0);
  };
  const plotLine = (ctx,fn,x0,y0,x1,y1,t0,t1,vmin,vmax,color,width=4,n=360) => {
    ctx.strokeStyle=color;ctx.lineWidth=width;ctx.beginPath();
    for(let i=0;i<=n;i++){const t=t0+(t1-t0)*i/n,v=Math.max(vmin,Math.min(vmax,fn(t))),x=x0+(x1-x0)*i/n,y=y1-(v-vmin)/(vmax-vmin)*(y1-y0);i?ctx.lineTo(x,y):ctx.moveTo(x,y);}
    ctx.stroke();
  };

  let current='mode';
  function show(name){
    current=name;
    qa('[data-view]').forEach(b=>b.setAttribute('aria-selected',String(b.dataset.view===name)));
    qa('[data-panel]').forEach(p=>{const on=p.dataset.panel===name;p.hidden=!on;p.classList.toggle('is-active',on);});
    draw();
  }

  function drawMode(){
    const sigma=val('mode-sigma'),omega=val('mode-omega'),T=val('mode-time'),d={};
    const o=prep('mode'),ctx=o.ctx,w=o.w,h=o.h;
    setOut('mode-sigma',fmt(sigma,2)+' s⁻¹');setOut('mode-omega',fmt(omega,1)+' rad/s');setOut('mode-time',fmt(T,1)+' s');
    const lx=65,rx=515,top=45,bottom=h-55,mid=(top+bottom)/2;
    grid(ctx,lx,top,rx,bottom,5,4);text(ctx,'Re{eˢᵗ}',lx,27,'#edf5ff',21);text(ctx,'时间 t',rx,bottom+32,'#a2b3c8',18,'right');
    const maxAmp=Math.max(1,Math.exp(sigma*T)),scale=maxAmp*1.15;
    plotLine(ctx,t=>Math.exp(sigma*t)*Math.cos(omega*t),lx,top,rx,bottom,0,T,-scale,scale,'#57c7ff',4);
    plotLine(ctx,t=>Math.exp(sigma*t),lx,top,rx,bottom,0,T,-scale,scale,'rgba(255,189,89,.8)',2);
    plotLine(ctx,t=>-Math.exp(sigma*t),lx,top,rx,bottom,0,T,-scale,scale,'rgba(255,189,89,.8)',2);
    ctx.strokeStyle='#45617b';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(lx,mid);ctx.lineTo(rx,mid);ctx.stroke();

    const cx=738,cy=198,rad=142;complexPlane();
    function complexPlane(){
      ctx.strokeStyle='#45617b';ctx.lineWidth=2;ctx.beginPath();ctx.arc(cx,cy,rad,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.moveTo(cx-rad-15,cy);ctx.lineTo(cx+rad+15,cy);ctx.moveTo(cx,cy-rad-15);ctx.lineTo(cx,cy+rad+15);ctx.stroke();
      text(ctx,'Re',cx+rad+22,cy+6,'#a2b3c8',17);text(ctx,'Im',cx+8,cy-rad-18,'#a2b3c8',17);
      const spiralScale=rad/(maxAmp*1.1);ctx.strokeStyle='#49e1c7';ctx.lineWidth=4;ctx.beginPath();
      let ex=0,ey=0;
      for(let i=0;i<=420;i++){const t=T*i/420,r=Math.exp(sigma*t),a=omega*t,x=cx+spiralScale*r*Math.cos(a),y=cy-spiralScale*r*Math.sin(a);i?ctx.lineTo(x,y):ctx.moveTo(x,y);ex=x;ey=y;}
      ctx.stroke();ctx.fillStyle='#49e1c7';ctx.beginPath();ctx.arc(ex,ey,7,0,Math.PI*2);ctx.fill();
    }
    const end=cexp({re:sigma*T,im:omega*T});
    q('[data-readout="mode"]').innerHTML='终点 e<sup>sT</sup> = <b>'+fmt(end.re,3)+(end.im>=0?'+':'')+fmt(end.im,3)+'j</b>，模长为 <b>'+fmt(cabs(end),3)+'</b>。'+(sigma<0?'轨迹向原点收缩：这是衰减模式。':sigma>0?'轨迹向外扩张：这是增长模式。':'轨迹停在单位圆上：这是纯振荡模式。');
  }

  function signalValue(kind,t,a,w0){
    if(kind==='decay') return Math.exp(-a*t);
    if(kind==='cos') return Math.cos(w0*t);
    if(kind==='damped') return Math.exp(-a*t)*Math.cos(w0*t);
    return t<=2?1:0;
  }

  function drawWinding(){
    const kind=val('wind-signal'),a=val('wind-a'),w0=val('wind-w0'),sigma=val('wind-sigma'),omega=val('wind-omega'),T=8;
    const o=prep('winding'),ctx=o.ctx,w=o.w,h=o.h;
    setOut('wind-a',fmt(a,2)+' s⁻¹');setOut('wind-w0',fmt(w0,1)+' rad/s');setOut('wind-sigma',fmt(sigma,2)+' s⁻¹');setOut('wind-omega',fmt(omega,1)+' rad/s');
    const lx=60,rx=490,top=48,bottom=h-52;grid(ctx,lx,top,rx,bottom,4,4);text(ctx,'x(t) 与加权包络',lx,28,'#edf5ff',21);text(ctx,'t',rx,bottom+30,'#a2b3c8',18,'right');
    const samples=[];let maxv=.1,integ={re:0,im:0},prev=null,dt=T/500;
    for(let i=0;i<=500;i++){const t=i*dt,x=signalValue(kind,t,a,w0),weighted=x*Math.exp(-sigma*t),z={re:weighted*Math.cos(omega*t),im:-weighted*Math.sin(omega*t)};samples.push({t,x,weighted,z});maxv=Math.max(maxv,Math.abs(x),Math.abs(weighted));if(prev){integ.re+=(prev.re+z.re)*dt/2;integ.im+=(prev.im+z.im)*dt/2;}prev=z;}
    maxv=Math.min(10,maxv)*1.1;
    plotLine(ctx,t=>signalValue(kind,t,a,w0),lx,top,rx,bottom,0,T,-maxv,maxv,'#57c7ff',4);
    plotLine(ctx,t=>Math.exp(-sigma*t),lx,top,rx,bottom,0,T,-maxv,maxv,'rgba(255,189,89,.72)',2);
    plotLine(ctx,t=>-Math.exp(-sigma*t),lx,top,rx,bottom,0,T,-maxv,maxv,'rgba(255,189,89,.72)',2);
    const mid=(top+bottom)/2;ctx.strokeStyle='#45617b';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(lx,mid);ctx.lineTo(rx,mid);ctx.stroke();

    const cx=730,cy=205,rad=154;ctx.strokeStyle='#45617b';ctx.lineWidth=2;ctx.beginPath();ctx.arc(cx,cy,rad,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.moveTo(cx-rad-15,cy);ctx.lineTo(cx+rad+15,cy);ctx.moveTo(cx,cy-rad-15);ctx.lineTo(cx,cy+rad+15);ctx.stroke();text(ctx,'加权后绕到复平面',cx,28,'#edf5ff',21,'center');
    let pathMax=.1;samples.forEach(p=>pathMax=Math.max(pathMax,cabs(p.z)));const sc=rad/(Math.min(12,pathMax)*1.12);
    ctx.strokeStyle='#49e1c7';ctx.lineWidth=3;ctx.beginPath();samples.forEach((p,i)=>{const x=cx+sc*p.z.re,y=cy-sc*p.z.im;i?ctx.lineTo(x,y):ctx.moveTo(x,y);});ctx.stroke();
    const isum=Math.max(.2,cabs(integ)),arrowScale=Math.min(rad*.82/isum,70);arrow(ctx,cx,cy,cx+integ.re*arrowScale,cy-integ.im*arrowScale,'#ff7396',5);
    text(ctx,'有限时间积分',cx,cy+rad+30,'#ff9bb3',18,'center');
    q('[data-readout="winding"]').innerHTML='在 0–'+T+' s 内，X<sub>T</sub>(s) ≈ <b>'+fmt(integ.re,3)+(integ.im>=0?'+':'')+fmt(integ.im,3)+'j</b>，幅度 <b>'+fmt(cabs(integ),3)+'</b>、相位 <b>'+fmt(cphase(integ)*180/Math.PI,1)+'°</b>。改变 ω 看“绕线”何时最不平衡，再改变 σ 看远处时间样本如何被压低或放大。';
  }

  function analyticX(kind,s,a,w0){
    if(kind==='decay') return cdiv({re:1,im:0},{re:s.re+a,im:s.im});
    if(kind==='step') return cdiv({re:1,im:0},s);
    if(kind==='damped'){
      const p={re:s.re+a,im:s.im},den=cadd(cmul(p,p),{re:w0*w0,im:0});return cdiv(p,den);
    }
    if(cabs(s)<1e-8) return {re:2,im:0};
    return cdiv(cadd({re:1,im:0},cmul({re:-1,im:0},cexp({re:-2*s.re,im:-2*s.im}))),s);
  }
  function heatRGB(u){
    u=Math.max(0,Math.min(1,u));
    const stops=[[8,17,31],[24,64,95],[46,157,169],[255,189,89],[255,115,150]];
    const p=u*(stops.length-1),i=Math.min(stops.length-2,Math.floor(p)),f=p-i,a=stops[i],b=stops[i+1];
    return [Math.round(a[0]+(b[0]-a[0])*f),Math.round(a[1]+(b[1]-a[1])*f),Math.round(a[2]+(b[2]-a[2])*f)];
  }
  function mapMeta(kind,a,w0){
    if(kind==='decay') return {bound:-a,side:'right',poles:[{re:-a,im:0}]};
    if(kind==='damped') return {bound:-a,side:'right',poles:[{re:-a,im:w0},{re:-a,im:-w0}]};
    if(kind==='step') return {bound:0,side:'right',poles:[{re:0,im:0}]};
    return {bound:null,side:'all',poles:[]};
  }
  function drawSplane(){
    const kind=val('map-signal'),a=val('map-a'),w0=val('map-w0'),ss=val('map-sigma'),ww=val('map-omega');
    const o=prep('splane'),canvas=o.canvas,ctx=o.ctx,w=o.w,h=o.h;
    setOut('map-a',fmt(a,1)+' s⁻¹');setOut('map-w0',fmt(w0,1)+' rad/s');setOut('map-sigma',fmt(ss,2));setOut('map-omega',fmt(ww,1));
    const x0=78,y0=35,x1=w-42,y1=h-55,pw=x1-x0,ph=y1-y0,sw=260,sh=130,off=document.createElement('canvas');off.width=sw;off.height=sh;const oc=off.getContext('2d'),img=oc.createImageData(sw,sh);
    for(let iy=0;iy<sh;iy++){const om=10-20*iy/(sh-1);for(let ix=0;ix<sw;ix++){const sig=-4+6*ix/(sw-1),z=analyticX(kind,{re:sig,im:om},a,w0),lm=Math.log10(Math.max(1e-4,Math.min(1e4,cabs(z)))),u=(lm+2.2)/4.4,rgb=heatRGB(u),k=(iy*sw+ix)*4;img.data[k]=rgb[0];img.data[k+1]=rgb[1];img.data[k+2]=rgb[2];img.data[k+3]=255;}}
    oc.putImageData(img,0,0);ctx.imageSmoothingEnabled=true;ctx.drawImage(off,x0,y0,pw,ph);
    const meta=mapMeta(kind,a,w0),sx=s=>x0+(s+4)/6*pw,sy=om=>y0+(10-om)/20*ph;
    if(meta.side!=='all'){
      const bx=sx(meta.bound);ctx.fillStyle='rgba(7,12,21,.58)';ctx.fillRect(x0,y0,Math.max(0,bx-x0),ph);ctx.strokeStyle='#ffbd59';ctx.lineWidth=3;ctx.setLineDash([9,7]);ctx.beginPath();ctx.moveTo(bx,y0);ctx.lineTo(bx,y1);ctx.stroke();ctx.setLineDash([]);text(ctx,'积分不收敛',x0+10,y0+27,'#ffb5c6',18);
    }
    ctx.strokeStyle='#6d839a';ctx.lineWidth=2;ctx.strokeRect(x0,y0,pw,ph);const zeroX=sx(0),zeroY=sy(0);ctx.strokeStyle='rgba(237,245,255,.55)';ctx.beginPath();ctx.moveTo(zeroX,y0);ctx.lineTo(zeroX,y1);ctx.moveTo(x0,zeroY);ctx.lineTo(x1,zeroY);ctx.stroke();text(ctx,'σ',x1+16,zeroY+6,'#a2b3c8',18);text(ctx,'jω',zeroX+8,y0-10,'#a2b3c8',18);
    meta.poles.forEach(p=>{const x=sx(p.re),y=sy(p.im);ctx.strokeStyle='#ff7396';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(x-9,y-9);ctx.lineTo(x+9,y+9);ctx.moveTo(x+9,y-9);ctx.lineTo(x-9,y+9);ctx.stroke();});
    const px=sx(ss),py=sy(ww);ctx.strokeStyle='#edf5ff';ctx.lineWidth=3;ctx.beginPath();ctx.arc(px,py,9,0,Math.PI*2);ctx.stroke();
    const z=analyticX(kind,{re:ss,im:ww},a,w0),converges=meta.side==='all'||ss>meta.bound;
    text(ctx,'颜色：log₁₀|X(s)|',x0,y1+32,'#a2b3c8',17);
    q('[data-readout="splane"]').innerHTML='探针 s = <b>'+fmt(ss,2)+(ww>=0?'+':'')+fmt(ww,2)+'j</b>，代数表达式给出 X(s) = <b>'+fmt(z.re,3)+(z.im>=0?'+':'')+fmt(z.im,3)+'j</b>。'+(converges?'<span class="lp-ok">此处原积分收敛。</span>':'<span class="lp-warn">此处原积分发散；热图值只是解析延拓的代数值。</span>')+' 可直接点击热图移动探针。';
    canvas._map={x0,y0,x1,y1};
  }

  function drawRoc(){
    const side=val('roc-side'),a=val('roc-a'),sigma=val('roc-sigma'),R=val('roc-r'),k=a+sigma;
    const o=prep('roc'),ctx=o.ctx,w=o.w,h=o.h;
    setOut('roc-a',fmt(a,1)+' s⁻¹');setOut('roc-sigma',fmt(sigma,2));setOut('roc-r',fmt(R,1)+' s');
    const lx=55,rx=455,top=48,bottom=h-58;grid(ctx,lx,top,rx,bottom,4,4);text(ctx,'被积函数的幅度',lx,28,'#edf5ff',21);
    const t0=side==='right'?0:-R,t1=side==='right'?R:0;
    let maxv=1;for(let i=0;i<=200;i++){const t=t0+(t1-t0)*i/200;maxv=Math.max(maxv,Math.min(50,Math.exp(-k*t)));}
    plotLine(ctx,t=>Math.exp(-k*t),lx,top,rx,bottom,t0,t1,0,maxv*1.08,'#57c7ff',4);
    text(ctx,side==='right'?'0 → R':'−R → 0',(lx+rx)/2,bottom+32,'#a2b3c8',18,'center');

    const gx=545,gx1=w-40;grid(ctx,gx,top,gx1,bottom,4,4);text(ctx,'部分积分 |I(R)|（对数刻度）',gx,28,'#edf5ff',21);
    const partial=(r)=>{
      if(Math.abs(k)<1e-9) return r;
      if(side==='right') return Math.abs((1-Math.exp(-k*r))/k);
      return Math.abs((1-Math.exp(k*r))/k);
    };
    let ymax=.1;for(let i=0;i<=200;i++)ymax=Math.max(ymax,Math.log10(1+Math.min(1e6,partial(R*i/200))));
    plotLine(ctx,r=>Math.log10(1+Math.min(1e6,partial(r))),gx,top,gx1,bottom,0,R,0,ymax*1.08,'#49e1c7',4);
    const converges=side==='right'?k>0:k<0,algebra=Math.abs(k)<1e-9?Infinity:1/k,iv=partial(R);
    q('[data-readout="roc"]').innerHTML='两种信号的代数形式都可写成 <b>X(s)=1/(s+a)</b>，但当前 '+(side==='right'?'右边信号要求 σ &gt; −a':'左边信号要求 σ &lt; −a')+'。截断积分 |I('+fmt(R,1)+')| = <b>'+fmt(iv,3)+'</b>。'+(converges?'<span class="lp-ok">继续增大 R，它会趋近 '+fmt(Math.abs(algebra),3)+'。</span>':'<span class="lp-warn">继续增大 R，它不会稳定，因此这里不属于收敛域。</span>');
  }

  function drawOde(){
    const input=val('ode-input'),tau=val('ode-tau'),omega=val('ode-omega'),y0=val('ode-y0');
    const o=prep('ode'),ctx=o.ctx,w=o.w,h=o.h;
    setOut('ode-tau',fmt(tau,2)+' s');setOut('ode-omega',fmt(omega,1)+' rad/s');setOut('ode-y0',fmt(y0,2));
    const x0=65,yTop=45,x1=w-42,y1=h-58;grid(ctx,x0,yTop,x1,y1,6,4);const T=Math.max(6,6*tau),vals=[];
    let ymin=-1.4,ymax=1.6;
    const xfun=t=>input==='step'?1:input==='impulse'?0:Math.sin(omega*t);
    const yfun=t=>{
      if(input==='step') return 1+(y0-1)*Math.exp(-t/tau);
      if(input==='impulse') return (1/tau+y0)*Math.exp(-t/tau);
      const A=1/Math.sqrt(1+(omega*tau)*(omega*tau)),ph=-Math.atan(omega*tau),trans=y0-A*Math.sin(ph);return A*Math.sin(omega*t+ph)+trans*Math.exp(-t/tau);
    };
    if(input==='impulse'){ymax=Math.max(2,1/tau+y0+0.3);ymin=Math.min(-.5,y0-.3);}
    plotLine(ctx,xfun,x0,yTop,x1,y1,0,T,ymin,ymax,'rgba(255,189,89,.9)',3);
    plotLine(ctx,yfun,x0,yTop,x1,y1,0,T,ymin,ymax,'#57c7ff',5);
    if(input==='impulse'){arrow(ctx,x0,y1-(0-ymin)/(ymax-ymin)*(y1-yTop),x0,yTop+24,'#ffbd59',3);text(ctx,'δ(t)',x0+14,yTop+30,'#ffbd59',18);}
    text(ctx,'输入 x(t)',x1-160,yTop+26,'#ffbd59',18);text(ctx,'输出 y(t)',x1-160,yTop+54,'#57c7ff',18);text(ctx,'时间 t',x1,y1+32,'#a2b3c8',18,'right');
    const pole=-1/tau,fc=1/tau,A=1/Math.sqrt(1+(omega*tau)*(omega*tau)),phase=-Math.atan(omega*tau)*180/Math.PI;
    q('[data-readout="ode"]').innerHTML='τy′+y=x 经过变换后成为 <b>(τs+1)Y(s)=X(s)+τy(0⁻)</b>。零初值传递函数 H(s)=1/(τs+1)，极点在 <b>s='+fmt(pole,3)+'</b>。'+(input==='sine'?'当前正弦稳态增益 <b>'+fmt(A,3)+'</b>，相位 <b>'+fmt(phase,1)+'°</b>。':'约经过 <b>'+fmt(4*tau,2)+' s</b>，初值造成的瞬态只剩约 1.8%。');
  }

  function secondOrderPoles(wn,zeta){
    if(zeta<1){const im=wn*Math.sqrt(1-zeta*zeta);return [{re:-zeta*wn,im:im},{re:-zeta*wn,im:-im}];}
    if(Math.abs(zeta-1)<1e-8)return [{re:-wn,im:0},{re:-wn,im:0}];
    const d=wn*Math.sqrt(zeta*zeta-1);return [{re:-zeta*wn+d,im:0},{re:-zeta*wn-d,im:0}];
  }
  function step2(t,wn,zeta){
    if(zeta<.9999){const r=Math.sqrt(1-zeta*zeta),wd=wn*r;return 1-Math.exp(-zeta*wn*t)*(Math.cos(wd*t)+zeta/r*Math.sin(wd*t));}
    if(zeta<1.0001)return 1-Math.exp(-wn*t)*(1+wn*t);
    const p=secondOrderPoles(wn,zeta),p1=p[0].re,p2=p[1].re;return 1+(p2*Math.exp(p1*t)-p1*Math.exp(p2*t))/(p1-p2);
  }
  function mag2(om,wn,zeta){return wn*wn/Math.sqrt((wn*wn-om*om)*(wn*wn-om*om)+(2*zeta*wn*om)*(2*zeta*wn*om));}
  function drawPoles(){
    const wn=val('pole-wn'),zeta=val('pole-zeta'),ratio=val('pole-ratio'),om=ratio*wn,poles=secondOrderPoles(wn,zeta);
    const o=prep('poles'),ctx=o.ctx,w=o.w,h=o.h;
    setOut('pole-wn',fmt(wn,1)+' rad/s');setOut('pole-zeta',fmt(zeta,2));setOut('pole-ratio',fmt(ratio,2));
    const sx0=38,sy0=55,sx1=345,sy1=h-45,cx=(sx0+sx1)/2,cy=(sy0+sy1)/2,scale=Math.min((sx1-sx0)/2/7,(sy1-sy0)/2/7);
    grid(ctx,sx0,sy0,sx1,sy1,4,4);ctx.strokeStyle='#7d91a8';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(sx0,cy);ctx.lineTo(sx1,cy);ctx.moveTo(cx,sy0);ctx.lineTo(cx,sy1);ctx.stroke();text(ctx,'s 平面极点',sx0,30,'#edf5ff',21);text(ctx,'Re',sx1-20,cy-10,'#a2b3c8',16);text(ctx,'jω',cx+8,sy0+18,'#a2b3c8',16);
    poles.forEach(p=>{const x=cx+p.re*scale,y=cy-p.im*scale;ctx.strokeStyle='#ff7396';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(x-9,y-9);ctx.lineTo(x+9,y+9);ctx.moveTo(x+9,y-9);ctx.lineTo(x-9,y+9);ctx.stroke();});

    const px0=405,px1=w-35,pt0=45,pt1=235;grid(ctx,px0,pt0,px1,pt1,5,4);text(ctx,'单位阶跃响应',px0,27,'#edf5ff',21);const T=Math.max(5,8/wn*(1+zeta));plotLine(ctx,t=>step2(t,wn,zeta),px0,pt0,px1,pt1,0,T,-.15,2.05,'#57c7ff',4);text(ctx,'1',px0-12,pt1-(1.15/2.2)*(pt1-pt0),'#a2b3c8',15,'right');
    const fb0=292,fb1=h-45;grid(ctx,px0,fb0,px1,fb1,5,4);text(ctx,'频率响应 |H(jΩ)|',px0,fb0-14,'#edf5ff',21);let mmax=1.2;for(let i=0;i<=200;i++)mmax=Math.max(mmax,Math.min(6,mag2(3*wn*i/200,wn,zeta)));plotLine(ctx,r=>mag2(r*wn,wn,zeta),px0,fb0,px1,fb1,0,3,0,mmax*1.08,'#49e1c7',4);
    const xp=px0+(px1-px0)*ratio/3,mp=mag2(om,wn,zeta),yp=fb1-mp/(mmax*1.08)*(fb1-fb0);ctx.fillStyle='#ffbd59';ctx.beginPath();ctx.arc(xp,yp,7,0,Math.PI*2);ctx.fill();text(ctx,'Ω/ωₙ',px1,fb1+28,'#a2b3c8',16,'right');
    let kind=zeta<1?'欠阻尼：一对共轭复极点':zeta===1?'临界阻尼：重合实极点':'过阻尼：两个实极点';
    const overshoot=zeta<1?Math.exp(-Math.PI*zeta/Math.sqrt(1-zeta*zeta))*100:0;
    q('[data-readout="poles"]').innerHTML='<b>'+kind+'</b>。极点为 '+poles.map(p=>fmt(p.re,2)+(p.im>=0?'+':'')+fmt(p.im,2)+'j').join('，')+'。当前 |H(jΩ)| = <b>'+fmt(mp,3)+'</b>；理想阶跃超调约 <b>'+fmt(overshoot,1)+'%</b>。把极点向虚轴靠近，振铃会更久，共振峰也会更高。';
  }

  function draw(){
    if(current==='mode')drawMode();
    if(current==='winding')drawWinding();
    if(current==='splane')drawSplane();
    if(current==='roc')drawRoc();
    if(current==='ode')drawOde();
    if(current==='poles')drawPoles();
  }
  const defaults={};qa('input,select').forEach(el=>defaults[el.dataset.key]=el.value);
  qa('[data-view]').forEach(b=>b.addEventListener('click',()=>show(b.dataset.view)));
  qa('input,select').forEach(el=>el.addEventListener('input',draw));
  q('[data-action="reset"]').addEventListener('click',()=>{qa('input,select').forEach(el=>{if(el.dataset.key in defaults)el.value=defaults[el.dataset.key];});show(current);});
  q('[data-canvas="splane"]').addEventListener('pointerdown',(ev)=>{
    const canvas=ev.currentTarget,m=canvas._map;if(!m)return;const r=canvas.getBoundingClientRect(),x=(ev.clientX-r.left)*canvas.width/r.width,y=(ev.clientY-r.top)*canvas.height/r.height;if(x<m.x0||x>m.x1||y<m.y0||y>m.y1)return;
    q('[data-key="map-sigma"]').value=(-4+6*(x-m.x0)/(m.x1-m.x0)).toFixed(2);q('[data-key="map-omega"]').value=(10-20*(y-m.y0)/(m.y1-m.y0)).toFixed(2);drawSplane();
  });
  show('mode');
})();
</script>

## 第一章：为什么复指数是系统的“自然坐标”

在线性代数中，如果矩阵 $A$ 作用在特征向量 $\mathbf v$ 上，方向不会改变，只会多出一个比例：

$$
A\mathbf v=\lambda\mathbf v.
$$

微分算子也有同样的偏爱。令

$$
x(t)=e^{st},
$$

那么

$$
\frac{d}{dt}e^{st}=s e^{st}.
$$

微分没有把它变成另一种函数，只是乘了一个复数 $s$。因此对于由加法、数乘和微分组成的线性常系数系统，复指数就像特征向量：输入一个模式，系统只改变它的幅度和相位。

把 $s$ 写成 $\sigma+j\omega$：

$$
e^{st}=e^{\sigma t}e^{j\omega t}.
$$

- $e^{\sigma t}$ 是包络：$\sigma<0$ 时衰减，$\sigma>0$ 时增长；
- $e^{j\omega t}$ 是旋转：在复平面中以角速度 $\omega$ 绕圆；
- 两者相乘是一条向内或向外的螺旋。

先在实验 1 中把 $\omega$ 调成 0，你会看到纯指数；再把 $\sigma$ 调成 0，就只剩单位圆上的纯旋转。Laplace 变换所扫描的，正是所有这样的组合模式。

## 第二章：一个同时“加权”和“绕圈”的积分

双边 Laplace 变换定义为

$$
X(s)=\int_{-\infty}^{\infty}x(t)e^{-st}\,dt.
$$

对因果系统，常从单边形式开始：

$$
X(s)=\int_{0^-}^{\infty}x(t)e^{-st}\,dt.
$$

代入 $s=\sigma+j\omega$：

$$
X(\sigma+j\omega)
=\int x(t)\underbrace{e^{-\sigma t}}_{\text{指数加权}}
\underbrace{e^{-j\omega t}}_{\text{复平面旋转}}\,dt.
$$

这给出了最值得保留的直觉：

1. 先用 $e^{-\sigma t}$ 决定远处的时间样本该被压低还是放大；
2. 再用 $e^{-j\omega t}$ 把样本按角速度 $\omega$ 绕到复平面；
3. 最后把所有小向量加起来。

实验 2 显示的是有限时间积分 $X_T(s)$，因此任何设置都会得到有限数值。真正的 Laplace 变换还要让观察时间趋于无穷，这会引出“这个和是否稳定”的问题。

<details>
<summary><strong>试一试：</strong>选择“余弦”，令测试频率接近信号频率，会发生什么？</summary>

绕线图会明显偏向一侧，合向量变长。频率不匹配时，各段向量更容易互相抵消。这与 Fourier 变换的“绕圆—质心”图像相同；Laplace 额外增加了指数加权旋钮 $\sigma$。
</details>

## 第三章：Fourier 变换只是 \(s\) 平面上的一条线

若令 $\sigma=0$，Laplace 核变成

$$
e^{-st}=e^{-j\omega t},
$$

于是

$$
X(j\omega)=\int_{-\infty}^{\infty}x(t)e^{-j\omega t}\,dt,
$$

这正是连续时间 Fourier 变换的常用形式。几何上，Fourier 变换沿着 $s$ 平面的虚轴取值；Laplace 变换则允许探针向左或向右移动，主动补偿信号的增长或衰减。

但有一个重要前提：

> **只有当 Laplace 变换的收敛域包含虚轴时，Fourier 变换才存在。**

实验 3 用颜色显示 $\lvert X(s)\rvert$ 的数量级：

- 粉色叉号是极点；
- 虚线是收敛边界；
- 阴影区内，原始无穷积分发散；
- 阴影区仍显示出的颜色，是同一代数表达式的解析延拓，不代表原积分在那里突然变得可积。

例如

$$
x(t)=e^{-at}u(t)
\quad\Longrightarrow\quad
X(s)=\frac{1}{s+a},
$$

但这个积分只在

$$
\operatorname{Re}(s)>-a
$$

时收敛。公式和收敛域必须一起保存。

## 第四章：为什么只背 \(1/(s+a)\) 还不够

考虑两种信号：

$$
x_1(t)=e^{-at}u(t),
$$

以及

$$
x_2(t)=-e^{-at}u(-t).
$$

形式计算都会给出

$$
X(s)=\frac{1}{s+a},
$$

可是：

- $x_1(t)$ 位于时间轴右侧，收敛域是 $\operatorname{Re}(s)>-a$；
- $x_2(t)$ 位于时间轴左侧，收敛域是 $\operatorname{Re}(s)<-a$。

同一个有理式，因为收敛域不同，对应了不同的时间信号。对于系统而言，收敛域还携带因果性和稳定性信息。

实验 4 没有直接假设积分到无穷，而是画出截断积分 $I(R)$。如果随着 $R$ 增大曲线趋于平台，这个 $s$ 点属于收敛域；若曲线持续上升，就不属于。

这也是理解“极点”的第一步：在 $s=-a$ 处，分母为零，收敛边界无法跨过这个点。

## 第五章：微分方程为什么会变成代数方程

考虑一个一阶系统：

$$
\tau y'(t)+y(t)=x(t).
$$

它可以描述 RC 低通电路，也可以描述温度、液位或传感器的一阶迟滞。单边 Laplace 变换利用

$$
\mathcal L\{y'(t)\}=sY(s)-y(0^-)
$$

把微分方程变成

$$
(\tau s+1)Y(s)=X(s)+\tau y(0^-).
$$

原本要追踪整条时间曲线，现在只需要做代数运算。若初值为零：

$$
H(s)=\frac{Y(s)}{X(s)}
=\frac{1}{\tau s+1}.
$$

分母在

$$
s=-\frac{1}{\tau}
$$

处为零，这就是系统的极点。它距离虚轴越远，瞬态衰减越快；距离越近，系统“忘掉过去”所需的时间越长。

实验 5 可以切换阶跃、脉冲和正弦输入。注意初值不是凭空消失，而是作为额外项进入变换域；这正是单边 Laplace 变换在初值问题中特别方便的原因。

## 第六章：从极点位置直接阅读系统行为

标准二阶低通系统写作

$$
H(s)=
\frac{\omega_n^2}
{s^2+2\zeta\omega_n s+\omega_n^2}.
$$

$\omega_n$ 是自然角频率，$\zeta$ 是阻尼比。两个极点是

$$
s_{1,2}
=-\zeta\omega_n
\pm \omega_n\sqrt{\zeta^2-1}.
$$

当 $\zeta<1$ 时，平方根带来虚部，极点是一对共轭复数。它们的位置同时编码了：

- 实部：振荡衰减速度；
- 虚部：振铃频率；
- 到原点的尺度：系统的自然时间尺度。

实验 6 把三幅图绑定在一起：

1. 左侧是极点位置；
2. 右上是单位阶跃响应；
3. 右下是频率响应。

把阻尼比逐渐调小，极点向虚轴靠近，阶跃响应的振铃持续更久，频率响应在 $\omega_n$ 附近出现更高的共振峰。你看到的是同一个系统的三种语言，而不是三个互不相干的公式。

### 稳定性最简规则

对于连续时间、因果、有理的 LTI 系统：

- 所有极点都在左半平面：自然响应随时间衰减，系统稳定；
- 极点进入右半平面：存在随时间增长的模式，系统不稳定；
- 极点落在虚轴上：需要检查重数；理想无阻尼振荡是临界情形。

零点也会塑造响应，但它们通常不决定内部自然模式是否增长。直观地说，**极点告诉你系统自己想怎样运动，零点告诉你某些输入输出通道怎样抵消。**

## 把整篇文章压缩成一幅心智图

| 时间域问题 | 变换域动作 | 工程含义 |
|---|---|---|
| 微分 $d/dt$ | 乘以 $s$，并带入初值项 | 微分方程变代数方程 |
| 卷积 $x*h$ | 相乘 $X(s)H(s)$ | 串联系统更容易分析 |
| 指数衰减或增长 | $s$ 平面上的水平位置 | 决定瞬态速度与稳定性 |
| 正弦振荡 | $s$ 平面上的垂直位置 | 决定频率和相位 |
| 长时间是否可积 | 收敛域 ROC | 区分因果性、稳定性和信号方向 |
| 分母为零 | 极点 | 自然模式、共振和瞬态 |

Laplace 变换并不是要把时间“消灭”。它是换到一个更适合线性系统的坐标系，在那里：

$$
\text{微分}\rightarrow\text{乘法},
\qquad
\text{卷积}\rightarrow\text{乘法},
\qquad
\text{系统行为}\rightarrow\text{极点与零点}.
$$

最后再做逆变换，回到我们真正观察到的时间响应。

## 三个容易混淆的地方

1. **Laplace 变换不是单纯的“更一般 Fourier 变换”。**
   它还必须携带收敛域；没有 ROC，有理式可能无法唯一确定时域信号。

2. **热图上的有限颜色不等于原积分在那里收敛。**
   有理函数可以越过收敛边界做解析延拓，但积分定义与解析延拓是两件事。

3. **极点很重要，但不能单独替代完整模型。**
   零点、增益、初值、输入位置以及不可控或不可观测模式都会影响实际测量结果。

---

### 延伸阅读

- [3Blue1Brown：But what is a Laplace Transform?](https://www.3blue1brown.com/lessons/laplace-transform/)
- [3Blue1Brown：The Physics of Euler's Formula — Laplace Transform Prelude](https://www.3blue1brown.com/lessons/complex-exponents/)
- [3Blue1Brown：Why Laplace transforms are so useful](https://www.3blue1brown.com/lessons/laplace-for-odes/)
- [3Blue1Brown：But what is the Fourier Transform?](https://www.3blue1brown.com/lessons/fourier-transforms/)

> 本文参考上述课程的视觉化教学思路，重新组织为面向信号与系统学习者的独立中文内容；文字、图形和交互实现均为重新创作，并非视频逐字稿或动画复刻。
