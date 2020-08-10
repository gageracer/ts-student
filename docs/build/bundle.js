var app=function(){"use strict";function t(){}const n=t=>t;function e(t){return t()}function o(){return Object.create(null)}function r(t){t.forEach(e)}function s(t){return"function"==typeof t}function l(t,n){return t!=t?n==n:t!==n||t&&"object"==typeof t||"function"==typeof t}const i="undefined"!=typeof window;let c=i?()=>window.performance.now():()=>Date.now(),u=i?t=>requestAnimationFrame(t):t;const a=new Set;function f(t){a.forEach(n=>{n.c(t)||(a.delete(n),n.f())}),0!==a.size&&u(f)}function d(t,n){t.appendChild(n)}function h(t,n,e){t.insertBefore(n,e||null)}function g(t){t.parentNode.removeChild(t)}function p(t){return document.createElement(t)}function m(t){return document.createTextNode(t)}function $(){return m(" ")}function v(){return m("")}function b(t,n,e,o){return t.addEventListener(n,e,o),()=>t.removeEventListener(n,e,o)}function y(t,n,e){null==e?t.removeAttribute(n):t.getAttribute(n)!==e&&t.setAttribute(n,e)}function _(t,n){t.value=null==n?"":n}function w(t,n,e,o){t.style.setProperty(n,e,o?"important":"")}const k=new Set;let x,C=0;function E(t,n,e,o,r,s,l,i=0){const c=16.666/o;let u="{\n";for(let t=0;t<=1;t+=c){const o=n+(e-n)*s(t);u+=100*t+`%{${l(o,1-o)}}\n`}const a=u+`100% {${l(e,1-e)}}\n}`,f=`__svelte_${function(t){let n=5381,e=t.length;for(;e--;)n=(n<<5)-n^t.charCodeAt(e);return n>>>0}(a)}_${i}`,d=t.ownerDocument;k.add(d);const h=d.__svelte_stylesheet||(d.__svelte_stylesheet=d.head.appendChild(p("style")).sheet),g=d.__svelte_rules||(d.__svelte_rules={});g[f]||(g[f]=!0,h.insertRule(`@keyframes ${f} ${a}`,h.cssRules.length));const m=t.style.animation||"";return t.style.animation=`${m?m+", ":""}${f} ${o}ms linear ${r}ms 1 both`,C+=1,f}function S(t,n){const e=(t.style.animation||"").split(", "),o=e.filter(n?t=>t.indexOf(n)<0:t=>-1===t.indexOf("__svelte")),r=e.length-o.length;r&&(t.style.animation=o.join(", "),C-=r,C||u(()=>{C||(k.forEach(t=>{const n=t.__svelte_stylesheet;let e=n.cssRules.length;for(;e--;)n.deleteRule(e);t.__svelte_rules={}}),k.clear())}))}function V(t){x=t}const D=[],O=[],j=[],N=[],A=Promise.resolve();let P=!1;function F(t){j.push(t)}function L(t){N.push(t)}let R=!1;const I=new Set;function W(){if(!R){R=!0;do{for(let t=0;t<D.length;t+=1){const n=D[t];V(n),q(n.$$)}for(D.length=0;O.length;)O.pop()();for(let t=0;t<j.length;t+=1){const n=j[t];I.has(n)||(I.add(n),n())}j.length=0}while(D.length);for(;N.length;)N.pop()();P=!1,R=!1,I.clear()}}function q(t){if(null!==t.fragment){t.update(),r(t.before_update);const n=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,n),t.after_update.forEach(F)}}let z;function B(t,n,e){t.dispatchEvent(function(t,n){const e=document.createEvent("CustomEvent");return e.initCustomEvent(t,!1,!1,n),e}(`${n?"intro":"outro"}${e}`))}const J=new Set;let M;function T(){M={r:0,c:[],p:M}}function G(){M.r||r(M.c),M=M.p}function H(t,n){t&&t.i&&(J.delete(t),t.i(n))}function K(t,n,e,o){if(t&&t.o){if(J.has(t))return;J.add(t),M.c.push(()=>{J.delete(t),o&&(e&&t.d(1),o())}),t.o(n)}}const Q={duration:0};function U(e,o,l,i){let d=o(e,l),h=i?0:1,g=null,p=null,m=null;function $(){m&&S(e,m)}function v(t,n){const e=t.b-h;return n*=Math.abs(e),{a:h,b:t.b,d:e,duration:n,start:t.start,end:t.start+n,group:t.group}}function b(o){const{delay:s=0,duration:l=300,easing:i=n,tick:b=t,css:y}=d||Q,_={start:c()+s,b:o};o||(_.group=M,M.r+=1),g?p=_:(y&&($(),m=E(e,h,o,l,s,i,y)),o&&b(0,1),g=v(_,l),F(()=>B(e,o,"start")),function(t){let n;0===a.size&&u(f),new Promise(e=>{a.add(n={c:t,f:e})})}(t=>{if(p&&t>p.start&&(g=v(p,l),p=null,B(e,g.b,"start"),y&&($(),m=E(e,h,g.b,g.duration,0,i,d.css))),g)if(t>=g.end)b(h=g.b,1-h),B(e,g.b,"end"),p||(g.b?$():--g.group.r||r(g.group.c)),g=null;else if(t>=g.start){const n=t-g.start;h=g.a+g.d*i(n/g.duration),b(h,1-h)}return!(!g&&!p)}))}return{run(t){s(d)?(z||(z=Promise.resolve(),z.then(()=>{z=null})),z).then(()=>{d=d(),b(t)}):b(t)},end(){$(),g=p=null}}}function X(t,n,e){const o=t.$$.props[n];void 0!==o&&(t.$$.bound[o]=e,e(t.$$.ctx[o]))}function Y(t){t&&t.c()}function Z(t,n,o){const{fragment:l,on_mount:i,on_destroy:c,after_update:u}=t.$$;l&&l.m(n,o),F(()=>{const n=i.map(e).filter(s);c?c.push(...n):r(n),t.$$.on_mount=[]}),u.forEach(F)}function tt(t,n){const e=t.$$;null!==e.fragment&&(r(e.on_destroy),e.fragment&&e.fragment.d(n),e.on_destroy=e.fragment=null,e.ctx=[])}function nt(t,n){-1===t.$$.dirty[0]&&(D.push(t),P||(P=!0,A.then(W)),t.$$.dirty.fill(0)),t.$$.dirty[n/31|0]|=1<<n%31}function et(n,e,s,l,i,c,u=[-1]){const a=x;V(n);const f=e.props||{},d=n.$$={fragment:null,ctx:null,props:c,update:t,not_equal:i,bound:o(),on_mount:[],on_destroy:[],before_update:[],after_update:[],context:new Map(a?a.$$.context:[]),callbacks:o(),dirty:u,skip_bound:!1};let h=!1;if(d.ctx=s?s(n,f,(t,e,...o)=>{const r=o.length?o[0]:e;return d.ctx&&i(d.ctx[t],d.ctx[t]=r)&&(!d.skip_bound&&d.bound[t]&&d.bound[t](r),h&&nt(n,t)),e}):[],d.update(),h=!0,r(d.before_update),d.fragment=!!l&&l(d.ctx),e.target){if(e.hydrate){const t=function(t){return Array.from(t.childNodes)}(e.target);d.fragment&&d.fragment.l(t),t.forEach(g)}else d.fragment&&d.fragment.c();e.intro&&H(n.$$.fragment),Z(n,e.target,e.anchor),W()}V(a)}class ot{$destroy(){tt(this,1),this.$destroy=t}$on(t,n){const e=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return e.push(n),()=>{const t=e.indexOf(n);-1!==t&&e.splice(t,1)}}$set(t){var n;this.$$set&&(n=t,0!==Object.keys(n).length)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}const rt=[];function st(n,e=t){let o;const r=[];function s(t){if(l(n,t)&&(n=t,o)){const t=!rt.length;for(let t=0;t<r.length;t+=1){const e=r[t];e[1](),rt.push(e,n)}if(t){for(let t=0;t<rt.length;t+=2)rt[t][0](rt[t+1]);rt.length=0}}}return{set:s,update:function(t){s(t(n))},subscribe:function(l,i=t){const c=[l,i];return r.push(c),1===r.length&&(o=e(s)||t),l(n),()=>{const t=r.indexOf(c);-1!==t&&r.splice(t,1),0===r.length&&(o(),o=null)}}}}function lt(n){let e,o,r;return{c(){e=p("input"),w(e,"background-color",n[1]),w(e,"height",n[2]),y(e,"class","svelte-1fcro3k")},m(t,s){h(t,e,s),_(e,n[0]),o||(r=b(e,"input",n[3]),o=!0)},p(t,[n]){2&n&&w(e,"background-color",t[1]),4&n&&w(e,"height",t[2]),1&n&&e.value!==t[0]&&_(e,t[0])},i:t,o:t,d(t){t&&g(e),o=!1,r()}}}function it(t,n,e){let{inputVal:o}=n,{bgColor:r}=n,{height:s}=n;return t.$$set=t=>{"inputVal"in t&&e(0,o=t.inputVal),"bgColor"in t&&e(1,r=t.bgColor),"height"in t&&e(2,s=t.height)},[o,r,s,function(){o=this.value,e(0,o)}]}class ct extends ot{constructor(t){super(),et(this,t,it,lt,l,{inputVal:0,bgColor:1,height:2})}}function ut(t,{delay:e=0,duration:o=400,easing:r=n}){const s=+getComputedStyle(t).opacity;return{delay:e,duration:o,easing:r,css:t=>"opacity: "+t*s}}function at(t,n,e){const o=t.slice();return o[7]=n[e],o[8]=n,o[9]=e,o}function ft(t){let n,e,o,s,l,i,c,u,a=t[1],f=[];for(let n=0;n<a.length;n+=1)f[n]=ht(at(t,a,n));const d=t=>K(f[t],1,1,()=>{f[t]=null});return{c(){n=p("button"),n.textContent="Save Data",e=$(),o=p("button"),o.textContent="Fetch Data",s=$();for(let t=0;t<f.length;t+=1)f[t].c();l=v(),y(n,"class","svelte-5mnakf"),y(o,"class","svelte-5mnakf")},m(r,a){h(r,n,a),h(r,e,a),h(r,o,a),h(r,s,a);for(let t=0;t<f.length;t+=1)f[t].m(r,a);h(r,l,a),i=!0,c||(u=[b(n,"click",t[3]),b(o,"click",t[2])],c=!0)},p(t,n){if(2&n){let e;for(a=t[1],e=0;e<a.length;e+=1){const o=at(t,a,e);f[e]?(f[e].p(o,n),H(f[e],1)):(f[e]=ht(o),f[e].c(),H(f[e],1),f[e].m(l.parentNode,l))}for(T(),e=a.length;e<f.length;e+=1)d(e);G()}},i(t){if(!i){for(let t=0;t<a.length;t+=1)H(f[t]);i=!0}},o(t){f=f.filter(Boolean);for(let t=0;t<f.length;t+=1)K(f[t]);i=!1},d(t){t&&g(n),t&&g(e),t&&g(o),t&&g(s),function(t,n){for(let e=0;e<t.length;e+=1)t[e]&&t[e].d(n)}(f,t),t&&g(l),c=!1,r(u)}}}function dt(n){let e,o,r,s,l;return{c(){e=p("button"),e.textContent="Fetch Data",o=$(),r=p("p"),r.textContent="Fetch data to see it",y(e,"class","svelte-5mnakf")},m(t,i){h(t,e,i),h(t,o,i),h(t,r,i),s||(l=b(e,"click",n[2]),s=!0)},p:t,i:t,o:t,d(t){t&&g(e),t&&g(o),t&&g(r),s=!1,l()}}}function ht(t){let n,e,o,r,s,l,i,c,u,a,f,v,b,_,w,k,x,C,E,S,V,D,j,N,A,P,R,I,W=t[7].login+"";function q(n){t[4].call(null,n,t[7])}let z={height:"auto",bgColor:"#90caf9"};function B(n){t[5].call(null,n,t[7])}void 0!==t[7].login&&(z.inputVal=t[7].login),r=new ct({props:z}),O.push(()=>X(r,"inputVal",q));let J={height:"auto",bgColor:"#90caf9"};return void 0!==t[7].type&&(J.inputVal=t[7].type),u=new ct({props:J}),O.push(()=>X(u,"inputVal",B)),_=new ct({props:{inputVal:t[7].followers_url,height:"auto",bgColor:"#90caf9"}}),{c(){n=p("div"),e=p("div"),o=m("username: "),Y(r.$$.fragment),l=$(),i=p("div"),c=m("user-type: "),Y(u.$$.fragment),f=$(),v=p("div"),b=m("followers: "),Y(_.$$.fragment),w=$(),k=p("div"),x=m("github: "),C=p("a"),E=m("https://www.github.com/"),S=m(W),D=$(),j=p("img"),P=$(),y(e,"class","user-name svelte-5mnakf"),y(i,"class","user-type svelte-5mnakf"),y(v,"class","user-follow svelte-5mnakf"),y(C,"href",V="https://www.github.com/"+t[7].login),y(k,"class","user-github svelte-5mnakf"),y(j,"class","user-pic svelte-5mnakf"),j.src!==(N=t[7].avatar_url)&&y(j,"src",N),y(j,"alt",A=t[7].login+"-avatar"),y(n,"class","user-profile-cart svelte-5mnakf")},m(t,s){h(t,n,s),d(n,e),d(e,o),Z(r,e,null),d(n,l),d(n,i),d(i,c),Z(u,i,null),d(n,f),d(n,v),d(v,b),Z(_,v,null),d(n,w),d(n,k),d(k,x),d(k,C),d(C,E),d(C,S),d(n,D),d(n,j),d(n,P),I=!0},p(n,e){t=n;const o={};!s&&2&e&&(s=!0,o.inputVal=t[7].login,L(()=>s=!1)),r.$set(o);const l={};!a&&2&e&&(a=!0,l.inputVal=t[7].type,L(()=>a=!1)),u.$set(l);const i={};2&e&&(i.inputVal=t[7].followers_url),_.$set(i),(!I||2&e)&&W!==(W=t[7].login+"")&&function(t,n){n=""+n,t.wholeText!==n&&(t.data=n)}(S,W),(!I||2&e&&V!==(V="https://www.github.com/"+t[7].login))&&y(C,"href",V),(!I||2&e&&j.src!==(N=t[7].avatar_url))&&y(j,"src",N),(!I||2&e&&A!==(A=t[7].login+"-avatar"))&&y(j,"alt",A)},i(t){I||(H(r.$$.fragment,t),H(u.$$.fragment,t),H(_.$$.fragment,t),F(()=>{R||(R=U(n,ut,{},!0)),R.run(1)}),I=!0)},o(t){K(r.$$.fragment,t),K(u.$$.fragment,t),K(_.$$.fragment,t),R||(R=U(n,ut,{},!1)),R.run(0),I=!1},d(t){t&&g(n),tt(r),tt(u),tt(_),t&&R&&R.end()}}}function gt(t){let n,e,o,r;const s=[dt,ft],l=[];function i(t,n){return 0==t[1].length?0:1}return n=i(t),e=l[n]=s[n](t),{c(){e.c(),o=v()},m(t,e){l[n].m(t,e),h(t,o,e),r=!0},p(t,[r]){let c=n;n=i(t),n===c?l[n].p(t,r):(T(),K(l[c],1,1,()=>{l[c]=null}),G(),e=l[n],e||(e=l[n]=s[n](t),e.c()),H(e,1),e.m(o.parentNode,o))},i(t){r||(H(e),r=!0)},o(t){K(e),r=!1},d(t){l[n].d(t),t&&g(o)}}}function pt(n,e,o){let r,s=t;n.$$.on_destroy.push(()=>s());var l=this&&this.__awaiter||function(t,n,e,o){return new(e||(e=Promise))((function(r,s){function l(t){try{c(o.next(t))}catch(t){s(t)}}function i(t){try{c(o.throw(t))}catch(t){s(t)}}function c(t){var n;t.done?r(t.value):(n=t.value,n instanceof e?n:new e((function(t){t(n)}))).then(l,i)}c((o=o.apply(t,n||[])).next())}))};const i=st(localStorage.getItem("myData")?JSON.parse(localStorage.getItem("myData")):[]);return s(),s=function(n,...e){if(null==n)return t;const o=n.subscribe(...e);return o.unsubscribe?()=>o.unsubscribe():o}(i,t=>o(1,r=t)),n.$$.update=()=>{2&n.$$.dirty&&console.log(r)},[i,r,function(){return l(this,void 0,void 0,(function*(){yield fetch("https://api.github.com/users").then(t=>t.json()).then(t=>{!function(t,n,e=n){t.set(e)}(i,r=t)})}))},function(){localStorage.setItem("myData",JSON.stringify(r)),console.log(r)},function(t,n){n.login=t,i.set(r)},function(t,n){n.type=t,i.set(r)}]}class mt extends ot{constructor(t){super(),et(this,t,pt,gt,l,{mydata:0})}get mydata(){return this.$$.ctx[0]}}function $t(n){let e,o,r,s;return r=new mt({}),{c(){e=$(),o=p("main"),Y(r.$$.fragment),document.title="Student List",y(o,"class","svelte-6cxj83")},m(t,n){h(t,e,n),h(t,o,n),Z(r,o,null),s=!0},p:t,i(t){s||(H(r.$$.fragment,t),s=!0)},o(t){K(r.$$.fragment,t),s=!1},d(t){t&&g(e),t&&g(o),tt(r)}}}function vt(t,n,e){return[st("")]}"serviceWorker"in navigator&&window.addEventListener("load",(function(){navigator.serviceWorker.register("serviceWorkerStudentDemo.js").then(t=>console.log("service worker registered")).catch(t=>console.log("service worker not registered",t))}));return new class extends ot{constructor(t){super(),et(this,t,vt,$t,l,{name:0})}get name(){return this.$$.ctx[0]}}({target:document.body,props:{}})}();
//# sourceMappingURL=bundle.js.map
