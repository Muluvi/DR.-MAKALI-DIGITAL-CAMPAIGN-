ANNEX E. The runbooks: the rapid-response decision tree and its response times, the pre-drafted holding positions, monitoring tooling, the security baseline and incident response, and competitor-monitoring outputs. Operational detail a campaign runs on and a principal approves the existence of.

## E.1 The four-tier response decision tree

To avoid elevating fringe attacks or wasting campaign capital, the campaign evaluates every incident against a standardized **Response Decision Tree**:

```figure
id: response-matrix
```

## E.2 Response times, by channel

```figure
id: response-sla
```

## E.3 Holding positions, pre-drafted

The campaign maintains ready-to-deploy holding positions, evidential citations, and Kikamba framing for the four primary lines of attack:

```figure
id: holding-positions
```

## E.4 Monitoring tools

```visual
kind: checklist
items:
  - label: "Social monitoring dashboards"
    text: "Real-time X and cross-platform keyword, hashtag and competitor tracking"
  - label: "Social listening and sentiment (premium tier)"
    text: "Cross-platform sentiment analysis"
  - label: "Meta Business Suite"
    text: "Facebook and Instagram monitoring; competitor content"
  - label: "Google Alerts"
    text: "\"Makali Mulu,\" \"Kitui Governor 2027,\" rival names"
  - label: "**Meta Ad Library**"
    text: "Competitor ad spend, creative and targeting estimates"
  - label: "**Google Ads Transparency Centre**"
    text: "Competitor search advertising"
  - label: "Custom BI dashboard"
    text: "Centralised real-time metrics"
  - label: "**Radio monitoring**"
    text: "Kamba-language station tracking (Section 4.5.6) — critical, as most attacks on Dr. Mulu will originate on air, not online"
```

## E.5 Rapid-response protocol and pre-approved message library

```visual
kind: checklist
items:
  - label: "Level 1"
    text: "Minor negative comment or isolated misinformation"
    head: { label: "Response time", text: "≤ 4 hours" }
    fields:
      - { label: "Approval", text: "Digital Director" }
  - label: "Level 2"
    text: "Coordinated attack; viral misinformation (>10,000 views)"
    head: { label: "Response time", text: "≤ 2 hours" }
    fields:
      - { label: "Approval", text: "Campaign Communications Director" }
  - label: "Level 3"
    text: "Major crisis — false allegation, **manipulated or AI-generated media**, legal threat"
    head: { label: "Response time", text: "≤ 30 minutes" }
    fields:
      - { label: "Approval", text: "**Candidate + senior leadership**" }
```

To execute rapid containment without awaiting ad-hoc legal drafting, a pre-approved message library is maintained:
```visual
kind: checklist
items:
  - label: "Standard rebuttals for false claims about Dr. Mulu's record"
  - label: "Kikamba, Kiswahili and English versions of key messages"
  - label: "Template statements for policy positions issued in response to attack"
  - label: "Fact-check cards linking to verified sources"
  - label: "**Deepfake first-response templates** (Section 6.3.1)"
```

## E.6 Red-team drills

```lead
Quarterly at standard tier, monthly at premium, with a mandatory full-scale drill immediately before the nomination decision and again 60 days before the general election.
```

*Reactive protocols fail because they are first used under real pressure.*

**Cadence:** quarterly at standard tier, monthly at premium, with a mandatory
full-scale drill immediately before the nomination decision and again 60 days
before the general election.

**Method:** a small red-team panel — Firefly's crisis lead, one campaign
representative, and an external participant with no stake in the outcome — is
briefed to attack. The response team is **not** told which scenario is coming
or when. The drill runs in real time against the Section E.5 clock.

```visual
kind: checklist
title: "Standing scenario library"
items:
  - label: "1. Fabricated audio of Dr. Mulu making an inflammatory statement, seeded on WhatsApp"
    fields:
      - { label: "Tests", text: "Deepfake protocol; 30-minute Level 3 clock" }
  - label: "2. Coordinated hashtag attack on his NG-CDF record"
    fields:
      - { label: "Tests", text: "Fact-base readiness; rebuttal library" }
  - label: "3. Claim that the campaign sent unsolicited SMS"
    fields:
      - { label: "Tests", text: "Consent audit trail retrieval (Section 5.3.3)" }
  - label: "4. Hostile radio segment on a station associated with a rival"
    fields:
      - { label: "Tests", text: "Radio response pathway (Section 4.5.6)" }
  - label: "5. Ward champion's account compromised; false messages sent to a ward group"
    fields:
      - { label: "Tests", text: "Incident response (Section E.10)" }
  - label: "7. Manufactured \"grassroots\" campaign attacking a rival, falsely attributed to Dr. Mulu"
    fields:
      - { label: "Tests", text: "Charter defence; provenance evidence" }
```

**Output:** every drill produces a written report — actual response times
against target, decision bottlenecks, gaps in the message library — and the
escalation matrix is revised. Drill reports are retained; a campaign that can
demonstrate it rehearsed is a campaign that can respond credibly when it
matters.

**KPI:** by Phase 2, **90% of drill responses meet their severity-level time
target**.

---

## E.7 The threat model

```lead
Kenyan campaigns face account takeover, phishing of staff and volunteers, leaked internal material, and increasingly the fabrication of audio and video.
```

