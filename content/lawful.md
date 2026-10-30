```lead
Voter data is handled in a manner intended to comply with Kenya's data-protection and electoral law, and no voter-file targeting or bulk political messaging goes live until a named Kenyan specialist has signed it off in writing.
```

Voter data is handled in a manner intended to comply with Kenya's data-protection and electoral law, and no voter-file targeting or bulk political messaging goes live until a named Kenyan specialist has signed it off in writing. This chapter sets out the standard, the Data Protection Act and the regulator, the published charter, IEBC clearance and liability, and the regulatory items still open.

## 19.1 Our standard

```lead
Voter data is handled in a manner intended to comply with Kenya's Data Protection Act 2019, the Communications Authority framework governing political messaging, and IEBC regulations.
```

Voter data is handled in a manner intended to comply with Kenya's Data
Protection Act 2019, the Communications Authority framework governing political
messaging, and IEBC regulations. This protects the campaign from legal risk and
reinforces Dr. Makali Mulu's brand as a trustworthy, accountable leader.

<!-- keep -->
**Important framing: this section describes the campaign's intended standard
and control environment. It is not a legal opinion, and nothing here asserts
that any specific processing is already lawful. Section 19.2 establishes the
gate that answers that question properly.**

**Who the controller is, channel by channel.** This engagement splits the answer, and the split
must be settled in writing before the first dispatch, because registration duties, breach
notification and liability all follow controllership rather than convenience:

<!-- keep -->
| Channel | Operated by | Controller position to be confirmed |
|---|---|---|
| Owned social accounts | Your team | The campaign. Firefly holds no credentials and processes only aggregate analytics. |
| SMS, USSD and WhatsApp Business API | **Firefly** | Firefly is a controller, or a joint controller with the campaign — **not a processor acting on instructions.** Confirmed in the Section 19.2 scope memorandum. |
| Supporter CRM and voter model | Firefly, on the campaign's behalf | The campaign as controller, Firefly as processor, under a written processing agreement. |

```visual
kind: cards
preset: rule
items:
  - title: "NG-CDF and bursary beneficiary lists are off-limits for campaign contact."
    body: "ODPC's 2025 public sector guidance note bars the reuse of personal data collected through public programmes for **political mobilisation** without explicit, separate consent (Tier 1, ODPC). The campaign holds exactly such a dataset — the bursary record covering the {{record.bursary.recipients}} students in Section 6.1 — and it is the most tempting list in the county.\n\n**It is not used.** Not for SMS, not for WhatsApp, not for matching, not for lookalike targeting. The **project record** remains fully usable as a proof point, because a completed classroom is not personal data; the **people** in that record are not a contact list. Section 22.2 lists access to the project record for exactly that reason, and it should not be read as access to the beneficiaries."
  - title: "The electoral guidance note applies on top of the general Act."
    body: "ODPC's *Guidance Note on Processing Personal Data for Electoral Purposes* governs anyone handling voter or party-member data, and the Data Protection Commissioner restated the consent standard publicly in **August 2026**, specifically noting that parties are expanding supporter databases (Tier 1 / Tier 2). The Section 19.2 reviewer should be pointed at both documents by name."
  - title: "Inherited lists are not used until their consent is evidenced."
    body: "Any SMS or WhatsApp contacts already held by the existing team arrive with unknown opt-in provenance. The rule this engagement operates under, stated before anyone asks: **a contact whose consent cannot be evidenced is not messaged**, and no inherited list is merged into the consented list in Section 15.3.3 until its origin is documented. This is the same standard Section 19.2 applies to purchased databases, and it applies to friendly sources for the same reason."
  - title: "The presence audit processes personal data too."
    body: "The Section 14.1 audit touches data subjects through commenter counts and demographic breakdowns. It is low-risk and aggregate — counts and shares, no named lists, no profile exports — but it sits inside the Section 19.2 scope memorandum rather than outside it, on the same terms as every other processing activity here."
```

## 19.2 The Data Protection Act and the regulator

```lead
Vendors openly market databases of millions of Kenyan mobile numbers. Rival campaigns may well buy them. The campaign will not.
```

