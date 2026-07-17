export type TacticTag =
  | "Data overcollection"
  | "Advance payment"
  | "Platform switching"
  | "Brand impersonation"
  | "Scarcity pressure"
  | "Safe payment timing"
  | "It’s expected"
  | "Not enough evidence";

export type AnswerChoice = TacticTag;

export interface AnswerOption {
  value: AnswerChoice;
  label: string;
  correct: boolean;
}

export type HotspotIcon = "route" | "channel" | "data" | "payment" | "timing" | "neutral";

export const ALL_TACTICS: TacticTag[] = [
  "Data overcollection",
  "Advance payment",
  "Platform switching",
  "Brand impersonation",
  "Scarcity pressure",
  "Safe payment timing",
  "It’s expected",
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
  technique?: TacticTag;
  // Kept optional for compatibility with the original question copy. The UI
  // now uses correctFeedback/incorrectFeedback for all tactic choices.
  choiceFeedback?: Record<string, string>;
  outcomeHint?: string;
  icon?: HotspotIcon;
}

export interface Evidence {
  label: string;
  evidence: string;
  interpretation: string;
}

export type ListingFactIcon = "location" | "home" | "calendar" | "viewing" | "payment";

export interface ListingFact {
  icon: ListingFactIcon;
  text: string;
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
  cardFacts: ListingFact[];
  description: string;
  details: Record<string, string>;
  cta: string;
  formTitle: string;
  originalUrl: string;
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
}

