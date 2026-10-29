/* Palette-preserving transforms. RotSprite-style: 3 Scale2x passes, inverse mapping.
   RotoCodexAI is an experimental coverage sampler, not a trained AI model. */
function pixelScale2x(source,w,h){const out=new Uint32Array(w*h*4);for(let y=0;y<h;y++)for(let x=0;x<w;x++){const e=source[y*w+x],b=y?source[(y-1)*w+x]:e,d=x?source[y*w+x-1]:e,f=x<w-1?source[y*w+x+1]:e,g=y<h-1?source[(y+1)*w+x]:e,j=y*2*w*2+x*2;out[j]=d===b&&d!==g&&b!==f?d:e;out[j+1]=b===f&&b!==d&&f!==g?f:e;out[j+w*2]=g===d&&g!==f&&d!==b?d:e;out[j+w*2+1]=f===g&&f!==b&&g!==d?f:e}return out}
function pixelUpscale8(source,w,h){let data=source;for(let i=0;i<3;i++)data=pixelScale2x(data,w*2**i,h*2**i);return data}
function transformPixelSelection(source,sw,sh,base,width,height,t,method,cache){
 const out=base.slice(),cos=Math.cos(t.angle),sin=Math.sin(t.angle),halfW=t.w/2,halfH=t.h/2,extentX=Math.abs(cos*halfW)+Math.abs(sin*halfH),extentY=Math.abs(sin*halfW)+Math.abs(cos*halfH),x0=Math.max(0,Math.floor(t.cx-extentX)),x1=Math.min(width,Math.ceil(t.cx+extentX)),y0=Math.max(0,Math.floor(t.cy-extentY)),y1=Math.min(height,Math.ceil(t.cy+extentY));
 const exact=Math.abs(Math.sin(t.angle*2))<1e-8&&Math.abs(t.w-sw)<1e-8&&Math.abs(t.h-sh)<1e-8;
 const high=method!=='classic'&&!exact?(cache||pixelUpscale8(source,sw,sh)):null,factor=high?8:1,data=high||source,dw=sw*factor,dh=sh*factor;
 function sample(x,y){const dx=x-t.cx,dy=y-t.cy,sx=((dx*cos+dy*sin)/t.w+.5)*sw,sy=((-dx*sin+dy*cos)/t.h+.5)*sh;if(sx<0||sy<0||sx>=sw||sy>=sh)return 0;return data[Math.min(dh-1,Math.floor(sy*factor))*dw+Math.min(dw-1,Math.floor(sx*factor))]}
 for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++){let value=sample(x+.5,y+.5);if(method==='codex'&&!exact){const votes=new Map();for(let j=0;j<4;j++)for(let i=0;i<4;i++){const v=sample(x+(i+.5)/4,y+(j+.5)/4);votes.set(v,(votes.get(v)||0)+1)}let best=value,score=(votes.get(value)||0)+1.5;for(const [v,weight] of votes)if(weight>score){best=v;score=weight}value=best}if(value>>>24)out[y*width+x]=value}
 return out;
}

function selectionPivotPoint(t,pivot={u:.5,v:.5}){const x=(pivot.u-.5)*t.w,y=(pivot.v-.5)*t.h,c=Math.cos(t.angle),sin=Math.sin(t.angle);return {x:t.cx+c*x-sin*y,y:t.cy+sin*x+c*y}}
function selectionPivotFromWorld(t,p){const dx=p.x-t.cx,dy=p.y-t.cy,c=Math.cos(t.angle),sin=Math.sin(t.angle);return {u:.5+(c*dx+sin*dy)/t.w,v:.5+(-sin*dx+c*dy)/t.h}}
function rotateSelectionAroundPivot(t,pivot,angle){const anchor=selectionPivotPoint(t,pivot),delta=angle-t.angle,c=Math.cos(delta),sin=Math.sin(delta),dx=t.cx-anchor.x,dy=t.cy-anchor.y;return {...t,cx:anchor.x+c*dx-sin*dy,cy:anchor.y+sin*dx+c*dy,angle}}

if(typeof module!=='undefined')module.exports={pixelScale2x,pixelUpscale8,transformPixelSelection,selectionPivotPoint,selectionPivotFromWorld,rotateSelectionAroundPivot};
