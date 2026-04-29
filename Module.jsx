// BBNModule.jsx — Breaking Bad News / Difficult Conversations Module
const { useState, useEffect, useRef } = React;

// ─── Slide Data ────────────────────────────────────────────────────────
const BBN_SLIDES = [
  // ── Part 1: Understanding Difficult Conversations ─────────────────
  {
    idx: 0, part: 1, partTitle: 'Understanding Difficult Conversations', type: 'title',
    headline: 'Understanding Difficult Conversations',
    sub: 'Exploring what makes certain healthcare conversations challenging — and why learning to navigate them matters.',
  },
  {
    idx: 1, part: 1, type: 'objectives',
    tag: 'Section Objectives',
    headline: 'By the end of this section, you will be able to:',
    objectives: [
      'Identify common types of difficult conversations in healthcare settings',
      'Describe patient, provider, and system factors that make these conversations challenging',
      'Recognize that you cannot make bad news good — but you can make bad news worse',
      'Understand the emotional weight these conversations carry for all involved',
    ],
    focus: 'This section focuses on building awareness — understanding the landscape before learning the tools.',
  },
  {
    idx: 2, part: 1, type: 'content',
    tag: 'Core Concept',
    headline: 'What Are Difficult Conversations?',
    definition: 'Often, you as a health care professional are sharing information that your patient and their family does not want to be true because it negatively impacts their lives.',
    sections: [
      {
        label: 'Common Examples',
        items: [
          'Telling a patient they have a new, life-limiting diagnosis',
          'A patient going through significant functional changes',
          'A substitute decision maker needs to make a critical decision',
          'Disclosing or addressing medical system errors — delays, lack of care, lack of resources',
          'A patient or caregiver has made a request you don\'t feel is appropriate',
        ],
      },
      {
        label: 'Additional Scenarios',
        items: [
          'Disclosing a medical error',
          'Responding to a patient or family complaint',
          'Discussing discharge from hospital or recommending hospitalization',
          'Navigating communication barriers',
          'Managing patient and family discord',
          'When someone is simply angry with you',
        ],
      },
    ],
  },
  {
    idx: 3, part: 1, type: 'content',
    tag: 'Key Factors',
    headline: 'What Makes These Conversations Difficult?',
    sub: 'Difficulty arises from a convergence of patient, provider, and system-level factors.',
    sections: [
      {
        label: 'Patient Factors',
        items: [
          'Hearing news they don\'t want to hear; fear of suffering, sickness, and death',
          'Loss of identity',
          'Not wanting to hurt loved ones',
          'Disagreement with the provider\'s assessment or recommendations',
          'Barriers to the medical system: trauma, stigma',
          'Social determinants of health: financial stressors, unstable housing, lack of supports, health literacy',
        ],
      },
      {
        label: 'System Factors',
        items: [
          'Medico-legal requirements',
          'Societal constraints: lack of community supports, public funding, housing',
          'Medical system constraints: lack of primary care access, home care, hospital overcrowding, long waitlists, transportation, accessibility',
        ],
      },
      {
        label: 'Provider Factors',
        items: [
          'Don\'t want to cause pain or harm',
          'Don\'t like conflict',
          'Don\'t have enough specialized medical information or knowledge',
          'Lack of experience',
          'Uncertainty around consequences, procedures, and resources',
          'Implicit biases and assumptions',
        ],
      },
    ],
  },
  {
    idx: 4, part: 1, type: 'mcq',
    tag: 'Knowledge Check',
    headline: 'Recognizing the Source of Difficulty',
    question: 'A physician hesitates to tell a patient about an abnormal scan result because she is unsure what the next steps should be and worries about the patient\'s reaction. Which factors are primarily making this conversation difficult?',
    options: [
      { id: 'A', text: '"Patient factors — the patient is likely to be upset."' },
      { id: 'B', text: '"System factors — there aren\'t enough resources available."' },
      { id: 'C', text: '"Provider factors — uncertainty about next steps and fear of causing distress."' },
      { id: 'D', text: '"It isn\'t actually a difficult conversation — she just needs to be direct."' },
    ],
    correctId: 'C',
    feedbackCorrect: 'Correct. The physician\'s uncertainty and desire to avoid causing harm are classic provider factors. Recognizing what\'s driving your hesitation is the first step in preparing well.',
    feedbackIncorrect: 'Not quite. While the patient\'s reaction matters, the question focuses on what\'s holding the physician back — her uncertainty and fear of causing distress are provider factors (Option C).',
  },
  {
    idx: 5, part: 1, type: 'patient-profile',
    tag: 'Patient Profile',
    name: 'David Morrison',
    age: 58,
    location: 'Kingston, Ontario',
    traits: [
      'Construction foreman — leads a crew of 12 workers',
      'Married to Sarah, a school teacher; two adult children',
      'Prides himself on being "tough" — rarely visits the doctor',
      'Has been experiencing persistent abdominal pain, fatigue, and unexplained weight loss for 3 months',
    ],
    incident: 'David\'s CT scan results have arrived. They reveal a 4 cm mass in the head of the pancreas, highly suspicious for malignancy. He is sitting in the exam room, waiting for his results. He came alone.',
    costs: [
      { label: 'CT Finding', amount: '4 cm mass', note: 'Head of pancreas' },
      { label: 'Clinical Suspicion', amount: 'High', note: 'Consistent with malignancy' },
    ],
    burden: 'David has been telling himself it\'s "probably just an ulcer." He expects reassuring news today. He has no idea what the scan has found — and he came alone.',
  },

  // ── Part 2: The SPIKES Framework ──────────────────────────────────
  {
    idx: 6, part: 2, partTitle: 'The SPIKES Framework', type: 'title',
    headline: 'The SPIKES Framework',
    sub: 'A structured, step-by-step strategy for navigating the delivery of difficult news with competence and compassion.',
  },
  {
    idx: 7, part: 2, type: 'content',
    tag: 'Goals',
    headline: 'Goals of Breaking Bad News',
    definition: 'You cannot make bad news good, but you can make bad news worse. The goal is not to eliminate pain — it is to deliver information with care, clarity, and connection.',
    sections: [
      {
        label: 'The Four Goals',
        items: [
          'Gathering information from the patient — understanding their perspective first',
          'Providing information in accordance with the patient\'s needs and desires',
          'Supporting the patient emotionally',
          'Developing a strategy in the form of a treatment plan with the patient\'s input and cooperation',
        ],
      },
    ],
  },
  {
    idx: 8, part: 2, type: 'framework',
    tag: 'Communication Framework',
    headline: 'The SPIKES Strategy',
    steps: [
      { step: 1, label: 'S — Setting', desc: 'Arrange for privacy. Involve significant others if the patient wishes. Sit down. Make a connection. Manage time and interruptions.' },
      { step: 2, label: 'P — Perception', desc: '"Before you tell, ask." Use open-ended questions to assess the patient\'s understanding of their situation and health literacy.' },
      { step: 3, label: 'I — Invitation', desc: 'Determine how much or which types of information the patient would like. Most want full disclosure — but always ask first.' },
      { step: 4, label: 'K — Knowledge', desc: 'Give a "warning shot." Speak in plain terms with no jargon. Deliver information in small chunks and check understanding. Avoid being blunt.' },
      { step: 5, label: 'E — Empathy', desc: 'Identify the emotion. Identify its source. Allow silence. Until an emotion is acknowledged, it will be difficult to discuss other issues.' },
      { step: 6, label: 'S — Strategy & Summary', desc: 'Summarize what was discussed. Answer questions. Instill hope as appropriate. Make concrete follow-up plans.' },
    ],
    closing: 'SPIKES is not a rigid script — it is a flexible roadmap. Follow the patient\'s lead.',
  },
  {
    idx: 9, part: 2, type: 'drag-drop',
    tag: 'Interactive Activity',
    headline: 'Effective or Poor Practice?',
    instructions: 'Tap a statement to select it, then tap a category to place it.',
    items: [
      { id: 'q1', text: '"What is your understanding of why we ordered these tests?"', correct: 'effective' },
      { id: 'q2', text: '"I\'m afraid the results are not what we were hoping for."', correct: 'effective' },
      { id: 'q3', text: '"You have a tumour. We need to start chemo right away."', correct: 'poor' },
      { id: 'q4', text: '"There\'s nothing more we can do for you."', correct: 'poor' },
    ],
    categories: [
      { id: 'effective', label: 'Effective Communication', color: 'var(--teal)' },
      { id: 'poor', label: 'Poor Communication', color: 'var(--gold)' },
    ],
    feedback: 'Effective communication uses warning shots, assesses perception first, and avoids blunt or hopeless language. "There\'s nothing more we can do" shuts down the conversation — there is always something you can do to support a patient.',
  },
  {
    idx: 10, part: 2, type: 'mcq',
    tag: 'Knowledge Check',
    headline: 'Applying the Knowledge Step',
    question: 'You are about to share difficult test results with David. Which approach best reflects the "Knowledge" step of SPIKES?',
    options: [
      { id: 'A', text: '"David, your CT shows a 4 cm mass in the pancreatic head with periampullary involvement."' },
      { id: 'B', text: '"David, I\'m sorry but you have pancreatic cancer."' },
      { id: 'C', text: '"David, I\'m afraid I have some difficult news. The CT found something concerning — a growth in your pancreas that we need to investigate further."' },
      { id: 'D', text: '"David, don\'t worry, but we found something on your scan."' },
    ],
    correctId: 'C',
    feedbackCorrect: 'Correct. This response includes a warning shot, uses plain language, avoids unnecessary jargon, and is honest without being blunt or falsely reassuring.',
    feedbackIncorrect: 'Consider: Option A uses too much medical jargon. Option B is blunt with no warning shot. Option D minimizes with "don\'t worry." Option C balances honesty with sensitivity.',
  },
  {
    idx: 11, part: 2, type: 'ai-chat',
    tag: 'AI Interaction',
    headline: 'Setting Up & Assessing Perception',
    instructions: [
      'Greet David and establish a comfortable setting',
      'Assess his understanding of why he is here today',
      'Use open-ended questions — avoid jumping to results',
      'Do not deliver the bad news yet — focus on Setting and Perception',
    ],
    focus: 'Focus on the S and P of SPIKES. Understand what David knows and expects before sharing any results.',
    initialMessage: 'Hey doc. Thanks for getting me in. I\'ve been waiting all week for these results. So... what\'s the verdict?',
    systemPrompt: 'You are David Morrison, 58, construction foreman from Kingston Ontario. You are waiting for CT scan results. You expect good news. Respond naturally in 2-3 sentences.',
    chatId: 'part2',
    coachLabel: 'Setting & Perception (SPIKES)',
  },

  // ── Part 3: Responding with Empathy ───────────────────────────────
  {
    idx: 12, part: 3, partTitle: 'Responding with Empathy', type: 'title',
    headline: 'Responding with Empathy',
    sub: 'Learning to sit with difficult emotions — and to acknowledge them before moving on to next steps.',
  },
  {
    idx: 13, part: 3, type: 'content',
    tag: 'Empathy Framework',
    headline: 'The NURSE Mnemonic',
    sub: 'A practical tool for responding to emotions during difficult conversations. Until an emotion is acknowledged, it will be difficult to discuss other issues.',
    sections: [
      {
        label: 'N — Name',
        items: [
          'Name the emotion the patient appears to be having',
          'Use suggestive, not declarative language — avoid "telling" people how they feel',
          'Example: "This news seems to have made you sad."',
        ],
      },
      {
        label: 'U — Understand',
        items: [
          'Acknowledge that you cannot fully understand, but you are trying',
          'This helps the patient feel heard and seen',
          'Example: "I can\'t imagine how hard it is to hear this."',
        ],
      },
      {
        label: 'R — Respect',
        items: [
          'Praise the patient\'s coping, strength, and care for loved ones',
          'Communicate that their emotions are important',
          'Example: "You are doing a remarkable job handling this news."',
        ],
      },
      {
        label: 'S — Support',
        items: [
          'Offer concrete, ongoing support',
          'Example: "We will be here for you and your family no matter what happens."',
        ],
      },
      {
        label: 'E — Explore',
        items: [
          'Use "tell me more" statements to go deeper',
          'Allow the patient to reflect on emotions and needs',
          'Example: "Tell me more about what is worrying you."',
        ],
      },
    ],
  },
  {
    idx: 14, part: 3, type: 'content',
    tag: 'Language Tools',
    headline: 'Empathetic & Validating Statements',
    sub: 'Having the right words ready helps you stay present rather than freeze in the moment.',
    sections: [
      {
        label: 'Empathetic Statements',
        items: [
          '"I can see how upsetting this is to you."',
          '"I can tell you weren\'t expecting to hear this."',
          '"I\'m sorry to have to tell you this."',
        ],
      },
      {
        label: 'Validating Statements',
        items: [
          '"Anyone might have that same reaction."',
          '"It appears that you\'ve thought things through very well."',
          '"Many other patients have had a similar experience."',
        ],
      },
    ],
    focus: 'Empathetic statements acknowledge what the person is feeling. Validating statements normalize their response. Both are essential.',
  },
  {
    idx: 15, part: 3, type: 'mcq',
    tag: 'Clinical Scenario',
    headline: 'Responding to David\'s Emotions',
    question: 'David has just been told about the pancreatic mass. He sits in silence for 30 seconds, then says quietly: "I just... I can\'t believe this is happening." Which response best demonstrates empathetic communication?',
    options: [
      { id: 'A', text: '"Let me tell you about the treatment options we have."' },
      { id: 'B', text: '"Don\'t worry — we caught it and we\'re going to fight this."' },
      { id: 'C', text: '"I can see this is really difficult news. Take all the time you need."' },
      { id: 'D', text: '"Many people with this type of finding go on to do well with treatment."' },
    ],
    correctId: 'C',
    feedbackCorrect: 'Yes. This response names the emotion, validates the need for time, and stays present without rushing to solutions. Until the emotion is acknowledged, it will be difficult to discuss other issues.',
    feedbackIncorrect: 'Consider: Option A jumps to logistics. Option B is false reassurance. Option D bypasses his emotional moment. Option C sits with him — which is what he needs right now.',
  },
  {
    idx: 16, part: 3, type: 'ai-chat',
    tag: 'AI Interaction',
    headline: 'Delivering the News & Responding to Emotion',
    instructions: [
      'Deliver the CT scan findings using the Knowledge step of SPIKES',
      'Give a "warning shot" before sharing the news',
      'Respond to David\'s emotional reaction with empathy',
      'Use NURSE techniques — Name, Understand, Respect, Support, Explore',
      'Allow silence — do not rush to problem-solving',
    ],
    focus: 'Focus on the K and E of SPIKES. Deliver the news clearly, then stay with the emotion.',
    initialMessage: 'Okay doc, I can tell from your face this isn\'t just an ulcer. What did you find?',
    systemPrompt: 'You are David Morrison, 58. The doctor is about to deliver bad news. React with denial first, then gradually shift to sadness. Respond in 2-3 sentences.',
    chatId: 'part3',
    coachLabel: 'Knowledge & Empathy (SPIKES)',
  },

  // ── Part 4: Bringing It All Together ──────────────────────────────
  {
    idx: 17, part: 4, partTitle: 'Bringing It All Together', type: 'title',
    headline: 'Bringing It All Together',
    sub: 'Practicing the full arc of a difficult conversation — from emotional processing to collaborative strategy.',
  },
  {
    idx: 18, part: 4, type: 'framework',
    tag: 'Alternative Framework',
    headline: 'Serious Illness Conversation Guide',
    steps: [
      { step: 1, label: 'Set Up the Conversation', desc: 'Introduce the idea and benefits. Ask permission. "I\'m hoping we can talk about where things are with your illness — is this okay?"' },
      { step: 2, label: 'Assess Understanding & Preferences', desc: '"What is your understanding of where you are with your illness?" and "How much information would you like from me?"' },
      { step: 3, label: 'Share Prognosis', desc: 'Tailor information to the patient\'s preference. Allow silence. Explore emotion. "I\'m worried that time may be short."' },
      { step: 4, label: 'Explore Key Topics', desc: 'Goals, fears, sources of strength, critical abilities, tradeoffs, family. "What are your most important goals if your health situation worsens?"' },
      { step: 5, label: 'Close the Conversation', desc: 'Summarize, confirm understanding, outline next steps, and express your ongoing commitment to the patient\'s care.' },
    ],
    closing: 'Both SPIKES and the Serious Illness Conversation Guide provide structure. Use the framework that fits — and always follow the patient\'s lead.',
  },
  {
    idx: 19, part: 4, type: 'ai-chat',
    tag: 'AI Interaction',
    headline: 'Strategy & Summary',
    instructions: [
      'David is ready to discuss next steps — the initial shock has passed',
      'Explore his goals, fears, and what matters most to him',
      'Develop a strategy together — summarize and outline next steps',
      'Instill realistic hope without false promises',
      'Close the conversation with support and follow-up plans',
    ],
    focus: 'Focus on Strategy & Summary (SPIKES) and the Explore/Close steps of the Serious Illness Conversation Guide.',
    initialMessage: 'Okay... okay, I think I\'m starting to process this. So what happens now? What are we looking at here, doc?',
    systemPrompt: 'You are David Morrison, 58. The initial shock has passed. Ask practical questions. Your daughter\'s wedding is in 4 months — that is your top priority. Respond in 2-3 sentences.',
    chatId: 'part4',
    coachLabel: 'Strategy & Summary (SPIKES)',
  },
  {
    idx: 20, part: 4, type: 'debrief',
    tag: 'Debrief',
    headline: 'Key Elements of the Conversation',
    sub: 'Regardless of how your conversation unfolded, these are the core elements of an effective difficult conversation. Click each card to explore.',
    cards: [
      {
        icon: '🏥', label: 'Setting the Stage',
        facts: [
          'Arrange for privacy — close the door, find a quiet space',
          'Sit down at eye level with the patient',
          'Involve significant others if the patient wishes',
          'Manage time constraints and minimize interruptions',
          'Make a personal connection before clinical content',
        ],
        impact: 'A well-prepared setting communicates respect and safety before a single word is spoken.',
      },
      {
        icon: '👂', label: 'Assessing Perception',
        facts: [
          '"Before you tell, ask" — understand the patient\'s baseline',
          'Use open-ended questions: "What is your understanding of…"',
          'Gauge health literacy and emotional readiness',
          'Identify gaps between expectations and reality',
        ],
        impact: 'Knowing what the patient already understands shapes how you deliver the news.',
      },
      {
        icon: '📢', label: 'Delivering Knowledge',
        facts: [
          'Give a "warning shot" before the news',
          'Use plain language — avoid medical jargon',
          'Deliver information in small chunks and check understanding',
          'Be honest but sensitive — never say "there\'s nothing more we can do"',
        ],
        impact: 'Clear, compassionate delivery determines whether the patient can absorb the information.',
      },
      {
        icon: '💛', label: 'Empathy & Emotion',
        facts: [
          'Identify and name the emotion',
          'Allow silence — don\'t rush to fill it',
          'Use the NURSE mnemonic: Name, Understand, Respect, Support, Explore',
          'Until an emotion is acknowledged, other issues cannot be discussed',
        ],
        impact: 'Empathy is not a soft skill — it is a clinical tool that enables the rest of the conversation.',
      },
      {
        icon: '✅', label: 'Validation & Support',
        facts: [
          'Normalize the patient\'s reaction — "Anyone might feel this way"',
          'Respect their coping — "You\'re handling this with remarkable strength"',
          'Offer ongoing presence — "We will be here no matter what"',
        ],
        impact: 'Validation tells the patient their humanity is seen, not just their diagnosis.',
      },
      {
        icon: '📋', label: 'Strategy & Follow-up',
        facts: [
          'Summarize what was discussed clearly',
          'Answer remaining questions honestly',
          'Instill realistic hope as appropriate',
          'Make concrete follow-up plans',
          'Ensure the patient has support before leaving',
        ],
        impact: 'A clear plan forward transforms overwhelming news into something the patient can begin to navigate.',
      },
    ],
  },
  {
    idx: 21, part: 4, type: 'takeaway',
    tag: 'Key Takeaway',
    headline: 'Breaking Bad News Well',
    insight: 'You cannot make bad news good — but with preparation, structure, and empathy, you can ensure that a patient feels supported, respected, and not alone in one of the most difficult moments of their life.',
    factors: ['Preparation', 'SPIKES Framework', 'Empathy & NURSE', 'Plain Language', 'Silence & Presence', 'Strategy & Hope'],
    closing: 'Don\'t be afraid of difficult conversations. Be prepared. Use the SPIKES or Serious Illness model. Be mindful — reflect on the experience afterwards. That\'s how we continually improve.',
  },
];