const rawAds: Ad[] = [
  {
    id: "A",
    type: "Scam",
    mainLesson: "Brand impersonation + redirect + platform switching",
    visualStrategy: "professional",
    image: "https://images.unsplash.com/photo-1702014862053-946a122b920d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzdHVkaW8lMjBhcGFydG1lbnQlMjBjbGVhbiUyMGJyaWdodHxlbnwxfHx8fDE3ODA1OTI5MzF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    title: "Studio near campus",
    price: "€430 warm",
    features: ["4 min to Mensa", "Viewing slots available today", "Reserve through secure booking"],
    cardFacts: [
      { icon: "location", text: "Near central campus" },
      { icon: "calendar", text: "Available immediately" },
      { icon: "viewing", text: "Viewing slots today" },
    ],
    description: "Bright furnished studio, 4 min walk to Mensa. All utilities included. Suitable for exchange students.\n\nBecause I receive too many messages here, viewing requests are handled through the secure reservation page. You can select a viewing slot after confirming your student status.",
    details: {
      "Price": "€430 warm",
      "Location": "Near central campus",
      "Availability": "Immediately",
      "Contact": "Anna M."
    },
    cta: "Open offer",
    formTitle: "Student Viewing Reservation",
    originalUrl: "www.immobilien-scout24.de/expose/studio-near-campus-24891",
    formUrl: "www.imobilien-scout24.de/expose/studio-near-campus-24891",
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
        id: "h2",
        label: "www.imobilien-scout24.de/expose/studio-near-campus-24891",
        feedback: "Compare this current address with the original URL shown below. The form uses a look-alike domain with one letter missing.",
        mandatory: true,
        tactic: "Brand impersonation",
        correctFeedback: "Correct. The form URL is `imobilien-scout24.de`; it drops one `m` from the original `immobilien-scout24.de`. That look-alike domain is the warning.",
        incorrectFeedback: "It’s easy to skim this as a normal URL. Compare it letter by letter: the form drops an `m`, so it is not the same site.",
        choiceFeedback: {
          "scam-hint": "Yes. The form URL is missing one ‘m’ from the listing URL. That small difference can send you to a copycat site.",
          "no-scam-hint": "Not this time. The missing ‘m’ matters here: the form is not using the same domain as the listing.",
        },
        distractors: ["Scarcity pressure", "Advance payment"],
      },
      {
        id: "h3",
        label: "Upload student ID before viewing",
        feedback: "Student status can be checked later. Before you have even seen the room, uploading an ID gives away sensitive information without a clear need.",
        mandatory: true,
        tactic: "Data overcollection",
        correctFeedback: "Correct. `Upload student ID` asks for identity data before a viewing. That is data overcollection.",
        incorrectFeedback: "The problem is not that a student ID can never be requested. It’s that this happens before you have seen the room.",
        choiceFeedback: {
          "scam-hint": "Yes. You are being asked for an ID before you have seen the room. That is too much personal information too early.",
          "no-scam-hint": "Not quite. An ID request could be normal later, but before a viewing it is an important warning.",
        },
        distractors: ["Not enough evidence", "Safe payment timing"],
      },
      {
        id: "h4",
        label: "Continue to WhatsApp confirmation",
        feedback: "WhatsApp may feel convenient, but it takes the conversation out of the platform’s record and support. That makes it harder to retrace what was promised.",
        mandatory: true,
        tactic: "Platform switching",
        correctFeedback: "Correct. `Continue to WhatsApp` moves the conversation off the platform and removes its record.",
        incorrectFeedback: "WhatsApp itself is not the problem. Moving there removes the platform’s record, so it is harder to get help or prove what was promised.",
        choiceFeedback: {
          "scam-hint": "Yes. The conversation is being moved to WhatsApp, where the housing platform cannot keep the record or help as easily.",
          "no-scam-hint": "Not quite. WhatsApp is common, but here the move away from the platform makes the process harder to check.",
        },
        distractors: ["Data overcollection", "Safe payment timing"],
      },
      {
        id: "h7",
        label: "Contact: Anna M.",
        feedback: "A first name and initial can make a listing feel personal, but they do not verify who is really behind it.",
        mandatory: false,
        tactic: "Not enough evidence",
        correctFeedback: "Correct. `Anna M.` is only a name; it does not verify the person.",
        incorrectFeedback: "A name makes the listing feel personal, but anyone can type a name. It does not verify the person.",
        choiceFeedback: {
          "scam-hint": "Not on its own. A name and initial are easy to provide; they do not show who is really behind the listing.",
          "no-scam-hint": "Yes. It is normal for a listing to show a name. By itself, it gives no reason for suspicion.",
        },
        distractors: ["Platform switching", "Brand impersonation"],
      }
    ],
    inspectionOrder: ["h2", "h7", "h3", "h4"],
    inspectInstruction: "Start at the top and follow each highlighted detail. Check the destination before you trust the form.",
    evidenceVerdict: "This route looks polished, but it takes you away from the accountable platform and asks for sensitive information too early.",
    evidenceList: [
      { label: "URL/domain", evidence: "www.imobilien-scout24.de/expose/...", interpretation: "The link uses a look-alike domain instead of the original housing platform" },
      { label: "Platform switch", evidence: "Continue to WhatsApp confirmation", interpretation: "The conversation leaves the platform’s record and protections" },
      { label: "Data request", evidence: "Upload student ID before viewing", interpretation: "A sensitive document is requested before the room is even shown" }
    ],
    outcomeSafeTactic: "Brand impersonation + platform switching",
    outcomeUnsafeBody: "If you continued, you would hand over a student ID and move the conversation somewhere the original platform could not help you.",
    relevantChecklistKeys: ["destination", "channel", "data", "pressure"],
  },
  {
    id: "B",
    type: "Scam",
    mainLesson: "Urgency + data overcollection + advance payment",
    visualStrategy: "friendly",
    image: "https://images.unsplash.com/photo-1564273795917-fe399b763988?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwc3R1ZGVudCUyMHJvb20lMjB5ZWxsb3clMjBsaWdodHxlbnwxfHx8fDE3ODA1OTI5MzF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    title: "WG room in Südstadt",
    price: "€520 warm",
    features: ["Südstadt · 14 min by bike to campus", "Pre-check required before viewing", "2 slots left this week"],
    cardFacts: [
      { icon: "location", text: "Südstadt · 14 min by bike to campus" },
      { icon: "home", text: "3-person shared flat" },
      { icon: "calendar", text: "Available next week" },
    ],
    description: "Room in friendly 3-person WG. 14 min by bike to campus. We are choosing someone quickly because the room is available next week.\n\nTo avoid no-shows, please complete the tenant pre-check before viewing. After the pre-check, I will send the exact address and viewing time.",
    details: {
      "Price": "€520 warm",
      "Location": "Südstadt",
      "Availability": "Next week",
      "Contact": "Lukas P.",
      "Viewing": "After tenant pre-check"
    },
    cta: "Open offer",
    formTitle: "Tenant Pre-Check",
    originalUrl: "www.immobilien-scout24.de/expose/wg-suedstadt-1184",
    formUrl: "www.immobilien-scout24.de/secure-check/wg-suedstadt-1184?re=https%3A%2F%2Fimmobilien-check24.de%2Fstart%3Fflat%3DWG1184",
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
        correctFeedback: "Correct. `2 slots left this week` creates scarcity pressure and makes you rush.",
        incorrectFeedback: "The number may be real, but ‘2 slots left’ is meant to make you act before checking. The warning is the rush, not the payment or document.",
        choiceFeedback: {
          "scam-hint": "Yes. ‘2 slots left’ is designed to make you hurry. You should still have time to check the listing before deciding.",
          "no-scam-hint": "Not quite. The number may be true, but the countdown is still pushing you to act before you check.",
        },
        distractors: ["Data overcollection", "It’s expected"],
      },
      {
        id: "h2",
        label: "Passport or ID photo",
        feedback: "A passport or ID photo before a viewing creates identity risk, not just financial risk. There is no good reason to hand over that much before you meet anyone.",
        mandatory: true,
        tactic: "Data overcollection",
        correctFeedback: "Correct. A passport or ID photo is sensitive data requested before a viewing.",
        incorrectFeedback: "The issue is not the photo format. It is asking for a passport or ID before you have even viewed the room.",
        choiceFeedback: {
          "scam-hint": "Yes. A passport or ID photo is sensitive information, and it is being requested before you have seen the room.",
          "no-scam-hint": "Not quite. The request is too early. Identity documents may be needed later, but not just to arrange a viewing.",
        },
        distractors: ["Safe payment timing", "Not enough evidence"],
      },
      {
        id: "h3",
        label: "Refundable holding deposit: €250",
        feedback: "A deposit before a viewing or signed contract puts your money at risk before you know what you are paying for. Calling it ‘refundable’ does not change the timing.",
        mandatory: true,
        tactic: "Advance payment",
        correctFeedback: "Correct. €250 is requested before a viewing or contract. That is advance payment.",
        incorrectFeedback: "‘Refundable’ does not change when you pay. The problem is sending €250 before a viewing or signed contract.",
        choiceFeedback: {
          "scam-hint": "Yes. The €250 is due before a viewing or signed contract. Calling it refundable does not remove the risk of paying first.",
          "no-scam-hint": "Not quite. The important part is the timing: you are being asked to pay before you know what you are agreeing to.",
        },
        distractors: ["Safe payment timing", "Data overcollection"],
      },
      {
        id: "h4",
        label: "IBAN for identity confirmation",
        feedback: "An IBAN is not needed to view a room. Asking for bank details now creates a financial-data risk before the listing, landlord, or contract has been verified.",
        mandatory: true,
        tactic: "Data overcollection",
        correctFeedback: "Correct. An IBAN is bank data requested before a legitimate transaction.",
        incorrectFeedback: "An IBAN is bank information, not something needed to arrange a viewing. Asking for it now is the risk.",
        choiceFeedback: {
          "scam-hint": "Yes. An IBAN is bank information, and there is no reason to need it just to arrange a viewing.",
          "no-scam-hint": "Not quite. This is not a normal viewing detail. Asking for bank information before the listing is checked is a warning.",
        },
        distractors: ["Scarcity pressure", "Not enough evidence"],
      },
      {
        id: "h5",
        label: "Price €520 warm",
        feedback: "The price feels plausible for the area, which is mildly reassuring. But a believable number cannot vouch for the person or process behind it.",
        mandatory: false,
        tactic: "Not enough evidence",
        correctFeedback: "Correct. €520 is plausible, but price cannot verify the listing.",
        incorrectFeedback: "A plausible rent is reassuring only in a small way. It cannot confirm the listing or landlord.",
        choiceFeedback: {
          "scam-hint": "Not on its own. €520 may look plausible, but a believable price does not confirm the person or process behind it.",
          "no-scam-hint": "Yes. The price looks plausible, but it is still only a price. It gives no reason for suspicion by itself.",
        },
        distractors: ["Advance payment", "Platform switching"],
      },
      {
        id: "h8",
        label: "www.immobilien-scout24.de/secure-check/wg-suedstadt-1184?re=https%3A%2F%2Fimmobilien-check24.de%2Fstart%3Fflat%3DWG1184",
        feedback: "Compare this current address with the original URL shown below. The form uses a secure-check path with a redirect parameter to another domain.",
        mandatory: true,
        tactic: "Brand impersonation",
        correctFeedback: "Correct. The URL contains `re=` followed by another domain, `immobilien-check24.de`; that parameter can send you off the housing platform.",
        incorrectFeedback: "The address begins with the familiar platform, but `re=` points somewhere else. That redirect is the detail to notice.",
        choiceFeedback: {
          "scam-hint": "Yes. The `re=` part points to another domain, even though the beginning looks familiar. Stop and check where it leads.",
          "no-scam-hint": "Not quite. The beginning looks familiar, but the redirect still sends you toward another domain. That matters.",
        },
        distractors: ["Scarcity pressure", "Advance payment"],
      }
    ],
    inspectionOrder: ["h8", "h1", "h5", "h2", "h4", "h3"],
    inspectInstruction: "Read the form from top to bottom. Notice what it asks you to share or pay before a viewing.",
    evidenceVerdict: "The friendly presentation hides a risky process: sensitive data and a deposit are requested before you have seen the room.",
    evidenceList: [
      { label: "Payment timing", evidence: "€250 before viewing", interpretation: "Money is requested before you can assess the room or sign a contract" },
      { label: "Data request", evidence: "Passport + IBAN", interpretation: "Identity and bank details are collected before they are needed" },
      { label: "Urgency/scarcity", evidence: "2 slots left this week", interpretation: "A countdown feeling makes skipping checks seem tempting" }
    ],
    outcomeSafeTactic: "Data overcollection + advance payment",
    outcomeUnsafeBody: "If you submitted the form, you would share a passport or ID, an IBAN, and a holding deposit before seeing the room.",
    relevantChecklistKeys: ["destination", "channel", "data", "payment", "pressure"],
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
    cardFacts: [
      { icon: "location", text: "Südstadt · 14 min by bike to campus" },
      { icon: "home", text: "4-person shared flat" },
      { icon: "calendar", text: "Viewing Thursday · 17:00–19:00" },
      { icon: "payment", text: "Deposit after signed contract" },
    ],
    description: "Room in shared flat available from 01.08.\nViewing Thursday 17:00–19:00.\n\nPlease reply through the expected listing route.\nNo documents needed before viewing.\nDeposit only after viewing and signed contract.",
    details: {
      "Price": "€610 warm",
      "Location": "Südstadt, 14 min by bike to campus",
      "Availability": "From 01.08.",
      "Contact": "Jonas K.",
      "Platform profile": "Active since 2021"
    },
    cta: "Open offer",
    formTitle: "It’s expected",
    originalUrl: "www.immobilien-scout24.de/expose/wg-room-suedstadt-610",
    formUrl: "www.immobilien-scout24.de/expose/wg-room-suedstadt-610",
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
        label: "www.immobilien-scout24.de/expose/wg-room-suedstadt-610",
        feedback: "The route stays on the housing platform, where the listing and conversation remain visible. That gives you somewhere to go back to if a question comes up.",
        mandatory: true,
        tactic: "Not enough evidence",
        correctFeedback: "Correct. Staying on the same platform is reassuring, but this detail alone is not enough evidence that the listing is genuine.",
        incorrectFeedback: "This one stays on the same platform as the listing. That is reassuring, though it is not proof by itself.",
        choiceFeedback: {
          "scam-hint": "Not here. The address stays on the same platform as the listing, so the route itself gives no reason for suspicion.",
          "no-scam-hint": "Yes. Staying on the same platform is the expected route. It keeps the conversation visible and easy to revisit.",
        },
        distractors: ["Brand impersonation", "Platform switching"],
      },
      {
        id: "h2",
        label: "Deposit: after contract",
        feedback: "The deposit comes after the viewing and signed contract. You get to see what you are agreeing to before money changes hands.",
        mandatory: true,
        tactic: "Safe payment timing",
        correctFeedback: "Correct. `After contract` puts viewing and agreement before payment.",
        incorrectFeedback: "The important detail is when the deposit is due: after viewing and signing, not before. That timing is expected.",
        choiceFeedback: {
          "scam-hint": "Not here. The deposit comes after the viewing and signed contract, so you can see what you are agreeing to first.",
          "no-scam-hint": "Yes. Paying after the viewing and signed contract is a normal order of events.",
        },
        distractors: ["Advance payment", "Scarcity pressure"],
      },
      {
        id: "h3",
        label: "Documents: not required before viewing",
        feedback: "There is no request for documents before the viewing. The process lets you meet the situation first and handle paperwork when it is actually needed.",
        mandatory: true,
        tactic: "Not enough evidence",
        correctFeedback: "Correct. No documents are requested before viewing, but this detail alone is not enough evidence that the listing is genuine.",
        incorrectFeedback: "There is no early document request here. You can view the room before sharing sensitive paperwork.",
        choiceFeedback: {
          "scam-hint": "Not here. No documents are requested before the viewing. You can meet the situation before sharing sensitive information.",
          "no-scam-hint": "Yes. Not asking for documents before a viewing is the expected approach.",
        },
        distractors: ["Data overcollection", "Advance payment"],
      },
      {
        id: "h4",
        label: "Profile: active since 2021",
        feedback: "An account active since 2021 is useful context, but age alone cannot tell you who is behind the listing or whether this offer is right for you.",
        mandatory: false,
        tactic: "Not enough evidence",
        correctFeedback: "Correct. An account active since 2021 is supporting context, not proof.",
        incorrectFeedback: "An older profile can be useful context, but it does not prove the listing is genuine. Treat it as background, not a warning.",
        choiceFeedback: {
          "scam-hint": "Not on its own. An older profile can be reassuring, but it does not prove the listing is genuine.",
          "no-scam-hint": "Yes. Profile age is just background information. It gives no reason for suspicion by itself.",
        },
        distractors: ["Platform switching", "Brand impersonation"],
      },
    ],
    inspectionOrder: ["h1", "h4", "h2", "h3"],
    inspectInstruction: "Follow the page from top to bottom. Look for the details that make the process verifiable, not just polished.",
    evidenceVerdict: "This offer is not safe because it looks tidy. It is safer because the route, timing, and requests leave room for you to verify before committing.",
    evidenceList: [
      { label: "Route", evidence: "www.immobilien-scout24.de/expose/...", interpretation: "The conversation stays on the original housing platform" },
      { label: "Payment timing", evidence: "Deposit after contract", interpretation: "You can view and agree to the terms before paying" },
      { label: "Data request", evidence: "No documents before viewing", interpretation: "Nothing sensitive is collected before it is needed" },
      { label: "Urgency", evidence: "Viewing Thursday", interpretation: "There is time to verify instead of pressure to act immediately" }
    ],
    relevantChecklistKeys: ["destination", "channel", "data", "payment", "pressure"],
  }
];

