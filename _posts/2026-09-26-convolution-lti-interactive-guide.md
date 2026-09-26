---
layout: post
title: "卷积到底在算什么？从滑动重叠到 LTI 系统"
date: 2026-09-26 11:00:00 +0800
categories: [数学与工程]
tags: [卷积, LTI系统, 脉冲响应, 滤波器, 信号与系统]
description: "用四个交互实验理解翻转平移、滑动重叠、脉冲分解、滤波和卷积定理。"
math: true
toc: true
---

卷积公式看起来像一场符号体操：

$$
y(t)=(x*h)(t)=\int_{-\infty}^{\infty}x(\tau)h(t-\tau)\,d\tau.
$$

但它真正描述的是一件很具体的事：**输入在每个过去时刻都激发了一份系统响应，当前输出是这些响应的叠加。**

<section id="cv-lab" class="cv-lab" aria-label="卷积与 LTI 交互实验室">
  <div class="cv-head"><div><span>INTERACTIVE LAB</span><h2>卷积与 LTI 交互实验室</h2><p>滑动、分解、滤波，再到频域乘法。</p></div><button type="button" data-action="reset">恢复默认</button></div>
  <div class="cv-tabs" role="tablist" aria-label="实验选择">
    <button type="button" role="tab" aria-selected="true" data-view="overlap">1 · 滑动重叠</button>
    <button type="button" role="tab" aria-selected="false" data-view="impulses">2 · 脉冲分解</button>
    <button type="button" role="tab" aria-selected="false" data-view="filter">3 · 滤波器</button>
    <button type="button" role="tab" aria-selected="false" data-view="theorem">4 · 卷积定理</button>
  </div>
  <div class="cv-panel" data-panel="overlap" role="tabpanel">
    <div class="cv-controls">
      <label>输入 x(τ)<select data-key="ox"><option value="rect">矩形</option><option value="tri">三角</option><option value="exp">因果指数</option></select></label>
      <label>响应 h(t)<select data-key="oh"><option value="rect">矩形</option><option value="tri">三角</option><option value="exp">因果指数</option></select></label>
      <label>输出时刻 t <output data-out="ot"></output><input data-key="ot" type="range" min="-4" max="6" step="0.05" value="1"></label>
    </div>
    <canvas data-canvas="overlap" width="960" height="440" aria-label="卷积的滑动重叠与乘积面积"></canvas>
    <div class="cv-readout" data-readout="overlap" aria-live="polite"></div>
  </div>
  <div class="cv-panel" data-panel="impulses" role="tabpanel" hidden>
    <div class="cv-controls cv-controls-4">
      <label>x[0] <output data-out="i0"></output><input data-key="i0" type="range" min="-1" max="1.5" step="0.1" value="1"></label>
      <label>x[1] <output data-out="i1"></output><input data-key="i1" type="range" min="-1" max="1.5" step="0.1" value="0.7"></label>
      <label>x[2] <output data-out="i2"></output><input data-key="i2" type="range" min="-1" max="1.5" step="0.1" value="-0.4"></label>
      <label>衰减系数 α <output data-out="ia"></output><input data-key="ia" type="range" min="0.1" max="0.9" step="0.05" value="0.65"></label>
    </div>
    <canvas data-canvas="impulses" width="960" height="420" aria-label="离散脉冲激发响应并叠加"></canvas>
    <div class="cv-readout" data-readout="impulses" aria-live="polite"></div>
  </div>
  <div class="cv-panel" data-panel="filter" role="tabpanel" hidden>
    <div class="cv-controls">
      <label>输入信号<select data-key="fsig"><option value="noisy">带高频噪声的慢波</option><option value="step">阶跃</option><option value="spike">尖峰</option></select></label>
      <label>滤波核<select data-key="fker"><option value="average">移动平均</option><option value="exp">指数平滑</option><option value="edge">差分/边缘</option></select></label>
      <label>核宽度 <output data-out="fw"></output><input data-key="fw" type="range" min="3" max="21" step="2" value="9"></label>
    </div>
    <canvas data-canvas="filter" width="960" height="410" aria-label="信号与不同卷积核的滤波结果"></canvas>
    <div class="cv-readout" data-readout="filter" aria-live="polite"></div>
  </div>
  <div class="cv-panel" data-panel="theorem" role="tabpanel" hidden>
    <div class="cv-controls">
      <label>输入频率 f₀ <output data-out="tf"></output><input data-key="tf" type="range" min="0.5" max="8" step="0.1" value="3"></label>
      <label>低通时间常数 τ <output data-out="ttau"></output><input data-key="ttau" type="range" min="0.05" max="1" step="0.05" value="0.25"></label>
      <label>噪声比例 <output data-out="tn"></output><input data-key="tn" type="range" min="0" max="1" step="0.05" value="0.45"></label>
    </div>
    <canvas data-canvas="theorem" width="960" height="440" aria-label="时间域卷积与频域乘法的对应"></canvas>
    <div class="cv-readout" data-readout="theorem" aria-live="polite"></div>
  </div>
