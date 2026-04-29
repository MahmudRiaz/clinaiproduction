// EKGViewer.jsx — Interactive EKG Learning Module
const { useState, useRef, useMemo, useCallback, useEffect } = React;

// ================================================================
// CONSTANTS & LAYOUT
// ================================================================
const SM=6,LG=SM*5,PX_S=SM*25,PX_MV=55;
const CYC=0.8,CDUR=2.5,CW=Math.round(CDUR*PX_S),CH=140;
const ML=55,MT=12,COLS=4,ROWS=3;
const VBW=ML+COLS*CW+20,VBH=MT+(ROWS+1)*CH+30;
const LEADS=['I','II','III','aVR','aVL','aVF','V1','V2','V3','V4','V5','V6'];
const GRID_L=[['I','aVR','V1','V4'],['II','aVL','V2','V5'],['III','aVF','V3','V6']];

const SEGS=[
  {id:'p',label:'P Wave',desc:'Atrial depolarization \u2014 SA node fires, both atria contract',color:'#2e7d32',s:.05,e:.145},
  {id:'pr',label:'PR Segment',desc:'AV node conduction delay (normal 0.12\u20130.20s)',color:'#558b2f',s:.145,e:.168},
  {id:'qrs',label:'QRS Complex',desc:'Ventricular depolarization (normal <0.12s)',color:'#c62828',s:.168,e:.248},
  {id:'st',label:'ST Segment',desc:'Early repolarization plateau \u2014 elevation/depression is significant',color:'#e65100',s:.248,e:.330},
  {id:'t',label:'T Wave',desc:'Ventricular repolarization',color:'#6a1b9a',s:.330,e:.480},
];

// ================================================================
// WAVEFORM PARAMETERS
// ================================================================
const NRM={
  'I':{p:[.12,.10,.025],q:[-.04,.175,.008],r:[.75,.20,.012],s:[-.10,.225,.008],t:[.20,.38,.04]},
  'II':{p:[.18,.10,.025],q:[-.05,.175,.008],r:[1.2,.20,.014],s:[-.15,.225,.008],t:[.30,.38,.04]},
  'III':{p:[.06,.10,.025],q:[-.02,.175,.006],r:[.45,.20,.010],s:[-.08,.225,.006],t:[.10,.38,.035]},
  'aVR':{p:[-.10,.10,.025],q:[0,.175,.008],r:[-.40,.20,.012],s:[.05,.225,.008],t:[-.20,.38,.04]},
  'aVL':{p:[.06,.10,.025],q:[-.03,.175,.006],r:[.40,.20,.010],s:[-.06,.225,.006],t:[.12,.38,.035]},
  'aVF':{p:[.12,.10,.025],q:[-.03,.175,.008],r:[.80,.20,.012],s:[-.10,.225,.008],t:[.20,.38,.04]},
  'V1':{p:[.08,.10,.025],q:[0,.175,.006],r:[.25,.20,.008],s:[-.90,.225,.012],t:[-.10,.38,.035]},
  'V2':{p:[.10,.10,.025],q:[0,.175,.006],r:[.45,.20,.010],s:[-.70,.225,.010],t:[.30,.38,.04]},
  'V3':{p:[.10,.10,.025],q:[-.02,.175,.006],r:[.70,.20,.012],s:[-.45,.225,.010],t:[.30,.38,.04]},
  'V4':{p:[.10,.10,.025],q:[-.04,.175,.008],r:[1.0,.20,.012],s:[-.25,.225,.008],t:[.30,.38,.04]},
  'V5':{p:[.10,.10,.025],q:[-.05,.175,.008],r:[1.2,.20,.014],s:[-.12,.225,.006],t:[.25,.38,.04]},
  'V6':{p:[.08,.10,.025],q:[-.04,.175,.006],r:[.90,.20,.012],s:[-.06,.225,.006],t:[.20,.38,.035]},
};

function mkP(overrides,globalMods){
  globalMods=globalMods||{};
  var r={};
  LEADS.forEach(function(l){r[l]=Object.assign({},NRM[l],globalMods);});
  Object.entries(overrides).forEach(function(entry){r[entry[0]]=Object.assign({},r[entry[0]],entry[1]);});
  return r;
}

var TEACH=mkP({
  'V1':{stE:.10},'V2':{stE:.25,r:[.30,.20,.010],s:[-.50,.225,.010],t:[.55,.36,.05]},
  'V3':{stE:.30,q:[-.10,.175,.008],r:[.50,.20,.012],s:[-.25,.225,.010],t:[.50,.36,.05]},
  'V4':{stE:.20,q:[-.10,.175,.008],r:[.70,.20,.012],s:[-.15,.225,.008],t:[.45,.36,.045]},
  'II':{stD:-.08},'III':{stD:-.12},'aVF':{stD:-.10},
});

var P1=mkP({
  'II':{stE:.25,t:[.45,.36,.05]},'III':{stE:.30,q:[-.08,.175,.008],t:[.40,.36,.05]},
  'aVF':{stE:.20,q:[-.06,.175,.008],t:[.35,.36,.045]},
  'I':{stD:-.10},'aVL':{stD:-.18,t:[-.15,.38,.035]},
});

var P2=mkP({},{noP:true,irregular:true,fib:true,noise:.012});

var P3=mkP({
  'V1':{r:[.20,.195,.006],s:[-.50,.215,.015],rPrime:[.55,.240,.016]},
  'V2':{rPrime:[.15,.242,.010]},
  'I':{s:[-.30,.240,.015]},'V5':{s:[-.25,.240,.013]},'V6':{s:[-.25,.240,.013]},
});