#### The regulatory environment as it stands

```visual
kind: checklist
items:
  - label: "Political SMS"
    body: "Recipients of political messages must have **opted in**, with express consent and clearly notified opt-out. Service providers are prohibited from sending unsolicited bulk content"
    fields:
      - { label: "Source", text: "Industry code governing bulk political messaging" }
  - label: "Consent standard"
    text: "Must be **express, free, specific, informed and unequivocal**."
    body: "Consent for one purpose does not transfer to another"
    fields:
      - { label: "Source", text: "ODPC determinations under the Data Protection Act 2019" }
  - label: "Enforcement"
    body: "ODPC has issued penalties up to **KSh5 million**, including **KSh400,000 against a lender for unsolicited marketing SMS (December 2025)** and penalties of KSh1.85m–4.55m against three controllers"
    fields:
      - { label: "Source", text: "ODPC" }
  - label: "Political messaging scrutiny"
    body: "Unsolicited political SMS was the subject of public and press scrutiny in August 2026 as the 2027 cycle began"
    fields:
      - { label: "Source", text: "Kenyan press reporting" }
```

**The commercial reality this creates.** Vendors openly market databases of
millions of Kenyan mobile numbers. Rival campaigns may well buy them. Doing so
would give short-term reach and long-term exposure — regulatory, and
reputational for a candidate whose entire proposition is rigour and
accountability. The campaign will not.

#### Compliance measures

```visual
kind: checklist
items:
  - label: "Collection"
    text: "Voters informed of use; consent obtained"
    fields:
      - { label: "Implementation", text: "Clear privacy notice at every collection point — website, USSD, baraza sign-up sheet, WhatsApp opt-in" }
  - label: "Storage"
    text: "Data secured"
    fields:
      - { label: "Implementation", text: "Encrypted storage, role-based access control, access logging, periodic review" }
  - label: "Sharing"
    text: "No sharing without consent"
    fields:
      - { label: "Implementation", text: "No third-party transfer; no sale under any circumstance" }
  - label: "Retention"
    text: "Not kept indefinitely"
    fields:
      - { label: "Implementation", text: "Published deletion schedule (Section 19.3, clause 5)" }
  - label: "Communication"
    text: "Opt-outs respected"
    fields:
      - { label: "Implementation", text: "One-touch opt-out on every message; honoured immediately and permanently" }
  - label: "Accuracy"
    text: "Correction rights honoured"
    fields:
      - { label: "Implementation", text: "Documented request route with response SLA" }
  - label: "Misinformation"
    text: "No false content"
    fields:
      - { label: "Implementation", text: "Fact-check protocol; pre-approval of sensitive claims" }
```

#### The Data Protection Act 2019, applied

Political messaging, bulk SMS broadcasting, and voter profiling operate under statutory oversight in Kenya. Non-compliance risks criminal penalties, regulatory injunctions, and brand damage.

```figure
id: dpa-compliance
```

```visual
kind: checklist
title: "Mandatory compliance safeguards"
items:
  - label: "No commercial databases"
    body: "The campaign strictly forbids purchasing or scraping phone directories, bank lists, student registers, or church rosters. Ingesting bulk phone numbers without consent breaches the consent requirement of the DPA 2019 [VERIFY: the Section 19.2 reviewer to cite the section of the Act]."
  - label: "Automated opt-out"
    body: "Any inbound SMS containing \"STOP\", \"SIMAMA\", \"ONDOKA\", or \"CANCEL\" is automatically processed by a webhook within 15 seconds, toggling `opt_out_status = True` and permanently halting outbound SMS transmissions."
  - label: "Data protection officer"
    body: "The campaign secretariat designates a certified legal and data protection officer to supervise all database access logs, consent registries, and vendor contracts."
```

#### The compliance sign-off gate

```lead
**Before any voter-file-based targeting, list-building beyond first-party consented data, or bulk political messaging goes live, a named Kenyan data-protection or electoral-law specialist must review and sign off the specific proposed processing in writing.**
```

