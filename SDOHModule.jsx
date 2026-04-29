// SDOHModule.jsx — Social Determinants of Health Module
const { useState, useEffect, useRef } = React;

// ─── Slide Data ────────────────────────────────────────────────────────
const SDOH_SLIDES = [
  // ── Part 1: Questioning with Purpose ──────────────────────────────
  {
    idx: 0, part: 1, partTitle: 'Questioning with Purpose', type: 'title',
    headline: 'Questioning with Purpose',
    sub: 'Exploring how the right questions uncover what matters most to your patient.',
  },
  {
    idx: 1, part: 1, type: 'objectives',
    tag: 'Section Objectives',
    headline: 'By the end of this section, you will be able to:',
    objectives: [
      'Use open-ended questions to invite your patient\'s full narrative',
      'Maintain a neutral, non-judgmental tone throughout the encounter',
      'Avoid leading or assumptive questions that close down conversation',
      'Build trust through intentional curiosity and genuine presence',
    ],
    focus: 'This section focuses only on understanding context — not solving the problem.',
  },
  {
    idx: 2, part: 1, type: 'patient-profile',
    tag: 'Patient Profile',
    name: 'Amina Juma',
    age: 34,
    location: 'Mwanza, Tanzania',
    traits: [
      'Sells vegetables and handmade baskets at the local market',
      'Husband works casual labour in construction',
      'Supports her family through irregular, informal income',
    ],
    incident: 'Last week, Amina\'s 7-year-old son was involved in a car accident and sustained a femur fracture. He requires urgent medical attention.',
    costs: [
      { label: 'Estimated Cost (TZS)', amount: '200,000', note: 'Tanzanian Shillings' },
      { label: 'Estimated Cost (CAD)', amount: '~$100', note: 'Canadian Dollars' },
    ],
    burden: 'For Amina\'s family, this represents a major financial burden — a significant portion of their irregular monthly income.',
  },
  {
    idx: 3, part: 1, type: 'drag-drop',
    tag: 'Interactive Activity',
    headline: 'Which Questions Build Trust?',
    instructions: 'Tap a question card to select it, then tap a category to place it.',
    items: [
      { id: 'q1', text: '"How has this week been for you?"', correct: 'trust' },
      { id: 'q2', text: '"What has this experience been like for your family?"', correct: 'trust' },
      { id: 'q3', text: '"You must be stressed about money."', correct: 'leading' },
      { id: 'q4', text: '"Why didn\'t you have savings?"', correct: 'leading' },
    ],
    categories: [
      { id: 'trust', label: 'Builds Trust', color: 'var(--teal)' },
      { id: 'leading', label: 'Leading / Assumptive', color: 'var(--gold)' },
    ],
    feedback: 'Open-ended, neutral questions create safety. Assumptions create distance — even when they come from a place of concern.',
  },
  {
    idx: 4, part: 1, type: 'ai-chat',
    tag: 'AI Interaction',
    headline: 'Your First Words to Amina',
    instructions: [
      'Greet Amina and make her feel welcome',
      'Ask two open-ended questions about her experience',
      'Do not discuss money or costs',
      'Do not offer solutions yet',
    ],
    focus: 'Focus on understanding her daily experience and what brought her here.',
    initialMessage: 'Doctor… my son, he fell, and his leg… they told me it is broken very badly. I came as fast as I could.',
    systemPrompt: 'You are Amina Juma, 34, from Mwanza Tanzania. Your 7-year-old son has a femur fracture from a car accident. You are worried but composed. You speak English with moderate fluency. Respond warmly and naturally in 2-3 sentences. If the doctor asks about money or costs, gently deflect — you came to discuss your son\'s care.',
    chatId: 'part1',
    coachLabel: 'Open-Ended Questioning',
  },

  // ── Part 2: Seeing the System ──────────────────────────────────────
  {
    idx: 5, part: 2, partTitle: 'Seeing the System', type: 'title',
    headline: 'Seeing the System',
    sub: 'Understanding the structural and social forces that shape Amina\'s choices and constraints.',
  },
  {
    idx: 6, part: 2, type: 'content',
    tag: 'Core Concept',
    headline: 'What Are Social Determinants of Health?',
    definition: 'Social Determinants of Health (SDOH) are the social, economic, and environmental conditions that shape a person\'s health — often more powerfully than medical care itself.',
    sections: [
      {
        label: 'They Influence',
        items: ['Risk of illness', 'Access to treatment', 'Ability to recover', 'Long-term outcomes'],
      },
      {
        label: 'Examples Include',
        items: ['Income and employment', 'Education', 'Housing and food security', 'Transportation', 'Gender roles and caregiving expectations', 'Social support networks'],
      },
    ],
  },
  {
    idx: 7, part: 2, type: 'mcq',
    tag: 'Knowledge Check',
    headline: 'Structural Clues in Amina\'s Story',
    question: 'Which statement best reflects a structural (system-level) understanding of Amina\'s situation?',
    options: [
      { id: 'A', text: '"She should have saved more money."' },
      { id: 'B', text: '"Her challenges are mainly due to poor planning."' },
      { id: 'C', text: '"Limited transport access and unstable wages reduce her available choices."' },
      { id: 'D', text: '"She needs to try harder to manage expenses."' },
    ],
    correctId: 'C',
    feedbackCorrect: 'Correct. This recognises that structural barriers shape what choices are realistically available — shifting focus from individual blame to systemic context.',
    feedbackIncorrect: 'Not quite. Options A, B, and D place the responsibility on Amina as an individual. Option C recognises that her circumstances are shaped by systems and structures outside her control.',
  },
  {
    idx: 8, part: 2, type: 'ai-chat',
    tag: 'AI Interaction',
    headline: 'Explore the System',
    instructions: [
      'Ask two questions about the structural barriers Amina faces',
      'Avoid offering money or financial solutions',
      'Avoid jumping to problem-solving',
    ],
    focus: 'Focus: Transport, Income, Caregiving roles. Try to uncover one structural barrier per question.',
    initialMessage: 'It was… not easy to come here, doctor. But I am here now, for my son.',
    systemPrompt: 'You are Amina Juma, 34, Mwanza Tanzania. When asked about barriers, share your experience gradually — the nearest hospital is 3 hours away, you borrowed money for transport, your husband is away working in the mines, you left your other children with a neighbor, and the local clinic didn\'t have equipment. Reveal 1-2 facts per response, naturally and emotionally.',
    chatId: 'part2',
    coachLabel: 'Identifying Structural Barriers',
  },
  {
    idx: 9, part: 2, type: 'debrief',
    tag: 'Debrief',
    headline: 'Social Determinants Affecting Amina',
    sub: 'Regardless of what emerged in your conversation, the following determinants are clearly present. Click each card to explore.',
    cards: [
      {
        icon: '💰', label: 'Financial & Income Instability',
        facts: [
          'Informal labour — market selling, construction, casual work',
          'Daily earnings often under $5 CAD',
          'Cannot reliably cover food, transport, or medical costs',
          '200,000 TZS (~$100 CAD) is a catastrophic expense',
        ],
        impact: 'Financial precarity directly limits access to healthcare.',
      },
      {
        icon: '📖', label: 'Education',
        facts: [
          'Left school after primary education',
          'Early marriage at 17 limited further schooling',
          'Restricts job opportunities and health literacy',
        ],
        impact: 'Reduced earning potential and reduced ability to navigate healthcare systems.',
      },
      {
        icon: '🚌', label: 'Transportation & Healthcare Access',
        facts: [
          'The clinic is far from home — hours of travel',
          'Transport costs are unaffordable on irregular income',
          'Delays worsen her son\'s condition significantly',
        ],
        impact: 'Physical distance and cost create delayed or forgone care.',
      },
      {
        icon: '👩‍👧', label: 'Gender Roles & Caregiving',
        facts: [
          'Amina carries most caregiving responsibility',
          'Cultural expectations prioritise maternal caregiving',
          'Caregiving limits her ability to earn income or rest',
        ],
        impact: 'Gender norms shape economic vulnerability and decision-making power.',
      },
      {
        icon: '🍽️', label: 'Food Security & Nutrition',
        facts: [
          'The family often skips meals',
          'Poor nutrition affects healing and recovery',
          'Financial strain worsens food insecurity',
        ],
        impact: 'Health outcomes are shaped by nutritional deprivation.',
      },
      {
        icon: '🏘️', label: 'Community & Social Support',
        facts: [
          'Relies on small loans from neighbours',
          'Occasionally receives food donations from the mosque',
          'Repeated borrowing has strained relationships',
        ],
        impact: 'Social support exists, but it is fragile and limited.',
      },
    ],
  },
  {
    idx: 10, part: 2, type: 'takeaway',
    tag: 'Key Takeaway',
    headline: 'Amina\'s Situation in Full',
    insight: 'Amina\'s dilemma is not simply a medical crisis. It is a convergence of structural forces that compound one another.',
    factors: ['Poverty', 'Gender norms', 'Limited education', 'Food insecurity', 'Transport barriers', 'Fragile social support'],
    closing: 'Understanding this convergence is what separates context-aware care from surface-level problem solving. No single factor explains Amina\'s situation — and no single solution will resolve it.',
  },

  // ── Part 3: Deepening the Connection ──────────────────────────────
  {
    idx: 11, part: 3, partTitle: 'Deepening the Connection', type: 'title',
    headline: 'Deepening the Connection',
    sub: 'Moving beyond the surface to understand the structural and emotional forces shaping Amina\'s reality.',
  },
  {
    idx: 12, part: 3, type: 'content',
    tag: 'Building on Part 2',
    headline: 'From Analysis to Attunement',
    sub: 'You\'ve identified the structural barriers. Now comes the harder shift.',
    callout: 'But systems explain context — not lived experience.',
    sections: [
      {
        label: 'The Shift',
        items: ['From: "What limits her options?" → To: "What does this feel like for her?"'],
      },
      {
        label: 'Analytical vs. Relational',
        items: [
          'Understanding barriers is analytical',
          'Understanding emotion is relational',
        ],
      },
    ],
    focus: 'In this section, you will focus on emotional attunement.',
  },
  {
    idx: 13, part: 3, type: 'objectives',
    tag: 'Section Objectives',
    headline: 'By the end of this section, you will be able to:',
    objectives: [
      'Reflect emotions accurately without projection or minimisation',
      'Validate lived experience in a way that feels genuine',
      'Recognise dignity in vulnerability',
      'Avoid premature problem-solving when a patient needs to feel heard',
      'Build trust before offering solutions or next steps',
    ],
    focus: 'This section focuses on connection — not fixing.',
  },
  {
    idx: 14, part: 3, type: 'mcq',
    tag: 'Clinical Scenario',
    headline: 'Emotional Clues in Amina\'s Story',
    question: 'Amina says: "I feel ashamed asking for help. I should be able to care for my child." Which response demonstrates emotional attunement?',
    options: [
      { id: 'A', text: '"Don\'t feel ashamed. It\'s not your fault."' },
      { id: 'B', text: '"How much money do you need exactly?"' },
      { id: 'C', text: '"Have you looked into other clinics nearby?"' },
      { id: 'D', text: '"That sounds incredibly heavy. It must be difficult to carry that alone."' },
    ],
    correctId: 'D',
    feedbackCorrect: 'Yes. Validation acknowledges emotion without dismissing it. Empathy strengthens trust before moving to logistics.',
    feedbackIncorrect: 'Consider: Option A dismisses the emotion with reassurance. Options B and C jump to problem-solving. Option D sits with her feeling — which is what attunement looks like.',
  },
  {
    idx: 15, part: 3, type: 'ai-chat',
    tag: 'AI Interaction',
    headline: 'Emotional Practice with Amina',
    instructions: [
      'Respond to Amina\'s emotional disclosure',
      'Validate her feelings before offering any advice',
      'Avoid discussing money immediately',
      'Avoid jumping to solutions',
    ],
    focus: 'Goal: make her feel heard. Focus: reflection, validation, and presence.',
    initialMessage: 'Doctor… I need to tell you something. I sold my only goat — my only goat — to pay for the bus to come here. I have not eaten since yesterday. But my son… he is everything.',
    systemPrompt: 'You are Amina Juma. You are becoming more comfortable with this doctor. You have just shared something vulnerable. If the doctor responds with genuine empathy, open up more — share that you haven\'t slept, that you are frightened but trying to be strong. If they jump to solutions or money, feel slightly hurt and withdrawn.',
    chatId: 'part3',
    coachLabel: 'Emotional Attunement',
  },

  // ── Part 4: Navigating the Ethical Tension ────────────────────────
  {
    idx: 16, part: 4, partTitle: 'Navigating the Ethical Tension', type: 'title',
    headline: 'Navigating the Ethical Tension',
    sub: 'Examining the competing values and real-world constraints that shape ethical decision-making in global health.',
  },
  {
    idx: 17, part: 4, type: 'content',
    tag: 'Building on Part 3',
    headline: 'When Empathy Meets Boundaries',
    sub: 'You\'ve built rapport. You\'ve explored structural barriers. You\'ve acknowledged Amina\'s emotions.',
    callout: 'Now the tension rises.',
    sections: [
      {
        label: 'The Situation',
        items: ['Amina directly asks you for financial help', 'This is where empathy meets professional boundaries'],
      },
      {
        label: 'The Core Question',
        items: ['How do you respond in a way that is compassionate, ethical, and sustainable?'],
      },
    ],
    focus: 'This section focuses on balance — not avoidance.',
  },
  {
    idx: 18, part: 4, type: 'objectives',
    tag: 'Section Objectives',
    headline: 'By the end of this section, you will be able to:',
    objectives: [
      'Recognise the power imbalance inherent in global health encounters',
      'Apply an ethical decision-making framework to direct requests',
      'Weigh short-term relief against long-term systemic impact',
      'Set boundaries without dismissing vulnerability',
      'Communicate sustainable alternatives with clarity and compassion',
    ],
    focus: 'This section focuses on balance — not avoidance.',
  },
  {
    idx: 19, part: 4, type: 'framework',
    tag: 'Ethical Framework',
    headline: 'When Faced with Direct Financial Requests',
    steps: [
      { step: 1, label: 'Acknowledge', desc: 'Name what the patient is feeling. Validate the weight of their situation before anything else.' },
      { step: 2, label: 'Recognise the Power Imbalance', desc: 'Your position creates an inherent dynamic. Personal giving can distort the therapeutic relationship and create dependency.' },
      { step: 3, label: 'Redirect to Sustainable Support', desc: 'Connect the patient with systemic resources — social workers, community funds, hospital programmes — rather than personal ones.' },
    ],
    closing: 'Ethics requires both compassion and consistency.',
  },
  {
    idx: 20, part: 4, type: 'mcq',
    tag: 'Ethical Decision',
    headline: 'Navigating the Request',
    question: 'Amina says: "The clinic fees are about 200,000 shillings. Can you help me?" Which response best aligns with ethical principles?',
    options: [
      { id: 'A', text: '"I\'m really sorry this is so heavy. I can\'t provide money directly, but I want to help explore options that could support you longer-term."' },
      { id: 'B', text: '"Yes, I\'ll give you the money right now."' },
      { id: 'C', text: '"I\'m sorry, I can\'t help with that."' },
      { id: 'D', text: '"That\'s not something I\'m responsible for."' },
    ],
    correctId: 'A',
    feedbackCorrect: 'Yes. Ethical balance includes empathy, clear boundaries, and sustainable alternatives. This response models all three.',
    feedbackIncorrect: 'Consider: Option B risks creating dependency and distorting the relationship. Options C and D lack empathy and offer no path forward. Option A acknowledges, sets a boundary, and redirects.',
  },
  {
    idx: 21, part: 4, type: 'ai-chat',
    tag: 'AI Interaction',
    headline: 'Ethical Decision with Amina',
    instructions: [
      'Respond to Amina\'s direct request for financial help (~$100 CAD)',
      'Use empathy before setting any limit',
      'Clearly explain your boundary',
      'Offer a sustainable alternative',
      'Avoid abrupt refusal or instant charity',
    ],
    focus: 'Goal: balance empathy, boundary clarity, and sustainable reasoning.',
    initialMessage: 'Doctor… I trust you. You have been so kind to me. I must ask you something… is there any way you can help us pay? I have nothing left.',
    systemPrompt: 'You are Amina Juma. You are desperate and have just made a direct request for financial help. If the doctor responds with genuine empathy AND a clear, kind boundary AND offers an alternative (social worker, hospital fund, etc.), accept this with quiet dignity and cautious hope. If they give money, be grateful but the scene should feel ethically uncomfortable. If they refuse coldly, be hurt and withdrawn.',
    chatId: 'part4',
    coachLabel: 'Ethical Boundary-Setting',
  },
];

