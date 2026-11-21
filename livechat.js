(function () {
  'use strict';
  if (window.__lcInit) return;
  window.__lcInit = true;

  var SID_KEY = 'cfx_lc_sid';
  var POLL_MS = 3000;
  var sid = null, lastId = 0, timer = null, open = false, busy = false;

  var T = {
    fa: { title:'پشتیبانی سی اف ایکس', on:'آنلاین', h:'سلام! خوش آمدید 👋',
          p:'برای شروع گفتگو، لطفاً مشخصات خود را وارد کنید تا همکاران ما بتوانند بهتر راهنمایی‌تان کنند.',
          fn:'نام', ln:'نام خانوادگی', ph:'شماره موبایل', go:'شروع گفتگو', going:'لطفاً صبر کنید…',
          ta:'پیام خود را بنویسید…', note:'دستیار هوشمند پشتیبانی', noteAdmin:'کارشناس پشتیبانی — آنلاین',
          e1:'نام را وارد کنید', e2:'نام خانوادگی را وارد کنید', e3:'شماره موبایل معتبر نیست', e4:'خطا در اتصال' },
    en: { title:'CustomizeFund Support', on:'Online', h:'Hi there! Welcome 👋',
          p:'Please enter your details so our team can assist you better.',
          fn:'First name', ln:'Last name', ph:'Mobile number', go:'Start chat', going:'Please wait…',
          ta:'Type your message…', note:'AI support assistant', noteAdmin:'Support specialist — online',
          e1:'Enter your first name', e2:'Enter your last name', e3:'Invalid mobile number', e4:'Connection error' }
  };
  function lang() { return document.documentElement.getAttribute('lang') === 'en' ? 'en' : 'fa'; }
  function t(k) { return T[lang()][k]; }

  function el(id) { return document.getElementById(id); }
  function esc(s) { var d = document.createElement('div'); d.textContent = s; return d.innerHTML; }

  // ── ساخت DOM ──
  var w = document.createElement('div');
  w.id = 'lcw';
  w.innerHTML =
    '<div id="lcw-box">' +
      '<div id="lcw-hd"><div id="lcw-av">آ</div><div style="flex:1"><b id="lc-title"></b>' +
        '<span><i></i><em id="lc-on" style="font-style:normal"></em></span></div></div>' +
      '<button id="lcw-close" aria-label="بستن"><svg viewBox="0 0 24 24"><path d="M19 6.4L17.6 5 12 10.6 6.4 5 5 6.4 10.6 12 5 17.6 6.4 19 12 13.4 17.6 19 19 17.6 13.4 12z"/></svg></button>' +
      '<div id="lcw-form">' +
        '<h4 id="lc-h"></h4><p id="lc-p"></p>' +
        '<input class="lc-in" id="lc-fn" maxlength="40">' +
        '<input class="lc-in" id="lc-ln" maxlength="40">' +
        '<input class="lc-in" id="lc-ph" type="tel" dir="ltr" inputmode="numeric" maxlength="15">' +
        '<div id="lcw-err"></div>' +
        '<button class="lc-go" id="lc-go"></button>' +
      '</div>' +
      '<div id="lcw-bd" style="display:none"></div>' +
      '<div id="lcw-note" style="display:none"></div>' +
      '<div id="lcw-ft" style="display:none">' +
        '<textarea id="lcw-ta" rows="1"></textarea>' +
        '<button id="lcw-send"><svg viewBox="0 0 24 24"><path d="M2 21l21-9L2 3v7l15 2-15 2v7z"/></svg></button>' +
      '</div>' +
    '</div>' +
    '<button id="lcw-btn"><span id="lcw-dot"></span>' +
      '<svg class="lc-c" viewBox="0 0 24 24"><path d="M12 2C6.5 2 2 5.9 2 10.7c0 2.7 1.4 5.1 3.6 6.7L5 22l4.6-2.4c.8.2 1.6.3 2.4.3 5.5 0 10-3.9 10-8.7S17.5 2 12 2z"/></svg>' +
      '<svg class="lc-x" viewBox="0 0 24 24"><path d="M19 6.4L17.6 5 12 10.6 6.4 5 5 6.4 10.6 12 5 17.6 6.4 19 12 13.4 17.6 19 19 17.6 13.4 12z"/></svg>' +
    '</button>';

  function paint() {
    el('lc-title').textContent = t('title'); el('lc-on').textContent = t('on');
    el('lc-h').textContent = t('h'); el('lc-p').textContent = t('p');
    el('lc-fn').placeholder = t('fn'); el('lc-ln').placeholder = t('ln'); el('lc-ph').placeholder = t('ph');
    el('lc-go').textContent = t('go'); el('lcw-ta').placeholder = t('ta');
    setNote();
    el('lcw-av').textContent = lang() === 'en' ? 'I' : 'آ';
  }

  function add(role, text) {
    var d = document.createElement('div');
    d.className = 'lc-m ' + (role === 'user' ? 'me' : 'them');
    d.innerHTML = esc(text);
    el('lcw-bd').appendChild(d);
    el('lcw-bd').scrollTop = el('lcw-bd').scrollHeight;
  }
  function typing(on) {
    var old = document.querySelector('.lc-typ');
    if (old) old.remove();
    if (!on) return;
    var d = document.createElement('div');
    d.className = 'lc-typ'; d.innerHTML = '<s></s><s></s><s></s>';
    el('lcw-bd').appendChild(d);
    el('lcw-bd').scrollTop = el('lcw-bd').scrollHeight;
  }
  var handledBy = 'ai';
  function setNote() {
    var n = el('lcw-note');
    if (n) n.textContent = (handledBy === 'admin') ? t('noteAdmin') : t('note');
  }
  function chatMode() {
    el('lcw-form').style.display = 'none';
    el('lcw-bd').style.display = 'flex';
    el('lcw-note').style.display = 'none';
    el('lcw-ft').style.display = 'flex';
  }

  // ── شروع گفتگو ──
  function start() {
    if (busy) return;
    var fn = el('lc-fn').value.trim(), ln = el('lc-ln').value.trim(), ph = el('lc-ph').value.trim();
    var e = el('lcw-err');
    if (fn.length < 2) { e.textContent = t('e1'); return; }
    if (ln.length < 2) { e.textContent = t('e2'); return; }
    if (ph.replace(/\D/g, '').length < 10) { e.textContent = t('e3'); return; }
    e.textContent = ''; busy = true;
    el('lc-go').disabled = true; el('lc-go').textContent = t('going');
    fetch('/api/livechat/start', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName: fn, lastName: ln, phone: ph, lang: lang() })
    }).then(function (r) { return r.json(); }).then(function (j) {
      busy = false; el('lc-go').disabled = false; el('lc-go').textContent = t('go');
      if (!j || j.error) { e.textContent = j && j.error ? j.error : t('e4'); return; }
      sid = j.sid;
      try { localStorage.setItem(SID_KEY, sid); } catch (x) {}
      chatMode();
      (j.messages || []).forEach(function (m) { add(m.role, m.text); lastId = Math.max(lastId, m.id || 0); });
      poll();
    }).catch(function () {
      busy = false; el('lc-go').disabled = false; el('lc-go').textContent = t('go');
      e.textContent = t('e4');
    });
  }

  // ── ارسال پیام ──
  function send() {
    var ta = el('lcw-ta'), txt = ta.value.trim();
    if (!txt || !sid || busy) return;
    busy = true; ta.value = ''; ta.style.height = 'auto';
    add('user', txt); typing(true);
    fetch('/api/livechat/send', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sid: sid, text: txt })
    }).then(function (r) { return r.json(); }).then(function (j) {
      busy = false; typing(false);
      (j && j.messages || []).forEach(function (m) {
        if (m.id > lastId) { lastId = m.id; if (m.role !== 'user') add(m.role, m.text); }
        else if (m.role === 'user') lastId = Math.max(lastId, m.id);
      });
    }).catch(function () { busy = false; typing(false); });
  }

  // ── polling ──
  function poll() {
    if (timer) clearInterval(timer);
    timer = setInterval(function () {
      if (!sid || document.hidden) return;
      fetch('/api/livechat/poll?sid=' + encodeURIComponent(sid) + '&after=' + lastId)
        .then(function (r) { return r.json(); }).then(function (j) {
          if (!j) return;
          if (j.handledBy && j.handledBy !== handledBy) { handledBy = j.handledBy; setNote(); }
          if (!j.messages) return;
          j.messages.forEach(function (m) {
            if (m.id <= lastId) return;
            lastId = m.id;
            if (m.role === 'user') return;
            add(m.role, m.text);
            if (!open) w.classList.add('unread');
          });
        }).catch(function () {});
    }, POLL_MS);
  }

  // ── بازیابی نشست قبلی ──
  function restore() {
    var s = null;
    try { s = localStorage.getItem(SID_KEY); } catch (x) {}
    if (!s) return;
    fetch('/api/livechat/poll?sid=' + encodeURIComponent(s) + '&after=0')
      .then(function (r) { return r.json(); }).then(function (j) {
        if (!j || !j.ok || j.status === 'closed') { try { localStorage.removeItem(SID_KEY); } catch (x) {} return; }
        sid = s; handledBy = j.handledBy || 'ai'; chatMode(); setNote();
        (j.messages || []).forEach(function (m) { add(m.role, m.text); lastId = Math.max(lastId, m.id || 0); });
        poll();
      }).catch(function () {});
  }

  // ── نصب ──
  function mount() {
    document.body.appendChild(w);
    paint();
    function toggle(force) {
      open = (typeof force === 'boolean') ? force : !open;
      w.classList.toggle('on', open);
      try { document.body.classList.toggle('lc-lock', open && window.innerWidth <= 560); } catch (x) {}
      if (open) {
        w.classList.remove('unread');
        setTimeout(function () {
          if (window.innerWidth > 560) { (sid ? el('lcw-ta') : el('lc-fn')).focus(); }
        }, 90);
      }
    }
    el('lcw-btn').addEventListener('click', function () { toggle(); });
    el('lcw-close').addEventListener('click', function () { toggle(false); });
    window.addEventListener('resize', function () {
      try { document.body.classList.toggle('lc-lock', open && window.innerWidth <= 560); } catch (x) {}
    });
    el('lc-go').addEventListener('click', start);
    ['lc-fn','lc-ln','lc-ph'].forEach(function (id) {
      el(id).addEventListener('keydown', function (ev) { if (ev.key === 'Enter') start(); });
    });
    el('lcw-send').addEventListener('click', send);
    var ta = el('lcw-ta');
    ta.addEventListener('keydown', function (ev) {
      if (ev.key === 'Enter' && !ev.shiftKey) { ev.preventDefault(); send(); }
    });
    ta.addEventListener('input', function () {
      ta.style.height = 'auto'; ta.style.height = Math.min(ta.scrollHeight, 90) + 'px';
    });
    // تعویض زبان توسط landing.js → بازنویسی متن‌ها
    new MutationObserver(paint).observe(document.documentElement, { attributes: true, attributeFilter: ['lang', 'dir'] });
    restore();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
})();

