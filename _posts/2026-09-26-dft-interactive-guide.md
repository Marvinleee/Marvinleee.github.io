---
layout: post
title: "DFT 如何看见频率？从采样、混叠到频谱泄漏"
date: 2026-09-26 13:00:00 +0800
categories: [数学与工程]
tags: [DFT, FFT, 采样, 混叠, 频谱泄漏, 数字信号处理]
description: "用四个交互实验理解采样后的频率等价类、DFT 频点、窗函数、零填充和真实分辨率。"
math: true
toc: true
---

连续 Fourier 变换假设拥有一整条连续时间函数。数字系统真正拿到的却是有限个数：

$$
x[0],x[1],\ldots,x[N-1].
$$

离散 Fourier 变换（DFT）回答的是：这 $N$ 个样本在 $N$ 个离散旋转模式上分别投影了多少？

<section id="df-lab" class="df-lab" aria-label="DFT 交互实验室">
  <div class="df-head"><div><span>INTERACTIVE LAB</span><h2>DFT 交互实验室</h2><p>从模拟波形进入采样器，再观察频点、泄漏与零填充。</p></div><button type="button" data-action="reset">恢复默认</button></div>
  <div class="df-tabs" role="tablist" aria-label="实验选择">
    <button type="button" role="tab" aria-selected="true" data-view="alias">1 · 采样与混叠</button>
    <button type="button" role="tab" aria-selected="false" data-view="bins">2 · DFT 频点</button>
    <button type="button" role="tab" aria-selected="false" data-view="leak">3 · 泄漏与窗</button>
    <button type="button" role="tab" aria-selected="false" data-view="pad">4 · 零填充与分辨率</button>
  </div>
  <div class="df-panel" data-panel="alias" role="tabpanel">
    <div class="df-controls">
      <label>模拟频率 f <output data-out="af"></output><input data-key="af" type="range" min="0.5" max="24" step="0.1" value="11"></label>
      <label>采样率 fₛ <output data-out="afs"></output><input data-key="afs" type="range" min="4" max="32" step="1" value="16"></label>
      <label>相位 φ <output data-out="aph"></output><input data-key="aph" type="range" min="-180" max="180" step="5" value="0"></label>
    </div>
    <canvas data-canvas="alias" width="960" height="410" aria-label="连续正弦、采样点和混叠波形"></canvas>
    <div class="df-readout" data-readout="alias" aria-live="polite"></div>
  </div>
  <div class="df-panel" data-panel="bins" role="tabpanel" hidden>
    <div class="df-controls">
      <label>样本数 N<select data-key="bn"><option value="8">8</option><option value="16" selected>16</option><option value="32">32</option></select></label>
      <label>信号频率（bin） <output data-out="bf"></output><input data-key="bf" type="range" min="0" max="7.9" step="0.1" value="3"></label>
      <label>测试频点 k <output data-out="bk"></output><input data-key="bk" type="range" min="0" max="15" step="1" value="3"></label>
    </div>
    <canvas data-canvas="bins" width="960" height="420" aria-label="DFT 基向量与复数求和"></canvas>
    <div class="df-readout" data-readout="bins" aria-live="polite"></div>
  </div>
  <div class="df-panel" data-panel="leak" role="tabpanel" hidden>
    <div class="df-controls">
      <label>信号频率（bin） <output data-out="lf"></output><input data-key="lf" type="range" min="1" max="14" step="0.05" value="5.5"></label>
      <label>样本数 N<select data-key="ln"><option value="32">32</option><option value="64" selected>64</option><option value="128">128</option></select></label>
      <label>窗函数<select data-key="lw"><option value="rect">矩形窗</option><option value="hann">Hann 窗</option><option value="blackman">Blackman 窗</option></select></label>
    </div>
    <canvas data-canvas="leak" width="960" height="410" aria-label="不同窗函数下的 DFT 频谱泄漏"></canvas>
    <div class="df-readout" data-readout="leak" aria-live="polite"></div>
  </div>
  <div class="df-panel" data-panel="pad" role="tabpanel" hidden>
    <div class="df-controls">
      <label>真实记录长度 N<select data-key="pn"><option value="32">32</option><option value="64" selected>64</option><option value="128">128</option></select></label>
      <label>零填充倍数<select data-key="pp"><option value="1">1×</option><option value="4" selected>4×</option><option value="8">8×</option></select></label>
      <label>双音间距 Δbin <output data-out="pd"></output><input data-key="pd" type="range" min="0.2" max="3" step="0.1" value="1.2"></label>
    </div>
    <canvas data-canvas="pad" width="960" height="410" aria-label="不同记录长度与零填充下的双音频谱"></canvas>
    <div class="df-readout" data-readout="pad" aria-live="polite"></div>
  </div>
