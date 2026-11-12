/**
 * The role guides on /help: what each role does on the platform, in English and Kiswahili.
 *
 * The English is the reference. The Kiswahili was drafted by Firefly and has not yet been reviewed
 * by a native speaker; the page says so until `SW_REVIEWED` is set true after that review. Each
 * step names the page it happens on, so a guide cannot drift from the site without a broken link
 * showing it.
 */

export type Step = { href: string; en: string; sw: string };
export type Guide = { id: string; en: string; sw: string; steps: Step[] };

/** Set true once a native Kiswahili speaker has reviewed every `sw` line. */
export const SW_REVIEWED = false;

export const GUIDES: Guide[] = [
  {
    id: "anyone",
    en: "Anyone briefing the candidate",
    sw: "Yeyote anayemwandalia mgombea taarifa",
    steps: [
      { href: "/explore", en: "Look up a figure in Explore data. Quote it with the source and date shown beside it.", sw: "Tafuta takwimu katika Explore data. Inukuu pamoja na chanzo na tarehe zilizoonyeshwa kando yake." },
      { href: "/tools/ward-dossier", en: "Open the ward's dossier before a meeting there: register, stations, population and area.", sw: "Fungua taarifa ya wodi kabla ya mkutano huko: idadi ya wapiga kura, vituo, idadi ya watu na eneo." },
      { href: "/models/record-finder", en: "Use the record finder to see the county projects you can cite in that ward, with the page to cite.", sw: "Tumia record finder kuona miradi ya kaunti unayoweza kutaja katika wodi hiyo, pamoja na ukurasa wa kunukuu." },
    ],
  },
  {
    id: "ward",
    en: "Ward coordinators",
    sw: "Waratibu wa wodi",
    steps: [
      { href: "/tools/ward-dossier", en: "Open your ward's page once while you have signal. It stays readable on your phone offline afterwards.", sw: "Fungua ukurasa wa wodi yako mara moja ukiwa na mtandao. Utaendelea kusomeka kwenye simu yako hata bila mtandao." },
      { href: "/workspace", en: "File what the ward is saying in Field and sentiment: the issue, where, and how widely it is heard. Never a name or a phone number; the form refuses them.", sw: "Andika kile wodi inachosema katika Field and sentiment: suala, mahali, na jinsi linavyosikika. Kamwe usiandike jina wala namba ya simu; fomu inazikataa." },
      { href: "/workspace", en: "If something is spreading against the campaign, tell your constituency coordinator at once; the rapid-response desk logs it.", sw: "Kitu kikienea dhidi ya kampeni, mjulishe mratibu wa eneo bunge mara moja; dawati la majibu ya haraka litakirekodi." },
    ],
  },
  {
    id: "constituency",
    en: "Constituency coordinators",
    sw: "Waratibu wa maeneo bunge",
    steps: [
      { href: "/workspace", en: "Check your wards' field reports each day, and add your own status for the constituency.", sw: "Kagua ripoti za wodi zako kila siku, na uongeze hali ya eneo bunge lako." },
      { href: "/models/polling-agents", en: "Plan agent headcount for your wards from the official station count.", sw: "Panga idadi ya mawakala kwa wodi zako kutokana na idadi rasmi ya vituo." },
      { href: "/progress", en: "Keep the implementation tracker current for anything your constituency owns.", sw: "Hakikisha implementation tracker iko sahihi kwa kila jambo ambalo eneo bunge lako linasimamia." },
    ],
  },
  {
    id: "comms",
    en: "Communications",
    sw: "Mawasiliano",
    steps: [
      { href: "/workspace", en: "Submit the week's content calendar on Friday for approval. A Kikamba item needs the native speaker's review before it can be approved.", sw: "Wasilisha ratiba ya maudhui ya wiki Ijumaa ili iidhinishwe. Kipengele cha Kikamba kinahitaji ukaguzi wa mzungumzaji asilia kabla ya kuidhinishwa." },
      { href: "/models/send-check", en: "Run the send check before any SMS, then log the send in the dispatch log before it goes.", sw: "Tumia send check kabla ya SMS yoyote, kisha andika utumaji katika dispatch log kabla haujatoka." },
      { href: "/models/response-tier", en: "When an attack appears, find its tier and the holding line, and log it on the rapid-response desk. Draft the reply elsewhere: the desk is open to anyone with the link.", sw: "Shambulio likitokea, tafuta kiwango chake na msimamo wa awali, kisha liandike kwenye dawati la majibu ya haraka. Andaa jibu mahali pengine: dawati liko wazi kwa yeyote mwenye kiungo." },
    ],
  },
  {
    id: "data",
    en: "Data and reporting",
    sw: "Takwimu na ripoti",
    steps: [
      { href: "/workspace", en: "Enter each KPI value mid-week in the KPI tracker, and review it against its target.", sw: "Ingiza thamani ya kila KPI katikati ya wiki katika KPI tracker, na uilinganishe na lengo lake." },
      { href: "/edit-data", en: "When an official release lands, update the figure in the data editor. The site's checks run before it goes live.", sw: "Takwimu rasmi zikitolewa, sasisha takwimu katika data editor. Ukaguzi wa tovuti hufanyika kabla haijaonekana." },
      { href: "/history", en: "If a change was wrong, revert it from the change history. The revert is logged too.", sw: "Mabadiliko yakiwa na kosa, yarudishe kutoka kwenye change history. Urejeshaji nao hurekodiwa." },
    ],
  },
  {
    id: "director",
    en: "Campaign director",
    sw: "Mkurugenzi wa kampeni",
    steps: [
      { href: "/tools/race-calendar", en: "Check the next statutory date, and export the calendar to your phone.", sw: "Angalia tarehe inayofuata ya kisheria, na upakue kalenda kwenye simu yako." },
      { href: "/workspace", en: "Approve the content calendar and close incidents. An incident is marked responded only with a named approver.", sw: "Idhinisha ratiba ya maudhui na ufunge matukio. Tukio huwekwa kuwa limejibiwa tu likiwa na mwidhinishaji aliyetajwa." },
      { href: "/dashboards", en: "Read the dashboards before the weekly meeting, and log decisions and owners in the meetings record afterwards.", sw: "Soma dashibodi kabla ya mkutano wa kila wiki, na uandike maamuzi na wahusika katika kumbukumbu za mikutano baadaye." },
    ],
  },
];