// ================================================================
// PRACTICE CASES
// ================================================================
var CASES=[
  {
    title:'Case 1',
    clinical:'68F \u2022 Crushing substernal chest pain \u2192 jaw \u2022 Diaphoretic \u2022 BP 95/60',
    params:P1,
    summary:'\u2705 **Case Complete: Acute Inferior STEMI**\n\n\u2022 Rate: ~75 bpm, NSR\n\u2022 Axis: Normal\n\u2022 ST elevation: II, III, aVF\n\u2022 Reciprocal depression: I, aVL\n\u2022 Culprit: RCA\n\u2022 Action: Cath lab NOW\n\n\ud83d\udca1 **Pearl:** Reciprocal changes distinguish STEMI from pericarditis (diffuse elevation, NO reciprocal changes).',
    steps:[
      {prompt:'New patient. 68-year-old woman \u2014 crushing chest pain, jaw radiation, diaphoretic, pressure 95/60. EKG is up.\n\nRate and rhythm. Go.',
        check:function(i){var l=i.toLowerCase();var rt=/7[0-9]|80|seventy/.test(l);var rh=/sinus|regular|nsr|normal/.test(l);return rt&&rh?'y':rt||rh?'p':'n'},
        y:'About 75, normal sinus. Fine.',p:'I need BOTH. Rate AND rhythm. Don\'t make me ask twice.',
        n:'Rhythm strip. Bottom of the page. R-R regular? Count large boxes. 300 divided by that number.',
        give:'It\'s ~75, normal sinus rhythm. P before every QRS. You know this.'},
      {prompt:'Axis. Leads I and aVF. Quick.',
        check:function(i){return/normal|positive|zero/.test(i.toLowerCase())?'y':'n'},
        y:'Normal axis. Both positive. Good.',n:'Lead I \u2014 QRS mostly up or down? Same for aVF. Both positive means what?',
        give:'Normal axis. Both leads net positive.'},
      {prompt:'Now the important part. Walk me through the ST segments. Every lead. What do you see?',
        check:function(i){var l=i.toLowerCase();var e=/elevat|raise|st.{0,3}\u2191|lift/.test(l);var f=/ii|iii|avf|inferior|2,.*3|3,.*2/.test(l);return e&&f?'y':e||f?'p':'n'},
        y:'ST elevation in II, III, aVF. Good eye.',p:'You\'re seeing something but I need specifics. WHICH leads? Elevation or depression?',
        n:'Look at II, III, and aVF. Compare the ST segment to baseline. Really look.',
        give:'ST elevation in II, III, and aVF. You cannot miss this on a real patient.'},
      {prompt:'What else? Look at the OTHER leads. Anything reciprocal?',
        check:function(i){var l=i.toLowerCase();var d=/depress|reciproc|st.{0,3}\u2193|down/.test(l);var t=/avl|lead.?i\b|lateral/.test(l);return d&&t?'y':d||t?'p':'n'},
        y:'Reciprocal ST depression in I and aVL. Most people miss that.',p:'Close. Elevation inferiorly \u2014 what do you expect in the opposite territory?',
        n:'When you see elevation in one territory, check the opposite leads. Look at I and aVL.',
        give:'Reciprocal ST depression in I and aVL.'},
      {prompt:'Put it all together. Diagnosis.',
        check:function(i){var l=i.toLowerCase();return/inferior/.test(l)&&/stemi|mi\b|infarct/.test(l)?'y':/stemi|mi\b|infarct|inferior/.test(l)?'p':'n'},
        y:'Inferior STEMI. Correct.',p:'What TYPE? What TERRITORY? Be specific.',
        n:'ST elevation in II, III, aVF with reciprocal depression. That\'s a _____ STEMI.',
        give:'Inferior STEMI.'},
      {prompt:'Last question. What artery, and what are you doing right now?',
        check:function(i){var l=i.toLowerCase();var a=/rca|right coronary/.test(l);var c=/cath|pci|intervent|stent/.test(l);return a&&c?'y':a||c?'p':'n'},
        y:'RCA. Cath lab. Now. Time is muscle.\n\n\ud83c\udf89 Excellent work on this case.',p:'I need both \u2014 which artery AND what\'s the emergent intervention?',
        n:'What artery feeds the inferior wall? And this patient needs an emergent procedure.',
        give:'Right coronary artery. Activate the cath lab immediately.'},
    ],
  },
  {
    title:'Case 2',
    clinical:'72M \u2022 Palpitations \u00d7 3 hours \u2022 Heart jumping around \u2022 PMH: HTN \u2022 BP 138/85',
    params:P2,
    summary:'\u2705 **Case Complete: AFib with RVR**\n\n\u2022 Rhythm: Irregularly irregular, no P waves\n\u2022 Rate: ~130-140 bpm\n\u2022 QRS: Narrow (supraventricular)\n\u2022 Dx: Atrial fibrillation with rapid ventricular response\n\u2022 Rx: IV rate control (diltiazem/metoprolol)\n\n\ud83d\udca1 **Pearl:** Irregularly irregular = AFib until proven otherwise.',
    steps:[
      {prompt:'Next. 72-year-old man \u2014 palpitations for 3 hours, says his heart is jumping around. Hypertension history. BP 138/85.\n\nFirst impression. What jumps out?',
        check:function(i){return/irreg|afib|a.?fib|fibrillat|no p/.test(i.toLowerCase())?'y':/fast|rapid|tach/.test(i.toLowerCase())?'p':'n'},
        y:'Irregularly irregular. You see it. Good.',p:'It IS fast. But tell me about the RHYTHM. Are the R-R intervals all the same?',
        n:'Look at the R-R intervals. Are they evenly spaced? Compare several in a row.',
        give:'R-R intervals are completely irregular \u2014 irregularly irregular. That\'s your hallmark finding.'},
      {prompt:'Look at the baseline between QRS complexes. What\'s missing?',
        check:function(i){return/no p|absent|p wave|fibrillat|can.?t find|missing|where/.test(i.toLowerCase())?'y':'n'},
        y:'No organized P waves. Fibrillatory baseline. Good.',n:'Between each QRS you should see something. Can you identify clear, consistent P waves?',
        give:'No P waves. Instead of organized atrial activity, you see chaotic fibrillatory waves.'},
      {prompt:'QRS width \u2014 narrow or wide? And tell me why it matters.',
        check:function(i){var l=i.toLowerCase();return/narrow/.test(l)&&/supra|above|not vent|svt|atri/.test(l)?'y':/narrow/.test(l)?'p':'n'},
        y:'Narrow QRS \u2014 supraventricular origin. Not VT. Important distinction.',p:'It IS narrow. Now tell me why that matters. Where does this rhythm come from?',
        n:'Measure the QRS. Less than 3 small boxes? If narrow, the arrhythmia originates where?',
        give:'Narrow QRS \u2014 under 120ms. Supraventricular origin. Wide QRS would make you worry about VT.'},
      {prompt:'Diagnosis.',
        check:function(i){return/a.?fib|atrial fib|fibrillation/.test(i.toLowerCase())?'y':/svt|tach/.test(i.toLowerCase())?'p':'n'},
        y:'Atrial fibrillation. Rate\'s up around 130-140. What\'s the full name?',p:'More specific. Irregularly irregular, no P waves, narrow QRS. Classic for what?',
        n:'Most common sustained arrhythmia in the world. Irregularly irregular. No P waves.',
        give:'Atrial fibrillation.'},
      {prompt:'The rate is fast. What\'s the complete diagnosis with the rate qualifier?',
        check:function(i){return/rvr|rapid ventricular/.test(i.toLowerCase())?'y':/rapid|fast/.test(i.toLowerCase())?'p':'n'},
        y:'AFib with RVR \u2014 rapid ventricular response. Correct.',p:'Close. Rapid ventricular... what?',
        n:'When ventricular rate in AFib exceeds 100, there\'s a specific term. RV_?',
        give:'AFib with RVR \u2014 rapid ventricular response.'},
      {prompt:'Management. What are you ordering?',
        check:function(i){return/rate.?control|metoprolol|diltiazem|beta.?block|calcium.?ch|cardizem|lopressor/.test(i.toLowerCase())?'y':/slow|control|iv/.test(i.toLowerCase())?'p':'n'},
        y:'Rate control \u2014 IV diltiazem or metoprolol. Get it under 110.\n\n\ud83c\udf89 Well done.',p:'Right idea. Give me a specific drug.',
        n:'First priority in AFib with RVR \u2014 rate control or rhythm control? Which drug?',
        give:'Rate control. IV diltiazem or metoprolol.'},
    ],
  },
  {
    title:'Case 3',
    clinical:'55M \u2022 Pre-operative EKG \u2022 Asymptomatic \u2022 No cardiac history \u2022 Routine surgery',
    params:P3,
    summary:'\u2705 **Case Complete: Right Bundle Branch Block**\n\n\u2022 Rate: ~75, NSR\n\u2022 QRS: Wide (>120ms)\n\u2022 V1: rsR\' pattern\n\u2022 I, V5, V6: Wide slurred S waves\n\u2022 Dx: RBBB\n\u2022 Clinical: Can be normal in isolation\n\n\ud83d\udca1 **Pearl:** MaRRoW \u2014 M-shaped in V1 = Right. Isolated RBBB can be benign. New LBBB is ALWAYS significant.',
    steps:[
      {prompt:'Last case. 55-year-old man \u2014 routine pre-op EKG. Asymptomatic. No cardiac history.\n\nGo.',
        check:function(i){var l=i.toLowerCase();var rt=/7[0-9]|80/.test(l);var rh=/sinus|regular|nsr|normal/.test(l);return rt&&rh?'y':rt||rh?'p':'n'},
        y:'~75, sinus. Good. Now look at the QRS carefully.',p:'Rate AND rhythm. Both.',
        n:'Basics. Regular rhythm? What rate?',give:'~75 bpm, normal sinus. Now for the interesting part.'},
      {prompt:'Look at the QRS duration. What do you notice?',
        check:function(i){return/wide|broad|prolong|>.*120|thick|long/.test(i.toLowerCase())?'y':'n'},
        y:'Wide QRS \u2014 over 120ms. Good catch. Now figure out WHY.',n:'Count small boxes across the QRS. More than 3 small boxes?',
        give:'QRS is wide \u2014 over 120ms. When you see this, you need to determine the cause.'},
      {prompt:'Wide QRS. Look at V1 specifically. Describe the morphology.',
        check:function(i){return/rsr|r.?prime|rabbit|two.?peak|m.?shape|double|second.*r/.test(i.toLowerCase())?'y':/tall|posit/.test(i.toLowerCase())?'p':'n'},
        y:'rsR\' \u2014 the rabbit ears in V1. Textbook.',p:'Describe the SHAPE more specifically. How many peaks?',
        n:'In V1 \u2014 trace the QRS. Small r up, S down, then... what? Second upward deflection?',
        give:'rsR\' pattern \u2014 small r, S wave, then tall R prime. Rabbit ears in V1.'},
      {prompt:'Now lateral leads \u2014 I, V5, V6. What do you see?',
        check:function(i){return/wide s|deep s|slurred s|broad s|big s/.test(i.toLowerCase())?'y':/s wave/.test(i.toLowerCase())?'p':'n'},
        y:'Wide slurred S waves laterally. Completes the picture.',p:'There IS an S wave \u2014 what\'s special about it?',
        n:'Look at the terminal portion of QRS in I and V6.',give:'Wide, slurred S waves in I, V5, V6.'},
      {prompt:'Wide QRS. rsR\' in V1. Wide S laterally. Diagnosis.',
        check:function(i){return/rbbb|right.?bundle/.test(i.toLowerCase())?'y':/bbb|bundle|block/.test(i.toLowerCase())?'p':'n'},
        y:'Right bundle branch block. Correct.',p:'Which SIDE? rsR\' in V1 points to which bundle?',
        n:'MaRRoW. M-shaped in V1 = R for Right. What\'s the diagnosis?',give:'Right bundle branch block \u2014 RBBB.'},
      {prompt:'Clinical question. Pre-op EKG, asymptomatic 55-year-old. How worried are you?',
        check:function(i){return/normal|benign|not.?worr|okay|no.?concern|proceed|fine|variant/.test(i.toLowerCase())?'y':/worr|significant|delay|cancel/.test(i.toLowerCase())?'p':'n'},
        y:'Isolated RBBB, asymptomatic \u2014 often a normal variant. Surgery proceeds.\n\n\ud83c\udf89 Nice work. All cases complete!',
        p:'Is RBBB always pathologic? Does it carry the same weight as LBBB?',
        n:'Isolated RBBB in a healthy patient \u2014 should this delay surgery?',
        give:'Isolated RBBB can be completely normal. Unlike new LBBB (always significant), RBBB alone doesn\'t necessarily indicate pathology.'},
    ],
  },
];

