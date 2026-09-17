# Stage 9 — Channel reach estimate

How many voters each channel can physically reach, by ward.

*Kitui 2027 analysis pipeline · data as of 2026-09-16 · generated 2026-09-17*

![Modelled reach by channel, all 40 wards](../outputs/charts/09_reach_by_ward.svg)

*Modelled reach by channel, all 40 wards*

![The same model on two different rate sets](../outputs/charts/09_reach_rate_sensitivity.svg)

*The same model on two different rate sets*


## Every figure here is modelled

Nothing in this stage is a measurement. It is a published rate multiplied by a ward register. The rates and their years are shown beside every figure because their age is the main source of error.

| Rate | Value | Year | Source | Used as |
|---|---|---|---|---|
| Internet use, Kitui | 13.6% | 2019 | S35 (T2) | county rate — preferred |
| Phone ownership, Kitui | 42.9% | 2019 | S35 (T2) | county rate — preferred |
| Internet use, national | 35.0% | 2023-24 | S36 (T2) | fallback and sensitivity only |
| Phone ownership, national rural | 48.6% | 2023-24 | S36 (T2) | fallback and sensitivity only |
| Smartphone share of connections | 59.7% | 2025-26 Q3 | S34 (T2) | context — national, not applied per ward |


## County totals

| Segment | Voters (county rates) | Share | Voters (national rural rates) | Share  |
|---|---|---|---|---|
| Smartphone or data | 72,453 | 13.6% | 186,465 | 35.0% |
| SMS only (phone, no data) | 156,098 | 29.3% | 72,453 | 13.6% |
| No phone — radio or in person | 304,207 | 57.1% | 273,840 | 51.4% |


### What this says

- **On county rates, 14% of the register is reachable by smartphone or data** — 72,453 voters. That is the ceiling on a purely digital campaign, and it sits far below the ~198,000 votes the 2022 winner took.
- **156,098 voters own a phone but do not use the internet.** This is the SMS and USSD layer, and it is larger than the digital layer by 2.2×. It is also the layer the compliance rules bite hardest on.
- **304,207 voters (57%) own no phone at all.** They are reachable only by radio, print, or in person. No SMS, USSD or ad budget touches them.
- **Changing the rate set moves the answer by more than any ward-level detail would.** On the 2023/24 national rural rates the digital layer grows from 72,453 to 186,465. That gap is the uncertainty.


## What the SMS layer can and cannot carry

- **Bulk political SMS is English or Kiswahili only** under the CA/NCIC guidelines [S54]. Kikamba is not available on this layer at all, which matters because the SMS-only segment is disproportionately rural, older and lower-income — the population most likely to prefer Kikamba.
- **Messages must be lodged with the operator 48 hours in advance** [S53], with verbatim text and a signed authorisation. Rapid response by SMS is therefore not possible; anything time-critical belongs on radio or WhatsApp.
- **Operators may refuse non-compliant messages** [S54]. The 48-hour lodging window is also the rejection window.
- **NG-CDF and bursary beneficiary lists cannot become an SMS list** [S57]. Consented opt-in is the only lawful route to this segment, which makes list building a campaign objective in its own right rather than an assumption.


## Limits

- **The rates are seven years old.** KNBS 2019 is the only Kitui-specific source in the pack. The pack itself records that coverage has since improved under USO in Mwingi North, so 13.6% almost certainly understates today.
- **The rates are applied uniformly to all 40 wards.** No ward-level connectivity data exists, so ward variation here reflects register size only. Township and Tharaka get the same rate, which is certainly wrong.
- **The denominators do not match the rates.** KNBS measured residents aged 3 and above; this model applies those rates to registered voters, who are all adults. Adults are likely to own phones at a higher rate than a base that includes young children, so the digital and SMS layers are probably understated for that reason too.
- **The offline segment is not a radio audience estimate.** It counts voters without a phone. No Kitui radio listenership data exists in the pack (gap 16), so how many of them radio actually reaches is unknown.
- **Smartphone share is a national figure** and is reported as context only, not applied per ward. Applying a national device mix to a rural county would overstate it.


## By constituency

| Constituency | Voters | Digital | SMS only | No phone | Digital % |
|---|---|---|---|---|---|
| Kitui Central | 77,764 | 10,576 | 22,785 | 44,403 | 13.6% |
| Kitui East | 65,377 | 8,891 | 19,156 | 37,330 | 13.6% |
| Kitui Rural | 55,000 | 7,481 | 16,115 | 31,404 | 13.6% |
| Kitui South | 75,372 | 10,251 | 22,084 | 43,037 | 13.6% |
| Kitui West | 59,047 | 8,030 | 17,301 | 33,716 | 13.6% |
| Mwingi Central | 74,231 | 10,094 | 21,749 | 42,388 | 13.6% |
| Mwingi North | 68,829 | 9,360 | 20,167 | 39,302 | 13.6% |
| Mwingi West | 57,138 | 7,770 | 16,741 | 32,627 | 13.6% |


## Data gaps

- **[DATA NEEDED]** Kitui's row in the KNBS Kenya Housing Survey 2023/24 ICT tables (pack gap 10). This is the single highest-value input for this stage: it replaces a seven-year-old rate with a current one and would materially move every figure above.
- **[DATA NEEDED]** Ward-level 2G/3G/4G coverage (pack gap 20), which would replace the uniform rate with real ward variation.
- **[DATA NEEDED]** Kikamba radio audience by sub-county (pack gap 16), without which the offline segment cannot be converted into a reachable radio audience.
