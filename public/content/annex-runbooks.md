```lead
These are the runbooks the war room in Section 20.2 works from: operational detail a campaign runs on and a principal approves the existence of.
```

These are the runbooks the war room in Section 20.2 works from: operational detail a campaign runs on and a principal approves the existence of. This annex holds the pre-drafted holding positions, the monitoring tools, the red-team drills, the threat model, the account security baseline, phishing awareness, incident response and the competitor-monitoring outputs. The rapid-response protocol itself is in Risks and response.

## F.3 Holding positions, pre-drafted

#### Pre-drafted response lines

Prepared, verified, and rehearsed in drills. Each is a structure, not a script —
substance fixed, delivery natural.

| Likely attack | Response structure |
|---|---|
| **"He is a national MP, not a county manager"** | Acknowledge the distinction, then reframe: county government's central failure mode is budget execution, which is the one discipline he has done professionally at national scale — and the certification of Kitui Central as best evaluated constituency in the Eastern region is the county-level proof |
| **"He is from Kitui Central and will favour it"** | Commit to a published, methodology-first allocation formula across all 40 wards, published before allocation and audited after — an economist's answer, and one no rival can match |
| **"Others have been more visible on the ground"** | Do not contest the premise. Reframe visibility as a means, not a qualification: the question is what a leader does with the office, and offer the verification record |
| **"NG-CDF questions"** | Lead with the documented record — bursary numbers, project list, the Eastern region evaluation certification — and invite scrutiny. **Never defensive; an evaluator welcomes audit.** |
| **"Too technical / not close to ordinary people"** | Answer in Kikamba, with a household example. The best rebuttal to "too technical" is a demonstration, not a denial |
| **"Wiper insider / party establishment"** | Point to the independence of his parliamentary record on budget matters |
| **Manipulated media** | Section 20.4 protocol — 30-minute clock |
| **Unsolicited SMS allegation** | Produce the consent audit trail; cite the published charter; correct publicly within the hour |

The campaign maintains ready-to-deploy holding positions, evidential citations, and Kikamba framing for the four primary lines of attack:

```figure
id: holding-positions
```

## F.4 Monitoring tools

```visual
{"kind":"checklist","items":[{"label":"Social monitoring dashboards","text":"Real-time X and cross-platform keyword, hashtag and competitor tracking"},{"label":"Social listening and sentiment (premium tier)","text":"Cross-platform sentiment analysis: mentions, supporter sentiment, emerging narratives"},{"label":"Meta Business Suite","text":"Facebook and Instagram monitoring; competitor content"},{"label":"Google Alerts","text":"\"Makali Mulu,\" \"Kitui Governor 2027,\" rival names"},{"label":"**Meta Ad Library**","text":"Competitor ad spend, creative themes, targeting estimates and frequency"},{"label":"**Google Ads Transparency Centre**","text":"Competitor search advertising and keywords"},{"label":"X lists","text":"Curated rival, surrogate and influencer accounts"},{"label":"Custom BI dashboard","text":"Centralised real-time metrics"},{"label":"**Radio monitoring**","text":"Kamba-language station tracking, coverage and airtime share (Section 15.2.2) — critical, as most attacks on Dr. Mulu will originate on air, not online"}]}
```

The rapid-response protocol, its four severity tiers, its response times by channel and the pre-approved message library are in Risks & response, with the war room they serve. This annex keeps the reference material: holding lines, monitoring tools, drills, the threat model and incident response.

## F.6 Red-team drills

```lead
Quarterly at standard tier, monthly at premium, with a mandatory full-scale drill immediately before the nomination decision and again 60 days before the general election.
```

*Reactive protocols fail because they are first used under real pressure.*

**Cadence:** quarterly at standard tier, monthly at premium, with a mandatory
full-scale drill immediately before the nomination decision and again 60 days
before the general election.

**Method:** a small red-team panel — the campaign's crisis lead, one campaign
representative, and an external participant with no stake in the outcome — is
briefed to attack. The response team is **not** told which scenario is coming
or when. The drill runs in real time against the Annex F.5 clock.

```visual
{"kind":"checklist","title":"Standing scenario library","items":[{"label":"1. Fabricated audio of Dr. Mulu making an inflammatory statement, seeded on WhatsApp","fields":[{"label":"Tests","text":"Deepfake protocol; 30-minute manipulated-media clock"}]},{"label":"2. Coordinated hashtag attack on his NG-CDF record","fields":[{"label":"Tests","text":"Fact-base readiness; rebuttal library"}]},{"label":"3. Claim that the campaign sent unsolicited SMS","fields":[{"label":"Tests","text":"Consent audit trail retrieval (Section 19.3)"}]},{"label":"4. Hostile radio segment on a station associated with a rival","fields":[{"label":"Tests","text":"Radio response pathway (Section 15.2.2)"}]},{"label":"5. Ward champion's account compromised; false messages sent to a ward group","fields":[{"label":"Tests","text":"Incident response (Annex F.10)"}]},{"label":"6. Manufactured \"grassroots\" campaign attacking a rival, falsely attributed to Dr. Mulu","fields":[{"label":"Tests","text":"Charter defence; provenance evidence"}]}]}
```

*Source conflict: an earlier version numbered the last scenario 7; there was no sixth, and the library holds six.*

**Output:** every drill produces a written report — actual response times
against target, decision bottlenecks, gaps in the message library — and the
escalation matrix is revised. Drill reports are retained; a campaign that can
demonstrate it rehearsed is a campaign that can respond credibly when it
matters.

