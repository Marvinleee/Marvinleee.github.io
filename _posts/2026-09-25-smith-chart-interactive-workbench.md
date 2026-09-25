---
layout: post
title: "把史密斯圆图当作地图：从阻抗、反射系数到匹配路径"
date: 2026-09-25 10:00:00 +0800
categories: [电子工程]
tags: [史密斯圆图, 传输线, 阻抗匹配, VNA, 射频工程]
description: "不背刻度，从双线性变换出发理解史密斯圆图：如何放置复阻抗、读取反射与驻波比、沿传输线旋转，并用串并联元件走到匹配中心。"
math: true
toc: true
---

第一次看到史密斯圆图，它很像一张只有射频工程师才能阅读的旧地图：圆套着圆，弧线交错，边缘还挤满波长和角度刻度。

其实整张图只做了一件事：

> 把从零到无穷大的复阻抗，变换成单位圆内的复反射系数。

一旦把它看成“反射系数平面”，大多数规则就不需要死记：

- 圆心是匹配，因为 $\Gamma=0$；
- 圆周是全反射，因为 $\lvert\Gamma\rvert=1$；
- 离圆心的距离就是反射系数幅度；
- 绕圆心旋转就是改变反射相位，也就是沿传输线移动；
- 加电感或电容，就是沿特定的等电阻圆或等电导圆移动。

本文是本站已有[《史密斯圆图：一段历史，以及为何它对射频工程师如此重要》](/posts/the-smith-chart-its-history-and-why-its-so-important/)的实战续篇。历史篇回答“为什么重要”，这篇回答“怎样真正用起来”。如果对特性阻抗和反射还不熟，可以先读[《特性阻抗到底是什么？》](/posts/characteristic-impedance-interactive-guide/)。

<!--
ARTICLE_ARCHITECTURE
Future interactive route: /assets/interactive/smith-chart-lab/
Recommended embed position: immediately after this introduction.
Required views:
  1. map       - z <-> Gamma transform and draggable point
  2. grid      - constant-r and constant-x construction
  3. line      - movement along a transmission line
  4. admittance- impedance/admittance toggle and 180-degree transform
  5. matching  - series/shunt L-C path builder
  6. vna       - frequency sweep interpretation
State API:
  #map?z0=50&r=100&x=50
  #line?z0=50&r=100&x=50&length=0.1
  #matching?z0=50&r=100&x=50&f=100e6
Accessibility requirements:
  Every plotted point must expose numeric z, Gamma, VSWR and return loss.
  Keyboard arrows must move the selected point; reduced-motion mode disables animated traces.
The article below is a complete no-JavaScript fallback.
-->