// ─── Scripted AI Responses ─────────────────────────────────────────────
const DAVID_RESPONSES = {
  part2: [
    "I figured it was probably just an ulcer or something. Been popping antacids like candy for weeks. The pain's mostly here. *gestures to abdomen*",
    "Honestly? I just want to get this sorted and get back to work. We've got a big project starting next month and my crew needs me there.",
    "I mean, I know I've lost some weight, but I chalked that up to stress. Work's been crazy and I've been skipping lunches.",
    "My wife Sarah kept telling me to come in months ago. I probably should've listened sooner. But you know how it is.",
    "You're being pretty careful with your words, doc. That's making me a bit nervous. Just... be straight with me, okay?",
  ],
  part3: [
    "Cancer? No... no, that can't be right. Are you sure? I mean, could the scan be wrong? I feel fine — well, mostly fine.",
    "*long pause* I... I'm sorry, I just... How am I going to tell Sarah? And the kids — my daughter's getting married in four months.",
    "My dad had cancer. Lung cancer. I watched what it did to him. I watched my mother fall apart. I can't... I can't put my family through that.",
    "I'm sorry, I just need a minute. I didn't... I really thought it was just an ulcer. I told my wife it was nothing.",
    "Thank you... for not just reading me a chart. I can tell this isn't easy for you either. But I appreciate you being honest with me.",
  ],
  part4: [
    "So what's the timeline here? How long until we know for sure what we're dealing with? I need something concrete, doc.",
    "My daughter Emma — she's getting married in September. Four months. I need to be there. I need to walk her down the aisle. Whatever we do... that's my priority.",
    "I think I need to call Sarah. She should be here for this part. She's the one who keeps our family together. Can we wait for her?",
    "I keep thinking about my crew. Twelve guys who depend on me showing up every day. I know that sounds small compared to... this. But it matters to me.",
    "Thank you, doc. For being straight with me, and for... for not making me feel like just another file on your desk. When do we start?",
  ],
};

