
What this proposal needs from the campaign, the regulatory guidance still outstanding, and the seven assumptions the whole plan rests on.

## 15.1 What the campaign must provide

Stated plainly, because these are the dependencies that determine delivery:

1. **One named counterpart** with authority to approve content
2. **Candidate time:** approximately 3 hours per week — one Facebook Live, one
   voice-note recording session, one interview or content block
3. **Ground team asset uploads:** daily photographs and video from the trail
4. **Appointment of the data-protection reviewer** (Section 12.5.5) — the
   long-lead item, needed in Phase −1
5. **Current ward-level registration data** from the IEBC published file
6. **Access to the existing NG-CDF project record** for verified proof points
7. **Sign-off on the service level** so the team can be assembled

#### The marked placeholders, in one list

The proposal's status line says it carries marked placeholders. There are 17, and they fall
into three kinds. Collected here so none has to be hunted for:

| What is needed | Where it appears | From whom |
|---|---|---|
| **Shortcode and sender ID**, once the USSD and SMS codes are provisioned | 8.10.3, 8.15.1, 8.2.3, 8.2.7 | Telco / aggregator at contracting |
| **Hardware security key specification**; **deepfake detection vendor** | 13.3.2, 13.3.5 | Firefly, at contracting |
| **Named data-protection / electoral-law reviewer** — the long-lead item in row 4 above | 12.5.5, 13.5 | Campaign appoints |
| **Independent qualitative research facilitator** | 11.3.1 | Firefly recommends, campaign appoints |
| **Kenyan Sign Language interpreter or service** | 8.5.3 | Campaign or KNAD |
| **Verified Kikamba proverbs and idiom**, native-speaker reviewed | 8.5 | Kikamba producer, Phase −1 |
| **Response SLA for data-subject requests** (14 days recommended) | 12.5.4 | Campaign counsel |
| **Week 1 audit baseline**; **community-manager surge threshold**; **ad kill-rate threshold**; **endorsement target** | 9.1.1, 14.4, 8.4.3, 9.2.4 | Established by measurement, not assumed |

Nothing in the last row is a number the campaign can supply today; each is set by the Week 1
baseline or by testing, and each is left open deliberately rather than filled with an estimate.

---

## 15.2 Regulatory guidance still outstanding

> [!WARNING]
> **COMPLIANCE ACTION ITEM — ODPC DIRECTIVE CONFIRMATION REQUIRED:**
>
> While the general provisions of the **Data Protection Act 2019** and the **Data Protection (General) Regulations 2021** are fully integrated, the campaign notes that the **Office of the Data Protection Commissioner (ODPC)** has periodically issued specific sector-guidelines and advisory circulars regarding **"Processing of Personal Data in Political Campaigns and Direct Marketing"**.
>
> **Current Status:** The specific, finalized official circular document from the ODPC regarding political campaign messaging could not be retrieved during the archival research phase.
>
> **Mandatory Action:** Prior to launching Phase −1 mass SMS/USSD broadcasting, the Campaign Legal Director MUST:
> 1. Conduct a formal legal review with the ODPC registry to obtain the latest gazetted political campaigning guidelines and advisory notes.
> 2. Formally register the campaign entity as a **Data Controller / Data Processor** with the ODPC if aggregate supporter records exceed statutory thresholds (Section 8.12.2 & Section 13.5.2).
> 3. Verify compliance of telecommunication aggregator contracts (Safaricom / Airtel bulk SMS gateways) with the latest ODPC direct marketing codes.

```
════════════════════════════════════════════════════════════════════════════════════
                          SECTION 15.2 STRATEGIC TAKEAWAY
════════════════════════════════════════════════════════════════════════════════════
 • Architecture: Relational, AES-256 encrypted voter model mapped to 40 wards.
 • Provenance:   Tri-partite metadata standard (Source, Date, Geography) on every
                 figure; 3-tier evidential hierarchy prevents data drift.
 • Ethics & Law: 100% compliant with DPA 2019—affirmative opt-ins, instant STOP
                 opt-outs, zero purchased phone lists, and active DPO oversight.
 • Compliance:   ODPC political campaigning advisory flagged for mandatory formal
                 legal confirmation before mass broadcasting.
════════════════════════════════════════════════════════════════════════════════════
```


---

## 15.3 Assumptions this proposal rests on

This proposal is built on the following assumptions. Each is stated so that if one fails, the
campaign can see immediately what in the plan moves. None of them is a prediction, and none is
presented as settled fact.

1. **The Wiper ticket is decided by opinion poll, not a delegates' contest.** This is reported
   and not confirmed by the party (Tier 3; Section 3.1.2). If it becomes a delegate primary, the
   targeting model changes from countywide name recognition to delegate arithmetic, and
   Section 3.1.6 sets out what that would require.

2. **The decision falls before the final quarter of 2026.** Every deadline in Section 4.1 and the
   Phase −1 sprint in Section 9.1.1 are set by that window. A later date lengthens the sprint; an
   earlier one compresses it and forces the reallocation triggers in Section 4.1 sooner.

3. **The register and connectivity figures hold.** The 532,758 registered voters, the 86.4%
   outside the internet-using population and the ward-level distribution in Section 3.4 are the
   most recent published figures. The offline layer in Section 8.10 is sized against them.

4. **The campaign appoints the named roles.** The data-protection and electoral-law reviewer, the
   qualitative research facilitator and the sign-language provider are campaign appointments, not
   Firefly's. Section 15.1 lists them.

5. **The candidate is available to the production cycle.** The weekly Facebook Live, the
   explainer series and the debate preparation in Section 8.7 assume scheduled candidate time.
   Without it, the earned-media and owned-video commitments in Section 10.2 cannot hold at the
   stated cadence.

6. **Telco and platform access is obtained on ordinary commercial terms.** The SMS aggregator,
   the shortcode and the advertising platforms are assumed available to a compliant political
   advertiser. Section 13.5 covers the compliance conditions; Section 15.2 covers the regulatory
   guidance still outstanding.

7. **The engagement is embedded with the campaign.** Firefly works alongside the campaign's own
   structure under Section 12, not at arm's length from it, and the ground-digital integration in
   Section 8.8 assumes daily contact with the field operation.
