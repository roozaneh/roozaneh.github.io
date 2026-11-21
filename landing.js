if(window.__LP_INIT){}else{window.__LP_INIT=1;
/* حلقه‌ی هماهنگ با مرورگر — جای setInterval برای انیمیشن */
function __lpRaf(fn, ms){
  var last = 0, id;
  function loop(t){
    id = requestAnimationFrame(loop);
    if (!last) last = t;
    if (t - last >= ms) { last = t; if (!document.hidden) fn(); }
  }
  id = requestAnimationFrame(loop);
  return id;
}

(function(){
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- header state: sentinel, not a scroll listener ---- */
  var hdr = document.getElementById("hdr");
  var sentinel = document.getElementById("top-sentinel");
  if (hdr && sentinel && "IntersectionObserver" in window){
    new IntersectionObserver(function(e){
      hdr.classList.toggle("is-stuck", !e[0].isIntersecting);
    },{threshold:0}).observe(sentinel);
  }

  /* ---- scroll reveal ---- */
  var rv = document.querySelectorAll(".rv");
  if ("IntersectionObserver" in window && !reduce){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if (en.isIntersecting){ en.target.classList.add("in"); io.unobserve(en.target); }
      });
    },{threshold:.18, rootMargin:"0px 0px -8% 0px"});
    rv.forEach(function(el){ io.observe(el); });
  } else {
    rv.forEach(function(el){ el.classList.add("in"); });
  }

  /* ---- far background candles (deterministic, decorative) ---- */
  var cv = document.getElementById("candles");
  if (cv){
    var seed = 20240822, W = 1600, H = 400, n = 46, step = W/n, y = 250, out = "";
    function rnd(){ seed = (seed*1103515245 + 12345) & 0x7fffffff; return seed/0x7fffffff; }
    for (var i=0;i<n;i++){
      var drift = (rnd()-0.46)*26;
      var o = y, c = Math.max(60, Math.min(340, y + drift));
      var hi = Math.min(o,c) - rnd()*22, lo = Math.max(o,c) + rnd()*22;
      var x = i*step + step*0.5;
      var top = Math.min(o,c), h = Math.max(3, Math.abs(c-o));
      var up = c < o;
      var op = (0.05 + (i/n)*0.07).toFixed(3);
      out += '<line x1="'+x.toFixed(1)+'" y1="'+hi.toFixed(1)+'" x2="'+x.toFixed(1)+'" y2="'+lo.toFixed(1)+'" stroke="#4FA9FA" stroke-width="1.1" opacity="'+op+'"/>';
      out += '<rect x="'+(x-step*0.28).toFixed(1)+'" y="'+top.toFixed(1)+'" width="'+(step*0.56).toFixed(1)+'" height="'+h.toFixed(1)+'" '
           + (up ? 'fill="#7CC0FA" opacity="'+op+'"' : 'fill="none" stroke="#4FA9FA" stroke-width="1.1" opacity="'+op+'"') + '/>';
      y = c;
    }
    cv.innerHTML = out;
  }

  /* ---- hero sparkline ---- */
  var sp = document.getElementById("spark");
  if (sp){
    var s2 = 991, pts = [], W2 = 320, H2 = 112, m = 26;
    function r2(){ s2 = (s2*1103515245 + 12345) & 0x7fffffff; return s2/0x7fffffff; }
    var v = 72;
    for (var j=0;j<40;j++){
      v = Math.max(m, Math.min(H2-m, v - (r2()-0.42)*13));
      pts.push([(j/(39))*W2, v]);
    }
    var d = pts.map(function(p,k){ return (k?"L":"M")+p[0].toFixed(1)+" "+p[1].toFixed(1); }).join(" ");
    var area = d + " L"+W2+" "+H2+" L0 "+H2+" Z";
    sp.innerHTML =
      '<defs>'+
        '<linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">'+
          '<stop offset="0%" stop-color="#7CC0FA" stop-opacity=".30"/>'+
          '<stop offset="100%" stop-color="#7CC0FA" stop-opacity="0"/>'+
        '</linearGradient>'+
      '</defs>'+
      '<path d="'+area+'" fill="url(#sg)"/>'+
      '<path d="'+d+'" fill="none" stroke="#9BD2FF" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round" opacity=".92"/>'+
      '<circle cx="'+pts[pts.length-1][0].toFixed(1)+'" cy="'+pts[pts.length-1][1].toFixed(1)+'" r="3" fill="#9BD2FF"/>';
  }

  /* ---- plan controls ---- */
  var sum = {
    t1:document.getElementById("s-t1"),
    t2:document.getElementById("s-t2"),
    dl:document.getElementById("s-dl"),
    ml:document.getElementById("s-ml"),
    split:document.getElementById("s-split"),
    days:document.getElementById("s-days"),
    ins:document.getElementById("s-ins"),
    flt:document.getElementById("s-flt")
  };
  var ranges = Array.prototype.slice.call(document.querySelectorAll('input[type=range]'));
  function unitOf(el){
    return (LANG === "en" && el.dataset.unitEn) ? el.dataset.unitEn : el.dataset.unit;
  }
  function paint(el){
    var min=+el.min, max=+el.max, val=+el.value;
    el.style.setProperty("--p", ((val-min)/(max-min)*100).toFixed(2));
    var out = document.getElementById(el.dataset.out);
    if (out) out.innerHTML = val + '<span class="u">' + unitOf(el) + '</span>';
  }
  function val(id){ var e = document.getElementById(id); return e ? e.value : ""; }
  function sync(){
    var en = (document.documentElement.getAttribute("data-lang") === "en");
    if (sum.t1) sum.t1.textContent = en ? "Unlimited" : "بدون محدودیت کاربر";
    if (sum.t2) sum.t2.textContent = "Reality & VLESS";
    if (sum.dl) sum.dl.textContent = en ? "Stable" : "پایدار و بدون قطعی";
    if (sum.ml) sum.ml.textContent = en ? "UK, NL + Iran Tunnel" : "انگلیس، هلند + تانل ایران";
    if (sum.split)  sum.split.textContent  = en ? "1 Gbps Datacenter" : "۱Gbps پرسرعت دیتاسنتر";
    if (sum.days)   sum.days.textContent   = en ? "Unlimited" : "نامحدود";
  }
  ranges.forEach(function(el){
    paint(el);
    el.addEventListener("input", function(){ paint(el); sync(); });
  });
  sync();

  function swLabel(btn){
    var on = btn.getAttribute("aria-checked") === "true";
    var target = btn.dataset.key === "insurance" ? sum.ins : sum.flt;
    if (target) target.textContent = on ? t("sw.on") : t("sw.off");
  }
  document.querySelectorAll(".sw").forEach(function(btn){
    btn.addEventListener("click", function(){
      btn.setAttribute("aria-checked", String(btn.getAttribute("aria-checked") !== "true"));
      swLabel(btn);
      try{ syncPick(); }catch(e){}
    });
  });

  /* ============================================================
     I18N — fa / en, plain JS, no dependency
     ============================================================ */
  var T = {
    "doc.title":       ["سی اف ایکس · نمونه‌ی بصری لندینگ","CustomizeFund · Landing visual preview"],
    "doc.desc":        ["نمونه‌ی بصری: تأمین سرمایه، تحلیل هوشمند پیش از ورود، و شناخت بهتر عملکرد.","Visual preview: funding, pre-trade analysis and a clearer view of your performance."],

    "nav.aria":        ["ناوبری اصلی","Main navigation"],
    "nav.home":         ["خانه","Home"],
    "nav.plans":       ["پلن‌ها","Plans"],
    "nav.sim":         ["CFX Trader","CFX Trader"],
    "nav.learn":       ["آموزش","Learn"],
    "nav.rules":       ["قوانین","Rules"],
    "nav.faq":         ["سؤالات متداول","FAQ"],
    "nav.about":       ["درباره ما","About"],
    "lang.aria":       ["تغییر زبان","Change language"],
    "menu.open":       ["باز کردن منو","Open menu"],
    "menu.close":      ["بستن منو","Close menu"],
    "menu.aria":       ["منوی اصلی","Main menu"],
    "tkr.aria":        ["قیمت بازارها","Market prices"],
    "rail.aria":       ["ناوبری سریع","Quick navigation"],
    "rail.home":       ["خانه","Home"],
    "rail.an":         ["تحلیل","Analysis"],
    "rail.jr":         ["ژورنال","Journal"],
    "rail.more":       ["بیشتر","More"],
    "rail.enter":      ["ورود","Open"],
    "k.daysDesc":      ["الزام معامله در حداقل تعداد روز پیش از تسویه","Requires trading on a minimum number of days before payout"],
    "pk.pick":         ["دریافت اشتراک روزنه","Get Rozaneh Subscription"], /* CFX-CK3 */
    "pk.type":         ["نوع پلن","Plan type"],
    "pk.two":          ["پلن‌های حجمی","Volume Plans"],
    "pk.real":         ["مصرف آزاد (Pay As You Go)","Pay As You Go"],
    "pk.size":         ["حجم اشتراک (ترافیک)","Plan Volume"],
    "pk.once":         ["پرداخت یک‌باره","one-time"],
    "pk.pop":          ["محبوب","Popular"],
    "logo.alt":        ["نشان سی اف ایکس","CustomizeFund mark"],

    "cta.app":         ["ورود به پنل کاربری","Dashboard"],
"cta.dl":          ["دانلود اپلیکیشن","Download the app"],
    "cta.plan":        ["کاستومایز پلن","Build your own plan"],

    "hero.h1":         ['دسترسی آزاد<br>اختصاصی و بدون تحریم',
                        'Free Access<br>Built for Everyone'],
    "hero.sub":        ["با روزنه محدودیت‌ها را دور بزن؛ اینترنت پرسرعت با پینگ پایین برای گیمرها، دسترسی آزاد به سرویس‌های جهانی برای توسعه‌دهندگان، و آی‌پی اختصاصی پایدار.",
                        "Bypass restrictions with Rozaneh: high-speed network with low ping for gamers, seamless access to global tools for developers, and stable dedicated IPs."],
    "hero.note":       ["<b>اینترنت پایدار و بدون قطعی</b>؛ ابزاری برای آزادی دیجیتال.",
                        "<b>Stable & fast connection</b>; unrestricted digital access."],
    "hero.asideAria":  ["نمای نمونه از پارامترهای پلن","Sample view of the plan parameters"],
    "ap.ttl":          ["پنل آنالیز","Analytics panel"],
    "ap.bal":          ["بالانس","Balance"],
    "ap.eq":           ["اکویتی","Equity"],
    "ap.pl":           ["سود / زیان","Profit / Loss"],
    "ap.feed":         ["جریان زنده","Live feed"],
"ap.syms":         ["نمادهای معامله‌شده","Symbols traded"],
        "ap.wr":           ["Win rate","Win rate"],
    "hero.ribbon":     ["نمای پلن","Plan preview"],

    "tag.demo":        ["نمونه‌ی نمایشی","Demo view"],
    "tag.adjust":      ["قابل تنظیم","Adjustable"],
    "tag.live":        ["به‌روزرسانی زنده","Live update"],
    "tag.before":      ["پیش از فعال شدن","Before it triggers"],
    "tag.auto":        ["ثبت خودکار","Logged automatically"],
    "tag.ai":          ["تحلیل هوش مصنوعی","AI analysis"],

    "k.t1":            ["تارگت سود مرحله ۱","Stage 1 profit target"],
    "k.t2":            ["تارگت سود مرحله ۲","Stage 2 profit target"],
    "k.dd":            ["سقف افت روزانه","Daily drawdown limit"],
    "k.md":            ["سقف افت کلی","Overall drawdown limit"],
    "k.split":         ["پایداری سرورها","Server Uptime"],
    "k.split2":        ["درصد تقسیم سود","Profit split percentage"],
  "lc.title":       ["اگر سوالی دارید بپرسید","Have a question? Ask away"],
  "lc.ph":          ["سوالت را بنویس…","Type your question…"],
  "lc.send":        ["ارسال","Send"],
  "lc.h1":          ["تحلیل معاملات","Trade analysis"],
  "lc.h2":          ["آموزش هدفمند","Targeted learning"],
  "lc.h3":          ["پاسخ آنی","Instant answers"],
  "lc.limit":       ["برای ادامه‌ی گفتگو وارد اپ شو.","Sign in to continue the conversation."],
  "lc.cta":         ["ورود به پنل کاربری","Dashboard"],
    "k.eqdd":          ["افت روزانه از بالاترین اکوییتی","Daily drawdown from peak equity"],
    "k.eqddDesc":      ["سقف افت روزانه از بالاترین اکوییتی همان روز سنجیده می‌شود","Measured from that day’s peak equity instead of the opening balance"],
    "k.rShare":       ["سهم سود","Profit Share"],
    "k.growTtl":      ["امکانات و استانداردهای تضمین‌شده در تمامی اشتراک‌های روزنه:","Security & performance standards guaranteed on all Rozaneh plans:"],
    "k.realN1": ["بررسی و پرداخت سود روز شنبه‌ی هر هفته انجام می‌شود.","Profit is reviewed and paid every Saturday."],
    "k.realN2": ["برای برداشت سود، حساب باید به تارگت ۱۰٪ رسیده باشد.","To withdraw profit, the account must have reached the 10% target."],
    "k.sumT1": ["تعداد کاربر همزمان","Concurrent Users"],
    "k.sumT2": ["پروتکل‌های اتصال","Protocols"],
    "k.sumDL": ["کیفیت پینگ","Gaming Ping"],
    "k.sumML": ["موقعیت سرورها","Server Locations"],
    "k.days":          ["حداقل روز معاملاتی","Minimum trading days"],
    "k.ins":           ["بیمه‌ی حساب","Account insurance"],
    "k.insDesc":       ["پوشش یک‌باره در صورت رسیدن به سقف افت","A one-time cover if the drawdown limit is reached"],
    "k.flt":           ["ریسک شناور","Floating risk"],
    "k.fltDesc":       ["۳ درصد در تمام مراحل","3% in all stages"],
    "k.stages":        ["مرحله‌ها","Stages"],
    "k.ddmd":          ["افت روزانه و کلی","Daily and overall drawdown"],
    "k.yourSplit":     ["پهنای باند سرور","Port Bandwidth"],

    "sim.h2":          ['چالش را <em>بدون ریسک</em> تجربه کن','Try the challenge <em>with no risk</em>'],
    "sim.body":        ["پیش از خرید، حساب مجازی از ۵ هزار تا ۲۰۰ هزار دلار انتخاب کن و روی چارت زنده با قیمت‌های واقعی معامله کن. حجم، حد سود و حد ضرر را تعیین کن؛ اکویتی، سود و ضرر و دراوداون را لحظه‌به‌لحظه ببین و اگر به خط قرمز نزدیک شدی هشدار بگیر. مراحل چالش را همان‌طور که هست طی کن و در پایان بازده و وین‌ریت خودت را ببین.",
                        "Before you buy, pick a virtual account from $5,000 to $200,000 and trade a live chart on real prices. Set your lot size, take profit and stop loss; watch equity, open P/L and drawdown move moment by moment, and get an alert when you come close to the red line. Go through the challenge phases exactly as they are, and see your own return and win rate at the end."],
    "sim.free":        ["کاملاً رایگان","Completely free"],
    "sim.card":        ["CFX Trader","CFX Trader"],
    "sim.acct":        ["حساب مجازی ۲۵٬۰۰۰ دلاری","$25,000 virtual account"],
    "sim.balance":     ["بالانس","Balance"],
    "sim.equity":      ["اکویتی","Equity"],
    "sim.pnl":         ["سود و ضرر باز","Open P/L"],
    "sim.dd":          ["دراوداون","Drawdown"],
    "sim.alert":       ["اگر به سقف افت روزانه نزدیک شوی، پیش از رسیدن به خط قرمز هشدار می‌گیری.",
                        "As you approach the daily drawdown limit, you are alerted before you reach the red line."],
    "sim.lot":         ["حجم","Lot"],
    "sim.buy":         ["خرید","Buy"],
    "sim.sell":        ["فروش","Sell"],

    "plan.h2": ["پلن‌های اختصاصی <em>روزنه</em>", "Rozaneh <em>Dedicated Plans</em>"], /* CFX-CK16 */
    "plan.body": ["پلن خود را بین بسته‌های حجمی یا مصرف آزاد انتخاب کنید؛ تمامی پلن‌ها بدون محدودیت در تعداد کاربر و دستگاه متصل هستند.", "Choose between volume or unlimited plans; all plans support up to 5 concurrent users seamlessly."], /* CFX-CK8 */
    "plan.params":     ["پارامترهای پلن","Plan parameters"],"plan.fold":     ["تنظیم پارامترهای پلن","Adjust plan parameters"],
    "plan.opts":       ["گزینه‌های حساب","Account options"],
    "plan.sum":        ["خلاصه‌ی پلن","Plan summary"],
    "plan.foot":       ["این پنل یک ماکاپ بصری است. مقادیر را جابه‌جا کن تا ببینی پلن چطور با قوانین تو شکل می‌گیرد.",
                        "This panel is a visual mockup. Move the values to see how the plan takes shape around your rules."],
    "plan.ctaNote":    ["پلن خودت را در اپ بساز و از همان‌جا چالش را شروع کن.","Build your plan in the app and start the challenge from there."],

    "fp.h2":           ["مسیر راه‌اندازی و اتصال به روزنه","Getting Connected to Rozaneh"],
    "fp.body":         ["چهار قدم شفاف از انتخاب تا اتصال پایدار؛ بدون معطلی و بدون پیچیدگی فنی.",
                        "Four simple steps from plan selection to stable connection. No hassle, full transparency."],
    "fp.tag1":         ["انتخاب یا تست","Choose or Test"],
    "fp.t1":           ["بسته دلخواهت را انتخاب کن (یا تست بگیر)","Pick your plan or get a free trial"],
    "fp.d1":           ["بر اساس نیازت، بسته حجمی ماهانه یا مصرف آزاد (بدون تاریخ انقضا) را انتخاب کن. اگر هم قبل از پرداخت می‌خواهی کیفیت و پایداری شبکه را بسنجی، سهمیه تست رایگان ۲۴ ساعته در ربات تلگرام فعال است.",
                        "Select a monthly volume package or Pay-As-You-Go credit with no expiry. Want to verify network stability first? A 24-hour free test quota is available in our Telegram bot."],
    "fp.tag2":         ["تحویل آنی","Instant Delivery"],
    "fp.t2":           ["لینک اتصال را در ربات تلگرام تحویل بگیر","Receive your connection link instantly"],
    "fp.d2":           ["به محض انتخاب یا پرداخت، ربات تلگرام روزنه لینک سابسکریپشن اختصاصی شما را صادر می‌کند؛ بدون نیاز به معطلی در پی‌وی ادمین یا منتظر ماندن برای تایید دستی فاکتور.",
                        "Upon plan selection, the automated bot generates your personal subscription link immediately — no waiting for manual approval or admin replies."],
    "fp.tag3":         ["اتصال در برنامه","Connect in App"],
    "fp.t3":           ["لینک را در برنامه دلخواهت وارد کن","Import the link into your preferred app"],
    "fp.d3":           ["لینک دریافتی را با یک کلیک در برنامه‌های استاندارد (v2rayNG یا Hiddify در اندروید، V2Box یا Streisand در آیفون، و v2rayN در ویندوز) کپی و وارد کن تا به لوکیشن‌های اختصاصی متصل شوی.",
                        "Easily import your link into standard client apps: v2rayNG or Hiddify on Android, V2Box or Streisand on iOS, or v2rayN on Windows, and connect to dedicated European servers."],
    "fp.tag4":         ["مدیریت و تمدید","Manage & Renew"],
    "fp.t4":           ["استعلام لحظه‌ای حجم و تمدید بدون سوخت اعتبار","Real-time usage check & rollover renewal"],
    "fp.d4":           ["در هر لحظه حجم باقی‌مانده و وضعیت اتصال را داخل ربات ببین. در روزنه با ثبت تمدید، باقیمانده حجم دوره قبلی نمی‌سوزد و به بسته جدید منتقل می‌شود؛ پشتیبانی هم در ربات همیشه در دسترس است.",
                        "Check remaining traffic anytime in the bot. When you renew, leftover data never expires and rolls over to your next subscription."],
    "fp.note":         ["💡 برای شروع تست رایگان ۲۴ ساعته یا دریافت سریع اشتراک، کافیست وارد ربات تلگرام <b>@RoozanehNetBot</b> شوید.",
                        "💡 To get your 24-hour free trial or subscription, simply open our Telegram bot <b>@RoozanehNetBot</b>."],
    "an.h2":           ["<em>همراهی هوشمند</em> در کنار سرمایه؛<br>فراتر از یک حساب معاملاتی", "<em>Smart support</em> behind your capital,<br>more than just a trading account"],
    "an.body":         ["ما فقط سرمایه در اختیارتان نمی‌گذاریم؛ بلکه مسیر عبور از چالش و رشد حساب را با ابزارهای پیشرفته‌ی هوش مصنوعی هموار می‌کنیم. از تحلیل موقعیت‌ها و اعتبارسنجی ریسک پیش از معامله گرفته تا نظارت بر پارامترهای روانشناسی و حفظ سقف افت حساب، دستیار هوشمند شما در تمام لحظات بازار همراه شماست تا با انضباط کامل و کمترین خطا ترید کنید.", "We don't just give you capital. We make the path through the challenge, and the growth of your account after it, smoother with advanced AI tools. From analyzing positions and checking risk before you trade to tracking your trading psychology and protecting your drawdown limits, your smart assistant is with you at every moment in the market, so you can trade with full discipline and fewer mistakes."],
    "an.order":        ["سفارش پندینگ","Pending order"],
    "an.gold":         ["طلا در برابر دلار","Gold vs US dollar"],
    "an.entry":        ["قیمت ورود","Entry price"],
    "an.sl":           ["حد ضرر","Stop loss"],
    "an.tp":           ["حد سود","Take profit"],
    "an.lot":          ["حجم","Lot size"],
    "an.gap":          ["فاصله تا قیمت فعلی","Distance to current price"],
    "an.riskT":        ["سطح ریسک: متوسط","Risk level: moderate"],
    "an.riskD":        ["حجم با اندازه‌ی حساب سازگار است، اما فاصله‌ی ورود تا قیمت فعلی کم است.",
                        "The lot size fits the account, but the entry sits close to the current price."],
    "an.sum":          ["جمع‌بندی تحلیل","Analysis summary"],
    "an.c1t":          ["نسبت ریسک به ریوارد","Risk-to-reward ratio"],
    "an.c1d":          ["حد سود نسبت به حد ضرر در محدوده‌ی قابل قبول است.","Take profit sits in an acceptable range against the stop loss."],
    "an.c2t":          ["تناسب حجم با اندازه‌ی حساب","Lot size against account size"],
    "an.c2d":          ["ریسک این معامله از سرمایه‌ی حساب.","What this trade risks out of the account capital."],
    "an.c3t":          ["فاصله‌ی ورود تا قیمت فعلی","Distance from entry to current price"],
    "an.c3d":          ["سفارش نزدیک قیمت لحظه‌ای است و ممکن است زود فعال شود.","The order sits near the live price and may trigger early."],
    "an.c4t":          ["تطبیق با سقف افت روزانه","Against the daily drawdown limit"],
    "an.c4d":          ["در صورت خوردن حد ضرر، از سقف روزانه عبور نمی‌کنی.","If the stop is hit, you stay inside the daily limit."],
    "an.c5t":          ["تطبیق با سقف افت کلی","Against the overall drawdown limit"],
    "an.c5d":          ["فاصله‌ی باقی‌مانده تا سقف افت کلی حساب.","How much room is left before the account's overall limit."],
    "an.m1":           ["ریسک معامله","Trade risk"],
    "an.m2":           ["بازده هدف","Target return"],

    "sm.h2":           ["قبل از خرید، کیفیت روزنه را رایگان امتحان کن","Try Rozaneh Quality Free Before You Buy"],
    "sm.body":         ["۲ گیگابایت ترافیک تست رایگان ۴۸ ساعته؛ بدون نیاز به کارت بانکی، بدون ریسک و با تحویل فوری در ربات تلگرام.",
                        "2 GB free test traffic for 48 hours. No credit card required, instant bot delivery."],
    "sm.free":         ["مهلت ۴۸ ساعته رایگان","Free 48h access"],
    "sm.bal":          ["حجم هدیه تست","Free Test Volume"],
    "sm.eq":           ["مدت اعتبار","Validity Period"],
    "sm.pl":           ["کیفیت اتصال","Connection Quality"],
    "sm.pos":          ["پروتکل‌های فعال","Active Protocols"],
    "sm.dd":           ["پایداری تانل و سرورها","Tunnel & Server Stability"],
    "sm.lot":          ["پورت سرور","Server Port"],
    "jr.h2":           ['ثبت خودکار معاملات، <em>تحلیل هوشمند عملکرد</em>','Trades logged automatically, <em>performance analysed intelligently</em>'],
    "jr.body":         ["معامله که بسته شد، خودکار در ژورنال ثبت می‌شود. تو فقط چیزی را اضافه می‌کنی که هیچ دیتایی نشانش نمی‌دهد: حال آن لحظه. حس معامله، طبق‌پلن یا تکانشی، میزان اطمینان، و ستاپی که استفاده کردی. سپس هوش مصنوعی الگوهای رفتاری تو را شناسایی می‌کند — کجا از قوانین خودت فاصله گرفتی، کدام ستاپ برایت بهتر جواب داده، و کدام ساعت روز پرریسک‌تر بوده است.",
                        "The moment a trade closes it is logged in your journal automatically. You only add what no data can show: how you felt at that moment. The emotion behind the trade, whether it followed your plan or was impulsive, how confident you were, and the setup you used. Then AI identifies your behavioural patterns — where you drifted from your own rules, which setups have worked better for you, and which hours of the day have carried more risk."],
    "jf.t1":           ["معامله بسته می‌شود","The trade closes"],
    "jf.d1":           ["ثبت در ژورنال خودکار انجام می‌شود؛ بدون کار دستی.","It is logged in your journal automatically — nothing to fill in."],
    "jf.t2":           ["تو حال آن لحظه را اضافه می‌کنی","You add how it felt"],
    "jf.d2":           ["تنها چیزی که هیچ دیتایی نشانش نمی‌دهد.","The one thing no data can show."],
    "jf.t3":           ["هوش مصنوعی الگو را پیدا می‌کند","AI finds the pattern"],
    "jf.d3":           ["آنچه در تک‌تک معامله‌ها دیده نمی‌شود، در مجموعشان پیداست.","What no single trade reveals becomes visible across all of them."],
    "jr.card":         ["ثبت یک معامله","A single trade entry"],
    "jr.closed":       ["معامله‌ی بسته‌شده","Closed trade"],
    "jr.mood":         ["حس معامله","How the trade felt"],
    "jr.exec":         ["نحوه‌ی اجرا","How it was executed"],
    "jr.onplan":       ["طبق‌پلن","On plan"],
    "jr.impulse":      ["تکانشی","Impulsive"],
    "jr.conf":         ["میزان اطمینان","Confidence"],
    "jr.setup":        ["ستاپ استفاده‌شده","Setup used"],
    "jr.setupVal":    ["شکست ساختار و پولبک","Break of structure + pullback"],
    "ji.sig":          ["یافته‌ی هوش مصنوعی","AI finding"],
    "ji.quote":        ["در حالت انتقام‌جو، بیشترین فاصله را از پلن خودت گرفته‌ای — همان‌جایی که قوانین از همیشه لازم‌تر بودند.",
                        "In a revenge state you drift furthest from your own plan — exactly where the rules matter most."],
    "ji.f1t":          ["ساعت‌های پرریسک‌تر","Higher-risk hours"],
    "ji.f1d":          ["کدام بازه‌های روز بیشترین انحراف را داشته‌اند.","Which parts of the day carry the most drift."],
    "ji.f2t":          ["ستاپ‌های سازگارتر با تو","Setups that suit you"],
    "ji.f2d":          ["کدام ستاپ را باثبات‌تر اجرا کرده‌ای.","Which setup you execute most consistently."],
    "ji.f3t":          ["فاصله از قوانین خودت","Distance from your own rules"],
    "ji.f3d":          ["کجا از چیزی که خودت نوشتی عبور کرده‌ای.","Where you stepped past what you wrote yourself."],
    "jr.pat":          ["الگوهای رفتاری","Behavioural patterns"],
    "jr.chartT":       ["نسبت معامله‌های طبق‌پلن در هر حالت روانی","Share of on-plan trades in each emotional state"],
    "jr.hint":         ["هرچه بیشتر ثبت کنی، تصویر روشن‌تری از رفتار خودت می‌بینی: کجا از قوانینت فاصله گرفته‌ای، کدام ستاپ با کدام حال بهتر اجرا شده، و کدام ساعت‌ها برایت پرریسک‌تر بوده‌اند.",
                        "The more you log, the clearer the picture of your own behaviour becomes: where you drifted from your rules, which setup you execute best in which state, and which hours have carried more risk for you."],

    "mood.calm":       ["آرام","Calm"],
    "mood.sure":       ["مطمئن","Confident"],
    "mood.anx":        ["مضطرب","Anxious"],
    "mood.rev":        ["انتقام‌جو","Revenge"],
    "mood.greed":      ["طمع","Greed"],

    "dl.sub":          ["مدیریت پلن، CFX Trader، آنالیز لحظه‌ای حساب و ژورنال هوشمند",
                        "Plan management, CFX Trader, live account analytics and a smart journal."],
    "dl.scan":         ["اسکن کن","Scan"],
    "dl.ios":          ["برای آیفون","for iPhone"],
    "dl.android":      ["برای اندروید","for Android"],
    "dl.bazaar":       ["بازار","Bazaar"],
    "dl.myket":        ["مایکت","Myket"],
    "dl.alt":          ["نمای اپلیکیشن سی اف ایکس","CustomizeFund app preview"],
    "band.t":          ['ابزار کامل معامله‌گر حرفه‌ای','The complete pro trader toolkit'],

    "ftr.about":       ["اولین پلتفرم هوشمند پراپ‌تریدینگ که با ترکیب تأمین سرمایه و ابزارهای هوشمند، محیطی ایجاد کرده تا در هر مرحله از مسیر، تصمیم‌های آگاهانه‌تری بگیرید؛ از انتخاب پلن مناسب تا تحلیل معاملات و بررسی عملکرد.",
                        "The first intelligent prop-trading platform, combining funding with smart tools to create an environment where you make better-informed decisions at every step — from choosing the right plan to analysing your trades and reviewing your performance."],
    "ftr.product":     ["محصول","Product"],
    "ftr.sim":         ["CFX Trader","CFX Trader"],
    "ftr.journal":     ["ژورنال معاملات","Trading journal"],
    "ftr.articles":    ["مقالات آموزشی","Articles"],
    "ftr.terms":       ["قوانین و مقررات","Terms and rules"],
    "ftr.company":     ["شرکت","Company"],
    "ftr.contact":     ["تماس با ما","Contact us"],
    "ftr.support":     ["پشتیبانی","Support"],
    "ftr.disc":        ["معامله در بازارهای مالی با ریسک همراه است و ممکن است به از دست رفتن سرمایه منجر شود. سی اف ایکس ابزار تحلیل و مدیریت چالش است؛ مشاوره‌ی سرمایه‌گذاری ارائه نمی‌دهد و هیچ سود یا نتیجه‌ای را تضمین نمی‌کند.",
                        "Trading in financial markets carries risk and may lead to the loss of your capital. CustomizeFund is an analysis and challenge-management tool; it does not provide investment advice and does not guarantee any profit or outcome."],
    "ftr.cpy":         ["© سی اف ایکس — تمامی حقوق محفوظ است.","© CustomizeFund — All rights reserved."],

    "sw.on":           ["فعال","On"],
    "sw.off":          ["غیرفعال","Off"]
  };

  var LANG = "fa";
  function t(key){ var e = T[key]; return e ? (LANG === "fa" ? e[0] : e[1]) : ""; }

  var meta = document.querySelector('meta[name="description"]');

  window.setLang = setLang;
  function setLang(lang){
    if (lang !== "en" && lang !== "fa") return;
    LANG = (lang === "en") ? "en" : "fa";
    var i = LANG === "fa" ? 0 : 1;
    var root = document.documentElement;
    root.setAttribute("lang", LANG);
    root.setAttribute("dir", LANG === "fa" ? "rtl" : "ltr");
    if (window.__tkrLang) window.__tkrLang(LANG === "en");
    var rl = document.querySelector("#rail-lang .rail-lang");
    if (rl) rl.textContent = LANG === "en" ? "FA" : "EN";
    document.querySelectorAll("[data-i18n-ph]").forEach(function(el){
      var k = el.getAttribute("data-i18n-ph");
      if (T[k]) el.setAttribute("placeholder", T[k][i]);
    });

    document.querySelectorAll("[data-i18n]").forEach(function(el){
      var e = T[el.getAttribute("data-i18n")];
      if (e) el.textContent = e[i];
    });
    document.querySelectorAll("[data-i18n-html]").forEach(function(el){
      var e = T[el.getAttribute("data-i18n-html")];
      if (e) el.innerHTML = e[i];
    });
    document.querySelectorAll("[data-i18n-aria]").forEach(function(el){
      var e = T[el.getAttribute("data-i18n-aria")];
      if (e) el.setAttribute("aria-label", e[i]);
    });
    document.querySelectorAll("[data-i18n-alt]").forEach(function(el){
      var e = T[el.getAttribute("data-i18n-alt")];
      if (e) el.setAttribute("alt", e[i]);
    });

    /* عنوان و توضیحات صفحه از Next می‌آید — اینجا دست نمی‌خورد */


    document.querySelectorAll(".lang button").forEach(function(b){
      b.setAttribute("aria-pressed", String(b.getAttribute("data-lang") === LANG));
    });

    ranges.forEach(paint);
    sync();
    document.querySelectorAll(".sw").forEach(swLabel);
  }

  document.querySelectorAll(".lang button").forEach(function(b){
    b.addEventListener("click", function(){ var L = b.getAttribute("data-lang"); if(!L) return; setLang(L); try { localStorage.setItem("cfx-lang", LANG); } catch(e){} });
  });

  /* ---- mobile menu ---- */
  var burger = document.getElementById("burger");
  var sheet  = document.getElementById("msheet");
  var closeB = document.getElementById("msheet-close");
  function openMenu(on){
    if (!sheet || !burger) return;
    sheet.classList.toggle("open", on);
    burger.setAttribute("aria-expanded", String(on));
    document.body.style.overflow = on ? "hidden" : "";
    document.documentElement.classList.toggle("msheet-lock", on);
    if (on && closeB) closeB.focus();
    else if (!on) burger.focus();
  }
  if (burger) burger.addEventListener("click", function(){ openMenu(!sheet.classList.contains("open")); });
  if (closeB) closeB.addEventListener("click", function(){ openMenu(false); });
  if (sheet) sheet.querySelectorAll("nav a, .msheet-foot .btn").forEach(function(a){
    a.addEventListener("click", function(){ openMenu(false); });
  });
  document.addEventListener("keydown", function(ev){
    if (ev.key === "Escape" && sheet && sheet.classList.contains("open")) openMenu(false);
  });

  /* ---- initial language ---- */
  var saved = null;
  try { saved = localStorage.getItem("cfx-lang"); localStorage.removeItem("propai-lang"); } catch(e){}
  /* اولویت: انتخاب صریح کاربر > زبانی که سرور بر اساس دامنه تعیین کرده */
  var fromServer = document.documentElement.getAttribute("lang") === "en" ? "en" : "fa";
  setLang(saved === "en" || saved === "fa" ? saved : fromServer);
})();