const BBN_COACH_RESPONSES = {
  part2: [
    "Good start — you're establishing comfort before clinical content. Notice he came alone. You might gently explore whether he'd want someone with him for this conversation.",
    "He's revealing his expectations — he thinks this is minor. This perception gap is critical. You'll need to bridge it carefully when you share results.",
    "You're using open-ended questions well. He's giving you context about his life and priorities. This will be essential when discussing impact and next steps.",
    "He mentioned his wife pushed him to come in. This tells you about his support system. Consider whether to suggest calling her before sharing results.",
    "You've assessed his perception well. He expects something minor. Consider a transition now: 'I appreciate you sharing that. I do need to talk to you about what the scan showed…'",
  ],
  part3: [
    "He's in denial — a very common first response. Resist repeating medical facts. Try naming what you see: 'I can see this is a real shock.' Let him process.",
    "He's gone quiet and thinking about family — this reveals his deepest values. Sit with the silence. Don't rush to treatment plans. He isn't ready yet.",
    "He's connecting this to past trauma — his father's cancer. Reflect it back: 'It sounds like your experience with your father is weighing heavily.' Then explore further.",
    "He asked for a moment. Allow the silence. Your presence IS the intervention right now. He'll re-engage when ready.",
    "He's acknowledging the connection you've built — a signal of trust. The empathy step is working. When he's ready, gently move toward next steps.",
  ],
  part4: [
    "He's moving to problem-solving — the Strategy step. Outline concrete next steps: biopsy, specialist referral, timeline. But keep checking in emotionally.",
    "His daughter's wedding is his most important goal. Acknowledge it explicitly: 'We will do everything we can to help you be there.' This is realistic hope.",
    "He wants his wife involved — support this. Offer to meet together. This is the partnership the Strategy step is designed for.",
    "His identity as a foreman and provider is central to who he is. Validate this before discussing what work might look like during treatment.",
    "You've navigated the full SPIKES framework. Summarize clearly: what was found, next steps, when you'll follow up. Ensure he doesn't leave alone.",
  ],
};

let bbnResponseIdxs = { part2: 0, part3: 0, part4: 0 };
let bbnCoachIdxs    = { part2: 0, part3: 0, part4: 0 };

async function simulateBBNComplete(prompt, chatId) {
  await new Promise(r => setTimeout(r, 800 + Math.random() * 700));
  if (prompt.includes('PATIENT_TURN')) {
    const arr = DAVID_RESPONSES[chatId] || DAVID_RESPONSES.part2;
    const reply = arr[bbnResponseIdxs[chatId] % arr.length];
    bbnResponseIdxs[chatId]++;
    return reply;
  } else {
    const arr = BBN_COACH_RESPONSES[chatId] || BBN_COACH_RESPONSES.part2;
    const reply = arr[bbnCoachIdxs[chatId] % arr.length];
    bbnCoachIdxs[chatId]++;
    return reply;
  }
}