**Before any voter-file-based targeting, list-building beyond first-party
consented data, or bulk political messaging goes live, a named Kenyan
data-protection or electoral-law specialist must review and sign off the
specific proposed processing in writing.**

<!-- keep -->
**This proposal does not assert that the micro-targeting programme described in
Section 15.4.2 is legally clear. It may not be.** The questions below are genuinely
open, are questions of Kenyan law and regulatory interpretation, and are for
the campaign's counsel to answer — not for a communications consultancy to
assume:

```visual
kind: checklist
items:
  - label: "On what lawful basis, if any, may a campaign process the IEBC voter register for targeting, and what are the limits of any such basis?"
  - label: "Does the campaign or its vendors require registration as a data controller or processor, and what documentation must be in place?"
  - label: "Do the consent mechanisms proposed here meet the express, free, specific, informed and unequivocal standard as the ODPC applies it to **political** messaging specifically?"
  - label: "Does matching first-party consented data against the register constitute further processing requiring separate consent?"
  - label: "What is the correct handling of data collected from minors who may sign up at public events?"
```

```visual
kind: stepper
title: "Process"
items:
  - label: "Scope memorandum"
    text: "exactly what data, from where, for what"
    fields:
      - { label: "Owner", text: "Data-governance owner" }
      - { label: "Output", text: "Written scope, before any counsel time is used" }
  - label: "Independent review"
    fields:
      - { label: "Owner", text: "A Kenyan data-protection and electoral-law specialist, appointed by the campaign" }
      - { label: "Output", text: "Written opinion" }
  - label: "Remediation of any gaps"
    fields:
      - { label: "Owner", text: "Firefly + campaign" }
      - { label: "Output", text: "Revised processing design" }
  - label: "Written sign-off"
    fields:
      - { label: "Owner", text: "Reviewer" }
      - { label: "Output", text: "Dated authorisation, scope-limited" }
  - label: "Re-review on material change"
    fields:
      - { label: "Owner", text: "Data-governance owner triggers" }
      - { label: "Output", text: "Updated sign-off" }
```

<!-- keep -->
**Until step 4 is complete, the campaign operates on first-party consented data
and aggregate ward-level statistics only.** This fallback is carried at every
engagement level (Section 15.4.2), so the campaign loses no time waiting and
carries no exposure if the answer is restrictive.

## 19.3 The Digital Ethics and Data Charter

```lead
Because a commitment nobody can read is a policy, and a commitment published with a verification route is a differentiator.
```

<!-- keep -->
*Published on the campaign website in all three languages, in plain
language, at a permanent URL.*

**Why publish it.** Because a commitment nobody can read is a policy, and a
commitment published with a verification route is a differentiator. This is the
"Economist Governor" proposition applied to the campaign's own conduct: it is
the campaign holding itself to the standard it asks of the county government.
It also has hard defensive value — when an opponent alleges bot activity or
spam, a published charter plus a retained audit trail is an answer, not a
denial.

