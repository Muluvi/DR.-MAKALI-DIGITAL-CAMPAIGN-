"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sliders, 
  Calculator, 
  BarChart3, 
  PieChart, 
  Map, 
  ShieldAlert, 
  Users, 
  Coins, 
  Radio, 
  X, 
  Search, 
  Sparkles, 
  Layers, 
  ArrowRight,
  TrendingUp,
  Scale,
  Compass,
  CheckCircle2,
  Maximize2
} from "lucide-react";

import { PollingTrajectorySimulator } from "./markdown/PollingTrajectorySimulator";
import { PathTo200kCalculator } from "./markdown/PathTo200kCalculator";
import { BudgetScenarioModeler } from "./markdown/BudgetScenarioModeler";
import { ConstitutionalBranchNavigator } from "./markdown/ConstitutionalBranchNavigator";
import { CrisisWarRoomMatrix } from "./markdown/CrisisWarRoomMatrix";
import { AudienceSegmentationMatrix } from "./markdown/AudienceSegmentationMatrix";
import { GeographicZoneMatrix } from "./markdown/GeographicZoneMatrix";
import { PublicServiceDeliveryTracker } from "./markdown/PublicServiceDeliveryTracker";
import { MediaRadioLandscapeCard } from "./markdown/MediaRadioLandscapeCard";
import { CampaignOrgChart } from "./markdown/CampaignOrgChart";
import { VoterProjectionsChart } from "./VoterProjectionsChart";
import { WardCartogramBlock } from "./markdown/WardCartogramBlock";
import { CompetitiveQuadrantBlock } from "./markdown/CompetitiveQuadrantBlock";
import { MizaniSlopeBlock } from "./markdown/MizaniSlopeBlock";
import { FiscalAuditChartBlock } from "./markdown/FiscalAuditChartBlock";
import { StrategicPillarsMatrix } from "./markdown/StrategicPillarsMatrix";

export interface ToolItem {
  id: string;
  title: string;
  category: "simulator" | "visualization" | "matrix";
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  badge: string;
  sectionTarget: string;
  component: React.ReactNode;
}