// ─── Module Intro ─────────────────────────────────────────────────────
function BBNModuleIntro({ module: m, onStart, onBack }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setTimeout(() => setMounted(true), 60); }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      <div style={{ height: 64, display: 'flex', alignItems: 'center', padding: '0 48px', borderBottom: '1px solid var(--border)', justifyContent: 'space-between' }}>
        <button onClick={onBack} style={{ fontFamily: 'var(--font-sans)', fontSize: 14, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
          ← Back
        </button>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--text-subtle)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Module {m.id} of 14
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '60px 48px', overflowY: 'auto' }}>
        <div style={{
          maxWidth: 680, width: '100%', textAlign: 'center',
          opacity: mounted ? 1 : 0, transform: mounted ? 'none' : 'translateY(24px)',
          transition: 'all 0.8s var(--ease-spring)',
        }}>
          <div style={{ display: 'inline-block', background: 'var(--teal-light)', color: 'var(--teal)', fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase', padding: '6px 16px', borderRadius: 100, marginBottom: 36 }}>
            {m.category}
          </div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(40px, 5.5vw, 68px)', fontWeight: 600, lineHeight: 1.04, letterSpacing: '-0.025em', marginBottom: 24 }}>
            {m.title}
          </h1>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 17, color: 'var(--text-muted)', lineHeight: 1.7, fontWeight: 300, marginBottom: 56 }}>
            {m.desc}
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 40, marginBottom: 56, paddingBottom: 56, borderBottom: '1px solid var(--border)' }}>
            {[
              { label: 'Duration', val: m.duration },
              { label: 'Parts', val: '4 sections' },
              { label: 'Activities', val: 'MCQ + Chat' },
            ].map((item, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: 22, fontWeight: 600, letterSpacing: '-0.01em', marginBottom: 4 }}>{item.val}</div>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{item.label}</div>
              </div>
            ))}
          </div>

          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '28px 32px', marginBottom: 48, textAlign: 'left', display: 'flex', gap: 20, alignItems: 'center', borderRadius: 14 }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-serif)', fontSize: 20, fontWeight: 700, color: 'white', flexShrink: 0 }}>DM</div>
            <div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--text-subtle)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>Your patient today</div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: 22, fontWeight: 600, letterSpacing: '-0.01em' }}>{m.scenario.name}, {m.scenario.age}</div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>{m.scenario.context}</div>
            </div>
          </div>

          <div style={{ background: 'oklch(97% 0.02 20)', border: '1px solid oklch(80% 0.08 20)', borderRadius: 12, padding: '18px 22px', marginBottom: 36, textAlign: 'left' }}>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'oklch(50% 0.12 20)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>⚠️ A Note Before You Begin</div>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'oklch(35% 0.06 20)', lineHeight: 1.6, margin: 0 }}>
              This module addresses sensitive and emotional issues that affect each of us differently. If you need support at any time, reach out to Learner Wellness (613-533-6000 x78451) or the Course Director.
            </p>
          </div>

          <HoverButton primary large onClick={onStart}>Begin module</HoverButton>
        </div>
      </div>
    </div>
  );
}

// ─── Slide Shell ──────────────────────────────────────────────────────
function BBNSlideShell({ slide, totalSlides, onNext, onBack, canAdvance, children }) {
  const partColors = { 1: 'var(--accent)', 2: 'var(--teal)', 3: 'var(--gold)', 4: 'oklch(60% 0.13 320)' };
  const partColor = partColors[slide.part] || 'var(--accent)';
  const progress = (slide.idx + 1) / totalSlides;
  const isTitle = slide.type === 'title';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: isTitle ? 'var(--dark)' : 'var(--bg)' }}>
      <div style={{ height: 3, background: isTitle ? 'oklch(18% 0.02 245)' : 'var(--border)', flexShrink: 0 }}>
        <div style={{ height: '100%', background: partColor, width: `${progress * 100}%`, transition: 'width 0.6s var(--ease-spring)' }} />
      </div>
      <div style={{
        height: 60, flexShrink: 0, display: 'flex', alignItems: 'center', padding: '0 48px',
        borderBottom: `1px solid ${isTitle ? 'oklch(18% 0.02 245)' : 'var(--border)'}`,
        justifyContent: 'space-between', background: isTitle ? 'var(--dark)' : 'var(--surface)',
      }}>
        <button onClick={onBack} style={{ fontFamily: 'var(--font-sans)', fontSize: 13, background: 'none', border: 'none', cursor: 'pointer', color: isTitle ? 'oklch(50% 0.01 240)' : 'var(--text-muted)', transition: 'color 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.color = isTitle ? 'oklch(80% 0.01 240)' : 'var(--text)'}
          onMouseLeave={e => e.currentTarget.style.color = isTitle ? 'oklch(50% 0.01 240)' : 'var(--text-muted)'}>
          ← Back
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {slide.partTitle && (
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: partColor, letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 500 }}>
              Part {slide.part}
            </div>
          )}
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: isTitle ? 'oklch(38% 0.01 240)' : 'var(--text-subtle)' }}>
            {slide.idx + 1} / {totalSlides}
          </div>
        </div>
        <div style={{ width: 60 }} />
      </div>
      <div style={{ flex: 1, overflow: 'auto' }}>{children}</div>
      {!isTitle && (
        <div style={{ padding: '20px 48px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', background: 'var(--surface)', flexShrink: 0 }}>
          <HoverButton primary onClick={onNext} disabled={!canAdvance}>
            {slide.idx === totalSlides - 1 ? 'Complete module →' : 'Next →'}
          </HoverButton>
        </div>
      )}
    </div>
  );
}

// ─── Title Slide ──────────────────────────────────────────────────────
function BBNTitleSlide({ slide, onNext }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(false); setTimeout(() => setMounted(true), 60); }, [slide.idx]);
  const partColors = { 1: 'var(--accent)', 2: 'var(--teal)', 3: 'var(--gold)', 4: 'oklch(60% 0.13 320)' };
  const partColor = partColors[slide.part] || 'var(--teal)';

  return (
    <div style={{ minHeight: 'calc(100vh - 63px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 48px', background: 'var(--dark)' }}>
      <div style={{
        textAlign: 'center', maxWidth: 600,
        opacity: mounted ? 1 : 0, transform: mounted ? 'none' : 'translateY(24px)',
        transition: 'all 0.9s var(--ease-spring)',
      }}>
        <div style={{ display: 'inline-block', background: 'oklch(14% 0.02 245)', border: `1px solid ${partColor}`, color: partColor, fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '5px 16px', borderRadius: 100, marginBottom: 40 }}>
          Part {slide.part}
        </div>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(36px, 5vw, 60px)', fontWeight: 600, lineHeight: 1.06, letterSpacing: '-0.025em', color: 'oklch(94% 0.008 240)', marginBottom: 24 }}>
          {slide.headline}
        </h2>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 16, color: 'oklch(50% 0.012 240)', lineHeight: 1.7, fontWeight: 300, marginBottom: 52 }}>
          {slide.sub}
        </p>
        <button onClick={onNext} style={{
          fontFamily: 'var(--font-sans)', fontSize: 15, fontWeight: 500,
          background: partColor, color: 'white', border: 'none',
          padding: '14px 36px', borderRadius: 100, cursor: 'pointer',
          transition: 'all 0.28s var(--ease-spring)',
        }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.04)'; e.currentTarget.style.boxShadow = '0 8px 32px oklch(0% 0 0 / 0.3)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
          Begin Part {slide.part} →
        </button>
      </div>
    </div>
  );
}