// ─── Scripted AI Responses ─────────────────────────────────────────────
const AMINA_RESPONSES = {
  part1: [
    "He cried so much when it happened… I have never heard him cry like that. I just knew I had to come, no matter what.",
    "My days are very full, doctor. I wake before sunrise to go to the market. My children… they depend on me for everything.",
    "It has been very hard. I have not slept properly since the accident. I keep thinking — what if I had been there with him?",
    "This week has felt like a very long time. Every hour I worry — is he in pain? Is he getting worse while we wait?",
    "Thank you for asking. Most people just look at the injury. You are the first to ask how I am doing.",
  ],
  part2: [
    "To come here… I had to borrow money from my neighbour for the bus. The journey was three hours. I left my other children with someone I barely know.",
    "My husband… he works far away in the mines. I could not reach him in time. I had to make this decision alone.",
    "The clinic near our home — they looked at my son and said they do not have the right equipment. They sent us here. I did not know it would be so far.",
    "Money… doctor, we live day by day. What I earn from the market one day, we spend the next. There is nothing saved.",
    "I am worried about tomorrow. Even if the surgery happens today — how do I come back for the follow-up? The transport alone is too much.",
  ],
  part3: [
    "You… you are the first person today who has looked at me, not just at my son. I feel so alone in this.",
    "I keep telling myself I must be strong. But inside… I am very frightened. I do not know what happens if we cannot pay.",
    "It is strange. I feel ashamed to be here asking for help. Like I have failed. But I also know I had no other choice.",
    "Thank you for saying that. I did not expect anyone to understand. I thought I would just be told the cost and sent away.",
    "When you say it like that… I feel a little less alone. My son needs me to be strong. But it helps to know someone sees me.",
  ],
  part4: [
    "I understand. I did not think it would be easy to ask. But I am glad I asked. Can you tell me more about these other options?",
    "That is… honest. And kind. I appreciate that you did not just say no without explaining. What is this social worker you mention?",
    "I was afraid you would turn away. But you did not. I will try what you suggest. I just… I needed to know someone heard me first.",
    "Yes. I will speak to whoever you think can help. I am not proud, doctor. I just want my son to walk again.",
    "Thank you. Even if we cannot find the money today, knowing there are options… it gives me something to hold on to.",
  ],
};

