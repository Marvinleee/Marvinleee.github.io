---
layout: post
title: "Z 变换如何描述数字系统？从序列、单位圆到数字滤波器"
date: 2026-09-26 14:00:00 +0800
categories: [数学与工程]
tags: [Z变换, 数字滤波器, 单位圆, 极点零点, 离散系统]
description: "用四个交互实验理解离散复指数、Z 变换收敛域、差分方程和数字滤波器极点零点。"
math: true
toc: true
---

Laplace 变换用 $e^{st}$ 测试连续时间系统；离散系统对应的自然模式则是

$$
z^n.
$$

把 $z$ 写成 $re^{j\omega}$，半径 $r$ 控制样本随 $n$ 增长或衰减，角度 $\omega$ 控制每一步旋转多少。Z 变换就是把离散序列投影到这些模式上。

<section id="zt-lab" class="zt-lab" aria-label="Z 变换交互实验室">
  <div class="zt-head"><div><span>INTERACTIVE LAB</span><h2>Z 变换交互实验室</h2><p>从离散螺旋到收敛域、差分方程和滤波器。</p></div><button type="button" data-action="reset">恢复默认</button></div>
  <div class="zt-tabs" role="tablist" aria-label="实验选择">
    <button type="button" role="tab" aria-selected="true" data-view="mode">1 · 离散复指数</button>
    <button type="button" role="tab" aria-selected="false" data-view="roc">2 · Z 平面与 ROC</button>
    <button type="button" role="tab" aria-selected="false" data-view="difference">3 · 差分方程</button>
    <button type="button" role="tab" aria-selected="false" data-view="designer">4 · 数字滤波器</button>
  </div>
  <div class="zt-panel" data-panel="mode" role="tabpanel">
    <div class="zt-controls">
      <label>半径 r <output data-out="mr"></output><input data-key="mr" type="range" min="0.5" max="1.2" step="0.01" value="0.9"></label>
      <label>角度 ω <output data-out="mw"></output><input data-key="mw" type="range" min="0" max="3.14" step="0.02" value="0.8"></label>
      <label>样本数 N <output data-out="mn"></output><input data-key="mn" type="range" min="8" max="40" step="1" value="24"></label>
    </div>
    <canvas data-canvas="mode" width="960" height="410" aria-label="离散复指数序列和复平面轨迹"></canvas>
    <div class="zt-readout" data-readout="mode" aria-live="polite"></div>
  </div>
  <div class="zt-panel" data-panel="roc" role="tabpanel" hidden>
    <div class="zt-controls zt-controls-4">
      <label>序列方向<select data-key="rside"><option value="right">右边序列 n ≥ 0</option><option value="left">左边序列 n ≤ −1</option></select></label>
      <label>极点 a <output data-out="ra"></output><input data-key="ra" type="range" min="0.2" max="1.4" step="0.05" value="0.7"></label>
      <label>探针半径 ρ <output data-out="rr"></output><input data-key="rr" type="range" min="0.05" max="1.8" step="0.05" value="1"></label>
      <label>探针角度 θ <output data-out="rw"></output><input data-key="rw" type="range" min="-3.14" max="3.14" step="0.05" value="0.8"></label>
    </div>
    <canvas data-canvas="roc" width="960" height="420" aria-label="Z 平面上的极点、单位圆与收敛域"></canvas>
    <div class="zt-readout" data-readout="roc" aria-live="polite"></div>
  </div>
  <div class="zt-panel" data-panel="difference" role="tabpanel" hidden>
    <div class="zt-controls">
      <label>输入<select data-key="dinput"><option value="impulse">单位脉冲</option><option value="step">单位阶跃</option><option value="sine">正弦</option></select></label>
      <label>反馈系数 a <output data-out="da"></output><input data-key="da" type="range" min="-1.15" max="1.15" step="0.05" value="0.75"></label>
      <label>正弦角频率 ω <output data-out="dw"></output><input data-key="dw" type="range" min="0.05" max="3.1" step="0.05" value="0.7"></label>
    </div>
    <canvas data-canvas="difference" width="960" height="410" aria-label="一阶差分方程的时域响应"></canvas>
    <div class="zt-readout" data-readout="difference" aria-live="polite"></div>
  </div>
  <div class="zt-panel" data-panel="designer" role="tabpanel" hidden>
    <div class="zt-controls zt-controls-4">
      <label>极点半径 rₚ <output data-out="pr"></output><input data-key="pr" type="range" min="0.1" max="1.1" step="0.02" value="0.82"></label>
      <label>极点角度 θₚ <output data-out="pa"></output><input data-key="pa" type="range" min="0" max="3.14" step="0.02" value="0.8"></label>
      <label>零点半径 r𝓏 <output data-out="zr"></output><input data-key="zr" type="range" min="0" max="1.4" step="0.02" value="1"></label>
      <label>零点角度 θ𝓏 <output data-out="za"></output><input data-key="za" type="range" min="0" max="3.14" step="0.02" value="2.2"></label>
    </div>
    <canvas data-canvas="designer" width="960" height="480" aria-label="数字滤波器极点零点、频率响应和脉冲响应"></canvas>
    <div class="zt-readout" data-readout="designer" aria-live="polite"></div>
  </div>
