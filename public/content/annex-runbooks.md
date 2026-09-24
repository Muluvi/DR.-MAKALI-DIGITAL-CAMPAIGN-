ANNEX E. The runbooks: the rapid-response decision tree and its response times, the pre-drafted holding positions, monitoring tooling, the security baseline and incident response, and competitor-monitoring outputs. Operational detail a campaign runs on and a principal approves the existence of.

## F.1 The four-tier response decision tree

To avoid elevating fringe attacks or wasting campaign capital, the campaign evaluates every incident against a standardized **Response Decision Tree**:

```figure
id: response-matrix
```

## F.2 Response times, by channel

```figure
id: response-sla
```

## F.3 Holding positions, pre-drafted

The campaign maintains ready-to-deploy holding positions, evidential citations, and Kikamba framing for the four primary lines of attack:

```figure
id: holding-positions
```

## F.4 Monitoring tools

| Tool class | Function |
|---|---|
| Social monitoring dashboards | Real-time X and cross-platform keyword, hashtag and competitor tracking |
| Social listening and sentiment (premium tier) | Cross-platform sentiment analysis |
| Meta Business Suite | Facebook and Instagram monitoring; competitor content |
| Google Alerts | "Makali Mulu," "Kitui Governor 2027," rival names |
| **Meta Ad Library** | Competitor ad spend, creative and targeting estimates |
| **Google Ads Transparency Centre** | Competitor search advertising |
| Custom BI dashboard | Centralised real-time metrics |
| **Radio monitoring** | Kamba-language station tracking (Section 5.2.2.2) — critical, as most attacks on Dr. Mulu will originate on air, not online |

## F.5 Rapid-response protocol and pre-approved message library

| Severity | Definition | Response time | Approval |
|---|---|---|---|
| **Level 1** | Minor negative comment or isolated misinformation | ≤ 4 hours | Digital Director |
| **Level 2** | Coordinated attack; viral misinformation (>10,000 views) | ≤ 2 hours | Campaign Communications Director |
| **Level 3** | Major crisis — false allegation, **manipulated or AI-generated media**, legal threat | ≤ 30 minutes | **Candidate + senior leadership** |

To execute rapid containment without awaiting ad-hoc legal drafting, a pre-approved message library is maintained:
* Standard rebuttals for false claims about Dr. Mulu's record
* Kikamba, Kiswahili and English versions of key messages
* Template statements for policy positions issued in response to attack
* Fact-check cards linking to verified sources
* **Deepfake first-response templates** (Section 5.8.7)

## F.6 Red-team drills

*Reactive protocols fail because they are first used under real pressure.*

**Cadence:** quarterly at standard tier, monthly at premium, with a mandatory
full-scale drill immediately before the nomination decision and again 60 days
before the general election.

**Method:** a small red-team panel — Firefly's crisis lead, one campaign
representative, and an external participant with no stake in the outcome — is
briefed to attack. The response team is **not** told which scenario is coming
or when. The drill runs in real time against the Section F.5 clock.

**Standing scenario library:**
| # | Scenario | Tests |
|---|---|---|
| 1 | Fabricated audio of Dr. Mulu making an inflammatory statement, seeded on WhatsApp | Deepfake protocol; 30-minute Level 3 clock |
| 2 | Coordinated hashtag attack on his NG-CDF record | Fact-base readiness; rebuttal library |
| 3 | Claim that the campaign sent unsolicited SMS | Consent audit trail retrieval (Section 5.7.8) |
| 4 | Hostile radio segment on a station associated with a rival | Radio response pathway (Section 5.2.2.2) |
| 5 | Ward champion's account compromised; false messages sent to a ward group | Incident response (Section F.10) |
| 7 | Manufactured "grassroots" campaign attacking a rival, falsely attributed to Dr. Mulu | Charter defence; provenance evidence |

**Output:** every drill produces a written report — actual response times
against target, decision bottlenecks, gaps in the message library — and the
escalation matrix is revised. Drill reports are retained; a campaign that can
demonstrate it rehearsed is a campaign that can respond credibly when it
matters.

**KPI:** by Phase 2, **90% of drill responses meet their severity-level time
target**.

---

## F.7 The threat model