const COACH_RESPONSES = {
  part1: [
    "Good start — you created space before asking anything. Try following up with an open invitation: 'Can you tell me more about what brought you here today?'",
    "You asked a strong open question. Notice how she responded with context, not just facts. That is the signal of trust forming.",
    "Consider reflecting back what she just shared before moving to your next question. It shows you are listening, not just collecting information.",
    "You are doing well establishing comfort. Now try to explore her perspective on the situation — 'What concerns you most right now?' — before any clinical detail.",
    "Strong close to this exchange. You stayed curious without leading. That is the foundation of a trustworthy clinical relationship.",
  ],
  part2: [
    "Good — you asked about barriers without assuming. She revealed the transport issue. Explore that further before moving to another determinant.",
    "Notice how she framed this as something she 'had to do alone.' That is worth reflecting back — it points to isolation, a key SDOH factor.",
    "You are uncovering structural barriers effectively. Try to stay descriptive — 'What was that like?' — rather than evaluative — 'That must have been hard.'",
    "She mentioned income instability without you asking directly. Follow her lead. Ask what that means for her day-to-day, not just for medical costs.",
    "Strong exchange. You identified at least two structural determinants. Remember: naming them internally is different from sharing them with the patient prematurely.",
  ],
  part3: [
    "Excellent — you sat with her feeling rather than rushing to fix it. That pause is clinical. Let her continue.",
    "Your response validated without dismissing. Notice how she opened up further. Emotional attunement creates more information than any direct question.",
    "Be careful not to over-reassure. 'It\'s okay' can feel dismissive. Try instead: 'That makes complete sense given everything you are carrying.'",
    "Good use of reflection. You named what she said back to her, which confirmed that you heard it. Continue before moving to any logistics.",
    "Well handled. You stayed present without problem-solving. This is what it means to earn trust before offering solutions.",
  ],
  part4: [
    "Good — you acknowledged the emotion before addressing the request. That ordering matters enormously in moments like this.",
    "Your boundary was clear but not cold. The key is the redirect — did you offer a concrete next step, or just a refusal with kindness?",
    "Notice how she responded to your answer. Her reaction tells you whether she felt heard or dismissed — and that shapes everything that follows.",
    "Well done staying steady under a difficult ask. This is exactly the kind of moment that tests whether empathy and ethics can coexist.",
    "Strong close. You modelled what ethical global health practice looks like: compassion, clarity, and a path forward that doesn\'t compromise either of you.",
  ],
};