<!-- keep -->
> ### DIGITAL ETHICS & DATA CHARTER
> **Kwĩyumya kwa Ũthaithi — Ahadi Yetu ya Uwazi — Our Commitment to Integrity**
>
> **1. No fabricated engagement.**
> This campaign does not and will not use bot accounts, sockpuppet or fake
> accounts, purchased followers, purchased likes or comments, or paid
> engagement presented as organic. Every supporter is a real person. Every
> follower count is honest.
>
> **2. No disinformation.**
> We will not publish false claims about any candidate, including our
> opponents. We will not create or share manipulated images, audio or video. We
> will not present AI-generated content as real footage. Where AI assists in
> producing an illustration, we label it.
>
> **3. Transparent advertising.**
> Every paid advertisement is run from a publicly identified campaign account
> with the required disclaimers, and is therefore visible in the platform ad
> libraries any citizen or journalist can search. We will additionally publish
> a **monthly summary of every paid placement** on the campaign website.
>
> **4. Consent-based contact only.**
> We do not buy voter contact lists. Every phone number and email address we
> hold was given to us voluntarily, with a clear explanation of what we would
> use it for. Every message we send carries a one-touch opt-out, and every
> opt-out is honoured immediately and permanently.
>
> **5. Data retention and deletion.**
> We will hold personal data only for the campaign period. **Within 90 days of
> the declaration of results, all personal data collected for campaigning will
> be permanently deleted**, except where a specific legal or regulatory
> obligation requires retention — in which case only the required records are
> kept, for the required period, and nothing more. Deletion will be confirmed
> publicly.
>
> **6. No identity-based targeting.**
> We segment voters by the issues that affect their lives — water, jobs,
> markets, health, education — and by where they live. **We do not target,
> segment or profile any voter on the basis of ethnicity, clan or religion, and
> we will not run messaging designed to set any community in Kitui against
> another.** We communicate in Kikamba, Kiswahili and English because that is
> how Kitui speaks, not to divide it.
>
> **7. No psychological profiling.**
> We do not build personality or psychographic profiles of voters. We use
> demographic, geographic and issue-interest information that any voter would
> reasonably expect a campaign to consider.
>
> **8. No voter suppression.**
> We will never discourage any eligible Kenyan from registering or voting,
> including supporters of rival candidates. We will publish accurate
> registration and polling information to anyone who asks, whoever they support.
>
> **9. Accountability.**
> Where we get something wrong, we will correct it publicly and promptly, with
> the same prominence as the original.
>
> **10. Your rights.**
> You may ask us what data we hold about you, ask us to correct it, or ask us
> to delete it, at any time, at fireflymanagement.ke@gmail.com. We will respond
> within **14 days**.
>
> *Published in Kikamba, Kiswahili and English.*

**Operational backing.** Each clause maps to a control: the consent audit trail
(clause 4), the per-send audit trail (clause 3), the deletion schedule executed
by the data-governance owner (clause 5), the variable dictionary exclusions
(clauses 6 and 7), the fact-check protocol (clause 2), and the correction log
(clause 9). A charter without instrumentation is decoration.

## 19.4 IEBC clearance and liability

#### Statutory and regulatory compliance

Operating with strict legal adherence is both an ethical mandate and an essential defence against administrative disqualification or election petition exposure.

```figure
id: compliance-architecture
```

#### The IEBC nomination and clearance checklist

```figure
id: iebc-clearance
```

#### Data protection and election offences liability

```figure
id: liability-matrix
```

## 19.5 Open regulatory items

```lead
Two ODPC documents are now identified by name and should be put in front of the reviewer directly. What remains unretrieved is any circular issued after these.
```

> [!WARNING]
> **Action: confirm the latest ODPC directives.**
>
> While the general provisions of the **Data Protection Act 2019** and the **Data Protection (General) Regulations 2021** are fully integrated, the campaign notes that the **Office of the Data Protection Commissioner (ODPC)** has periodically issued specific sector-guidelines and advisory circulars regarding **"Processing of Personal Data in Political Campaigns and Direct Marketing"**.
>
> **Current Status:** Two ODPC documents are now identified by name and should be put in front of
> the reviewer directly: the ***Guidance Note on Processing Personal Data for Electoral Purposes***
> and the ***Guidance Note for the Public Sector (2025)***, the second of which bars reuse of
> public-programme data for political mobilisation (Section 19.2). What remains unretrieved is
> any circular issued after these. Separately, the **CA/NCIC political bulk-messaging guidelines**
> are now applied in full at Section 15.3.3: English or Kiswahili only, and 48-hour advance lodging
> with the operator.

```visual
kind: checklist
note: "**Required:** before any mass SMS or USSD broadcast — which Firefly operates, and for which Firefly is a controller or joint controller (Section 19.1) — the campaign's legal lead must:"
items:
  - label: "Conduct a formal legal review with the ODPC registry to obtain the latest gazetted political campaigning guidelines and advisory notes."
  - label: "Formally register the campaign entity as a **Data Controller / Data Processor** with the ODPC if aggregate supporter records exceed statutory thresholds (Sections 15.4.1 and 19.4)."
  - label: "Verify compliance of telecommunication aggregator contracts (Safaricom / Airtel bulk SMS gateways) with the latest ODPC direct marketing codes."
```