Kenyan campaigns face account takeover, phishing of staff and volunteers,
leaked internal material, and increasingly the fabrication of audio and video.
Kenya's Communications Authority attributed rising cyber threat volumes in part
to **inadequate system patching, insufficient phishing awareness, and the
growing use of AI tools by malicious actors**, issuing 21.8 million threat
advisories in a single quarter.

For this campaign specifically, the highest-consequence scenarios are:
1. Compromise of the candidate's own social accounts
2. A ward champion's WhatsApp account compromised and used to message a ward
3. Leaked internal strategy material — including, if mishandled, this document
4. Fabricated audio or video of the candidate

## F.8 Account security baseline

| Control | Standard | Applies to |
|---|---|---|
| **Hardware security keys (FIDO2)** for two-factor authentication | **Mandatory** — SMS-based 2FA is not sufficient and is vulnerable to SIM-swap | Candidate, Digital Director, all admin-level accounts |
| App-based 2FA minimum | Where hardware keys are impractical | All staff and Tier 3–4 volunteers |
| Password manager | Unique generated credentials; no reuse | All staff |
| Role-based access | Least privilege; no shared logins ever | All platforms |
| Business Manager structure | Assets owned by the campaign entity, not individuals | All ad and page assets |
| Quarterly access review | Remove departed staff and volunteers within 24 hours of departure | Data-governance owner |
| Recovery contacts | Documented, verified, held by two named people | Candidate accounts |

**Hardware keys for the candidate and admins are non-negotiable and take very
little.** The specification: **FIDO2 (WebAuthn) hardware security keys, two per critical account
holder** so a lost key never locks an account, registered before any SMS or app code is removed.

## F.9 Phishing awareness

* Onboarding training for every staff member and Tier 3–4 volunteer before
account access is granted
* **Simulated phishing exercises quarterly**, with results used for coaching,
never for punishment — punitive programmes suppress reporting, which is the
opposite of the goal
* A no-blame reporting channel with a target of **under 15 minutes** from
suspicion to report
* Specific coverage of the patterns most likely here: fake platform security
alerts, fake IEBC or party communications, and fake media interview requests

## F.10 The incident response plan

| Phase | Action | Owner | Target |
|---|---|---|---|
| **Detect** | Anomalous login, unexpected post, member report | Any team member | Immediate |
| **Contain** | Force password reset, revoke sessions and tokens, remove compromised access | Digital Director | ≤ 15 min |
| **Assess** | Determine what was accessed, posted or exfiltrated | Data-governance owner | ≤ 1 hour |
| **Communicate** | Notify leadership; if voter data is affected, assess notification obligations with counsel | Digital Director | ≤ 2 hours |
| **Correct** | Delete unauthorised content; issue public correction if it was seen | Crisis lead | ≤ 4 hours |
| **Review** | Written post-incident report; control revision | Data-governance owner | ≤ 7 days |

**Leaked material protocol.** If internal material surfaces publicly, the
campaign confirms or denies authenticity accurately and quickly. It does not
speculate about the source, and it does not deny the authenticity of genuine
material — a denial later disproved is worse than the original leak.

## F.11 Competitor monitoring tools

| Tool | Function |
|---|---|
| Meta Ad Library | Competitor ad spend, creative themes, targeting estimates, frequency |
| Google Ads Transparency Centre | Competitor search advertising and keywords |
| Social listening (premium tier) | Mentions, supporter sentiment, emerging narratives |
| X lists | Curated rival, surrogate and influencer accounts |
| **Radio monitoring** | Kamba-station coverage and airtime share (Section 5.2.2.2) |
| **Published polls log** | Each published round logged with its date and method limits for Annex C, for reference only; never used as evidence |

## F.12 Competitive intelligence outputs and rapid alerts

The competitive intelligence workflow produces two operational outputs:

1. **The monthly competitive brief:**
   * **Rival digital activity:** platforms, posting frequency, engagement rates, follower growth
   * **Rival ad activity:** from ad libraries and transparency data
   * **Messaging analysis:** themes, framing, target audiences
   * **Vulnerability assessment:** gaps, policy inconsistencies, negative sentiment trends
   * **Recommendations:** counter-messaging and proactive content
2. **The rapid alert system:** New attacks or significant messaging shifts trigger real-time alerts to campaign leadership with recommended responses drawn from the pre-approved library.