// ================================================================
// ATLAS RESPONSE BANK
// ================================================================
var ATLAS_BANK=[
  {k:['p wave','p-wave','atrial'],r:"The **P wave** represents atrial depolarization.\n\n\u2022 Upright in Lead II, inverted in aVR\n\u2022 Duration < 0.12s, Amplitude < 2.5mm (Lead II)\n\u2022 Absent \u2192 AFib\n\u2022 Peaked \u2192 RAE\n\u2022 Wide/notched \u2192 LAE"},
  {k:['qrs','ventricular depol','bundle branch'],r:"The **QRS complex** = ventricular depolarization.\n\n\u2022 Normal: 0.06\u20130.10s\n\u2022 Wide (>0.12s) \u2192 BBB or ventricular origin\n\u2022 RBBB: rsR' in V1, wide S in I/V6\n\u2022 LBBB: broad R in I/V5/V6, deep S in V1"},
  {k:['st segment','st elev','st depr','stemi','ischemia'],r:"The **ST segment** = early ventricular repolarization.\n\n\u2022 **Elevation** \u22651mm in 2+ contiguous leads \u2192 STEMI\n\u2022 **Depression** \u2192 ischemia, reciprocal changes, digitalis\n\u2022 Reciprocal changes help confirm STEMI vs pericarditis\n\u2022 Always correlate with clinical presentation!"},
  {k:['t wave','repolar','t-wave'],r:"The **T wave** = ventricular repolarization.\n\n\u2022 Normally upright in I, II, V3-V6\n\u2022 Hyperacute (tall, peaked) \u2192 early MI or hyperkalemia\n\u2022 Inversions \u2192 ischemia, strain, or normal variant\n\u2022 Wellens: deep symmetric inversions V2-V3 = critical LAD stenosis"},
  {k:['pr interval','pr-interval','av node','first degree'],r:"**PR interval** = P onset to QRS onset.\n\n\u2022 Normal: 0.12\u20130.20s (3\u20135 small boxes)\n\u2022 Prolonged \u2192 1st degree AV block\n\u2022 Short (<0.12s) \u2192 WPW or junctional\n\u2022 Variable \u2192 2nd/3rd degree block"},
  {k:['rate','heart rate','calculate','bpm'],r:"**Heart rate calculation:**\n\n1. **300 method** (regular): 300 \u00f7 large boxes between R-R\n2. **1500 method** (precise): 1500 \u00f7 small boxes\n3. **6-second method** (irregular): R waves in 30 large boxes \u00d7 10\n\n\ud83d\udccf Try the caliper tool to measure R-R intervals!"},
  {k:['axis','deviation','lad','rad'],r:"**Quick axis:**\n\n\u2022 I \u2b06 + aVF \u2b06 \u2192 **Normal** (0\u00b0 to +90\u00b0)\n\u2022 I \u2b06 + aVF \u2b07 \u2192 **LAD**\n\u2022 I \u2b07 + aVF \u2b06 \u2192 **RAD**\n\u2022 Both \u2b07 \u2192 **Extreme**\n\nLAD causes: LAFB, inferior MI\nRAD causes: RVH, PE, lateral MI"},
  {k:['qt','qtc','long qt'],r:"**QT interval** = total ventricular electrical activity.\n\n\u2022 Correct for HR \u2192 QTc (Bazett: QT \u00f7 \u221aRR)\n\u2022 Normal QTc: <0.44s (men), <0.46s (women)\n\u2022 Prolonged \u2192 Torsades risk\n\u2022 Causes: drugs, \u2193K, \u2193Mg, \u2193Ca, congenital"},
  {k:['afib','atrial fib','a-fib','fibrillation'],r:"**Atrial Fibrillation:**\n\n\u2022 Irregularly irregular rhythm\n\u2022 No organized P waves \u2192 fibrillatory baseline\n\u2022 Usually narrow QRS (unless aberrant conduction)\n\u2022 Most common sustained arrhythmia\n\u2022 RVR = rate >100; controlled = rate <100\n\u2022 Management: rate vs rhythm control + anticoagulation"},
  {k:['rbbb','right bundle','marrow'],r:"**RBBB** (Right Bundle Branch Block):\n\n\u2022 QRS >120ms\n\u2022 rsR' in V1 (rabbit ears)\n\u2022 Wide S in I, V5, V6\n\u2022 Mnemonic: **MaRRoW** \u2014 M in V1 = Right\n\u2022 Can be normal finding\n\u2022 Unlike LBBB, not always pathologic"},
  {k:['reciproc','mirror'],r:"**Reciprocal changes** = ST depression in leads opposite to ST elevation.\n\n\u2022 Increase specificity for STEMI\n\u2022 Help localize culprit vessel\n\u2022 Distinguish STEMI from pericarditis\n\u2022 Pericarditis: diffuse elevation, NO reciprocal changes\n\u2022 STEMI: territorial elevation WITH reciprocal depression"},
];

// ================================================================
// WAVEFORM GENERATION
// ================================================================
var G=function(t,a,c,w){return a*Math.exp(-((t-c)*(t-c))/(2*w*w));};
var Tri=function(t,a,c,h){var d=Math.abs(t-c);return d>=h?0:a*(1-d/h);};
var _s=42;
var sr=function(){_s=((_s*16807)%2147483647);return(_s-1)/2147483646;};

