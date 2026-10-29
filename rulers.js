/* View-only pixel rulers and draggable guides. Guide coordinates belong to each open document. */
(()=>{
 const viewport=canvas.closest('.viewport'),stage=$('stage'),button=$('toggleRulers');
 const style=document.createElement('style');style.textContent=`
 .pixel-ruler{position:absolute;background:#23262e;z-index:8;touch-action:none;cursor:crosshair;image-rendering:auto}
 .pixel-ruler-top{left:24px;top:0;width:calc(100% - 24px);height:24px;border-bottom:1px solid #4a505c}
 .pixel-ruler-left{left:0;top:24px;width:24px;height:calc(100% - 24px);border-right:1px solid #4a505c}
 .ruler-origin{position:absolute;left:0;top:0;width:24px;height:24px;background:#303540;color:#aeb7c6;z-index:9;font:9px system-ui;display:grid;place-items:center}
 .pixel-guides{position:absolute;inset:24px 0 0 24px;pointer-events:none;z-index:7;overflow:hidden}
 .pixel-guide{position:absolute;background:none;border:0;border-radius:0;padding:0;pointer-events:auto;touch-action:none;box-shadow:none}
 .pixel-guide:hover{filter:none}.pixel-guide::after{content:'';position:absolute;background:#43dce8;box-shadow:0 0 1px #062d36}
 .pixel-guide-x{width:9px;height:100%;top:0;cursor:ew-resize;transform:translateX(-4px)}.pixel-guide-x::after{left:4px;top:0;width:1px;height:100%}
 .pixel-guide-y{height:9px;width:100%;left:0;cursor:ns-resize;transform:translateY(-4px)}.pixel-guide-y::after{top:4px;left:0;height:1px;width:100%}
 .pixel-ruler[hidden],.ruler-origin[hidden],.pixel-guides[hidden]{display:none}
 `;document.head.append(style);
 const top=document.createElement('canvas'),left=document.createElement('canvas'),corner=document.createElement('div'),overlay=document.createElement('div');
 top.className='pixel-ruler pixel-ruler-top';left.className='pixel-ruler pixel-ruler-left';corner.className='ruler-origin';corner.textContent='px';overlay.className='pixel-guides';
 top.setAttribute('aria-label','Regla horizontal: arrastra para crear una guía horizontal');left.setAttribute('aria-label','Regla vertical: arrastra para crear una guía vertical');
 top.title='Arrastra para crear una guía horizontal';left.title='Arrastra para crear una guía vertical';corner.title='Guías: arrastra para mover; doble clic o arrastra fuera para eliminar';
 viewport.append(overlay,top,left,corner);
 let visible=false,queued=false,drag=null;const documentsGuides=new Map();
 function guides(){const key=currentDocument()?.id??0;if(!documentsGuides.has(key))documentsGuides.set(key,[]);return documentsGuides.get(key)}
 function geometry(){const v=viewport.getBoundingClientRect(),c=canvas.getBoundingClientRect();return {v,x:c.left-v.left,y:c.top-v.top}}
 function tickStep(scale){const target=48/scale;return [1,2,5,10,20,50,100,200,500,1000].find(v=>v>=target)||1000}
 function drawRuler(el,axis,g){const length=Math.max(1,Math.round(axis==='x'?viewport.clientWidth-24:viewport.clientHeight-24)),ratio=window.devicePixelRatio||1;el.width=Math.round((axis==='x'?length:24)*ratio);el.height=Math.round((axis==='x'?24:length)*ratio);const ctx=el.getContext('2d');ctx.scale(ratio,ratio);ctx.fillStyle='#23262e';ctx.fillRect(0,0,axis==='x'?length:24,axis==='x'?24:length);ctx.font='9px system-ui';ctx.fillStyle='#bbc2d0';ctx.strokeStyle='#7d8797';const origin=(axis==='x'?g.x:g.y)-24,step=tickStep(zoom),minor=step/5;const first=Math.floor(-origin/zoom/minor);const last=Math.ceil((length-origin)/zoom/minor);for(let i=first;i<=last;i++){const value=i*minor,pos=Math.round(origin+value*zoom)+.5,major=i%5===0;ctx.beginPath();if(axis==='x'){ctx.moveTo(pos,24);ctx.lineTo(pos,major?14:20);if(major)ctx.fillText(String(Math.round(value*100)/100),pos+3,10)}else{ctx.moveTo(24,pos);ctx.lineTo(major?14:20,pos);if(major){ctx.save();ctx.translate(10,pos+3);ctx.rotate(-Math.PI/2);ctx.fillText(String(Math.round(value*100)/100),0,0);ctx.restore()}}ctx.stroke()}}
 function render(){queued=false;[top,left,corner,overlay].forEach(el=>el.hidden=!visible);button.classList.toggle('active',visible);button.setAttribute('aria-pressed',String(visible));if(!visible)return;const g=geometry();drawRuler(top,'x',g);drawRuler(left,'y',g);overlay.replaceChildren();for(const guide of guides()){const el=document.createElement('button');el.type='button';el.className='pixel-guide pixel-guide-'+guide.axis;el.style[guide.axis==='x'?'left':'top']=((guide.axis==='x'?g.x:g.y)-24+guide.value*zoom)+'px';el.title=(guide.axis==='x'?'X: ':'Y: ')+guide.value+' px · Doble clic para eliminar';el.setAttribute('aria-label',el.title);el.onpointerdown=e=>start(e,guide);el.ondblclick=()=>{const list=guides();list.splice(list.indexOf(guide),1);schedule()};overlay.append(el)}}
 function schedule(){if(!queued){queued=true;requestAnimationFrame(render)}}
 function coordinate(e,axis){const rect=canvas.getBoundingClientRect();return Math.round(((axis==='x'?e.clientX-rect.left:e.clientY-rect.top))/zoom)}
 function start(e,guide){if(e.button!==0)return;e.preventDefault();e.stopPropagation();const list=guides();drag={guide,list,original:guide.value,fresh:!list.includes(guide)};if(drag.fresh)list.push(guide);guide.value=coordinate(e,guide.axis);viewport.setPointerCapture(e.pointerId);schedule()}
 top.onpointerdown=e=>start(e,{axis:'y',value:0});left.onpointerdown=e=>start(e,{axis:'x',value:0});
 viewport.addEventListener('pointermove',e=>{if(!drag)return;e.preventDefault();e.stopPropagation();drag.guide.value=coordinate(e,drag.guide.axis);schedule()},true);
 function finish(e,cancel=false){if(!drag)return;const d=drag;drag=null;const r=viewport.getBoundingClientRect(),outside=e.clientX<r.left+24||e.clientY<r.top+24||e.clientX>r.right||e.clientY>r.bottom;if(cancel){if(d.fresh)d.list.splice(d.list.indexOf(d.guide),1);else d.guide.value=d.original}else if(outside)d.list.splice(d.list.indexOf(d.guide),1);if(viewport.hasPointerCapture(e.pointerId))viewport.releasePointerCapture(e.pointerId);schedule()}
 viewport.addEventListener('pointerup',e=>{if(drag){e.preventDefault();e.stopPropagation();finish(e)}},true);viewport.addEventListener('pointercancel',e=>finish(e,true));viewport.addEventListener('lostpointercapture',e=>{if(drag)finish(e,true)});
 button.onclick=()=>{visible=!visible;schedule()};stage.addEventListener('scroll',schedule);new ResizeObserver(schedule).observe(viewport);
 const oldSizing=sizing;sizing=function(){oldSizing();schedule()};const oldPan=applyPan;applyPan=function(){oldPan();schedule()};render();
})();