/* ===== TICKER (demo data — later wired to /api/prices) ===== */
(function(){
  var T = document.getElementById('tkr-track');
  if(!T) return;
  var MK = [
    {ic:'Au', bg:'#53AEFD', fg:'#241B00', sym:'XAUUSD',  nm:['طلا (اونس)','Gold Spot'],        px:4644.09,  d:2},
    {ic:'Ag', bg:'#9AA5B1', fg:'#1B2027', sym:'XAGUSD',  nm:['نقره (اونس)','Silver Spot'],     px:68.877,   d:3},
    {ic:'\u20AC', bg:'#0B48B3', fg:'#B4DCFE', sym:'EURUSD', nm:['یورو / دلار','Euro vs Dollar'],  px:1.16625, d:5},
    {ic:'\u00A3', bg:'#B4223A', fg:'#fff', sym:'GBPUSD', nm:['پوند / دلار','Pound vs Dollar'],    px:1.36257, d:5},
    {ic:'\u00A5', bg:'#BC002D', fg:'#fff', sym:'USDJPY', nm:['دلار / ین','Dollar vs Yen'],        px:159.185, d:3},
    {ic:'A',  bg:'#00843D', fg:'#fff',    sym:'AUDUSD',  nm:['دلار استرالیا','Aussie vs Dollar'], px:0.71591, d:5},
    {ic:'N',  bg:'#1B4D89', fg:'#fff',    sym:'NZDUSD',  nm:['دلار نیوزیلند','Kiwi vs Dollar'],  px:0.59631, d:5},
    {ic:'D',  bg:'#0B3C7A', fg:'#fff',    sym:'.US30',   nm:['داوجونز','Dow Jones 30'],         px:53228.3,  d:1},
    {ic:'S',  bg:'#1E4DD8', fg:'#fff',    sym:'.US500',  nm:['اس‌اند‌پی ۵۰۰','S&P 500 Index'],   px:7657.93,  d:2},
    {ic:'N',  bg:'#0F7FA8', fg:'#fff',    sym:'.US100',  nm:['نزدک ۱۰۰','Nasdaq 100'],          px:29121.5,  d:1},
    {ic:'\u25CF', bg:'#3B4A3A', fg:'#C8D6BE', sym:'.USOil', nm:['نفت خام','WTI Crude Oil'],    px:86.374,   d:3},
    {ic:'D',  bg:'#1A1A1A', fg:'#ADD8FE', sym:'.DE40',   nm:['دکس آلمان','DAX 40'],             px:26138.80, d:2},
    {ic:'U',  bg:'#012169', fg:'#fff',    sym:'.UK100',  nm:['فوتسی ۱۰۰','FTSE 100'],           px:10837.2,  d:1},
    {ic:'J',  bg:'#8C1D2C', fg:'#fff',    sym:'.JP225',  nm:['نیکی ۲۲۵','Nikkei 225'],          px:65646.1,  d:1},
    {ic:'A',  bg:'#00594F', fg:'#fff',    sym:'.AUS200', nm:['اس‌اند‌پی استرالیا','ASX 200'],   px:9093.0,   d:1}
  ];
  function fmt(v,d){ return v.toLocaleString('en-US',{minimumFractionDigits:d,maximumFractionDigits:d}); }
  function card(m,i){
    var e = document.createElement('div');
    e.className = 'tk';
    e.setAttribute('data-idx', i);
    e.innerHTML =
      '<div class="tk-h"><span class="tk-ic lat" aria-hidden="true" style="--ic-bg:'+m.bg+';--ic-fg:'+m.fg+'">'+m.ic+'</span>'+
      '<span><span class="tk-sym lat">'+m.sym+'</span>'+
      '<span class="tk-nm" data-nm>'+m.nm[0]+'</span></span></div>'+
      '<div class="tk-b"><span class="tk-px lat" data-px>'+fmt(m.px,m.d)+'</span>'+
      '<span class="tk-ch lat" data-ch>+0.00%</span></div>';
    return e;
  }
  MK.forEach(function(m){ m.base = m.px; m.ch = 0; });
  function build(){
    T.innerHTML = '';
    for(var pass=0; pass<2; pass++){
      MK.forEach(function(m,i){ T.appendChild(card(m,i)); });
    }
  }
  build();
  function tick(){
    var i = Math.floor(Math.random()*MK.length), m = MK[i];
    m.px = m.px * (1 + (Math.random()-0.48) * 0.0016);
    m.ch = ((m.px - m.base) / m.base) * 100;
    var nodes = T.querySelectorAll('[data-idx="'+i+'"]');
    for(var k=0;k<nodes.length;k++){
      var n = nodes[k];
      var pxEl = n.querySelector('[data-px]'), chEl = n.querySelector('[data-ch]');
      pxEl.textContent = fmt(m.px, m.d);
      chEl.textContent = (m.ch>=0?'+':'') + m.ch.toFixed(2) + '%';
      n.classList.remove('up','dn'); n.classList.add(m.ch>=0?'up':'dn');
      pxEl.classList.remove('tk-flash'); void pxEl.offsetWidth; pxEl.classList.add('tk-flash');
    }
  }
  setInterval(tick, 2200);

  function paint(m, i){
    var nodes = T.querySelectorAll('[data-idx="' + i + '"]');
    for(var k=0;k<nodes.length;k++){
      var n = nodes[k];
      var pxEl = n.querySelector('[data-px]'), chEl = n.querySelector('[data-ch]');
      pxEl.textContent = fmt(m.px, m.d);
      chEl.textContent = (m.ch>=0?'+':'') + m.ch.toFixed(2) + '%';
      n.classList.remove('up','dn'); n.classList.add(m.ch>=0?'up':'dn');
      pxEl.classList.remove('tk-flash'); void pxEl.offsetWidth; pxEl.classList.add('tk-flash');
    }
  }

  function pull(){
    fetch('/api/ticker', { cache: 'no-store' })
      .then(function(r){ return r.ok ? r.json() : null; })
      .then(function(j){
        if(!j || !j.items || !j.items.length) return;
        var byS = {};
        for(var a=0;a<j.items.length;a++){ byS[j.items[a].sym] = j.items[a]; }
        for(var b=0;b<MK.length;b++){
          var live = byS[MK[b].sym];
          if(!live) continue;
          MK[b].px = live.px;
          MK[b].ch = live.ch;
          MK[b].base = live.px;
          if(typeof live.d === 'number') MK[b].d = live.d;
          paint(MK[b], b);
        }
      })
      .catch(function(){});
  }

  pull();
  setInterval(pull, 300000);
  window.__tkrLang = function(isEn){
    var nodes = T.querySelectorAll('.tk');
    for(var k=0;k<nodes.length;k++){
      var idx = +nodes[k].getAttribute('data-idx');
      nodes[k].querySelector('[data-nm]').textContent = MK[idx].nm[isEn?1:0];
    }
  };
})();