<section id="smith-lab" class="smith-lab" aria-label="史密斯圆图交互工作台">
  <div class="smith-head">
    <div>
      <span class="smith-kicker">INTERACTIVE SMITH WORKBENCH</span>
      <h2>把阻抗、线长和匹配路径放到同一张图上</h2>
      <p>圆图支持鼠标或触摸拖拽；所有结果同时给出数值，便于交叉检查。</p>
    </div>
    <button type="button" data-smith-action="reset-all">恢复默认</button>
  </div>

  <div class="smith-tabs" role="tablist" aria-label="圆图实验选择">
    <button type="button" role="tab" aria-selected="true" data-smith-view="map">1 · 阻抗映射</button>
    <button type="button" role="tab" aria-selected="false" data-smith-view="grid">2 · 网格构造</button>
    <button type="button" role="tab" aria-selected="false" data-smith-view="line">3 · 沿线旋转</button>
    <button type="button" role="tab" aria-selected="false" data-smith-view="admittance">4 · 阻抗/导纳</button>
    <button type="button" role="tab" aria-selected="false" data-smith-view="matching">5 · L/C 匹配</button>
    <button type="button" role="tab" aria-selected="false" data-smith-view="vna">6 · VNA 轨迹</button>
  </div>

  <div class="smith-layout">
    <div class="smith-stage">
      <canvas data-smith-canvas width="900" height="680" aria-label="可拖拽的史密斯圆图"></canvas>
      <div class="smith-hint" data-smith-hint>拖动青色负载点，观察 Z 与 Γ 同时变化</div>
    </div>

    <div class="smith-side">
      <div class="smith-panel is-active" data-smith-panel="map">
        <h3>阻抗 ↔ 反射系数</h3>
        <label>参考阻抗 Z₀ / Ω<input data-smith-key="z0" type="number" value="50" min="1" step="1"></label>
        <label>负载电阻 R / Ω<input data-smith-key="load-r" type="number" value="100" min="0" step="1"></label>
        <label>负载电抗 X / Ω<input data-smith-key="load-x" type="number" value="50" step="1"></label>
        <p>也可以直接在圆内拖动负载点。</p>
      </div>

      <div class="smith-panel" data-smith-panel="grid" hidden>
        <h3>等值曲线从哪里来</h3>
        <label>高亮曲线
          <select data-smith-key="grid-kind"><option value="r">等电阻圆 r</option><option value="x">等电抗弧 x</option></select>
        </label>
        <label>归一化数值 <output data-smith-out="grid-value"></output>
          <input data-smith-key="grid-value" type="range" min="0" max="5" step="0.1" value="1">
        </label>
        <p>切换曲线并拖动数值，观察它们为何都汇聚到开路点。</p>
      </div>

      <div class="smith-panel" data-smith-panel="line" hidden>
        <h3>沿无损传输线移动</h3>
        <label>距负载的长度 <output data-smith-out="line-length"></output>
          <input data-smith-key="line-length" type="range" min="0" max="0.5" step="0.0025" value="0.1">
        </label>
        <p>向信号源移动时，点沿等 VSWR 圆顺时针旋转；半波长恰好转一整圈。</p>
      </div>

      <div class="smith-panel" data-smith-panel="admittance" hidden>
        <h3>阻抗与导纳相差 180°</h3>
        <label>显示方式
          <select data-smith-key="admit-view"><option value="both">同时显示</option><option value="z">只看阻抗</option><option value="y">只看导纳</option></select>
        </label>
        <p>青色点是 z，橙色点是 y=1/z。并联元件在导纳视角下更容易处理。</p>
      </div>

      <div class="smith-panel" data-smith-panel="matching" hidden>
        <h3>用理想 L/C 走到圆心</h3>
        <label>工作频率 / MHz<input data-smith-key="match-f" type="number" value="100" min="0.001" step="1"></label>
        <label>每步归一化电抗/电纳 <output data-smith-out="match-step"></output>
          <input data-smith-key="match-step" type="range" min="0.02" max="1.5" step="0.01" value="0.2">
        </label>
        <div class="smith-button-grid">
          <button type="button" data-element="series-l">串联 L</button>
          <button type="button" data-element="series-c">串联 C</button>
          <button type="button" data-element="shunt-l">并联 L</button>
          <button type="button" data-element="shunt-c">并联 C</button>
        </div>
        <button type="button" class="smith-secondary" data-smith-action="undo-match">撤销一步</button>
        <button type="button" class="smith-secondary" data-smith-action="reset-match">从负载重来</button>
        <div class="smith-component" data-smith-component>选择一个元件开始匹配。</div>
      </div>

      <div class="smith-panel" data-smith-panel="vna" hidden>
        <h3>模拟串联 RLC 的扫频轨迹</h3>
        <div class="smith-two">
          <label>R / Ω<input data-smith-key="vna-r" type="number" value="50" min="0" step="1"></label>
          <label>L / nH<input data-smith-key="vna-l" type="number" value="100" min="0.001" step="1"></label>
          <label>C / pF<input data-smith-key="vna-c" type="number" value="25" min="0.001" step="1"></label>
          <label>起点 / MHz<input data-smith-key="vna-f0" type="number" value="30" min="0.001" step="1"></label>
          <label>终点 / MHz<input data-smith-key="vna-f1" type="number" value="200" min="0.002" step="1"></label>
        </div>
        <label>频率游标 <output data-smith-out="vna-cursor"></output>
          <input data-smith-key="vna-cursor" type="range" min="0" max="100" step="1" value="50">
        </label>
      </div>

      <div class="smith-readout" data-smith-readout aria-live="polite"></div>
    </div>
  </div>
</section>