export function InteractiveToolsHubModal({ 
  isOpen, 
  onClose, 
  onNavigateToSection 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onNavigateToSection: (sectionId: string) => void;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"all" | "simulator" | "visualization" | "matrix">("all");
  const [activeToolId, setActiveToolId] = useState<string>("polling-sim");

  const tools: ToolItem[] = useMemo(() => [
    {
      id: "polling-sim",
      title: "Wiper Nomination Polling Trajectory Simulator",
      category: "simulator",
      description: "Interactive slider testing weekly growth rates (+0.4% to +2.5%/wk) against the 40% viability benchmark.",
      icon: TrendingUp,
      badge: "Nomination Sprint",
      sectionTarget: "exec-sec-1-1",
      component: <PollingTrajectorySimulator />
    },
    {
      id: "path-200k",
      title: "\"Path to 200k\" Voter Target Modeler",
      category: "simulator",
      description: "Constituency-by-constituency turnout and vote-share modeler targeting 200,000 winning votes.",
      icon: Calculator,
      badge: "Electoral Math",
      sectionTarget: "exec-sec-2-3",
      component: <PathTo200kCalculator />
    },
    {
      id: "budget-modeler",
      title: "Fiscal Reallocation & Budget Modeler",
      category: "simulator",
      description: "Interactive scenario engine adjusting OSR collection rates and development absorption.",
      icon: Coins,
      badge: "Economic Policy",
      sectionTarget: "strategy-sec-5b",
      component: <BudgetScenarioModeler />
    },
    {
      id: "voter-projections",
      title: "Countywide Voter Projections & Turnout Trends",
      category: "visualization",
      description: "Historical turnout curves juxtaposed against 2027 low, baseline, and surge projections.",
      icon: BarChart3,
      badge: "Electoral Trends",
      sectionTarget: "exec-sec-2-2",
      component: <VoterProjectionsChart />
    },
    {
      id: "ward-cartogram",
      title: "40-Ward Electoral Weight Cartogram",
      category: "visualization",
      description: "Proportional cartographic mapping of all 40 Kitui wards sized by voter density.",
      icon: Map,
      badge: "Cartography",
      sectionTarget: "strategy-sec-6",
      component: <WardCartogramBlock />
    },
    {
      id: "competitive-quadrant",
      title: "Competitive Strategic Positioning Quadrant",
      category: "visualization",
      description: "2D scatter matrix mapping aspirants across public recognition vs. policy governance competence.",
      icon: Compass,
      badge: "Competitor Intel",
      sectionTarget: "exec-sec-3-3",
      component: <CompetitiveQuadrantBlock />
    },
    {
      id: "mizani-slope",
      title: "Mizani Polling Historical Trendlines",
      category: "visualization",
      description: "Multi-wave polling trajectory comparing Dr. Mulu against Dr. Kasalu and Sen. Wambua.",
      icon: Sliders,
      badge: "Polling Audit",
      sectionTarget: "exec-sec-1-2",
      component: <MizaniSlopeBlock />
    },
    {
      id: "fiscal-audit-chart",
      title: "County Fiscal Absorption Breakdown",
      category: "visualization",
      description: "Visual breakdown of recurrent vs. development expenditure and pending bill liabilities.",
      icon: PieChart,
      badge: "Fiscal Audit",
      sectionTarget: "strategy-sec-5",
      component: <FiscalAuditChartBlock />
    },
    {
      id: "crisis-war-room",
      title: "Crisis War Room & Rapid Response Matrix",
      category: "matrix",
      description: "Operational response playbook mapping opposition attack vectors to rapid deployment protocols.",
      icon: ShieldAlert,
      badge: "War Room",
      sectionTarget: "operations-sec-11",
      component: <CrisisWarRoomMatrix />
    },
    {
      id: "audience-matrix",
      title: "Audience Segmentation & Persuasion Matrix",
      category: "matrix",
      description: "Demographic voter personas mapped to tailored messaging angles, channels, and tone.",
      icon: Users,
      badge: "Demographics",
      sectionTarget: "tactics-sec-12",
      component: <AudienceSegmentationMatrix />
    },
    {
      id: "geographic-zones",
      title: "Geographic Zones Strategic Deployment",
      category: "matrix",
      description: "Regional strategic priorities across Central, Northern Arid Belt, and Southern Border corridors.",
      icon: Layers,
      badge: "Regional Ground",
      sectionTarget: "strategy-sec-6a",
      component: <GeographicZoneMatrix />
    },
    {
      id: "service-delivery",
      title: "Public Service Delivery Tracking Matrix",
      category: "matrix",
      description: "Flagship county project scorecard tracking healthcare, water, and agricultural benchmarks.",
      icon: CheckCircle2,
      badge: "Performance Audit",
      sectionTarget: "strategy-sec-5c",
      component: <PublicServiceDeliveryTracker />
    },
    {
      id: "media-radio",
      title: "Vernacular Radio & Media Reach Matrix",
      category: "matrix",
      description: "Kamba-language radio station penetration, prime drive-time slots, and aircover distribution.",
      icon: Radio,
      badge: "Media Strategy",
      sectionTarget: "operations-sec-9c",
      component: <MediaRadioLandscapeCard />
    },
    {
      id: "constitutional-branches",
      title: "Constitutional Devolution Mandate Matrix",
      category: "matrix",
      description: "Inter-governmental checks and executive power allocation mapped across legal frameworks.",
      icon: Scale,
      badge: "Governance Law",
      sectionTarget: "operations-sec-7",
      component: <ConstitutionalBranchNavigator />
    },
    {
      id: "campaign-org",
      title: "Campaign Command & Operations Hierarchy",
      category: "matrix",
      description: "Full organizational blueprint detailing secretariat reporting lines and field team deployment.",
      icon: Users,
      badge: "Command Structure",
      sectionTarget: "operations-sec-10",
      component: <CampaignOrgChart />
    },
    {
      id: "strategic-pillars",
      title: "Four Core Strategic Governance Pillars",
      category: "matrix",
      description: "Detailed manifesto pillars: Fiscal Discipline, Water Infrastructure, Healthcare, and Economic Value-Add.",
      icon: Sparkles,
      badge: "Manifesto Core",
      sectionTarget: "strategy-sec-4",
      component: <StrategicPillarsMatrix />
    }
  ], []);

  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      const matchesSearch = 
        tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.badge.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = 
        selectedCategory === "all" || tool.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [tools, searchQuery, selectedCategory]);

  const activeTool = useMemo(() => {
    return tools.find((t) => t.id === activeToolId) || tools[0];
  }, [tools, activeToolId]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[999] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-dark/80 backdrop-blur-md overflow-hidden print:hidden">
        
        {/* Backdrop click */}
        <div className="absolute inset-0" onClick={onClose} />

        <motion.div 
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-6xl h-[92vh] sm:h-[88vh] bg-card border border-line rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden z-10"
        >
          {/* Header Bar */}
          <div className="p-3.5 sm:p-5 border-b border-line bg-paper/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center font-bold shrink-0">
                <Sliders size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-accent bg-accent/10 px-2 py-0.5 rounded">
                    Strategy Suite
                  </span>
                  <span className="text-[10px] font-mono font-bold text-muted">
                    {tools.length} Interactive Modules
                  </span>
                </div>
                <h3 className="font-serif text-base sm:text-lg font-bold text-ink mt-0.5">
                  Interactive Simulators & Dynamic Visualizations Hub
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                onClick={() => {
                  onClose();
                  onNavigateToSection(activeTool.sectionTarget);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-accent/10 hover:bg-accent text-accent hover:text-white text-xs font-bold transition-all cursor-pointer"
              >
                <span>Jump to Section in Text</span>
                <ArrowRight size={13} />
              </button>

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-xl bg-card border border-line hover:bg-line/40 text-muted hover:text-ink flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Main Workspace: Sidebar + Live Interactive Stage */}
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            
            {/* Left Tools Navigation Rail */}
            <div className="w-full md:w-80 lg:w-96 border-b md:border-b-0 md:border-r border-line flex flex-col bg-paper/30 shrink-0 h-56 md:h-auto overflow-hidden">
              
              {/* Search & Category Filter */}
              <div className="p-3 border-b border-line space-y-2 shrink-0 bg-card">
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search simulators & charts..."
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-paper border border-line rounded-xl text-ink placeholder:text-muted focus:outline-none focus:border-accent"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-ink text-xs">
                      <X size={12} />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none text-[10px] font-bold">
                  {(["all", "simulator", "visualization", "matrix"] as const).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-2.5 py-1 rounded-lg capitalize whitespace-nowrap transition-all cursor-pointer ${
                        selectedCategory === cat
                          ? "bg-accent text-white shadow-xs"
                          : "bg-paper text-muted hover:text-ink border border-line"
                      }`}
                    >
                      {cat === "all" ? "All Tools" : cat === "simulator" ? "Simulators" : cat === "visualization" ? "Charts" : "Matrices"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Scrollable Tool Items List */}
              <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
                {filteredTools.map((tool) => {
                  const Icon = tool.icon;
                  const isActive = activeToolId === tool.id;
                  return (
                    <button
                      key={tool.id}
                      onClick={() => setActiveToolId(tool.id)}
                      className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-start gap-2.5 cursor-pointer ${
                        isActive
                          ? "bg-accent text-white border-accent shadow-md shadow-accent/20"
                          : "bg-card hover:bg-paper border-line/60 text-ink"
                      }`}
                    >
                      <div className={`p-2 rounded-lg shrink-0 ${
                        isActive ? "bg-white/20 text-white" : "bg-accent/10 text-accent"
                      }`}>
                        <Icon size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <span className="text-xs font-bold truncate">
                            {tool.title}
                          </span>
                        </div>
                        <p className={`text-[11px] line-clamp-1 ${isActive ? "text-white/80" : "text-muted"}`}>
                          {tool.description}
                        </p>
                        <span className={`inline-block mt-1 text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.2 rounded ${
                          isActive ? "bg-white/25 text-white" : "bg-line/60 text-muted"
                        }`}>
                          {tool.badge}
                        </span>
                      </div>
                    </button>
                  );
                })}

                {filteredTools.length === 0 && (
                  <div className="p-6 text-center text-xs text-muted">
                    No matching simulator or visualization found.
                  </div>
                )}
              </div>
            </div>

            {/* Right Live Simulation & Interactive Canvas */}
            <div className="flex-1 flex flex-col bg-card overflow-y-auto p-3 sm:p-6">
              <div className="mb-4 flex items-center justify-between border-b border-line pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-accent bg-accent/10 px-2 py-0.5 rounded">
                      {activeTool.badge}
                    </span>
                    <span className="text-xs font-mono text-muted">ID: {activeTool.id}</span>
                  </div>
                  <h2 className="font-serif text-lg sm:text-xl font-bold text-ink mt-1">
                    {activeTool.title}
                  </h2>
                  <p className="text-xs text-muted mt-0.5">
                    {activeTool.description}
                  </p>
                </div>

                <button
                  onClick={() => {
                    onClose();
                    onNavigateToSection(activeTool.sectionTarget);
                  }}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-line hover:border-accent text-xs font-bold text-ink hover:text-accent transition-colors"
                >
                  <Maximize2 size={13} />
                  <span>View in Full Text</span>
                </button>
              </div>

              {/* Dynamic Interactive Component Rendering */}
              <div className="flex-1">
                {activeTool.component}
              </div>
            </div>

          </div>

          {/* Footer Bar */}
          <div className="p-2.5 sm:p-3 border-t border-line bg-paper/60 flex items-center justify-between text-[11px] text-muted shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>All 16 strategic simulators, calculators & dynamic charts fully functional</span>
            </div>
            <div className="font-mono text-[10px] font-semibold hidden sm:block">
              Kitui 2027 Strategic Command Center
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