/* ===== RIGHT RAIL ===== */
(function(){
  var rail = document.getElementById('rail');
  if(!rail) return;

  var more = document.getElementById('rail-more');
  if(more) more.addEventListener('click', function(){
    var b = document.getElementById('burger');
    if(b) b.click();
  });

  var lang = document.getElementById('rail-lang');
  if(lang) lang.addEventListener('click', function(){
    var cur = document.documentElement.getAttribute('lang') === 'en' ? 'en' : 'fa';
    if (typeof setLang === 'function') setLang(cur === 'fa' ? 'en' : 'fa');
  });

  var items = rail.querySelectorAll('[data-rail]');
  var map = {};
  for(var i=0;i<items.length;i++) map[items[i].getAttribute('data-rail')] = items[i];

  var targets = [];
  ['top','plan','analysis','journal'].forEach(function(id){
    var el = document.getElementById(id);
    if(el) targets.push(el);
  });
  if(!('IntersectionObserver' in window) || !targets.length) return;

  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(en){
      if(!en.isIntersecting) return;
      for(var k in map) map[k].classList.remove('on');
      var t = map[en.target.id];
      if(t) t.classList.add('on');
    });
  }, {rootMargin:'-45% 0px -45% 0px', threshold:0});
  targets.forEach(function(t){ io.observe(t); });
})();