let sdohResponseIdxs = { part1: 0, part2: 0, part3: 0, part4: 0 };
let sdohCoachIdxs    = { part1: 0, part2: 0, part3: 0, part4: 0 };

async function simulateSDOHComplete(prompt, chatId) {
  await new Promise(r => setTimeout(r, 800 + Math.random() * 700));
  if (prompt.includes('PATIENT_TURN')) {
    const arr = AMINA_RESPONSES[chatId] || AMINA_RESPONSES.part1;
    const reply = arr[sdohResponseIdxs[chatId] % arr.length];
    sdohResponseIdxs[chatId]++;
    return reply;
  } else {
    const arr = COACH_RESPONSES[chatId] || COACH_RESPONSES.part1;
    const reply = arr[sdohCoachIdxs[chatId] % arr.length];
    sdohCoachIdxs[chatId]++;
    return reply;
  }
}

// ─── Module Intro ─────────────────────────────────────────────────────
function SDOHModuleIntro({ module: m, onStart, onBack }) {
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
            <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'var(--teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-serif)', fontSize: 20, fontWeight: 700, color: 'white', flexShrink: 0 }}>AJ</div>
            <div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--text-subtle)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>Your patient today</div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: 22, fontWeight: 600, letterSpacing: '-0.01em' }}>{m.scenario.name}, {m.scenario.age}</div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>{m.scenario.context}</div>
            </div>
          </div>

          <HoverButton primary large onClick={onStart}>Begin module</HoverButton>
        </div>
      </div>
    </div>
  );
}

