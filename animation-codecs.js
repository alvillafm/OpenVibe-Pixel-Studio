function encodePixelGIF(width,height,frames,fps,durations){
 if(width<1||height<1||!frames.length)throw Error('Animación vacía.');const out=[];const byte=v=>out.push(v&255),word=v=>{byte(v);byte(v>>8)},text=s=>{for(const c of s)byte(c.charCodeAt(0))};
 text('GIF89a');word(width);word(height);byte(0xf7);byte(0);byte(0);for(let i=0;i<256;i++){let q=i-1;byte(i?Math.round(Math.floor(q/42)*255/5):0);byte(i?Math.round(Math.floor(q/6)%7*255/6):0);byte(i?Math.round(q%6*255/5):0)}
 byte(0x21);byte(0xff);byte(11);text('NETSCAPE2.0');byte(3);byte(1);word(0);byte(0);
 for(const [frameIndex,data] of frames.entries()){if(data.length!==width*height*4)throw Error('Tamaño de fotograma incorrecto.');byte(0x21);byte(0xf9);byte(4);byte(9);word(Math.max(2,Math.round((durations?.[frameIndex]||1000/fps)/10)));byte(0);byte(0);byte(0x2c);word(0);word(0);word(width);word(height);byte(0);byte(8);
  const packed=[];let bits=0,value=0,count=0;function code(v){value|=v<<bits;bits+=9;while(bits>=8){packed.push(value&255);value>>>=8;bits-=8}}code(256);
  for(let i=0;i<data.length;i+=4){if(count===100){code(256);count=0}const index=data[i+3]<128?0:1+Math.round(data[i]*5/255)*42+Math.round(data[i+1]*6/255)*6+Math.round(data[i+2]*5/255);code(index);count++}code(257);if(bits)packed.push(value&255);for(let i=0;i<packed.length;i+=255){byte(Math.min(255,packed.length-i));out.push(...packed.slice(i,i+255))}byte(0);
 }byte(0x3b);return new Uint8Array(out);
}
if(typeof module!=='undefined')module.exports={encodePixelGIF};