/* ===== LANG DROPDOWN ===== */
(function(){
  var wrap = document.querySelector('.hdr .lang');
  var tog  = document.getElementById('lang-tog');
  if(!wrap || !tog) return;
  tog.addEventListener('click', function(e){
    e.stopPropagation();
    var open = wrap.classList.toggle('open');
    tog.setAttribute('aria-expanded', String(open));
  });
  document.addEventListener('click', function(e){
    if(!wrap.contains(e.target)){ wrap.classList.remove('open'); tog.setAttribute('aria-expanded','false'); }
  });
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape'){ wrap.classList.remove('open'); tog.setAttribute('aria-expanded','false'); }
  });
  wrap.querySelectorAll('.lang-menu button').forEach(function(b){
    b.addEventListener('click', function(){
      wrap.classList.remove('open'); tog.setAttribute('aria-expanded','false');
      var cur = document.getElementById('lang-cur');
      if(cur) cur.textContent = b.getAttribute('data-lang') === 'en' ? 'EN' : 'FA';
    });
  });
  var mo = new MutationObserver(function(){
    var cur = document.getElementById('lang-cur');
    if(cur) cur.textContent = document.documentElement.getAttribute('lang') === 'en' ? 'EN' : 'FA';
  });
  mo.observe(document.documentElement, {attributes:true, attributeFilter:['lang']});
})();


