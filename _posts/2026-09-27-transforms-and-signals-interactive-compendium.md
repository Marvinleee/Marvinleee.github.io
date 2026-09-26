---
layout: post
title: "从 Fourier 到 Z 变换：信号与系统的交互式统一指南"
date: 2026-09-27 07:00:00 +0800
categories: [数学与工程]
tags: [傅立叶变换, 卷积, 拉普拉斯变换, 极点零点, DFT, Z变换, 信号与系统]
description: "一篇连续阅读的交互式长文，用 26 个实验统一理解 Fourier、卷积、Laplace、极点零点、DFT 与 Z 变换在信号与系统中的关系。"
math: true
toc: true
---

信号与系统课程中，Fourier、卷积、Laplace、极点零点、DFT 和 Z 变换常常被分成六套公式。真正理解以后会发现，它们一直在回答同一个问题：

> **一个线性系统怎样分解、保存、衰减、放大和旋转不同的自然模式？**

这篇文章把六个主题放回同一条学习路径。页面中的 26 个实验使用一致的复平面坐标、颜色和绘图逻辑；参数变化时，时间域、频率域和复平面会同步更新。

建议预留 60–90 分钟连续阅读。第一次阅读不必推导所有公式：先操作每部分的第一个实验，抓住图像，再回头看推导和边界条件。

## 阅读路线