function genWave(params,lead,dur){
  var p=params[lead];
  if(!p)return[];
  _s=lead.charCodeAt(0)*1000+(lead.charCodeAt(1)||0)*100+7;
  var pts=[],dt=1/250,isIrr=p.irregular;
  var beats=null;
  if(isIrr){
    var saved=_s;_s=12345;
    beats=[0];var bt=0;
    while(bt<dur+2){bt+=0.32+sr()*0.55;beats.push(bt);}
    _s=saved;
  }
  for(var t=0;t<dur;t+=dt){
    var ct;
    if(isIrr&&beats){
      var bi=0;
      for(var b=0;b<beats.length-1;b++){if(t>=beats[b]&&t<beats[b+1]){bi=b;break;}}
      var bD=beats[bi+1]-beats[bi];
      ct=((t-beats[bi])/bD)*CYC;
    }else{ct=t%CYC;}
    var v=0;
    if(!p.noP)v+=G(ct,p.p[0],p.p[1],p.p[2]);
    v+=Tri(ct,p.q[0],p.q[1],p.q[2]);
    v+=Tri(ct,p.r[0],p.r[1],p.r[2]);
    v+=Tri(ct,p.s[0],p.s[1],p.s[2]);
    if(p.rPrime)v+=Tri(ct,p.rPrime[0],p.rPrime[1],p.rPrime[2]);
    if(p.stE){var a1=0.24,b1=0.33;if(ct>=a1&&ct<=b1)v+=p.stE*Math.sin(Math.PI*(ct-a1)/(b1-a1));}
    if(p.stD){var a2=0.24,b2=0.33;if(ct>=a2&&ct<=b2)v+=p.stD*Math.sin(Math.PI*(ct-a2)/(b2-a2));}
    v+=G(ct,p.t[0],p.t[1],p.t[2]);
    if(p.fib){v+=0.03*Math.sin(t*2*Math.PI*6.7)+0.02*Math.sin(t*2*Math.PI*8.3)+0.015*Math.sin(t*2*Math.PI*11.1);}
    v+=(sr()-0.5)*(p.noise||0.007);
    pts.push([t,v]);
  }
  return pts;
}

function toPath(pts,ox,oy,sx,sy){
  if(!pts.length)return'';
  var d='M'+(ox+pts[0][0]*sx).toFixed(1)+','+(oy-pts[0][1]*sy).toFixed(1);
  for(var i=1;i<pts.length;i++)d+=' L'+(ox+pts[i][0]*sx).toFixed(1)+','+(oy-pts[i][1]*sy).toFixed(1);
  return d;
}

function renderMd(text){
  return text.split('\n').map(function(line,li){
    return React.createElement(React.Fragment,{key:li},
      li>0&&React.createElement('br'),
      line.split(/(\*\*.*?\*\*)/).map(function(part,pi){
        if(part.startsWith('**')&&part.endsWith('**'))
          return React.createElement('strong',{key:pi},part.slice(2,-2));
        return part;
      })
    );
  });
}