/* ===== i18n refresh for late DOM (rail) ===== */
(function(){
  function refresh(){
    var L = document.documentElement.getAttribute('lang') === 'en' ? 'en' : 'fa';
    if (typeof window.setLang === 'function') window.setLang(L);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', refresh);
  else refresh();
})();


/* ===== PLAN PICKER — mirrors InlinePlanBuilder.calcPrice() ===== */
(function(){
  function getSizesEl(){ return document.getElementById('pk-sizes'); }
  function getAmtEl(){ return document.getElementById('pk-amt'); }

  // از data/pricing-config.json که سرور تزریق کرده
  var __LP_CFG = null;
  try {
    var __el = document.getElementById('lp-pricing');
    if (__el) __LP_CFG = JSON.parse(__el.textContent);
  } catch(e){}

  function lbl(sz){ return sz + ' گیگ'; }
  var PLANS = (__LP_CFG && __LP_CFG.plans ? __LP_CFG.plans : [])
    .filter(function(p){ return p.active; })
    .map(function(p){
      return { id:p.id, size:p.size, lbl:lbl(p.size), type:p.type,
               two:(p.basePrice&&p.basePrice.two)||0,
               real:(p.basePrice&&p.basePrice.real)||0,
               pop:!!p.isPopular };
    });
  var RULES = {
    p1:{def:10, down:10,  up:-5,  step:1},
    p2:{def:5,  down:10,  up:-5,  step:1},
    p3:{def:5,  down:-5,  up:10,  step:1},
    p4:{def:10, down:-5,  up:13,  step:1},
    p5:{def:80, down:-5,  up:10,  step:10}
  };
  var EXTRAS = {insurance:{defOn:false, eff:15}, floating:{defOn:true, eff:-15}, eqdd:{defOn:false, eff:-5}};

  var mode = 'two', cur = 'p75g', csz = 0; /* CFX-CS */
  function syncPick(){
    try{
      var el = document.querySelector('.pk-pick');
      if(!el) return;
      var __ex = Array.prototype.slice.call(document.querySelectorAll('.sw[data-key]')).filter(function(b){return b.getAttribute('aria-checked')==='true';}).map(function(b){return b.getAttribute('data-key');}).join(',');
      el.setAttribute('href', '/app?section=builder&plan=' + (csz ? 'p' + csz : cur) + '&mode=' + mode + '&buy=1&ext=' + __ex);
    }catch(e){}
  }

  function slide(id){
    var el = document.getElementById(id), r = RULES[id];
    if(!el || !r) return 0;
    var diff = (+el.value) - r.def;
    if(diff === 0) return 0;
    return Math.abs(diff / r.step) * (diff < 0 ? r.down : r.up);
  }
  function calc(){
    var base = curBase();
    if(!base) return 0;
    return Math.max(0, Math.round(base));
  }
  function rowOf(el){
    var n = el;
    while(n && n !== document.body){
      if(n.classList && (n.classList.contains('ctl') || n.classList.contains('sw-row') || n.classList.contains('chk'))) return n;
      n = n.parentNode;
    }
    return el.parentNode;
  }
  function syncRows(){
    // Permanently hide all legacy prop-firm sliders & switches so both tabs have identical clean card height
    ['p1','p2','p3','p4','p5','p6','pr1'].forEach(function(id){
      var el = document.getElementById(id);
      if(el) rowOf(el).style.display = 'none';
    });
    document.querySelectorAll('.ctl, .ctl-fold, .sw-row, .card:first-child .card-b > .sw-row').forEach(function(el){
      el.style.display = 'none';
    });
  }
  /* مراحل رشد حساب ریل — آینه‌ی GROWTH_MULT در InlinePlanBuilder */
  var ROZ_FEATURES = [
    {
      emoji: '⚡',
      title: 'سرعت و پایداری شبکه',
      desc: 'اتصال روان بدون لودینگ با ترافیک واقعی ۱:۱'
    },
    {
      emoji: '🌍',
      title: 'لوکیشن‌های اختصاصی',
      desc: '<span class="flag-pill">🇬🇧 انگلیس</span> <span class="flag-pill">🇳🇱 هلند</span> <span class="flag-pill iran">🇮🇷 تانل ایران</span>'
    },
    {
      emoji: '🛡️',
      title: 'ضد نشت DNS و IP',
      desc: 'آی‌پی تمیز و پایدار مناسب ترید'
    },
    {
      emoji: '🤖',
      title: 'سازگار با انواع هوش مصنوعی',
      desc: 'دسترسی بدون تحریم به ChatGPT و Claude'
    },
    {
      emoji: '📱',
      title: 'بدون محدودیت کاربر',
      desc: 'اتصال همزمان انواع گوشی، لپ‌تاپ و تبلت'
    },
    {
      emoji: '🤝',
      title: 'ضمانت کیفیت و پشتیبانی',
      desc: 'پشتیبانی ۲۴/۷ + تضمین بازگشت کامل وجه'
    }
  ];

  function paintGrowth(){
    var box = document.getElementById('lp-grow');
    var grid = document.getElementById('lp-grow-grid');
    if(!box || !grid) return;
    box.style.display = '';
    
    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = 'repeat(2, minmax(0, 1fr))';
    grid.style.gap = '10px';
    grid.style.direction = 'rtl';
    grid.style.marginTop = '10px';

    var html = '';
    for(var i = 0; i < ROZ_FEATURES.length; i++){
      var item = ROZ_FEATURES[i];
      html += '<div class="lp-grow-box" style="display:flex;align-items:center;gap:10px;padding:9px 12px;min-height:54px;box-sizing:border-box;background:linear-gradient(155deg, rgba(24,28,37,0.92), rgba(15,23,42,0.85));border:1px solid rgba(255,255,255,0.08);border-radius:12px;direction:rtl;text-align:right">' +
              '<span class="lp-grow-emoji" style="font-size:20px;line-height:1;width:34px;height:34px;min-width:34px;border-radius:9px;display:grid;place-items:center;background:rgba(79,169,250,0.12);border:1px solid rgba(79,169,250,0.25)">' + item.emoji + '</span>' +
              '<div style="display:flex;flex-direction:column;gap:2px;min-width:0;flex:1 1 auto">' +
              '<span style="font-size:13px;font-weight:800;color:#f2efe9;line-height:1.2">' + item.title + '</span>' +
              '<span style="font-size:11px;font-weight:500;color:#808a97;line-height:1.3">' + item.desc + '</span>' +
              '</div>' +
              '</div>';
    }
    grid.innerHTML = html;
  }
  /* کارت خلاصه — آینه‌ی pb-sum-rows در InlinePlanBuilder */
  function __LP_SUMROW_ALL(id, label, val){
    var e = document.getElementById(id);
    if(!e) return;
    e.classList.remove('lat');
    e.setAttribute('dir', 'rtl');
    e.innerHTML = val;
    var row = rowById(id);
    if(row){
      var k = row.querySelector('.k');
      if(k) k.textContent = label;
      row.style.display = 'flex';
    }
  }
  function rowById(id){
    var e = document.getElementById(id);
    if(!e) return null;
    var n = e;
    while(n && n !== document.body){
      if(n.classList && n.classList.contains('rrow')) return n;
      n = n.parentNode;
    }
    return null;
  }
  function paintSummary(){
    var en = isEn();
    if(mode === 'real'){
      __LP_SUMROW_ALL('s-t1', en ? 'Plan Model' : 'مدل تعرفه', en ? 'Pay As You Go' : 'مصرف آزاد (اعتباری)');
      __LP_SUMROW_ALL('s-t2', en ? 'Validity' : 'مهلت مصرف', en ? 'No Expiry' : 'بدون تاریخ انقضا');
      __LP_SUMROW_ALL('s-dl', en ? 'Rate per GB' : 'نرخ هر گیگ', en ? '8,000 Tomans' : '۸,۰۰۰ تومان مقطوع');
      __LP_SUMROW_ALL('s-ml', en ? 'User Limit' : 'تعداد کاربر', en ? 'Unlimited' : 'بدون محدودیت کاربر');
      __LP_SUMROW_ALL('s-split', en ? 'Locations' : 'موقعیت سرور', en ? 'UK, NL + Iran' : 'انگلیس، هلند + تانل ایران');
      ['s-ins','s-flt'].forEach(function(id){
        var r = rowById(id); if(r) r.style.display = 'none';
      });
      var sub = document.querySelector('.pk-price .per');
      if(sub) sub.textContent = en ? 'Credit top-up (no expiry)' : 'شارژ اعتباری (بدون تاریخ انقضا)';
    } else {
      __LP_SUMROW_ALL('s-t1', en ? 'User Limit' : 'تعداد کاربر', en ? 'Unlimited' : 'بدون محدودیت کاربر');
      __LP_SUMROW_ALL('s-t2', en ? 'Protocols' : 'پروتکل‌های اتصال', 'Reality & VLESS');
      __LP_SUMROW_ALL('s-dl', en ? 'Connection Quality' : 'کیفیت اتصال', en ? 'Stable & No Disconnect' : 'پایدار و بدون قطعی');
      __LP_SUMROW_ALL('s-ml', en ? 'Server Locations' : 'موقعیت سرورها', en ? 'UK, NL + Iran' : 'انگلیس، هلند + تانل ایران');
      __LP_SUMROW_ALL('s-split', en ? 'Server Port' : 'پورت شبکه سرور', en ? '1Gbps Datacenter' : '۱Gbps پرسرعت دیتاسنتر');
      var subB = document.querySelector('.pk-price .per');
      if(subB) subB.textContent = en ? 'Monthly' : 'پرداخت یک‌ماهه';
    }
  }
  function syncGridMode(){
    var g = document.querySelector('.plan-grid');
    if(!g) return;
    g.classList.toggle('lp-real-mode', mode === 'real');
  }
  function paint(){
    csClamp();
    syncPick();
    syncGridMode();
    syncRows();
    paintGrowth();
    paintSummary();
    var amtEl = getAmtEl();
    if(amtEl) amtEl.textContent = Number(calc()).toLocaleString('fa-IR');
    csUI();
  }
  function isEn(){ return document.documentElement.getAttribute('lang') === 'en'; }

  function build(){
    var sizesEl = document.getElementById('pk-sizes');
    if(!sizesEl) return;
    sizesEl.innerHTML = '';
    PLANS.filter(function(pl){
      return (mode === 'two' ? pl.two : pl.real) > 0;
    }).forEach(function(pl){
      var avail = (pl.type === mode || pl.type === 'both');
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'pk-size' + (pl.id === cur && !csz ? ' on' : '');
      b.setAttribute('data-id', pl.id);
      if(!avail) b.disabled = true;
      /* محبوب: دو مرحله‌ای → $10K · ریل → $2K */
      var isPop = (mode === 'two') ? (pl.id === 'p75g') : (pl.id === 'pay50g');
      var titleHtml = isEn()
        ? '<div class="pk-val-wrap" dir="ltr"><span class="pk-val-num lat">' + pl.size + '</span><span class="pk-val-unit">GB</span></div>'
        : '<div class="pk-val-wrap" dir="rtl"><span class="pk-val-num lat">' + pl.size + '</span><span class="pk-val-unit">گیگ</span></div>';
      b.innerHTML = titleHtml +
        (isPop ? '<span class="pop">'+(isEn()?'Popular':'محبوب')+'</span>' : '');
      b.addEventListener('click', function(){
        cur = pl.id; csz = 0; build(); paint();
      });
      sizesEl.appendChild(b);
    });
    // اگر اندازه‌ی فعلی در این نوع موجود نیست، برو روی اولین موجود
    var c = PLANS.filter(function(x){ return x.id === cur; })[0];
    var okNow = c && (mode === 'two' ? c.two : c.real) > 0 && (c.type === mode || c.type === 'both');
    if(!okNow){
      /* پیش‌فرض هر حالت: دو مرحله‌ای → $10K · ریل → $2K */
      var want = (mode === 'two') ? 'p75g' : 'pay50g';
      var f = PLANS.filter(function(x){
        return (x.type === mode || x.type === 'both') && (mode === 'two' ? x.two : x.real) > 0;
      });
      var pick = f.filter(function(x){ return x.id === want; })[0] || f[0];
      if(pick){ cur = pick.id; build(); }
    }
  }

  (function(){
    var pr = document.getElementById('pr1');
    if(pr) pr.addEventListener('input', paint);
  })();

  document.addEventListener('click', function(e){
    var b = e.target.closest('#pk-modes .pk-mode');
    if(!b) return;
    document.querySelectorAll('#pk-modes .pk-mode').forEach(function(x){ x.classList.remove('on'); });
    b.classList.add('on');
    mode = b.getAttribute('data-mode');
    build(); paint();
  });

  ['p1','p2','p3','p4','p5'].forEach(function(id){
    var el = document.getElementById(id);
    if(el) el.addEventListener('input', paint);
  });
  document.querySelectorAll('.sw[data-key]').forEach(function(b){
    b.addEventListener('click', function(){ setTimeout(paint, 0); });
  });
  new MutationObserver(function(){ build(); }).observe(
    document.documentElement, {attributes:true, attributeFilter:['lang']});

  /* ===== CFX-CS: custom account size (type / wheel / drag / +-) — price = linear interpolation between tiers, same as server ===== */
  var CS_MIN = 25, CS_MAX = 150, CS_STEP = 5;
  function csTiers(){
    return PLANS.filter(function(p){ return (p.type === mode || p.type === 'both') && (mode === 'two' ? p.two : p.real) > 0; })
      .map(function(p){ return { s:p.size, b:(mode === 'two' ? p.two : p.real), id:p.id }; })
      .sort(function(a, b){ return a.s - b.s; });
  }
  function csBounds(){
    var L = csTiers();
    if(!L.length) return null;
    var min = (mode === 'real') ? 10 : 25;
    var max = (mode === 'real') ? 200 : 150;
    return { min: min, max: max };
  }
  function csInterp(size){
    if(mode === 'real') return size * 8000;
    var L = csTiers();
    for(var i = 0; i < L.length; i++) if(L[i].s === size) return L[i].b;
    for(var j = 1; j < L.length; j++){ var a = L[j-1], b = L[j]; if(size > a.s && size < b.s) return a.b + (b.b - a.b) * (size - a.s) / (b.s - a.s); }
    return size * 8000;
  }
  function curPlan(){ return PLANS.filter(function(x){ return x.id === cur; })[0]; }
  function curSize(){ if(csz) return csz; var p = curPlan(); return p ? p.size : 0; }
  function curBase(){ if(csz) return csInterp(csz); var p = curPlan(); return p ? (mode === 'two' ? p.two : p.real) : 0; }
  function csClamp(){
    if(!csz) return;
    var bd = csBounds(); if(!bd){ csz = 0; return; }
    csz = Math.min(bd.max, Math.max(bd.min, csz));
    var hit = csTiers().filter(function(t){ return t.s === csz; })[0];
    if(hit){ cur = hit.id; csz = 0; build(); }
  }
  var csBox = document.getElementById('pk-cs'), csIn = document.getElementById('pk-cs-in'), csW = document.getElementById('pk-cs-wheel');
  var csFocus = false;
  function csFmt(n){ return Number(n).toLocaleString('en-US'); }
  function csDigits(s){ return String(s).replace(/[۰-۹]/g, function(c){ return String(c.charCodeAt(0) - 0x06F0); }).replace(/[٠-٩]/g, function(c){ return String(c.charCodeAt(0) - 0x0660); }).replace(/[^0-9]/g, ''); }
  function csSet(n){
    var bd = csBounds(); if(!bd || !isFinite(n)) return;
    n = Math.min(bd.max, Math.max(bd.min, Math.round(n / CS_STEP) * CS_STEP));
    if(n === curSize()) return;
    var hit = csTiers().filter(function(t){ return t.s === n; })[0];
    if(hit){ cur = hit.id; csz = 0; } else { csz = n; }
    build(); paint();
  }
  function csStep(d){
    var bd = csBounds(); if(!bd) return;
    var n = Math.min(bd.max, Math.max(bd.min, curSize() + d * CS_STEP));
    if(n === curSize()) return;
    if(csW){ csW.classList.remove('up', 'dn'); void csW.offsetWidth; csW.classList.add(d > 0 ? 'up' : 'dn'); }
    csSet(n);
  }
  function csUI(){
    if(!csBox) return;
    var bd = csBounds();
    csBox.style.display = bd ? '' : 'none';
    if(!bd) return;
    var v = curSize();
    csBox.classList.toggle('on', !!csz);
    if(csIn && !csFocus) csIn.value = csFmt(v);
    var q = function(sel, txt){ Array.prototype.forEach.call(csBox.querySelectorAll(sel), function(e){ e.textContent = txt; }); };
    q('.pk-cs-min', csFmt(bd.min) + ' GB'); q('.pk-cs-max', csFmt(bd.max) + ' GB');
    if(csW){
      var basePr = curBase();
      var thousands = Math.round(basePr / 5000) * 5;
      csW.innerHTML = '<div class="pk-cs-pr-wrap" dir="rtl">' +
        '<span class="pk-cs-pr-num lat">' + Number(thousands).toLocaleString('fa-IR') + '</span> ' +
        '<span class="pk-cs-pr-unit">هزار تومن</span>' +
        '</div>';
    }
    var fill = document.getElementById('pk-cs-fill');
    if(fill) fill.style.width = Math.max(0, Math.min(100, (v - bd.min) / Math.max(1, bd.max - bd.min) * 100)) + '%';
    var tk = document.getElementById('pk-cs-ticks');
    if(tk){
      var key = mode + bd.min + '-' + bd.max;
      if(tk.getAttribute('data-k') !== key){
        tk.setAttribute('data-k', key);
        tk.innerHTML = csTiers().filter(function(t){ return t.s >= bd.min && t.s <= bd.max; }).map(function(t){
          return '<span style="left:' + ((t.s - bd.min) / Math.max(1, bd.max - bd.min) * 100) + '%"></span>';
        }).join('');
      }
    }
  }
  if(csBox){
    var csAcc = 0;
    var csWheel = function(e){ e.preventDefault(); csAcc += e.deltaY; if(Math.abs(csAcc) >= 40){ csStep(csAcc < 0 ? 1 : -1); csAcc = 0; } };
    [csW, csIn].forEach(function(el){ if(el) el.addEventListener('wheel', csWheel, { passive:false }); });
    if(csW){
      csW.addEventListener('click', function(){ if(csIn) csIn.focus(); });
    }
    if(csIn){
      csIn.addEventListener('focus', function(){ csFocus = true; });
      csIn.addEventListener('input', function(){
        var d = csDigits(csIn.value).slice(0, 6);
        csIn.value = d ? csFmt(+d) : '';
        var bd = csBounds(), n = +d;
        if(d && bd && n >= bd.min && n <= bd.max) csSet(n);
      });
      csIn.addEventListener('blur', function(){ csFocus = false; var d = csDigits(csIn.value); csSet(d ? +d : curSize()); csUI(); });
      csIn.addEventListener('keydown', function(e){
        if(e.key === 'Enter'){ csIn.blur(); }
        else if(e.key === 'ArrowUp'){ e.preventDefault(); csStep(1); }
        else if(e.key === 'ArrowDown'){ e.preventDefault(); csStep(-1); }
        else if(e.key === 'PageUp'){ e.preventDefault(); csStep(10); }
        else if(e.key === 'PageDown'){ e.preventDefault(); csStep(-10); }
      });
    }
    Array.prototype.forEach.call(csBox.querySelectorAll('.pk-cs-btn'), function(b){
      var d = +b.getAttribute('data-d'), t = null, k = 0;
      var stop = function(){ clearTimeout(t); t = null; };
      b.addEventListener('pointerdown', function(e){ e.preventDefault(); csStep(d); k = 0; t = setTimeout(function rep(){ csStep(d); k++; t = setTimeout(rep, k > 8 ? 45 : 90); }, 380); });
      ['pointerup', 'pointerleave', 'pointercancel'].forEach(function(ev){ b.addEventListener(ev, stop); });
      b.addEventListener('contextmenu', function(e){ e.preventDefault(); });
    });
  }
  /* ===== CFX-CS END ===== */

  build(); paint();
  setInterval(function(){
    var el = document.getElementById('pk-sizes');
    if(el && el.children.length === 0){
      build(); paint();
    }
  }, 150);
})();


/* ===== HERO ANALYTICS — live series ===== */
(function(){
  var eqL=document.getElementById('ap-eq-line'), eqF=document.getElementById('ap-eq-fill'),
      eqD=document.getElementById('ap-eq-dot'),  eqV=document.getElementById('ap-eqv'),
      rkL=document.getElementById('ap-rk-line'), rkF=document.getElementById('ap-rk-fill'),
      rkD=document.getElementById('ap-rk-dot'),  rkV=document.getElementById('ap-rkv');
  if(!eqL||!rkL) return;
  var kv=document.querySelectorAll('.ap-kpi .v'), kEq=kv[1], kPl=kv[2];
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){ /* still draw once */ }

  var N=44, W=300, H=88;
  var eq=[], rk=[], seed=7723;
  function rnd(){ seed=(seed*1103515245+12345)&0x7fffffff; return seed/0x7fffffff; }

  var v=70;
  for(var i=0;i<N;i++){ v=Math.max(14,Math.min(80, v-(rnd()-0.40)*7)); eq.push(v); }
  var r=62;
  for(var j=0;j<N;j++){ r=Math.max(30,Math.min(80, r+(rnd()-0.5)*11)); rk.push(r); }

  function path(a){
    var d='', st=W/(a.length-1);
    for(var i=0;i<a.length;i++) d+=(i?'L':'M')+(i*st).toFixed(1)+' '+a[i].toFixed(1)+' ';
    return d.trim();
  }
  function draw(){
    var pe=path(eq);
    eqL.setAttribute('d', pe);
    eqF.setAttribute('d', pe+' L'+W+' '+H+' L0 '+H+' Z');
    eqD.setAttribute('cx', W); eqD.setAttribute('cy', eq[eq.length-1].toFixed(1));
    var pr=path(rk);
    rkL.setAttribute('d', pr);
    rkF.setAttribute('d', pr+' L'+W+' '+H+' L0 '+H+' Z');
    rkD.setAttribute('cx', W); rkD.setAttribute('cy', rk[rk.length-1].toFixed(1));

    var pnl=Math.round((80-eq[eq.length-1])*11.4);
    var sg=pnl<0?'-':'+', ab=Math.abs(pnl).toLocaleString('en-US');
    if(eqV) eqV.textContent=sg+'$'+ab;
    if(kPl) kPl.textContent=sg+'$'+ab;
    if(kEq) kEq.textContent='$'+(25000+pnl).toLocaleString('en-US');
    if(rkV){ var risk=((80-rk[rk.length-1])/80*1.6).toFixed(2);
      rkV.textContent=risk+'%'; }
  }
  draw();

  __lpRaf(function(){
    eq.shift(); v=Math.max(14,Math.min(80, v-(Math.random()-0.42)*7)); eq.push(v);
    rk.shift(); r=Math.max(30,Math.min(80, r+(Math.random()-0.5)*11)); rk.push(r);
    draw();
  }, 1600);
})();


