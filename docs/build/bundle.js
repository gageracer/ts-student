var app=function(){"use strict";function t(){}const e=t=>t;function n(t){return t()}function s(){return Object.create(null)}function r(t){t.forEach(n)}function o(t){return"function"==typeof t}function l(t,e){return t!=t?e==e:t!==e||t&&"object"==typeof t||"function"==typeof t}function a(t,e,n=e){return t.set(n),e}const c="undefined"!=typeof window;let i=c?()=>window.performance.now():()=>Date.now(),u=c?t=>requestAnimationFrame(t):t;const d=new Set;function f(t){d.forEach(e=>{e.c(t)||(d.delete(e),e.f())}),0!==d.size&&u(f)}function p(t,e){t.appendChild(e)}function g(t,e,n){t.insertBefore(e,n||null)}function h(t){t.parentNode.removeChild(t)}function m(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}function v(t){return document.createElement(t)}function y(t){return document.createTextNode(t)}function $(){return y(" ")}function b(t,e,n,s){return t.addEventListener(e,n,s),()=>t.removeEventListener(e,n,s)}function _(t,e,n){null==n?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function x(t,e){e=""+e,t.wholeText!==e&&(t.data=e)}function w(t,e){t.value=null==e?"":e}const k=new Set;let S,C=0;function E(t,e,n,s,r,o,l,a=0){const c=16.666/s;let i="{\n";for(let t=0;t<=1;t+=c){const s=e+(n-e)*o(t);i+=100*t+`%{${l(s,1-s)}}\n`}const u=i+`100% {${l(n,1-n)}}\n}`,d=`__svelte_${function(t){let e=5381,n=t.length;for(;n--;)e=(e<<5)-e^t.charCodeAt(n);return e>>>0}(u)}_${a}`,f=t.ownerDocument;k.add(f);const p=f.__svelte_stylesheet||(f.__svelte_stylesheet=f.head.appendChild(v("style")).sheet),g=f.__svelte_rules||(f.__svelte_rules={});g[d]||(g[d]=!0,p.insertRule(`@keyframes ${d} ${u}`,p.cssRules.length));const h=t.style.animation||"";return t.style.animation=`${h?h+", ":""}${d} ${s}ms linear ${r}ms 1 both`,C+=1,d}function N(t,e){const n=(t.style.animation||"").split(", "),s=n.filter(e?t=>t.indexOf(e)<0:t=>-1===t.indexOf("__svelte")),r=n.length-s.length;r&&(t.style.animation=s.join(", "),C-=r,C||u(()=>{C||(k.forEach(t=>{const e=t.__svelte_stylesheet;let n=e.cssRules.length;for(;n--;)e.deleteRule(n);t.__svelte_rules={}}),k.clear())}))}function T(t){S=t}const O=[],j=[],A=[],D=[],G=Promise.resolve();let F=!1;function L(t){A.push(t)}let q=!1;const P=new Set;function R(){if(!q){q=!0;do{for(let t=0;t<O.length;t+=1){const e=O[t];T(e),I(e.$$)}for(O.length=0;j.length;)j.pop()();for(let t=0;t<A.length;t+=1){const e=A[t];P.has(e)||(P.add(e),e())}A.length=0}while(O.length);for(;D.length;)D.pop()();F=!1,q=!1,P.clear()}}function I(t){if(null!==t.fragment){t.update(),r(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(L)}}let W;function z(t,e,n){t.dispatchEvent(function(t,e){const n=document.createEvent("CustomEvent");return n.initCustomEvent(t,!1,!1,e),n}(`${e?"intro":"outro"}${n}`))}const B=new Set;let J;function M(){J={r:0,c:[],p:J}}function H(){J.r||r(J.c),J=J.p}function K(t,e){t&&t.i&&(B.delete(t),t.i(e))}function Q(t,e,n,s){if(t&&t.o){if(B.has(t))return;B.add(t),J.c.push(()=>{B.delete(t),s&&(n&&t.d(1),s())}),t.o(e)}}const U={duration:0};function V(n,s,l,a){let c=s(n,l),p=a?0:1,g=null,h=null,m=null;function v(){m&&N(n,m)}function y(t,e){const n=t.b-p;return e*=Math.abs(n),{a:p,b:t.b,d:n,duration:e,start:t.start,end:t.start+e,group:t.group}}function $(s){const{delay:o=0,duration:l=300,easing:a=e,tick:$=t,css:b}=c||U,_={start:i()+o,b:s};s||(_.group=J,J.r+=1),g?h=_:(b&&(v(),m=E(n,p,s,l,o,a,b)),s&&$(0,1),g=y(_,l),L(()=>z(n,s,"start")),function(t){let e;0===d.size&&u(f),new Promise(n=>{d.add(e={c:t,f:n})})}(t=>{if(h&&t>h.start&&(g=y(h,l),h=null,z(n,g.b,"start"),b&&(v(),m=E(n,p,g.b,g.duration,0,a,c.css))),g)if(t>=g.end)$(p=g.b,1-p),z(n,g.b,"end"),h||(g.b?v():--g.group.r||r(g.group.c)),g=null;else if(t>=g.start){const e=t-g.start;p=g.a+g.d*a(e/g.duration),$(p,1-p)}return!(!g&&!h)}))}return{run(t){o(c)?(W||(W=Promise.resolve(),W.then(()=>{W=null})),W).then(()=>{c=c(),$(t)}):$(t)},end(){v(),g=h=null}}}function X(t,e,s){const{fragment:l,on_mount:a,on_destroy:c,after_update:i}=t.$$;l&&l.m(e,s),L(()=>{const e=a.map(n).filter(o);c?c.push(...e):r(e),t.$$.on_mount=[]}),i.forEach(L)}function Y(t,e){const n=t.$$;null!==n.fragment&&(r(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function Z(t,e){-1===t.$$.dirty[0]&&(O.push(t),F||(F=!0,G.then(R)),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function tt(e,n,o,l,a,c,i=[-1]){const u=S;T(e);const d=n.props||{},f=e.$$={fragment:null,ctx:null,props:c,update:t,not_equal:a,bound:s(),on_mount:[],on_destroy:[],before_update:[],after_update:[],context:new Map(u?u.$$.context:[]),callbacks:s(),dirty:i,skip_bound:!1};let p=!1;if(f.ctx=o?o(e,d,(t,n,...s)=>{const r=s.length?s[0]:n;return f.ctx&&a(f.ctx[t],f.ctx[t]=r)&&(!f.skip_bound&&f.bound[t]&&f.bound[t](r),p&&Z(e,t)),n}):[],f.update(),p=!0,r(f.before_update),f.fragment=!!l&&l(f.ctx),n.target){if(n.hydrate){const t=function(t){return Array.from(t.childNodes)}(n.target);f.fragment&&f.fragment.l(t),t.forEach(h)}else f.fragment&&f.fragment.c();n.intro&&K(e.$$.fragment),X(e,n.target,n.anchor),R()}T(u)}class et{$destroy(){Y(this,1),this.$destroy=t}$on(t,e){const n=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return n.push(e),()=>{const t=n.indexOf(e);-1!==t&&n.splice(t,1)}}$set(t){var e;this.$$set&&(e=t,0!==Object.keys(e).length)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}const nt=[];function st(e,n=t){let s;const r=[];function o(t){if(l(e,t)&&(e=t,s)){const t=!nt.length;for(let t=0;t<r.length;t+=1){const n=r[t];n[1](),nt.push(n,e)}if(t){for(let t=0;t<nt.length;t+=2)nt[t][0](nt[t+1]);nt.length=0}}}return{set:o,update:function(t){o(t(e))},subscribe:function(l,a=t){const c=[l,a];return r.push(c),1===r.length&&(s=n(o)||t),l(e),()=>{const t=r.indexOf(c);-1!==t&&r.splice(t,1),0===r.length&&(s(),s=null)}}}}function rt(t){const e=t-1;return e*e*e+1}function ot(t,{delay:n=0,duration:s=400,easing:r=e}){const o=+getComputedStyle(t).opacity;return{delay:n,duration:s,easing:r,css:t=>"opacity: "+t*o}}function lt(t,{delay:e=0,duration:n=400,easing:s=rt,x:r=0,y:o=0,opacity:l=0}){const a=getComputedStyle(t),c=+a.opacity,i="none"===a.transform?"":a.transform,u=c*(1-l);return{delay:e,duration:n,easing:s,css:(t,e)=>`\n\t\t\ttransform: ${i} translate(${(1-t)*r}px, ${(1-t)*o}px);\n\t\t\topacity: ${c-u*e}`}}function at(t,e,n){const s=t.slice();return s[17]=e[n],s[19]=n,s}function ct(t,e,n){const s=t.slice();return s[20]=e[n],s[22]=n,s}function it(t,e,n){const s=t.slice();return s[14]=e[n],s[15]=e,s[16]=n,s}function ut(t){let e,n,s,o,l,a,c,i,u,d,f,y,x=t[3].filter(t[8]),k=[];for(let e=0;e<x.length;e+=1)k[e]=mt(it(t,x,e));const S=t=>Q(k[t],1,1,()=>{k[t]=null});return{c(){e=v("button"),e.textContent="Fetch Data",n=$(),s=v("br"),o=$(),l=v("div"),a=v("input"),c=$(),i=v("input"),u=$();for(let t=0;t<k.length;t+=1)k[t].c();_(e,"class","svelte-10e9sa4"),_(a,"id","name-input"),_(a,"type","text"),_(a,"placeholder","Search by name"),_(a,"class","svelte-10e9sa4"),_(i,"id","tag-input"),_(i,"type","text"),_(i,"placeholder","Search by tag"),_(i,"class","svelte-10e9sa4"),_(l,"class","list-body svelte-10e9sa4")},m(r,h){g(r,e,h),g(r,n,h),g(r,s,h),g(r,o,h),g(r,l,h),p(l,a),w(a,t[1]),p(l,c),p(l,i),w(i,t[2]),p(l,u);for(let t=0;t<k.length;t+=1)k[t].m(l,null);d=!0,f||(y=[b(e,"click",t[4]),b(a,"input",t[6]),b(i,"input",t[7])],f=!0)},p(t,e){if(2&e&&a.value!==t[1]&&w(a,t[1]),4&e&&i.value!==t[2]&&w(i,t[2]),46&e){let n;for(x=t[3].filter(t[8]),n=0;n<x.length;n+=1){const s=it(t,x,n);k[n]?(k[n].p(s,e),K(k[n],1)):(k[n]=mt(s),k[n].c(),K(k[n],1),k[n].m(l,null))}for(M(),n=x.length;n<k.length;n+=1)S(n);H()}},i(t){if(!d){for(let t=0;t<x.length;t+=1)K(k[t]);d=!0}},o(t){k=k.filter(Boolean);for(let t=0;t<k.length;t+=1)Q(k[t]);d=!1},d(t){t&&h(e),t&&h(n),t&&h(s),t&&h(o),t&&h(l),m(k,t),f=!1,r(y)}}}function dt(e){let n,s,r,o,l;return{c(){n=v("button"),n.textContent="Fetch Data",s=$(),r=v("p"),r.textContent="Fetch data to see it",_(n,"class","svelte-10e9sa4")},m(t,a){g(t,n,a),g(t,s,a),g(t,r,a),o||(l=b(n,"click",e[4]),o=!0)},p:t,i:t,o:t,d(t){t&&h(n),t&&h(s),t&&h(r),o=!1,l()}}}function ft(t){let e,n,s,o,l,a,c,i,u,d=t[14].grades,f=[];for(let e=0;e<d.length;e+=1)f[e]=pt(ct(t,d,e));let y=t[14].tags,x=[];for(let e=0;e<y.length;e+=1)x[e]=ht(at(t,y,e));let k=null;function S(...e){return t[10](t[14],t[15],t[16],...e)}function C(){t[11].call(l,t[15],t[16])}return y.length||(k=gt()),{c(){e=v("div");for(let t=0;t<f.length;t+=1)f[t].c();n=$(),s=v("div");for(let t=0;t<x.length;t+=1)x[t].c();k&&k.c(),o=$(),l=v("input"),_(s,"class","tags svelte-10e9sa4"),_(l,"id","add-tag-input"),_(l,"type","text"),_(l,"placeholder","Add a tag"),_(l,"class","svelte-10e9sa4"),_(e,"class","user-grades svelte-10e9sa4")},m(r,a){g(r,e,a);for(let t=0;t<f.length;t+=1)f[t].m(e,null);p(e,n),p(e,s);for(let t=0;t<x.length;t+=1)x[t].m(s,null);k&&k.m(s,null),p(e,o),p(e,l),w(l,t[14].tempTag),c=!0,i||(u=[b(l,"keypress",S),b(l,"input",C)],i=!0)},p(r,o){if(t=r,14&o){let s;for(d=t[14].grades,s=0;s<d.length;s+=1){const r=ct(t,d,s);f[s]?f[s].p(r,o):(f[s]=pt(r),f[s].c(),f[s].m(e,n))}for(;s<f.length;s+=1)f[s].d(1);f.length=d.length}if(14&o){let e;for(y=t[14].tags,e=0;e<y.length;e+=1){const n=at(t,y,e);x[e]?x[e].p(n,o):(x[e]=ht(n),x[e].c(),x[e].m(s,null))}for(;e<x.length;e+=1)x[e].d(1);x.length=y.length,y.length?k&&(k.d(1),k=null):k||(k=gt(),k.c(),k.m(s,null))}14&o&&l.value!==t[14].tempTag&&w(l,t[14].tempTag)},i(t){c||(L(()=>{a||(a=V(e,lt,{y:-10,duration:200},!0)),a.run(1)}),c=!0)},o(t){a||(a=V(e,lt,{y:-10,duration:200},!1)),a.run(0),c=!1},d(t){t&&h(e),m(f,t),m(x,t),k&&k.d(),t&&a&&a.end(),i=!1,r(u)}}}function pt(t){let e,n,s,r,o,l,a=t[22]+1+"",c=t[20]+"";return{c(){e=v("div"),n=y("Test"),s=y(a),r=y(":   "),o=y(c),l=y("%")},m(t,a){g(t,e,a),p(e,n),p(e,s),p(e,r),p(e,o),p(e,l)},p(t,e){14&e&&c!==(c=t[20]+"")&&x(o,c)},d(t){t&&h(e)}}}function gt(e){return{c:t,m:t,d:t}}function ht(t){let e,n,s=t[17]+"";return{c(){e=v("div"),n=y(s),_(e,"class","tag svelte-10e9sa4")},m(t,s){g(t,e,s),p(e,n)},p(t,e){14&e&&s!==(s=t[17]+"")&&x(n,s)},d(t){t&&h(e)}}}function mt(t){let e,n,s,r,o,l,a,c,i,u,d,f,m,w,k,S,C,E,N,T,O,j,A,D,G,F,q,P,R,I,W,z,B,J,U,X,Y=t[14].firstName+"",Z=t[14].lastName+"",tt=t[14].email+"",et=t[14].company+"",nt=t[14].skill+"",st=t[5](t[14].grades)+"";function rt(...e){return t[9](t[14],t[15],t[16],...e)}let lt=t[14].expandGrade&&ft(t);return{c(){e=v("div"),n=v("img"),o=$(),l=v("div"),a=y(Y),c=$(),i=y(Z),u=$(),d=v("div"),f=y("Email: "),m=y(tt),w=$(),k=v("div"),S=y("Company: "),C=y(et),E=$(),N=v("div"),T=y("Skill: "),O=y(nt),j=$(),A=v("div"),D=y("Average:"),G=y(st),F=y("%"),q=$(),P=v("div"),R=v("div"),W=$(),lt&&lt.c(),z=$(),_(n,"class","user-pic svelte-10e9sa4"),n.src!==(s=t[14].pic)&&_(n,"src",s),_(n,"alt",r=t[14].firstName+"-avatar"),_(l,"class","user-name svelte-10e9sa4"),_(d,"class","user-email svelte-10e9sa4"),_(k,"class","user-company svelte-10e9sa4"),_(N,"class","user-skill svelte-10e9sa4"),_(A,"class","user-average svelte-10e9sa4"),_(R,"id",I=t[14].expandGrade?"square":"cross"),_(R,"class","svelte-10e9sa4"),_(P,"class","expand-btn svelte-10e9sa4"),_(e,"class","user-profile-cart svelte-10e9sa4")},m(t,s){g(t,e,s),p(e,n),p(e,o),p(e,l),p(l,a),p(l,c),p(l,i),p(e,u),p(e,d),p(d,f),p(d,m),p(e,w),p(e,k),p(k,S),p(k,C),p(e,E),p(e,N),p(N,T),p(N,O),p(e,j),p(e,A),p(A,D),p(A,G),p(A,F),p(e,q),p(e,P),p(P,R),p(e,W),lt&&lt.m(e,null),p(e,z),J=!0,U||(X=b(P,"click",rt),U=!0)},p(o,l){t=o,(!J||14&l&&n.src!==(s=t[14].pic))&&_(n,"src",s),(!J||14&l&&r!==(r=t[14].firstName+"-avatar"))&&_(n,"alt",r),(!J||14&l)&&Y!==(Y=t[14].firstName+"")&&x(a,Y),(!J||14&l)&&Z!==(Z=t[14].lastName+"")&&x(i,Z),(!J||14&l)&&tt!==(tt=t[14].email+"")&&x(m,tt),(!J||14&l)&&et!==(et=t[14].company+"")&&x(C,et),(!J||14&l)&&nt!==(nt=t[14].skill+"")&&x(O,nt),(!J||14&l)&&st!==(st=t[5](t[14].grades)+"")&&x(G,st),(!J||14&l&&I!==(I=t[14].expandGrade?"square":"cross"))&&_(R,"id",I),t[14].expandGrade?lt?(lt.p(t,l),14&l&&K(lt,1)):(lt=ft(t),lt.c(),K(lt,1),lt.m(e,z)):lt&&(M(),Q(lt,1,1,()=>{lt=null}),H())},i(t){J||(K(lt),L(()=>{B||(B=V(e,ot,{},!0)),B.run(1)}),J=!0)},o(t){Q(lt),B||(B=V(e,ot,{},!1)),B.run(0),J=!1},d(t){t&&h(e),lt&&lt.d(),t&&B&&B.end(),U=!1,X()}}}function vt(t){let e,n,s,r;const o=[dt,ut],l=[];function a(t,e){return 0==t[3].length?0:1}return e=a(t),n=l[e]=o[e](t),{c(){n.c(),s=y("")},m(t,n){l[e].m(t,n),g(t,s,n),r=!0},p(t,[r]){let c=e;e=a(t),e===c?l[e].p(t,r):(M(),Q(l[c],1,1,()=>{l[c]=null}),H(),n=l[e],n||(n=l[e]=o[e](t),n.c()),K(n,1),n.m(s.parentNode,s))},i(t){r||(K(n),r=!0)},o(t){Q(n),r=!1},d(t){l[e].d(t),t&&h(s)}}}function yt(e,n,s){let r,o=t;e.$$.on_destroy.push(()=>o());var l=this&&this.__awaiter||function(t,e,n,s){return new(n||(n=Promise))((function(r,o){function l(t){try{c(s.next(t))}catch(t){o(t)}}function a(t){try{c(s.throw(t))}catch(t){o(t)}}function c(t){var e;t.done?r(t.value):(e=t.value,e instanceof n?e:new n((function(t){t(e)}))).then(l,a)}c((s=s.apply(t,e||[])).next())}))};const c=st(localStorage.getItem("myData")?JSON.parse(localStorage.getItem("myData")):[]);o(),o=function(e,...n){if(null==e)return t;const s=e.subscribe(...n);return s.unsubscribe?()=>s.unsubscribe():s}(c,t=>s(3,r=t));let i="",u="";function d(){return l(this,void 0,void 0,(function*(){yield fetch("https://www.hatchways.io/api/assessment/students").then(t=>t.json()).then(t=>{a(c,r=t.students.map(t=>Object.assign(Object.assign({},t),{expandGrade:!1,tempTag:"",tags:[]}))),console.log(r),console.log(typeof r)})}))}0===r.length&&d();return e.$$.update=()=>{8&e.$$.dirty&&r&&(localStorage.setItem("myData",JSON.stringify(r)),console.log(r))},[c,i,u,r,d,t=>t.reduce((t,e)=>parseFloat(t)+parseFloat(e),0)/t.length,function(){i=this.value,s(1,i)},function(){u=this.value,s(2,u)},t=>t.firstName.concat(" ",t.lastName).toLowerCase().includes(i.toLowerCase())&&(""==u||t.tags.find(t=>t.includes(u))),(t,e,n)=>a(c,e[n].expandGrade=!t.expandGrade,r,s(1,i),s(2,u)),(t,e,n,o)=>{13===o.keyCode&&""!==t.tempTag&&(a(c,e[n].tags=[...t.tags,t.tempTag],r,s(1,i),s(2,u)),a(c,e[n].tempTag="",r,s(1,i),s(2,u)))},function(t,e){t[e].tempTag=this.value,s(1,i),s(2,u)}]}class $t extends et{constructor(t){super(),tt(this,t,yt,vt,l,{mydata:0})}get mydata(){return this.$$.ctx[0]}}function bt(e){let n,s,r,o;return r=new $t({}),{c(){var t;n=$(),s=v("main"),(t=r.$$.fragment)&&t.c(),document.title="Student List",_(s,"class","svelte-dplidf")},m(t,e){g(t,n,e),g(t,s,e),X(r,s,null),o=!0},p:t,i(t){o||(K(r.$$.fragment,t),o=!0)},o(t){Q(r.$$.fragment,t),o=!1},d(t){t&&h(n),t&&h(s),Y(r)}}}function _t(t,e,n){return[st("")]}"serviceWorker"in navigator&&window.addEventListener("load",(function(){navigator.serviceWorker.register("serviceWorkerStudentDemo.js").then(t=>console.log("service worker registered")).catch(t=>console.log("service worker not registered",t))}));return new class extends et{constructor(t){super(),tt(this,t,_t,bt,l,{name:0})}get name(){return this.$$.ctx[0]}}({target:document.body,props:{}})}();
//# sourceMappingURL=bundle.js.map
