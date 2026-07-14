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
  mandatory: boolean;
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

export interface FormField {
  label: string;
  demoValue: string;
}

export type ChecklistKey = "destination" | "channel" | "data" | "payment" | "pressure";

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
  formFields: FormField[];
  formFooter?: string;
  hotspots: Hotspot[];
  inspectionOrder: string[];
  inspectInstruction: string;
  evidenceVerdict: string;
  evidenceList: Evidence[];
  outcomeSafeTactic?: string;
  outcomeUnsafeBody?: string;
  relevantChecklistKeys: ChecklistKey[];
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
      { label: "Full name", demoValue: "Alex Example" },
      { label: "University email", demoValue: "alex@example.edu" },
      { label: "Phone number", demoValue: "+49 151 000000" },
      { label: "Upload student ID", demoValue: "student-id-example.pdf" },
      { label: "Continue to WhatsApp confirmation", demoValue: "Ready to continue" },
    ],
    hotspots: [
      {
        id: "h1",
        label: "External reservation link",
        feedback: "This ad quietly moves you off the housing board and onto a third-party domain. The moment you leave the platform, it becomes much harder to verify who is behind the request.",
        mandatory: false,
        tactic: "Brand impersonation",
        correctFeedback: "That’s it. ‘secure-viewing.example’ sounds official, but it is not the housing board. A familiar-looking name can still be a disguise.",
        incorrectFeedback: "The important clue is the destination. This page borrows the feel of a trusted booking route while sending you somewhere else.",
        distractors: ["Verified route", "Safe payment timing"],
      },
      {
        id: "h2",
        label: "URL with redirect parameters",
        feedback: "Look past the reassuring label: this domain is not the housing platform. The listing, src, and utm parameters are not automatically malicious, but they make the real destination worth checking.",
        mandatory: true,
        tactic: "Brand impersonation",
        correctFeedback: "You caught the disguise. The URL looks like a normal listing link, but it leads to a third-party destination — a classic impersonation signal.",
        incorrectFeedback: "That’s a reasonable concern, but this cue is about where the link leads, not about urgency or money. Read the domain before you follow the promise.",
        distractors: ["Scarcity pressure", "Advance payment"],
      },
      {
        id: "h3",
        label: "Upload student ID before viewing",
        feedback: "Student status can be checked later. Before you have even seen the room, uploading an ID gives away sensitive information without a clear need.",
        mandatory: true,
        tactic: "Data overcollection",
        correctFeedback: "Yes — the form wants proof of identity before it has earned your trust. That is data overcollection, and once a document is copied, you cannot really take it back.",
        incorrectFeedback: "The problem is the timing. An ID request before a viewing collects too much, too soon; it is not mainly about the route or the payment.",
        distractors: ["Verified route", "Not enough evidence"],
      },
      {
        id: "h4",
        label: "Continue to WhatsApp confirmation",
        feedback: "WhatsApp may feel convenient, but it takes the conversation out of the platform’s record and support. That makes it harder to retrace what was promised.",
        mandatory: true,
        tactic: "Platform switching",
        correctFeedback: "Exactly. Moving to WhatsApp removes an important safety net. If something goes wrong, there is less evidence and less help.",
        incorrectFeedback: "This clue is about the channel, not the documents or payment. When a listing pulls you into a private conversation, pause before you follow.",
        distractors: ["Data overcollection", "Safe payment timing"],
      },
      {
        id: "h5",
        label: "Price €430 warm",
        feedback: "€430 near campus may make you look twice, but price alone cannot tell you whether an offer is genuine. It is a reason to look closer, not a verdict.",
        mandatory: false,
        tactic: "Not enough evidence",
        correctFeedback: "Good read. A low price can raise your eyebrows, but it cannot prove a scam by itself. Let the route and requests do the heavier work.",
        incorrectFeedback: "The price is a clue, not the trap. The stronger warnings here are the external route, early ID request, and WhatsApp handoff.",
        distractors: ["Advance payment", "Scarcity pressure"],
      },
      {
        id: "h6",
        label: "Availability: Immediately",
        feedback: "‘Immediately’ creates a sense of speed, but a move-in date is not the same as pressure. Look for language that punishes you for taking time to verify.",
        mandatory: false,
        tactic: "Not enough evidence",
        correctFeedback: "Right. A date describes availability; it does not automatically create pressure. The urgency is being built elsewhere on this page.",
        incorrectFeedback: "The date itself is neutral. Pressure is what makes verification feel impossible — for example, a ‘today only’ deadline.",
        distractors: ["Scarcity pressure", "Verified route"],
      },
      {
        id: "h7",
        label: "Contact: Anna M.",
        feedback: "A first name and initial can make a listing feel personal, but they do not verify who is really behind it.",
        mandatory: false,
        tactic: "Not enough evidence",
        correctFeedback: "Exactly. A name can make a message feel trustworthy without proving identity. Treat it as context, not evidence.",
        incorrectFeedback: "The name is not the strongest signal here. It is only a prompt to seek verification, while the route and requests reveal the real risk.",
        distractors: ["Verified route", "Brand impersonation"],
      }
    ],
    inspectionOrder: ["h2", "h1", "h5", "h6", "h7", "h3", "h4"],
    inspectInstruction: "Start at the top and follow each cue downward. Check the destination before you trust the form.",
    evidenceVerdict: "This route looks polished, but it takes you away from the accountable platform and asks for sensitive information too early.",
    evidenceList: [
      { cue: "URL/domain", evidence: "secure-viewing.example/r/ka?...", interpretation: "The link leaves the verified platform and hides behind a convincing name" },
      { cue: "Platform switch", evidence: "Continue to WhatsApp confirmation", interpretation: "The conversation leaves the platform’s record and protections" },
      { cue: "Data request", evidence: "Upload student ID before viewing", interpretation: "A sensitive document is requested before the room is even shown" }
    ],
    outcomeSafeTactic: "Brand impersonation + platform switching",
    outcomeUnsafeBody: "If you continued, you would hand over a student ID and move the conversation somewhere the original platform could not help you.",
    relevantChecklistKeys: ["destination", "channel", "data", "pressure"],
    checklistExamples: {
      destination: "‘secure-viewing.example’ sounded official, but it was a third-party destination.",
      channel: "The form tried to move the conversation to WhatsApp, away from the platform’s record.",
      data: "A student ID was requested before anyone had confirmed the viewing.",
      payment: "No payment was requested yet, but the data being collected could enable the next step of the fraud.",
      pressure: "‘3 viewing slots left’ made the external redirect feel too urgent to question."
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
      { label: "Full name", demoValue: "Alex Example" },
      { label: "Current address", demoValue: "Example Street 1" },
      { label: "Passport or ID photo", demoValue: "passport-example.jpg" },
      { label: "IBAN for identity confirmation", demoValue: "DE00 0000 0000 0000 0000 00" },
      { label: "Refundable holding deposit: €250", demoValue: "€250 confirmation" },
    ],
    formFooter: "The holding deposit is counted toward your first rent if selected.",
    hotspots: [
      {
        id: "h1",
        label: "2 slots left this week",
        feedback: "‘2 slots left’ may be true, but it is designed to make you hurry. Real urgency should make you verify faster, not skip verification altogether.",
        mandatory: true,
        tactic: "Scarcity pressure",
        correctFeedback: "You spotted the pressure. The badge turns a normal viewing request into a race, hoping you will stop asking questions.",
        incorrectFeedback: "This cue is about the countdown feeling created by the badge. The passport, IBAN, and deposit each tell a different part of the story.",
        distractors: ["Data overcollection", "Verified route"],
      },
      {
        id: "h2",
        label: "Passport or ID photo",
        feedback: "A passport or ID photo before a viewing creates identity risk, not just financial risk. There is no good reason to hand over that much before you meet anyone.",
        mandatory: true,
        tactic: "Data overcollection",
        correctFeedback: "That’s right. The form asks for a powerful identity document before it has proved the room or the landlord is real — classic data overcollection.",
        incorrectFeedback: "The issue is the information being requested, not the payment schedule. A passport before a viewing is too much personal data too early.",
        distractors: ["Safe payment timing", "Not enough evidence"],
      },
      {
        id: "h3",
        label: "Refundable holding deposit",
        feedback: "A deposit before a viewing or written contract puts your money at risk before you know what you are paying for. Calling it ‘refundable’ does not change the timing.",
        mandatory: true,
        tactic: "Advance payment",
        correctFeedback: "Exactly. Money is being requested before a viewing or contract. The word ‘refundable’ is reassurance; the timing is the warning.",
        incorrectFeedback: "The word ‘refundable’ is meant to calm you, but the real question is when the money leaves your account. Here, it leaves too soon.",
        distractors: ["Safe payment timing", "Verified route"],
      },
      {
        id: "h4",
        label: "IBAN for identity confirmation",
        feedback: "An IBAN is not needed to view a room. Asking for bank details now creates a financial-data risk before the listing, landlord, or contract has been verified.",
        mandatory: true,
        tactic: "Data overcollection",
        correctFeedback: "You caught it. Bank details are being used as ‘identity confirmation’ before there is any legitimate transaction — that is data overcollection.",
        incorrectFeedback: "This cue is about sensitive data, not payment timing. An IBAN should not be the price of getting a viewing.",
        distractors: ["Safe payment timing", "Verified route"],
      },
      {
        id: "h5",
        label: "Price €520 warm",
        feedback: "The price feels plausible for the area, which is mildly reassuring. But a believable number cannot vouch for the person or process behind it.",
        mandatory: false,
        tactic: "Not enough evidence",
        correctFeedback: "Good instinct. A plausible price is a small positive signal, not a safety certificate. Keep checking the route and the requests.",
        incorrectFeedback: "The price is neither the trap nor the proof. The meaningful warnings appear in what the form asks you to share and pay.",
        distractors: ["Advance payment", "Verified route"],
      },
      {
        id: "h6",
        label: "Availability: Next week",
        feedback: "Next week is soon enough to feel exciting, but the date itself is just information. The pressure comes from framing it as one of only ‘2 slots left’.",
        mandatory: false,
        tactic: "Not enough evidence",
        correctFeedback: "Right. The date is neutral; the scarcity badge is doing the rushing. Separating those two details helps you judge the page fairly.",
        incorrectFeedback: "A date alone does not pressure you. Look at the language around it — the ‘slots left’ message is where the urgency is manufactured.",
        distractors: ["Scarcity pressure", "Verified route"],
      },
      {
        id: "h7",
        label: "Contact: Lukas P.",
        feedback: "A friendly first name makes the listing feel human, but it still does not tell you who is accountable for the request.",
        mandatory: false,
        tactic: "Not enough evidence",
        correctFeedback: "Exactly. A first name is a detail, not verification. The safer question is what the platform can confirm about the person and the process.",
        incorrectFeedback: "The name is not where the risk is concentrated. It may build trust, but the early data and payment requests deserve your attention.",
        distractors: ["Brand impersonation", "Platform switching"],
      }
    ],
    inspectionOrder: ["h1", "h5", "h6", "h7", "h2", "h4", "h3"],
    inspectInstruction: "Read the form from top to bottom. Notice what it asks you to share or pay before a viewing.",
    evidenceVerdict: "The friendly presentation hides a risky process: sensitive data and a deposit are requested before you have seen the room.",
    evidenceList: [
      { cue: "Payment timing", evidence: "€250 before viewing", interpretation: "Money is requested before you can assess the room or sign a contract" },
      { cue: "Data request", evidence: "Passport + IBAN", interpretation: "Identity and bank details are collected before they are needed" },
      { cue: "Urgency/scarcity", evidence: "2 slots left this week", interpretation: "A countdown feeling makes skipping checks seem tempting" }
    ],
    outcomeSafeTactic: "Data overcollection + advance payment",
    outcomeUnsafeBody: "If you submitted the form, you would share a passport or ID, an IBAN, and a holding deposit before seeing the room.",
    relevantChecklistKeys: ["destination", "channel", "data", "payment", "pressure"],
    checklistExamples: {
      destination: "‘mieter-check.example’ looked like part of the process, but it was not the original housing board.",
      channel: "The conversation began on the platform, then the form took over before the viewing.",
      data: "The form asked for a passport, IBAN, and address before you had seen the room.",
      payment: "A €250 holding deposit was requested before a viewing or written contract.",
      pressure: "‘2 slots left this week’ made checking feel like a risk to your chance."
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
      { label: "Viewing: Thursday 17:00–19:00", demoValue: "Viewing requested" },
      { label: "Deposit: after contract", demoValue: "Understood" },
      { label: "Documents: not required before viewing", demoValue: "Understood" },
      { label: "Profile: active since 2021", demoValue: "Profile checked" },
    ],
    hotspots: [
      {
        id: "h1",
        label: "Verified listing route",
        feedback: "The route stays on the housing platform, where the listing and conversation remain visible. That gives you somewhere to go back to if a question comes up.",
        mandatory: true,
        tactic: "Verified route",
        correctFeedback: "That’s it. The URL stays on the platform, so there is an accountable trail instead of a mysterious handoff.",
        incorrectFeedback: "This one is a reassuring signal. Staying on the platform does not prove everything is perfect, but it gives you a safer place to verify.",
        distractors: ["Brand impersonation", "Platform switching"],
      },
      {
        id: "h2",
        label: "Deposit after contract",
        feedback: "The deposit comes after the viewing and written contract. You get to see what you are agreeing to before money changes hands.",
        mandatory: true,
        tactic: "Safe payment timing",
        correctFeedback: "Exactly. Payment comes after the viewing and contract. That order protects you from paying for a promise you have not checked.",
        incorrectFeedback: "The phrase ‘after contract’ is the important part. It puts verification and agreement before payment, which is the safer pattern.",
        distractors: ["Advance payment", "Scarcity pressure"],
      },
      {
        id: "h3",
        label: "No documents before viewing",
        feedback: "There is no request for documents before the viewing. The process lets you meet the situation first and handle paperwork when it is actually needed.",
        mandatory: true,
        tactic: "Verified route",
        correctFeedback: "Good catch. Nothing sensitive is being collected just to earn a viewing. That restraint is a meaningful sign of a normal process.",
        incorrectFeedback: "Here, the absence matters. No early document request is a positive signal; it means the process is not demanding trust before earning it.",
        distractors: ["Data overcollection", "Not enough evidence"],
      },
      {
        id: "h4",
        label: "Profile active since 2021",
        feedback: "An account active since 2021 is useful context, but age alone cannot tell you who is behind the listing or whether this offer is right for you.",
        mandatory: false,
        tactic: "Not enough evidence",
        correctFeedback: "That’s a balanced read. An older profile supports the story, but it is not proof on its own — keep the whole pattern in view.",
        incorrectFeedback: "Account age is only one piece of context. It neither creates the risk nor clears the listing by itself.",
        distractors: ["Verified route", "Brand impersonation"],
      },
      {
        id: "h5",
        label: "Price €610 warm",
        feedback: "The price fits the area, which feels more believable than an impossibly cheap offer. Still, a number cannot confirm who is behind the listing.",
        mandatory: false,
        tactic: "Not enough evidence",
        correctFeedback: "Good judgment. A plausible price is a small positive signal, not a guarantee. The route and timing make the stronger case here.",
        incorrectFeedback: "The price is neither a trap nor a guarantee. Treat it as one input, then weigh it against the process around it.",
        distractors: ["Safe payment timing", "Verified route"],
      },
      {
        id: "h6",
        label: "Availability: From 01.08.",
        feedback: "A date weeks away gives you room to verify, ask questions, and attend the viewing. That feels normal, though the date alone is not proof of anything.",
        mandatory: false,
        tactic: "Not enough evidence",
        correctFeedback: "Exactly. A relaxed timeline gives you space to check the details. It is a helpful signal, not a guarantee.",
        incorrectFeedback: "The date itself is neutral. What helps here is that nobody is using it to rush you or punish a careful question.",
        distractors: ["Verified route", "Scarcity pressure"],
      },
      {
        id: "h7",
        label: "Contact: Jonas K.",
        feedback: "A first name and initial tell you who the listing claims to be from, not whether that identity is verified. Pair it with the platform trail.",
        mandatory: false,
        tactic: "Not enough evidence",
        correctFeedback: "You’re reading it carefully. The name is not proof, but together with the active platform profile it becomes useful supporting context.",
        incorrectFeedback: "A name on its own cannot confirm anything. Look for the surrounding evidence — especially the platform history and the normal payment process.",
        distractors: ["Verified route", "Brand impersonation"],
      }
    ],
    inspectionOrder: ["h1", "h5", "h6", "h7", "h2", "h3", "h4"],
    inspectInstruction: "Follow the page from top to bottom. Look for the details that make the process verifiable, not just polished.",
    evidenceVerdict: "This offer is not safe because it looks tidy. It is safer because the route, timing, and requests leave room for you to verify before committing.",
    evidenceList: [
      { cue: "Route", evidence: "housing-board.example/listing/...", interpretation: "The conversation stays on a route with an accountable platform trail" },
      { cue: "Payment timing", evidence: "Deposit after contract", interpretation: "You can view and agree to the terms before paying" },
      { cue: "Data request", evidence: "No documents before viewing", interpretation: "Nothing sensitive is collected before it is needed" },
      { cue: "Urgency", evidence: "Viewing Thursday", interpretation: "There is time to verify instead of pressure to act immediately" }
    ],
    relevantChecklistKeys: ["destination", "channel", "data", "payment", "pressure"],
    checklistExamples: {
      destination: "The link stayed on ‘housing-board.example’, the same platform where the listing began.",
      channel: "The conversation stayed on the platform; nobody asked you to disappear into WhatsApp.",
      data: "No documents were requested just to earn a viewing.",
      payment: "The deposit appeared only after the viewing and written contract.",
      pressure: "The viewing was scheduled normally, with no ‘today only’ countdown."
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
    copy: "Before you trust the promise, where does the link actually take you?",
    detail: "Read the domain in the URL bar before you follow the next step. Look-alike names and ‘secure-…’ redirects can make an outside page feel official.",
  },
  {
    key: "channel",
    title: "Channel",
    copy: "Are they asking you to leave the place where the conversation started?",
    detail: "A move to WhatsApp, Telegram, or a private form can remove the platform’s record and support. Keep the conversation where there is an accountable trail.",
  },
  {
    key: "data",
    title: "Data",
    copy: "What are they asking you to share before you have seen the room?",
    detail: "Passports, IBANs, and student IDs belong to a genuine contract step, not a casual viewing request. The timing tells you whether the request makes sense.",
  },
  {
    key: "payment",
    title: "Payment",
    copy: "When do they expect your money, and what happens before then?",
    detail: "A fee is not automatically a scam, but paying before a viewing or written contract puts you at a disadvantage. Check the terms in writing and keep payment last.",
  },
  {
    key: "pressure",
    title: "Pressure",
    copy: "Is the offer giving you time to think, or trying to make you panic?",
    detail: "Real urgency can coexist with verification. If one careful question makes the offer disappear, the pressure is part of the tactic.",
  },
];