/* ===== SIMULATOR — Live Network Oscilloscope Waveform ===== */
(function(){
  var svg = document.getElementById('sm-svg');
  if(!svg) return;
  var W = 600, H = 280, N = 36;
  var step = W / (N - 1);
  var pts = [];
  var baseSpeed = 145; // Mbps

  for(var i = 0; i < N; i++){
    var angle = (i / N) * Math.PI * 4;
    var v = baseSpeed + Math.sin(angle) * 18 + (Math.random() - 0.5) * 8;
    pts.push(v);
  }

  function draw(){
    var minVal = 100, maxVal = 200;
    function getY(v){
      return H - ((v - minVal) / (maxVal - minVal)) * (H * 0.72) - (H * 0.14);
    }

    var pathD = '';
    var areaD = 'M 0 ' + H;
    for(var i = 0; i < pts.length; i++){
      var x = i * step;
      var y = getY(pts[i]);
      if(i === 0){
        pathD += 'M ' + x.toFixed(1) + ' ' + y.toFixed(1);
        areaD += ' L ' + x.toFixed(1) + ' ' + y.toFixed(1);
      } else {
        var prevX = (i - 1) * step;
        var prevY = getY(pts[i - 1]);
        var cpx = (prevX + x) / 2;
        pathD += ' C ' + cpx.toFixed(1) + ' ' + prevY.toFixed(1) + ', ' + cpx.toFixed(1) + ' ' + y.toFixed(1) + ', ' + x.toFixed(1) + ' ' + y.toFixed(1);
        areaD += ' C ' + cpx.toFixed(1) + ' ' + prevY.toFixed(1) + ', ' + cpx.toFixed(1) + ' ' + y.toFixed(1) + ', ' + x.toFixed(1) + ' ' + y.toFixed(1);
      }
    }
    areaD += ' L ' + W + ' ' + H + ' Z';

    var lastX = (pts.length - 1) * step;
    var lastY = getY(pts[pts.length - 1]);

    var svgContent = '<defs>' +
      '<linearGradient id="sm-area-grad" x1="0%" y1="0%" x2="0%" y2="100%">' +
        '<stop offset="0%" stop-color="#00a8ff" stop-opacity="0.35"/>' +
        '<stop offset="85%" stop-color="#00a8ff" stop-opacity="0.04"/>' +
        '<stop offset="100%" stop-color="#00a8ff" stop-opacity="0"/>' +
      '</linearGradient>' +
      '<filter id="smg" x="-20%" y="-20%" width="140%" height="140%">' +
        '<feGaussianBlur stdDeviation="3" result="glow"/>' +
        '<feMerge><feMergeNode in="glow"/><feMergeNode in="SourceGraphic"/></feMerge>' +
      '</filter>' +
      '</defs>' +
      '<path d="' + areaD + '" fill="url(#sm-area-grad)"/>' +
      '<path d="' + pathD + '" fill="none" stroke="#00e5ff" stroke-width="2.6" filter="url(#smg)"/>' +
      '<circle cx="' + lastX.toFixed(1) + '" cy="' + lastY.toFixed(1) + '" r="5" fill="#00e5ff" filter="url(#smg)"/>' +
      '<circle cx="' + lastX.toFixed(1) + '" cy="' + lastY.toFixed(1) + '" r="10" fill="none" stroke="#00e5ff" stroke-width="1.5" opacity="0.6"/>';

    svg.innerHTML = svgContent;

    var cur = Math.round(pts[pts.length - 1]);
    var speedBadge = document.getElementById('sm-speed-badge');
    if(speedBadge) speedBadge.textContent = 'سرعت زنده: ~' + cur + ' Mbps';

    var pxEl = document.getElementById('sm-px');
    if(pxEl) pxEl.textContent = '۲,۰۴۸ MB تست رایگان';

    var enBadge = document.getElementById('sm-en');
    if(enBadge) enBadge.style.top = ((lastY / H) * 100).toFixed(1) + '%';
  }

  draw();

  __lpRaf(function(){
    pts.shift();
    var last = pts[pts.length - 1];
    var next = last + (Math.random() - 0.49) * 12;
    next = Math.max(125, Math.min(185, next));
    pts.push(next);
    draw();
  }, 1200);
})();



