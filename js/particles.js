const canvas=document.querySelector('#particleCanvas');
if(canvas){
  const ctx=canvas.getContext('2d'); let mode='solid', particles=[], raf;
  function resize(){const r=canvas.getBoundingClientRect(); const dpr=Math.min(devicePixelRatio||1,2); canvas.width=r.width*dpr;canvas.height=r.height*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);reset();}
  function reset(){const w=canvas.clientWidth,h=canvas.clientHeight;particles=[]; const n=45;
    if(mode==='solid'){const cols=9, spacing=Math.min((w-80)/cols,34); for(let i=0;i<n;i++){let c=i%cols,row=Math.floor(i/cols);particles.push({x:w/2-(cols-1)*spacing/2+c*spacing,y:h*.60+row*spacing*.72,vx:0,vy:0,ox:0,oy:0,phase:Math.random()*6.28});}}
    else {for(let i=0;i<n;i++) particles.push({x:35+Math.random()*(w-70),y:mode==='liquid'?h*.55+Math.random()*(h*.35):35+Math.random()*(h-70),vx:(Math.random()-.5)*(mode==='gas'?2.3:.8),vy:(Math.random()-.5)*(mode==='gas'?2.3:.8)});}
  }
  function draw(){const w=canvas.clientWidth,h=canvas.clientHeight;ctx.clearRect(0,0,w,h); ctx.strokeStyle='rgba(130,200,245,.28)';ctx.strokeRect(18,18,w-36,h-36);
    particles.forEach((p,i)=>{if(mode==='solid'){p.phase+=.08;p.ox=Math.sin(p.phase+i)*1.7;p.oy=Math.cos(p.phase*1.1+i)*1.4;}else{p.x+=p.vx;p.y+=p.vy;if(p.x<28||p.x>w-28)p.vx*=-1;if(p.y<28||p.y>h-28)p.vy*=-1;if(mode==='liquid'&&p.y<h*.50){p.y=h*.50+Math.random()*20;p.vy=Math.abs(p.vy);}}
      const x=mode==='solid'?p.x+p.ox:p.x,y=mode==='solid'?p.y+p.oy:p.y; const g=ctx.createRadialGradient(x-3,y-3,1,x,y,9);g.addColorStop(0,'#d9fbff');g.addColorStop(.45,'#57c8e5');g.addColorStop(1,'#1769aa');ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,8,0,Math.PI*2);ctx.fill();});raf=requestAnimationFrame(draw)}
  function setMode(m){mode=m;document.querySelectorAll('[data-state]').forEach(b=>b.classList.toggle('active',b.dataset.state===m));const data={solid:['Padat','Partikel sangat berdekatan dan hanya bergetar di sekitar posisi tetap.'],liquid:['Cair','Partikel tetap berdekatan, tetapi dapat berpindah posisi satu sama lain.'],gas:['Gas','Partikel berjauhan dan bergerak bebas memenuhi ruang tersedia.']};document.querySelector('#stateTitle').textContent=data[m][0];document.querySelector('#stateDesc').textContent=data[m][1];reset();}
  document.querySelectorAll('[data-state]').forEach(b=>b.addEventListener('click',()=>setMode(b.dataset.state)));window.addEventListener('resize',resize);resize();cancelAnimationFrame(raf);draw();
}
