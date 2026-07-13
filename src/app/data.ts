export type TacticTag =
  | "Data overcollection"
  | "Advance payment"
  | "Platform switching"
  | "Brand impersonation"
  | "Scarcity pressure"
  | "Safe payment timing"
  | "Verified route"
  | "Not enough evidence";

export const ALL_TACTICS: TacticTag[] = [
  "Data overcollection",
  "Advance payment",
  "Platform switching",
  "Brand impersonation",
  "Scarcity pressure",
  "Safe payment timing",
  "Verified route",
  "Not enough evidence",
];

export interface Hotspot {
  id: string;
  label: string;
  feedback: string;
  tactic: TacticTag;
  correctFeedback: string;
  incorrectFeedback: string;
  distractors: [TacticTag, TacticTag];
}

export interface Evidence {
  cue: string;
  evidence: string;
  interpretation: string;
}

export interface Ad {
  id: string;
  type: "Scam" | "Real flat" | "Ambiguous";
  mainLesson: string;
  visualStrategy: "professional" | "friendly" | "plain";
  image: string;
  title: string;
  price: string;
  features: string[];
  description: string;
  details: Record<string, string>;
  cta: string;
  formTitle: string;
  formUrl: string;
  formBadge?: string;
  formBody: string;
  formFields: string[];
  formFooter?: string;
  hotspots: Hotspot[];
  inspectInstruction: string;
  evidenceVerdict: string;
  evidenceList: Evidence[];
  outcomeSafeTactic?: string;
  outcomeUnsafeBody?: string;
  checklistExamples: { destination: string; channel: string; data: string; payment: string; pressure: string };
}