| 部分 | 核心问题 | 读完应获得的直觉 |
|---|---|---|
| [Fourier 变换](#part-fourier) | 波形由哪些频率组成？ | 频率投影、幅度、相位与窗口 |
| [卷积与 LTI](#part-convolution) | 系统如何累加过去的输入？ | 脉冲响应、滑动重叠与频域乘法 |
| [Laplace 变换](#part-laplace) | 衰减或增长模式怎样进入变换？ | s 平面、收敛域与初值 |
| [极点与零点](#part-poles) | 怎样从位置直接读出系统行为？ | 稳定性、共振、Bode 图与反馈 |
| [DFT](#part-dft) | 有限采样记录怎样产生频谱？ | 混叠、频点、泄漏与分辨率 |
| [Z 变换](#part-z) | 连续系统思想如何进入离散时间？ | 单位圆、ROC、差分方程与数字滤波 |

### 一条贯穿全文的线索

$$
\text{自然模式}
\longrightarrow
\text{投影或响应}
\longrightarrow
\text{变换域乘法}
\longrightarrow
\text{极点零点}
\longrightarrow
\text{可观测的时间行为}.
$$

<span id="part-fourier"></span>

## 第一部分：Fourier 变换——把时间波形换成频率坐标

> 目标：理解频率投影、幅度与相位，以及有限观察时间为什么会改变频谱。

示波器给出的是电压随时间的变化，但滤波器、扬声器、通信链路和振动系统更关心另一个问题：

> 这段波形里，分别含有多少不同频率的旋转模式？

傅立叶变换就是把“时间坐标”换成“频率坐标”。它不是把信号改造成另一件东西，而是用另一套基准重新描述同一个信号。我们先从最容易观察的稳定振荡开始，把探针限制在 $s=j\omega$ 这条虚轴上。

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

### 第一章：把波形看成频率基底上的向量

在线性代数中，一个向量可以写成若干基向量的线性组合。周期信号也可以写成正弦和余弦的叠加：

$$
x(t)=\sum_k A_k\cos(2\pi f_k t+\phi_k).
$$

实验 1 反向展示这个过程：先选择三个频率坐标的系数，再看它们怎样混成一条复杂波形。Fourier 分析做的则是逆过程——已知混合波形，找回各个频率坐标。

### 第二章：绕圆就是对一个频率做投影

连续时间 Fourier 变换写作

$$
X(f)=\int_{-\infty}^{\infty}x(t)e^{-j2\pi ft}\,dt.
$$

$e^{-j2\pi ft}$ 是单位圆上的匀速旋转。将 $x(t)$ 乘上它，相当于把信号样本绕到复平面；积分则把所有小向量相加。若绕圆频率与信号频率匹配，轨迹偏向一侧，合向量变长。

这里的结果是复数。模长表示该频率有多强，角度则保留相位。只画幅度谱会丢掉重建波形所需的一半信息。

### 第三章：真实频谱总是带着观察窗口

计算机和仪器不可能观察无限时间。记录一段长度为 $T$ 的信号，等价于把原信号乘以窗函数：

$$
x_T(t)=x(t)w(t).
$$

时间域相乘会在频域形成卷积，因此理想的单根谱线被窗函数的频谱摊开。矩形窗主瓣窄但旁瓣高；Hann 窗用更宽的主瓣换取更低的旁瓣。

常说的“频率分辨率约为 $1/T$”描述的是记录时长带来的尺度。零填充能让曲线采样更密，却不能创造原记录中不存在的信息。

### 第四章：幅度相同，不代表波形相同

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

### 从 Fourier 走向信号工程

| 现象 | Fourier 视角 | 实际用途 |
|---|---|---|
| 周期波形 | 离散谐波 | 振动诊断、电源纹波 |
| 有限记录 | 与窗函数频谱卷积 | 频谱仪、音频分析 |
| 系统卷积 | 频域相乘 | 滤波器与信道 |
| 时移 | 线性相位 | 延迟与同步 |
| 采样 | 频谱周期复制 | ADC、数字信号处理 |

傅立叶变换最重要的不是“把曲线画成频谱”，而是找到一组会被 LTI 系统独立缩放和移相的自然模式。下一部分将从另一个方向回答同一件事：为什么 LTI 系统在时间域表现为卷积。

---

<span id="part-convolution"></span>

## 第二部分：卷积与 LTI——系统怎样叠加过去的影响

> 目标：从滑动重叠走到脉冲响应，并理解时间域卷积与频域乘法是同一件事。

> 衔接：Fourier 告诉我们各个频率模式会被独立缩放；卷积解释这种频域乘法在时间域究竟是怎样发生的。

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

### 第一章：翻转、平移、相乘、积分

固定一个输出时刻 $t$，卷积中的 $h(t-\tau)$ 可以分两步得到：

1. 把 $h(\tau)$ 沿时间轴翻转成 $h(-\tau)$；
2. 再向右平移 $t$，得到 $h(t-\tau)$。

它和 $x(\tau)$ 相乘后，曲线下面积就是当前的 $y(t)$。让 $t$ 连续移动，所有面积排成一条新曲线，这就是卷积输出。

### 第二章：为什么 LTI 系统一定产生卷积

离散信号可写成移位脉冲的和：

$$
x[n]=\sum_k x[k]\delta[n-k].
$$

若系统对单位脉冲的响应是 $h[n]$，线性与时不变性共同给出

$$
y[n]=\sum_k x[k]h[n-k].
$$

因此脉冲响应不是某个测试结果，而是一个 LTI 系统的完整说明书。知道 $h$，就知道它对任意输入的零状态响应。

### 第三章：滤波核就是局部规则

移动平均核把邻近样本取平均，压低快速变化；差分核让常量部分互相抵消，只突出边缘；指数核则让近期样本权重更高。

二维图像滤波没有改变本质：把一维的平移换成水平、垂直两个方向，像素邻域与卷积核逐点相乘再求和。

### 第四章：卷积定理为什么重要

Fourier 变换把卷积变成乘法：

$$
\mathcal F\{x*h\}=X(f)H(f).
$$

时间域中，每个输出点都要累加许多乘积；频域中，各频率模式只需分别乘以一个复数。快速卷积、均衡器、通信信道分析和图像处理都依赖这个等价关系。

#### 需要记住的边界

- 卷积满足交换律，但“谁是输入、谁是系统”在物理解释上仍不同；
- 因果系统要求 $h(t)=0,\ t<0$；
- BIBO 稳定的连续时间 LTI 系统要求 $\int\lvert h(t)\rvert dt<\infty$；
- 有限长度计算必须说明边界策略：补零、周期延拓或镜像延拓会给出不同结果。

---

<span id="part-laplace"></span>

## 第三部分：Laplace 变换——给频率增加增长与衰减维度

> 目标：把 Fourier 的旋转扩展到整个 s 平面，理解收敛域、初值和微分方程。

> 衔接：Fourier 只测试不会增长或衰减的纯旋转；Laplace 在同一坐标中加入实部，使瞬态、初值和微分方程也能被直接处理。

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

### 第一章：为什么复指数是系统的“自然坐标”

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

### 第二章：一个同时“加权”和“绕圈”的积分

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

### 第三章：Fourier 变换只是 \(s\) 平面上的一条线

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

### 第四章：为什么只背 \(1/(s+a)\) 还不够

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

### 第五章：微分方程为什么会变成代数方程

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

### 第六章：从极点位置直接阅读系统行为

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

#### 稳定性最简规则

对于连续时间、因果、有理的 LTI 系统：

- 所有极点都在左半平面：自然响应随时间衰减，系统稳定；
- 极点进入右半平面：存在随时间增长的模式，系统不稳定；
- 极点落在虚轴上：需要检查重数；理想无阻尼振荡是临界情形。

零点也会塑造响应，但它们通常不决定内部自然模式是否增长。直观地说，**极点告诉你系统自己想怎样运动，零点告诉你某些输入输出通道怎样抵消。**

### 把整篇文章压缩成一幅心智图

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

### 三个容易混淆的地方

1. **Laplace 变换不是单纯的“更一般 Fourier 变换”。**
   它还必须携带收敛域；没有 ROC，有理式可能无法唯一确定时域信号。

2. **热图上的有限颜色不等于原积分在那里收敛。**
   有理函数可以越过收敛边界做解析延拓，但积分定义与解析延拓是两件事。

3. **极点很重要，但不能单独替代完整模型。**
   零点、增益、初值、输入位置以及不可控或不可观测模式都会影响实际测量结果。

---

<span id="part-poles"></span>

## 第四部分：极点与零点——从复平面直接阅读系统行为

> 目标：把时间响应、Bode 图、稳定性和反馈根轨迹统一到极点零点位置。

> 衔接：上一部分建立了 s 平面；现在不再逐点计算变换，而是从极点和零点的位置直接预测衰减、振铃、共振与稳定性。

传递函数常被写成多项式之比：

$$
H(s)=K\frac{\prod_m(s-z_m)}{\prod_n(s-p_n)}.
$$

这个式子并不只是代数压缩。每个极点 $p_n$ 和零点 $z_m$ 都是复平面上的一个位置；从频率探针 $s=j\omega$ 到这些点的距离，直接决定系统怎样放大、衰减和旋转一个正弦模式。

<section id="pz-lab" class="pz-lab" aria-label="极点零点交互实验室">
  <div class="pz-head"><div><span>INTERACTIVE LAB</span><h2>极点与零点交互实验室</h2><p>在同一坐标系里连接位置、频响和时间响应。</p></div><button type="button" data-action="reset">恢复默认</button></div>
  <div class="pz-tabs" role="tablist" aria-label="实验选择">
    <button type="button" role="tab" aria-selected="true" data-view="map">1 · 系统地图</button>
    <button type="button" role="tab" aria-selected="false" data-view="bode">2 · Bode 积木</button>
    <button type="button" role="tab" aria-selected="false" data-view="locus">3 · 根轨迹</button>
    <button type="button" role="tab" aria-selected="false" data-view="rhp">4 · 右半平面零点</button>
  </div>
  <div class="pz-panel" data-panel="map" role="tabpanel">
    <div class="pz-controls">
      <label>自然角频率 ωₙ <output data-out="mwn"></output><input data-key="mwn" type="range" min="0.5" max="8" step="0.1" value="3"></label>
      <label>阻尼比 ζ <output data-out="mz"></output><input data-key="mz" type="range" min="0.05" max="1.8" step="0.05" value="0.35"></label>
      <label>左半平面零点 a <output data-out="ma"></output><input data-key="ma" type="range" min="0.2" max="10" step="0.1" value="5"></label>
    </div>
    <canvas data-canvas="map" width="960" height="470" aria-label="极点零点、阶跃响应和频率响应"></canvas>
    <div class="pz-readout" data-readout="map" aria-live="polite"></div>
  </div>
  <div class="pz-panel" data-panel="bode" role="tabpanel" hidden>
    <div class="pz-controls">
      <label>极点转折 ωₚ <output data-out="bp"></output><input data-key="bp" type="range" min="0.2" max="20" step="0.1" value="2"></label>
      <label>零点转折 ω𝓏 <output data-out="bz"></output><input data-key="bz" type="range" min="0.2" max="20" step="0.1" value="8"></label>
      <label>直流增益 K <output data-out="bk"></output><input data-key="bk" type="range" min="0.2" max="5" step="0.1" value="1"></label>
    </div>
    <canvas data-canvas="bode" width="960" height="430" aria-label="极点零点的 Bode 幅频与相频贡献"></canvas>
    <div class="pz-readout" data-readout="bode" aria-live="polite"></div>
  </div>
  <div class="pz-panel" data-panel="locus" role="tabpanel" hidden>
    <div class="pz-controls">
      <label>开环实极点 a <output data-out="la"></output><input data-key="la" type="range" min="0.5" max="6" step="0.1" value="2"></label>
      <label>环路增益 K <output data-out="lk"></output><input data-key="lk" type="range" min="0" max="16" step="0.1" value="1"></label>
      <label>时间光标 <output data-out="lt"></output><input data-key="lt" type="range" min="0" max="10" step="0.1" value="4"></label>
    </div>
    <canvas data-canvas="locus" width="960" height="430" aria-label="二阶闭环系统的根轨迹和响应"></canvas>
    <div class="pz-readout" data-readout="locus" aria-live="polite"></div>
  </div>
  <div class="pz-panel" data-panel="rhp" role="tabpanel" hidden>
    <div class="pz-controls">
      <label>零点位置<select data-key="rside"><option value="left">左半平面 −a</option><option value="right">右半平面 +a</option></select></label>
      <label>零点距离 a <output data-out="ra"></output><input data-key="ra" type="range" min="0.25" max="6" step="0.05" value="1"></label>
      <label>时间常数 τ <output data-out="rtau"></output><input data-key="rtau" type="range" min="0.3" max="2" step="0.05" value="1"></label>
    </div>
    <canvas data-canvas="rhp" width="960" height="410" aria-label="左半平面与右半平面零点的阶跃响应"></canvas>
    <div class="pz-readout" data-readout="rhp" aria-live="polite"></div>
  </div>
</section>

<style>
  .pz-lab{--b:#08111e;--c:#102238;--l:#29415c;--t:#edf5ff;--m:#a2b3c8;--a:#49e1c7;--bl:#57c7ff;--y:#ffbd59;--p:#ff7396;margin:2rem 0 2.8rem;padding:1rem;border:1px solid rgba(168,140,255,.35);border-radius:22px;background:radial-gradient(circle at 78% -8%,rgba(168,140,255,.17),transparent 36%),var(--b);color:var(--t);box-shadow:0 20px 70px rgba(0,0,0,.22)}.pz-lab *{box-sizing:border-box}.pz-head{display:flex;justify-content:space-between;gap:1rem;padding:.4rem .35rem 1rem}.pz-head span{font:700 .7rem ui-monospace,monospace;letter-spacing:.16em;color:var(--a)}.pz-head h2{margin:.12rem 0 .25rem;color:var(--t);font-size:clamp(1.35rem,3vw,2rem)}.pz-head p{margin:0;color:var(--m)}.pz-head button,.pz-tabs button{border:1px solid var(--l);border-radius:11px;background:var(--c);color:var(--t);padding:.65rem .5rem;cursor:pointer;font-weight:700;min-height:44px}.pz-tabs{display:grid;grid-template-columns:repeat(4,1fr);gap:.45rem;margin-bottom:.8rem}.pz-tabs button[aria-selected=true]{border-color:var(--a);background:rgba(73,225,199,.13);color:#c7fff5}.pz-panel{padding:1rem;border:1px solid var(--l);border-radius:16px;background:linear-gradient(160deg,rgba(17,34,55,.97),rgba(7,15,27,.98))}.pz-controls{display:grid;grid-template-columns:repeat(3,1fr);gap:.8rem;margin-bottom:1rem}.pz-controls label{display:flex;flex-direction:column;gap:.35rem;color:var(--m);font-size:.82rem;font-weight:700}.pz-controls output{color:var(--t)}.pz-controls input{width:100%;accent-color:var(--a)}.pz-controls select{border:1px solid var(--l);border-radius:9px;background:#081522;color:var(--t);padding:.55rem}.pz-lab canvas{display:block;width:100%;height:auto;min-height:235px;border:1px solid rgba(92,146,183,.25);border-radius:13px;background:#07101b}.pz-readout{margin-top:.8rem;padding:.82rem 1rem;border-left:3px solid var(--a);border-radius:8px;background:rgba(73,225,199,.07);font-variant-numeric:tabular-nums}.pz-readout b{color:#bffff4}@media(max-width:760px){.pz-tabs{grid-template-columns:repeat(2,1fr)}.pz-controls{grid-template-columns:repeat(2,1fr)}}@media(max-width:480px){.pz-lab{padding:.65rem}.pz-head{display:block}.pz-head button{margin-top:.7rem}.pz-panel{padding:.7rem}.pz-lab canvas{min-height:220px}}
</style>

<script>
(() => {
  const root=document.getElementById('pz-lab');if(!root||root.dataset.ready)return;root.dataset.ready='1';const q=s=>root.querySelector(s),qa=s=>Array.from(root.querySelectorAll(s)),val=k=>{const e=q('[data-key="'+k+'"]');return e.type==='range'?Number(e.value):e.value;},out=(k,v)=>{const e=q('[data-out="'+k+'"]');if(e)e.textContent=v;},fmt=(n,d=2)=>Number.isFinite(n)?n.toFixed(d):'∞';
  const prep=n=>{const c=q('[data-canvas="'+n+'"]'),x=c.getContext('2d');x.clearRect(0,0,c.width,c.height);x.lineCap='round';x.lineJoin='round';return {x,w:c.width,h:c.height};},text=(x,s,a,b,col='#a2b3c8',z=18,al='left')=>{x.fillStyle=col;x.font=z+'px system-ui';x.textAlign=al;x.fillText(s,a,b);},grid=(x,a,b,c,d,xt=5,yt=4)=>{x.strokeStyle='rgba(120,154,184,.18)';x.lineWidth=1;for(let i=0;i<=xt;i++){let p=a+(c-a)*i/xt;x.beginPath();x.moveTo(p,b);x.lineTo(p,d);x.stroke();}for(let i=0;i<=yt;i++){let p=b+(d-b)*i/yt;x.beginPath();x.moveTo(a,p);x.lineTo(c,p);x.stroke();}x.strokeStyle='#45617b';x.strokeRect(a,b,c-a,d-b);},line=(x,fn,a,b,c,d,t0,t1,v0,v1,col,lw=4,n=360)=>{x.strokeStyle=col;x.lineWidth=lw;x.beginPath();for(let i=0;i<=n;i++){let t=t0+(t1-t0)*i/n,v=Math.max(v0,Math.min(v1,fn(t))),px=a+(c-a)*i/n,py=d-(v-v0)/(v1-v0)*(d-b);i?x.lineTo(px,py):x.moveTo(px,py);}x.stroke();};
  const poles=(wn,z)=>z<1?[{re:-z*wn,im:wn*Math.sqrt(1-z*z)},{re:-z*wn,im:-wn*Math.sqrt(1-z*z)}]:[{re:-z*wn+wn*Math.sqrt(z*z-1),im:0},{re:-z*wn-wn*Math.sqrt(z*z-1),im:0}];
  const step=(t,wn,z)=>{if(z<.9999){let r=Math.sqrt(1-z*z),wd=wn*r;return 1-Math.exp(-z*wn*t)*(Math.cos(wd*t)+z/r*Math.sin(wd*t));}if(z<1.0001)return 1-Math.exp(-wn*t)*(1+wn*t);let p=poles(wn,z),a=p[0].re,b=p[1].re;return 1+(b*Math.exp(a*t)-a*Math.exp(b*t))/(a-b);};
  const impulse=(t,wn,z)=>{if(z<.9999){let wd=wn*Math.sqrt(1-z*z);return wn*wn/wd*Math.exp(-z*wn*t)*Math.sin(wd*t);}if(z<1.0001)return wn*wn*t*Math.exp(-wn*t);let p=poles(wn,z),a=p[0].re,b=p[1].re;return wn*wn/(a-b)*(Math.exp(a*t)-Math.exp(b*t));};
  let current='map';
  function drawMap(){const wn=val('mwn'),z=val('mz'),a=val('ma'),o=prep('map'),x=o.x,p=poles(wn,z);out('mwn',fmt(wn,1)+' rad/s');out('mz',fmt(z,2));out('ma',fmt(a,1));const L=35,R=340,T=55,B=420,cx=(L+R)/2,cy=(T+B)/2,sc=22;grid(x,L,T,R,B,4,4);x.strokeStyle='#788ba0';x.beginPath();x.moveTo(L,cy);x.lineTo(R,cy);x.moveTo(cx,T);x.lineTo(cx,B);x.stroke();p.forEach(v=>{let px=cx+v.re*sc,py=cy-v.im*sc;x.strokeStyle='#ff7396';x.lineWidth=5;x.beginPath();x.moveTo(px-8,py-8);x.lineTo(px+8,py+8);x.moveTo(px+8,py-8);x.lineTo(px-8,py+8);x.stroke();});let zx=cx-a*sc;x.strokeStyle='#49e1c7';x.lineWidth=4;x.beginPath();x.arc(zx,cy,9,0,Math.PI*2);x.stroke();text(x,'s 平面',L,30,'#edf5ff',21);const A=405,C=925;grid(x,A,45,C,220,5,4);line(x,t=>step(t,wn,z)+impulse(t,wn,z)/a,A,45,C,220,0,Math.max(5,8/wn*(1+z)),-.1,2.1,'#57c7ff',4);text(x,'含零点的阶跃响应（直流增益 1）',A,27,'#edf5ff',20);grid(x,A,285,C,420,5,3);const mag=w=>wn*wn/a*Math.hypot(w,a)/Math.sqrt((wn*wn-w*w)*(wn*wn-w*w)+(2*z*wn*w)*(2*z*wn*w));let mm=.1;for(let i=0;i<200;i++)mm=Math.max(mm,Math.min(5,mag(3*wn*i/199)));line(x,r=>mag(r*wn),A,285,C,420,0,3,0,mm*1.08,'#ffbd59',4);text(x,'频率响应形状',A,267,'#edf5ff',20);q('[data-readout=map]').innerHTML='极点：<b>'+p.map(v=>fmt(v.re)+(v.im>=0?'+':'')+fmt(v.im)+'j').join('，')+'</b>；零点：<b>−'+fmt(a)+'</b>。频率响应是在虚轴上比较探针到零点与极点的距离比。';}
  function drawBode(){const wp=val('bp'),wz=val('bz'),K=val('bk'),o=prep('bode'),x=o.x;out('bp',fmt(wp,1));out('bz',fmt(wz,1));out('bk',fmt(K,1));const L=65,R=925;grid(x,L,45,R,220,6,4);grid(x,L,280,R,395,6,4);const w=u=>.1*Math.pow(1000,u),mag=u=>20*Math.log10(K*Math.sqrt(1+(w(u)/wz)**2)/Math.sqrt(1+(w(u)/wp)**2)),ph=u=>(Math.atan(w(u)/wz)-Math.atan(w(u)/wp))*180/Math.PI;let lo=1e9,hi=-1e9;for(let i=0;i<=200;i++){let v=mag(i/200);lo=Math.min(lo,v);hi=Math.max(hi,v);}if(hi-lo<20){hi+=10;lo-=10;}line(x,mag,L,45,R,220,0,1,lo,hi,'#57c7ff',4);line(x,ph,L,280,R,395,0,1,-100,100,'#49e1c7',4);text(x,'20log₁₀|H(jω)| / dB',L,28,'#edf5ff',20);text(x,'相位 / °',L,263,'#edf5ff',20);text(x,'0.1',L,418);text(x,'100 rad/s',R,418,'#a2b3c8',17,'right');q('[data-readout=bode]').innerHTML='一阶极点在 ωₚ 后贡献约 <b>−20 dB/dec</b> 和 −90°；一阶左半平面零点在 ω𝓏 后贡献约 <b>+20 dB/dec</b> 和 +90°。真实曲线在转折频率附近平滑过渡。';}
  function closedPoles(a,K){let d=a*a-4*K;if(d>=0)return [{re:(-a+Math.sqrt(d))/2,im:0},{re:(-a-Math.sqrt(d))/2,im:0}];return [{re:-a/2,im:Math.sqrt(-d)/2},{re:-a/2,im:-Math.sqrt(-d)/2}];}
  function drawLocus(){const a=val('la'),K=val('lk'),tc=val('lt'),o=prep('locus'),x=o.x,p=closedPoles(a,K);out('la',fmt(a,1));out('lk',fmt(K,1));out('lt',fmt(tc,1)+' s');const L=45,R=430,T=50,B=380,cx=R-55,cy=(T+B)/2,sc=42;grid(x,L,T,R,B,5,4);x.strokeStyle='#788ba0';x.beginPath();x.moveTo(L,cy);x.lineTo(R,cy);x.moveTo(cx,T);x.lineTo(cx,B);x.stroke();x.strokeStyle='rgba(255,189,89,.8)';x.lineWidth=3;x.beginPath();for(let i=0;i<=220;i++){let pp=closedPoles(a,16*i/220)[0],px=cx+pp.re*sc,py=cy-pp.im*sc;i?x.lineTo(px,py):x.moveTo(px,py);}x.stroke();p.forEach(v=>{let px=cx+v.re*sc,py=cy-v.im*sc;x.strokeStyle='#ff7396';x.lineWidth=5;x.beginPath();x.moveTo(px-8,py-8);x.lineTo(px+8,py+8);x.moveTo(px+8,py-8);x.lineTo(px-8,py+8);x.stroke();});text(x,'闭环极点随 K 的轨迹',L,28,'#edf5ff',20);const A=505,C=925;grid(x,A,T,C,B,5,4);const wn=Math.sqrt(Math.max(K,.0001)),z=a/(2*wn);line(x,t=>K===0?0:step(t,wn,z),A,T,C,B,0,10,-.1,2.1,'#57c7ff',4);let y=K===0?0:step(tc,wn,z),px=A+(C-A)*tc/10,py=B-(y+.1)/2.2*(B-T);x.fillStyle='#ffbd59';x.beginPath();x.arc(px,py,7,0,Math.PI*2);x.fill();text(x,'闭环阶跃响应',A,28,'#edf5ff',20);q('[data-readout=locus]').innerHTML='闭环特征方程为 <b>s²+a s+K=0</b>。当前极点 '+p.map(v=>fmt(v.re)+(v.im>=0?'+':'')+fmt(v.im)+'j').join('，')+'。增加 K 会把两个实极点推到一起，再分裂成共轭复极点。';}
  function drawRhp(){const side=val('rside'),a=val('ra'),tau=val('rtau'),o=prep('rhp'),x=o.x;out('ra',fmt(a,2));out('rtau',fmt(tau,2)+' s');const L=60,R=925,T=48,B=355;grid(x,L,T,R,B,7,4);const zero=side==='right'?a:-a;const y=t=>{let u=t/tau,C=side==='right'?-(1+1/(a*tau)):(-1+1/(a*tau));return 1-Math.exp(-u)+C*u*Math.exp(-u);};line(x,y,L,T,R,B,0,8*tau,-1.4,1.6,side==='right'?'#ff7396':'#49e1c7',5);x.strokeStyle='#788ba0';x.setLineDash([8,7]);x.beginPath();let yy=B-(1+1.4)/3*(B-T);x.moveTo(L,yy);x.lineTo(R,yy);x.stroke();x.setLineDash([]);text(x,'单位阶跃响应',L,28,'#edf5ff',21);q('[data-readout=rhp]').innerHTML='零点位于 <b>s='+(zero>=0?'+':'')+fmt(zero)+'</b>。'+(side==='right'?'右半平面零点产生初始反向运动，但最终值仍为 1；它增加相位滞后，不能用稳定因果逆系统抵消。':'左半平面零点通常不会产生这种逆响应，并贡献相位超前。');}
  function draw(){if(current==='map')drawMap();if(current==='bode')drawBode();if(current==='locus')drawLocus();if(current==='rhp')drawRhp();}function show(n){current=n;qa('[data-view]').forEach(b=>b.setAttribute('aria-selected',String(b.dataset.view===n)));qa('[data-panel]').forEach(p=>p.hidden=p.dataset.panel!==n);draw();}const defs={};qa('input,select').forEach(e=>defs[e.dataset.key]=e.value);qa('[data-view]').forEach(b=>b.addEventListener('click',()=>show(b.dataset.view)));qa('input,select').forEach(e=>e.addEventListener('input',draw));q('[data-action=reset]').addEventListener('click',()=>{qa('input,select').forEach(e=>e.value=defs[e.dataset.key]);show(current);});show('map');
})();
</script>

### 第一章：距离就是增益，角度就是相位

令频率探针位于 $s=j\omega$。由因式分解形式可得

$$
\lvert H(j\omega)\rvert
=\lvert K\rvert
\frac{\prod_m\lvert j\omega-z_m\rvert}
{\prod_n\lvert j\omega-p_n\rvert}.
$$

探针靠近极点，分母距离变小，响应升高；靠近零点，分子距离变小，响应降低。各向量角度相加减，则给出总相位。

### 第二章：Bode 图是极点零点贡献的叠加

对一阶因子 $1+j\omega/\omega_c$，在 $\omega_c$ 以下幅度接近常数，在其上方斜率逐渐接近 $20\ \mathrm{dB/dec}$。因子在分子时贡献正斜率，在分母时贡献负斜率。

这使复杂系统可以拆成若干简单积木：常数增益、原点极点、一阶极点零点和二阶共轭对。

### 第三章：根轨迹展示反馈如何移动极点

反馈不只是改变增益，也会改变闭环分母。对

$$
L(s)=\frac{K}{s(s+a)},
$$

单位负反馈的闭环特征方程为

$$
s^2+a s+K=0.
$$

随着 $K$ 改变，闭环极点沿确定路径移动。根轨迹把“调参数”直接翻译成“移动自然模式”。

### 第四章：稳定并不等于好控制

右半平面零点不会直接让稳定系统变得不稳定，却会制造非最小相位行为：输出可能先朝目标反方向运动，再回头接近稳态。它还限制可实现的控制带宽。

近似的极零抵消也必须谨慎。模型中完全重合的因子看似消失，但真实器件误差会留下隐藏的慢模式或不稳定模式。

#### 工程检查清单

- 先看极点是否位于稳定区域；
- 再看极点离稳定边界有多远；
- 检查零点是否在右半平面；
- 将 Bode 峰值和时间域超调对应起来；
- 不把名义极零抵消当成物理模式真的消失。

---

<span id="part-dft"></span>

## 第五部分：DFT——计算机如何看见有限长度的频率

> 目标：理解采样、混叠、DFT 频点、窗函数、频谱泄漏与零填充。

> 衔接：前四部分主要使用连续时间模型；DFT 把 Fourier 投影落到有限个样本与有限个频率坐标上，也把测量误差的来源暴露出来。

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

### 第一章：采样让频率变成等价类

采样时刻 $t=nT_s$ 上，

$$
e^{j2\pi(f+m f_s)nT_s}=e^{j2\pi f nT_s},
\qquad m\in\mathbb Z.
$$

相差整数倍采样率的连续频率，会产生完全相同的离散样本。将频率折叠到 $[-f_s/2,f_s/2)$ 后得到可观察的数字频率；超过 Nyquist 频率的分量若未被模拟抗混叠滤波器压低，就会伪装成低频。

### 第二章：DFT 是有限维的换基

DFT 定义为

$$
X[k]=\sum_{n=0}^{N-1}x[n]e^{-j2\pi kn/N},
\qquad k=0,\ldots,N-1.
$$

这可以写成一个 $N\times N$ 复矩阵乘以长度为 $N$ 的向量。不同 $k$ 对应在 $N$ 个样本中恰好转过整数圈数的基向量，因此彼此正交。

### 第三章：频谱泄漏来自有限记录的边界

DFT 隐含地把这 $N$ 个样本周期重复。若记录首尾接不上，周期延拓会出现跳变；跳变需要许多频率共同表达，于是单个正弦的能量散到多个 bin。

窗函数在边界处逐渐压低信号，减少跳变和远处旁瓣，代价是主瓣变宽、幅度标定改变。选择窗函数是在“分开近邻频率”和“看见弱小频率”之间做权衡。

### 第四章：零填充不会创造信息

把 $N$ 点记录后面补零到 $M>N$，相当于在同一个离散时间 Fourier 变换曲线上取更多频率样本。谱峰位置看起来更平滑，但两个频率能否真正分开，仍由有效记录长度、信噪比和窗函数决定。

FFT 也不会改变 DFT 的答案。它只是利用对称和周期结构，把直接计算的复杂度从约 $N^2$ 降到约 $N\log_2N$。

#### 实际分析顺序

1. 先确认采样率与模拟抗混叠滤波；
2. 再选择记录长度和窗函数；
3. 根据窗的 coherent gain 修正幅度；
4. 区分 bin 间距、主瓣宽度和估计精度；
5. 最后才考虑零填充与绘图美观度。

---

<span id="part-z"></span>

## 第六部分：Z 变换——把同一套思想带入离散系统

> 目标：理解离散复指数、单位圆、Z 平面收敛域、差分方程与数字滤波器。

> 衔接：DFT 只取单位圆上的有限采样点；Z 变换把探针移到整个复平面，于是离散系统也获得了收敛域、极点零点和稳定性地图。

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

### 第一章：离散系统的自然模式是 \(z^n\)

连续复指数在相邻采样时刻的比值固定；离散后可直接写成

$$
x[n]=z^n=r^n e^{j\omega n}.
$$

若一个 LTI 差分系统输入 $z^n$，稳态输出仍是同一个 $z^n$，只乘上一个复数。这正是它成为离散系统“特征向量”的原因。

### 第二章：Z 变换把半径也纳入扫描

双边 Z 变换定义为

$$
X(z)=\sum_{n=-\infty}^{\infty}x[n]z^{-n}.
$$

在单位圆 $z=e^{j\omega}$ 上，它退化为离散时间 Fourier 变换。离开单位圆后，半径提供指数加权，使某些原本发散的序列在特定环形区域内收敛。

和 Laplace 变换一样，代数式必须和 ROC 一起给出。右边序列的 ROC 通常在最外极点之外；左边序列通常在最内极点之内；双边序列可能形成两个极点之间的圆环。

### 第三章：差分方程变成 \(z\) 的代数式

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

### 第四章：在单位圆上读取数字滤波器

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

#### 需要区分的三个对象

- DFT：有限长度向量的 $N$ 个频率坐标；
- DTFT：离散序列在整个单位圆上的连续频率函数；
- Z 变换：把单位圆扩展为复平面，并附带收敛域。

---

## 最后的统一视图

| 对象 | 连续时间 | 离散时间 |
|---|---|---|
| 自然模式 | $e^{st}$ | $z^n$ |
| 只看稳定振荡 | Fourier：$s=j\omega$ | DTFT：$z=e^{j\omega}$ |
| 扩展到增长/衰减 | Laplace 平面 | Z 平面 |
| 系统记忆 | 卷积 $x*h$ | 卷积和 $x*h$ |
| 系统描述 | $H(s)$ 的极点零点 | $H(z)$ 的极点零点 |
| 稳定边界 | 虚轴 | 单位圆 |
| 计算机中的有限表示 | 采样后的近似 | DFT / FFT |

最值得带走的不是六张变换表，而是三个判断顺序：

1. 先问信号和系统的自然模式是什么；
2. 再问积分或级数在哪里真正收敛；
3. 最后用极点零点、幅度和相位解释实际响应。

Fourier、Laplace 和 Z 变换不是彼此竞争的工具。它们是在不同时间模型、不同收敛条件和不同计算条件下，对同一套线性结构的观察。

---

### 主要参考与延伸阅读

- [3Blue1Brown：But what is the Fourier Transform?](https://www.3blue1brown.com/lessons/fourier-transforms/)
- [3Blue1Brown：But what is a convolution?](https://www.3blue1brown.com/lessons/convolutions/)
- [3Blue1Brown：The Physics of Euler’s Formula — Laplace Transform Prelude](https://www.3blue1brown.com/lessons/complex-exponents/)
- [3Blue1Brown：But what is a Laplace Transform?](https://www.3blue1brown.com/lessons/laplace-transform/)
- [3Blue1Brown：Why Laplace transforms are so useful](https://www.3blue1brown.com/lessons/laplace-for-odes/)
- [3Blue1Brown：What is a Discrete Fourier Transform?](https://www.3blue1brown.com/lessons/discrete-fourier-transform/)

> 本文参考上述课程的视觉化教学思路，重新面向信号与系统组织；文字、图形和交互实现均为独立创作。