const SCAM_TECHNIQUES: TacticTag[] = [
  "Data overcollection",
  "Advance payment",
  "Platform switching",
  "Brand impersonation",
  "Scarcity pressure",
];

const firstSentence = (text: string) => `${text.split(/[.!?]/)[0].trim()}.`;

const expectedChoiceFromTactic = (tactic: TacticTag): AnswerChoice => tactic;

const normalizeDistractors = (
  correctChoice: AnswerChoice,
  distractors: [TacticTag, TacticTag]
): [TacticTag, TacticTag] => {
  const uniqueDistractors = [...new Set(distractors)].filter((choice) => choice !== correctChoice);

  if (correctChoice === "Not enough evidence") {
    if (uniqueDistractors.length < 2) {
      throw new Error(`Question with ${correctChoice} must have two unique distractors`);
    }

    return [uniqueDistractors[0], uniqueDistractors[1]];
  }

  const otherDistractor = uniqueDistractors.find((choice) => choice !== "Not enough evidence");
  if (!otherDistractor) {
    throw new Error(`Question with ${correctChoice} must have a non-evidence distractor`);
  }

  return ["Not enough evidence", otherDistractor];
};

const validateQuestion = (hotspot: Hotspot) => {
  const choices = [hotspot.tactic, ...hotspot.distractors];
  const uniqueChoices = new Set(choices);

  if (choices.length !== 3 || uniqueChoices.size !== 3) {
    throw new Error(`Question ${hotspot.id} must have exactly three unique options`);
  }

  if (choices.filter((choice) => choice === hotspot.tactic).length !== 1) {
    throw new Error(`Question ${hotspot.id} must have exactly one correct option`);
  }

  if (!uniqueChoices.has("Not enough evidence")) {
    throw new Error(`Question ${hotspot.id} must include Not enough evidence`);
  }
};