**KPI:** by Phase 2, **90% of drill responses meet their severity-level time
target**.

## F.7 The threat model

```lead
Kenyan campaigns face account takeover, phishing of staff and volunteers, leaked internal material, and increasingly the fabrication of audio and video.
```

Kenyan campaigns face account takeover, phishing of staff and volunteers,
leaked internal material, and increasingly the fabrication of audio and video.
Kenya's Communications Authority attributed rising cyber threat volumes in part
to **inadequate system patching, insufficient phishing awareness, and the
growing use of AI tools by malicious actors**, issuing 21.8 million threat advisories (Communications Authority, Tier 1) in a single quarter.

```visual
{"kind":"checklist","note":"For this campaign specifically, the highest-consequence scenarios are:","items":[{"label":"Compromise of the candidate's own social accounts"},{"label":"A ward champion's WhatsApp account compromised and used to message a ward"},{"label":"Leaked internal strategy material — including, if mishandled, this document"},{"label":"Fabricated audio or video of the candidate"}]}
```

Account security and phishing awareness follow; the law and the charter they serve are in Lawful and ethical.

## F.8 Account security baseline

```lead
**Hardware keys for the candidate and admins are non-negotiable and take very little.**
```

```visual
{"kind":"checklist","items":[{"label":"**Hardware security keys (FIDO2)** for two-factor authentication","text":"**Mandatory** — SMS-based 2FA is not sufficient and is vulnerable to SIM-swap","fields":[{"label":"Applies to","text":"Candidate, Digital Director, all admin-level accounts"}]},{"label":"App-based 2FA minimum","text":"Where hardware keys are impractical","fields":[{"label":"Applies to","text":"All staff and Tier 3–4 volunteers"}]},{"label":"Password manager","text":"Unique generated credentials; no reuse","fields":[{"label":"Applies to","text":"All staff"}]},{"label":"Role-based access","text":"Least privilege; no shared logins ever","fields":[{"label":"Applies to","text":"All platforms"}]},{"label":"Business Manager structure","text":"Assets owned by the campaign entity, not individuals","fields":[{"label":"Applies to","text":"All ad and page assets"}]},{"label":"Quarterly access review","text":"Remove departed staff and volunteers within 24 hours of departure","fields":[{"label":"Applies to","text":"Data-governance owner"}]},{"label":"Recovery contacts","text":"Documented, verified, held by two named people","fields":[{"label":"Applies to","text":"Candidate accounts"}]}]}
```

**Hardware keys for the candidate and admins are non-negotiable and take very
little.** The specification: **FIDO2 (WebAuthn) hardware security keys, two per critical account
holder** so a lost key never locks an account, registered before any SMS or app code is removed.

## F.9 Phishing awareness

```visual
{"kind":"checklist","items":[{"label":"Onboarding training for every staff member and Tier 3–4 volunteer before account access is granted"},{"label":"**Simulated phishing exercises quarterly**, with results used for coaching, never for punishment — punitive programmes suppress reporting, which is the opposite of the goal"},{"label":"A no-blame reporting channel with a target of **under 15 minutes** from suspicion to report"},{"label":"Specific coverage of the patterns most likely here: fake platform security alerts, fake IEBC or party communications, and fake media interview requests"}]}
```

#### Technical risk and security protocols

To keep campaign systems running and protect them from infiltration or cyber disruption:

1.  **Two-factor authentication, with hardware keys for administrators:** every war room operator and every ward coordinator who opens a dashboard uses two-factor authentication, by an authenticator app (such as Google Authenticator) at minimum; database administrators use a hardware security key (such as a YubiKey).
2.  **Automated off-site backups:** The PostgreSQL Supporter CRM executes automated hourly WAL archiving and daily encrypted snapshots stored in geographically isolated cloud buckets.
3.  **Data redaction by role:** ground staff and ward captains see only voter data relevant to their specific assigned ward. Exporting full countywide voter lists is programmatically blocked and restricted exclusively to the data protection officer and the campaign manager.

*Source conflict: an earlier version listed Google Authenticator as a hardware key; it is an app, and the rule above separates the two.*

## F.10 The incident response plan

```visual
{"kind":"timeline","items":[{"when":"Immediate","label":"Detect","text":"Anomalous login, unexpected post, member report","fields":[{"label":"Owner","text":"Any team member"}]},{"when":"≤ 15 min","label":"Contain","text":"Force password reset, revoke sessions and tokens, remove compromised access","fields":[{"label":"Owner","text":"Digital Director"}]},{"when":"≤ 1 hour","label":"Assess","text":"Determine what was accessed, posted or exfiltrated","fields":[{"label":"Owner","text":"Data-governance owner"}]},{"when":"≤ 2 hours","label":"Communicate","text":"Notify leadership; if voter data is affected, assess notification obligations with counsel","fields":[{"label":"Owner","text":"Digital Director"}]},{"when":"≤ 4 hours","label":"Correct","text":"Delete unauthorised content; issue public correction if it was seen","fields":[{"label":"Owner","text":"Crisis lead"}]},{"when":"≤ 7 days","label":"Review","text":"Written post-incident report; control revision","fields":[{"label":"Owner","text":"Data-governance owner"}]}]}
```

**Leaked material protocol.** If internal material surfaces publicly, the
campaign confirms or denies authenticity accurately and quickly. It does not
speculate about the source, and it does not deny the authenticity of genuine
material — a denial later disproved is worse than the original leak.

## F.11 Competitor intelligence outputs and alerts

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

The tools that feed both outputs are listed once, in Annex F.4.