// ─── Slide Shell ──────────────────────────────────────────────────────
function SDOHSlideShell({ slide, totalSlides, onNext, onBack, canAdvance, children }) {
  const partColors = { 1: 'var(--accent)', 2: 'var(--teal)', 3: 'var(--gold)', 4: 'oklch(60% 0.13 320)' };
  const partColor = partColors[slide.part] || 'var(--accent)';
  const progress = (slide.idx + 1) / totalSlides;

  const isTitle = slide.type === 'title';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: isTitle ? 'var(--dark)' : 'var(--bg)' }}>
      {/* Progress bar */}
      <div style={{ height: 3, background: isTitle ? 'oklch(18% 0.02 245)' : 'var(--border)', flexShrink: 0 }}>
        <div style={{ height: '100%', background: partColor, width: `${progress * 100}%`, transition: 'width 0.6s var(--ease-spring)' }} />
      </div>

      {/* Header */}
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

      {/* Content */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {children}
      </div>

      {/* Footer — hidden on title slides (they have their own CTA) */}
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
function SDOHTitleSlide({ slide, onNext }) {
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
function SDOHObjectivesSlide({ slide }) {
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
function SDOHPatientProfileSlide({ slide }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(false); setTimeout(() => setMounted(true), 60); }, [slide.idx]);

  return (
    <div style={{ padding: '60px 48px', maxWidth: 760, margin: '0 auto', width: '100%' }}>
      <div style={{ opacity: mounted ? 1 : 0, transform: mounted ? 'none' : 'translateY(20px)', transition: 'all 0.7s var(--ease-spring)' }}>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--teal)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500, marginBottom: 28 }}>
          {slide.tag}
        </div>

        {/* Persona card */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '28px 32px', marginBottom: 20, display: 'flex', gap: 24, alignItems: 'flex-start' }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-serif)', fontSize: 24, fontWeight: 700, color: 'white', flexShrink: 0, boxShadow: '0 4px 16px oklch(58% 0.13 185 / 0.28)' }}>
            AJ
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
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--teal)', flexShrink: 0, marginTop: 6 }} />
                  <p style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--text)', lineHeight: 1.55, margin: 0, fontWeight: 300 }}>{t}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Incident */}
        <div style={{ background: 'var(--surface-sub)', borderLeft: '3px solid var(--accent)', borderRadius: '0 10px 10px 0', padding: '16px 20px', marginBottom: 20 }}>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: 10, color: 'var(--accent)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Recent Event</div>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--text)', lineHeight: 1.65, margin: 0, fontWeight: 300 }}>{slide.incident}</p>
        </div>

        {/* Cost cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 20 }}>
          {slide.costs.map((c, i) => (
            <div key={i} style={{ background: 'var(--dark)', borderRadius: 12, padding: '20px 24px' }}>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: 10, color: 'oklch(44% 0.01 240)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, marginBottom: 6 }}>{c.label}</div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: 28, fontWeight: 700, color: 'var(--teal)', lineHeight: 1.1, marginBottom: 4 }}>{c.amount}</div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'oklch(40% 0.01 240)' }}>{c.note}</div>
            </div>
          ))}
        </div>

        {/* Burden banner */}
        <div style={{ background: 'var(--teal-light)', border: '1px solid var(--teal)', borderRadius: 10, padding: '14px 20px', display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ width: 4, alignSelf: 'stretch', background: 'var(--teal)', borderRadius: 4, flexShrink: 0 }} />
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'oklch(30% 0.1 185)', margin: 0, lineHeight: 1.6, fontWeight: 500 }}>{slide.burden}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Drag-Drop Slide ───────────────────────────────────────────────────
function SDOHDragDropSlide({ slide, onComplete }) {
  const [placements, setPlacements] = useState({}); // { itemId: categoryId }
  const [selected, setSelected] = useState(null);   // selected item id
  const [checked, setChecked] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(false); setTimeout(() => setMounted(true), 60); }, [slide.idx]);

  const unplaced = slide.items.filter(item => !placements[item.id]);
  const allPlaced = slide.items.every(item => placements[item.id]);

  const handleItemClick = (itemId) => {
    if (checked) return;
    setSelected(selected === itemId ? null : itemId);
  };

  const handleZoneClick = (catId) => {
    if (!selected || checked) return;
    setPlacements(p => ({ ...p, [selected]: catId }));
    setSelected(null);
  };

  const handleCheck = () => {
    setChecked(true);
    onComplete();
  };

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

        {/* Unplaced bank */}
        {unplaced.length > 0 && (
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--text-subtle)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 12 }}>Select a question:</div>
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

        {/* Drop zones */}
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
                      {checked && (
                        <span style={{ marginRight: 8, fontSize: 12 }}>{placements[item.id] === item.correct ? '✓' : '✗'}</span>
                      )}
                      {item.text}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Check button */}
        {allPlaced && !checked && (
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 24 }}>
            <HoverButton primary onClick={handleCheck}>Check answers</HoverButton>
          </div>
        )}

        {/* Feedback */}
        {checked && (
          <div style={{ padding: '20px 24px', background: 'var(--teal-light)', border: '1px solid var(--teal)', borderRadius: 12, animation: 'fadeUp 0.4s var(--ease-spring)' }}>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--teal)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>Reflection</div>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'oklch(25% 0.08 185)', lineHeight: 1.65, margin: 0 }}>{slide.feedback}</p>
          </div>
        )}
      </div>
      <style>{`@keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:none; } }`}</style>
    </div>
  );
}