/* ===== LANDING CHAT — همان /api/chat اپ، حالت مهمان ===== */
(function(){
  var box   = document.getElementById('lc-box');
  var log   = document.getElementById('lc-log');
  var input = document.getElementById('lc-input');
  var send  = document.getElementById('lc-send');
  var cta   = document.getElementById('lc-cta');
  if(!box || !log || !input || !send) return;

  var history = [];
  var busy = false;

  function isEn(){ return document.documentElement.getAttribute('lang') === 'en'; }
  function tr(key){
    var d = {
      'lc.err': ['ارتباط برقرار نشد. دوباره تلاش کن.', 'Connection failed. Please try again.']
    }[key];
    return d ? (isEn() ? d[1] : d[0]) : '';
  }

  function bubble(role, text){
    log.classList.add('on');
    var el = document.createElement('div');
    el.className = 'lc-m ' + (role === 'user' ? 'u' : 'a');
    el.textContent = text || '';
    log.appendChild(el);
    log.scrollTop = log.scrollHeight;
    return el;
  }

  function lock(on){
    busy = on;
    send.disabled = on;
    input.disabled = on;
  }

  function limitReached(){
    box.hidden = true;
    if(cta) cta.hidden = false;
  }

  async function ask(q){
    if(busy || !q) return;
    lock(true);
    bubble('user', q);
    input.value = '';
    var out = bubble('assistant', '');
    var typed = '';

    try{
      var res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: q,
          lang: isEn() ? 'en' : 'fa',
          history: history.slice(-10)
        })
      });

      var ct = res.headers.get('content-type') || '';
      if(ct.indexOf('text/event-stream') === -1 || !res.body){
        var j = null;
        try { j = await res.json(); } catch(e){}
        out.textContent = (j && (j.text || j.message || j.error)) || tr('lc.err');
        lock(false);
        return;
      }

      var reader  = res.body.getReader();
      var decoder = new TextDecoder();
      var buf = '', limited = false;

      while(true){
        var chunk = await reader.read();
        if(chunk.done) break;
        buf += decoder.decode(chunk.value, { stream: true });
        var parts = buf.split('\n');
        buf = parts.pop() || '';
        for(var i = 0; i < parts.length; i++){
          var line = parts[i];
          if(line.indexOf('data: ') !== 0) continue;
          try{
            var json = JSON.parse(line.slice(6));
            if(json.text){
              typed += json.text;
              out.textContent = typed;
              log.scrollTop = log.scrollHeight;
            }
            if(json.guestLimited) limited = true;
          }catch(e){}
        }
      }

      if(!typed) out.textContent = tr('lc.err');
      history.push({ role: 'user', content: q });
      history.push({ role: 'assistant', content: typed });
      lock(false);
      if(limited) limitReached();

    }catch(e){
      out.textContent = tr('lc.err');
      lock(false);
    }
  }

  send.addEventListener('click', function(){ ask(input.value.trim()); });
  input.addEventListener('keydown', function(e){
    if(e.key === 'Enter'){ e.preventDefault(); ask(input.value.trim()); }
  });
})();

}