// ================================================================
// STYLES
// ================================================================
var ST={
  wrap:{
    fontFamily:"'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",
    maxWidth:1500,margin:'0 auto',borderRadius:16,overflow:'visible',
    boxShadow:'0 8px 48px rgba(0,0,0,0.12)',background:'#fff',position:'relative',
  },
  header:{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'14px 24px',
    background:'linear-gradient(135deg,#0d1117,#161b22,#1c2333)',color:'#fff',flexWrap:'wrap',gap:12},
  hLeft:{display:'flex',alignItems:'center',gap:12},
  hIcon:{fontSize:22,width:38,height:38,borderRadius:10,background:'rgba(255,255,255,0.1)',display:'flex',alignItems:'center',justifyContent:'center'},
  hTitle:{fontSize:17,fontWeight:700,letterSpacing:'-0.3px'},
  hSub:{fontSize:11,color:'#8b949e',marginTop:1},
  hRight:{textAlign:'right'},
  badge:{display:'inline-block',fontSize:10,background:'rgba(46,204,113,0.15)',color:'#2ecc71',padding:'3px 10px',borderRadius:20,fontWeight:700,letterSpacing:'0.5px',marginBottom:3},
  hInfo:{fontSize:12,color:'#8b949e'},

  modeToggle:{display:'flex',background:'rgba(255,255,255,0.08)',borderRadius:10,padding:3,gap:2},
  modeBtn:{padding:'8px 20px',border:'none',borderRadius:8,background:'transparent',color:'#8b949e',cursor:'pointer',fontSize:13,fontWeight:600,transition:'all 0.2s'},
  modeBtnActive:{background:'#1976d2',color:'#fff',boxShadow:'0 2px 8px rgba(25,118,210,0.4)'},
  modeBtnActiveR:{background:'#c62828',color:'#fff',boxShadow:'0 2px 8px rgba(198,40,40,0.4)'},

  toolbar:{display:'flex',alignItems:'center',gap:8,padding:'10px 20px',
    background:'linear-gradient(180deg,#f6f8fa,#f0f2f5)',borderBottom:'1px solid #e1e4e8',flexWrap:'wrap'},
  tGroup:{display:'flex',alignItems:'center',gap:4},
  tLabel:{fontSize:12,fontWeight:600,color:'#57606a',marginRight:2},
  tVal:{fontSize:12,fontWeight:700,color:'#24292f',minWidth:38,textAlign:'center',fontFamily:'monospace'},
  tBtn:{padding:'6px 11px',border:'1px solid #d0d7de',borderRadius:6,background:'#fff',cursor:'pointer',fontSize:13,color:'#24292f',fontWeight:500,lineHeight:1},
  tWide:{padding:'6px 14px'},
  tActive:{background:'#0969da',color:'#fff',borderColor:'#0969da',boxShadow:'0 1px 4px rgba(9,105,218,0.3)'},
  tDiv:{width:1,height:26,background:'#d8dee4',margin:'0 4px'},
  measBox:{display:'flex',gap:12,padding:'5px 12px',background:'#dbeafe',borderRadius:8,border:'1px solid #bfdbfe'},
  measItem:{fontSize:12,color:'#1e40af',whiteSpace:'nowrap'},

  mainArea:{display:'flex',height:620,overflow:'hidden',borderBottom:'1px solid #e5e7eb'},

  tooltip:{position:'fixed',background:'#fff',borderRadius:12,padding:'0 14px 12px',
    boxShadow:'0 8px 32px rgba(0,0,0,0.15)',zIndex:1000,pointerEvents:'none',maxWidth:280,overflow:'hidden'},
  ttBar:{height:3,margin:'0 -14px 10px'},
  ttTitle:{fontWeight:700,fontSize:15,marginBottom:4},
  ttDesc:{fontSize:12.5,color:'#555',lineHeight:1.5},
  ttLead:{fontSize:11,color:'#bbb',marginTop:6,fontFamily:'monospace'},

  statusBar:{padding:'8px 16px',background:'#fafbfc',borderTop:'1px solid #eef0f2',fontSize:12,minHeight:18},

  teachBottom:{display:'flex',gap:16,padding:'16px 20px',background:'linear-gradient(180deg,#f9fafb,#f3f4f6)',borderTop:'1px solid #e5e7eb'},
  teachIcon:{fontSize:32,flexShrink:0},
  teachTitle:{fontSize:15,fontWeight:700,color:'#374151',marginBottom:4},
  teachDesc:{fontSize:13,color:'#6b7280',lineHeight:1.6},
  teachHint:{fontSize:12,color:'#9ca3af',marginTop:8},

  reader:{width:400,flexShrink:0,borderLeft:'2px solid #e5e7eb',display:'flex',flexDirection:'column',background:'#fafafa',minHeight:0,overflow:'hidden'},
  rHead:{padding:'14px 18px',background:'linear-gradient(135deg,#b71c1c,#c62828,#d32f2f)',color:'#fff',display:'flex',justifyContent:'space-between',alignItems:'center',flexShrink:0},
  rHeadTitle:{fontSize:16,fontWeight:700},
  rHeadSub:{fontSize:11,opacity:0.85,marginTop:1},
  rProgress:{fontSize:11,background:'rgba(255,255,255,0.2)',padding:'4px 10px',borderRadius:12,fontWeight:600},

  caseTabs:{display:'flex',gap:4,padding:'10px 14px',background:'#f0f0f0',borderBottom:'1px solid #e0e0e0',flexShrink:0},
  caseTab:{flex:1,padding:'7px 0',border:'1px solid #d0d0d0',borderRadius:8,background:'#fff',cursor:'pointer',fontSize:12,fontWeight:600,color:'#666',textAlign:'center'},
  caseTabActive:{background:'#c62828',color:'#fff',borderColor:'#c62828',boxShadow:'0 2px 6px rgba(198,40,40,0.25)'},

  clinical:{padding:'12px 16px',background:'#fff3e0',borderBottom:'1px solid #ffe0b2',margin:0,flexShrink:0},
  clinLabel:{fontSize:10,fontWeight:700,color:'#e65100',textTransform:'uppercase',letterSpacing:'0.5px',marginBottom:4},
  clinText:{fontSize:12.5,color:'#bf360c',lineHeight:1.5,fontWeight:500},

  rMsgs:{flex:1,overflowY:'auto',padding:'14px',display:'flex',flexDirection:'column',gap:10,minHeight:0},
  rMsg:{borderRadius:12,padding:'10px 14px',maxWidth:'95%',lineHeight:1.5,fontSize:13},
  rMsgR:{background:'#fff',alignSelf:'flex-start',border:'1px solid #eee',boxShadow:'0 1px 3px rgba(0,0,0,0.04)',borderBottomLeftRadius:4},
  rMsgU:{background:'#e3f2fd',alignSelf:'flex-end',borderBottomRightRadius:4},
  rMsgLabel:{fontSize:9,fontWeight:700,color:'#c62828',textTransform:'uppercase',letterSpacing:'0.5px',marginBottom:4},
  rMsgText:{color:'#333',lineHeight:1.6},

  rInputWrap:{borderTop:'1px solid #e0e0e0',background:'#fff',padding:'12px 14px',flexShrink:0},
  rInputRow:{display:'flex',gap:8},
  rInput:{flex:1,padding:'10px 14px',border:'1px solid #d0d7de',borderRadius:10,fontSize:13,outline:'none'},
  rSend:{padding:'10px 18px',background:'#c62828',color:'#fff',border:'none',borderRadius:10,fontWeight:700,cursor:'pointer',fontSize:16},

  atlasWrap:{position:'fixed',bottom:28,left:28,zIndex:9999},
  heartBtn:{
    width:60,height:60,borderRadius:'50%',border:'none',cursor:'pointer',fontSize:28,
    background:'linear-gradient(135deg,#e53935,#c62828)',
    boxShadow:'0 4px 20px rgba(220,40,40,0.35)',
    display:'flex',alignItems:'center',justifyContent:'center',
    animation:'ekgPulse 2s ease-in-out infinite',transition:'all 0.2s',
  },
  heartBtnActive:{
    animation:'none',background:'linear-gradient(135deg,#1565c0,#1976d2)',
    boxShadow:'0 4px 20px rgba(25,118,210,0.4)',transform:'scale(1.05)',
  },

  atlasBubble:{
    position:'absolute',bottom:72,left:-10,width:260,
    background:'#fff',borderRadius:16,padding:'16px 18px',
    boxShadow:'0 8px 32px rgba(0,0,0,0.15)',animation:'fadeSlideIn 0.4s ease-out',
  },
  bubbleX:{position:'absolute',top:8,right:10,background:'none',border:'none',cursor:'pointer',fontSize:14,color:'#aaa'},
  bubbleTitle:{fontSize:15,color:'#333',marginBottom:4},
  bubbleText:{fontSize:13,color:'#666',lineHeight:1.5},
  bubbleArrow:{
    position:'absolute',bottom:-8,left:30,width:0,height:0,
    borderLeft:'8px solid transparent',borderRight:'8px solid transparent',borderTop:'8px solid #fff',
  },

  atlasPopup:{
    position:'fixed',bottom:100,left:28,width:380,height:480,
    background:'#fff',borderRadius:20,overflow:'hidden',
    boxShadow:'0 12px 48px rgba(0,0,0,0.18)',
    display:'flex',flexDirection:'column',zIndex:9998,animation:'fadeSlideIn 0.3s ease-out',
  },
  apHead:{padding:'14px 18px',background:'linear-gradient(135deg,#1565c0,#1976d2)',color:'#fff',display:'flex',justifyContent:'space-between',alignItems:'center'},
  apTitle:{fontSize:15,fontWeight:700},
  apSub:{fontSize:11,opacity:0.85,marginTop:1},
  apX:{background:'rgba(255,255,255,0.2)',border:'none',color:'#fff',width:28,height:28,borderRadius:'50%',cursor:'pointer',fontSize:14,display:'flex',alignItems:'center',justifyContent:'center'},
  apMsgs:{flex:1,overflowY:'auto',padding:'14px',display:'flex',flexDirection:'column',gap:10,background:'#f9fafb'},
  apMsg:{borderRadius:12,padding:'10px 14px',maxWidth:'92%',lineHeight:1.5,fontSize:12.5},
  apMsgU:{background:'#e3f2fd',alignSelf:'flex-end',borderBottomRightRadius:4},
  apMsgAI:{background:'#fff',alignSelf:'flex-start',border:'1px solid #eee',boxShadow:'0 1px 3px rgba(0,0,0,0.04)',borderBottomLeftRadius:4},
  apMsgLabel:{fontSize:9,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.5px',marginBottom:4},
  apMsgText:{color:'#333',lineHeight:1.6},
  apInputWrap:{display:'flex',gap:8,padding:'12px 14px',borderTop:'1px solid #e0e0e0',background:'#fff'},
  apInput:{flex:1,padding:'10px 14px',border:'1px solid #d0d7de',borderRadius:10,fontSize:13,outline:'none'},
  apSend:{padding:'10px 16px',background:'#1976d2',color:'#fff',border:'none',borderRadius:10,fontWeight:600,cursor:'pointer',fontSize:13},
};

// ================================================================
// MAIN COMPONENT
// ================================================================
function EKGViewer() {
  var _s1=useState('teaching');var mode=_s1[0],setMode=_s1[1];
  var _s2=useState(1);var zoom=_s2[0],setZoom=_s2[1];
  var _s3=useState('pointer');var tool=_s3[0],setTool=_s3[1];
  var _s4=useState(false);var showAnn=_s4[0],setShowAnn=_s4[1];
  var _s5=useState(false);var showComp=_s5[0],setShowComp=_s5[1];
  var _s6=useState([]);var calPts=_s6[0],setCalPts=_s6[1];
  var _s7=useState(null);var hover=_s7[0],setHover=_s7[1];

  var _s8=useState(0);var cIdx=_s8[0],setCIdx=_s8[1];
  var _s9=useState([]);var rMsgs=_s9[0],setRMsgs=_s9[1];
  var _s10=useState(0);var rStep=_s10[0],setRStep=_s10[1];
  var _s11=useState('');var rInput=_s11[0],setRInput=_s11[1];
  var _s12=useState(0);var wrongCt=_s12[0],setWrongCt=_s12[1];

  var _s13=useState(false);var atlasOpen=_s13[0],setAtlasOpen=_s13[1];
  var _s14=useState(true);var atlasTip=_s14[0],setAtlasTip=_s14[1];
  var _s15=useState([{role:'ai',text:"Hi! I'm **ATLAS**, your EKG learning assistant.\n\nAsk me about any concept \u2014 P waves, QRS, ST segments, axis, rate, intervals, rhythms, anything.\n\nI'm always here. Just click me anytime!"}]);
  var aMsgs=_s15[0],setAMsgs=_s15[1];
  var _s16=useState('');var aInput=_s16[0],setAInput=_s16[1];

  var svgRef=useRef(null);
  var rEndRef=useRef(null);
  var aEndRef=useRef(null);

  useEffect(function(){
    if(atlasTip){var t=setTimeout(function(){setAtlasTip(false);},8000);return function(){clearTimeout(t);};}
  },[atlasTip]);

  useEffect(function(){
    if(mode==='practice'){
      var c=CASES[cIdx];
      setRMsgs([{role:'r',text:c.steps[0].prompt}]);
      setRStep(0);setWrongCt(0);setRInput('');
    }
  },[mode,cIdx]);

  var curParams=mode==='teaching'?TEACH:CASES[cIdx].params;

  var wf=useMemo(function(){
    var main={};
    LEADS.forEach(function(l){main[l]=genWave(curParams,l,CDUR);});
    main.rhythm=genWave(curParams,'II',10);
    var norm=null;
    if(mode==='teaching'){
      norm={};
      LEADS.forEach(function(l){norm[l]=genWave(NRM,l,CDUR);});
      norm.rhythm=genWave(NRM,'II',10);
    }
    return{main:main,norm:norm};
  },[mode,cIdx]);

  var calM=useMemo(function(){
    if(calPts.length!==2)return null;
    var dx=Math.abs(calPts[1].x-calPts[0].x);
    var dy=Math.abs(calPts[1].y-calPts[0].y);
    var ms=Math.round(dx/PX_S*1000);
    var mv=(dy/PX_MV).toFixed(2);
    var hr=ms>200?Math.round(60000/ms):0;
    return{ms:ms,mv:mv,hr:hr};
  },[calPts]);

  var getSVG=useCallback(function(e){
    var r=svgRef.current?svgRef.current.getBoundingClientRect():null;
    if(!r)return{x:0,y:0};
    return{x:(e.clientX-r.left)/r.width*VBW,y:(e.clientY-r.top)/r.height*VBH};
  },[]);

  var cellPos=function(ri,ci){return{x:ML+ci*CW,y:MT+ri*CH,cy:MT+ri*CH+CH/2};};
  var rhythmY=MT+ROWS*CH+10;
  var numCyc=Math.floor(CDUR/CYC);

  var switchMode=useCallback(function(m){
    setMode(m);setCalPts([]);setTool('pointer');setHover(null);
    if(m==='practice'){setShowAnn(false);setShowComp(false);}
  },[]);

  var onSVGClick=useCallback(function(e){
    if(tool!=='caliper')return;
    var pt=getSVG(e);
    setCalPts(function(prev){return prev.length>=2?[pt]:prev.concat([pt]);});
  },[tool,getSVG]);

  var sendAtlas=useCallback(function(){
    var t=aInput.trim();if(!t)return;
    var um={role:'user',text:t};
    var lower=t.toLowerCase();
    var resp="Great question! Try asking about specific waves (P wave, QRS, T wave), intervals (PR, QT), segments (ST segment), or concepts (rate, axis, rhythm, AFib, RBBB). I know a lot!";
    for(var i=0;i<ATLAS_BANK.length;i++){
      var item=ATLAS_BANK[i];var found=false;
      for(var j=0;j<item.k.length;j++){if(lower.indexOf(item.k[j])!==-1){found=true;break;}}
      if(found){resp=item.r;break;}
    }
    setAMsgs(function(prev){return prev.concat([um,{role:'ai',text:resp}]);});
    setAInput('');
    setTimeout(function(){if(aEndRef.current)aEndRef.current.scrollIntoView({behavior:'smooth'});},100);
  },[aInput]);

  var sendReader=useCallback(function(){
    var t=rInput.trim();if(!t)return;
    var c=CASES[cIdx];
    var step=c.steps[rStep];
    var newMsgs=rMsgs.concat([{role:'u',text:t}]);

    if(!step){
      newMsgs.push({role:'r',text:"We've covered this case. Select another case above, or ask ATLAS if you have concept questions!"});
      setRMsgs(newMsgs);setRInput('');return;
    }

    var result=step.check(t);
    var shouldGive=wrongCt>=1&&result!=='y';

    if(result==='y'||shouldGive){
      var fb=shouldGive?(step.give||step.y):step.y;
      newMsgs.push({role:'r',text:fb});
      var nextIdx=rStep+1;
      if(nextIdx<c.steps.length){
        newMsgs.push({role:'r',text:c.steps[nextIdx].prompt});
      }else{
        newMsgs.push({role:'r',text:c.summary});
      }
      setRStep(nextIdx);setWrongCt(0);
    }else{
      var fb2=result==='p'?(step.p||step.n):step.n;
      newMsgs.push({role:'r',text:fb2});
      setWrongCt(function(w){return w+1;});
    }

    setRMsgs(newMsgs);setRInput('');
    setTimeout(function(){if(rEndRef.current)rEndRef.current.scrollIntoView({behavior:'smooth'});},100);
  },[rInput,cIdx,rStep,rMsgs,wrongCt]);

  // ─── SVG EKG Renderer ───
  var renderEKG=function(){
    return(
      <svg ref={svgRef} viewBox={'0 0 '+VBW+' '+VBH}
        style={{width:(100*zoom)+'%',minWidth:'100%',display:'block',background:'#fff8f6'}}
        onClick={onSVGClick}>
        <defs>
          <pattern id="sg" width={SM} height={SM} patternUnits="userSpaceOnUse">
            <path d={'M'+SM+' 0L0 0 0 '+SM} fill="none" stroke="#f0c8c8" strokeWidth="0.25"/>
          </pattern>
          <pattern id="lg" width={LG} height={LG} patternUnits="userSpaceOnUse">
            <rect width={LG} height={LG} fill="url(#sg)"/>
            <path d={'M'+LG+' 0L0 0 0 '+LG} fill="none" stroke="#d4a0a0" strokeWidth="0.5"/>
          </pattern>
          <clipPath id="ec"><rect x={ML} y={MT} width={COLS*CW} height={(ROWS+1)*CH+14}/></clipPath>
        </defs>

        <rect x={ML} y={MT} width={COLS*CW} height={(ROWS+1)*CH+14} fill="url(#lg)" clipPath="url(#ec)" rx="2"/>

        <g transform={'translate('+(ML-32)+','+(MT+CH/2)+')'}>
          <path d={'M0,0 L0,'+(-PX_MV)+' L14,'+(-PX_MV)+' L14,0'} fill="none" stroke="#444" strokeWidth="0.9"/>
          <text x="-3" y={-PX_MV-4} fontSize="6" fill="#888" fontFamily="sans-serif">1 mV</text>
        </g>

        {GRID_L.map(function(row,ri){return row.map(function(lead,ci){
          var pos=cellPos(ri,ci);var x=pos.x,y=pos.y,cy=pos.cy;
          var mainPts=wf.main[lead];
          return(
            <g key={lead}>
              <line x1={x} y1={y} x2={x} y2={y+CH} stroke="#c8a8a8" strokeWidth="0.4"/>
              {ri===0&&<line x1={x} y1={y} x2={x+CW} y2={y} stroke="#c8a8a8" strokeWidth="0.4"/>}
              <line x1={x} y1={cy} x2={x+CW} y2={cy} stroke="#e8d0d0" strokeWidth="0.3" strokeDasharray="2,4"/>
              <rect x={x+2} y={y+2} width={28} height={12} rx={2} fill="rgba(255,255,255,0.85)"/>
              <text x={x+5} y={y+11} fontSize="9" fontWeight="700" fill="#333" fontFamily="'Courier New',monospace">{lead}</text>

              {showComp&&wf.norm&&<path d={toPath(wf.norm[lead],x,cy,PX_S,PX_MV)} fill="none" stroke="rgba(33,150,243,0.4)" strokeWidth="1.6" strokeDasharray="4,2"/>}
              <path d={toPath(mainPts,x,cy,PX_S,PX_MV)} fill="none" stroke="#111" strokeWidth="1.2"/>

              {mode==='teaching'&&Array.from({length:numCyc},function(_,c2){
                return SEGS.map(function(seg){
                  var sx2=x+(c2*CYC+seg.s)*PX_S;var sw2=(seg.e-seg.s)*PX_S;
                  var isH=hover&&hover.lead===lead&&hover.c===c2&&hover.id===seg.id;
                  return(<rect key={'h-'+lead+'-'+c2+'-'+seg.id}
                    x={sx2} y={y+15} width={sw2} height={CH-15}
                    fill={isH?seg.color+'18':'transparent'}
                    stroke={isH?seg.color:'none'} strokeWidth={isH?0.6:0}
                    strokeDasharray={isH?'2,1':'none'}
                    style={{cursor:'pointer'}}
                    onMouseEnter={function(e){setHover({id:seg.id,lead:lead,c:c2,seg:seg,cx:e.clientX,cy:e.clientY});}}
                    onMouseMove={function(e){if(hover)setHover(function(h){return Object.assign({},h,{cx:e.clientX,cy:e.clientY});});}}
                    onMouseLeave={function(){setHover(null);}}/>);
                });
              })}

              {showAnn&&mode==='teaching'&&Array.from({length:numCyc},function(_,c2){
                return SEGS.map(function(seg){
                  var mx=x+(c2*CYC+(seg.s+seg.e)/2)*PX_S;
                  return(<g key={'a-'+lead+'-'+c2+'-'+seg.id}>
                    <rect x={mx-14} y={y+CH-12} width={28} height={9} rx={2} fill={seg.color} opacity="0.15"/>
                    <text x={mx} y={y+CH-4.5} fontSize="5" fill={seg.color} textAnchor="middle" fontFamily="sans-serif" fontWeight="700" opacity="0.85">
                      {seg.id==='pr'?'PR':seg.id==='st'?'ST':seg.id.toUpperCase()}
                    </text>
                  </g>);
                });
              })}
            </g>
          );
        });})}

        <line x1={ML} y1={rhythmY-2} x2={ML+COLS*CW} y2={rhythmY-2} stroke="#b89898" strokeWidth="0.6"/>

        <g>
          <line x1={ML} y1={rhythmY+CH/2} x2={ML+COLS*CW} y2={rhythmY+CH/2} stroke="#e8d0d0" strokeWidth="0.3" strokeDasharray="2,4"/>
          <rect x={ML+2} y={rhythmY+2} width={55} height={12} rx={2} fill="rgba(255,255,255,0.85)"/>
          <text x={ML+5} y={rhythmY+11} fontSize="9" fontWeight="700" fill="#333" fontFamily="'Courier New',monospace">II rhythm</text>
          {showComp&&wf.norm&&<path d={toPath(wf.norm.rhythm,ML,rhythmY+CH/2,PX_S,PX_MV)} fill="none" stroke="rgba(33,150,243,0.4)" strokeWidth="1.6" strokeDasharray="4,2"/>}
          <path d={toPath(wf.main.rhythm,ML,rhythmY+CH/2,PX_S,PX_MV)} fill="none" stroke="#111" strokeWidth="1.2"/>
          {Array.from({length:11},function(_,i){return(
            <g key={'tm'+i}>
              <line x1={ML+i*PX_S} y1={rhythmY+CH} x2={ML+i*PX_S} y2={rhythmY+CH+4} stroke="#999" strokeWidth="0.4"/>
              <text x={ML+i*PX_S} y={rhythmY+CH+10} fontSize="5.5" fill="#aaa" textAnchor="middle" fontFamily="sans-serif">{i}s</text>
            </g>
          );})}
          <text x={ML+COLS*CW-5} y={rhythmY+CH-4} fontSize="6.5" fill="#bbb" fontFamily="sans-serif" textAnchor="end">25 mm/s | 10 mm/mV</text>
        </g>

        {calPts.map(function(pt,i){return(
          <g key={'cp'+i}>
            <line x1={pt.x} y1={MT} x2={pt.x} y2={VBH-15} stroke="#0066cc" strokeWidth="0.8" strokeDasharray="3,2" opacity="0.6"/>
            <circle cx={pt.x} cy={pt.y} r="3" fill="#0066cc" stroke="#fff" strokeWidth="0.6"/>
          </g>
        );})}
        {calPts.length===2&&calM&&(
          <g>
            <line x1={calPts[0].x} y1={calPts[0].y} x2={calPts[1].x} y2={calPts[1].y} stroke="#0066cc" strokeWidth="1.5" opacity="0.7"/>
            <rect x={(calPts[0].x+calPts[1].x)/2-28} y={(calPts[0].y+calPts[1].y)/2-11} width="56" height="16" rx="4" fill="#0066cc" opacity="0.9"/>
            <text x={(calPts[0].x+calPts[1].x)/2} y={(calPts[0].y+calPts[1].y)/2+2} fontSize="9" fill="#fff" textAnchor="middle" fontFamily="sans-serif" fontWeight="700">{calM.ms} ms</text>
          </g>
        )}
      </svg>
    );
  };

  // ================================================================
  // RENDER
  // ================================================================
  return(
    <div style={ST.wrap}>

      {/* HEADER */}
      <div style={ST.header}>
        <div style={ST.hLeft}>
          <div style={ST.hIcon}>&#9889;</div>
          <div>
            <div style={ST.hTitle}>Interactive EKG Viewer</div>
            <div style={ST.hSub}>AI-Powered Learning Module</div>
          </div>
        </div>
        <div style={ST.modeToggle}>
          <button onClick={function(){switchMode('teaching');}}
            style={Object.assign({},ST.modeBtn,mode==='teaching'?ST.modeBtnActive:{})}>
            &#128218; Teaching
          </button>
          <button onClick={function(){switchMode('practice');}}
            style={Object.assign({},ST.modeBtn,mode==='practice'?ST.modeBtnActiveR:{})}>
            &#127947; Practice
          </button>
        </div>
        <div style={ST.hRight}>
          <div style={ST.badge}>{mode==='teaching'?'TEACHING MODE':'PRACTICE MODE'}</div>
          <div style={ST.hInfo}>
            {mode==='teaching'?'Anterior STEMI \u2022 62yo Male \u2022 75 bpm':CASES[cIdx].title+' \u2022 '+CASES[cIdx].clinical.split('\u2022')[0].trim()}
          </div>
        </div>
      </div>

      {/* TOOLBAR */}
      <div style={ST.toolbar}>
        <div style={ST.tGroup}>
          <span style={ST.tLabel}>&#128269;</span>
          <button onClick={function(){setZoom(function(z){return Math.max(0.5,z-0.25);});}} style={ST.tBtn}>&minus;</button>
          <span style={ST.tVal}>{Math.round(zoom*100)}%</span>
          <button onClick={function(){setZoom(function(z){return Math.min(3,z+0.25);});}} style={ST.tBtn}>+</button>
          {zoom!==1&&<button onClick={function(){setZoom(1);}} style={Object.assign({},ST.tBtn,{fontSize:11,color:'#666'})}>Reset</button>}
        </div>
        <div style={ST.tDiv}/>
        <button onClick={function(){setTool(function(t2){return t2==='caliper'?'pointer':'caliper';});setCalPts([]);}}
          style={Object.assign({},ST.tBtn,ST.tWide,tool==='caliper'?ST.tActive:{})}>
          &#128207; Calipers
        </button>
        {mode==='teaching'&&(
          <React.Fragment>
            <button onClick={function(){setShowAnn(function(a){return!a;});}}
              style={Object.assign({},ST.tBtn,ST.tWide,showAnn?ST.tActive:{})}>
              &#127991; Annotations
            </button>
            <button onClick={function(){setShowComp(function(c2){return!c2;});}}
              style={Object.assign({},ST.tBtn,ST.tWide,showComp?ST.tActive:{})}>
              &#128202; Normal Overlay
            </button>
          </React.Fragment>
        )}
        {calM&&(
          <React.Fragment>
            <div style={ST.tDiv}/>
            <div style={ST.measBox}>
              <span style={ST.measItem}>&#9201; <b>{calM.ms}ms</b></span>
              <span style={ST.measItem}>&#128208; <b>{calM.mv}mV</b></span>
              {calM.hr>20&&calM.hr<300&&<span style={ST.measItem}>&#10084; <b>~{calM.hr}bpm</b></span>}
            </div>
          </React.Fragment>
        )}
      </div>

      {/* MAIN CONTENT */}
      <div style={ST.mainArea}>
        <div style={{flex:mode==='practice'?'1 1 60%':'1 1 100%',minWidth:0,overflow:'hidden',position:'relative',display:'flex',flexDirection:'column'}}>
          <div style={{flex:1,overflow:zoom>1?'auto':'hidden',cursor:tool==='caliper'?'crosshair':'default'}}>
            {renderEKG()}
          </div>

          {hover&&mode==='teaching'&&(
            <div style={Object.assign({},ST.tooltip,{left:hover.cx+18,top:hover.cy-80})}>
              <div style={Object.assign({},ST.ttBar,{background:hover.seg.color})}/>
              <div style={Object.assign({},ST.ttTitle,{color:hover.seg.color})}>{hover.seg.label}</div>
              <div style={ST.ttDesc}>{hover.seg.desc}</div>
              <div style={ST.ttLead}>Lead {hover.lead}</div>
            </div>
          )}

          <div style={ST.statusBar}>
            {tool==='caliper'&&<span style={{color:'#0066cc'}}>&#128207; Click two points to measure</span>}
            {tool!=='caliper'&&!hover&&mode==='teaching'&&<span style={{color:'#999'}}>Hover over waveforms to identify components &bull; Use toolbar for tools</span>}
            {tool!=='caliper'&&mode==='practice'&&!hover&&<span style={{color:'#999'}}>Use calipers to measure intervals &bull; Discuss findings with READER &rarr;</span>}
            {hover&&<span style={{color:hover.seg.color}}>&#128269; <strong>{hover.seg.label}</strong> &mdash; {hover.seg.desc}</span>}
            {showComp&&<span style={{color:'#1976d2',marginLeft:16}}>&#128202; Blue dashed = normal</span>}
          </div>

          {mode==='teaching'&&(
            <div style={ST.teachBottom}>
              <div style={ST.teachIcon}>&#129505;</div>
              <div>
                <div style={ST.teachTitle}>Teaching EKG: Anterior STEMI</div>
                <div style={ST.teachDesc}>Explore this EKG using the tools above. Toggle <b>Annotations</b> to see labeled wave components. Use <b>Normal Overlay</b> to compare against a healthy EKG. Try the <b>Calipers</b> to measure intervals.</div>
                <div style={ST.teachHint}>&#128161; Tip: Hover over any part of the waveform to learn what it represents.</div>
              </div>
            </div>
          )}
        </div>

        {/* READER SIDEBAR */}
        {mode==='practice'&&(
          <div style={ST.reader}>
            <div style={ST.rHead}>
              <div>
                <div style={ST.rHeadTitle}>&#128300; READER</div>
                <div style={ST.rHeadSub}>EKG Interpretation Tutor</div>
              </div>
              <div style={ST.rProgress}>
                {rStep<CASES[cIdx].steps.length
                  ?'Step '+(rStep+1)+'/'+CASES[cIdx].steps.length
                  :'\u2705 Complete'}
              </div>
            </div>

            <div style={ST.caseTabs}>
              {CASES.map(function(c2,i){return(
                <button key={i} onClick={function(){setCIdx(i);}}
                  style={Object.assign({},ST.caseTab,i===cIdx?ST.caseTabActive:{})}>
                  {c2.title}
                </button>
              );})}
            </div>

            <div style={ST.clinical}>
              <div style={ST.clinLabel}>&#128203; Clinical Context</div>
              <div style={ST.clinText}>{CASES[cIdx].clinical}</div>
            </div>

            <div style={ST.rMsgs}>
              {rMsgs.map(function(m,i){return(
                <div key={i} style={Object.assign({},ST.rMsg,m.role==='u'?ST.rMsgU:ST.rMsgR)}>
                  {m.role!=='u'&&<div style={ST.rMsgLabel}>&#128300; READER</div>}
                  {m.role==='u'&&<div style={Object.assign({},ST.rMsgLabel,{color:'#1565c0'})}>&#129489; You</div>}
                  <div style={ST.rMsgText}>{renderMd(m.text)}</div>
                </div>
              );})}
              <div ref={rEndRef}/>
            </div>

            <div style={ST.rInputWrap}>
              <div style={ST.rInputRow}>
                <input value={rInput} onChange={function(e){setRInput(e.target.value);}}
                  onKeyDown={function(e){if(e.key==='Enter')sendReader();}}
                  placeholder="Type your answer..."
                  style={ST.rInput}/>
                <button onClick={sendReader} style={ST.rSend}>&rarr;</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ATLAS HEART */}
      <div style={ST.atlasWrap}>
        {atlasTip&&(
          <div style={ST.atlasBubble}>
            <button onClick={function(){setAtlasTip(false);}} style={ST.bubbleX}>&times;</button>
            <div style={ST.bubbleTitle}>Hi! I'm <b>ATLAS</b>!</div>
            <div style={ST.bubbleText}>I'm here whenever you have questions about EKG concepts. Click me anytime!</div>
            <div style={ST.bubbleArrow}/>
          </div>
        )}
        <button onClick={function(){setAtlasOpen(function(o){return!o;});setAtlasTip(false);}}
          style={Object.assign({},ST.heartBtn,atlasOpen?ST.heartBtnActive:{})}>
          &#10084;&#65039;
        </button>
      </div>

      {/* ATLAS POPUP */}
      {atlasOpen&&(
        <div style={ST.atlasPopup}>
          <div style={ST.apHead}>
            <div>
              <div style={ST.apTitle}>&#128153; ATLAS</div>
              <div style={ST.apSub}>Learning Assistant &mdash; ask anything</div>
            </div>
            <button onClick={function(){setAtlasOpen(false);}} style={ST.apX}>&times;</button>
          </div>
          <div style={ST.apMsgs}>
            {aMsgs.map(function(m,i){return(
              <div key={i} style={Object.assign({},ST.apMsg,m.role==='user'?ST.apMsgU:ST.apMsgAI)}>
                {m.role!=='user'&&<div style={Object.assign({},ST.apMsgLabel,{color:'#1565c0'})}>&#129302; ATLAS</div>}
                {m.role==='user'&&<div style={Object.assign({},ST.apMsgLabel,{color:'#555'})}>&#129489; You</div>}
                <div style={ST.apMsgText}>{renderMd(m.text)}</div>
              </div>
            );})}
            <div ref={aEndRef}/>
          </div>
          <div style={ST.apInputWrap}>
            <input value={aInput} onChange={function(e){setAInput(e.target.value);}}
              onKeyDown={function(e){if(e.key==='Enter')sendAtlas();}}
              placeholder="Ask about P waves, axis, ST changes..."
              style={ST.apInput}/>
            <button onClick={sendAtlas} style={ST.apSend}>Send</button>
          </div>
        </div>
      )}

      {/* INJECTED KEYFRAMES */}
      <style>{'@keyframes ekgPulse{0%,100%{transform:scale(1);box-shadow:0 4px 20px rgba(220,40,40,0.35)}50%{transform:scale(1.08);box-shadow:0 4px 30px rgba(220,40,40,0.55)}}@keyframes fadeSlideIn{0%{opacity:0;transform:translateY(10px)}100%{opacity:1;transform:translateY(0)}}'}</style>
    </div>
  );
}

// Expose globally — same pattern as your other modules
Object.assign(window, { EKGViewer });