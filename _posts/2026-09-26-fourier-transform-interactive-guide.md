---
layout: post
title: "傅立叶变换到底在看什么？从绕圆、频谱到相位"
date: 2026-09-26 10:00:00 +0800
categories: [数学与工程]
tags: [傅立叶变换, 频谱, 相位, 窗函数, 信号与系统]
description: "用四个交互实验理解频率投影、绕圆质心、有限观察时间、频谱泄漏与相位重建。"
math: true
toc: true
---

示波器给出的是电压随时间的变化，但滤波器、扬声器、通信链路和振动系统更关心另一个问题：

> 这段波形里，分别含有多少不同频率的旋转模式？

傅立叶变换就是把“时间坐标”换成“频率坐标”。它不是把信号改造成另一件东西，而是用另一套基准重新描述同一个信号。本文沿用上一篇 [Laplace 变换文章](/posts/laplace-transform-interactive-guide/) 的复平面坐标和绘图语言，但把探针限制在 $s=j\omega$ 这条虚轴上。

<section id="tf-lab" class="tf-lab" aria-label="傅立叶变换交互实验室">
  <div class="tf-head"><div><span>INTERACTIVE LAB</span><h2>傅立叶变换交互实验室</h2><p>先合成波形，再把它绕圆、扫描和重建。</p></div><button type="button" data-action="reset">恢复默认</button></div>
  <div class="tf-tabs" role="tablist" aria-label="实验选择">
    <button type="button" role="tab" aria-selected="true" data-view="synth">1 · 合成波形</button>
    <button type="button" role="tab" aria-selected="false" data-view="wind">2 · 绕圆探测</button>
    <button type="button" role="tab" aria-selected="false" data-view="window">3 · 窗与泄漏</button>
    <button type="button" role="tab" aria-selected="false" data-view="phase">4 · 相位重建</button>
  </div>
  <div class="tf-panel" data-panel="synth" role="tabpanel">
    <div class="tf-controls">
      <label>1 Hz 幅度 <output data-out="a1"></output><input data-key="a1" type="range" min="0" max="1.5" step="0.05" value="1"></label>
      <label>2.5 Hz 幅度 <output data-out="a2"></output><input data-key="a2" type="range" min="0" max="1.5" step="0.05" value="0.65"></label>
      <label>5 Hz 幅度 <output data-out="a3"></output><input data-key="a3" type="range" min="0" max="1.5" step="0.05" value="0.35"></label>
    </div>
    <canvas data-canvas="synth" width="960" height="410" aria-label="三个正弦分量及其合成波形"></canvas>
    <div class="tf-readout" data-readout="synth" aria-live="polite"></div>
  </div>
  <div class="tf-panel" data-panel="wind" role="tabpanel" hidden>
    <div class="tf-controls">
      <label>信号频率 f₀ <output data-out="wf0"></output><input data-key="wf0" type="range" min="0.5" max="6" step="0.1" value="3"></label>
      <label>绕圆频率 f <output data-out="wf"></output><input data-key="wf" type="range" min="0" max="7" step="0.05" value="3"></label>
      <label>观察时长 T <output data-out="wT"></output><input data-key="wT" type="range" min="1" max="8" step="0.5" value="4"></label>
    </div>
    <canvas data-canvas="wind" width="960" height="410" aria-label="信号绕圆和积分合向量"></canvas>
    <div class="tf-readout" data-readout="wind" aria-live="polite"></div>
  </div>
  <div class="tf-panel" data-panel="window" role="tabpanel" hidden>
    <div class="tf-controls">
      <label>信号频率 f₀ <output data-out="sf0"></output><input data-key="sf0" type="range" min="0.5" max="8" step="0.05" value="3.3"></label>
      <label>记录时长 T <output data-out="sT"></output><input data-key="sT" type="range" min="0.5" max="6" step="0.25" value="2"></label>
      <label>窗函数<select data-key="window"><option value="rect">矩形窗</option><option value="hann">Hann 窗</option></select></label>
    </div>
    <canvas data-canvas="window" width="960" height="410" aria-label="截断波形与连续频谱"></canvas>
    <div class="tf-readout" data-readout="window" aria-live="polite"></div>
  </div>
  <div class="tf-panel" data-panel="phase" role="tabpanel" hidden>
    <div class="tf-controls">
      <label>第二分量相位 φ <output data-out="phi"></output><input data-key="phi" type="range" min="-180" max="180" step="5" value="60"></label>
      <label>整体时移 t₀ <output data-out="shift"></output><input data-key="shift" type="range" min="-0.5" max="0.5" step="0.01" value="0"></label>
      <label>第二分量幅度 <output data-out="pa2"></output><input data-key="pa2" type="range" min="0" max="1.5" step="0.05" value="0.7"></label>
    </div>
    <canvas data-canvas="phase" width="960" height="410" aria-label="相同幅度频谱在不同相位下的波形"></canvas>
    <div class="tf-readout" data-readout="phase" aria-live="polite"></div>
  </div>
