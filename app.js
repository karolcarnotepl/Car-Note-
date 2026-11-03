(function(){
  "use strict";

  /* ============ ICONS ============ */
  var ICONS = {
    droplet:'<path d="M12 3.2s6.2 7.3 6.2 11.3a6.2 6.2 0 1 1-12.4 0C5.8 10.5 12 3.2 12 3.2z"/>',
    filter:'<path d="M4 5h16l-6.2 7.6V19l-3.6 1.8v-8.2z"/>',
    spark:'<path d="M13.2 3 5.5 13.6h4.8l-1 7.4 7.7-11h-4.8z"/>',
    disc:'<circle cx="12" cy="12" r="7.3"/><circle cx="12" cy="12" r="2"/><line x1="12" y1="4.7" x2="12" y2="6.6"/><line x1="12" y1="17.4" x2="12" y2="19.3"/><line x1="4.7" y1="12" x2="6.6" y2="12"/><line x1="17.4" y1="12" x2="19.3" y2="12"/>',
    clipboard:'<rect x="5" y="4.2" width="14" height="16.8" rx="2"/><path d="M9 4.2v-.7a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v.7"/><path d="M8.6 12.8l2.2 2.2 4.6-5"/>',
    wrench:'<path d="M15 4.6a4.3 4.3 0 0 1-5.6 5.6L4.6 15v3.4H8L12.8 14A4.3 4.3 0 0 1 18.4 8.4l-3 3-2.3-2.3z"/>',
    plus:'<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
    check:'<path d="M4 12.5 9 17.5 20 6"/>',
    pencil:'<path d="M4 20l.9-4L15.6 5.3l3.1 3.1L8 19.1z"/>',
    trash:'<path d="M4.5 7h15"/><path d="M9.5 7V4.3h5V7"/><path d="M6.3 7l1 13.2h9.4l1-13.2"/>',
    x:'<line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/>',
    chain:'<rect x="3.2" y="9" width="8.2" height="6" rx="3"/><rect x="12.6" y="9" width="8.2" height="6" rx="3"/>',
    gear:'<circle cx="12" cy="12" r="3"/><path d="M12 4v2.3M12 17.7V20M18.4 7.2l-1.6 1.6M7.2 15.2l-1.6 1.6M20 12h-2.3M6.3 12H4M18.4 16.8l-1.6-1.6M7.2 8.8 5.6 7.2"/>',
    chevron:'<path d="M6 9l6 6 6-6"/>',
    clock:'<circle cx="12" cy="12" r="8.2"/><path d="M12 7.5V12l3.2 1.9"/>',
    alert:'<path d="M12 3.4 21.3 20H2.7z"/><line x1="12" y1="9.3" x2="12" y2="14"/><circle cx="12" cy="16.8" r="0.9" fill="currentColor" stroke="none"/>'
  };
  function icon(name, extra){
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" '+(extra||'')+'>'+ICONS[name]+'</svg>';
  }

  /* ============ VEHICLE TYPES ============ */
  var VEHICLE_TYPES = [
    {id:'car', label:'Samochód'},
    {id:'motorcycle', label:'Motocykl'},
    {id:'quad', label:'Quad'},
    {id:'tractor_unit', label:'Ciągnik siodłowy'},
    {id:'tractor', label:'Ciągnik'}
  ];
  var VTYPE_BY_ID = {}; VEHICLE_TYPES.forEach(function(t){ VTYPE_BY_ID[t.id]=t; });
  function vType(v){ return (v && v.type) || 'car'; }

  /* ============ CATEGORIES & PRESETS ============ */
  var CATEGORIES = [
    {id:'fluids', label:'Płyny', icon:'droplet'},
    {id:'filters', label:'Filtry', icon:'filter'},
    {id:'ignition', label:'Zapłon', icon:'spark'},
    {id:'timing', label:'Rozrząd', icon:'gear'},
    {id:'drivetrain', label:'Napęd', icon:'chain', types:['motorcycle','quad']},
    {id:'brakes', label:'Hamulce', icon:'disc', noInterval:true},
    {id:'inspections', label:'Przeglądy i ubezpieczenia', icon:'clipboard', fixedYears:1,
      statusLabels:{ok:'Aktywne', soon:'Wygasa wkrótce', overdue:'Nieaktywne'}},
    {id:'repairs', label:'Naprawy', icon:'wrench', noInterval:true, chronological:true}
  ];
  var CAT_BY_ID = {}; CATEGORIES.forEach(function(c){ CAT_BY_ID[c.id]=c; });
  function categoriesForType(type){ return CATEGORIES.filter(function(c){ return !c.types || c.types.indexOf(type)>=0; }); }
  function presetsForType(categoryId, type){ return (PRESETS[categoryId]||[]).filter(function(p){ return !p.types || p.types.indexOf(type)>=0; }); }

  var PRESETS = {
    fluids:[
      {name:'Olej silnikowy', intervalKm:10000, intervalMonths:12},
      {name:'Filtr oleju', intervalKm:10000, intervalMonths:12, hint:'Wymieniany razem z olejem silnikowym.'},
      {name:'Płyn chłodniczy', intervalKm:null, intervalMonths:60},
      {name:'Płyn hamulcowy', intervalKm:40000, intervalMonths:24},
      {name:'Olej wspomagania kierownicy', intervalKm:60000, intervalMonths:48},
      {name:'Olej w skrzyni biegów', intervalKm:60000, intervalMonths:48},
      {name:'Olej w mostach napędowych (dyferencjał)', intervalKm:60000, intervalMonths:48, types:['car']},
      {name:'Olej w reduktorze (skrzynia rozdzielcza)', intervalKm:60000, intervalMonths:48, types:['car']},
      {name:'Olej w widelcu (zawieszenie przednie)', intervalKm:20000, intervalMonths:24, types:['motorcycle']},
      {name:'Olej w tylnej przekładni (wał napędowy)', intervalKm:30000, intervalMonths:24, types:['motorcycle']},
      {name:'Płyn sprzęgła hydraulicznego', intervalKm:null, intervalMonths:24, types:['motorcycle']},
      {name:'Olej hydrauliczny', intervalKm:null, intervalMonths:24, types:['tractor','tractor_unit']}
    ],
    filters:[
      {name:'Filtr powietrza', intervalKm:15000, intervalMonths:12},
      {name:'Filtr kabinowy', intervalKm:15000, intervalMonths:12, types:['car','tractor_unit','tractor']},
      {name:'Filtr paliwa', intervalKm:15000, intervalMonths:12}
    ],
    ignition:[
      {name:'Świece zwykłe (niklowe / miedziane)', intervalKm:25000, intervalMonths:30,
        hint:'Standardowy typ. Zalecane co 20–30 tys. km lub co 2–3 lata.'},
      {name:'Świece platynowe / irydowe (long-life)', intervalKm:80000, intervalMonths:60,
        hint:'Interwał wydłużony: 60–100 tys. km (maks. do 120 tys.), zwykle z limitem czasowym 4–6 lat niezależnie od przebiegu.'},
      {name:'Silnik turbo z bezpośrednim wtryskiem (TSI/TFSI)', intervalKm:60000, intervalMonths:48,
        hint:'Wyższe ciśnienie w cylindrze skraca żywotność świec — nawet long-life wymieniaj co 60 tys. km lub 4 lata (krócej po chip-tuningu).'},
      {name:'Auto na LPG', intervalKm:20000, intervalMonths:null,
        hint:'Spalanie gazu mocniej obciąża świece — skróć interwał o połowę: co 15–30 tys. km.'}
    ],
    timing:[
      {name:'Rozrząd — zamiennik (pasek/łańcuch, rolki, pompa wody)', intervalKm:60000, intervalMonths:null,
        hint:'Popularne marki zestawów: Gates, INA (Schaeffler), Continental/ContiTech, SKF, Dayco, febi. Sugerowany interwał: 60 tys. km.'},
      {name:'Rozrząd oryginalny (OEM)', intervalKm:100000, intervalMonths:60,
        hint:'Część oryginalna producenta pojazdu — do 100 tys. km, ale nie więcej niż 5 lat, niezależnie od przebiegu.'},
      {name:'Regulacja luzów zaworowych', intervalKm:20000, intervalMonths:24, types:['motorcycle','quad'],
        hint:'Typowe dla silników bez hydraulicznych popychaczy zaworowych.'}
    ],
    drivetrain:[
      {name:'Łańcuch napędowy — czyszczenie i smarowanie', intervalKm:1000, intervalMonths:null},
      {name:'Łańcuch napędowy — regulacja luzu', intervalKm:2000, intervalMonths:null},
      {name:'Zestaw napędowy (łańcuch + zębatki)', intervalKm:20000, intervalMonths:null},
      {name:'Pasek napędowy (skuter / CVT)', intervalKm:25000, intervalMonths:36}
    ],
    brakes:[
      {name:'Klocki hamulcowe przód', intervalKm:null, intervalMonths:null},
      {name:'Klocki hamulcowe tył', intervalKm:null, intervalMonths:null},
      {name:'Tarcze hamulcowe', intervalKm:null, intervalMonths:null},
      {name:'Bębny hamulcowe i szczęki', intervalKm:null, intervalMonths:null},
      {name:'Tarczo-bęben i szczęki hamulca postojowego', intervalKm:null, intervalMonths:null}
    ],
    inspections:[
      {name:'Przegląd techniczny', intervalKm:null, intervalMonths:12},
      {name:'Ubezpieczenie OC', intervalKm:null, intervalMonths:12},
      {name:'Ubezpieczenie AC', intervalKm:null, intervalMonths:12}
    ],
    repairs:[]
  };

  var FIELD_HINTS = {
    fluids:      {name:'np. Olej silnikowy 5W-30', notes:'np. lepkość / specyfikacja, numer części…'},
    filters:     {name:'np. Filtr powietrza', notes:'np. oryginał / zamiennik, numer części…'},
    ignition:    {name:'np. Świece NGK', notes:'np. typ świec, numer części…'},
    timing:      {name:'np. Rozrząd Gates', notes:'np. marka zestawu, numer części…'},
    drivetrain:  {name:'np. Łańcuch DID 520', notes:'np. rozmiar łańcucha, numer części…'},
    brakes:      {name:'np. Klocki hamulcowe przód', notes:'np. grubość okładzin, numer części…'},
    inspections: {name:'np. Przegląd techniczny', notes:'np. stacja kontroli / towarzystwo ubezpieczeniowe, numer części…'},
    repairs:     {name:'np. Naprawa alternatora', notes:'np. warsztat, numer części…'}
  };
  var DEFAULT_FIELD_HINTS = {name:'np. Filtr oleju', notes:'np. 5W-30, numer części…'};
  function fieldHintsFor(catId){ return FIELD_HINTS[catId] || DEFAULT_FIELD_HINTS; }

  /* ============ HELPERS ============ */
  function fmtNum(n){ if(n===null||n===undefined||isNaN(n)) return '–'; return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g,' '); }
  function todayISO(){ var d=new Date(); return d.toISOString().slice(0,10); }
  function toDate(iso){ return new Date(iso+'T00:00:00'); }
  function fmtDate(iso){ if(!iso) return '–'; return toDate(iso).toLocaleDateString('pl-PL',{day:'2-digit',month:'2-digit',year:'numeric'}); }
  function addMonths(iso, months){ var d=toDate(iso); d.setMonth(d.getMonth()+months); return d; }
  function daysDiff(fromDate, toDateObj){ return Math.round((toDateObj-fromDate)/86400000); }
  function genId(){ return 'id-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,8); }
  function clamp(n,a,b){ return Math.max(a, Math.min(b,n)); }
  function escapeHtml(s){ return String(s==null?'':s).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }

  function showToast(msg, isError){
    var el = document.getElementById('toastEl');
    if(!el){
      el = document.createElement('div');
      el.id = 'toastEl';
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.className = 'toast toast-show' + (isError?' toast-error':'');
    clearTimeout(el._toastTimer);
    el._toastTimer = setTimeout(function(){ el.classList.remove('toast-show'); }, 3400);
  }
  function showSaveError(e){
    showToast('Nie udało się zapisać zmian' + (e && e.message ? (': '+e.message) : '') + '. Spróbuj ponownie.', true);
  }

  function computeStatus(item, vehicleMileage){
    var today = toDate(todayISO());
    var kmLeft = null, kmFrac = null;
    if(item.intervalKm && item.lastMileage!=null){
      var nextKm = item.lastMileage + item.intervalKm;
      kmLeft = nextKm - (vehicleMileage||0);
      kmFrac = clamp(1 - kmLeft/item.intervalKm, 0, 1.5);
    }
    var daysLeft = null, dateFrac = null;
    if(item.intervalMonths && item.lastDate){
      var nextDate = addMonths(item.lastDate, item.intervalMonths);
      daysLeft = daysDiff(today, nextDate);
      var intervalDays = item.intervalMonths*30.44;
      dateFrac = clamp(1 - daysLeft/intervalDays, 0, 1.5);
    }
    var status;
    if(kmLeft===null && daysLeft===null){ status='unknown'; }
    else if((kmLeft!==null && kmLeft<0) || (daysLeft!==null && daysLeft<0)){ status='overdue'; }
    else if((kmLeft!==null && kmLeft<=1000) || (daysLeft!==null && daysLeft<=45)){ status='soon'; }
    else{ status='ok'; }
    var frac = 0;
    if(kmFrac!==null) frac = Math.max(frac, kmFrac);
    if(dateFrac!==null) frac = Math.max(frac, dateFrac);
    return {status:status, kmLeft:kmLeft, daysLeft:daysLeft, frac:clamp(frac,0,1)};
  }

  function fmtKmLine(kmLeft){
    if(kmLeft===null) return null;
    return kmLeft>=0 ? ('pozostało <b>'+fmtNum(kmLeft)+' km</b>') : ('przekroczono o <b>'+fmtNum(-kmLeft)+' km</b>');
  }
  /* Polish year-count grammar: 1 rok / 2-4 lata / 0,5,6+ lat; halves shown as "pół roku" or "X,5 roku". */
  function fmtYearsLabel(n){
    if(n==null) return '';
    if(n===0.5) return 'pół roku';
    if(n % 1 !== 0) return (n+'').replace('.', ',') + ' roku';
    if(n===1) return '1 rok';
    var last = n%10, tens = Math.floor(n/10)%10;
    return (tens!==1 && last>=2 && last<=4) ? (n+' lata') : (n+' lat');
  }
  function fmtDaysLine(daysLeft){
    if(daysLeft===null) return null;
    if(daysLeft>=0){
      if(daysLeft<=60) return 'pozostało <b>'+daysLeft+' dni</b>';
      var yrs = Math.max(0.5, Math.round((daysLeft/365.25)*2)/2);
      return 'pozostało <b>~'+fmtYearsLabel(yrs)+'</b>';
    }
    return 'minęło <b>'+Math.abs(daysLeft)+' dni</b>';
  }

  var STATUS_LABEL = {ok:'Aktualne', soon:'Zbliża się', overdue:'Przeterminowane', unknown:'Bez przypomnienia'};
  var STATUS_ICON = {ok:'check', soon:'clock', overdue:'alert'};
  function statusLabelFor(catId, status){
    var meta = CAT_BY_ID[catId];
    return (meta && meta.statusLabels && meta.statusLabels[status]) || STATUS_LABEL[status];
  }

  function presetIntervalLabel(p){
    var bits = [];
    if(p.intervalKm) bits.push('co '+fmtNum(p.intervalKm)+' km');
    if(p.intervalMonths) bits.push('co '+fmtYearsLabel(p.intervalMonths/12));
    return bits.join(' lub ');
  }
  function renderPresetCards(presets){
    return presets.map(function(p,i){
      var intervalLabel = presetIntervalLabel(p);
      return '<button type="button" class="preset-card" data-preset="'+i+'">'+
        '<span class="pc-top"><span class="pc-name">'+escapeHtml(p.name)+'</span>'+
        (intervalLabel?('<span class="pc-interval">'+intervalLabel+'</span>'):'')+'</span>'+
        (p.hint?('<span class="pc-hint">'+escapeHtml(p.hint)+'</span>'):'')+
      '</button>';
    }).join('');
  }

  /* ============ DEMO DATA ============ */
  function buildDemo(){
    var vId = 'demo-v1';
    var vehicles = [{id:vId, type:'car', name:'Škoda Octavia III', plate:'WZ 4RT21', year:2018, mileage:128400, createdAt:1}];
    var items = {}; items[vId] = [
      {id:'d1', category:'fluids', name:'Olej silnikowy', intervalKm:10000, intervalMonths:12, lastDate:'2025-08-15', lastMileage:118200, notes:'5W-30'},
      {id:'d2', category:'fluids', name:'Płyn chłodniczy', intervalKm:60000, intervalMonths:24, lastDate:'2024-11-02', lastMileage:78000, notes:''},
      {id:'d3', category:'fluids', name:'Płyn hamulcowy', intervalKm:40000, intervalMonths:24, lastDate:'2024-09-25', lastMileage:92000, notes:'DOT 4'},
      {id:'d4', category:'fluids', name:'Filtr oleju', intervalKm:10000, intervalMonths:12, lastDate:'2025-08-15', lastMileage:118200, notes:''},
      {id:'d5', category:'filters', name:'Filtr powietrza', intervalKm:15000, intervalMonths:12, lastDate:'2025-11-10', lastMileage:120000, notes:''},
      {id:'d6', category:'filters', name:'Filtr kabinowy', intervalKm:15000, intervalMonths:12, lastDate:'2025-10-01', lastMileage:119000, notes:'z węglem aktywnym'},
      {id:'d7', category:'filters', name:'Filtr paliwa', intervalKm:15000, intervalMonths:12, lastDate:'2025-06-01', lastMileage:108000, notes:''},
      {id:'d8', category:'ignition', name:'Świece zapłonowe', intervalKm:30000, intervalMonths:24, lastDate:'2024-02-10', lastMileage:88000, notes:'iridowe'},
      {id:'d9', category:'timing', name:'Rozrząd oryginalny (OEM)', intervalKm:100000, intervalMonths:60, lastDate:'2022-04-01', lastMileage:35000, notes:'wraz z pompą wody'},
      {id:'d10', category:'brakes', name:'Klocki hamulcowe przód', intervalKm:null, intervalMonths:null, lastDate:'2025-04-15', lastMileage:110000, notes:''},
      {id:'d11', category:'brakes', name:'Tarcze hamulcowe', intervalKm:null, intervalMonths:null, lastDate:'2024-01-01', lastMileage:69200, notes:''},
      {id:'d12', category:'inspections', name:'Przegląd techniczny', intervalKm:null, intervalMonths:12, lastDate:'2025-09-20', lastMileage:null, notes:''},
      {id:'d13', category:'inspections', name:'Ubezpieczenie OC', intervalKm:null, intervalMonths:12, lastDate:'2025-08-25', lastMileage:null, notes:'PZU'},
      {id:'d14', category:'inspections', name:'Ubezpieczenie AC', intervalKm:null, intervalMonths:12, lastDate:'2026-01-15', lastMileage:null, notes:''},
      {id:'d16', category:'repairs', name:'Wymiana akumulatora (70Ah)', intervalKm:null, intervalMonths:null, lastDate:'2025-11-03', lastMileage:121500, notes:'Rozładowany po mrozach'},
      {id:'d17', category:'repairs', name:'Naprawa układu wydechowego — spawanie', intervalKm:null, intervalMonths:null, lastDate:'2024-06-12', lastMileage:98000, notes:''}
    ];
    return {vehicles:vehicles, items:items};
  }

  /* ============ STATE ============ */
  var demo = buildDemo();
  var state = {
    mode:'demo',               // 'demo' | 'local'
    vehicles: demo.vehicles,
    itemsByVehicle: demo.items,
    selectedId: demo.vehicles[0].id,
    repairsExpanded: false,
    catMenuOpen: false
  };

  var LS_KEY = 'ksiazka-serwisowa:v1';

  function selectedVehicle(){
    var i; for(i=0;i<state.vehicles.length;i++){ if(state.vehicles[i].id===state.selectedId) return state.vehicles[i]; }
    return state.vehicles[0]||null;
  }
  function itemsForSelected(){
    var v = selectedVehicle();
    if(!v) return [];
    return state.itemsByVehicle[v.id] || [];
  }

  /* ============ PERSISTENCE: LOCAL ============ */
  function persistLocal(){
    // Zapis może się nie udać, np. gdy w przeglądarce brakuje miejsca — wtedy pokazujemy komunikat
    try{ localStorage.setItem(LS_KEY, JSON.stringify({vehicles:state.vehicles, itemsByVehicle:state.itemsByVehicle})); }catch(e){ showSaveError(e); }
  }
  function loadLocalIfAny(){
    try{
      var raw = localStorage.getItem(LS_KEY);
      if(!raw) return false;
      var data = JSON.parse(raw);
      if(!data || !Array.isArray(data.vehicles)) return false;
      state.vehicles = data.vehicles;
      state.itemsByVehicle = data.itemsByVehicle || {};
      state.selectedId = state.vehicles[0] ? state.vehicles[0].id : null;
      return true;
    }catch(e){ return false; }
  }

  /* ============ BACKEND INIT ============ */
  function setMode(m, label){
    state.mode = m;
    var badge = document.getElementById('modeBadge');
    badge.setAttribute('data-m', m);
    document.getElementById('modeBadgeText').textContent = label;
  }

  // Przy starcie wczytujemy dane zapisane w przeglądarce (albo zaczynamy od pustej listy)
  function initStorage(){
    var had = loadLocalIfAny();
    if(had){
      setMode('local','Zapisane lokalnie w tej przeglądarce');
    } else {
      state.vehicles = [];
      state.itemsByVehicle = {};
      state.selectedId = null;
      setMode('local','Zapisywanie lokalnie w tej przeglądarce');
    }
    render();
  }

  /* ============ STORE (CRUD) ============
     Każda zmiana najpierw poprawia dane w pamięci (state), potem zapisuje
     je w przeglądarce i odświeża ekran. Zapis działa tylko w trybie 'local',
     żeby przez chwilę po starcie nie nadpisać danych danymi przykładowymi. */
  var Store = {
    addVehicle: function(data){
      data.createdAt = Date.now();
      var id = genId();
      data.id = id;
      state.vehicles.push(data);
      state.itemsByVehicle[id] = [];
      state.selectedId = id;
      if(state.mode==='local') persistLocal();
      render();
    },
    updateVehicle: function(id, patch){
      var v = state.vehicles.find(function(x){return x.id===id;});
      if(v) Object.assign(v, patch);
      if(state.mode==='local') persistLocal();
      render();
    },
    deleteVehicle: function(id){
      state.vehicles = state.vehicles.filter(function(v){return v.id!==id;});
      delete state.itemsByVehicle[id];
      if(state.selectedId===id) state.selectedId = state.vehicles.length ? state.vehicles[0].id : null;
      if(state.mode==='local') persistLocal();
      render();
    },
    addItem: function(vehicleId, data){
      data.createdAt = Date.now();
      data.id = genId();
      (state.itemsByVehicle[vehicleId]=state.itemsByVehicle[vehicleId]||[]).push(data);
      if(state.mode==='local') persistLocal();
      render();
    },
    updateItem: function(vehicleId, itemId, patch){
      var arr = state.itemsByVehicle[vehicleId]||[];
      var it = arr.find(function(x){return x.id===itemId;});
      if(it) Object.assign(it, patch);
      if(state.mode==='local') persistLocal();
      render();
    },
    deleteItem: function(vehicleId, itemId){
      state.itemsByVehicle[vehicleId] = (state.itemsByVehicle[vehicleId]||[]).filter(function(x){return x.id!==itemId;});
      if(state.mode==='local') persistLocal();
      render();
    }
  };

  function selectVehicle(id){
    state.selectedId = id;
    render();
  }

  /* ============ RENDER ============ */
  function render(){
    renderTabs();
    renderMain();
  }

  function renderTabs(){
    var wrap = document.getElementById('vehicleTabs');
    var html = '';
    state.vehicles.forEach(function(v){
      var active = v.id===state.selectedId;
      html += '<button class="plate-tab" aria-pressed="'+active+'" data-select-vehicle="'+v.id+'">'+
        '<span class="plate-no">'+escapeHtml(v.plate||'BRAK TABLIC')+'</span>'+
        '<span class="plate-name">'+escapeHtml(v.name||'')+'</span></button>';
    });
    html += '<button class="plate-tab-add" data-add-vehicle>'+icon('plus')+'<span>Dodaj pojazd</span></button>';
    wrap.innerHTML = html;
  }

  function renderMain(){
    var main = document.getElementById('main');
    var v = selectedVehicle();
    if(!v){
      main.innerHTML =
        '<div class="empty-hero">'+
          '<h2>Zacznij od swojego auta</h2>'+
          '<p>Dodaj pojazd, aby śledzić wymiany oleju, filtrów, świec, przeglądy techniczne i ubezpieczenia w jednym miejscu.</p>'+
          '<button class="btn btn-accent" data-add-vehicle>Dodaj pierwszy pojazd</button>'+
        '</div>';
      return;
    }
    var items = itemsForSelected();
    var vehicleMileage = v.mileage||0;
    var counts = {overdue:0, soon:0, ok:0};
    var computed = items.map(function(it){ var c=computeStatus(it, vehicleMileage); if(counts[c.status]!==undefined) counts[c.status]++; return {item:it, calc:c}; });

    var html = '';
    html += '<section class="dash-summary">';
    html += '<div class="mileage-card">';
    html += '<div class="card-label">Aktualny przebieg</div>';
    html += '<div class="mileage-row"><input type="number" id="mileageInput" value="'+vehicleMileage+'" min="0" step="1"><span class="unit">km</span></div>';
    html += '<div class="mileage-actions"><button class="btn btn-accent" id="saveMileageBtn">Zapisz przebieg</button><button class="btn btn-ghost" data-edit-vehicle="'+v.id+'">'+icon('pencil','width="14" height="14"')+' Edytuj pojazd</button></div>';
    var vTypeLabel = (VTYPE_BY_ID[vType(v)]||{}).label || '';
    html += '<div class="vehicle-meta-line"><span>'+escapeHtml(v.name||'')+'</span>'+(vTypeLabel?('<span>'+escapeHtml(vTypeLabel)+'</span>'):'')+(v.year?('<span>Rok '+v.year+'</span>'):'')+'</div>';
    html += '</div>';
    html += '<div class="gauge-tiles">'+
      '<div class="gauge-tile t-danger"><div class="gv">'+counts.overdue+'</div><div class="gl">Przeterminowane</div></div>'+
      '<div class="gauge-tile t-warn"><div class="gv">'+counts.soon+'</div><div class="gl">Zbliża się</div></div>'+
      '<div class="gauge-tile t-ok"><div class="gv">'+counts.ok+'</div><div class="gl">Aktualne</div></div>'+
    '</div>';
    html += '</section>';

    var allCats = categoriesForType(vType(v));
    var regularCats = allCats.filter(function(c){ return !c.chronological; });
    var repairsCat = allCats.filter(function(c){ return c.chronological; })[0];

    var populated = [], hidden = [];
    regularCats.forEach(function(cat){
      var rows = computed.filter(function(x){ return x.item.category===cat.id; });
      if(rows.length) populated.push({cat:cat, rows:rows}); else hidden.push(cat);
    });

    html += '<section class="log">';
    populated.forEach(function(entry){
      html += '<div class="cat-group">';
      html += '<div class="cat-head">'+icon(entry.cat.icon)+'<h2>'+entry.cat.label+'</h2>'+
        '<button class="cat-add-btn" data-add-item="'+entry.cat.id+'">'+icon('plus','width="13" height="13"')+' Dodaj</button></div>';
      html += '<div class="items">';
      entry.rows.forEach(function(x){ html += renderItemRow(v, x.item, x.calc); });
      html += '</div></div>';
    });

    if(hidden.length){
      html += '<div class="cat-reveal">'+
        '<button class="cat-reveal-btn" id="catRevealBtn" aria-expanded="'+(state.catMenuOpen?'true':'false')+'">'+icon('plus','width="12" height="12"')+' Dodaj kategorię</button>'+
        '<div class="cat-reveal-menu"'+(state.catMenuOpen?'':' hidden')+'>'+
          hidden.map(function(cat){ return '<button class="cat-reveal-item" data-add-item="'+cat.id+'">'+icon(cat.icon,'width="14" height="14"')+'<span>'+cat.label+'</span></button>'; }).join('')+
        '</div>'+
      '</div>';
    }
    html += '</section>';

    if(repairsCat){
      var repairRows = computed.filter(function(x){ return x.item.category===repairsCat.id; })
        .sort(function(a,b){ return (toDate(b.item.lastDate||'1970-01-01') - toDate(a.item.lastDate||'1970-01-01')) || ((b.item.createdAt||0)-(a.item.createdAt||0)); });
      var expanded = state.repairsExpanded;
      html += '<section class="repairs-section'+(expanded?' is-open':'')+'">';
      html += '<button class="repairs-head" id="repairsToggle" aria-expanded="'+(expanded?'true':'false')+'">'+
        icon(repairsCat.icon)+'<h2>'+repairsCat.label+'</h2>'+
        '<span class="repairs-count">'+repairRows.length+'</span>'+
        '<span class="repairs-spacer"></span>'+
        icon('chevron','class="repairs-chevron"')+
      '</button>';
      html += '<div class="repairs-add-row"><button class="cat-add-btn" data-add-item="'+repairsCat.id+'">'+icon('plus','width="13" height="13"')+' Dodaj naprawę</button></div>';
      if(expanded){
        html += '<div class="items">';
        if(!repairRows.length){
          html += '<div class="item-empty">Brak zarejestrowanych napraw.</div>';
        } else {
          repairRows.forEach(function(x){ html += renderItemRow(v, x.item, x.calc); });
        }
        html += '</div>';
      }
      html += '</section>';
    }

    main.innerHTML = html;
  }

  function renderItemRow(vehicle, item, calc){
    var isRepair = item.category==='repairs';
    var actionsHtml = '<div class="item-actions">'+
      (isRepair? '' : '<button class="icon-btn done" data-mark-done="'+item.id+'" data-vehicle="'+vehicle.id+'" title="Oznacz jako wykonane">'+icon('check')+'</button>')+
      '<button class="icon-btn" data-edit-item="'+item.id+'" data-vehicle="'+vehicle.id+'" title="Edytuj">'+icon('pencil')+'</button>'+
      '<button class="icon-btn danger" data-delete-item="'+item.id+'" data-vehicle="'+vehicle.id+'" title="Usuń">'+icon('trash')+'</button>'+
    '</div>';

    var intervalBits = [];
    if(item.intervalKm) intervalBits.push('co '+fmtNum(item.intervalKm)+' km');
    if(item.intervalMonths) intervalBits.push('co '+fmtYearsLabel(item.intervalMonths/12));
    var notesHtml = item.notes ? ('<span class="item-notes">'+escapeHtml(item.notes)+(intervalBits.length?' · '+intervalBits.join(', '):'')+'</span>') : (intervalBits.length ? ('<span class="item-notes">'+intervalBits.join(', ')+'</span>') : '');

    var lastBits = [];
    if(item.lastDate) lastBits.push(fmtDate(item.lastDate));
    if(item.lastMileage!=null) lastBits.push(fmtNum(item.lastMileage)+' km');
    var lastLine = lastBits.length ? ('Ostatnio: <b>'+lastBits.join(' · ')+'</b>') : 'Brak historii';

    if(isRepair){
      return '<div class="item-row item-row-repair">'+
        '<div class="item-name">'+escapeHtml(item.name)+notesHtml+'</div>'+
        '<div class="item-last">'+lastLine+'</div>'+
        actionsHtml+
      '</div>';
    }

    var nextLines = [];
    var kl = fmtKmLine(calc.kmLeft); if(kl) nextLines.push(kl);
    var dl = fmtDaysLine(calc.daysLeft); if(dl) nextLines.push(dl);
    var nextHtml = nextLines.length ? nextLines.join('<br>') : '—';

    var statusHtml = calc.status==='unknown'
      ? ('<span class="status-chip-unknown">'+statusLabelFor(item.category, 'unknown')+'</span>')
      : ('<span class="status-chip status-chip-'+calc.status+'">'+icon(STATUS_ICON[calc.status])+'<span>'+statusLabelFor(item.category, calc.status)+'</span></span>');

    return '<div class="item-row">'+
      '<div class="item-name">'+escapeHtml(item.name)+notesHtml+'</div>'+
      '<div class="item-last">'+lastLine+'</div>'+
      '<div class="item-next">'+nextHtml+'</div>'+
      '<div>'+statusHtml+'</div>'+
      actionsHtml+
    '</div>';
  }

  /* ============ MODALS ============ */
  function closeModal(){ document.getElementById('modalRoot').innerHTML=''; }

  function openModal(html){
    document.getElementById('modalRoot').innerHTML =
      '<div class="overlay" id="overlayEl">'+
        '<div class="modal" role="dialog" aria-modal="true">'+html+'</div>'+
      '</div>';
    document.getElementById('overlayEl').addEventListener('click', function(e){ if(e.target.id==='overlayEl') closeModal(); });
    document.addEventListener('keydown', escCloseOnce);
  }
  function escCloseOnce(e){ if(e.key==='Escape'){ closeModal(); document.removeEventListener('keydown', escCloseOnce); } }

  function confirmModal(message, onYes){
    var html =
      '<div class="modal-head"><h3>Potwierdź</h3><button class="icon-btn" data-close>'+icon('x')+'</button></div>'+
      '<div class="modal-body"><p style="margin:0; font-size:14px;">'+escapeHtml(message)+'</p></div>'+
      '<div class="modal-foot"><span></span><div style="display:flex; gap:8px;">'+
        '<button class="btn" id="cmCancel">Anuluj</button>'+
        '<button class="btn" id="cmYes" style="background:var(--danger); border-color:var(--danger); color:#fff;">Usuń</button>'+
      '</div></div>';
    openModal(html);
    document.querySelector('[data-close]').addEventListener('click', closeModal);
    document.getElementById('cmCancel').addEventListener('click', closeModal);
    document.getElementById('cmYes').addEventListener('click', function(){ closeModal(); onYes(); });
  }

  function vehicleModal(existing){
    var v = existing || {name:'', plate:'', year:'', mileage:0, type:'car'};
    var isEdit = !!existing;
    var currentType = vType(v);
    var typeOptions = VEHICLE_TYPES.map(function(t){ return '<option value="'+t.id+'"'+(t.id===currentType?' selected':'')+'>'+t.label+'</option>'; }).join('');
    var html =
      '<div class="modal-head"><h3>'+(isEdit?'Edytuj pojazd':'Nowy pojazd')+'</h3><button class="icon-btn" data-close>'+icon('x')+'</button></div>'+
      '<div class="modal-body">'+
        '<div class="field"><label>Rodzaj pojazdu</label><select id="fVType">'+typeOptions+'</select></div>'+
        '<div class="field"><label>Marka i model</label><input id="fVName" value="'+escapeHtml(v.name)+'" placeholder="np. Škoda Octavia III"></div>'+
        '<div class="field-row">'+
          '<div class="field"><label>Nr rejestracyjny</label><input id="fVPlate" value="'+escapeHtml(v.plate)+'" placeholder="WZ 12345" style="text-transform:uppercase; font-family:var(--font-mono)"></div>'+
          '<div class="field"><label>Rok produkcji</label><input id="fVYear" type="number" value="'+escapeHtml(v.year)+'" placeholder="2018"></div>'+
        '</div>'+
        '<div class="field"><label>Aktualny przebieg (km)</label><input id="fVMileage" type="number" value="'+(v.mileage||0)+'"></div>'+
      '</div>'+
      '<div class="modal-foot">'+
        (isEdit? '<button class="btn-danger-text" id="delVehicleBtn">Usuń pojazd</button>' : '<span></span>')+
        '<button class="btn btn-accent" id="saveVehicleBtn">'+(isEdit?'Zapisz zmiany':'Dodaj pojazd')+'</button>'+
      '</div>';
    openModal(html);
    document.querySelector('[data-close]').addEventListener('click', closeModal);
    document.getElementById('saveVehicleBtn').addEventListener('click', function(){
      var data = {
        type: document.getElementById('fVType').value,
        name: document.getElementById('fVName').value.trim() || 'Mój pojazd',
        plate: document.getElementById('fVPlate').value.trim().toUpperCase(),
        year: parseInt(document.getElementById('fVYear').value,10) || null,
        mileage: parseInt(document.getElementById('fVMileage').value,10) || 0
      };
      if(isEdit) Store.updateVehicle(existing.id, data); else Store.addVehicle(data);
      closeModal();
    });
    if(isEdit){
      document.getElementById('delVehicleBtn').addEventListener('click', function(){
        confirmModal('Usunąć pojazd „'+existing.name+'” wraz z całą historią serwisową?', function(){
          Store.deleteVehicle(existing.id);
        });
      });
    }
  }

  function itemModal(vehicleId, categoryId, existing){
    var it = existing || {category:categoryId, name:'', intervalKm:'', intervalMonths:'', lastDate:todayISO(), lastMileage:'', notes:''};
    var isEdit = !!existing;
    var vehicleObj = state.vehicles.find(function(x){return x.id===vehicleId;}) || {};
    var vTypeId = vType(vehicleObj);
    var cats = categoriesForType(vTypeId);
    if(it.category && !cats.some(function(c){return c.id===it.category;}) && CAT_BY_ID[it.category]){
      cats = cats.concat([CAT_BY_ID[it.category]]);
    }
    var presets = presetsForType(it.category, vTypeId);
    var catOptions = cats.map(function(c){ return '<option value="'+c.id+'"'+(c.id===it.category?' selected':'')+'>'+c.label+'</option>'; }).join('');
    var initialMeta = CAT_BY_ID[it.category] || {};
    var initialHideInterval = !!(initialMeta.noInterval || initialMeta.fixedYears);
    var initialIsRepairs = it.category==='repairs';
    var initialHints = fieldHintsFor(it.category);
    var yearsVal = it.intervalMonths ? (Math.round((it.intervalMonths/12)*2)/2) : '';

    var html =
      '<div class="modal-head"><h3>'+(isEdit?'Edytuj pozycję':'Nowa pozycja')+'</h3><button class="icon-btn" data-close>'+icon('x')+'</button></div>'+
      '<div class="modal-body">'+
        (isEdit || !presets.length ? '' : ('<div class="preset-hdr">Szybki wybór — kliknij, aby wypełnić pola</div><div class="preset-grid" id="presetChips">'+renderPresetCards(presets)+'</div>'))+
        '<div class="field"><label>Kategoria</label><select id="fICategory">'+catOptions+'</select></div>'+
        '<div class="field"><label id="lblName">'+(initialIsRepairs?'Co zrobiono / wymieniono':'Nazwa')+'</label><input id="fIName" value="'+escapeHtml(it.name)+'" placeholder="'+escapeHtml(initialHints.name)+'"></div>'+
        '<div class="field-row" id="intervalFieldRow"'+(initialHideInterval?' hidden':'')+'>'+
          '<div class="field"><label>Interwał (km)</label><input id="fIIntKm" type="number" value="'+(it.intervalKm||'')+'" placeholder="np. 10000"></div>'+
          '<div class="field"><label>Interwał (lata)</label><input id="fIIntYr" type="number" step="0.5" min="0" value="'+yearsVal+'" placeholder="np. 2"></div>'+
        '</div>'+
        '<div class="field-row">'+
          '<div class="field"><label id="lblDate">'+(initialIsRepairs?'Data naprawy':'Data ostatniej wymiany')+'</label><input id="fILastDate" type="date" value="'+(it.lastDate||'')+'"></div>'+
          '<div class="field"><label id="lblMileage">Przebieg'+(initialIsRepairs?' (opcjonalnie)':' przy wymianie')+'</label><input id="fILastKm" type="number" value="'+(it.lastMileage!=null?it.lastMileage:'')+'" placeholder="km"></div>'+
        '</div>'+
        '<div class="field"><label>Notatki</label><input id="fINotes" value="'+escapeHtml(it.notes||'')+'" placeholder="'+escapeHtml(initialHints.notes)+'"></div>'+
      '</div>'+
      '<div class="modal-foot">'+
        (isEdit? '<button class="btn-danger-text" id="delItemBtn">Usuń pozycję</button>' : '<span></span>')+
        '<button class="btn btn-accent" id="saveItemBtn">'+(isEdit?'Zapisz zmiany':'Dodaj pozycję')+'</button>'+
      '</div>';
    openModal(html);
    document.querySelector('[data-close]').addEventListener('click', closeModal);

    function applyCategoryUi(catId){
      var meta = CAT_BY_ID[catId] || {};
      document.getElementById('intervalFieldRow').hidden = !!(meta.noInterval || meta.fixedYears);
      var isRepairs = catId==='repairs';
      document.getElementById('lblName').textContent = isRepairs ? 'Co zrobiono / wymieniono' : 'Nazwa';
      document.getElementById('lblDate').textContent = isRepairs ? 'Data naprawy' : 'Data ostatniej wymiany';
      document.getElementById('lblMileage').textContent = 'Przebieg' + (isRepairs ? ' (opcjonalnie)' : ' przy wymianie');
      var hints = fieldHintsFor(catId);
      document.getElementById('fIName').placeholder = hints.name;
      document.getElementById('fINotes').placeholder = hints.notes;
    }

    if(!isEdit){
      var presetChipsEl = document.getElementById('presetChips');
      if(presetChipsEl){
        presetChipsEl.addEventListener('click', function(e){
          var btn = e.target.closest('[data-preset]');
          if(!btn) return;
          var p = presets[parseInt(btn.getAttribute('data-preset'),10)];
          document.getElementById('fIName').value = p.name;
          document.getElementById('fIIntKm').value = p.intervalKm||'';
          document.getElementById('fIIntYr').value = p.intervalMonths ? (Math.round((p.intervalMonths/12)*2)/2) : '';
          if(p.hint) document.getElementById('fINotes').value = p.hint;
          Array.prototype.forEach.call(document.querySelectorAll('#presetChips .preset-card'), function(c){c.classList.remove('chip-active');});
          btn.classList.add('chip-active');
        });
      }
      document.getElementById('fICategory').addEventListener('change', function(){
        var newPresets = presetsForType(this.value, vTypeId);
        presets = newPresets;
        applyCategoryUi(this.value);
        var chipsWrap = document.getElementById('presetChips');
        if(chipsWrap) chipsWrap.innerHTML = renderPresetCards(newPresets);
      });
    } else {
      document.getElementById('fICategory').addEventListener('change', function(){ applyCategoryUi(this.value); });
    }

    document.getElementById('saveItemBtn').addEventListener('click', function(){
      var yrs = parseFloat(document.getElementById('fIIntYr').value);
      var data = {
        category: document.getElementById('fICategory').value,
        name: document.getElementById('fIName').value.trim() || 'Nowa pozycja',
        intervalKm: parseInt(document.getElementById('fIIntKm').value,10) || null,
        intervalMonths: (yrs && !isNaN(yrs)) ? Math.round(yrs*12) : null,
        lastDate: document.getElementById('fILastDate').value || null,
        lastMileage: document.getElementById('fILastKm').value!=='' ? parseInt(document.getElementById('fILastKm').value,10) : null,
        notes: document.getElementById('fINotes').value.trim()
      };
      var saveMeta = CAT_BY_ID[data.category] || {};
      if(saveMeta.noInterval){
        data.intervalKm = null;
        data.intervalMonths = null;
      } else if(saveMeta.fixedYears){
        data.intervalKm = null;
        data.intervalMonths = saveMeta.fixedYears*12;
      }
      if(isEdit) Store.updateItem(vehicleId, existing.id, data); else Store.addItem(vehicleId, data);
      closeModal();
    });
    if(isEdit){
      document.getElementById('delItemBtn').addEventListener('click', function(){
        confirmModal('Usunąć pozycję „'+existing.name+'”?', function(){
          Store.deleteItem(vehicleId, existing.id);
        });
      });
    }
  }

  function markDoneModal(vehicleId, item){
    var v = state.vehicles.find(function(x){return x.id===vehicleId;});
    var html =
      '<div class="modal-head"><h3>Oznacz jako wykonane</h3><button class="icon-btn" data-close>'+icon('x')+'</button></div>'+
      '<div class="modal-body">'+
        '<p style="margin:0; color:var(--ink-soft); font-size:13.5px;">'+escapeHtml(item.name)+'</p>'+
        '<div class="field-row">'+
          '<div class="field"><label>Data wykonania</label><input id="fDoneDate" type="date" value="'+todayISO()+'"></div>'+
          '<div class="field"><label>Przebieg</label><input id="fDoneKm" type="number" value="'+(v?v.mileage:'')+'"></div>'+
        '</div>'+
      '</div>'+
      '<div class="modal-foot"><span></span><button class="btn btn-accent" id="confirmDoneBtn">Zapisz</button></div>';
    openModal(html);
    document.querySelector('[data-close]').addEventListener('click', closeModal);
    document.getElementById('confirmDoneBtn').addEventListener('click', function(){
      var patch = {
        lastDate: document.getElementById('fDoneDate').value || todayISO(),
        lastMileage: parseInt(document.getElementById('fDoneKm').value,10) || item.lastMileage
      };
      Store.updateItem(vehicleId, item.id, patch);
      closeModal();
    });
  }

  /* ============ EVENTS ============ */
  document.addEventListener('click', function(e){
    var t;
    if((t=e.target.closest('[data-select-vehicle]'))){ selectVehicle(t.getAttribute('data-select-vehicle')); return; }
    if((t=e.target.closest('[data-add-vehicle]'))){ vehicleModal(null); return; }
    if((t=e.target.closest('[data-edit-vehicle]'))){
      var vid = t.getAttribute('data-edit-vehicle');
      vehicleModal(state.vehicles.find(function(v){return v.id===vid;}));
      return;
    }
    if((t=e.target.closest('[data-add-item]'))){
      var vv = selectedVehicle(); if(!vv) return;
      var addCatId = t.getAttribute('data-add-item');
      state.catMenuOpen = false;
      if(addCatId==='repairs') state.repairsExpanded = true;
      itemModal(vv.id, addCatId, null);
      return;
    }
    if((t=e.target.closest('#catRevealBtn'))){
      state.catMenuOpen = !state.catMenuOpen;
      render();
      return;
    }
    if((t=e.target.closest('#repairsToggle'))){
      state.repairsExpanded = !state.repairsExpanded;
      render();
      return;
    }
    if((t=e.target.closest('[data-edit-item]'))){
      var evid = t.getAttribute('data-vehicle');
      var iid = t.getAttribute('data-edit-item');
      var arr = state.itemsByVehicle[evid]||[];
      var found = arr.find(function(x){return x.id===iid;});
      if(found) itemModal(evid, found.category, found);
      return;
    }
    if((t=e.target.closest('[data-delete-item]'))){
      var dvid = t.getAttribute('data-vehicle');
      var diid = t.getAttribute('data-delete-item');
      var darr = state.itemsByVehicle[dvid]||[];
      var ditem = darr.find(function(x){return x.id===diid;});
      if(ditem) confirmModal('Usunąć pozycję „'+ditem.name+'”?', function(){ Store.deleteItem(dvid, diid); });
      return;
    }
    if((t=e.target.closest('[data-mark-done]'))){
      var mvid = t.getAttribute('data-vehicle');
      var miid = t.getAttribute('data-mark-done');
      var marr = state.itemsByVehicle[mvid]||[];
      var mitem = marr.find(function(x){return x.id===miid;});
      if(mitem) markDoneModal(mvid, mitem);
      return;
    }
  });

  document.addEventListener('click', function(e){
    if(e.target && e.target.id==='saveMileageBtn'){
      var v = selectedVehicle();
      var val = parseInt(document.getElementById('mileageInput').value,10) || 0;
      if(v) Store.updateVehicle(v.id, {mileage: val});
    }
  });

  /* ============ INIT ============ */
  render();
  initStorage();
})();
