---
layout: post
title: "极点和零点如何塑造系统？从 s 平面到 Bode 图"
date: 2026-09-26 12:00:00 +0800
categories: [数学与工程]
tags: [极点零点, 传递函数, Bode图, 稳定性, 控制系统]
description: "用四个交互实验连接极点零点、频率响应、根轨迹、稳定性和非最小相位响应。"
math: true
toc: true
---

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

## 第一章：距离就是增益，角度就是相位

令频率探针位于 $s=j\omega$。由因式分解形式可得

$$
\lvert H(j\omega)\rvert
=\lvert K\rvert
\frac{\prod_m\lvert j\omega-z_m\rvert}
{\prod_n\lvert j\omega-p_n\rvert}.
$$

探针靠近极点，分母距离变小，响应升高；靠近零点，分子距离变小，响应降低。各向量角度相加减，则给出总相位。

## 第二章：Bode 图是极点零点贡献的叠加

对一阶因子 $1+j\omega/\omega_c$，在 $\omega_c$ 以下幅度接近常数，在其上方斜率逐渐接近 $20\ \mathrm{dB/dec}$。因子在分子时贡献正斜率，在分母时贡献负斜率。

这使复杂系统可以拆成若干简单积木：常数增益、原点极点、一阶极点零点和二阶共轭对。

## 第三章：根轨迹展示反馈如何移动极点

反馈不只是改变增益，也会改变闭环分母。对

$$
L(s)=\frac{K}{s(s+a)},
$$

单位负反馈的闭环特征方程为

$$
s^2+a s+K=0.
$$

随着 $K$ 改变，闭环极点沿确定路径移动。根轨迹把“调参数”直接翻译成“移动自然模式”。

## 第四章：稳定并不等于好控制

右半平面零点不会直接让稳定系统变得不稳定，却会制造非最小相位行为：输出可能先朝目标反方向运动，再回头接近稳态。它还限制可实现的控制带宽。

近似的极零抵消也必须谨慎。模型中完全重合的因子看似消失，但真实器件误差会留下隐藏的慢模式或不稳定模式。

### 工程检查清单

- 先看极点是否位于稳定区域；
- 再看极点离稳定边界有多远；
- 检查零点是否在右半平面；
- 将 Bode 峰值和时间域超调对应起来；
- 不把名义极零抵消当成物理模式真的消失。

---

### 延伸阅读

- [本系列：拉普拉斯变换到底在做什么？](/posts/laplace-transform-interactive-guide/)
- [本系列：卷积到底在算什么？](/posts/convolution-lti-interactive-guide/)

> 本文使用归一化低阶模型建立直觉；实际系统还需考虑延迟、非线性、未建模高频动态和参数不确定性。
