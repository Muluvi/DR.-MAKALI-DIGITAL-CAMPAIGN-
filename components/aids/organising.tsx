"use client";

import { Calendar } from "lucide-react";

/**
 * Ground organising — the SMS feedback stream and the community forum scheduler.
 *
 * Split out of the 560-line components/StrategicAids.tsx, which held thirteen unrelated
 * components in one module — the one file in this repo that broke the one-component-per-file
 * convention every other directory follows.
 */

// 8. Grassroots Feedback Visualizer (SMS feed logs)
export function SMSFeedbackVisualizer() {
  const logs = [
    { sender: "+254 712 *** 324", text: "When is the next market Baraza in Kitui South? We need details on the local co-op loans.", time: "10:14 AM" },
    { sender: "+254 723 *** 892", text: "Loved the radio spot on Kikamba yesterday, the economic blueprint sounds realistic.", time: "11:02 AM" }
  ];

  return (
    <div className="bg-card border border-line rounded-2xl p-4 sm:p-5 shadow-sm my-6 space-y-3">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-serif text-sm font-bold text-ink">Grassroots USSD Message Feed</h4>
        <span className="t-micro font-black text-gold bg-gold/10 border border-gold/20 px-2 py-0.5 rounded uppercase">Verified Ingestion Feed</span>
      </div>
      
      <div className="space-y-3">
        {logs.map((log, idx) => (
          <div key={idx} className="p-3 bg-paper border border-line rounded-xl">
            <div className="flex justify-between t-label font-extrabold text-muted mb-1.5 uppercase">
              <span>{log.sender}</span>
              <span>{log.time}</span>
            </div>
            <p className="text-xs text-ink/90 leading-snug font-medium italic">&ldquo;{log.text}&rdquo;</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// 9. Interactive Community Forum Scheduler
export function CommunityScheduler() {
  const events = [
    { title: "Kitui West Cooperative Assembly", date: "Sept 12, 2026", time: "10:00 AM", location: "Kabati Market Square" },
    { title: "Mwingi Central Town Hall Gathering", date: "Sept 18, 2026", time: "2:00 PM", location: "Mwingi Town Council" }
  ];

  return (
    <div className="bg-card border border-line rounded-2xl p-4 sm:p-5 shadow-sm my-6 space-y-3">
      <h4 className="font-serif text-sm font-bold text-ink mb-1">Upcoming Market Assembly Schedules</h4>
      <div className="space-y-3">
        {events.map((ev, i) => (
          <div key={i} className="flex gap-3 bg-paper border border-line p-3 rounded-xl hover:border-accent/30 transition-all">
            <div className="p-2.5 bg-card border border-line rounded-lg text-accent self-start shrink-0">
              <Calendar size={16} />
            </div>
            <div>
              <h5 className="font-serif text-xs font-black text-ink leading-tight">{ev.title}</h5>
              <div className="flex flex-wrap gap-x-3 gap-y-1 t-label font-extrabold text-muted mt-1 uppercase">
                <span>{ev.date}</span>
                <span>{ev.time}</span>
                <span className="text-accent">{ev.location}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