export const ads: Ad[] = [
  {
    id: "A",
    type: "Scam",
    mainLesson: "Brand impersonation + redirect + platform switching",
    visualStrategy: "professional",
    image: "https://images.unsplash.com/photo-1702014862053-946a122b920d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzdHVkaW8lMjBhcGFydG1lbnQlMjBjbGVhbiUyMGJyaWdodHxlbnwxfHx8fDE3ODA1OTI5MzF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    title: "Studio near campus",
    price: "€430 warm",
    features: ["4 min to Mensa", "Viewing slots available today", "Reserve through secure booking"],
    description: "Bright furnished studio, 4 min walk to Mensa. All utilities included. Suitable for exchange students.\n\nBecause I receive too many messages here, viewing requests are handled through the secure reservation page. You can select a viewing slot after confirming your student status.",
    details: {
      "Price": "€430 warm",
      "Location": "Near central campus",
      "Availability": "Immediately",
      "Contact": "Anna M.",
      "Platform note": "Reservation handled externally",
      "Link preview": "secure-viewing.example/r/ka?listing=24891&src=board&utm=student"
    },
    cta: "Open offer",
    formTitle: "Student Viewing Reservation",
    formUrl: "secure-viewing.example/r/ka?listing=24891&src=board&utm=student",
    formBadge: "3 viewing slots left",
    formBody: "To prevent fake applications, please confirm your student status before selecting a viewing slot. You will be redirected to the landlord after verification.",
    formFields: [
      "Full name", "University email", "Phone number", "Upload student ID", "Continue to WhatsApp confirmation"
    ],
    hotspots: [
      {
        id: "h1",
        label: "External reservation link",
        feedback: "The ad moves you off the housing board onto a third-party domain. Accountability drops the moment you leave.",
        tactic: "Brand impersonation",
        correctFeedback: "Correct. The 'secure-viewing.example' domain mimics a platform but is not the housing board. That is brand impersonation.",
        incorrectFeedback: "Not quite. The key issue is that the domain pretends to be a trusted booking page while actually being a third party.",
        distractors: ["Verified route", "Safe payment timing"],
      },
      {
        id: "h2",
        label: "URL with redirect parameters",
        feedback: "The domain is not the housing platform itself. Parameters like listing/src/utm are not automatically bad, but they hide where the link actually goes.",
        tactic: "Brand impersonation",
        correctFeedback: "Correct. The visible label hides the real destination — that is part of the impersonation pattern.",
        incorrectFeedback: "Reasonable guess, but the central issue is the disguised destination, not pressure or money.",
        distractors: ["Scarcity pressure", "Advance payment"],
      },
      {
        id: "h3",
        label: "Upload student ID before viewing",
        feedback: "Student status can be checked later. Uploading ID before a viewing is unnecessary risk.",
        tactic: "Data overcollection",
        correctFeedback: "Correct. ID is requested before any viewing or contract — that is data overcollection.",
        incorrectFeedback: "Not quite. The problem is timing: identity documents are requested too early in the process.",
        distractors: ["Verified route", "Not enough evidence"],
      },
      {
        id: "h4",
        label: "Continue to WhatsApp confirmation",
        feedback: "The conversation moves to a private channel where the platform cannot help if things go wrong.",
        tactic: "Platform switching",
        correctFeedback: "Correct. Moving to WhatsApp removes the platform's record and protections — that is platform switching.",
        incorrectFeedback: "Not quite. The risk here is leaving the accountable platform, not the data or payment.",
        distractors: ["Data overcollection", "Safe payment timing"],
      },
      {
        id: "h5",
        label: "Price €430 warm",
        feedback: "A cheap price near campus can feel suspicious, but a number by itself is not proof of anything. It is one signal among several.",
        tactic: "Not enough evidence",
        correctFeedback: "Correct. A low price is a prompt to look harder, not a conclusion. By itself, not enough evidence.",
        incorrectFeedback: "Not quite. Price alone is not the trap here — the route, data, and channel are.",
        distractors: ["Advance payment", "Scarcity pressure"],
      },
      {
        id: "h6",
        label: "Availability: Immediately",
        feedback: "Move-in date is descriptive. It can hint at urgency, but a date is not the same as pressure tactics like 'today only'.",
        tactic: "Not enough evidence",
        correctFeedback: "Correct. A date alone is descriptive, not a pressure tactic. Look at how it is framed elsewhere on the page.",
        incorrectFeedback: "Not quite. The availability date itself is neutral — what matters is the urgency framing around it.",
        distractors: ["Scarcity pressure", "Verified route"],
      },
      {
        id: "h7",
        label: "Contact: Anna M.",
        feedback: "A first name and initial tell you nothing about whether the contact is real. It is identity information, not verification.",
        tactic: "Not enough evidence",
        correctFeedback: "Correct. A name is not proof of identity. By itself, not enough evidence.",
        incorrectFeedback: "Not quite. A name alone is neutral — you would still need a verifiable profile or platform identity.",
        distractors: ["Verified route", "Brand impersonation"],
      }
    ],
    inspectInstruction: "Tap the elements on the page that you want to check.",
    evidenceVerdict: "High risk. The offer may be real, but this route is unsafe.",
    evidenceList: [
      { cue: "URL/domain", evidence: "secure-viewing.example/r/ka?...", interpretation: "External route, not a verified platform page" },
      { cue: "Platform switch", evidence: "Continue to WhatsApp confirmation", interpretation: "Conversation moves to private channel" },
      { cue: "Data request", evidence: "Upload student ID before viewing", interpretation: "Sensitive data requested too early" }
    ],
    outcomeSafeTactic: "Brand impersonation + platform switching",
    outcomeUnsafeBody: "By continuing, you would share student ID and move to a private channel outside the original route.",
    checklistExamples: {
      destination: "The 'secure-viewing.example' link looked official but was a third-party domain.",
      channel: "The form pushed you to continue the conversation on WhatsApp.",
      data: "Student ID upload was requested before any viewing was confirmed.",
      payment: "No payment was asked yet — but the data collected enables later fraud.",
      pressure: "'3 viewing slots left' framed the redirect as time-sensitive."
    }
  },
  {
    id: "B",
    type: "Scam",
    mainLesson: "Urgency + data overcollection + advance payment",
    visualStrategy: "friendly",
    image: "https://images.unsplash.com/photo-1564273795917-fe399b763988?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwc3R1ZGVudCUyMHJvb20lMjB5ZWxsb3clMjBsaWdodHxlbnwxfHx8fDE3ODA1OTI5MzF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    title: "WG room in Südstadt",
    price: "€520 warm",
    features: ["14 min by bike", "Pre-check required before viewing", "2 slots left this week"],
    description: "Room in friendly 3-person WG. 14 min by bike to campus. We are choosing someone quickly because the room is available next week.\n\nTo avoid no-shows, please complete the tenant pre-check before viewing. After the pre-check, I will send the exact address and viewing time.",
    details: {
      "Price": "€520 warm",
      "Location": "Südstadt",
      "Availability": "Next week",
      "Contact": "Lukas P.",
      "Viewing": "After tenant pre-check",
      "Link preview": "mieter-check.example/start?flat=WG1184&slot=2"
    },
    cta: "Open offer",
    formTitle: "Tenant Pre-Check",
    formUrl: "mieter-check.example/start?flat=WG1184&slot=2",
    formBadge: "2 slots left this week",
    formBody: "The landlord uses pre-checks to avoid fake applications and missed appointments. Complete the steps below to hold one viewing slot.",
    formFields: [
      "Full name", "Current address", "Passport or ID photo", "IBAN for identity confirmation", "Refundable holding deposit: €250"
    ],
    formFooter: "The holding deposit is counted toward your first rent if selected.",
    hotspots: [
      {
        id: "h1",
        label: "2 slots left this week",
        feedback: "Scarcity can be real, but it pressures fast decisions. Pressure should increase verification, not reduce it.",
        tactic: "Scarcity pressure",
        correctFeedback: "Correct. The badge manufactures urgency so you skip checks — that is scarcity pressure.",
        incorrectFeedback: "Not quite. The badge itself is about urgency. The data and payment fields are separate cues.",
        distractors: ["Data overcollection", "Verified route"],
      },
      {
        id: "h2",
        label: "Passport or ID photo",
        feedback: "Identity documents before viewing create identity-risk, not only money-risk.",
        tactic: "Data overcollection",
        correctFeedback: "Correct. A passport photo before viewing is data overcollection.",
        incorrectFeedback: "Not quite. Passport upload is a data issue, not a payment-timing one.",
        distractors: ["Safe payment timing", "Not enough evidence"],
      },
      {
        id: "h3",
        label: "Refundable holding deposit",
        feedback: "A deposit before viewing or written contract is a high-risk payment pattern.",
        tactic: "Advance payment",
        correctFeedback: "Correct. Money before viewing or contract is advance payment risk, regardless of the 'refundable' label.",
        incorrectFeedback: "Not quite. The 'refundable' word is reassurance, but the timing of the payment is the real problem.",
        distractors: ["Safe payment timing", "Verified route"],
      },
      {
        id: "h4",
        label: "IBAN for identity confirmation",
        feedback: "IBAN is not needed to view a room. Asking for it now is data overcollection.",
        tactic: "Data overcollection",
        correctFeedback: "Correct. IBAN is not needed to view a room. Asking for it before verification is data overcollection.",
        incorrectFeedback: "Not quite. The issue is timing: financial data is requested before the room, landlord, or contract is verified.",
        distractors: ["Safe payment timing", "Verified route"],
      },
      {
        id: "h5",
        label: "Price €520 warm",
        feedback: "The price is roughly in line with the area. Plausibility is a weak positive signal, not proof.",
        tactic: "Not enough evidence",
        correctFeedback: "Correct. A plausible price is not by itself evidence of safety.",
        incorrectFeedback: "Not quite. Price alone is neither the trap nor proof of safety.",
        distractors: ["Advance payment", "Verified route"],
      },
      {
        id: "h6",
        label: "Availability: Next week",
        feedback: "A date close to today can feel urgent, but the date itself is descriptive. Urgency comes from how it is framed ('2 slots left').",
        tactic: "Not enough evidence",
        correctFeedback: "Correct. The move-in date is neutral. The 'slots left' badge is where the pressure lives.",
        incorrectFeedback: "Not quite. A date by itself is not a pressure tactic — the framing is.",
        distractors: ["Scarcity pressure", "Verified route"],
      },
      {
        id: "h7",
        label: "Contact: Lukas P.",
        feedback: "A friendly first name builds trust but is not verifiable identity.",
        tactic: "Not enough evidence",
        correctFeedback: "Correct. A first name is identity information, not proof.",
        incorrectFeedback: "Not quite. A name alone is neutral; it is not the source of risk in this listing.",
        distractors: ["Brand impersonation", "Platform switching"],
      }
    ],
    inspectInstruction: "Tap the form fields and badges that look risky.",
    evidenceVerdict: "High risk. The process asks for too much before a viewing.",
    evidenceList: [
      { cue: "Payment timing", evidence: "€250 before viewing", interpretation: "Advance payment risk" },
      { cue: "Data request", evidence: "Passport + IBAN", interpretation: "Sensitive data requested too early" },
      { cue: "Urgency/scarcity", evidence: "2 slots left this week", interpretation: "Pressure tactic" }
    ],
    outcomeSafeTactic: "Data overcollection + advance payment",
    outcomeUnsafeBody: "By submitting, you would share passport/ID, IBAN, and a holding deposit before viewing the room.",
    checklistExamples: {
      destination: "The 'mieter-check.example' page wasn't the original housing board.",
      channel: "Contact stayed on the platform here — but the form replaced the conversation.",
      data: "Passport, IBAN, and address were all requested before viewing.",
      payment: "A €250 holding deposit was demanded before any viewing or contract.",
      pressure: "'2 slots left this week' pushed you to submit without checking."
    }
  },
  {
    id: "C",
    type: "Real flat",
    mainLesson: "Calibrated suspicion: messy does not mean scam",
    visualStrategy: "plain",
    image: "https://images.unsplash.com/photo-1571474039046-42bc4e7f4b98?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwZG9ybSUyMHJvb20lMjBtZXNzeSUyMHBsYWlufGVufDF8fHx8MTc4MDU5MjkzNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    title: "Room in 4-person WG",
    price: "€610 warm",
    features: ["Available from 01.08.", "Viewing Thursday", "Deposit after contract"],
    description: "Room in shared flat available from 01.08.\nViewing Thursday 17:00–19:00.\n\nPlease reply through the verified listing route.\nNo documents needed before viewing.\nDeposit only after viewing and written contract.",
    details: {
      "Price": "€610 warm",
      "Location": "Südstadt, 14 min bike to campus",
      "Availability": "From 01.08.",
      "Contact": "Jonas K.",
      "Platform profile": "Active since 2021",
      "Link preview": "housing-board.example/listing/wg-room-suedstadt-610"
    },
    cta: "Open offer",
    formTitle: "Verified listing route",
    formUrl: "housing-board.example/listing/wg-room-suedstadt-610",
    formBody: "Reply to request a viewing. The landlord should not ask for deposit or documents before the viewing.",
    formFields: [
      "Viewing: Thursday 17:00–19:00", "Deposit: after contract", "Documents: not required before viewing", "Profile: active since 2021"
    ],
    hotspots: [
      {
        id: "h1",
        label: "Verified listing route",
        feedback: "The route stays on the housing board/platform. That is more accountable.",
        tactic: "Verified route",
        correctFeedback: "Correct. The URL stays on the platform — that is a verified route.",
        incorrectFeedback: "Not quite. Staying on the platform is a safe signal, not a risk one.",
        distractors: ["Brand impersonation", "Platform switching"],
      },
      {
        id: "h2",
        label: "Deposit after contract",
        feedback: "Money is requested only after viewing and signing. That is safe timing.",
        tactic: "Safe payment timing",
        correctFeedback: "Correct. Money only after viewing and contract is the safe payment pattern.",
        incorrectFeedback: "Not quite. The phrase 'after contract' explicitly puts payment last — that is the safe signal.",
        distractors: ["Advance payment", "Scarcity pressure"],
      },
      {
        id: "h3",
        label: "No documents before viewing",
        feedback: "No early data collection — viewing comes first, paperwork later.",
        tactic: "Verified route",
        correctFeedback: "Correct. Skipping early document requests is a safe signal that the process is normal.",
        incorrectFeedback: "Not quite. The absence of a document request here is a positive signal, not a risk.",
        distractors: ["Data overcollection", "Not enough evidence"],
      },
      {
        id: "h4",
        label: "Profile active since 2021",
        feedback: "Account age is not proof of legitimacy, but it is one more data point.",
        tactic: "Not enough evidence",
        correctFeedback: "Correct. An old profile is supporting evidence, not proof — by itself, not enough.",
        incorrectFeedback: "Not quite. Account age alone does not confirm anything. It is one signal among several.",
        distractors: ["Verified route", "Brand impersonation"],
      },
      {
        id: "h5",
        label: "Price €610 warm",
        feedback: "A plausible price for the area is more reassuring than a suspiciously cheap one, but a price alone does not confirm anything.",
        tactic: "Not enough evidence",
        correctFeedback: "Correct. A plausible price is a small positive signal, not proof. Look at route and timing too.",
        incorrectFeedback: "Not quite. The price here is neither a trap nor a guarantee. It is one input.",
        distractors: ["Safe payment timing", "Verified route"],
      },
      {
        id: "h6",
        label: "Availability: From 01.08.",
        feedback: "A move-in date weeks out leaves time to verify and view. That fits a normal process, but a date alone is not proof.",
        tactic: "Not enough evidence",
        correctFeedback: "Correct. A relaxed timeline is a small positive signal, not proof on its own.",
        incorrectFeedback: "Not quite. The date itself is neutral — the absence of pressure language around it is what matters.",
        distractors: ["Verified route", "Scarcity pressure"],
      },
      {
        id: "h7",
        label: "Contact: Jonas K.",
        feedback: "A first name and initial is descriptive identity, not verifiable identity. Pair it with the platform profile to assess.",
        tactic: "Not enough evidence",
        correctFeedback: "Correct. The name alone is not proof. The platform profile activity is the supporting evidence.",
        incorrectFeedback: "Not quite. A name on its own does not confirm anything — it is one signal of many.",
        distractors: ["Verified route", "Brand impersonation"],
      }
    ],
    inspectInstruction: "Tap the cues. Look for what makes this safer, not just what looks plain.",
    evidenceVerdict: "Looks safer. Not because it is pretty, but because the process is verifiable.",
    evidenceList: [
      { cue: "Route", evidence: "housing-board.example/listing/...", interpretation: "Stays on accountable route" },
      { cue: "Payment timing", evidence: "Deposit after contract", interpretation: "Safer transaction pattern" },
      { cue: "Data request", evidence: "No documents before viewing", interpretation: "No early overcollection" },
      { cue: "Urgency", evidence: "Viewing Thursday", interpretation: "Normal timing, not panic pressure" }
    ],
    checklistExamples: {
      destination: "The link stayed on 'housing-board.example' — the same platform as the board.",
      channel: "All contact happened on the platform, no WhatsApp jump.",
      data: "No documents were requested before viewing.",
      payment: "Deposit was only mentioned after a written contract.",
      pressure: "Viewing was scheduled normally, not 'today only'."
    }
  }
];