<style>
  .smith-lab{--s-bg:#071019;--s-card:#0d1c29;--s-grid:#29485d;--s-text:#eaf5fb;--s-muted:#a3b7c5;--s-cyan:#42e3da;--s-amber:#ffb553;--s-pink:#ff7096;margin:2rem 0 2.8rem;padding:1rem;border:1px solid rgba(74,181,196,.4);border-radius:22px;background:radial-gradient(circle at 15% -10%,rgba(66,227,218,.18),transparent 34%),var(--s-bg);color:var(--s-text);box-shadow:0 24px 80px rgba(0,0,0,.28)}
  .smith-lab *{box-sizing:border-box}.smith-head{display:flex;justify-content:space-between;gap:1rem;align-items:flex-start;padding:.35rem .35rem 1rem}.smith-head h2{margin:.12rem 0 .28rem;color:var(--s-text);font-size:clamp(1.3rem,3vw,2rem)}.smith-head p{margin:0;color:var(--s-muted)}.smith-kicker{font:700 .7rem/1.2 ui-monospace,monospace;letter-spacing:.15em;color:var(--s-cyan)}
  .smith-lab button{border:1px solid var(--s-grid);border-radius:10px;background:#102536;color:var(--s-text);padding:.62rem .55rem;font-weight:700;cursor:pointer}.smith-lab button:hover{filter:brightness(1.17)}.smith-tabs{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:.4rem;margin-bottom:.8rem}.smith-tabs button[aria-selected="true"]{border-color:var(--s-cyan);background:rgba(66,227,218,.14);color:#bffefa}
  .smith-layout{display:grid;grid-template-columns:minmax(0,1.55fr) minmax(280px,.75fr);gap:.9rem}.smith-stage{position:relative;min-width:0;padding:.55rem;border:1px solid var(--s-grid);border-radius:16px;background:#06101a}.smith-stage canvas{display:block;width:100%;height:auto;touch-action:none;cursor:crosshair}.smith-hint{position:absolute;left:1rem;right:1rem;bottom:.9rem;padding:.45rem .65rem;border-radius:8px;background:rgba(4,12,20,.82);color:var(--s-muted);font-size:.78rem;text-align:center;pointer-events:none}
  .smith-side{padding:.85rem;border:1px solid var(--s-grid);border-radius:16px;background:linear-gradient(165deg,rgba(15,36,52,.97),rgba(7,17,27,.98))}.smith-panel h3{margin:.1rem 0 .9rem;color:var(--s-text);font-size:1.05rem}.smith-panel p{font-size:.82rem;color:var(--s-muted)}.smith-panel label{display:flex;flex-direction:column;gap:.32rem;margin:.65rem 0;color:var(--s-muted);font-size:.78rem;font-weight:700}.smith-panel input,.smith-panel select{width:100%;border:1px solid var(--s-grid);border-radius:9px;background:#071522;color:var(--s-text);padding:.52rem}.smith-panel input[type="range"]{padding:0;accent-color:var(--s-cyan)}.smith-button-grid,.smith-two{display:grid;grid-template-columns:1fr 1fr;gap:.45rem}.smith-button-grid button{border-color:rgba(66,227,218,.45)}.smith-secondary{width:100%;margin-top:.45rem}.smith-component{margin-top:.65rem;padding:.65rem;border-left:3px solid var(--s-amber);background:rgba(255,181,83,.08);font-size:.8rem;color:var(--s-text)}.smith-readout{margin-top:1rem;padding:.8rem;border-radius:11px;background:rgba(66,227,218,.08);border:1px solid rgba(66,227,218,.22);font-variant-numeric:tabular-nums;font-size:.86rem}.smith-readout b{color:var(--s-cyan)}
  @media(max-width:900px){.smith-tabs{grid-template-columns:repeat(3,1fr)}.smith-layout{grid-template-columns:1fr}.smith-side{min-height:280px}}
  @media(max-width:520px){.smith-lab{padding:.65rem;border-radius:16px}.smith-head{display:block}.smith-head>button{margin-top:.7rem}.smith-tabs{grid-template-columns:1fr 1fr}.smith-tabs button{font-size:.76rem}.smith-hint{position:static;margin-top:.35rem}.smith-two{grid-template-columns:1fr 1fr}}
  @media(prefers-reduced-motion:reduce){.smith-lab *{transition:none!important;scroll-behavior:auto!important}}
</style>

<script>
(() => {
  const root=document.getElementById('smith-lab');
  if(!root||root.dataset.ready)return;
  root.dataset.ready='1';
  const q=s=>root.querySelector(s),qa=s=>Array.from(root.querySelectorAll(s));
  const canvas=q('[data-smith-canvas]'),ctx=canvas.getContext('2d'),W=canvas.width,H=canvas.height;
  const center={x:W/2,y:H/2-12},radius=Math.min(W,H)*.405;
  const key=k=>q('[data-smith-key="'+k+'"]');
  const num=k=>Number(key(k).value);
  const out=(k,s)=>{const el=q('[data-smith-out="'+k+'"]');if(el)el.textContent=s;};
  const add=(a,b)=>({re:a.re+b.re,im:a.im+b.im});
  const mul=(a,b)=>({re:a.re*b.re-a.im*b.im,im:a.re*b.im+a.im*b.re});
  const div=(a,b)=>{const d=b.re*b.re+b.im*b.im;return{re:(a.re*b.re+a.im*b.im)/d,im:(a.im*b.re-a.re*b.im)/d};};
  const inv=a=>div({re:1,im:0},a);
  const abs=a=>Math.hypot(a.re,a.im);
  const polar=(m,p)=>({re:m*Math.cos(p),im:m*Math.sin(p)});
  const toG=z=>div({re:z.re-1,im:z.im},{re:z.re+1,im:z.im});
  const fromG=g=>div({re:1+g.re,im:g.im},{re:1-g.re,im:-g.im});
  const pix=g=>({x:center.x+radius*g.re,y:center.y-radius*g.im});
  const fmt=(n,d=3)=>Number.isFinite(n)?n.toFixed(d):'∞';
  const z0=()=>Math.max(.001,num('z0'));
  const loadZ=()=>({re:num('load-r')/z0(),im:num('load-x')/z0()});
  const color={grid:'#29485d',axis:'#6e8da0',text:'#a3b7c5',cyan:'#42e3da',amber:'#ffb553',pink:'#ff7096',white:'#eaf5fb'};
  let view='map',matchZ=loadZ(),matchHistory=[],matchTrace=[toG(matchZ)],lastComponent='选择一个元件开始匹配。';

  function line(points,stroke,width=2,dash=[]){if(!points.length)return;ctx.save();ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.setLineDash(dash);ctx.beginPath();points.forEach((p,i)=>{const a=pix(p);i?ctx.lineTo(a.x,a.y):ctx.moveTo(a.x,a.y);});ctx.stroke();ctx.restore();}
  function label(s,x,y,fill=color.text,size=18,align='center'){ctx.fillStyle=fill;ctx.font=size+'px system-ui,sans-serif';ctx.textAlign=align;ctx.fillText(s,x,y);}
  function curveR(r,stroke=color.grid,width=1.4){const pts=[];for(let i=0;i<=360;i++){const x=-30+60*i/360;pts.push(toG({re:r,im:x}));}line(pts,stroke,width);}
  function curveX(x,stroke=color.grid,width=1.4){const pts=[];for(let i=0;i<=360;i++){const r=30*i/360;pts.push(toG({re:r,im:x}));}line(pts,stroke,width);}
  function grid(){
    ctx.clearRect(0,0,W,H);ctx.fillStyle='#06101a';ctx.fillRect(0,0,W,H);
    ctx.save();ctx.strokeStyle=color.axis;ctx.lineWidth=3;ctx.beginPath();ctx.arc(center.x,center.y,radius,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.moveTo(center.x-radius,center.y);ctx.lineTo(center.x+radius,center.y);ctx.stroke();ctx.restore();
    [0,.2,.5,1,2,5].forEach(r=>curveR(r));[.2,.5,1,2,5].forEach(x=>{curveX(x);curveX(-x);});
    label('短路',center.x-radius,center.y+30,color.text,17);label('匹配',center.x,center.y+30,color.text,17);label('开路',center.x+radius,center.y+30,color.text,17);
    label('感性 +jX',center.x,center.y-radius-16,color.cyan,17);label('容性 −jX',center.x,center.y+radius+28,color.amber,17);
  }
  function dot(g,fill,r=9,tag=''){const p=pix(g);ctx.fillStyle=fill;ctx.beginPath();ctx.arc(p.x,p.y,r,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#06101a';ctx.lineWidth=3;ctx.stroke();if(tag)label(tag,p.x+15,p.y-13,fill,18,'left');}
  function stats(z,g,prefix=''){
    const m=abs(g),a=Math.atan2(g.im,g.re)*180/Math.PI,vs=m>=.999999?Infinity:(1+m)/(1-m),rl=m===0?Infinity:-20*Math.log10(m),Z=z0();
    return prefix+'<b>Z</b> = '+fmt(z.re*Z,2)+(z.im>=0?'+':'')+fmt(z.im*Z,2)+'j Ω<br><b>z</b> = '+fmt(z.re,3)+(z.im>=0?'+':'')+fmt(z.im,3)+'j<br><b>Γ</b> = '+fmt(g.re,3)+(g.im>=0?'+':'')+fmt(g.im,3)+'j，|Γ|='+fmt(m,3)+'，∠'+fmt(a,1)+'°<br><b>VSWR</b> = '+fmt(vs,2)+'，<b>RL</b> = '+fmt(rl,2)+' dB';
  }
  function syncMatch(){matchZ=loadZ();matchHistory=[];matchTrace=[toG(matchZ)];lastComponent='选择一个元件开始匹配。';q('[data-smith-component]').textContent=lastComponent;}

  function drawMap(){grid();const z=loadZ(),g=toG(z);dot(g,color.cyan,11,'ZL');q('[data-smith-readout]').innerHTML=stats(z,g);q('[data-smith-hint]').textContent='拖动青色负载点，观察 Z 与 Γ 同时变化';}
  function drawGrid(){grid();const kind=key('grid-kind').value,v=num('grid-value');out('grid-value',fmt(v,1));if(kind==='r')curveR(v,color.pink,5);else{curveX(Math.max(.01,v),color.pink,5);curveX(-Math.max(.01,v),color.pink,5);}const eq=kind==='r'?'圆心 r/(1+r)，半径 1/(1+r)':'圆心 (1,1/x)，半径 1/|x|';q('[data-smith-readout]').innerHTML='<b>'+ (kind==='r'?'等电阻圆 r='+fmt(v,1):'等电抗弧 x=±'+fmt(v,1))+'</b><br>'+eq+'。所有曲线都经过最右侧的开路点。';q('[data-smith-hint]').textContent='改变高亮曲线，观察网格的几何规律';}
  function drawLine(){grid();const z=loadZ(),g0=toG(z),l=num('line-length'),g=mul(g0,polar(1,-4*Math.PI*l)),zin=fromG(g);out('line-length',fmt(l,3)+' λg');const pts=[];for(let i=0;i<=120;i++)pts.push(mul(g0,polar(1,-4*Math.PI*l*i/120)));line(pts,color.pink,5);dot(g0,color.amber,8,'负载');dot(g,color.cyan,11,'输入');q('[data-smith-readout]').innerHTML=stats(zin,g,'向源移动 <b>'+fmt(l,3)+' λg</b><br>')+'<br>|Γ| 没有改变，只改变了相位。';q('[data-smith-hint]').textContent='移动长度滑块：半波长转一整圈，四分之一波长转半圈';}
  function drawAdmittance(){grid();const z=loadZ(),g=toG(z),y=inv(z),gy={re:-g.re,im:-g.im},mode=key('admit-view').value;if(mode!=='y')dot(g,color.cyan,11,'z');if(mode!=='z')dot(gy,color.amber,11,'y');if(mode==='both')line([g,gy],color.pink,2,[8,7]);q('[data-smith-readout]').innerHTML='<b>z</b> = '+fmt(z.re,3)+(z.im>=0?'+':'')+fmt(z.im,3)+'j<br><b>y=1/z</b> = '+fmt(y.re,3)+(y.im>=0?'+':'')+fmt(y.im,3)+'j<br>两点相差 180°；并联电纳应在 y 平面相加。';q('[data-smith-hint]').textContent='青色为阻抗点，橙色为对应导纳点';}
  function drawMatching(){grid();line(matchTrace,color.pink,5);dot(toG(loadZ()),color.amber,8,'起点');dot(toG(matchZ),color.cyan,11,'当前');const g=toG(matchZ);out('match-step',fmt(num('match-step'),2));q('[data-smith-component]').textContent=lastComponent;q('[data-smith-readout]').innerHTML=stats(matchZ,g,'已添加 <b>'+matchHistory.length+'</b> 个理想元件<br>')+'<br>距离圆心 |Γ| = <b>'+fmt(abs(g),4)+'</b>。';q('[data-smith-hint]').textContent='串联元件沿等电阻圆；并联元件沿等电导圆';}
  function vnaZ(f){const w=2*Math.PI*f*1e6,R=num('vna-r'),L=num('vna-l')*1e-9,C=num('vna-c')*1e-12;return{re:R/z0(),im:(w*L-1/(w*C))/z0()};}
  function drawVna(){grid();const f0=Math.max(.001,num('vna-f0')),f1=Math.max(f0+.001,num('vna-f1')),pts=[];for(let i=0;i<=240;i++){const f=f0+(f1-f0)*i/240;pts.push(toG(vnaZ(f)));}line(pts,color.pink,5);const k=num('vna-cursor')/100,f=f0+(f1-f0)*k,z=vnaZ(f),g=toG(z);dot(g,color.cyan,11,'游标');out('vna-cursor',fmt(f,1)+' MHz');const fres=1/(2*Math.PI*Math.sqrt(num('vna-l')*1e-9*num('vna-c')*1e-12))/1e6;q('[data-smith-readout]').innerHTML=stats(z,g,'扫频 <b>'+fmt(f0,1)+'–'+fmt(f1,1)+' MHz</b><br>')+'<br>理想串联谐振频率约 <b>'+fmt(fres,2)+' MHz</b>；穿过水平轴只表示 X=0。';q('[data-smith-hint]').textContent='粉色轨迹从低频容性区，经谐振后进入感性区';}
  function draw(){if(view==='map')drawMap();if(view==='grid')drawGrid();if(view==='line')drawLine();if(view==='admittance')drawAdmittance();if(view==='matching')drawMatching();if(view==='vna')drawVna();}
  function show(v){view=v;qa('[data-smith-view]').forEach(b=>b.setAttribute('aria-selected',String(b.dataset.smithView===v)));qa('[data-smith-panel]').forEach(p=>p.hidden=p.dataset.smithPanel!==v);draw();}

  function applyElement(type){
    const step=num('match-step'),f=num('match-f')*1e6,Z=z0(),old={re:matchZ.re,im:matchZ.im},samples=[];matchHistory.push({z:old,trace:matchTrace.slice(),label:lastComponent});
    for(let i=1;i<=30;i++){
      const d=step*i/30;let zi;
      if(type==='series-l')zi={re:old.re,im:old.im+d};
      if(type==='series-c')zi={re:old.re,im:old.im-d};
      if(type==='shunt-c'){const y=inv(old);zi=inv({re:y.re,im:y.im+d});}
      if(type==='shunt-l'){const y=inv(old);zi=inv({re:y.re,im:y.im-d});}
      samples.push(toG(zi));if(i===30)matchZ=zi;
    }
    matchTrace=matchTrace.concat(samples);const w=2*Math.PI*f;let value='';
    if(type==='series-l')value='串联电感 '+fmt(step*Z/w*1e9,2)+' nH';
    if(type==='series-c')value='串联电容 '+fmt(1/(w*step*Z)*1e12,2)+' pF';
    if(type==='shunt-c')value='并联电容 '+fmt((step/Z)/w*1e12,2)+' pF';
    if(type==='shunt-l')value='并联电感 '+fmt(1/(w*(step/Z))*1e9,2)+' nH';
    lastComponent=value+'（'+fmt(f/1e6,2)+' MHz）';drawMatching();
  }

  let dragging=false;
  function dragPoint(ev){
    if(!['map','grid','admittance','line'].includes(view))return;const rect=canvas.getBoundingClientRect(),gx=((ev.clientX-rect.left)*W/rect.width-center.x)/radius,gy=-( (ev.clientY-rect.top)*H/rect.height-center.y)/radius,m=Math.hypot(gx,gy),s=m>.985?.985/m:1,g={re:gx*s,im:gy*s},z=fromG(g),Z=z0();key('load-r').value=Math.max(0,z.re*Z).toFixed(2);key('load-x').value=(z.im*Z).toFixed(2);syncMatch();draw();
  }
  canvas.addEventListener('pointerdown',ev=>{dragging=true;canvas.setPointerCapture(ev.pointerId);dragPoint(ev);});canvas.addEventListener('pointermove',ev=>{if(dragging)dragPoint(ev);});canvas.addEventListener('pointerup',()=>dragging=false);canvas.addEventListener('pointercancel',()=>dragging=false);
  qa('[data-smith-view]').forEach(b=>b.addEventListener('click',()=>show(b.dataset.smithView)));
  qa('[data-smith-key]').forEach(el=>el.addEventListener('input',()=>{if(['z0','load-r','load-x'].includes(el.dataset.smithKey))syncMatch();draw();}));
  qa('[data-element]').forEach(b=>b.addEventListener('click',()=>applyElement(b.dataset.element)));
  q('[data-smith-action="undo-match"]').addEventListener('click',()=>{const last=matchHistory.pop();if(last){matchZ=last.z;matchTrace=last.trace;lastComponent=last.label;}drawMatching();});
  q('[data-smith-action="reset-match"]').addEventListener('click',()=>{syncMatch();drawMatching();});
  const defaults={};qa('input,select').forEach(el=>defaults[el.dataset.smithKey]=el.value);
  q('[data-smith-action="reset-all"]').addEventListener('click',()=>{qa('input,select').forEach(el=>{if(el.dataset.smithKey in defaults)el.value=defaults[el.dataset.smithKey];});syncMatch();show(view);});
  syncMatch();show('map');
})();
</script>

## 第一章：先把阻抗变成反射系数

### 为什么先归一化

假设系统参考阻抗为 $Z_0$，负载为：

$$
Z_L=R+jX
$$

先做归一化：

$$
z=\frac{Z_L}{Z_0}=r+jx
$$

这样，同一张圆图既能用于 50 Ω 系统，也能用于 75 Ω、100 Ω 差分或其他参考阻抗。圆心永远是归一化阻抗 $z=1+j0$，但它在不同系统里代表不同的实际阻抗。

| 参考阻抗 | 圆心代表的实际阻抗 |
|---:|---:|
| 50 Ω | $50+j0\ \Omega$ |
| 75 Ω | $75+j0\ \Omega$ |
| 100 Ω | $100+j0\ \Omega$ |

接着把归一化阻抗映射到反射系数：

$$
\Gamma=\frac{z-1}{z+1}
$$

反变换则是：

$$
z=\frac{1+\Gamma}{1-\Gamma}
$$

这是一种双线性变换。对于被动负载，$r\ge0$，所有可能的阻抗都会落在 $\lvert\Gamma\rvert\le1$ 的单位圆内部。

### 三个锚点

| 负载 | 归一化阻抗 $z$ | 反射系数 $\Gamma$ | 圆图位置 |
|---|---:|---:|---|
| 短路 | 0 | $-1$ | 最左端 |
| 匹配 | 1 | 0 | 圆心 |
| 开路 | $\infty$ | $+1$ | 最右端 |

圆图上方是感性区域，因为 $x>0$；下方是容性区域，因为 $x<0$。水平中轴线是纯电阻，因为 $x=0$。

<details>
<summary><strong>先猜一下：</strong>50 Ω 系统中的 100 Ω 纯电阻，在圆心左边还是右边？</summary>

归一化后 $z=2$，所以：

$$
\Gamma=\frac{2-1}{2+1}=\frac13
$$

$\Gamma$ 是正实数，点位于水平轴的右半侧。
</details>

## 第二章：看懂网格，而不是背网格

### 等电阻圆

把 $z=r+jx$ 代入反射系数变换，可以得到等电阻圆：

$$
\left(\Gamma_R-\frac{r}{1+r}\right)^2
+\Gamma_I^2
=\left(\frac{1}{1+r}\right)^2
$$

其中 $\Gamma_R$ 和 $\Gamma_I$ 是反射系数的实部和虚部。

因此，固定 $r$ 时：

- 圆心位于横轴 $r/(1+r)$；
- 半径为 $1/(1+r)$；
- 所有等电阻圆都经过最右侧开路点。

$r$ 越大，圆越小、越靠近右端。$r=0$ 时，等电阻圆就是整个外圆。

### 等电抗弧

固定 $x$ 时得到：

$$
(\Gamma_R-1)^2
+\left(\Gamma_I-\frac{1}{x}\right)^2
=\left(\frac{1}{x}\right)^2
$$

因此：

- $x>0$ 的感性电抗位于上半圆；
- $x<0$ 的容性电抗位于下半圆；
- 所有等电抗弧也经过最右侧开路点。

一条等电阻圆与一条等电抗弧的交点，就是唯一的 $z=r+jx$。

### 为什么开路点挤在同一个位置

当阻抗趋向无穷大时，无论它从多大的电阻或电抗方向靠近，反射系数都趋向 $+1$。所以所有等电阻圆和等电抗弧在最右端汇合。

这不是绘图缺陷，而是双线性变换把“无穷远”压缩成了一个有限点。

## 第三章：在圆图上放置一个真实阻抗

设参考阻抗 $Z_0=50\ \Omega$，负载为：

$$
Z_L=100+j50\ \Omega
$$

第一步，归一化：

$$
z=\frac{100+j50}{50}=2+j1
$$

第二步，找到 $r=2$ 的等电阻圆与 $x=+1$ 的等电抗弧。这个点位于圆图右上方。

第三步，计算反射系数进行交叉检查：

$$
\Gamma=\frac{(2+j1)-1}{(2+j1)+1}
=0.4+j0.2
$$

所以：

$$
\lvert\Gamma\rvert=\sqrt{0.4^2+0.2^2}=0.447
$$

$$
\angle\Gamma=\tan^{-1}\frac{0.2}{0.4}=26.6^\circ
$$

圆图上从圆心指向该点的向量，长度约为 0.447，角度约为 $26.6^\circ$。

### 从一个点还能直接得到什么

低损耗、实数参考阻抗条件下：

$$
\mathrm{VSWR}=\frac{1+\lvert\Gamma\rvert}{1-\lvert\Gamma\rvert}
$$

$$
\mathrm{RL}=-20\log_{10}\lvert\Gamma\rvert
$$

对于本例：

$$
\mathrm{VSWR}\approx2.62
$$

$$
\mathrm{RL}\approx6.99\ \mathrm{dB}
$$

所有 $\lvert\Gamma\rvert$ 相同的点都位于以圆心为中心的同一个圆上。这类圆常被称为等驻波比圆：绕圆心旋转时，反射相位变化，但反射幅度、VSWR 和回波损耗不变。

## 第四章：沿传输线移动，就是绕圆心旋转

对于无损传输线，若从负载向信号源方向移动距离 $\ell$：

$$
\Gamma_{in}=\Gamma_L e^{-j2\beta\ell}
$$

又因为：

$$
\beta=\frac{2\pi}{\lambda_g}
$$

所以反射系数相位变化量为：

$$
\Delta\phi=-\frac{4\pi\ell}{\lambda_g}
$$

在常用的 $e^{j\omega t}$ 约定下，从负载向信号源移动对应顺时针旋转；向负载移动则逆时针旋转。

这解释了圆图外圈为什么常用“toward generator”和“toward load”的波长刻度。

### 为什么半波长转一整圈

当 $\ell=\lambda_g/2$：

$$
\Delta\phi=-2\pi
$$

反射系数回到原点位，因此输入阻抗重新等于负载阻抗。四分之一波长则旋转半圈。

继续使用 $Z_L=100+j50\ \Omega$ 的例子。若在 50 Ω 无损线上，从负载向源移动 $0.1\lambda_g$：

$$
\Delta\phi=-72^\circ
$$

新的反射系数约为：

$$
\Gamma_{in}\approx0.314-j0.319
$$

由反变换得到：

$$
Z_{in}\approx69.9-j55.7\ \Omega
$$

注意两件事：

1. 阻抗从感性变成了容性；
2. $\lvert\Gamma\rvert$ 仍是 0.447，所以 VSWR 和回波损耗不变。

如果一根实际线缆有损，向源端移动时反射还会因往返衰减而逐渐靠近圆心。这可能让一个很差的负载在长线缆入口看起来“比较匹配”，但代价是送到负载的功率也减少了。

<details>
<summary><strong>快速练习：</strong>同一个负载经过四分之一波长 50 Ω 线后，输入阻抗是多少？</summary>

四分之一波长对应在等 VSWR 圆上旋转半圈。计算结果为：

$$
Z_{in}=20-j10\ \Omega
$$

也可直接用 $Z_{in}=Z_0^2/Z_L$ 验证。
</details>

## 第五章：阻抗图、导纳图与 L 型匹配路径

### 为什么并联元件更适合在导纳图上处理

串联元件直接加在阻抗上：

$$
z_{new}=z+jx_s
$$

所以加入串联电感或电容时，归一化电阻 $r$ 不变，点沿等电阻圆移动。

并联元件直接加在导纳上。定义：

$$
y=\frac{1}{z}=g+jb
$$

加入并联电纳后：

$$
y_{new}=y+jb_p
$$

所以点沿等电导圆移动。

阻抗点与对应的导纳点在圆图上相差 $180^\circ$。实际使用时，不一定要换一张图；把当前点绕圆心转半圈，就能读取对应的 $g+jb$。

### 例子：把 $100+j50\ \Omega$ 匹配到 50 Ω

设工作频率为 100 MHz。负载归一化阻抗是：

$$
z_L=2+j1
$$

对应归一化导纳：

$$
y_L=\frac{1}{2+j1}=0.4-j0.2
$$

因为负载的归一化电阻大于 1，一条方便的 L 型匹配路径是：

1. 先在负载端加入一个并联电纳，沿等电导圆移动；
2. 到达归一化电阻 $r=1$ 的位置；
3. 再加入串联电抗，沿 $r=1$ 圆走到中心。

这个问题有两组理想解。

#### 路径 A：并联电容 + 串联电感

需要加入的归一化并联电纳约为：

$$
\Delta b_p=+0.6899
$$

随后加入归一化串联电抗：

$$
x_s=+1.2247
$$

在 50 Ω、100 MHz 条件下：

$$
C_p=\frac{\Delta b_p/Z_0}{2\pi f}
\approx22.0\ \mathrm{pF}
$$

$$
L_s=\frac{x_sZ_0}{2\pi f}
\approx97.5\ \mathrm{nH}
$$

#### 路径 B：并联电感 + 串联电容

另一组解为：

$$
\Delta b_p=-0.2899,
\qquad
x_s=-1.2247
$$

换算得到：

$$
L_p\approx274.5\ \mathrm{nH}
$$

$$
C_s\approx26.0\ \mathrm{pF}
$$

两条路径在设计频率上都能把点带到圆心，但并不等价：它们的低通/高通性质、带宽、谐波响应、器件寄生和可实现性不同。

> 圆图给出的是理想网络的起点。频率升高后，电感的自谐振、电容的 ESL/ESR、焊盘、过孔和走线都会成为匹配网络的一部分。最终值应在包含布局寄生的模型或实测基础上微调。

### 支节匹配也是“走路径”

开路或短路支节提供随长度变化的纯电纳。在导纳图上，单支节匹配可以理解为：

1. 先沿主线旋转到 $g=1$ 的交点；
2. 再用并联支节提供相反的电纳，把点移到 $1+j0$；
3. 两个 $g=1$ 交点通常对应两组不同的主线位置和支节长度。

史密斯圆图的价值不只是得到一个答案，而是让多条可行路径同时可见。

## 第六章：怎样读 VNA 上的一条轨迹

VNA 的 Smith 显示通常不是一个静止点，而是一条随频率变化的轨迹。每个频点都有自己的复数 $S_{11}$；当端口参考阻抗为实数 $Z_0$ 时，$S_{11}$ 就是该频点的反射系数。

### 先问四个问题

1. **扫频方向是什么？** 必须知道轨迹从低频走向高频的方向。
2. **校准面在哪里？** 连接线和夹具是否已被校准或去嵌入？
3. **参考阻抗是多少？** 50 Ω VNA 上的圆心代表 50 Ω，不会因为接上 75 Ω 电缆就自动变成 75 Ω。
4. **你在看阻抗还是导纳？** 并联谐振和串联谐振在两种视角下更容易观察的特征不同。

### 常见轨迹的直觉

| 轨迹特征 | 可能代表什么 | 还需检查什么 |
|---|---|---|
| 穿过水平轴 | 该频点的输入电抗为零 | 实部是否接近目标阻抗 |
| 靠近圆心 | 该频点接近参考阻抗 | 是真正匹配，还是线缆损耗掩盖反射 |
| 接近圆周 | 强反射 | 开路、短路、强失配或高 Q 谐振 |
| 随频率绕圈 | 电气长度引起相位旋转 | 线缆延迟、校准面和参考面 |
| 小闭环或尖锐转折 | 谐振或多重耦合 | 器件寄生、夹具模式、测量动态范围 |

### 谐振不等于匹配

轨迹穿过水平轴只说明虚部为零。它可能落在 $20\ \Omega$、$50\ \Omega$ 或 $500\ \Omega$，因此“发生谐振”和“匹配到 50 Ω”不是同一个结论。

真正的 50 Ω 匹配要求轨迹在目标频率到达圆心附近。

### 回波损耗也不能单独说明效率

一个 50 Ω 电阻负载、一个损耗很大的天线，以及一个效率很高且正确匹配的天线，都可能在圆图上靠近中心。圆图告诉你端口反射，不会自动区分进入负载的功率最终变成了辐射、热还是其他模式。

## 常见错误清单

- **没有先归一化。** 100 Ω 在 50 Ω 图上是 $r=2$，在 75 Ω 图上是 $r=1.333$。
- **把线长移动当成匹配改善。** 无损线只改变反射相位，不改变 $\lvert\Gamma\rvert$。
- **把上半圆和下半圆记反。** 阻抗图上方感性、下方容性；切到导纳视角时应重新判断。
- **并联元件仍在阻抗网格上硬加。** 先转为导纳，路径会清楚很多。
- **把“经过水平轴”当成“经过圆心”。** 前者只是谐振，后者才是与参考阻抗匹配。
- **忽略测量参考面。** 一小段连接线就足以让点沿等 VSWR 圆旋转。
- **把漂亮的 S11 当成高效率。** 匹配、传输损耗和辐射效率必须分开评估。

## 一套可以重复使用的圆图工作流

1. 写下 $Z_0$、频率和负载 $Z_L$。
2. 计算归一化阻抗 $z=Z_L/Z_0$。
3. 用 $\Gamma=(z-1)/(z+1)$ 做数值交叉检查。
4. 从 $\lvert\Gamma\rvert$ 得到 VSWR、回波损耗与反射功率。
5. 若有线长，按 $2\beta\ell$ 绕圆心旋转。
6. 串联元件在阻抗图上沿等电阻圆移动。
7. 并联元件先转导纳，再沿等电导圆移动。
8. 到达圆心后，把归一化电抗或电纳换算成真实 L/C。
9. 最后加入器件 Q、寄生、容差、带宽和布局模型验证。

史密斯圆图的真正价值，不是取代计算器或仿真器，而是把“阻抗、反射、相位、线长和匹配网络”放在同一张图上。计算器给你数值，圆图告诉你这些数值正在往哪个方向变化，以及还有哪些路径可以选择。

## 练习

<details>
<summary><strong>练习 1：</strong>50 Ω 系统中，负载 $25-j25\ \Omega$ 位于哪里？</summary>

归一化阻抗为 $z=0.5-j0.5$：电阻小于 1，位于圆图左半区域；负电抗表示容性，位于下半圆。
</details>

<details>
<summary><strong>练习 2：</strong>一个点沿等 VSWR 圆旋转后，哪些量保持不变？</summary>

$\lvert\Gamma\rvert$、VSWR、回波损耗和理想条件下的反射功率比例保持不变；$\angle\Gamma$、输入阻抗的实部和虚部通常都会改变。
</details>

<details>
<summary><strong>练习 3：</strong>为什么一根有损长线可能让坏负载看起来更接近圆心？</summary>

反射波返回测量端时经历了往返衰减，因此测得的 $\lvert\Gamma\rvert$ 变小。但这不代表负载本身改善；正向送达负载的功率也在衰减。
</details>

## 参考资料

1. David H. Staelin, MIT OpenCourseWare, [Chapter 7: TEM Transmission Lines](https://ocw.mit.edu/courses/6-013-electromagnetics-and-applications-spring-2009/resources/mit6_013s09_chap07/)，其中包含反射系数、史密斯圆图、支节调谐和四分之一波长变换。
2. Keysight, [Understanding the Fundamental Principles of Vector Network Analysis](https://www.keysight.com/us/en/cmp/2026/understanding-the-fundamental-principles-of-vector-network-analysis.html).
3. Rohde & Schwarz, [Understanding the Smith Chart](https://www.rohde-schwarz.com/jp/products/test-and-measurement/essentials-test-equipment/spectrum-analyzers/understanding-the-smith-chart_257989.html).
4. 《特性インピーダンスってなんだ？》：传输线、反射、四分之一波长变换和实验部分的主要改写依据。
