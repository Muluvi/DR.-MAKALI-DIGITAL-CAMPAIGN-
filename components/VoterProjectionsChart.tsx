"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, Cell, AreaChart, Area 
} from "recharts";
import { Users, BarChart3, TrendingUp, Filter, Map, ChevronRight } from "lucide-react";

interface SubCountyData {
  subCounty: string;
  population: number;
  density: number;
  households: number;
  region: "Anchor" | "Mwingi Block" | "Arid Belt";
}

interface WardVoterData {
  ward: string;
  constituency: "Kitui Central" | "Kitui South";
  voters: number;
}

const subCountyDataset: SubCountyData[] = [
  // Anchor
  { subCounty: "Kitui Central", population: 105991, density: 251, households: 29057, region: "Anchor" },
  { subCounty: "Kitui West", population: 70871, density: 170, households: 17497, region: "Anchor" },
  { subCounty: "Katulani", population: 47108, density: 146, households: 12170, region: "Anchor" },
  // Mwingi Block
  { subCounty: "Mwingi Central", population: 108713, density: 95, households: 26753, region: "Mwingi Block" },
  { subCounty: "Kyuso", population: 76867, density: 30, households: 15993, region: "Mwingi Block" },
  { subCounty: "Mumoni", population: 29344, density: 48, households: 6496, region: "Mwingi Block" },
  { subCounty: "Tseikuru", population: 40871, density: 30, households: 8579, region: "Mwingi Block" },
  // Arid Belt
  { subCounty: "Mutomo", population: 113356, density: 40, households: 23044, region: "Arid Belt" },
  { subCounty: "Ikutha", population: 82964, density: 9, households: 16679, region: "Arid Belt" },
  { subCounty: "Mwingi East", population: 85139, density: 25, households: 18730, region: "Arid Belt" },
  { subCounty: "Mutitu", population: 55287, density: 12, households: 11521, region: "Arid Belt" },
  { subCounty: "Migwani", population: 79255, density: 125, households: 19096, region: "Arid Belt" }
];

const wardVoterDataset: WardVoterData[] = [
  // Kitui Central Wards
  { ward: "Township", constituency: "Kitui Central", voters: 19538 },
  { ward: "Kyangwithya W", constituency: "Kitui Central", voters: 15931 },
  { ward: "Kyangwithya E", constituency: "Kitui Central", voters: 15401 },
  { ward: "Mulango", constituency: "Kitui Central", voters: 15135 },
  { ward: "Miambani", constituency: "Kitui Central", voters: 11759 },
  // Kitui South Wards
  { ward: "Athi", constituency: "Kitui South", voters: 15843 },
  { ward: "Ikanga/Kyatune", constituency: "Kitui South", voters: 15384 },
  { ward: "Mutomo/Kibwea", constituency: "Kitui South", voters: 12637 },
  { ward: "Ikutha", constituency: "Kitui South", voters: 12066 },
  { ward: "Mutha", constituency: "Kitui South", voters: 11039 },
  { ward: "Kanziko", constituency: "Kitui South", voters: 8403 }
];

const formatNumber = (num: number) => num.toLocaleString();

const CustomChartTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-line p-3.5 shadow-xl rounded-2xl text-xs space-y-1 backdrop-blur-md">
        <p className="font-bold text-ink text-sm border-b border-line pb-1 mb-1">{label}</p>
        {payload.map((p: any, idx: number) => (
          <p key={idx} style={{ color: p.color }} className="font-semibold flex justify-between gap-4">
            <span className="capitalize">{p.name}:</span>
            <span className="text-ink font-bold">{formatNumber(p.value)}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function VoterProjectionsChart() {
  const [activeTab, setActiveTab] = useState<"demographics" | "voters">("demographics");
  const [selectedRegion, setSelectedRegion] = useState<"All" | "Anchor" | "Mwingi Block" | "Arid Belt">("All");
  const [activeMetric, setActiveMetric] = useState<"population" | "density" | "households">("population");
  const [chartType, setChartType] = useState<"bar" | "line" | "area">("bar");

  // Filtering sub-county demographics
  const filteredSubCounties = subCountyDataset.filter(
    item => selectedRegion === "All" || item.region === selectedRegion
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-card border-x-0 sm:border border-y sm:border-line rounded-none sm:rounded-3xl overflow-hidden shadow-none sm:shadow-md transition-all"
    >
      {/* Header Info Banner */}
      <div className="p-4 sm:p-5 border-b border-line bg-gradient-to-r from-accent/5 via-transparent to-transparent">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="inline-flex items-center gap-1 t-label tracking-[0.14em] uppercase text-accent font-extrabold px-2.5 py-0.5 rounded-full bg-accent/10">
              Quantitative Insights
            </span>
            <h3 className="font-serif text-2xl font-bold text-ink mt-1.5 leading-tight">
              Constituency Demographics &amp; Voter Distribution
            </h3>
            <p className="text-xs text-muted mt-0.5">
              Interactive datasets synthesized directly from Section 2.4 of the proposal.
            </p>
          </div>

          {/* Quick Selector for Major Dataset */}
          <div className="flex p-1 bg-paper border border-line rounded-xl self-start sm:self-center">
            <button
              onClick={() => setActiveTab("demographics")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === "demographics" ? "bg-accent text-white shadow-sm" : "text-muted hover:text-ink"
              }`}
            >
              <Users size={14} />
              <span>Sub-County</span>
            </button>
            <button
              onClick={() => setActiveTab("voters")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === "voters" ? "bg-accent text-white shadow-sm" : "text-muted hover:text-ink"
              }`}
            >
              <BarChart3 size={14} />
              <span>Ward Registered</span>
            </button>
          </div>
        </div>
      </div>

      {/* Control Strip & Interactive Filters */}
      <div className="p-4 bg-paper/30 border-b border-line grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        {/* Metric Selector for Demographics Tab */}
        <div className="md:col-span-4 flex items-center gap-2">
          {activeTab === "demographics" ? (
            <div className="flex gap-1 w-full">
              {(["population", "density", "households"] as const).map((metric) => (
                <button
                  key={metric}
                  onClick={() => setActiveMetric(metric)}
                  className={`flex-1 py-1.5 rounded-lg t-label sm:text-xs font-bold uppercase tracking-wider border transition-all cursor-pointer text-center ${
                    activeMetric === metric 
                      ? "bg-accent/10 text-accent border-accent/30" 
                      : "bg-card text-muted border-line hover:border-accent/30"
                  }`}
                >
                  {metric === "density" ? "Density/km²" : metric}
                </button>
              ))}
            </div>
          ) : (
            <div className="text-xs font-bold text-muted flex items-center gap-1.5">
              <ChevronRight size={14} className="text-accent" />
              <span>Voter thresholds across major baseline wards (2022)</span>
            </div>
          )}
        </div>

        {/* Region Filters (Visible on Demographics) */}
        <div className="md:col-span-5 flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
          <Filter size={13} className="text-muted shrink-0 hidden sm:block" />
          {activeTab === "demographics" ? (
            <div className="flex gap-1">
              {(["All", "Anchor", "Mwingi Block", "Arid Belt"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setSelectedRegion(r)}
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors border cursor-pointer ${
                    selectedRegion === r
                      ? "bg-accent text-white border-accent"
                      : "bg-card text-muted border-line hover:bg-paper"
                  }`}
                >
                  {r === "All" ? "All Zones" : r}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex gap-1">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-accent/5 text-accent border border-accent/20">
                Anchor Zone
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gold/5 text-gold border border-gold/20">
                Arid Belt
              </span>
            </div>
          )}
        </div>

        {/* Chart View Toggle (Line, Area, Bar) */}
        <div className="md:col-span-3 flex justify-end gap-1">
          {(["bar", "line", "area"] as const).map((type) => (
            <button
              key={type}
              onClick={() => setChartType(type)}
              className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                chartType === type 
                  ? "bg-accent text-white border-accent shadow-sm" 
                  : "bg-card text-muted border-line hover:border-accent/40"
              }`}
              title={`Switch to ${type} chart`}
            >
              {type === "bar" && <BarChart3 size={14} />}
              {type === "line" && <TrendingUp size={14} />}
              {type === "area" && <Map size={14} />}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div className="p-4 sm:p-6 bg-card">
        <div className="h-[260px] sm:h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            {activeTab === "demographics" ? (
              chartType === "bar" ? (
                <BarChart data={filteredSubCounties} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-line)" opacity={0.5} />
                  <XAxis dataKey="subCounty" tick={{ fill: "var(--color-muted)", fontSize: 10 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fill: "var(--color-muted)", fontSize: 10 }} tickLine={false} axisLine={false} width={45} tickFormatter={(val) => val >= 1000 ? `${(val/1000).toFixed(0)}k` : val} />
                  <Tooltip content={<CustomChartTooltip />} cursor={{ fill: "var(--color-glow)" }} />
                  <Bar dataKey={activeMetric} fill="var(--color-accent)" radius={[6, 6, 0, 0]} name={activeMetric === "density" ? "Density/km²" : activeMetric}>
                    {filteredSubCounties.map((entry, idx) => {
                      const color = entry.region === "Anchor" ? "var(--color-accent)" : entry.region === "Mwingi Block" ? "var(--color-gold)" : "var(--color-danger)";
                      return <Cell key={`cell-${idx}`} fill={color} />;
                    })}
                  </Bar>
                </BarChart>
              ) : chartType === "line" ? (
                <LineChart data={filteredSubCounties} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-line)" opacity={0.5} />
                  <XAxis dataKey="subCounty" tick={{ fill: "var(--color-muted)", fontSize: 10 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fill: "var(--color-muted)", fontSize: 10 }} tickLine={false} axisLine={false} width={45} tickFormatter={(val) => val >= 1000 ? `${(val/1000).toFixed(0)}k` : val} />
                  <Tooltip content={<CustomChartTooltip />} />
                  <Line type="monotone" dataKey={activeMetric} stroke="var(--color-accent)" strokeWidth={3} dot={{ stroke: "var(--color-accent)", strokeWidth: 2, r: 4 }} name={activeMetric === "density" ? "Density/km²" : activeMetric} />
                </LineChart>
              ) : (
                <AreaChart data={filteredSubCounties} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-line)" opacity={0.5} />
                  <XAxis dataKey="subCounty" tick={{ fill: "var(--color-muted)", fontSize: 10 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fill: "var(--color-muted)", fontSize: 10 }} tickLine={false} axisLine={false} width={45} tickFormatter={(val) => val >= 1000 ? `${(val/1000).toFixed(0)}k` : val} />
                  <Tooltip content={<CustomChartTooltip />} />
                  <Area type="monotone" dataKey={activeMetric} stroke="var(--color-accent)" fill="var(--color-glow)" strokeWidth={2} name={activeMetric === "density" ? "Density/km²" : activeMetric} />
                </AreaChart>
              )
            ) : (
              chartType === "bar" ? (
                <BarChart data={wardVoterDataset} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-line)" opacity={0.5} />
                  <XAxis dataKey="ward" tick={{ fill: "var(--color-muted)", fontSize: 10 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fill: "var(--color-muted)", fontSize: 10 }} tickLine={false} axisLine={false} width={45} tickFormatter={(val) => `${(val/1000).toFixed(0)}k`} />
                  <Tooltip content={<CustomChartTooltip />} cursor={{ fill: "var(--color-glow)" }} />
                  <Bar dataKey="voters" fill="var(--color-accent)" radius={[6, 6, 0, 0]} name="Registered Voters">
                    {wardVoterDataset.map((entry, idx) => {
                      const color = entry.constituency === "Kitui Central" ? "var(--color-accent)" : "var(--color-gold)";
                      return <Cell key={`cell-${idx}`} fill={color} />;
                    })}
                  </Bar>
                </BarChart>
              ) : chartType === "line" ? (
                <LineChart data={wardVoterDataset} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-line)" opacity={0.5} />
                  <XAxis dataKey="ward" tick={{ fill: "var(--color-muted)", fontSize: 10 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fill: "var(--color-muted)", fontSize: 10 }} tickLine={false} axisLine={false} width={45} tickFormatter={(val) => `${(val/1000).toFixed(0)}k`} />
                  <Tooltip content={<CustomChartTooltip />} />
                  <Line type="monotone" dataKey="voters" stroke="var(--color-gold)" strokeWidth={3} dot={{ stroke: "var(--color-gold)", strokeWidth: 2, r: 4 }} name="Registered Voters" />
                </LineChart>
              ) : (
                <AreaChart data={wardVoterDataset} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-line)" opacity={0.5} />
                  <XAxis dataKey="ward" tick={{ fill: "var(--color-muted)", fontSize: 10 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fill: "var(--color-muted)", fontSize: 10 }} tickLine={false} axisLine={false} width={45} tickFormatter={(val) => `${(val/1000).toFixed(0)}k`} />
                  <Tooltip content={<CustomChartTooltip />} />
                  <Area type="monotone" dataKey="voters" stroke="var(--color-gold)" fill="rgba(200, 148, 62, 0.2)" strokeWidth={2} name="Registered Voters" />
                </AreaChart>
              )
            )}
          </ResponsiveContainer>
        </div>

        {/* Legend / Key indicators summary */}
        <div className="mt-4 pt-4 border-t border-line flex flex-wrap justify-center sm:justify-start gap-x-5 gap-y-2 t-small font-bold">
          {activeTab === "demographics" ? (
            <>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-accent" />
                <span className="text-muted">Anchor Zone (Kitui Central / West)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-gold" />
                <span className="text-muted">Mwingi Block</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-danger" />
                <span className="text-muted">Arid &amp; Resource Belt</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-accent" />
                <span className="text-muted">Kitui Central Wards</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-gold" />
                <span className="text-muted">Kitui South Wards (Arid Block)</span>
              </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