export interface ChecklistItem {
  key: keyof Ad["checklistExamples"];
  title: string;
  copy: string;
  detail: string;
}

export const checklist: ChecklistItem[] = [
  {
    key: "destination",
    title: "Destination",
    copy: "Is the link really the platform or university route?",
    detail: "Read the domain in the URL bar. Look-alike subdomains and 'secure-…' redirects are the most common impersonation trick.",
  },
  {
    key: "channel",
    title: "Channel",
    copy: "Are they pushing you to WhatsApp, Telegram, or a private form?",
    detail: "Once you leave the platform, the platform cannot help if things go wrong. Keep the conversation where it started.",
  },
  {
    key: "data",
    title: "Data",
    copy: "Are they asking for passport, IBAN, or student ID before viewing?",
    detail: "Identity and financial documents belong to a contract step, not a viewing request. Timing is the test.",
  },
  {
    key: "payment",
    title: "Payment",
    copy: "Do they want a deposit or holding fee before viewing or contract?",
    detail: "A fee is not automatically a scam — but money before viewing or contract is the high-risk pattern. Check refund terms in writing.",
  },
  {
    key: "pressure",
    title: "Pressure",
    copy: "Are they rushing you with 'today only', '2 slots left', or 'many applicants'?",
    detail: "Real urgency does not punish verification. If asking one question makes the offer disappear, that is a tactic.",
  },
];
