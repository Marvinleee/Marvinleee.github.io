/* Independent numerical teaching model. No pretrained weights. */
(function(root){
 'use strict';
 const dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0);
 const matmul=(a,b)=>a.map(row=>b[0].map((_,j)=>row.reduce((s,x,k)=>s+x*b[k][j],0)));
 const norm=x=>{const den=Math.sqrt(dot(x,x)/x.length+1e-6);return x.map(v=>v/den);};
 const add=(a,b)=>a.map((r,i)=>r.map((x,j)=>x+b[i][j]));
 const softmax=x=>{const m=Math.max(...x),e=x.map(v=>Math.exp(v-m)),s=e.reduce((a,b)=>a+b,0);return e.map(v=>v/s);};
 const rope=(v,p)=>[v[0]*Math.cos(p)-v[1]*Math.sin(p),v[0]*Math.sin(p)+v[1]*Math.cos(p)];
 const weights={q:[[.5,.2,-.3,.4],[.1,.6,.2,-.2],[-.4,.3,.7,.1],[.2,-.1,.3,.5]],k:[[.4,-.2],[.1,.5],[-.3,.2],[.6,.1]],v:[[.2,.4],[-.5,.1],[.3,-.2],[.1,.6]],o:[[.5,.1,0,-.2],[.2,.4,-.1,.3],[-.3,.2,.6,.1],[.1,-.2,.2,.5]],gate:[[.2,.1,-.3,.4,.5,-.1],[-.2,.4,.1,.3,-.1,.2],[.3,-.1,.5,-.2,.2,.4],[.1,.3,-.2,.1,.4,-.3]],up:[[.1,.3,.2,-.2,.1,.4],[.4,-.1,.3,.1,-.2,.2],[-.2,.2,.1,.5,.3,-.1],[.3,.1,-.4,.2,.1,.3]],down:[[.2,-.1,.3,.1],[.1,.2,-.2,.4],[-.3,.1,.2,.1],[.4,-.2,.1,.2],[.1,.3,.2,-.1],[-.2,.1,.4,.3]]};
 function run(opts={}){const {last=1,offset=0,causal=true,rotary=true,qknorm=true}=opts;
 const x=[[1,0,-1,.5],[.2,1,.3,-.5],[last,-.4,.7,.2]],n=x.map(norm),q=matmul(n,weights.q),k=matmul(n,weights.k),v=matmul(n,weights.v);
 const kh=k.map(r=>qknorm?norm(r):r),kr=kh.map((r,i)=>rotary?rope(r,i+offset):r);
 const heads=[0,1].map(h=>{const qh=q.map(r=>r.slice(h*2,h*2+2)),qn=qh.map(r=>qknorm?norm(r):r),qr=qn.map((r,i)=>rotary?rope(r,i+offset):r),scores=qr.map((r,i)=>kr.map((z,j)=>causal&&j>i?-Infinity:dot(r,z)/Math.sqrt(2))),p=scores.map(softmax),out=matmul(p,v);return {qh,qn,qr,scores,p,out};});
 const concat=x.map((_,i)=>heads.flatMap(h=>h.out[i])),attn=matmul(concat,weights.o),res=add(x,attn),n2=res.map(norm),g=matmul(n2,weights.gate),u=matmul(n2,weights.up),gate=g.map(r=>r.map(z=>z/(1+Math.exp(-z)))),product=gate.map((r,i)=>r.map((z,j)=>z*u[i][j])),mlp=matmul(product,weights.down),y=add(res,mlp);
 return {x,n,q,k,v,kh,kr,heads,concat,attn,res,n2,g,u,gate,product,mlp,y};}
 const api={run,weights,norm,rope,softmax,matmul};if(typeof module!=='undefined')module.exports=api;else root.LayerLab=api;
})(globalThis);
