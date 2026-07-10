
/* exit-intent slide-in (desktop: cursor leaves top; mobile: decisive scroll back up) */
(function(){
 var si=document.querySelector('.slidein'); if(!si) return;
 var dismissed=false; try{dismissed=localStorage.getItem('f_si')==='1'}catch(e){}
 var shown=false;
 function show(){ if(shown||dismissed) return; shown=true; si.classList.add('show'); }
 function dismiss(){ si.classList.remove('show'); try{localStorage.setItem('f_si','1')}catch(e){} }
 document.addEventListener('mouseout',function(e){ if(!e.relatedTarget && e.clientY<=2) show(); });
 var lastY=window.scrollY, armed=false;
 window.addEventListener('scroll',function(){ var y=window.scrollY; if(y>640)armed=true; if(armed&&y<lastY-42&&y<420)show(); lastY=y; },{passive:true});
 var x=si.querySelector('.x'); if(x) x.onclick=dismiss;
})();
/* Cal.com inline booking embed — LAZY-loaded only when the booking section nears
   the viewport (keeps the third-party script/iframe off the initial page load). */
(function(){
 var cfg=window.FUNNELITHIC||{}; var link=(cfg.calLink||'').trim();
 var m=document.getElementById('cal-inline'); if(!m||!link) return;
 var loaded=false;
 function mount(){ if(loaded) return; loaded=true; m.innerHTML='';
  (function(C,A,L){var p=function(a,ar){a.q.push(ar);};var d=C.document;C.Cal=C.Cal||function(){var cal=C.Cal;var ar=arguments;if(!cal.loaded){cal.ns={};cal.q=cal.q||[];d.head.appendChild(d.createElement("script")).src=A;cal.loaded=true;}if(ar[0]===L){var api=function(){p(api,arguments);};var ns=ar[1];api.q=api.q||[];if(typeof ns==="string"){cal.ns[ns]=cal.ns[ns]||api;p(cal.ns[ns],ar);p(cal,["initNamespace",ns]);}else{p(cal,ar);}return;}p(cal,ar);};})(window,"https://app.cal.com/embed/embed.js","init");
  Cal("init",{origin:"https://cal.com"});
  Cal("inline",{elementOrSelector:"#cal-inline",calLink:link,config:{layout:"month_view"}});
  Cal("ui",{hideEventTypeDetails:false,layout:"month_view",cssVarsPerTheme:{light:{"cal-brand":"#FF6B35"}}});
 }
 if('IntersectionObserver' in window){
  var io=new IntersectionObserver(function(es){for(var i=0;i<es.length;i++){if(es[i].isIntersecting){io.disconnect();mount();break;}}},{rootMargin:'600px 0px'});
  io.observe(m);
 } else { mount(); }
 /* also mount immediately if someone clicks a CTA that jumps to #book */
 document.addEventListener('click',function(e){var t=e.target;while(t&&t!==document){if(t.tagName==='A'&&t.getAttribute('href')==='#book'){mount();break;}t=t.parentNode;}},true);
})();
/* ConvertKit subscribe (proxied through a Netlify Function; no-op without a .ck-form) */
(function(){
 var f=document.querySelector('.ck-form'); if(!f) return; var cfg=window.FUNNELITHIC||{};
 f.addEventListener('submit',function(e){ e.preventDefault();
  var btn=f.querySelector('button'), msg=f.querySelector('.ck-msg');
  var email=(f.querySelector('[name=email]')||{}).value||'', first=(f.querySelector('[name=first]')||{}).value||'';
  if(!email){ msg.textContent='Please enter your email.'; msg.className='ck-msg err'; return; }
  if(!cfg.ajax){ msg.textContent='Email signup is available on the live site.'; msg.className='ck-msg err'; return; }
  var old=btn.textContent; btn.disabled=true; btn.textContent='Sending…'; msg.textContent='';
  var body='email='+encodeURIComponent(email)+'&first='+encodeURIComponent(first);
  fetch(cfg.ajax,{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:body}).then(function(r){return r.json();})
   .then(function(j){ msg.textContent=(j&&j.data&&j.data.msg)||(j&&j.success?'You’re in — check your inbox to confirm.':'Something went wrong.'); msg.className='ck-msg '+((j&&j.success)?'ok':'err'); if(j&&j.success)f.reset(); })
   .catch(function(){ msg.textContent='Network error — please try again.'; msg.className='ck-msg err'; })
   .finally(function(){ btn.disabled=false; btn.textContent=old; });
 });
})();