/* === PLAN-FOLD-DESKTOP: روی دسکتاپ پارامترها همیشه باز === */
(function(){
  var mq = window.matchMedia("(min-width: 901px) and (hover: hover)");
  function apply(){
    document.querySelectorAll(".ctl-fold").forEach(function(d){ d.open = mq.matches; });
  }
  apply();
  if (mq.addEventListener) mq.addEventListener("change", apply);
})();
/* === END PLAN-FOLD-DESKTOP === */

/* ===== CFX-LPV: landing plan picker — plan title bar, prices on size cards, perks inside the summary (v2) ===== */
(function(){
  var amt = document.getElementById('pk-amt');
  if(!amt) return;
  var sumCard = amt.closest('.card');
  var body = sumCard && sumCard.querySelector('.card-b');
  var pick = document.querySelector('.plan-grid .pk-pick');
  var sizes = document.getElementById('pk-sizes');
  if(!sumCard || !body || !pick || !sizes) return;
  var cfg = null;
  try { var j = document.getElementById('lp-pricing'); if(j) cfg = JSON.parse(j.textContent); } catch(e){}
  var PL = {};
  ((cfg && cfg.plans) || []).forEach(function(p){ PL[p.id] = p; });
  function en(){ return document.documentElement.getAttribute('lang') === 'en'; }
  function num(s){ return parseInt(String(s || '').replace(/[^0-9]/g, ''), 10) || 0; }
  function kfmt(n){ return n + ' گیگابایت'; }
  function mode(){ var b = document.querySelector('#pk-modes .pk-mode.on'); return b ? b.getAttribute('data-mode') : 'two'; }
  function size(){
    var cs = document.getElementById('pk-cs');
    if(cs && cs.classList.contains('on')){ var n = num((document.getElementById('pk-cs-in') || {}).value); if(n) return n; }
    var b = sizes.querySelector('.pk-size.on'); var p = b && PL[b.getAttribute('data-id')];
    return p ? p.size : 0;
  }
  var head = document.createElement('div'); head.className = 'lpv2-head';
  sumCard.insertBefore(head, sumCard.firstChild);
  var perks = document.createElement('ul'); perks.className = 'lpv2-perks';
  body.appendChild(perks); body.appendChild(pick);
  document.documentElement.classList.add('lpv2-on');
  var CHK = '<i><svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg></i>';
  var last = '';
  function decorate(m){
    Array.prototype.forEach.call(sizes.querySelectorAll('.pk-size'), function(b){
      var p = PL[b.getAttribute('data-id')]; if(!p) return;
      var pr = m === 'two' ? (p.basePrice && p.basePrice.two) : (p.basePrice && p.basePrice.real);
      var thousands = Math.round(pr / 1000);
      var t = thousands ? (Number(thousands).toLocaleString('fa-IR') + ' هزار تومن') : '';
      var sp = b.querySelector('.pk-sp');
      if(!sp){
        sp = document.createElement('span');
        sp.className = 'pk-sp';
        sp.setAttribute('dir', 'rtl');
        b.appendChild(sp);
      }
      if(sp.textContent !== t) sp.textContent = t;
    });
  }
  function render(){
    var m = mode(), s = size(), e = en();
    if(!s) s = (m === 'two' ? 75 : 50);
    decorate(m);
    var key = [m, s, e].join('|'); if(key === last) return; last = key;
    var sFa = Number(s).toLocaleString('fa-IR');
    head.innerHTML = m === 'two'
      ? (e ? 'Monthly Plan ' + s + ' GB' : 'اشتراک ماهانه ' + sFa + ' گیگابایت')
      : (e ? 'Credit Top-up ' + s + ' GB — No Expiry' : 'بسته اعتباری ' + sFa + ' گیگابایت — بدون انقضا');
    var L = m === 'two'
      ? (e ? ['Unlimited connected devices without speed drop', 'VLESS & Reality anti-filter protocols', 'Dedicated Iran tunnel to UK & Netherlands', 'Full guarantee + instant bot delivery']
           : ['بدون محدودیت در تعداد کاربر و دستگاه متصل', 'پروتکل‌های نسل جدید ضد فیلتر (Reality و VLESS)', 'تانل اختصاصی ایران به سرورهای انگلیس و هلند', 'ضمانت بازگشت وجه کامل + تحویل آنی در ربات'])
      : (e ? ['No expiration date (pay only for what you use)', 'Fixed rate: 8,000 Tomans per 1 GB (1:1 true traffic)', 'Unlimited connected devices without disconnect', 'UK & Netherlands servers + dedicated Iran tunnel']
           : ['بدون تاریخ انقضا (شارژ اعتبار به میزان دلخواه)', 'نرخ ثابت: هر گیگابایت ۸ هزار تومان (ترافیک واقعی ۱:۱)', 'بدون محدودیت در تعداد کاربر و دستگاه متصل', 'سرورهای انگلیس و هلند با تانل اختصاصی ایران']);
    perks.innerHTML = L.map(function(t){ return '<li>' + CHK + '<span>' + t + '</span></li>'; }).join('');
  }
  var q = 0;
  function soon(){ if(q) return; q = requestAnimationFrame(function(){ q = 0; render(); }); }
  var mo = new MutationObserver(soon);
  [amt, sizes, document.getElementById('pk-modes'), document.getElementById('pk-cs')]
    .forEach(function(n){ if(n) mo.observe(n, { childList:true, subtree:true, characterData:true, attributes:true, attributeFilter:['class'] }); });
  new MutationObserver(soon).observe(document.documentElement, { attributes:true, attributeFilter:['lang'] });
  var ci = document.getElementById('pk-cs-in'); if(ci) ci.addEventListener('input', soon);
  render();
  setInterval(function(){
    render();
  }, 300);
})();
/* ===== CFX-LPV END ===== */