// ─── Objectives Slide ──────────────────────────────────────────────────
function BBNObjectivesSlide({ slide }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(false); setTimeout(() => setMounted(true), 60); }, [slide.idx]);

  return (
    <div style={{ padding: '60px 48px', maxWidth: 760, margin: '0 auto', width: '100%' }}>
      <div style={{ opacity: mounted ? 1 : 0, transform: mounted ? 'none' : 'translateY(20px)', transition: 'all 0.7s var(--ease-spring)' }}>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--teal)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500, marginBottom: 20 }}>
          {slide.tag}
        </div>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 600, lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: 40 }}>
          {slide.headline}
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: slide.focus ? 40 : 0 }}>
          {slide.objectives.map((obj, i) => (
            <div key={i} style={{
              display: 'flex', gap: 16, alignItems: 'flex-start',
              padding: '20px 24px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12,
              opacity: mounted ? 1 : 0, transform: mounted ? 'none' : 'translateY(10px)',
              transition: `all 0.6s ${0.08 * i + 0.15}s var(--ease-spring)`,
            }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--teal)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-serif)', fontSize: 15, fontWeight: 700, flexShrink: 0 }}>
                {i + 1}
              </div>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: 15, color: 'var(--text)', lineHeight: 1.6, fontWeight: 400, margin: 0 }}>{obj}</p>
            </div>
          ))}
        </div>
        {slide.focus && (
          <div style={{ marginTop: 24, padding: '16px 20px', background: 'var(--teal-light)', border: '1px solid var(--teal)', borderRadius: 10, display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{ width: 4, alignSelf: 'stretch', background: 'var(--teal)', borderRadius: 4, flexShrink: 0 }} />
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--teal)', fontWeight: 500, margin: 0, lineHeight: 1.5 }}>{slide.focus}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Patient Profile Slide ─────────────────────────────────────────────
function BBNPatientProfileSlide({ slide }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(false); setTimeout(() => setMounted(true), 60); }, [slide.idx]);

  return (
    <div style={{ padding: '60px 48px', maxWidth: 760, margin: '0 auto', width: '100%' }}>
      <div style={{ opacity: mounted ? 1 : 0, transform: mounted ? 'none' : 'translateY(20px)', transition: 'all 0.7s var(--ease-spring)' }}>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--accent)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500, marginBottom: 28 }}>
          {slide.tag}
        </div>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '28px 32px', marginBottom: 20, display: 'flex', gap: 24, alignItems: 'flex-start' }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-serif)', fontSize: 24, fontWeight: 700, color: 'white', flexShrink: 0, boxShadow: '0 4px 16px oklch(52% 0.16 235 / 0.28)' }}>
            DM
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 28, fontWeight: 600, letterSpacing: '-0.02em', marginBottom: 4 }}>
              {slide.name}
            </h2>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--text-muted)', marginBottom: 20 }}>
              {slide.age} years old — {slide.location}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {slide.traits.map((t, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--accent)', flexShrink: 0, marginTop: 6 }} />
                  <p style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--text)', lineHeight: 1.55, margin: 0, fontWeight: 300 }}>{t}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{ background: 'var(--surface-sub)', borderLeft: '3px solid var(--accent)', borderRadius: '0 10px 10px 0', padding: '16px 20px', marginBottom: 20 }}>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: 10, color: 'var(--accent)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Clinical Situation</div>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--text)', lineHeight: 1.65, margin: 0, fontWeight: 300 }}>{slide.incident}</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 20 }}>
          {slide.costs.map((c, i) => (
            <div key={i} style={{ background: 'var(--dark)', borderRadius: 12, padding: '20px 24px' }}>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: 10, color: 'oklch(44% 0.01 240)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, marginBottom: 6 }}>{c.label}</div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: 28, fontWeight: 700, color: 'var(--accent)', lineHeight: 1.1, marginBottom: 4 }}>{c.amount}</div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'oklch(40% 0.01 240)' }}>{c.note}</div>
            </div>
          ))}
        </div>
        <div style={{ background: 'oklch(97% 0.02 20)', border: '1px solid oklch(80% 0.08 20)', borderRadius: 10, padding: '14px 20px', display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ width: 4, alignSelf: 'stretch', background: 'oklch(60% 0.12 20)', borderRadius: 4, flexShrink: 0 }} />
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'oklch(30% 0.08 20)', margin: 0, lineHeight: 1.6, fontWeight: 500 }}>{slide.burden}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Drag-Drop Slide ───────────────────────────────────────────────────
function BBNDragDropSlide({ slide, onComplete }) {
  const [placements, setPlacements] = useState({});
  const [selected, setSelected] = useState(null);
  const [checked, setChecked] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(false); setTimeout(() => setMounted(true), 60); }, [slide.idx]);

  const unplaced = slide.items.filter(item => !placements[item.id]);
  const allPlaced = slide.items.every(item => placements[item.id]);

  const handleItemClick = (itemId) => { if (!checked) setSelected(selected === itemId ? null : itemId); };
  const handleZoneClick = (catId) => {
    if (!selected || checked) return;
    setPlacements(p => ({ ...p, [selected]: catId }));
    setSelected(null);
  };
  const handleCheck = () => { setChecked(true); onComplete(); };

  const getItemColor = (item) => {
    if (!checked) return selected === item.id ? 'var(--accent)' : 'var(--border)';
    return placements[item.id] === item.correct ? 'var(--teal)' : 'oklch(60% 0.13 20)';
  };

  return (
    <div style={{ padding: '48px 48px', maxWidth: 820, margin: '0 auto', width: '100%' }}>
      <div style={{ opacity: mounted ? 1 : 0, transform: mounted ? 'none' : 'translateY(20px)', transition: 'all 0.7s var(--ease-spring)' }}>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--accent)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500, marginBottom: 16 }}>
          {slide.tag}
        </div>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(28px, 3.5vw, 42px)', fontWeight: 600, lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: 12 }}>
          {slide.headline}
        </h2>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--text-muted)', marginBottom: 36, fontWeight: 300 }}>{slide.instructions}</p>

        {unplaced.length > 0 && (
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--text-subtle)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 12 }}>Select a statement:</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {unplaced.map(item => (
                <div key={item.id} onClick={() => handleItemClick(item.id)} style={{
                  padding: '14px 18px', background: 'var(--surface)', border: `2px solid ${selected === item.id ? 'var(--accent)' : 'var(--border)'}`,
                  borderRadius: 10, cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--text)',
                  transition: 'all 0.2s var(--ease-spring)',
                  transform: selected === item.id ? 'scale(1.01)' : 'none',
                  boxShadow: selected === item.id ? '0 4px 20px oklch(52% 0.16 235 / 0.15)' : 'none',
                }}>
                  {item.text}
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginBottom: 28 }}>
          {slide.categories.map(cat => {
            const catItems = slide.items.filter(item => placements[item.id] === cat.id);
            const isActive = selected !== null;
            return (
              <div key={cat.id} onClick={() => handleZoneClick(cat.id)} style={{
                minHeight: 120, padding: '20px', background: isActive && !checked ? 'var(--surface-sub)' : 'var(--surface)',
                border: `2px dashed ${isActive && !checked ? cat.color : 'var(--border)'}`,
                borderRadius: 14, cursor: isActive && !checked ? 'pointer' : 'default',
                transition: 'all 0.25s var(--ease-spring)',
              }}>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 600, color: cat.color, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 12 }}>
                  {cat.label}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {catItems.map(item => (
                    <div key={item.id} style={{
                      padding: '10px 14px', background: 'var(--bg)', border: `1.5px solid ${getItemColor(item)}`,
                      borderRadius: 8, fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--text)', lineHeight: 1.5,
                      transition: 'border-color 0.3s',
                    }}>
                      {checked && <span style={{ marginRight: 8, fontSize: 12 }}>{placements[item.id] === item.correct ? '✓' : '✗'}</span>}
                      {item.text}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {allPlaced && !checked && (
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 24 }}>
            <HoverButton primary onClick={handleCheck}>Check answers</HoverButton>
          </div>
        )}

        {checked && (
          <div style={{ padding: '20px 24px', background: 'var(--teal-light)', border: '1px solid var(--teal)', borderRadius: 12, animation: 'bbnFadeUp 0.4s var(--ease-spring)' }}>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--teal)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>Reflection</div>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'oklch(25% 0.08 185)', lineHeight: 1.65, margin: 0 }}>{slide.feedback}</p>
          </div>
        )}
      </div>
      <style>{`@keyframes bbnFadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:none; } }`}</style>
    </div>
  );
}