</section>

<style>
  .zt-lab{--b:#08111e;--c:#102238;--l:#29415c;--t:#edf5ff;--m:#a2b3c8;--a:#49e1c7;--bl:#57c7ff;--y:#ffbd59;--p:#ff7396;margin:2rem 0 2.8rem;padding:1rem;border:1px solid rgba(73,225,199,.34);border-radius:22px;background:radial-gradient(circle at 78% -8%,rgba(73,225,199,.15),transparent 36%),var(--b);color:var(--t);box-shadow:0 20px 70px rgba(0,0,0,.22)}.zt-lab *{box-sizing:border-box}.zt-head{display:flex;justify-content:space-between;gap:1rem;padding:.4rem .35rem 1rem}.zt-head span{font:700 .7rem ui-monospace,monospace;letter-spacing:.16em;color:var(--a)}.zt-head h2{margin:.12rem 0 .25rem;color:var(--t);font-size:clamp(1.35rem,3vw,2rem)}.zt-head p{margin:0;color:var(--m)}.zt-head button,.zt-tabs button{border:1px solid var(--l);border-radius:11px;background:var(--c);color:var(--t);padding:.65rem .5rem;cursor:pointer;font-weight:700;min-height:44px}.zt-tabs{display:grid;grid-template-columns:repeat(4,1fr);gap:.45rem;margin-bottom:.8rem}.zt-tabs button[aria-selected=true]{border-color:var(--a);background:rgba(73,225,199,.13);color:#c7fff5}.zt-panel{padding:1rem;border:1px solid var(--l);border-radius:16px;background:linear-gradient(160deg,rgba(17,34,55,.97),rgba(7,15,27,.98))}.zt-controls{display:grid;grid-template-columns:repeat(3,1fr);gap:.8rem;margin-bottom:1rem}.zt-controls-4{grid-template-columns:repeat(4,1fr)}.zt-controls label{display:flex;flex-direction:column;gap:.35rem;color:var(--m);font-size:.82rem;font-weight:700}.zt-controls output{color:var(--t)}.zt-controls input{width:100%;accent-color:var(--a)}.zt-controls select{border:1px solid var(--l);border-radius:9px;background:#081522;color:var(--t);padding:.55rem}.zt-lab canvas{display:block;width:100%;height:auto;min-height:235px;border:1px solid rgba(92,146,183,.25);border-radius:13px;background:#07101b}.zt-readout{margin-top:.8rem;padding:.82rem 1rem;border-left:3px solid var(--a);border-radius:8px;background:rgba(73,225,199,.07);font-variant-numeric:tabular-nums}.zt-readout b{color:#bffff4}.zt-readout .bad{color:#ffb5c6}@media(max-width:760px){.zt-tabs{grid-template-columns:repeat(2,1fr)}.zt-controls,.zt-controls-4{grid-template-columns:repeat(2,1fr)}}@media(max-width:480px){.zt-lab{padding:.65rem}.zt-head{display:block}.zt-head button{margin-top:.7rem}.zt-panel{padding:.7rem}.zt-lab canvas{min-height:220px}}
</style>

<script>
(() => {
  const root=document.getElementById('zt-lab');if(!root||root.dataset.ready)return;root.dataset.ready='1';const q=s=>root.querySelector(s),qa=s=>Array.from(root.querySelectorAll(s)),val=k=>{const e=q('[data-key="'+k+'"]');return e.type==='range'?Number(e.value):e.value;},out=(k,v)=>{const e=q('[data-out="'+k+'"]');if(e)e.textContent=v;},fmt=(n,d=2)=>Number.isFinite(n)?n.toFixed(d):'∞';
  const prep=n=>{const c=q('[data-canvas="'+n+'"]'),x=c.getContext('2d');x.clearRect(0,0,c.width,c.height);x.lineCap='round';x.lineJoin='round';return {x,w:c.width,h:c.height};},text=(x,s,a,b,col='#a2b3c8',z=18,al='left')=>{x.fillStyle=col;x.font=z+'px system-ui';x.textAlign=al;x.fillText(s,a,b);},grid=(x,a,b,c,d,xt=5,yt=4)=>{x.strokeStyle='rgba(120,154,184,.18)';x.lineWidth=1;for(let i=0;i<=xt;i++){let p=a+(c-a)*i/xt;x.beginPath();x.moveTo(p,b);x.lineTo(p,d);x.stroke();}for(let i=0;i<=yt;i++){let p=b+(d-b)*i/yt;x.beginPath();x.moveTo(a,p);x.lineTo(c,p);x.stroke();}x.strokeStyle='#45617b';x.strokeRect(a,b,c-a,d-b);};
  const stem=(x,arr,a,b,c,d,v0,v1,col='#57c7ff')=>{const zero=d-(0-v0)/(v1-v0)*(d-b);for(let n=0;n<arr.length;n++){let px=a+(c-a)*n/Math.max(1,arr.length-1),py=d-(arr[n]-v0)/(v1-v0)*(d-b);x.strokeStyle=col;x.lineWidth=3;x.beginPath();x.moveTo(px,zero);x.lineTo(px,py);x.stroke();x.fillStyle=col;x.beginPath();x.arc(px,py,5,0,Math.PI*2);x.fill();}};
  const cdiv=(a,b)=>{let d=b.re*b.re+b.im*b.im;return {re:(a.re*b.re+a.im*b.im)/d,im:(a.im*b.re-a.re*b.im)/d};};
  let current='mode';
  function drawMode(){const r=val('mr'),w=val('mw'),N=val('mn'),o=prep('mode'),x=o.x;out('mr',fmt(r,2));out('mw',fmt(w,2)+' rad');out('mn',N);const arr=Array.from({length:N},(_,n)=>Math.pow(r,n)*Math.cos(w*n)),m=Math.max(1,...arr.map(Math.abs)),L=45,R=475,T=48,B=360;grid(x,L,T,R,B,6,4);stem(x,arr,L,T,R,B,-m*1.15,m*1.15);text(x,'Re{zⁿ} 离散序列',L,28,'#edf5ff',21);const cx=720,cy=205,rad=150,scale=rad/(Math.max(1,Math.pow(r,N-1))*1.08);x.strokeStyle='#45617b';x.lineWidth=2;x.beginPath();x.arc(cx,cy,rad,0,Math.PI*2);x.stroke();x.beginPath();x.moveTo(cx-rad,cy);x.lineTo(cx+rad,cy);x.moveTo(cx,cy-rad);x.lineTo(cx,cy+rad);x.stroke();for(let n=0;n<N;n++){let rr=Math.pow(r,n),px=cx+scale*rr*Math.cos(w*n),py=cy-scale*rr*Math.sin(w*n);x.fillStyle=n===N-1?'#ffbd59':'#49e1c7';x.beginPath();x.arc(px,py,n===N-1?7:4,0,Math.PI*2);x.fill();}text(x,'zⁿ 在复平面中的离散轨迹',cx,28,'#edf5ff',20,'center');q('[data-readout=mode]').innerHTML='z=<b>'+fmt(r,2)+'e<sup>j'+fmt(w,2)+'</sup></b>。'+(r<1?'半径小于 1，模式随 n 衰减。':r>1?'半径大于 1，模式随 n 增长。':'位于单位圆上，模式保持幅度、只旋转。');}
  function drawRoc(){const side=val('rside'),a=val('ra'),rho=val('rr'),ang=val('rw'),o=prep('roc'),x=o.x;out('ra',fmt(a,2));out('rr',fmt(rho,2));out('rw',fmt(ang,2)+' rad');const cx=480,cy=205,sc=150,L=250; x.strokeStyle='#45617b';x.lineWidth=2;x.beginPath();x.arc(cx,cy,sc,0,Math.PI*2);x.stroke();x.beginPath();x.moveTo(cx-L,cy);x.lineTo(cx+L,cy);x.moveTo(cx,cy-L);x.lineTo(cx,cy+L);x.stroke();const pr=a*sc; if(side==='right'){x.fillStyle='rgba(73,225,199,.12)';x.beginPath();x.arc(cx,cy,L,0,Math.PI*2);x.arc(cx,cy,pr,0,Math.PI*2,true);x.fill('evenodd');}else{x.fillStyle='rgba(73,225,199,.12)';x.beginPath();x.arc(cx,cy,pr,0,Math.PI*2);x.fill();}x.strokeStyle='#ffbd59';x.lineWidth=3;x.beginPath();x.arc(cx,cy,pr,0,Math.PI*2);x.stroke();x.strokeStyle='#ff7396';x.lineWidth=5;x.beginPath();x.moveTo(cx+pr-8,cy-8);x.lineTo(cx+pr+8,cy+8);x.moveTo(cx+pr+8,cy-8);x.lineTo(cx+pr-8,cy+8);x.stroke();let px=cx+rho*sc*Math.cos(ang),py=cy-rho*sc*Math.sin(ang);x.strokeStyle='#edf5ff';x.lineWidth=3;x.beginPath();x.arc(px,py,8,0,Math.PI*2);x.stroke();text(x,'单位圆',cx,cy-sc-14,'#a2b3c8',17,'center');text(x,'绿色区域：ROC',cx,30,'#edf5ff',21,'center');let z={re:rho*Math.cos(ang),im:rho*Math.sin(ang)},X=cdiv(z,{re:z.re-a,im:z.im}),ok=side==='right'?rho>a:rho<a;q('[data-readout=roc]').innerHTML='两种序列的代数式都是 <b>X(z)=z/(z−a)</b>，极点在 z=a。当前 X(z)=<b>'+fmt(X.re,3)+(X.im>=0?'+':'')+fmt(X.im,3)+'j</b>。'+(ok?'探针位于收敛域。':'<span class="bad">探针不在收敛域；该代数值不代表原级数收敛。</span>');}
  function drawDifference(){const input=val('dinput'),a=val('da'),w=val('dw'),o=prep('difference'),x=o.x,N=36;out('da',fmt(a,2));out('dw',fmt(w,2)+' rad/sample');let xs=[],ys=[],yp=0;for(let n=0;n<N;n++){let u=input==='impulse'?(n===0?1:0):input==='step'?1:Math.sin(w*n),y=u+a*yp;xs.push(u);ys.push(y);yp=y;}let m=Math.max(1,...ys.map(Math.abs)),L=45,R=925,T=48,B=350;grid(x,L,T,R,B,9,4);stem(x,xs,L,T,R,B,-m*1.1,m*1.1,'rgba(255,189,89,.65)');stem(x,ys,L,T,R,B,-m*1.1,m*1.1,'#57c7ff');text(x,'输入 x[n]',L,28,'#ffbd59',18);text(x,'输出 y[n]',L+95,28,'#57c7ff',18);q('[data-readout=difference]').innerHTML='差分方程 <b>y[n]=x[n]+a y[n−1]</b> 对应 H(z)=1/(1−az⁻¹)，极点在 z=a。'+(Math.abs(a)<1?'极点位于单位圆内，因果系统的自然响应衰减。':'<span class="bad">极点位于或越过单位圆，因果系统不再 BIBO 稳定。</span>');}
  function freqMag(w,rp,ap,rz,az){let z1={re:Math.cos(w),im:-Math.sin(w)},z2={re:Math.cos(2*w),im:-Math.sin(2*w)},num={re:1-2*rz*Math.cos(az)*z1.re+rz*rz*z2.re,im:-2*rz*Math.cos(az)*z1.im+rz*rz*z2.im},den={re:1-2*rp*Math.cos(ap)*z1.re+rp*rp*z2.re,im:-2*rp*Math.cos(ap)*z1.im+rp*rp*z2.im};return Math.hypot(num.re,num.im)/Math.hypot(den.re,den.im);}
  function drawDesigner(){const rp=val('pr'),ap=val('pa'),rz=val('zr'),az=val('za'),o=prep('designer'),x=o.x;out('pr',fmt(rp,2));out('pa',fmt(ap,2));out('zr',fmt(rz,2));out('za',fmt(az,2));const cx=180,cy=235,sc=125;x.strokeStyle='#45617b';x.lineWidth=2;x.beginPath();x.arc(cx,cy,sc,0,Math.PI*2);x.stroke();x.beginPath();x.moveTo(cx-sc-20,cy);x.lineTo(cx+sc+20,cy);x.moveTo(cx,cy-sc-20);x.lineTo(cx,cy+sc+20);x.stroke();for(const s of [-1,1]){let px=cx+rp*sc*Math.cos(ap),py=cy+s*rp*sc*Math.sin(ap);x.strokeStyle='#ff7396';x.lineWidth=5;x.beginPath();x.moveTo(px-8,py-8);x.lineTo(px+8,py+8);x.moveTo(px+8,py-8);x.lineTo(px-8,py+8);x.stroke();let zx=cx+rz*sc*Math.cos(az),zy=cy+s*rz*sc*Math.sin(az);x.strokeStyle='#49e1c7';x.lineWidth=4;x.beginPath();x.arc(zx,zy,8,0,Math.PI*2);x.stroke();}text(x,'Z 平面',45,28,'#edf5ff',21);const A=375,C=925;grid(x,A,45,C,220,5,4);let mm=.1;for(let i=0;i<250;i++)mm=Math.max(mm,Math.min(15,freqMag(Math.PI*i/249,rp,ap,rz,az)));x.strokeStyle='#ffbd59';x.lineWidth=4;x.beginPath();for(let i=0;i<250;i++){let w=Math.PI*i/249,m=Math.min(15,freqMag(w,rp,ap,rz,az)),px=A+(C-A)*i/249,py=220-(m/(mm*1.05))*(220-45);i?x.lineTo(px,py):x.moveTo(px,py);}x.stroke();text(x,'单位圆上的频率响应',A,28,'#edf5ff',20);let N=32,y=[],ym1=0,ym2=0;for(let n=0;n<N;n++){let xn=n===0?1:0,x1=n===1?1:0,x2=n===2?1:0,v=xn-2*rz*Math.cos(az)*x1+rz*rz*x2+2*rp*Math.cos(ap)*ym1-rp*rp*ym2;y.push(v);ym2=ym1;ym1=v;}let m=Math.max(1,...y.map(Math.abs));grid(x,A,290,C,445,7,3);stem(x,y,A,290,C,445,-m*1.1,m*1.1,'#57c7ff');text(x,'脉冲响应',A,272,'#edf5ff',20);q('[data-readout=designer]').innerHTML='叉号为极点、圆圈为零点。'+(rp<1?'极点在单位圆内，因果 IIR 滤波器稳定。':'<span class="bad">极点越过单位圆，脉冲响应会增长。</span>')+' 把零点放在单位圆某个角度附近，可压低对应数字频率。';}
  function draw(){if(current==='mode')drawMode();if(current==='roc')drawRoc();if(current==='difference')drawDifference();if(current==='designer')drawDesigner();}function show(n){current=n;qa('[data-view]').forEach(b=>b.setAttribute('aria-selected',String(b.dataset.view===n)));qa('[data-panel]').forEach(p=>p.hidden=p.dataset.panel!==n);draw();}const defs={};qa('input,select').forEach(e=>defs[e.dataset.key]=e.value);qa('[data-view]').forEach(b=>b.addEventListener('click',()=>show(b.dataset.view)));qa('input,select').forEach(e=>e.addEventListener('input',draw));q('[data-action=reset]').addEventListener('click',()=>{qa('input,select').forEach(e=>e.value=defs[e.dataset.key]);show(current);});show('mode');
})();
</script>

## 第一章：离散系统的自然模式是 \(z^n\)

连续复指数在相邻采样时刻的比值固定；离散后可直接写成

$$
x[n]=z^n=r^n e^{j\omega n}.
$$

若一个 LTI 差分系统输入 $z^n$，稳态输出仍是同一个 $z^n$，只乘上一个复数。这正是它成为离散系统“特征向量”的原因。

## 第二章：Z 变换把半径也纳入扫描

双边 Z 变换定义为

$$
X(z)=\sum_{n=-\infty}^{\infty}x[n]z^{-n}.
$$

在单位圆 $z=e^{j\omega}$ 上，它退化为离散时间 Fourier 变换。离开单位圆后，半径提供指数加权，使某些原本发散的序列在特定环形区域内收敛。

和 Laplace 变换一样，代数式必须和 ROC 一起给出。右边序列的 ROC 通常在最外极点之外；左边序列通常在最内极点之内；双边序列可能形成两个极点之间的圆环。

## 第三章：差分方程变成 \(z\) 的代数式

对零初值差分方程

$$
y[n]=x[n]+a y[n-1],
$$

Z 变换给出

$$
Y(z)=X(z)+az^{-1}Y(z),
$$

因此

$$
H(z)=\frac{1}{1-az^{-1}}.
$$

因果系统的极点必须位于单位圆内，脉冲响应才绝对可和。单位圆在 Z 平面中扮演了连续系统虚轴的角色。

## 第四章：在单位圆上读取数字滤波器

数字滤波器的频率响应是

$$
H(e^{j\omega}).
$$

沿单位圆移动探针，靠近极点时幅度上升，靠近零点时幅度下降。共轭极点零点对保证实系数滤波器对实输入产生实输出。

通过映射

$$
z=e^{sT},
$$

连续系统左半平面映到单位圆内部，虚轴映到单位圆，右半平面映到单位圆外部。这解释了连续和离散稳定区域之间的对应。

### 需要区分的三个对象

- DFT：有限长度向量的 $N$ 个频率坐标；
- DTFT：离散序列在整个单位圆上的连续频率函数；
- Z 变换：把单位圆扩展为复平面，并附带收敛域。

---

### 延伸阅读

- [本系列：DFT 如何看见频率？](/posts/dft-interactive-guide/)
- [本系列：极点和零点如何塑造系统？](/posts/poles-zeros-interactive-guide/)
- [本系列：拉普拉斯变换到底在做什么？](/posts/laplace-transform-interactive-guide/)

> 本文使用归一化数字频率；若采样率为 $f_s$，数字角频率与模拟频率满足 $\omega=2\pi f/f_s$。