</section>

<style>
  .df-lab{--b:#08111e;--c:#102238;--l:#29415c;--t:#edf5ff;--m:#a2b3c8;--a:#49e1c7;--bl:#57c7ff;--y:#ffbd59;--p:#ff7396;margin:2rem 0 2.8rem;padding:1rem;border:1px solid rgba(87,199,255,.32);border-radius:22px;background:radial-gradient(circle at 78% -8%,rgba(255,189,89,.14),transparent 36%),var(--b);color:var(--t);box-shadow:0 20px 70px rgba(0,0,0,.22)}.df-lab *{box-sizing:border-box}.df-head{display:flex;justify-content:space-between;gap:1rem;padding:.4rem .35rem 1rem}.df-head span{font:700 .7rem ui-monospace,monospace;letter-spacing:.16em;color:var(--a)}.df-head h2{margin:.12rem 0 .25rem;color:var(--t);font-size:clamp(1.35rem,3vw,2rem)}.df-head p{margin:0;color:var(--m)}.df-head button,.df-tabs button{border:1px solid var(--l);border-radius:11px;background:var(--c);color:var(--t);padding:.65rem .5rem;cursor:pointer;font-weight:700;min-height:44px}.df-tabs{display:grid;grid-template-columns:repeat(4,1fr);gap:.45rem;margin-bottom:.8rem}.df-tabs button[aria-selected=true]{border-color:var(--a);background:rgba(73,225,199,.13);color:#c7fff5}.df-panel{padding:1rem;border:1px solid var(--l);border-radius:16px;background:linear-gradient(160deg,rgba(17,34,55,.97),rgba(7,15,27,.98))}.df-controls{display:grid;grid-template-columns:repeat(3,1fr);gap:.8rem;margin-bottom:1rem}.df-controls label{display:flex;flex-direction:column;gap:.35rem;color:var(--m);font-size:.82rem;font-weight:700}.df-controls output{color:var(--t)}.df-controls input{width:100%;accent-color:var(--a)}.df-controls select{border:1px solid var(--l);border-radius:9px;background:#081522;color:var(--t);padding:.55rem}.df-lab canvas{display:block;width:100%;height:auto;min-height:235px;border:1px solid rgba(92,146,183,.25);border-radius:13px;background:#07101b}.df-readout{margin-top:.8rem;padding:.82rem 1rem;border-left:3px solid var(--a);border-radius:8px;background:rgba(73,225,199,.07);font-variant-numeric:tabular-nums}.df-readout b{color:#bffff4}@media(max-width:760px){.df-tabs{grid-template-columns:repeat(2,1fr)}.df-controls{grid-template-columns:repeat(2,1fr)}}@media(max-width:480px){.df-lab{padding:.65rem}.df-head{display:block}.df-head button{margin-top:.7rem}.df-panel{padding:.7rem}.df-lab canvas{min-height:220px}}
</style>

<script>
(() => {
  const root=document.getElementById('df-lab');if(!root||root.dataset.ready)return;root.dataset.ready='1';const q=s=>root.querySelector(s),qa=s=>Array.from(root.querySelectorAll(s)),val=k=>{const e=q('[data-key="'+k+'"]');return e.type==='range'?Number(e.value):e.value;},out=(k,v)=>{const e=q('[data-out="'+k+'"]');if(e)e.textContent=v;},fmt=(n,d=2)=>Number.isFinite(n)?n.toFixed(d):'∞';
  const prep=n=>{const c=q('[data-canvas="'+n+'"]'),x=c.getContext('2d');x.clearRect(0,0,c.width,c.height);x.lineCap='round';x.lineJoin='round';return {x,w:c.width,h:c.height};},text=(x,s,a,b,col='#a2b3c8',z=18,al='left')=>{x.fillStyle=col;x.font=z+'px system-ui';x.textAlign=al;x.fillText(s,a,b);},grid=(x,a,b,c,d,xt=6,yt=4)=>{x.strokeStyle='rgba(120,154,184,.18)';x.lineWidth=1;for(let i=0;i<=xt;i++){let p=a+(c-a)*i/xt;x.beginPath();x.moveTo(p,b);x.lineTo(p,d);x.stroke();}for(let i=0;i<=yt;i++){let p=b+(d-b)*i/yt;x.beginPath();x.moveTo(a,p);x.lineTo(c,p);x.stroke();}x.strokeStyle='#45617b';x.strokeRect(a,b,c-a,d-b);},line=(x,fn,a,b,c,d,t0,t1,v0,v1,col,lw=4,n=400)=>{x.strokeStyle=col;x.lineWidth=lw;x.beginPath();for(let i=0;i<=n;i++){let t=t0+(t1-t0)*i/n,v=Math.max(v0,Math.min(v1,fn(t))),px=a+(c-a)*i/n,py=d-(v-v0)/(v1-v0)*(d-b);i?x.lineTo(px,py):x.moveTo(px,py);}x.stroke();};
  const aliasFreq=(f,fs)=>{let r=((f+fs/2)%fs+fs)%fs-fs/2;return Math.abs(r);};
  const dft=(a,M)=>{let out=[];for(let k=0;k<M;k++){let re=0,im=0;for(let n=0;n<a.length;n++){let p=-2*Math.PI*k*n/M;re+=a[n]*Math.cos(p);im+=a[n]*Math.sin(p);}out.push({re,im,mag:Math.hypot(re,im)/a.length});}return out;};
  const windowValue=(kind,n,N)=>kind==='hann'?.5-.5*Math.cos(2*Math.PI*n/(N-1)):kind==='blackman'?.42-.5*Math.cos(2*Math.PI*n/(N-1))+.08*Math.cos(4*Math.PI*n/(N-1)):1;
  let current='alias';
  function drawAlias(){const f=val('af'),fs=val('afs'),ph=val('aph')*Math.PI/180,fa=aliasFreq(f,fs),o=prep('alias'),x=o.x;out('af',fmt(f,1)+' Hz');out('afs',fs+' Hz');out('aph',fmt(val('aph'),0)+'°');const L=55,R=925,T=48,B=350;grid(x,L,T,R,B,8,4);line(x,t=>Math.sin(2*Math.PI*f*t+ph),L,T,R,B,0,1,-1.25,1.25,'rgba(87,199,255,.65)',3);line(x,t=>Math.sin(2*Math.PI*fa*t+ph),L,T,R,B,0,1,-1.25,1.25,'rgba(255,189,89,.8)',3);for(let n=0;n<=fs;n++){let t=n/fs,v=Math.sin(2*Math.PI*f*t+ph),px=L+(R-L)*t,py=B-(v+1.25)/2.5*(B-T);x.fillStyle='#49e1c7';x.beginPath();x.arc(px,py,6,0,Math.PI*2);x.fill();}text(x,'原模拟波',L,28,'#57c7ff',19);text(x,'相同样本对应的低频波',L+105,28,'#ffbd59',19);q('[data-readout=alias]').innerHTML='Nyquist 频率为 <b>'+fmt(fs/2,1)+' Hz</b>。当前 '+fmt(f,1)+' Hz 在采样后与 <b>'+fmt(fa,1)+' Hz</b> 产生相同样本；仅凭这些点无法判断原来是哪一个连续频率。';}
  function drawBins(){const N=Number(val('bn')),f=val('bf'),k=Math.min(N-1,val('bk')),o=prep('bins'),x=o.x;out('bf',fmt(f,1));out('bk',k);q('[data-key=bk]').max=N-1;const sig=Array.from({length:N},(_,n)=>Math.cos(2*Math.PI*f*n/N)),L=45,R=470,T=45,B=365;grid(x,L,T,R,B,8,4);for(let n=0;n<N;n++){let px=L+(R-L)*n/(N-1),py=B-(sig[n]+1.3)/2.6*(B-T);x.strokeStyle='#57c7ff';x.lineWidth=3;x.beginPath();x.moveTo(px,(T+B)/2);x.lineTo(px,py);x.stroke();x.fillStyle='#57c7ff';x.beginPath();x.arc(px,py,5,0,Math.PI*2);x.fill();}text(x,'N 个离散样本',L,27,'#edf5ff',20);const cx=720,cy=205,rad=145; x.strokeStyle='#45617b';x.lineWidth=2;x.beginPath();x.arc(cx,cy,rad,0,Math.PI*2);x.stroke();x.beginPath();x.moveTo(cx-rad,cy);x.lineTo(cx+rad,cy);x.moveTo(cx,cy-rad);x.lineTo(cx,cy+rad);x.stroke();let re=0,im=0,pts=[];for(let n=0;n<N;n++){let p=-2*Math.PI*k*n/N,z={re:sig[n]*Math.cos(p),im:sig[n]*Math.sin(p)};pts.push(z);re+=z.re;im+=z.im;}pts.forEach(z=>{x.fillStyle='#49e1c7';x.beginPath();x.arc(cx+z.re*rad*.78,cy-z.im*rad*.78,5,0,Math.PI*2);x.fill();});let m=Math.hypot(re,im)/N,sc=m?Math.min(100/m,70):0;x.strokeStyle='#ff7396';x.lineWidth=5;x.beginPath();x.moveTo(cx,cy);x.lineTo(cx+re/N*sc,cy-im/N*sc);x.stroke();text(x,'第 k 个复指数基向量',cx,27,'#edf5ff',20,'center');q('[data-readout=bins]').innerHTML='X[k]=Σx[n]e<sup>−j2πkn/N</sup>。当前 k=<b>'+k+'</b> 的归一化幅度为 <b>'+fmt(m,4)+'</b>。当频率落在整数 bin 上，正交性让能量集中到少数频点。';}
  function drawLeak(){const f=val('lf'),N=Number(val('ln')),kind=val('lw'),o=prep('leak'),x=o.x;out('lf',fmt(f,2));let a=Array.from({length:N},(_,n)=>Math.cos(2*Math.PI*f*n/N)*windowValue(kind,n,N)),X=dft(a,N),L=55,R=925,T=48,B=350;grid(x,L,T,R,B,8,4);let max=Math.max(...X.slice(0,N/2).map(v=>v.mag));for(let k=0;k<N/2;k++){let px=L+(R-L)*(k+.5)/(N/2),bw=(R-L)/(N/2)*.72,h=(B-T)*X[k].mag/(max||1);x.fillStyle=k===Math.round(f)?'#ffbd59':'#49e1c7';x.fillRect(px-bw/2,B-h,bw,h);}text(x,'DFT 幅度谱',L,28,'#edf5ff',21);text(x,'0',L,B+30);text(x,'Nyquist',R,B+30,'#a2b3c8',17,'right');q('[data-readout=leak]').innerHTML=(Math.abs(f-Math.round(f))<1e-8?'信号恰好在 DFT 频点上，矩形窗下能量高度集中。':'信号不在整数频点上，有限记录的周期延拓在边界跳变，能量泄漏到邻近 bin。')+(kind==='rect'?' 矩形窗主瓣窄、旁瓣高。':kind==='hann'?' Hann 窗降低旁瓣，但扩大主瓣。':' Blackman 窗进一步压低旁瓣，主瓣也更宽。');}
  function drawPad(){const N=Number(val('pn')),P=Number(val('pp')),d=val('pd'),M=N*P,f1=8,f2=8+d,o=prep('pad'),x=o.x;out('pd',fmt(d,1));let a=Array.from({length:N},(_,n)=>(Math.cos(2*Math.PI*f1*n/N)+.8*Math.cos(2*Math.PI*f2*n/N))*(.5-.5*Math.cos(2*Math.PI*n/(N-1)))),X=dft(a,M),L=55,R=925,T=48,B=350,max=Math.max(...X.slice(0,M/2).map(v=>v.mag));grid(x,L,T,R,B,8,4);x.strokeStyle='#49e1c7';x.lineWidth=4;x.beginPath();for(let k=0;k<M/2;k++){let bin=k*N/M,px=L+(R-L)*bin/16,py=B-(B-T)*X[k].mag/(max||1);if(px>R)break;k?x.lineTo(px,py):x.moveTo(px,py);}x.stroke();[f1,f2].forEach((f,i)=>{let px=L+(R-L)*f/16;x.strokeStyle=i?'#ffbd59':'#ff7396';x.setLineDash([8,6]);x.beginPath();x.moveTo(px,T);x.lineTo(px,B);x.stroke();x.setLineDash([]);});text(x,'双音的加窗频谱',L,28,'#edf5ff',21);text(x,'频率 / 原始 bin',R,B+30,'#a2b3c8',17,'right');q('[data-readout=pad]').innerHTML='真实数据仍只有 <b>N='+N+'</b> 点；'+P+'× 零填充把频谱曲线采样得更密，但主瓣宽度由原记录长度和窗决定。要真正分开很近的双音，应增加采样时长，而不仅是补零。';}
  function draw(){if(current==='alias')drawAlias();if(current==='bins')drawBins();if(current==='leak')drawLeak();if(current==='pad')drawPad();}function show(n){current=n;qa('[data-view]').forEach(b=>b.setAttribute('aria-selected',String(b.dataset.view===n)));qa('[data-panel]').forEach(p=>p.hidden=p.dataset.panel!==n);draw();}const defs={};qa('input,select').forEach(e=>defs[e.dataset.key]=e.value);qa('[data-view]').forEach(b=>b.addEventListener('click',()=>show(b.dataset.view)));qa('input,select').forEach(e=>e.addEventListener('input',draw));q('[data-action=reset]').addEventListener('click',()=>{qa('input,select').forEach(e=>e.value=defs[e.dataset.key]);show(current);});show('alias');
})();
</script>

## 第一章：采样让频率变成等价类

采样时刻 $t=nT_s$ 上，

$$
e^{j2\pi(f+m f_s)nT_s}=e^{j2\pi f nT_s},
\qquad m\in\mathbb Z.
$$

相差整数倍采样率的连续频率，会产生完全相同的离散样本。将频率折叠到 $[-f_s/2,f_s/2)$ 后得到可观察的数字频率；超过 Nyquist 频率的分量若未被模拟抗混叠滤波器压低，就会伪装成低频。

## 第二章：DFT 是有限维的换基

DFT 定义为

$$
X[k]=\sum_{n=0}^{N-1}x[n]e^{-j2\pi kn/N},
\qquad k=0,\ldots,N-1.
$$

这可以写成一个 $N\times N$ 复矩阵乘以长度为 $N$ 的向量。不同 $k$ 对应在 $N$ 个样本中恰好转过整数圈数的基向量，因此彼此正交。

## 第三章：频谱泄漏来自有限记录的边界

DFT 隐含地把这 $N$ 个样本周期重复。若记录首尾接不上，周期延拓会出现跳变；跳变需要许多频率共同表达，于是单个正弦的能量散到多个 bin。

窗函数在边界处逐渐压低信号，减少跳变和远处旁瓣，代价是主瓣变宽、幅度标定改变。选择窗函数是在“分开近邻频率”和“看见弱小频率”之间做权衡。

## 第四章：零填充不会创造信息

把 $N$ 点记录后面补零到 $M>N$，相当于在同一个离散时间 Fourier 变换曲线上取更多频率样本。谱峰位置看起来更平滑，但两个频率能否真正分开，仍由有效记录长度、信噪比和窗函数决定。

FFT 也不会改变 DFT 的答案。它只是利用对称和周期结构，把直接计算的复杂度从约 $N^2$ 降到约 $N\log_2N$。

### 实际分析顺序

1. 先确认采样率与模拟抗混叠滤波；
2. 再选择记录长度和窗函数；
3. 根据窗的 coherent gain 修正幅度；
4. 区分 bin 间距、主瓣宽度和估计精度；
5. 最后才考虑零填充与绘图美观度。

---

### 延伸阅读

- [3Blue1Brown：What is a Discrete Fourier Transform?](https://www.3blue1brown.com/lessons/discrete-fourier-transform/)
- [本系列：傅立叶变换到底在看什么？](/posts/fourier-transform-interactive-guide/)

> 实验使用无噪声、均匀采样和理想时钟建立基本直觉；真实测量还会受到量化、抖动、非线性和噪声底影响。