// ─── AI Chat Slide ─────────────────────────────────────────────────────
function BBNAIChatSlide({ slide, onComplete }) {
  const [messages, setMessages] = useState([{ role: 'patient', text: slide.initialMessage }]);
  const [coachNotes, setCoachNotes] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [coachLoading, setCoachLoading] = useState(false);
  const [exchangeCount, setExchangeCount] = useState(0);
  const [mounted, setMounted] = useState(false);
  const chatRef = useRef();

  useEffect(() => { setTimeout(() => setMounted(true), 80); }, []);
  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages, coachNotes]);

  const canContinue = exchangeCount >= 2;

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput('');
    const newMessages = [...messages, { role: 'student', text: userMsg }];
    setMessages(newMessages);
    setLoading(true);
    setCoachLoading(true);

    try {
      const patientReply = await simulateBBNComplete('PATIENT_TURN ' + userMsg, slide.chatId);
      const updatedMsgs = [...newMessages, { role: 'patient', text: patientReply }];
      setMessages(updatedMsgs);
      setLoading(false);

      const coachReply = await simulateBBNComplete('COACH_TURN', slide.chatId);
      setCoachNotes(cn => [...cn, { text: coachReply, turn: exchangeCount }]);
      setCoachLoading(false);
      setExchangeCount(n => n + 1);
      if (exchangeCount + 1 >= 2) onComplete();
    } catch {
      setLoading(false);
      setCoachLoading(false);
    }
  };

  return (
    <div style={{ height: 'calc(100vh - 63px)', display: 'flex', flexDirection: 'column' }}>
      <div style={{
        padding: '16px 40px', borderBottom: '1px solid var(--border)', background: 'var(--surface-sub)',
        opacity: mounted ? 1 : 0, transition: 'opacity 0.5s',
      }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', gap: 32, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: 10, color: 'var(--text-subtle)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>Your Task</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {slide.instructions.map((inst, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--teal)', flexShrink: 0, marginTop: 5 }} />
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>{inst}</span>
                </div>
              ))}
            </div>
          </div>
          {slide.focus && (
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--teal)', maxWidth: 260, lineHeight: 1.5 }}>
              {slide.focus}
            </div>
          )}
        </div>
      </div>

      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 320px', overflow: 'hidden' }}>
        <div style={{ display: 'flex', flexDirection: 'column', borderRight: '1px solid var(--border)' }}>
          <div style={{ padding: '12px 32px', borderBottom: '1px solid var(--border)', background: 'var(--surface)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--accent)', animation: 'bbnPulse 2s ease-in-out infinite' }} />
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>David Morrison, 58 — Kingston, Ontario</span>
          </div>
          <div ref={chatRef} style={{ flex: 1, overflow: 'auto', padding: '28px 36px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'student' ? 'flex-end' : 'flex-start', animation: 'bbnFadeUp 0.4s var(--ease-spring)' }}>
                {msg.role === 'patient' && (
                  <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-serif)', fontSize: 12, fontWeight: 700, color: 'white', marginRight: 10, flexShrink: 0, alignSelf: 'flex-end' }}>DM</div>
                )}
                <div style={{
                  maxWidth: '70%', padding: '13px 17px',
                  background: msg.role === 'student' ? 'var(--accent)' : 'var(--surface)',
                  color: msg.role === 'student' ? 'white' : 'var(--text)',
                  border: msg.role === 'patient' ? '1px solid var(--border)' : 'none',
                  borderRadius: msg.role === 'student' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  fontFamily: 'var(--font-sans)', fontSize: 14, lineHeight: 1.65, fontWeight: 300,
                }}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-serif)', fontSize: 12, fontWeight: 700, color: 'white', flexShrink: 0 }}>DM</div>
                <div style={{ padding: '13px 18px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '18px 18px 18px 4px', display: 'flex', gap: 5, alignItems: 'center' }}>
                  {[0,1,2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--text-subtle)', animation: `bbnPulse 1.2s ${i * 0.2}s ease-in-out infinite` }} />)}
                </div>
              </div>
            )}
          </div>
          <div style={{ padding: '18px 28px', borderTop: '1px solid var(--border)', background: 'var(--surface)', display: 'flex', gap: 10, alignItems: 'center' }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
              placeholder="Respond as the doctor…"
              disabled={loading}
              style={{ flex: 1, fontFamily: 'var(--font-sans)', fontSize: 14, background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 12, padding: '11px 16px', color: 'var(--text)', outline: 'none', transition: 'border-color 0.2s' }}
              onFocus={e => e.target.style.borderColor = 'var(--accent)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
            <button onClick={send} disabled={loading || !input.trim()} style={{
              width: 42, height: 42, borderRadius: '50%', background: input.trim() && !loading ? 'var(--accent)' : 'var(--border)',
              border: 'none', cursor: input.trim() && !loading ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.25s var(--ease-spring)', transform: input.trim() && !loading ? 'scale(1)' : 'scale(0.88)',
            }}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M8 2.5v11M3 8l5-5.5L13 8" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        <div style={{ background: 'var(--dark)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid var(--border-dark)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--teal)', animation: 'bbnPulse 2s ease-in-out infinite' }} />
            <div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 500, color: 'oklch(86% 0.01 240)' }}>ClinAI Coach</div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: 10, color: 'oklch(42% 0.01 240)' }}>{slide.coachLabel}</div>
            </div>
          </div>
          <div style={{ flex: 1, overflow: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {coachNotes.length === 0 && !coachLoading && (
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'oklch(38% 0.01 240)', lineHeight: 1.6, fontWeight: 300, padding: '12px 4px' }}>
                Begin the conversation. Your coach will surface insights as you go.
              </p>
            )}
            {coachNotes.map((note, i) => (
              <div key={i} style={{ padding: '14px', background: 'oklch(13% 0.02 245)', border: '1px solid var(--border-dark)', borderLeft: '3px solid var(--teal)', animation: 'bbnFadeUp 0.5s var(--ease-spring)' }}>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: 9, color: 'var(--teal)', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
                  After exchange {note.turn + 1}
                </div>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'oklch(70% 0.01 240)', lineHeight: 1.65, fontWeight: 300, margin: 0 }}>{note.text}</p>
              </div>
            ))}
            {coachLoading && (
              <div style={{ padding: '12px 14px', background: 'oklch(13% 0.02 245)', border: '1px solid var(--border-dark)', display: 'flex', gap: 5, alignItems: 'center' }}>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: 10, color: 'var(--teal)', marginRight: 6 }}>Analysing…</span>
                {[0,1,2].map(i => <div key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--teal)', opacity: 0.6, animation: `bbnPulse 1.2s ${i * 0.2}s ease-in-out infinite` }} />)}
              </div>
            )}
          </div>
          {canContinue && (
            <div style={{ padding: '16px', borderTop: '1px solid var(--border-dark)' }}>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'oklch(48% 0.01 240)', marginBottom: 10, lineHeight: 1.5 }}>
                You've completed at least 2 exchanges. Continue when ready.
              </p>
            </div>
          )}
        </div>
      </div>
      <style>{`@keyframes bbnFadeUp { from { opacity:0;transform:translateY(10px); } to { opacity:1;transform:none; } } @keyframes bbnPulse { 0%,100%{opacity:.4} 50%{opacity:1} }`}</style>
    </div>
  );
}

// ─── Content Slide ─────────────────────────────────────────────────────
function BBNContentSlide({ slide }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(false); setTimeout(() => setMounted(true), 60); }, [slide.idx]);

  return (
    <div style={{ padding: '60px 48px', maxWidth: 760, margin: '0 auto', width: '100%' }}>
      <div style={{ opacity: mounted ? 1 : 0, transform: mounted ? 'none' : 'translateY(20px)', transition: 'all 0.7s var(--ease-spring)' }}>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--accent)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500, marginBottom: 20 }}>
          {slide.tag}
        </div>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 600, lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: 16 }}>
          {slide.headline}
        </h2>
        {slide.sub && (
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 16, color: 'var(--text-muted)', lineHeight: 1.7, fontWeight: 300, marginBottom: 32 }}>{slide.sub}</p>
        )}
        {slide.definition && (
          <div style={{ borderLeft: '3px solid var(--accent)', paddingLeft: 24, marginBottom: 36 }}>
            <p style={{ fontFamily: 'var(--font-serif)', fontSize: 20, color: 'var(--text)', lineHeight: 1.6, fontStyle: 'italic', fontWeight: 500, margin: 0 }}>{slide.definition}</p>
          </div>
        )}
        {slide.callout && (
          <div style={{ padding: '16px 20px', background: 'var(--accent-light)', border: '1px solid var(--accent)', borderRadius: 10, marginBottom: 32 }}>
            <p style={{ fontFamily: 'var(--font-serif)', fontSize: 18, color: 'var(--accent)', fontStyle: 'italic', fontWeight: 500, margin: 0, lineHeight: 1.5 }}>{slide.callout}</p>
          </div>
        )}
        {slide.sections && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: slide.focus ? 32 : 0 }}>
            {slide.sections.map((sec, i) => (
              <div key={i} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '20px 24px' }}>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--text-subtle)', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 12 }}>{sec.label}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {sec.items.map((item, j) => (
                    <div key={j} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--teal)', flexShrink: 0, marginTop: 6 }} />
                      <span style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--text)', lineHeight: 1.6, fontWeight: 300 }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        {slide.focus && (
          <div style={{ marginTop: 24, padding: '14px 20px', background: 'var(--surface-sub)', border: '1px solid var(--border)', borderRadius: 10 }}>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--text-muted)', fontWeight: 400, margin: 0, lineHeight: 1.5 }}>{slide.focus}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Framework Slide ───────────────────────────────────────────────────
