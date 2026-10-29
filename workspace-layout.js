/* Bounded timeline resizing; keep at least half of the editor for the canvas. */
(()=>{
 const panel=$('timeline'),handle=$('timelineResize'),main=panel.parentElement;
 let requested=210,drag=null;try{const value=Number(localStorage.getItem('vps-timeline-height'));if(value>=130)requested=value}catch{}
 function limits(){const available=Math.max(0,main.clientHeight-$('documentTabs').offsetHeight-main.querySelector('.bar').offsetHeight);const max=Math.max(0,Math.min(main.clientHeight*.45,available*.5));return {min:Math.min(140,max),max}}
 function apply(value){const {min,max}=limits(),height=Math.max(min,Math.min(max,value));panel.style.setProperty('--timeline-height',height+'px');handle.setAttribute('aria-valuemin',String(Math.round(min)));handle.setAttribute('aria-valuemax',String(Math.round(max)));handle.setAttribute('aria-valuenow',String(Math.round(height)));return height}
 function save(){try{localStorage.setItem('vps-timeline-height',String(requested))}catch{}}
 handle.onpointerdown=e=>{if(e.button!==0)return;e.preventDefault();drag={y:e.clientY,height:panel.getBoundingClientRect().height,original:requested};handle.setPointerCapture(e.pointerId);document.body.classList.add('timeline-resizing')};
 handle.onpointermove=e=>{if(!drag)return;requested=apply(drag.height+drag.y-e.clientY)};
 function finish(cancel){if(!drag)return;if(cancel)requested=drag.original;drag=null;document.body.classList.remove('timeline-resizing');apply(requested);save()}
 handle.onpointerup=()=>finish(false);handle.onpointercancel=()=>finish(true);handle.onlostpointercapture=()=>finish(true);
 handle.ondblclick=()=>{requested=210;apply(requested);save()};
 handle.onkeydown=e=>{if(!['ArrowUp','ArrowDown','Home','End'].includes(e.key))return;e.preventDefault();const {min,max}=limits();requested=apply(e.key==='Home'?min:e.key==='End'?max:panel.getBoundingClientRect().height+(e.key==='ArrowUp'?1:-1)*(e.shiftKey?40:10));save()};
 new ResizeObserver(()=>apply(requested)).observe(main);apply(requested);
})();
