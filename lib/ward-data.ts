// Ward-level register data for the cartogram (Section 2.3 / 7). Constituency names, voter
// totals and ward lists mirror the dataset already in the repo (components/StrategicAids.tsx,
// VoterDensityMap) — the same 8-constituency, 40-ward structure whose totals sum to the
// documented 532,758 countywide register.
//
// Per-ward voter counts are only set where the source markdown states an exact figure
// (Section 7.1 for Kitui Central, Section 7.3 for Kitui South, Section 2.3 for the two
// highlighted wards in Mwingi North). Every other ward is left `voters: null` — the register is
// described in Section 2.3 as "fully integrated as our primary planning dataset," but the
// document itself only itemises these 13 of 40 wards, so the rest render as a marked gap
// rather than an invented number.
export interface Ward {
  name: string;
  voters: number | null;
}

export interface Constituency {
  id: string;
  name: string;
  voters: number;
  wards: Ward[];
}

export const CONSTITUENCIES: Constituency[] = [
  {
    id: "kitui-central",
    name: "Kitui Central",
    voters: 77764,
    wards: [
      { name: "Township", voters: 19538 },
      { name: "Kyangwithya West", voters: 15931 },
      { name: "Kyangwithya East", voters: 15401 },
      { name: "Mulango", voters: 15135 },
      { name: "Miambani", voters: 11759 },
    ],
  },
  {
    id: "kitui-south",
    name: "Kitui South",
    voters: 75372,
    wards: [
      { name: "Athi", voters: 15843 },
      { name: "Ikanga/Kyatune", voters: 15384 },
      { name: "Mutomo/Kibwea", voters: 12637 },
      { name: "Ikutha", voters: 12066 },
      { name: "Mutha", voters: 11039 },
      { name: "Kanziko", voters: 8403 },
    ],
  },
  {
    id: "mwingi-central",
    name: "Mwingi Central",
    voters: 74231,
    wards: [
      { name: "Central", voters: null },
      { name: "Kivou", voters: null },
      { name: "Nguni", voters: null },
      { name: "Nuu", voters: null },
      { name: "Mui", voters: null },
      { name: "Waita", voters: null },
    ],
  },
  {
    id: "mwingi-north",
    name: "Mwingi North",
    voters: 68829,
    wards: [
      { name: "Ngomeni", voters: null },
      { name: "Kyuso", voters: 19921 },
      { name: "Mumoni", voters: null },
      { name: "Tseikuru", voters: null },
      { name: "Tharaka", voters: 7429 },
    ],
  },
  {
    id: "kitui-east",
    name: "Kitui East",
    voters: 65377,
    wards: [
      { name: "Zombe/Mwitika", voters: null },
      { name: "Nzambani", voters: null },
      { name: "Chuluni", voters: null },
      { name: "Voo/Kyamatu", voters: null },
      { name: "Endau/Malalani", voters: null },
      { name: "Mutito/Kaliku", voters: null },
    ],
  },
  {
    id: "kitui-west",
    name: "Kitui West",
    voters: 59047,
    wards: [
      { name: "Mutonguni", voters: null },
      { name: "Kauwi", voters: null },
      { name: "Matinyani", voters: null },
      { name: "Kwa Mutonga/Kithumula", voters: null },
    ],
  },
  {
    id: "mwingi-west",
    name: "Mwingi West",
    voters: 57138,
    wards: [
      { name: "Kyome/Thaana", voters: null },
      { name: "Nguutani", voters: null },
      { name: "Migwani", voters: null },
      { name: "Kiomo/Kyethani", voters: null },
    ],
  },
  {
    id: "kitui-rural",
    name: "Kitui Rural",
    voters: 55000,
    wards: [
      { name: "Kisasi", voters: null },
      { name: "Mbitini", voters: null },
      { name: "Kwavonza/Yatta", voters: null },
      { name: "Kanyangi", voters: null },
    ],
  },
];

export const TOTAL_WARDS = CONSTITUENCIES.reduce((sum, c) => sum + c.wards.length, 0);
export const ITEMISED_WARDS = CONSTITUENCIES.reduce((sum, c) => sum + c.wards.filter((w) => w.voters !== null).length, 0);