</section>

<style>
  .cv-lab{--b:#08111e;--c:#102238;--l:#29415c;--t:#edf5ff;--m:#a2b3c8;--a:#49e1c7;--bl:#57c7ff;--y:#ffbd59;--p:#ff7396;margin:2rem 0 2.8rem;padding:1rem;border:1px solid rgba(87,199,255,.32);border-radius:22px;background:radial-gradient(circle at 78% -8%,rgba(73,225,199,.14),transparent 36%),var(--b);color:var(--t);box-shadow:0 20px 70px rgba(0,0,0,.22)}.cv-lab *{box-sizing:border-box}.cv-head{display:flex;justify-content:space-between;gap:1rem;padding:.4rem .35rem 1rem}.cv-head span{font:700 .7rem ui-monospace,monospace;letter-spacing:.16em;color:var(--a)}.cv-head h2{margin:.12rem 0 .25rem;color:var(--t);font-size:clamp(1.35rem,3vw,2rem)}.cv-head p{margin:0;color:var(--m)}.cv-head button,.cv-tabs button{border:1px solid var(--l);border-radius:11px;background:var(--c);color:var(--t);padding:.65rem .5rem;cursor:pointer;font-weight:700;min-height:44px}.cv-tabs{display:grid;grid-template-columns:repeat(4,1fr);gap:.45rem;margin-bottom:.8rem}.cv-tabs button[aria-selected=true]{border-color:var(--a);background:rgba(73,225,199,.13);color:#c7fff5}.cv-panel{padding:1rem;border:1px solid var(--l);border-radius:16px;background:linear-gradient(160deg,rgba(17,34,55,.97),rgba(7,15,27,.98))}.cv-controls{display:grid;grid-template-columns:repeat(3,1fr);gap:.8rem;margin-bottom:1rem}.cv-controls-4{grid-template-columns:repeat(4,1fr)}.cv-controls label{display:flex;flex-direction:column;gap:.35rem;color:var(--m);font-size:.82rem;font-weight:700}.cv-controls output{color:var(--t)}.cv-controls input{width:100%;accent-color:var(--a)}.cv-controls select{border:1px solid var(--l);border-radius:9px;background:#081522;color:var(--t);padding:.55rem}.cv-lab canvas{display:block;width:100%;height:auto;min-height:235px;border:1px solid rgba(92,146,183,.25);border-radius:13px;background:#07101b}.cv-readout{margin-top:.8rem;padding:.82rem 1rem;border-left:3px solid var(--a);border-radius:8px;background:rgba(73,225,199,.07);font-variant-numeric:tabular-nums}.cv-readout b{color:#bffff4}@media(max-width:760px){.cv-tabs{grid-template-columns:repeat(2,1fr)}.cv-controls,.cv-controls-4{grid-template-columns:repeat(2,1fr)}}@media(max-width:480px){.cv-lab{padding:.65rem}.cv-head{display:block}.cv-head button{margin-top:.7rem}.cv-panel{padding:.7rem}.cv-lab canvas{min-height:220px}}
</style>

<script>
(() => {
  const root=document.getElementById('cv-lab');if(!root||root.dataset.ready)return;root.dataset.ready='1';const q=s=>root.querySelector(s),qa=s=>Array.from(root.querySelectorAll(s)),val=k=>{const e=q('[data-key="'+k+'"]');return e.type==='range'?Number(e.value):e.value;},out=(k,v)=>{const e=q('[data-out="'+k+'"]');if(e)e.textContent=v;},fmt=(n,d=2)=>Number.isFinite(n)?n.toFixed(d):'∞';
  const prep=n=>{const c=q('[data-canvas="'+n+'"]'),x=c.getContext('2d');x.clearRect(0,0,c.width,c.height);x.lineCap='round';x.lineJoin='round';return {x,w:c.width,h:c.height};},text=(x,s,a,b,col='#a2b3c8',z=18,al='left')=>{x.fillStyle=col;x.font=z+'px system-ui';x.textAlign=al;x.fillText(s,a,b);},grid=(x,a,b,c,d,xt=6,yt=4)=>{x.strokeStyle='rgba(120,154,184,.18)';x.lineWidth=1;for(let i=0;i<=xt;i++){let p=a+(c-a)*i/xt;x.beginPath();x.moveTo(p,b);x.lineTo(p,d);x.stroke();}for(let i=0;i<=yt;i++){let p=b+(d-b)*i/yt;x.beginPath();x.moveTo(a,p);x.lineTo(c,p);x.stroke();}x.strokeStyle='#45617b';x.strokeRect(a,b,c-a,d-b);},line=(x,fn,a,b,c,d,t0,t1,v0,v1,col,lw=4,n=400)=>{x.strokeStyle=col;x.lineWidth=lw;x.beginPath();for(let i=0;i<=n;i++){let t=t0+(t1-t0)*i/n,v=Math.max(v0,Math.min(v1,fn(t))),px=a+(c-a)*i/n,py=d-(v-v0)/(v1-v0)*(d-b);i?x.lineTo(px,py):x.moveTo(px,py);}x.stroke();};
  const shape=(kind,t)=>kind==='rect'?(Math.abs(t)<=1?1:0):kind==='tri'?Math.max(0,1-Math.abs(t)):t>=0?Math.exp(-t):0;
  let current='overlap';
  function drawOverlap(){const kx=val('ox'),kh=val('oh'),t=val('ot'),o=prep('overlap'),x=o.x,L=55,R=925;out('ot',fmt(t,2)+' s');grid(x,L,45,R,205,10,3);grid(x,L,260,R,400,10,3);const lo=-5,hi=7,prod=u=>shape(kx,u)*shape(kh,t-u);line(x,u=>shape(kx,u),L,45,R,205,lo,hi,-.1,1.25,'#57c7ff',4);line(x,u=>shape(kh,t-u),L,45,R,205,lo,hi,-.1,1.25,'#ffbd59',4);line(x,prod,L,260,R,400,lo,hi,-.1,1.25,'#49e1c7',5);let area=0,N=1200,du=(hi-lo)/N;for(let i=0;i<N;i++){let u=lo+(i+.5)*du;area+=prod(u)*du;}text(x,'x(τ)',L,28,'#57c7ff',19);text(x,'h(t−τ)：先翻转，再移动',L+90,28,'#ffbd59',19);text(x,'乘积：曲线下面积就是 y(t)',L,246,'#edf5ff',20);q('[data-readout=overlap]').innerHTML='在 t=<b>'+fmt(t,2)+'</b> 时，两函数乘积的面积约为 <b>y(t)='+fmt(area,4)+'</b>。拖动 t，输出曲线的每一个点就是一次新的重叠面积。';}
  function drawImpulses(){const xs=[val('i0'),val('i1'),val('i2')],a=val('ia'),o=prep('impulses'),x=o.x,L=55,R=925,T=45,B=360;xs.forEach((v,i)=>out('i'+i,fmt(v,1)));out('ia',fmt(a,2));grid(x,L,T,R,B,10,4);const colors=['#57c7ff','#ffbd59','#ff7396'];xs.forEach((v,k)=>line(x,n=>n>=k?v*Math.pow(a,n-k):0,L,T,R,B,0,10,-1.2,2.5,colors[k],2,220));line(x,n=>xs.reduce((s,v,k)=>s+(n>=k?v*Math.pow(a,n-k):0),0),L,T,R,B,0,10,-1.2,2.5,'#49e1c7',5,220);for(let k=0;k<3;k++){let px=L+(R-L)*k/10,py=B-(xs[k]+1.2)/3.7*(B-T);x.strokeStyle=colors[k];x.lineWidth=4;x.beginPath();x.moveTo(px,B-(0+1.2)/3.7*(B-T));x.lineTo(px,py);x.stroke();x.fillStyle=colors[k];x.beginPath();x.arc(px,py,6,0,Math.PI*2);x.fill();}text(x,'每个样本激发一份移位、缩放的 h[n]；青色为总和',L,27,'#edf5ff',20);q('[data-readout=impulses]').innerHTML='h[n]=αⁿu[n]，因此 <b>y[n]=Σ x[k]h[n−k]</b>。线性保证“先分别响应再相加”和“对总输入一次响应”完全相同；时不变保证每份响应只需平移。';}
  function conv(arr,ker){let y=new Array(arr.length).fill(0),m=Math.floor(ker.length/2);for(let n=0;n<arr.length;n++)for(let k=0;k<ker.length;k++){let i=n+k-m;if(i>=0&&i<arr.length)y[n]+=arr[i]*ker[k];}return y;}
  function drawFilter(){const sig=val('fsig'),kind=val('fker'),W=val('fw'),o=prep('filter'),x=o.x,N=240;out('fw',W+' 点');let a=[];for(let n=0;n<N;n++){let t=n/N*6;a.push(sig==='noisy'?Math.sin(2*Math.PI*.7*t)+.38*Math.sin(2*Math.PI*7*t):sig==='step'?(n>N*.42?1:0):(Math.abs(n-N*.48)<2?1:0));}let k=[];if(kind==='average')k=new Array(W).fill(1/W);else if(kind==='exp'){for(let i=0;i<W;i++)k.push(Math.exp(-i/(W/3)));let s=k.reduce((p,v)=>p+v,0);k=k.map(v=>v/s).reverse();}else{k=[-1,0,1];}let y=conv(a,k),L=55,R=925,T=48,B=350;grid(x,L,T,R,B,8,4);const at=u=>a[Math.max(0,Math.min(N-1,Math.round(u)))],yt=u=>y[Math.max(0,Math.min(N-1,Math.round(u)))];line(x,at,L,T,R,B,0,N-1,-1.7,1.7,'rgba(87,199,255,.55)',3,N);line(x,yt,L,T,R,B,0,N-1,-1.7,1.7,'#49e1c7',5,N);text(x,'原信号',L,28,'#57c7ff',19);text(x,'卷积输出',L+92,28,'#49e1c7',19);q('[data-readout=filter]').innerHTML=(kind==='average'?'移动平均保留缓慢变化并削弱快速摆动。':kind==='exp'?'指数核让最近样本权重更高，是常见的因果平滑模型。':'差分核对平坦区域输出接近零，在变化处产生响应。')+' 核的形状就是系统对单个脉冲的回答。';}
  function dftMag(a,k){let re=0,im=0,N=a.length;for(let n=0;n<N;n++){let ph=-2*Math.PI*k*n/N;re+=a[n]*Math.cos(ph);im+=a[n]*Math.sin(ph);}return Math.hypot(re,im)/N;}
  function drawTheorem(){const f0=val('tf'),tau=val('ttau'),noise=val('tn'),o=prep('theorem'),x=o.x,N=192,dt=1/32;out('tf',fmt(f0,1)+' Hz');out('ttau',fmt(tau,2)+' s');out('tn',fmt(noise,2));let a=[],h=[];for(let n=0;n<N;n++){let t=n*dt;a.push(Math.sin(2*Math.PI*f0*t)+noise*Math.sin(2*Math.PI*11*t));h.push(n*dt<4*tau?Math.exp(-n*dt/tau)*dt/tau:0);}let y=new Array(N).fill(0);for(let n=0;n<N;n++)for(let k=0;k<=n;k++)y[n]+=a[k]*h[n-k];const L=55,R=455,A=535,C=925;grid(x,L,45,R,385,6,4);grid(x,A,45,C,385,6,4);const av=u=>a[Math.min(N-1,Math.round(u))],yv=u=>y[Math.min(N-1,Math.round(u))];line(x,av,L,45,R,385,0,N-1,-1.8,1.8,'rgba(87,199,255,.5)',3,N);line(x,yv,L,45,R,385,0,N-1,-1.8,1.8,'#49e1c7',4,N);let max=.01,mags=[];for(let k=0;k<N/2;k++){let m=dftMag(a,k)*dftMag(h,k);mags.push(m);max=Math.max(max,m);}line(x,u=>mags[Math.min(mags.length-1,Math.round(u))],A,45,C,385,0,mags.length-1,0,max*1.08,'#ffbd59',4,mags.length);text(x,'时间域：x*h',L,28,'#edf5ff',21);text(x,'频域：X·H',A,28,'#edf5ff',21);q('[data-readout=theorem]').innerHTML='同一个输出可以通过 <b>时间域卷积</b> 或 <b>频域相乘</b> 得到。低通 H(f) 在 11 Hz 处更小，因此高频噪声在乘法后被压低。';}
  function draw(){if(current==='overlap')drawOverlap();if(current==='impulses')drawImpulses();if(current==='filter')drawFilter();if(current==='theorem')drawTheorem();}function show(n){current=n;qa('[data-view]').forEach(b=>b.setAttribute('aria-selected',String(b.dataset.view===n)));qa('[data-panel]').forEach(p=>p.hidden=p.dataset.panel!==n);draw();}const defs={};qa('input,select').forEach(e=>defs[e.dataset.key]=e.value);qa('[data-view]').forEach(b=>b.addEventListener('click',()=>show(b.dataset.view)));qa('input,select').forEach(e=>e.addEventListener('input',draw));q('[data-action=reset]').addEventListener('click',()=>{qa('input,select').forEach(e=>e.value=defs[e.dataset.key]);show(current);});show('overlap');
})();
</script>

## 第一章：翻转、平移、相乘、积分

固定一个输出时刻 $t$，卷积中的 $h(t-\tau)$ 可以分两步得到：

1. 把 $h(\tau)$ 沿时间轴翻转成 $h(-\tau)$；
2. 再向右平移 $t$，得到 $h(t-\tau)$。

它和 $x(\tau)$ 相乘后，曲线下面积就是当前的 $y(t)$。让 $t$ 连续移动，所有面积排成一条新曲线，这就是卷积输出。

## 第二章：为什么 LTI 系统一定产生卷积

离散信号可写成移位脉冲的和：

$$
x[n]=\sum_k x[k]\delta[n-k].
$$

若系统对单位脉冲的响应是 $h[n]$，线性与时不变性共同给出

$$
y[n]=\sum_k x[k]h[n-k].
$$

因此脉冲响应不是某个测试结果，而是一个 LTI 系统的完整说明书。知道 $h$，就知道它对任意输入的零状态响应。

## 第三章：滤波核就是局部规则

移动平均核把邻近样本取平均，压低快速变化；差分核让常量部分互相抵消，只突出边缘；指数核则让近期样本权重更高。

二维图像滤波没有改变本质：把一维的平移换成水平、垂直两个方向，像素邻域与卷积核逐点相乘再求和。

## 第四章：卷积定理为什么重要

Fourier 变换把卷积变成乘法：

$$
\mathcal F\{x*h\}=X(f)H(f).
$$

时间域中，每个输出点都要累加许多乘积；频域中，各频率模式只需分别乘以一个复数。快速卷积、均衡器、通信信道分析和图像处理都依赖这个等价关系。

### 需要记住的边界

- 卷积满足交换律，但“谁是输入、谁是系统”在物理解释上仍不同；
- 因果系统要求 $h(t)=0,\ t<0$；
- BIBO 稳定的连续时间 LTI 系统要求 $\int\lvert h(t)\rvert dt<\infty$；
- 有限长度计算必须说明边界策略：补零、周期延拓或镜像延拓会给出不同结果。

---

### 延伸阅读

- [3Blue1Brown：But what is a convolution?](https://www.3blue1brown.com/lessons/convolutions/)
- [本系列：傅立叶变换到底在看什么？](/posts/fourier-transform-interactive-guide/)
- [本系列：拉普拉斯变换到底在做什么？](/posts/laplace-transform-interactive-guide/)

> 本文重新面向 LTI 系统组织卷积直觉；文字、图形和交互均为独立实现。