// ─── AI Chat Slide ─────────────────────────────────────────────────────
function SDOHAIChatSlide({ slide, onComplete }) {
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
      const patientReply = await simulateSDOHComplete('PATIENT_TURN ' + userMsg, slide.chatId);
      const updatedMsgs = [...newMessages, { role: 'patient', text: patientReply }];
      setMessages(updatedMsgs);
      setLoading(false);

      const coachReply = await simulateSDOHComplete('COACH_TURN', slide.chatId);
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
      {/* Instructions bar */}
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

      {/* Chat + Coach */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 320px', overflow: 'hidden' }}>
        {/* Chat */}
        <div style={{ display: 'flex', flexDirection: 'column', borderRight: '1px solid var(--border)' }}>
          <div style={{ padding: '12px 32px', borderBottom: '1px solid var(--border)', background: 'var(--surface)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--teal)', animation: 'pulse 2s ease-in-out infinite' }} />
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>Amina Juma, 34 — Mwanza, Tanzania</span>
          </div>
          <div ref={chatRef} style={{ flex: 1, overflow: 'auto', padding: '28px 36px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'student' ? 'flex-end' : 'flex-start', animation: 'fadeUp 0.4s var(--ease-spring)' }}>
                {msg.role === 'patient' && (
                  <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-serif)', fontSize: 12, fontWeight: 700, color: 'white', marginRight: 10, flexShrink: 0, alignSelf: 'flex-end' }}>AJ</div>
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
                <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-serif)', fontSize: 12, fontWeight: 700, color: 'white', flexShrink: 0 }}>AJ</div>
                <div style={{ padding: '13px 18px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '18px 18px 18px 4px', display: 'flex', gap: 5, alignItems: 'center' }}>
                  {[0,1,2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--text-subtle)', animation: `pulse 1.2s ${i * 0.2}s ease-in-out infinite` }} />)}
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

        {/* Coach panel */}
        <div style={{ background: 'var(--dark)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid var(--border-dark)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--teal)', animation: 'pulse 2s ease-in-out infinite' }} />
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
              <div key={i} style={{ padding: '14px', background: 'oklch(13% 0.02 245)', border: '1px solid var(--border-dark)', borderLeft: '3px solid var(--teal)', animation: 'fadeUp 0.5s var(--ease-spring)' }}>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: 9, color: 'var(--teal)', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
                  After exchange {note.turn + 1}
                </div>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'oklch(70% 0.01 240)', lineHeight: 1.65, fontWeight: 300, margin: 0 }}>{note.text}</p>
              </div>
            ))}
            {coachLoading && (
              <div style={{ padding: '12px 14px', background: 'oklch(13% 0.02 245)', border: '1px solid var(--border-dark)', display: 'flex', gap: 5, alignItems: 'center' }}>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: 10, color: 'var(--teal)', marginRight: 6 }}>Analysing…</span>
                {[0,1,2].map(i => <div key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--teal)', opacity: 0.6, animation: `pulse 1.2s ${i * 0.2}s ease-in-out infinite` }} />)}
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
      <style>{`@keyframes fadeUp { from { opacity:0;transform:translateY(10px); } to { opacity:1;transform:none; } } @keyframes pulse { 0%,100%{opacity:.4} 50%{opacity:1} }`}</style>
    </div>
  );
}

// ─── Content Slide ─────────────────────────────────────────────────────
function SDOHContentSlide({ slide }) {
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
function SDOHFrameworkSlide({ slide }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(false); setTimeout(() => setMounted(true), 60); }, [slide.idx]);

  return (
    <div style={{ padding: '60px 48px', maxWidth: 720, margin: '0 auto', width: '100%' }}>
      <div style={{ opacity: mounted ? 1 : 0, transform: mounted ? 'none' : 'translateY(20px)', transition: 'all 0.7s var(--ease-spring)' }}>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'oklch(60% 0.13 320)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500, marginBottom: 20 }}>
          {slide.tag}
        </div>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 600, lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: 12 }}>
          {slide.headline}
        </h2>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 16, color: 'var(--text-muted)', lineHeight: 1.7, fontWeight: 300, marginBottom: 48 }}></p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 0, position: 'relative' }}>
          {slide.steps.map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: 0, opacity: mounted ? 1 : 0, transform: mounted ? 'none' : 'translateY(16px)', transition: `all 0.6s ${0.12 * i + 0.2}s var(--ease-spring)` }}>
              {/* Step number + connector */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 48, flexShrink: 0 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'oklch(60% 0.13 320)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-serif)', fontSize: 18, fontWeight: 700, flexShrink: 0, zIndex: 1 }}>
                  {step.step}
                </div>
                {i < slide.steps.length - 1 && (
                  <div style={{ width: 2, flex: 1, background: 'var(--border)', minHeight: 32 }} />
                )}
              </div>
              {/* Content */}
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
function SDOHMCQSlide({ slide, onComplete }) {
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(false); setTimeout(() => setMounted(true), 60); }, [slide.idx]);

  const isCorrect = selected === slide.correctId;

  const handleSubmit = () => {
    setSubmitted(true);
    if (selected === slide.correctId) onComplete();
    // Allow advance even if wrong (after seeing feedback)
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
            animation: 'fadeUp 0.4s var(--ease-spring)',
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
      <style>{`@keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:none; } }`}</style>
    </div>
  );
}