function BBNFrameworkSlide({ slide }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(false); setTimeout(() => setMounted(true), 60); }, [slide.idx]);

  return (
    <div style={{ padding: '60px 48px', maxWidth: 720, margin: '0 auto', width: '100%' }}>
      <div style={{ opacity: mounted ? 1 : 0, transform: mounted ? 'none' : 'translateY(20px)', transition: 'all 0.7s var(--ease-spring)' }}>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'oklch(60% 0.13 320)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500, marginBottom: 20 }}>
          {slide.tag}
        </div>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 600, lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: 40 }}>
          {slide.headline}
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 0, position: 'relative' }}>
          {slide.steps.map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: 0, opacity: mounted ? 1 : 0, transform: mounted ? 'none' : 'translateY(16px)', transition: `all 0.6s ${0.12 * i + 0.2}s var(--ease-spring)` }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 48, flexShrink: 0 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'oklch(60% 0.13 320)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-serif)', fontSize: 18, fontWeight: 700, flexShrink: 0, zIndex: 1 }}>
                  {step.step}
                </div>
                {i < slide.steps.length - 1 && (
                  <div style={{ width: 2, flex: 1, background: 'var(--border)', minHeight: 32 }} />
                )}
              </div>
              <div style={{ flex: 1, paddingLeft: 20, paddingBottom: i < slide.steps.length - 1 ? 28 : 0 }}>
                <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '20px 24px', marginTop: 4 }}>
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 8, letterSpacing: '-0.01em' }}>{step.label}</div>
                  <p style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.65, fontWeight: 300, margin: 0 }}>{step.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {slide.closing && (
          <div style={{ marginTop: 36, padding: '16px 20px', background: 'oklch(94% 0.04 320)', border: '1px solid oklch(60% 0.13 320)', borderRadius: 10 }}>
            <p style={{ fontFamily: 'var(--font-serif)', fontSize: 17, color: 'oklch(35% 0.1 320)', fontStyle: 'italic', fontWeight: 500, margin: 0 }}>{slide.closing}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── MCQ Slide ─────────────────────────────────────────────────────────
function BBNMCQSlide({ slide, onComplete }) {
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(false); setTimeout(() => setMounted(true), 60); }, [slide.idx]);

  const isCorrect = selected === slide.correctId;

  const handleSubmit = () => {
    setSubmitted(true);
    if (selected === slide.correctId) onComplete();
    else setTimeout(() => onComplete(), 200);
  };

  const getOptionStyle = (opt) => {
    if (!submitted) {
      return {
        border: selected === opt.id ? '2px solid var(--accent)' : '1px solid var(--border)',
        background: selected === opt.id ? 'var(--accent-light)' : 'var(--surface)',
        cursor: 'pointer',
        transform: selected === opt.id ? 'scale(1.01)' : 'none',
      };
    }
    if (opt.id === slide.correctId) return { border: '2px solid var(--teal)', background: 'var(--teal-light)', cursor: 'default' };
    if (opt.id === selected && !isCorrect) return { border: '2px solid oklch(60% 0.13 20)', background: 'oklch(97% 0.02 20)', cursor: 'default' };
    return { border: '1px solid var(--border)', background: 'var(--surface-sub)', opacity: 0.5, cursor: 'default' };
  };

  return (
    <div style={{ padding: '56px 48px', maxWidth: 740, margin: '0 auto', width: '100%' }}>
      <div style={{ opacity: mounted ? 1 : 0, transform: mounted ? 'none' : 'translateY(20px)', transition: 'all 0.7s var(--ease-spring)' }}>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--accent)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500, marginBottom: 20 }}>
          {slide.tag}
        </div>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(26px, 3vw, 38px)', fontWeight: 600, lineHeight: 1.12, letterSpacing: '-0.02em', marginBottom: 32 }}>
          {slide.question}
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
          {slide.options.map((opt, i) => (
            <div key={opt.id} onClick={() => !submitted && setSelected(opt.id)} style={{
              padding: '16px 20px', borderRadius: 12, display: 'flex', gap: 14, alignItems: 'flex-start',
              transition: 'all 0.25s var(--ease-spring)',
              opacity: mounted ? 1 : 0, transform: mounted ? 'none' : 'translateY(8px)',
              transitionDelay: `${0.05 * i + 0.1}s`,
              ...getOptionStyle(opt),
            }}>
              <div style={{
                width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
                background: submitted && opt.id === slide.correctId ? 'var(--teal)' : (submitted && opt.id === selected && !isCorrect ? 'oklch(55% 0.13 20)' : selected === opt.id ? 'var(--accent)' : 'var(--surface-sub)'),
                border: `1px solid ${submitted && opt.id === slide.correctId ? 'var(--teal)' : 'var(--border)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 600,
                color: (selected === opt.id || (submitted && opt.id === slide.correctId)) ? 'white' : 'var(--text-muted)',
                transition: 'all 0.2s',
              }}>
                {submitted && opt.id === slide.correctId ? '✓' : submitted && opt.id === selected && !isCorrect ? '✗' : opt.id}
              </div>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--text)', lineHeight: 1.6, fontWeight: 300, margin: 0 }}>{opt.text}</p>
            </div>
          ))}
        </div>

        {!submitted && selected && (
          <HoverButton primary onClick={handleSubmit}>Submit answer</HoverButton>
        )}

        {submitted && (
          <div style={{
            padding: '20px 24px', borderRadius: 12,
            background: isCorrect ? 'var(--teal-light)' : 'oklch(97% 0.02 20)',
            border: `1px solid ${isCorrect ? 'var(--teal)' : 'oklch(60% 0.13 20)'}`,
            animation: 'bbnFadeUp 0.4s var(--ease-spring)',
          }}>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: 10, color: isCorrect ? 'var(--teal)' : 'oklch(50% 0.13 20)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>
              {isCorrect ? 'Correct' : 'Not quite'}
            </div>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--text)', lineHeight: 1.65, margin: 0, fontWeight: 300 }}>
              {isCorrect ? slide.feedbackCorrect : slide.feedbackIncorrect}
            </p>
          </div>
        )}
      </div>
      <style>{`@keyframes bbnFadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:none; } }`}</style>
    </div>
  );
}

// ─── Debrief Slide ────────────────────────────────────────────────────
function BBNDebriefSlide({ slide }) {
  const [expanded, setExpanded] = useState(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(false); setTimeout(() => setMounted(true), 60); }, [slide.idx]);

  return (
    <div style={{ padding: '48px 48px', maxWidth: 900, margin: '0 auto', width: '100%' }}>
      <div style={{ opacity: mounted ? 1 : 0, transform: mounted ? 'none' : 'translateY(20px)', transition: 'all 0.7s var(--ease-spring)' }}>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--teal)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500, marginBottom: 16 }}>
          {slide.tag}
        </div>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(26px, 3vw, 38px)', fontWeight: 600, lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: 8 }}>
          {slide.headline}
        </h2>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: 36 }}>{slide.sub}</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {slide.cards.map((card, i) => {
            const isOpen = expanded === i;
            return (
              <div key={i} style={{
                background: 'var(--surface)', border: `1.5px solid ${isOpen ? 'var(--teal)' : 'var(--border)'}`,
                borderRadius: 14, overflow: 'hidden', cursor: 'pointer',
                boxShadow: isOpen ? '0 8px 32px oklch(58% 0.13 185 / 0.12)' : 'none',
                transform: isOpen ? 'translateY(-3px)' : 'none',
                transition: 'all 0.3s var(--ease-spring)',
                opacity: mounted ? 1 : 0, transitionDelay: `${0.06 * i + 0.1}s`,
              }} onClick={() => setExpanded(isOpen ? null : i)}>
                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: isOpen ? 'var(--teal)' : 'var(--dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, transition: 'background 0.3s' }}>
                    {card.icon}
                  </div>
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 600, color: 'var(--text)', textAlign: 'center', lineHeight: 1.35 }}>{card.label}</div>
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: 10, color: isOpen ? 'var(--teal)' : 'var(--text-subtle)', transition: 'color 0.3s' }}>
                    {isOpen ? 'Click to close' : 'Click to explore'}
                  </div>
                </div>
                {isOpen && (
                  <div style={{ padding: '0 18px 18px', animation: 'bbnFadeUp 0.3s var(--ease-spring)' }}>
                    <div style={{ height: 1, background: 'var(--border)', marginBottom: 14 }} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
                      {card.facts.map((fact, j) => (
                        <div key={j} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                          <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--teal)', flexShrink: 0, marginTop: 5 }} />
                          <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--text)', lineHeight: 1.5, fontWeight: 300 }}>{fact}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{ background: 'var(--dark)', borderRadius: 8, padding: '10px 12px', display: 'flex', gap: 8 }}>
                      <div style={{ width: 3, background: 'var(--teal)', borderRadius: 3, flexShrink: 0 }} />
                      <p style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'oklch(68% 0.01 240)', margin: 0, lineHeight: 1.5 }}>
                        <strong style={{ color: 'var(--teal)' }}>Impact:</strong> {card.impact}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--text-subtle)', textAlign: 'center', marginTop: 24, fontStyle: 'italic' }}>
          Click each card to reveal details. Click again to close.
        </p>
      </div>
      <style>{`@keyframes bbnFadeUp { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:none; } }`}</style>
    </div>
  );
}

// ─── Takeaway Slide ────────────────────────────────────────────────────
function BBNTakeawaySlide({ slide }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(false); setTimeout(() => setMounted(true), 60); }, [slide.idx]);

  return (
    <div style={{ padding: '60px 48px', maxWidth: 760, margin: '0 auto', width: '100%' }}>
      <div style={{ opacity: mounted ? 1 : 0, transform: mounted ? 'none' : 'translateY(20px)', transition: 'all 0.7s var(--ease-spring)' }}>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--teal)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500, marginBottom: 24 }}>
          {slide.tag}
        </div>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(30px, 4vw, 48px)', fontWeight: 600, lineHeight: 1.08, letterSpacing: '-0.025em', marginBottom: 28 }}>
          {slide.headline}
        </h2>
        <div style={{ borderLeft: '3px solid var(--teal)', paddingLeft: 24, marginBottom: 40 }}>
          <p style={{ fontFamily: 'var(--font-serif)', fontSize: 19, color: 'var(--text)', lineHeight: 1.65, fontStyle: 'italic', fontWeight: 500, margin: 0 }}>{slide.insight}</p>
        </div>
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--text-subtle)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 16 }}>Your toolkit:</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {slide.factors.map((factor, i) => (
              <div key={i} style={{
                padding: '8px 16px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 100,
                fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--text)', fontWeight: 400,
                opacity: mounted ? 1 : 0, transform: mounted ? 'none' : 'scale(0.9)',
                transition: `all 0.5s ${0.08 * i + 0.3}s var(--ease-spring)`,
              }}>
                {factor}
              </div>
            ))}
          </div>
        </div>
        <div style={{ padding: '20px 24px', background: 'var(--dark)', borderRadius: 12 }}>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'oklch(68% 0.01 240)', lineHeight: 1.7, fontWeight: 300, margin: 0 }}>{slide.closing}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Feedback View ─────────────────────────────────────────────────────
function BBNFeedbackView({ module: m, onBack }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setTimeout(() => setMounted(true), 80); }, []);

  const dims = [
    { label: 'Setting & Perception',   score: 82, color: 'var(--accent)' },
    { label: 'Knowledge Delivery',     score: 78, color: 'var(--teal)' },
    { label: 'Empathetic Response',    score: 85, color: 'var(--gold)' },
    { label: 'Strategy & Follow-up',   score: 80, color: 'oklch(60% 0.13 320)' },
  ];
  const overall = Math.round(dims.reduce((a, d) => a + d.score, 0) / dims.length);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: 60, display: 'flex', alignItems: 'center', padding: '0 48px', borderBottom: '1px solid var(--border)', justifyContent: 'space-between', background: 'var(--surface)' }}>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 500, color: 'var(--teal)' }}>Module complete</div>
        <button onClick={onBack} style={{ fontFamily: 'var(--font-sans)', fontSize: 13, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
          Back to modules
        </button>
      </div>

      <div style={{ flex: 1, maxWidth: 720, margin: '0 auto', padding: '60px 48px', width: '100%', opacity: mounted ? 1 : 0, transform: mounted ? 'none' : 'translateY(20px)', transition: 'all 0.8s var(--ease-spring)' }}>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--teal)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500, marginBottom: 16 }}>
          Module complete
        </div>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(32px, 4.5vw, 52px)', fontWeight: 600, lineHeight: 1.06, letterSpacing: '-0.02em', marginBottom: 8 }}>
          {m.title}
        </h1>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 15, color: 'var(--text-muted)', marginBottom: 48 }}>Here's how your session went.</p>

        <div style={{ display: 'flex', alignItems: 'center', gap: 36, marginBottom: 48, padding: '32px 36px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14 }}>
          <div style={{ position: 'relative', width: 96, height: 96, flexShrink: 0 }}>
            <svg width="96" height="96" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="var(--border)" strokeWidth="8" />
              <circle cx="50" cy="50" r="42" fill="none" stroke="var(--teal)" strokeWidth="8"
                strokeDasharray={`${2 * Math.PI * 42}`}
                strokeDashoffset={`${2 * Math.PI * 42 * (1 - overall / 100)}`}
                strokeLinecap="round" transform="rotate(-90 50 50)"
                style={{ transition: 'stroke-dashoffset 1.2s var(--ease-spring)' }} />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: 24, fontWeight: 600, lineHeight: 1 }}>{overall}</div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: 10, color: 'var(--text-subtle)' }}>/100</div>
            </div>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: 21, fontWeight: 600, marginBottom: 8 }}>Compassionate session.</div>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.65, fontWeight: 300 }}>
              You demonstrated care for David's emotional experience alongside clinical communication. Focus area: practice giving "warning shots" and sitting with silence longer before transitioning to next steps.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 48 }}>
          {dims.map((d, i) => (
            <div key={i}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--text)', fontWeight: 400 }}>{d.label}</span>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: d.color, fontWeight: 500 }}>{d.score}</span>
              </div>
              <div style={{ height: 4, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: mounted ? `${d.score}%` : '0%', background: d.color, borderRadius: 2, transition: `width 0.9s ${0.1 * i + 0.3}s var(--ease-spring)` }} />
              </div>
            </div>
          ))}
        </div>

        <HoverButton onClick={onBack}>Back to modules</HoverButton>
      </div>
    </div>
  );
}

// ─── Main Module Experience ────────────────────────────────────────────
function BBNModuleExperience({ module: m, onBack }) {
  const [slideIdx, setSlideIdx] = useState(-1);
  const [completedSlides, setCompletedSlides] = useState(new Set());

  const totalSlides = BBN_SLIDES.length;

  const markComplete = (idx) => setCompletedSlides(s => new Set([...s, idx]));

  const canAdvance = (idx) => {
    if (idx < 0 || idx >= totalSlides) return true;
    const slide = BBN_SLIDES[idx];
    const interactive = ['drag-drop', 'mcq', 'ai-chat'];
    if (interactive.includes(slide.type)) return completedSlides.has(idx);
    return true;
  };

  const goNext = () => {
    if (slideIdx < totalSlides - 1) {
      window.scrollTo(0, 0);
      setSlideIdx(i => i + 1);
    } else {
      setSlideIdx(totalSlides);
    }
  };

  const goBack = () => {
    if (slideIdx <= 0) { setSlideIdx(-1); }
    else { window.scrollTo(0, 0); setSlideIdx(i => i - 1); }
  };

  if (slideIdx === -1) {
    return <BBNModuleIntro module={m} onStart={() => setSlideIdx(0)} onBack={onBack} />;
  }

  if (slideIdx >= totalSlides) {
    return <BBNFeedbackView module={m} onBack={onBack} />;
  }

  const slide = BBN_SLIDES[slideIdx];

  const renderContent = () => {
    switch (slide.type) {
      case 'title':
        return <BBNTitleSlide slide={slide} onNext={goNext} />;
      case 'objectives':
        return <BBNObjectivesSlide slide={slide} />;
      case 'patient-profile':
        return <BBNPatientProfileSlide slide={slide} />;
      case 'drag-drop':
        return <BBNDragDropSlide key={slideIdx} slide={slide} onComplete={() => markComplete(slideIdx)} />;
      case 'ai-chat':
        return <BBNAIChatSlide key={slideIdx} slide={slide} onComplete={() => markComplete(slideIdx)} />;
      case 'content':
        return <BBNContentSlide slide={slide} />;
      case 'framework':
        return <BBNFrameworkSlide slide={slide} />;
      case 'mcq':
        return <BBNMCQSlide key={slideIdx} slide={slide} onComplete={() => markComplete(slideIdx)} />;
      case 'debrief':
        return <BBNDebriefSlide slide={slide} />;
      case 'takeaway':
        return <BBNTakeawaySlide slide={slide} />;
      default:
        return null;
    }
  };

  return (
    <BBNSlideShell
      slide={slide}
      totalSlides={totalSlides}
      onNext={goNext}
      onBack={goBack}
      canAdvance={canAdvance(slideIdx)}
    >
      {renderContent()}
    </BBNSlideShell>
  );
}

Object.assign(window, { BBNModuleExperience });