</section>

<style>
  .tf-lab{--b:#08111e;--c:#102238;--l:#29415c;--t:#edf5ff;--m:#a2b3c8;--a:#49e1c7;--b1:#57c7ff;--y:#ffbd59;--p:#ff7396;margin:2rem 0 2.8rem;padding:1rem;border:1px solid rgba(87,199,255,.32);border-radius:22px;background:radial-gradient(circle at 78% -8%,rgba(87,199,255,.16),transparent 36%),var(--b);color:var(--t);box-shadow:0 20px 70px rgba(0,0,0,.22)}.tf-lab *{box-sizing:border-box}.tf-head{display:flex;justify-content:space-between;gap:1rem;padding:.4rem .35rem 1rem}.tf-head span{font:700 .7rem ui-monospace,monospace;letter-spacing:.16em;color:var(--a)}.tf-head h2{margin:.12rem 0 .25rem;color:var(--t);font-size:clamp(1.35rem,3vw,2rem)}.tf-head p{margin:0;color:var(--m)}.tf-head button,.tf-tabs button{border:1px solid var(--l);border-radius:11px;background:var(--c);color:var(--t);padding:.65rem .5rem;cursor:pointer;font-weight:700;min-height:44px}.tf-tabs{display:grid;grid-template-columns:repeat(4,1fr);gap:.45rem;margin-bottom:.8rem}.tf-tabs button[aria-selected="true"]{border-color:var(--a);background:rgba(73,225,199,.13);color:#c7fff5}.tf-panel{padding:1rem;border:1px solid var(--l);border-radius:16px;background:linear-gradient(160deg,rgba(17,34,55,.97),rgba(7,15,27,.98))}.tf-controls{display:grid;grid-template-columns:repeat(3,1fr);gap:.8rem;margin-bottom:1rem}.tf-controls label{display:flex;flex-direction:column;gap:.35rem;color:var(--m);font-size:.82rem;font-weight:700}.tf-controls output{color:var(--t)}.tf-controls input{width:100%;accent-color:var(--a)}.tf-controls select{border:1px solid var(--l);border-radius:9px;background:#081522;color:var(--t);padding:.55rem}.tf-lab canvas{display:block;width:100%;height:auto;min-height:235px;border:1px solid rgba(92,146,183,.25);border-radius:13px;background:#07101b}.tf-readout{margin-top:.8rem;padding:.82rem 1rem;border-left:3px solid var(--a);border-radius:8px;background:rgba(73,225,199,.07);font-variant-numeric:tabular-nums}.tf-readout b{color:#bffff4}@media(max-width:760px){.tf-tabs{grid-template-columns:repeat(2,1fr)}.tf-controls{grid-template-columns:repeat(2,1fr)}}@media(max-width:480px){.tf-lab{padding:.65rem}.tf-head{display:block}.tf-head button{margin-top:.7rem}.tf-panel{padding:.7rem}.tf-lab canvas{min-height:220px}}@media(prefers-reduced-motion:reduce){.tf-lab *{transition:none!important}}
</style>

<script>
(() => {
  const root=document.getElementById('tf-lab');if(!root||root.dataset.ready)return;root.dataset.ready='1';
  const q=s=>root.querySelector(s),qa=s=>Array.from(root.querySelectorAll(s)),val=k=>{const e=q('[data-key="'+k+'"]');return e.type==='range'?Number(e.value):e.value;},out=(k,v)=>{const e=q('[data-out="'+k+'"]');if(e)e.textContent=v;},fmt=(n,d=2)=>n.toFixed(d);
  const prep=n=>{const c=q('[data-canvas="'+n+'"]'),x=c.getContext('2d');x.clearRect(0,0,c.width,c.height);x.lineCap='round';x.lineJoin='round';return {c,x,w:c.width,h:c.height};};
  const text=(x,s,a,b,col='#a2b3c8',z=19,al='left')=>{x.fillStyle=col;x.font=z+'px system-ui';x.textAlign=al;x.fillText(s,a,b);};
  const grid=(x,a,b,c,d,xt=5,yt=4)=>{x.strokeStyle='rgba(120,154,184,.18)';x.lineWidth=1;for(let i=0;i<=xt;i++){let p=a+(c-a)*i/xt;x.beginPath();x.moveTo(p,b);x.lineTo(p,d);x.stroke();}for(let i=0;i<=yt;i++){let p=b+(d-b)*i/yt;x.beginPath();x.moveTo(a,p);x.lineTo(c,p);x.stroke();}x.strokeStyle='#45617b';x.lineWidth=2;x.strokeRect(a,b,c-a,d-b);};
  const line=(x,fn,a,b,c,d,t0,t1,v0,v1,col,lw=4,n=420)=>{x.strokeStyle=col;x.lineWidth=lw;x.beginPath();for(let i=0;i<=n;i++){let t=t0+(t1-t0)*i/n,v=Math.max(v0,Math.min(v1,fn(t))),px=a+(c-a)*i/n,py=d-(v-v0)/(v1-v0)*(d-b);i?x.lineTo(px,py):x.moveTo(px,py);}x.stroke();};
  let current='synth';
  function drawSynth(){const a1=val('a1'),a2=val('a2'),a3=val('a3'),o=prep('synth'),x=o.x;out('a1',fmt(a1));out('a2',fmt(a2));out('a3',fmt(a3));const L=65,R=925,T=48,B=350;grid(x,L,T,R,B,8,4);const f=t=>a1*Math.sin(2*Math.PI*t)+a2*Math.sin(5*Math.PI*t)+a3*Math.sin(10*Math.PI*t);line(x,t=>a1*Math.sin(2*Math.PI*t),L,T,R,B,0,2,-3,3,'rgba(87,199,255,.45)',2);line(x,t=>a2*Math.sin(5*Math.PI*t),L,T,R,B,0,2,-3,3,'rgba(255,189,89,.45)',2);line(x,t=>a3*Math.sin(10*Math.PI*t),L,T,R,B,0,2,-3,3,'rgba(255,115,150,.45)',2);line(x,f,L,T,R,B,0,2,-3,3,'#49e1c7',5);text(x,'时间波形：三个旋转模式相加',L,28,'#edf5ff',21);text(x,'0',L,B+30);text(x,'2 s',R,B+30,'#a2b3c8',18,'right');q('[data-readout="synth"]').innerHTML='当前信号 x(t)=<b>'+fmt(a1)+'sin(2πt) + '+fmt(a2)+'sin(5πt) + '+fmt(a3)+'sin(10πt)</b>。青色曲线看起来复杂，但它在频率坐标中只有三项。';}
  function drawWind(){const f0=val('wf0'),f=val('wf'),T=val('wT'),o=prep('wind'),x=o.x;out('wf0',fmt(f0,1)+' Hz');out('wf',fmt(f,2)+' Hz');out('wT',fmt(T,1)+' s');const L=55,R=475,top=48,B=355;grid(x,L,top,R,B,5,4);line(x,t=>Math.cos(2*Math.PI*f0*t),L,top,R,B,0,T,-1.2,1.2,'#57c7ff',4);text(x,'原信号 x(t)',L,28,'#edf5ff',21);const cx=725,cy=205,rad=150; x.strokeStyle='#45617b';x.lineWidth=2;x.beginPath();x.arc(cx,cy,rad,0,Math.PI*2);x.stroke();x.beginPath();x.moveTo(cx-rad,cy);x.lineTo(cx+rad,cy);x.moveTo(cx,cy-rad);x.lineTo(cx,cy+rad);x.stroke();let sum={re:0,im:0},dt=T/700,pts=[];for(let i=0;i<=700;i++){let t=i*dt,v=Math.cos(2*Math.PI*f0*t),z={re:v*Math.cos(-2*Math.PI*f*t),im:v*Math.sin(-2*Math.PI*f*t)};pts.push(z);if(i){let p=pts[i-1];sum.re+=(p.re+z.re)*dt/2;sum.im+=(p.im+z.im)*dt/2;}}x.strokeStyle='#49e1c7';x.lineWidth=3;x.beginPath();pts.forEach((p,i)=>{let px=cx+p.re*rad*.86,py=cy-p.im*rad*.86;i?x.lineTo(px,py):x.moveTo(px,py);});x.stroke();let m=Math.hypot(sum.re,sum.im),sc=m?Math.min(95/m,55):0;x.strokeStyle='#ff7396';x.lineWidth=5;x.beginPath();x.moveTo(cx,cy);x.lineTo(cx+sum.re*sc,cy-sum.im*sc);x.stroke();text(x,'绕圆后的轨迹与合向量',cx,28,'#edf5ff',21,'center');q('[data-readout="wind"]').innerHTML='有限时间 Fourier 投影为 <b>'+fmt(sum.re,3)+(sum.im>=0?'+':'')+fmt(sum.im,3)+'j</b>，幅度 <b>'+fmt(m,3)+'</b>。当 f 接近 f₀ 时，向量不再均匀抵消。';}
  const win=(kind,t,T)=>kind==='hann'?.5-.5*Math.cos(2*Math.PI*t/T):1;
  function coeff(f,f0,T,kind){let re=0,im=0,N=700,dt=T/N;for(let i=0;i<=N;i++){let t=i*dt,v=Math.cos(2*Math.PI*f0*t)*win(kind,t,T),w=i===0||i===N?.5:1;re+=w*v*Math.cos(2*Math.PI*f*t)*dt;im-=w*v*Math.sin(2*Math.PI*f*t)*dt;}return Math.hypot(re,im);}
  function drawWindow(){const f0=val('sf0'),T=val('sT'),kind=val('window'),o=prep('window'),x=o.x;out('sf0',fmt(f0,2)+' Hz');out('sT',fmt(T,2)+' s');const L=55,R=455,top=50,B=355;grid(x,L,top,R,B,4,4);line(x,t=>Math.cos(2*Math.PI*f0*t)*win(kind,t,T),L,top,R,B,0,T,-1.15,1.15,'#57c7ff',4);text(x,'被窗截取的记录',L,29,'#edf5ff',21);const A=535,C=925;grid(x,A,top,C,B,5,4);let max=.01,arr=[];for(let i=0;i<=220;i++){let f=10*i/220,m=coeff(f,f0,T,kind);arr.push(m);max=Math.max(max,m);}line(x,f=>coeff(f,f0,T,kind),A,top,C,B,0,10,0,max*1.08,'#49e1c7',4,220);text(x,'连续频率扫描',A,29,'#edf5ff',21);text(x,'0',A,B+29);text(x,'10 Hz',C,B+29,'#a2b3c8',18,'right');q('[data-readout="window"]').innerHTML=(kind==='rect'?'矩形窗主瓣较窄，但旁瓣较高。':'Hann 窗压低旁瓣，但主瓣会变宽。')+' 当前名义分辨尺度约 <b>1/T = '+fmt(1/T,3)+' Hz</b>；延长记录才真正增加区分近邻频率的能力。';}
  function drawPhase(){const phi=val('phi')*Math.PI/180,shift=val('shift'),a2=val('pa2'),o=prep('phase'),x=o.x;out('phi',fmt(val('phi'),0)+'°');out('shift',fmt(shift,2)+' s');out('pa2',fmt(a2));const L=55,R=925,top=48,B=270;grid(x,L,top,R,B,8,4);const sig=t=>Math.sin(2*Math.PI*2*(t-shift))+a2*Math.sin(2*Math.PI*5*(t-shift)+phi);line(x,sig,L,top,R,B,0,2,-2.7,2.7,'#57c7ff',5);text(x,'由相同幅度、不同相位重建的波形',L,28,'#edf5ff',21);const y=340,scale=62;for(const p of [{f:2,a:1,ph:-4*Math.PI*shift},{f:5,a:a2,ph:phi-10*Math.PI*shift}]){const cx=L+(R-L)*p.f/8;x.strokeStyle='#45617b';x.lineWidth=2;x.beginPath();x.arc(cx,y,scale*p.a,0,Math.PI*2);x.stroke();x.strokeStyle=p.f===2?'#49e1c7':'#ffbd59';x.lineWidth=4;x.beginPath();x.moveTo(cx,y);x.lineTo(cx+scale*p.a*Math.cos(p.ph),y-scale*p.a*Math.sin(p.ph));x.stroke();text(x,p.f+' Hz',cx,y+60,'#a2b3c8',17,'center');}q('[data-readout="phase"]').innerHTML='幅度谱始终只有 <b>2 Hz：1.00</b> 与 <b>5 Hz：'+fmt(a2)+'</b>，但波形会随相位和时移明显改变。整体时移 t₀ 会给每个频率增加与频率成比例的相位 −2πft₀。';}
  function draw(){if(current==='synth')drawSynth();if(current==='wind')drawWind();if(current==='window')drawWindow();if(current==='phase')drawPhase();}
  function show(n){current=n;qa('[data-view]').forEach(b=>b.setAttribute('aria-selected',String(b.dataset.view===n)));qa('[data-panel]').forEach(p=>p.hidden=p.dataset.panel!==n);draw();}
  const defs={};qa('input,select').forEach(e=>defs[e.dataset.key]=e.value);qa('[data-view]').forEach(b=>b.addEventListener('click',()=>show(b.dataset.view)));qa('input,select').forEach(e=>e.addEventListener('input',draw));q('[data-action=reset]').addEventListener('click',()=>{qa('input,select').forEach(e=>e.value=defs[e.dataset.key]);show(current);});show('synth');
})();
</script>

## 第一章：把波形看成频率基底上的向量

在线性代数中，一个向量可以写成若干基向量的线性组合。周期信号也可以写成正弦和余弦的叠加：

$$
x(t)=\sum_k A_k\cos(2\pi f_k t+\phi_k).
$$

实验 1 反向展示这个过程：先选择三个频率坐标的系数，再看它们怎样混成一条复杂波形。Fourier 分析做的则是逆过程——已知混合波形，找回各个频率坐标。

## 第二章：绕圆就是对一个频率做投影

连续时间 Fourier 变换写作

$$
X(f)=\int_{-\infty}^{\infty}x(t)e^{-j2\pi ft}\,dt.
$$

$e^{-j2\pi ft}$ 是单位圆上的匀速旋转。将 $x(t)$ 乘上它，相当于把信号样本绕到复平面；积分则把所有小向量相加。若绕圆频率与信号频率匹配，轨迹偏向一侧，合向量变长。

这里的结果是复数。模长表示该频率有多强，角度则保留相位。只画幅度谱会丢掉重建波形所需的一半信息。

## 第三章：真实频谱总是带着观察窗口

计算机和仪器不可能观察无限时间。记录一段长度为 $T$ 的信号，等价于把原信号乘以窗函数：

$$
x_T(t)=x(t)w(t).
$$

时间域相乘会在频域形成卷积，因此理想的单根谱线被窗函数的频谱摊开。矩形窗主瓣窄但旁瓣高；Hann 窗用更宽的主瓣换取更低的旁瓣。

常说的“频率分辨率约为 $1/T$”描述的是记录时长带来的尺度。零填充能让曲线采样更密，却不能创造原记录中不存在的信息。

## 第四章：幅度相同，不代表波形相同

实验 4 保持两根谱线的幅度不变，只改变相位。波形会明显变化，但幅度谱完全相同。

对整体时移

$$
y(t)=x(t-t_0),
$$

有

$$
Y(f)=X(f)e^{-j2\pi ft_0}.
$$

时移不会改变幅度，只会让相位随频率线性倾斜。因此，相位不是频谱的装饰信息；脉冲位置、边缘形状和群延迟都依赖相位。

## 从 Fourier 走向信号工程

| 现象 | Fourier 视角 | 实际用途 |
|---|---|---|
| 周期波形 | 离散谐波 | 振动诊断、电源纹波 |
| 有限记录 | 与窗函数频谱卷积 | 频谱仪、音频分析 |
| 系统卷积 | 频域相乘 | 滤波器与信道 |
| 时移 | 线性相位 | 延迟与同步 |
| 采样 | 频谱周期复制 | ADC、数字信号处理 |

傅立叶变换最重要的不是“把曲线画成频谱”，而是找到一组会被 LTI 系统独立缩放和移相的自然模式。下一篇将从另一个方向回答同一件事：为什么 LTI 系统在时间域表现为卷积。

---

### 延伸阅读

- [3Blue1Brown：But what is the Fourier Transform?](https://www.3blue1brown.com/lessons/fourier-transforms/)
- [3Blue1Brown：But what is a Fourier series?](https://www.3blue1brown.com/lessons/fourier-series/)
- [本系列：拉普拉斯变换到底在做什么？](/posts/laplace-transform-interactive-guide/)

> 本文参考 3Blue1Brown 的“绕圆—质心”教学思路，重新面向信号与系统场景组织；文字、图形和交互均为独立实现。
