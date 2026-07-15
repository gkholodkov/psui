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
    originalUrl: "www.immobilien-scout23.de/expose/studio-near-campus-24891",
    formUrl: "www.imobilien-scout23.de/expose/studio-near-campus-24891",
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
        label: "www.imobilien-scout23.de/expose/studio-near-campus-24891",
        feedback: "Compare this current address with the original URL shown below. The form uses a look-alike domain with one letter missing.",
        mandatory: true,
        tactic: "Brand impersonation",
        correctFeedback: "Correct. The form URL is `imobilien-scout23.de`; it drops one `m` from the original `immobilien-scout23.de`. That look-alike domain is the warning.",
        incorrectFeedback: "Check the domain spelling: `imobilien-scout23.de` is not the original `immobilien-scout23.de`. The missing `m` points to brand impersonation.",
        distractors: ["Scarcity pressure", "Advance payment"],
      },
      {
        id: "h3",
        label: "Upload student ID before viewing",
        feedback: "Student status can be checked later. Before you have even seen the room, uploading an ID gives away sensitive information without a clear need.",
        mandatory: true,
        tactic: "Data overcollection",
        correctFeedback: "Correct. `Upload student ID` asks for identity data before a viewing. That is data overcollection.",
        incorrectFeedback: "The key issue is the early ID upload: it requests sensitive identity data before a viewing.",
        distractors: ["Verified route", "Not enough evidence"],
      },
      {
        id: "h4",
        label: "Continue to WhatsApp confirmation",
        feedback: "WhatsApp may feel convenient, but it takes the conversation out of the platform’s record and support. That makes it harder to retrace what was promised.",
        mandatory: true,
        tactic: "Platform switching",
        correctFeedback: "Correct. `Continue to WhatsApp` moves the conversation off the platform and removes its record.",
        incorrectFeedback: "Focus on the channel: WhatsApp takes the conversation away from the housing platform.",
        distractors: ["Data overcollection", "Safe payment timing"],
      },
      {
        id: "h5",
        label: "Price €430 warm",
        feedback: "€430 near campus may make you look twice, but price alone cannot tell you whether an offer is genuine. It is a reason to look closer, not a verdict.",
        mandatory: false,
        tactic: "Not enough evidence",
        correctFeedback: "Correct. €430 is only a price signal; it does not prove a scam.",
        incorrectFeedback: "Price alone is not the warning. Check the URL, ID request, and WhatsApp handoff.",
        distractors: ["Advance payment", "Scarcity pressure"],
      },
      {
        id: "h6",
        label: "Availability: Immediately",
        feedback: "‘Immediately’ creates a sense of speed, but a move-in date is not the same as pressure. Look for language that punishes you for taking time to verify.",
        mandatory: false,
        tactic: "Not enough evidence",
        correctFeedback: "Correct. `Immediately` describes availability; it does not create pressure by itself.",
        incorrectFeedback: "The date is neutral. Pressure would be a deadline or a threat to remove the offer.",
        distractors: ["Scarcity pressure", "Advance payment"],
      },
      {
        id: "h7",
        label: "Contact: Anna M.",
        feedback: "A first name and initial can make a listing feel personal, but they do not verify who is really behind it.",
        mandatory: false,
        tactic: "Not enough evidence",
        correctFeedback: "Correct. `Anna M.` is only a name; it does not verify the person.",
        incorrectFeedback: "A name is not proof of identity. The stronger evidence is the URL and the requests.",
        distractors: ["Platform switching", "Brand impersonation"],
      }
    ],
    inspectionOrder: ["h2", "h5", "h6", "h7", "h3", "h4"],
    inspectInstruction: "Start at the top and follow each highlighted detail. Check the destination before you trust the form.",
    evidenceVerdict: "This route looks polished, but it takes you away from the accountable platform and asks for sensitive information too early.",
    evidenceList: [
      { label: "URL/domain", evidence: "www.imobilien-scout23.de/expose/...", interpretation: "The link uses a look-alike domain instead of the original housing platform" },
      { label: "Platform switch", evidence: "Continue to WhatsApp confirmation", interpretation: "The conversation leaves the platform’s record and protections" },
      { label: "Data request", evidence: "Upload student ID before viewing", interpretation: "A sensitive document is requested before the room is even shown" }
    ],
    outcomeSafeTactic: "Brand impersonation + platform switching",
    outcomeUnsafeBody: "If you continued, you would hand over a student ID and move the conversation somewhere the original platform could not help you.",
    relevantChecklistKeys: ["destination", "channel", "data", "pressure"],
    checklistExamples: {
      destination: "‘imobilien-scout23.de’ looked like the original platform, but one letter was missing from the domain.",
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
    originalUrl: "www.immobilien-scout23.de/expose/wg-suedstadt-1184",
    formUrl: "www.immobilien-scout23.de/secure-check/wg-suedstadt-1184?re=https%3A%2F%2Fimmobilien-check23.de%2Fstart%3Fflat%3DWG1184",
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
        incorrectFeedback: "The important part is the `2 slots left` message: it creates a countdown, not a data or payment risk.",
        distractors: ["Data overcollection", "Verified route"],
      },
      {
        id: "h2",
        label: "Passport or ID photo",
        feedback: "A passport or ID photo before a viewing creates identity risk, not just financial risk. There is no good reason to hand over that much before you meet anyone.",
        mandatory: true,
        tactic: "Data overcollection",
        correctFeedback: "Correct. A passport or ID photo is sensitive data requested before a viewing.",
        incorrectFeedback: "Focus on the document request: a passport or ID is data overcollection, not a payment issue.",
        distractors: ["Safe payment timing", "Not enough evidence"],
      },
      {
        id: "h3",
        label: "Refundable holding deposit: €250",
        feedback: "A deposit before a viewing or written contract puts your money at risk before you know what you are paying for. Calling it ‘refundable’ does not change the timing.",
        mandatory: true,
        tactic: "Advance payment",
        correctFeedback: "Correct. €250 is requested before a viewing or contract. That is advance payment.",
        incorrectFeedback: "Focus on when the €250 leaves your account: `refundable` does not make early payment safe.",
        distractors: ["Safe payment timing", "Verified route"],
      },
      {
        id: "h4",
        label: "IBAN for identity confirmation",
        feedback: "An IBAN is not needed to view a room. Asking for bank details now creates a financial-data risk before the listing, landlord, or contract has been verified.",
        mandatory: true,
        tactic: "Data overcollection",
        correctFeedback: "Correct. An IBAN is bank data requested before a legitimate transaction.",
        incorrectFeedback: "The issue is the IBAN request: it collects bank data before it is needed.",
        distractors: ["Safe payment timing", "Verified route"],
      },
      {
        id: "h5",
        label: "Price €520 warm",
        feedback: "The price feels plausible for the area, which is mildly reassuring. But a believable number cannot vouch for the person or process behind it.",
        mandatory: false,
        tactic: "Not enough evidence",
        correctFeedback: "Correct. €520 is plausible, but price cannot verify the listing.",
        incorrectFeedback: "Price is not the warning here. The risks are the early data, payment, and pressure.",
        distractors: ["Advance payment", "Platform switching"],
      },
      {
        id: "h6",
        label: "Availability: Next week",
        feedback: "Next week is soon enough to feel exciting, but the date itself is just information. The pressure comes from framing it as one of only ‘2 slots left’.",
        mandatory: false,
        tactic: "Not enough evidence",
        correctFeedback: "Correct. `Next week` is a date; the pressure comes from `2 slots left`.",
        incorrectFeedback: "The date is neutral. The scarcity badge—not `next week`—creates the pressure.",
        distractors: ["Scarcity pressure", "Platform switching"],
      },
      {
        id: "h7",
        label: "Contact: Lukas P.",
        feedback: "A friendly first name makes the listing feel human, but it still does not tell you who is accountable for the request.",
        mandatory: false,
        tactic: "Not enough evidence",
        correctFeedback: "Correct. `Lukas P.` is a name, not identity verification.",
        incorrectFeedback: "The name does not verify the person. Focus on what the form asks for and when.",
        distractors: ["Brand impersonation", "Platform switching"],
      },
      {
        id: "h8",
        label: "www.immobilien-scout23.de/secure-check/wg-suedstadt-1184?re=https%3A%2F%2Fimmobilien-check23.de%2Fstart%3Fflat%3DWG1184",
        feedback: "Compare this current address with the original URL shown below. The form uses a secure-check path with a redirect parameter to another domain.",
        mandatory: true,
        tactic: "Brand impersonation",
        correctFeedback: "Correct. The URL contains `re=` followed by another domain, `immobilien-check23.de`; that parameter can send you off the housing platform.",
        incorrectFeedback: "Look at the `re=` parameter: it points to `immobilien-check23.de`, so this address can redirect you away from the housing platform.",
        distractors: ["Scarcity pressure", "Advance payment"],
      }
    ],
    inspectionOrder: ["h8", "h1", "h5", "h6", "h7", "h2", "h4", "h3"],
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
    checklistExamples: {
      destination: "The form stayed on a familiar-looking host, but its ‘re’ parameter pointed to a separate verification site.",
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
    cardFacts: [
      { icon: "location", text: "Südstadt · 14 min by bike to campus" },
      { icon: "home", text: "4-person shared flat" },
      { icon: "calendar", text: "Viewing Thursday · 17:00–19:00" },
      { icon: "payment", text: "Deposit after written contract" },
    ],
    description: "Room in shared flat available from 01.08.\nViewing Thursday 17:00–19:00.\n\nPlease reply through the verified listing route.\nNo documents needed before viewing.\nDeposit only after viewing and written contract.",
    details: {
      "Price": "€610 warm",
      "Location": "Südstadt, 14 min by bike to campus",
      "Availability": "From 01.08.",
      "Contact": "Jonas K.",
      "Platform profile": "Active since 2021"
    },
    cta: "Open offer",
    formTitle: "Verified listing route",
    originalUrl: "www.immobilien-scout23.de/expose/wg-room-suedstadt-610",
    formUrl: "www.immobilien-scout23.de/expose/wg-room-suedstadt-610",
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
        label: "www.immobilien-scout23.de/expose/wg-room-suedstadt-610",
        feedback: "The route stays on the housing platform, where the listing and conversation remain visible. That gives you somewhere to go back to if a question comes up.",
        mandatory: true,
        tactic: "Verified route",
        correctFeedback: "Correct. The address stays on `immobilien-scout23.de`, the same platform as the listing.",
        incorrectFeedback: "Check the domain: it stays on the original housing platform, which is a reassuring route signal.",
        distractors: ["Brand impersonation", "Platform switching"],
      },
      {
        id: "h2",
        label: "Deposit: after contract",
        feedback: "The deposit comes after the viewing and written contract. You get to see what you are agreeing to before money changes hands.",
        mandatory: true,
        tactic: "Safe payment timing",
        correctFeedback: "Correct. `After contract` puts viewing and agreement before payment.",
        incorrectFeedback: "The key phrase is `after contract`: payment is not requested before verification.",
        distractors: ["Advance payment", "Scarcity pressure"],
      },
      {
        id: "h3",
        label: "Documents: not required before viewing",
        feedback: "There is no request for documents before the viewing. The process lets you meet the situation first and handle paperwork when it is actually needed.",
        mandatory: true,
        tactic: "Verified route",
        correctFeedback: "Correct. No documents are requested before viewing, so no sensitive data is collected too early.",
        incorrectFeedback: "Notice the absence: there is no early document request.",
        distractors: ["Data overcollection", "Not enough evidence"],
      },
      {
        id: "h4",
        label: "Profile: active since 2021",
        feedback: "An account active since 2021 is useful context, but age alone cannot tell you who is behind the listing or whether this offer is right for you.",
        mandatory: false,
        tactic: "Not enough evidence",
        correctFeedback: "Correct. An account active since 2021 is supporting context, not proof.",
        incorrectFeedback: "Account age alone cannot verify the landlord or listing.",
        distractors: ["Platform switching", "Brand impersonation"],
      },
      {
        id: "h5",
        label: "Price €610 warm",
        feedback: "The price fits the area, which feels more believable than an impossibly cheap offer. Still, a number cannot confirm who is behind the listing.",
        mandatory: false,
        tactic: "Not enough evidence",
        correctFeedback: "Correct. €610 is plausible, but price alone is not proof.",
        incorrectFeedback: "The price is not decisive. Weigh it with the route and payment timing.",
        distractors: ["Advance payment", "Platform switching"],
      },
      {
        id: "h6",
        label: "Availability: From 01.08.",
        feedback: "A date weeks away gives you room to verify, ask questions, and attend the viewing. That feels normal, though the date alone is not proof of anything.",
        mandatory: false,
        tactic: "Not enough evidence",
        correctFeedback: "Correct. A date weeks away gives you time to verify; it is not proof by itself.",
        incorrectFeedback: "The date is neutral. Its value is that it leaves room to check the details.",
        distractors: ["Platform switching", "Scarcity pressure"],
      },
      {
        id: "h7",
        label: "Contact: Jonas K.",
        feedback: "A first name and initial tell you who the listing claims to be from, not whether that identity is verified. Pair it with the platform trail.",
        mandatory: false,
        tactic: "Not enough evidence",
        correctFeedback: "Correct. `Jonas K.` is only supporting context, not verified identity.",
        incorrectFeedback: "A name alone cannot verify the person. Use the platform history and payment process too.",
        distractors: ["Platform switching", "Brand impersonation"],
      }
    ],
    inspectionOrder: ["h1", "h5", "h6", "h7", "h2", "h3", "h4"],
    inspectInstruction: "Follow the page from top to bottom. Look for the details that make the process verifiable, not just polished.",
    evidenceVerdict: "This offer is not safe because it looks tidy. It is safer because the route, timing, and requests leave room for you to verify before committing.",
    evidenceList: [
      { label: "Route", evidence: "www.immobilien-scout23.de/expose/...", interpretation: "The conversation stays on the original housing platform" },
      { label: "Payment timing", evidence: "Deposit after contract", interpretation: "You can view and agree to the terms before paying" },
      { label: "Data request", evidence: "No documents before viewing", interpretation: "Nothing sensitive is collected before it is needed" },
      { label: "Urgency", evidence: "Viewing Thursday", interpretation: "There is time to verify instead of pressure to act immediately" }
    ],
    relevantChecklistKeys: ["destination", "channel", "data", "payment", "pressure"],
    checklistExamples: {
      destination: "The link stayed on ‘immobilien-scout23.de’, the same platform where the listing began.",
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
    detail: "A fee is not automatically a scam, but paying before a viewing or written contract puts you at a disadvantage. Check the terms in writing and keep payment last.",
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