/* CFX-LCW-CLOSE: Esc and the phone back button also close the chat */
(function(){
  var pushed = false, tries = 0;
  function w(){ return document.getElementById('lcw'); }
  function isOpen(){ var x = w(); return !!(x && x.classList.contains('on')); }
  function close(){ var c = document.getElementById('lcw-close'); if(c) c.click(); }
  document.addEventListener('keydown', function(e){ if(e.key === 'Escape' && isOpen()) close(); });
  window.addEventListener('popstate', function(){ if(pushed){ pushed = false; if(isOpen()) close(); } });
  function watch(){
    var x = w();
    if(!x){ if(++tries < 40) setTimeout(watch, 250); return; }
    new MutationObserver(function(){
      var o = isOpen();
      if(o && !pushed && window.innerWidth <= 900){ try { history.pushState({ lcw: 1 }, ''); pushed = true; } catch(e){} }
      else if(!o && pushed){ pushed = false; try { if(history.state && history.state.lcw) history.back(); } catch(e){} }
    }).observe(x, { attributes: true, attributeFilter: ['class'] });
  }
  watch();
})();
/* CFX-LCW-HDR: move the close button into the header */
(function(){
  var n = 0;
  (function fix(){
    var hd = document.getElementById('lcw-hd'), c = document.getElementById('lcw-close');
    if(hd && c){ if(c.parentNode !== hd) hd.appendChild(c); return; }
    if(++n < 40) setTimeout(fix, 250);
  })();
})();