Kenyan campaigns face account takeover, phishing of staff and volunteers,
leaked internal material, and increasingly the fabrication of audio and video.
Kenya's Communications Authority attributed rising cyber threat volumes in part
to **inadequate system patching, insufficient phishing awareness, and the
growing use of AI tools by malicious actors**, issuing 21.8 million threat
advisories in a single quarter.

```visual
kind: checklist
note: "For this campaign specifically, the highest-consequence scenarios are:"
items:
  - label: "Compromise of the candidate's own social accounts"
  - label: "A ward champion's WhatsApp account compromised and used to message a ward"
  - label: "Leaked internal strategy material — including, if mishandled, this document"
  - label: "Fabricated audio or video of the candidate"
```

## E.8 Account security baseline

```lead
**Hardware keys for the candidate and admins are non-negotiable and take very little.**
```

```visual
kind: checklist
items:
  - label: "**Hardware security keys (FIDO2)** for two-factor authentication"
    text: "**Mandatory** — SMS-based 2FA is not sufficient and is vulnerable to SIM-swap"
    fields:
      - { label: "Applies to", text: "Candidate, Digital Director, all admin-level accounts" }
  - label: "App-based 2FA minimum"
    text: "Where hardware keys are impractical"
    fields:
      - { label: "Applies to", text: "All staff and Tier 3–4 volunteers" }
  - label: "Password manager"
    text: "Unique generated credentials; no reuse"
    fields:
      - { label: "Applies to", text: "All staff" }
  - label: "Role-based access"
    text: "Least privilege; no shared logins ever"
    fields:
      - { label: "Applies to", text: "All platforms" }
  - label: "Business Manager structure"
    text: "Assets owned by the campaign entity, not individuals"
    fields:
      - { label: "Applies to", text: "All ad and page assets" }
  - label: "Quarterly access review"
    text: "Remove departed staff and volunteers within 24 hours of departure"
    fields:
      - { label: "Applies to", text: "Data-governance owner" }
  - label: "Recovery contacts"
    text: "Documented, verified, held by two named people"
    fields:
      - { label: "Applies to", text: "Candidate accounts" }
```

**Hardware keys for the candidate and admins are non-negotiable and take very
little.** The specification: **FIDO2 (WebAuthn) hardware security keys, two per critical account
holder** so a lost key never locks an account, registered before any SMS or app code is removed.

## E.9 Phishing awareness

```visual
kind: checklist
items:
  - label: "Onboarding training for every staff member and Tier 3–4 volunteer before account access is granted"
  - label: "**Simulated phishing exercises quarterly**, with results used for coaching, never for punishment — punitive programmes suppress reporting, which is the opposite of the goal"
  - label: "A no-blame reporting channel with a target of **under 15 minutes** from suspicion to report"
  - label: "Specific coverage of the patterns most likely here: fake platform security alerts, fake IEBC or party communications, and fake media interview requests"
```

## E.10 The incident response plan

```visual
kind: timeline
items:
  - when: "Immediate"
    label: "Detect"
    text: "Anomalous login, unexpected post, member report"
    fields:
      - { label: "Owner", text: "Any team member" }
  - when: "≤ 15 min"
    label: "Contain"
    text: "Force password reset, revoke sessions and tokens, remove compromised access"
    fields:
      - { label: "Owner", text: "Digital Director" }
  - when: "≤ 1 hour"
    label: "Assess"
    text: "Determine what was accessed, posted or exfiltrated"
    fields:
      - { label: "Owner", text: "Data-governance owner" }
  - when: "≤ 2 hours"
    label: "Communicate"
    text: "Notify leadership; if voter data is affected, assess notification obligations with counsel"
    fields:
      - { label: "Owner", text: "Digital Director" }
  - when: "≤ 4 hours"
    label: "Correct"
    text: "Delete unauthorised content; issue public correction if it was seen"
    fields:
      - { label: "Owner", text: "Crisis lead" }
  - when: "≤ 7 days"
    label: "Review"
    text: "Written post-incident report; control revision"
    fields:
      - { label: "Owner", text: "Data-governance owner" }
```

**Leaked material protocol.** If internal material surfaces publicly, the
campaign confirms or denies authenticity accurately and quickly. It does not
speculate about the source, and it does not deny the authenticity of genuine
material — a denial later disproved is worse than the original leak.

## E.12 Competitive intelligence outputs and rapid alerts

```lead
The competitive intelligence workflow produces two operational outputs: the monthly competitive brief and the rapid alert system.
```

The competitive intelligence workflow produces two operational outputs:

1. **The monthly competitive brief:**
   * **Rival digital activity:** platforms, posting frequency, engagement rates, follower growth
   * **Rival ad activity:** from ad libraries and transparency data
   * **Messaging analysis:** themes, framing, target audiences
   * **Vulnerability assessment:** gaps, policy inconsistencies, negative sentiment trends
   * **Recommendations:** counter-messaging and proactive content
2. **The rapid alert system:** New attacks or significant messaging shifts trigger real-time alerts to campaign leadership with recommended responses drawn from the pre-approved library.

#### Competitor monitoring tools

| Tool | Function |
|---|---|
| Meta Ad Library | Competitor ad spend, creative themes, targeting estimates, frequency |
| Google Ads Transparency Centre | Competitor search advertising and keywords |
| Social listening (premium tier) | Mentions, supporter sentiment, emerging narratives |
| X lists | Curated rival, surrogate and influencer accounts |
| **Radio monitoring** | Kamba-station coverage and airtime share (Section 4.5.6) |