const iconFromTactic = (tactic: TacticTag): HotspotIcon => {
  if (tactic === "Brand impersonation" || tactic === "It’s expected") return "route";
  if (tactic === "Platform switching") return "channel";
  if (tactic === "Data overcollection") return "data";
  if (tactic === "Advance payment" || tactic === "Safe payment timing") return "payment";
  if (tactic === "Scarcity pressure") return "timing";
  return "neutral";
};

export const ads: Ad[] = rawAds.map((ad) => ({
  ...ad,
  hotspots: ad.hotspots.map((hotspot) => {
    const expectedChoice = expectedChoiceFromTactic(hotspot.tactic);
    const normalizedDistractors = normalizeDistractors(expectedChoice, hotspot.distractors);
    const outcomeHint = hotspot.outcomeHint ?? firstSentence(hotspot.feedback);
    const choiceFeedback = hotspot.choiceFeedback;

    const normalizedHotspot: Hotspot = {
      ...hotspot,
      distractors: normalizedDistractors,
      technique: SCAM_TECHNIQUES.includes(hotspot.tactic) ? hotspot.tactic : undefined,
      outcomeHint,
      icon: hotspot.icon ?? iconFromTactic(hotspot.tactic),
      choiceFeedback,
    };

    validateQuestion(normalizedHotspot);
    return normalizedHotspot;
  }),
}));