// ─── Debrief Slide ────────────────────────────────────────────────────
function SDOHDebriefSlide({ slide }) {
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
                {/* Trigger */}
                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: isOpen ? 'var(--teal)' : 'var(--dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, transition: 'background 0.3s' }}>
                    {card.icon}
                  </div>
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 600, color: 'var(--text)', textAlign: 'center', lineHeight: 1.35 }}>{card.label}</div>
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: 10, color: isOpen ? 'var(--teal)' : 'var(--text-subtle)', transition: 'color 0.3s' }}>
                    {isOpen ? 'Click to close' : 'Click to explore'}
                  </div>
                </div>

                {/* Expanded panel */}
                {isOpen && (
                  <div style={{ padding: '0 18px 18px', animation: 'fadeUp 0.3s var(--ease-spring)' }}>
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
      <style>{`@keyframes fadeUp { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:none; } }`}</style>
    </div>
  );
}

// ─── Takeaway Slide ────────────────────────────────────────────────────
function SDOHTakeawaySlide({ slide }) {
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
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--text-subtle)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 16 }}>These six determinants intersect:</div>
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
function SDOHFeedbackView({ module: m, onBack }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setTimeout(() => setMounted(true), 80); }, []);

  const dims = [
    { label: 'Open-ended Questioning', score: 80, color: 'var(--accent)' },
    { label: 'Structural Awareness',   score: 76, color: 'var(--teal)' },
    { label: 'Emotional Attunement',   score: 84, color: 'var(--gold)' },
    { label: 'Ethical Boundary-Setting', score: 78, color: 'oklch(60% 0.13 320)' },
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
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: 21, fontWeight: 600, marginBottom: 8 }}>Thoughtful session.</div>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.65, fontWeight: 300 }}>
              You demonstrated care for Amina's full context — structural, emotional, and ethical. Focus area: practice redirecting to systemic resources earlier in boundary conversations.
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
function SDOHModuleExperience({ module: m, onBack }) {
  const [slideIdx, setSlideIdx] = useState(-1);
  const [completedSlides, setCompletedSlides] = useState(new Set());

  const totalSlides = SDOH_SLIDES.length;

  const markComplete = (idx) => setCompletedSlides(s => new Set([...s, idx]));

  const canAdvance = (idx) => {
    if (idx < 0 || idx >= totalSlides) return true;
    const slide = SDOH_SLIDES[idx];
    const interactive = ['drag-drop', 'mcq', 'ai-chat'];
    if (interactive.includes(slide.type)) return completedSlides.has(idx);
    return true;
  };

  const goNext = () => {
    if (slideIdx < totalSlides - 1) {
      window.scrollTo(0, 0);
      setSlideIdx(i => i + 1);
    } else {
      setSlideIdx(totalSlides); // feedback
    }
  };

  const goBack = () => {
    if (slideIdx <= 0) { setSlideIdx(-1); }
    else { window.scrollTo(0, 0); setSlideIdx(i => i - 1); }
  };

  // Intro
  if (slideIdx === -1) {
    return <SDOHModuleIntro module={m} onStart={() => setSlideIdx(0)} onBack={onBack} />;
  }

  // Feedback
  if (slideIdx >= totalSlides) {
    return <SDOHFeedbackView module={m} onBack={onBack} />;
  }

  const slide = SDOH_SLIDES[slideIdx];

  // Render slide content by type
  const renderContent = () => {
    switch (slide.type) {
      case 'title':
        return <SDOHTitleSlide slide={slide} onNext={goNext} />;
      case 'objectives':
        return <SDOHObjectivesSlide slide={slide} />;
      case 'patient-profile':
        return <SDOHPatientProfileSlide slide={slide} />;
      case 'drag-drop':
        return <SDOHDragDropSlide key={slideIdx} slide={slide} onComplete={() => markComplete(slideIdx)} />;
      case 'ai-chat':
        return <SDOHAIChatSlide key={slideIdx} slide={slide} onComplete={() => markComplete(slideIdx)} />;
      case 'content':
        return <SDOHContentSlide slide={slide} />;
      case 'framework':
        return <SDOHFrameworkSlide slide={slide} />;
      case 'mcq':
        return <SDOHMCQSlide key={slideIdx} slide={slide} onComplete={() => markComplete(slideIdx)} />;
      case 'debrief':
        return <SDOHDebriefSlide slide={slide} />;
      case 'takeaway':
        return <SDOHTakeawaySlide slide={slide} />;
      default:
        return null;
    }
  };

  return (
    <SDOHSlideShell
      slide={slide}
      totalSlides={totalSlides}
      onNext={goNext}
      onBack={goBack}
      canAdvance={canAdvance(slideIdx)}
    >
      {renderContent()}
    </SDOHSlideShell>
  );
}

Object.assign(window, { SDOHModuleExperience });
