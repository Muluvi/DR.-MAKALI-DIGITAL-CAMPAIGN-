# Stage 9 — Channel reach estimate

How many voters each channel can physically reach, by ward.

*Kitui 2027 analysis pipeline · data as of 2026-09-16 · generated 2026-09-25*

![Where five years of connectivity growth went](../outputs/charts/09_reach_shift.svg)

*Where five years of connectivity growth went*

![Modelled reach by channel, all 40 wards](../outputs/charts/09_reach_by_ward.svg)

*Modelled reach by channel, all 40 wards*


## The finding

- **The digital layer has roughly doubled.** 158,696 voters are reachable by smartphone or data on the 2023/24 rates, against 82,378 on the 2019 rates. The proposal's claim that digital reaches about one voter in seven is out of date: it is now closer to one in four.
- **The SMS-only layer has nearly halved,** from 177,473 to 108,419. This is the finding that should change a budget.
- **Phone ownership barely moved — and that is the explanation.** It went from 42.9% to 44.1% in five years, up 1.2 points, while internet use went from 13.6% to 26.2%, up 12.6 points. Almost all the growth came from people who already had a phone getting online, not from new phone owners. The SMS-only group did not go offline; it moved to the digital layer.
- **The offline majority is intact.** 338,588 voters (56%) own no phone at all and are reachable only by radio, print or in person. That is the largest single segment by a wide margin, and the proposal's central strategic argument survives this update unharmed.


## What this means for the channel mix

The proposal weights communications 82% offline and 18% digital, and caps digital explicitly because it reaches only 13.6% of the county. That cap rests on a rate that is now superseded. On current figures the digital layer is the second-largest segment, not a rounding error, and the SMS layer it was being weighted against is the smallest of the three.

This is not an argument for a digital-first campaign. The no-phone segment is still larger than the other two combined, and radio still reaches what nothing else can. It is an argument that the **split between SMS and digital** was set against the wrong numbers, and that SMS in particular is carrying a weight its addressable audience no longer supports.


## County totals

| Segment | 2019 rates | 2023/24 rates | Change | Share now |
|---|---|---|---|---|
| Smartphone or data | 82,378 | 158,696 | +76,318 | 26.2% |
| SMS only (phone, no data) | 177,473 | 108,419 | -69,054 | 17.9% |
| No phone — radio or in person | 345,852 | 338,588 | -7,264 | 55.9% |

Both columns use the same denominator — the confirmed July 2026 register of 605,703 voters — so the only thing changing between them is the rate pair.


## The rates, and where they come from

| Rate | Value | Year | Tier | Status |
|---|---|---|---|---|
| Internet use, Kitui | 26.2% | 2023-24 | T1 | in use — supersedes 2019 |
| Phone ownership, Kitui | 44.1% | 2023-24 | T1 | in use — supersedes 2019 |
| Internet use, Kitui | 13.6% | 2019 | T2 | superseded — shown for comparison |
| Phone ownership, Kitui | 42.9% | 2019 | T2 | superseded — shown for comparison |
| Internet use, national | 35.0% | 2023/24 | T2 | context |
| Phone ownership, national rural | 48.6% | 2023/24 | T2 | context |
| Smartphone share of connections | 59.7% | 2025-26 | T2 | context — national, not applied per ward |

Kitui's 26.2% sits just above the 25.0% rural mean and well below the 35.0% national rate. Its 44.1% phone ownership sits 4.5 points below the 48.6% rural mean. Neither is an outlier, which is a reason to trust them.


## What the SMS layer can and cannot carry

- **Bulk political SMS is English or Kiswahili only** under the CA/NCIC guidelines [S54]. Kikamba is not available on this layer at all.
- **Messages must be lodged with the operator 48 hours in advance** [S53], with verbatim text and a signed authorisation. Rapid response by SMS is therefore not possible.
- **Operators may refuse non-compliant messages** [S54]. The lodging window is also the rejection window.
- **NG-CDF and bursary beneficiary lists cannot become an SMS list** [S57]. Consented opt-in is the only lawful route, which makes list building an objective in its own right — and a harder one now that the addressable SMS-only group is 108,419 rather than 177,473.


## Limits

- **The rates are applied uniformly to all 40 wards.** No ward-level connectivity data exists, so ward variation here reflects electorate size only. Township and Tharaka get the same rate, which is certainly wrong — and more wrong now than before, because the urban-rural gap in the same survey is 56.6% against 25.0%.
- **Ward electorates are the 2026 county total distributed on 2022 ward shares.** The 2026 register is published at county level only. Growth was uneven, so ward figures are indicative; county figures are not affected by this.
- **The denominators do not match the rates.** KNBS measured persons aged 3 and above; these rates are applied to registered voters, who are all adults. Adults own phones at a higher rate than a base including young children, so the digital and SMS layers are probably understated.
- **The offline segment is not a radio audience estimate.** It counts voters without a phone. No Kitui radio listenership data exists, so how many of them radio actually reaches is unknown.


## A contradiction on the site

The proposal's prose states 13.6% internet use and an 86.4% offline majority in several sections, and sizes the channel mix against them. Those figures are now superseded. This pipeline does not edit the site's prose, so the contradiction stands until someone resolves it: the data blocks show 26.2% while the surrounding text says 13.6%.

The fix is not simply a find-and-replace. The 86.4% offline figure is used as the rhetorical spine of Section 3.6 and the justification for the 82/18 weighting. Updating the rate without revisiting that argument would leave the conclusion standing on a number that no longer supports it.


## Data gaps

- **[DATA NEEDED]** Ward-level 2G/3G/4G coverage (pack gap 20). This is now the binding gap for this stage: the county rate is confirmed, but the urban-rural spread within Kitui is not, and the same survey shows a 31-point gap nationally between urban and rural.
- **[DATA NEEDED]** Kikamba radio audience by sub-county (pack gap 16), without which the offline segment cannot be converted into a reachable radio audience.
- **[DATA NEEDED]** The 2026 register by ward, which would remove the 2022-shares distribution.