export function getExpectedChoice(hotspot: Hotspot): AnswerChoice {
  return hotspot.tactic;
}

const createSeededRandom = (seedText: string) => {
  let seed = 0;

  for (let index = 0; index < seedText.length; index += 1) {
    seed = (Math.imul(seed, 31) + seedText.charCodeAt(index)) >>> 0;
  }

  return () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
};

const shuffleOptions = <T,>(items: T[], seedText: string): T[] => {
  const shuffled = [...items];
  const random = createSeededRandom(seedText);

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled;
};

export function getAnswerOptions(hotspot: Hotspot): [AnswerOption, AnswerOption, AnswerOption] {
  const correctChoice = getExpectedChoice(hotspot);
  // Keep the order stable for this detail while preventing position from being a clue.
  const choices = shuffleOptions([...hotspot.distractors, correctChoice], hotspot.label);

  return choices.map((value) => ({
    value,
    label: value,
    correct: value === correctChoice,
  })) as [AnswerOption, AnswerOption, AnswerOption];
}

export interface ChecklistItem {
  key: ChecklistKey;
  title: string;
  copy: string;
  detail: string;
  takeaway: string;
}

export const checklist: ChecklistItem[] = [
  {
    key: "destination",
    title: "Destination",
    copy: "Before you trust the promise, where does the link actually take you?",
    detail: "Read the domain in the URL bar before you follow the next step. Look-alike names and ‘secure-…’ redirects can make an outside page feel official.",
    takeaway: "Check the domain.",
  },
  {
    key: "channel",
    title: "Channel",
    copy: "Are they asking you to leave the place where the conversation started?",
    detail: "A move to WhatsApp, Telegram, or a private form can remove the platform’s record and support. Keep the conversation where there is an accountable trail.",
    takeaway: "Stay where the conversation started.",
  },
  {
    key: "data",
    title: "Data",
    copy: "What are they asking you to share before you have seen the room?",
    detail: "Passports, IBANs, and student IDs belong to a genuine contract step, not a casual viewing request. The timing tells you whether the request makes sense.",
    takeaway: "No ID, passport, or IBAN before a viewing.",
  },
  {
    key: "payment",
    title: "Payment",
    copy: "When do they expect your money, and what happens before then?",
    detail: "A fee is not automatically a scam, but paying before a viewing or signed contract puts you at a disadvantage. Check the terms in writing and keep payment last.",
    takeaway: "View and sign before you pay.",
  },
  {
    key: "pressure",
    title: "Pressure",
    copy: "Is the offer giving you time to think, or trying to make you panic?",
    detail: "Real urgency can coexist with verification. If one careful question makes the offer disappear, the pressure is part of the tactic.",
    takeaway: "Slow down when they rush you.",
  },
];
