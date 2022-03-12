var C=Object.defineProperty;var S=(u,e,t)=>e in u?C(u,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):u[e]=t;var n=(u,e,t)=>(S(u,typeof e!="symbol"?e+"":e,t),t);const v=function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const l of s)if(l.type==="childList")for(const d of l.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&i(d)}).observe(document,{childList:!0,subtree:!0});function t(s){const l={};return s.integrity&&(l.integrity=s.integrity),s.referrerpolicy&&(l.referrerPolicy=s.referrerpolicy),s.crossorigin==="use-credentials"?l.credentials="include":s.crossorigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function i(s){if(s.ep)return;s.ep=!0;const l=t(s);fetch(s.href,l)}};v();class f{constructor(e,t){n(this,"x");n(this,"y");if(e==null||t==null){this.x=0,this.y=0;return}if(e instanceof f)return this.x=e.x,this.y=e.y,this;this.x=e,this.y=t}equals(e){return this.x==e.x&&this.y==e.y}get clone(){return new f(this)}add(e,t){const i=this.clone;return i.x+=e,i.y+=t,i}}class w extends f{constructor(e,t){super(e,t);n(this,"isDown",!1)}}class m extends f{constructor(e,t){super(e,t);n(this,"renX");n(this,"renY");n(this,"mouseOver",!1);n(this,"isAlive",!1);this.renX=e*r.cellSize,this.renY=t*r.cellSize}update(){this.renX=this.x*r.cellSize,this.renY=this.y*r.cellSize}draw(){this.mouseOver&&!this.isAlive&&(o.fillStyle="grey",this.fillRect()),this.isAlive&&(o.fillStyle="black",this.fillRect()),o.strokeRect(this.renX,this.renY,r.cellSize,r.cellSize)}fillRect(){o.fillRect(this.renX,this.renY,r.cellSize,r.cellSize)}mouseIn(){this.mouseOver=!0}mouseOut(){this.mouseOver=!1}press(){return this.isAlive=!this.isAlive}kill(){this.isAlive=!1}release(){}}var a=document.getElementById("canv"),o=a.getContext("2d"),g=document.getElementById("settings"),y=document.getElementById("runSim"),p=document.getElementById("updateFrame"),k=document.getElementById("uFDisp"),x=document.getElementById("clearBtn");const c=class{constructor(){n(this,"cells",[]);n(this,"mouse",new w);n(this,"fps",0);n(this,"lastCellOn",new m(0,0));n(this,"currentCell",new m(0,0));n(this,"isSettingUp",this.mouse.y<25);n(this,"isRunning",!1);n(this,"frameTime",0);n(this,"lastFrameTime",Date.now());n(this,"tickCount",0);n(this,"maxTickCount",15);this.genCells(),g.style.height=`${25}px`,o.fillStyle="grey",x.onclick=()=>{this.cells.forEach(e=>e.forEach(t=>t.kill()))},y.oninput=()=>{this.isRunning=y.checked},p.oninput=()=>{this.maxTickCount=parseInt(p.value),k.innerHTML=`Update every ${p.value} frame${this.maxTickCount==1?"":"s"}`},document.onmousemove=e=>{if(this.mouse.x=e.clientX,this.mouse.y=e.clientY,this.isSettingUp=this.mouse.y<25,this.isSettingUp){g.style.display="block";return}else g.style.display="none";this.currentCell=this.getMouseCell(),this.currentCell.mouseIn(),this.currentCell.equals(this.lastCellOn)||this.lastCellOn.mouseOut(),this.lastCellOn=this.currentCell},document.onmousedown=()=>{this.isSettingUp||(this.mouse.isDown=!0,this.currentCell.press())},document.onmouseup=()=>{this.isSettingUp||(this.mouse.isDown=!1,this.currentCell.release())},document.onwheel=e=>{e.deltaY<0?c.cellSize+=1:c.cellSize-=1,this.genCells(!1),this.cullCells();for(let t=0;t<this.cells.length;t++)for(let i=0;i<this.cells[t].length;i++)this.cells[t][i].update()}}genCells(e=!0){for(let t=0;t<a.width/c.cellSize;t++)for(let i=0;i<a.height/c.cellSize;i++)this.cells[t]||(this.cells[t]=[]),!(!e&&this.cells[t][i]&&this.cells[t][i].isAlive)&&(this.cells[t][i]=new m(t,i))}cullCells(){var e,t;for(let i=0;i<((e=this.cells)==null?void 0:e.length);i++)for(let s=0;s<((t=this.cells[i])==null?void 0:t.length);s++)(i*c.cellSize>=innerWidth||s*c.cellSize>=innerHeight)&&this.cells[i].splice(s,1),this.cells[i].length==0&&this.cells.splice(i,1)}getMouseCell(){return this.cells[Math.floor(this.mouse.x/c.cellSize)][Math.floor(this.mouse.y/c.cellSize)]}async render(){o.clearRect(0,0,a.width,a.height),this.tickCount++,this.frameTime=Date.now()-this.lastFrameTime,this.lastFrameTime=Date.now(),this.fps=Math.floor(1e3/this.frameTime),o.strokeStyle="darkgrey";for(let e=0;e<this.cells.length;e++)for(let t=0;t<this.cells[e].length;t++)this.cells[e][t].draw();this.isRunning&&this.tickCount>=this.maxTickCount&&(this.tick(),this.tickCount=0),o.strokeStyle="black",o.fillText(`FPS: ${this.fps}`,20,20),o.strokeText(`FPS: ${this.fps}`,20,20),requestAnimationFrame(this.render)}tick(){let e=[];for(let t=0;t<this.cells.length;t++)for(let i=0;i<this.cells[t].length;i++){const s=this.cells[t][i],l=this.getCellsArround(t,i);if(l<2&&s.isAlive){e.push(s);continue}if(l>3&&s.isAlive&&e.push(s),l==3&&!s.isAlive){e.push(s);continue}}e.forEach(t=>t.press())}getCellsArround(e,t){let i=0;for(let s=-1;s<=1;s++)for(let l=-1;l<=1;l++)s==0&&l==0||this.cells[e+s]==null||this.cells[e+s][t+l]==null||this.cells[e+s][t+l].isAlive&&i++;return i}};let r=c;n(r,"cellSize",20);var h;(onresize=()=>{a.width=window.innerWidth,a.height=window.innerHeight,h==null||h.genCells(!1),o.font="20px Arial"})();h=new r;h.render=h.render.bind(h);h.render();window.game=h;