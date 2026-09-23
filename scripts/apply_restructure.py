#!/usr/bin/env python3
import os
import re
import sys

MERGER_PLAN = [
  ("presence.md", "presence", ["1A.2.1", "1A.2.2", "1A.2.3"], "1A.2.1", "Audit Scope, Metric Suite & Measurement Window"),
  ("situation.md", "situation", ["3.1.1", "3.1.2", "3.1.3"], "3.1.1", "The Wiper Nomination Contest & Opinion-Poll Mechanism"),
  ("situation.md", "situation", ["3.1.4", "3.1.5", "3.1.5a"], "3.1.4", "Baseline Polling Standings, Deficit Analysis & Home-Base Limits"),
  ("situation.md", "situation", ["3.3.4", "3.3.5"], "3.3.4", "County Demographic Profile, Resource Envelope & Connectivity"),
  ("objectives.md", "objectives", ["4.1.1", "4.1.2"], "4.1.1", "Timeline 1 Commitments: Recognition Lift & Demographic Positioning"),
  ("objectives.md", "objectives", ["4.2.1", "4.2.2", "4.2.3"], "4.2.1", "Timeline 2 Commitments: 40-Ward Turnout DB, Offline Network & Captains"),
  ("audiences.md", "audiences", ["5.1.1", "5.1.2"], "5.1.1", "Rural Primary Producers: Smallholders & Agro-Pastoralists"),
  ("audiences.md", "audiences", ["5.1.4", "5.1.5"], "5.1.4", "Commercial & Public Sector Economy: MSMEs, Traders & Formal Professionals"),
  ("approach.md", "approach", ["6.1.1", "6.1.2", "6.1.3"], "6.1.1", "The Economist Governor Thesis: Empirical Record, Resource Allocation & Rebuttal"),
  ("engine.md", "engine", ["6A.1.1", "6A.1.2", "6A.1.3", "6A.1.4"], "6A.1.1", "The Four Weekly Content Engine Production Pillars"),
  ("messaging.md", "messaging", ["7.2.1", "7.2.2", "7.2.3"], "7.2.1", "Persuasive Framing: Ethical Standards, Core Principles & Worked Examples"),
  ("messaging.md", "messaging", ["7.3.1", "7.3.4"], "7.3.1", "Channel-by-Language Matrix: Kikamba, Kiswahili & English Allocation"),
  ("messaging.md", "messaging", ["7.3.2", "7.3.3"], "7.3.2", "Dialect Standards, Lexical Registers & Editorial Sign-Off"),
  ("scope.md", "scope", ["8.0.1", "8.0.2", "8.0.3"], "8.0.1", "Workstream Governance: RACI Allocation, Scope Exclusions & Tier Scaling"),
  ("scope-platforms.md", "scope-platforms", ["8.1.1", "8.1.2"], "8.1.1", "Platform Operations: Digital Footprint, Organic Content & Targeted Ads"),
  ("scope-platforms.md", "scope-platforms", ["8.2.1", "8.2.2", "8.2.3"], "8.2.1", "Service Delivery Tracker: Objectives, System Architecture & Ingestion Flow"),
  ("scope-platforms.md", "scope-platforms", ["8.2.4", "8.2.5", "8.2.6", "8.2.7"], "8.2.4", "Service Delivery Tracker: UX Specifications, Political Utility & KPIs"),
  ("scope-platforms.md", "scope-platforms", ["8.3.4", "8.3.5", "8.3.6"], "8.3.4", "Content Operations: Production Calendar, Sign-Off Gate & Asset Library"),
  ("scope-platforms.md", "scope-platforms", ["8.4.1", "8.4.2", "8.4.3", "8.4.4"], "8.4.1", "AI-Assisted Creative: Ethical Guardrails, Tooling Stack & Testing Cycle"),
  ("scope-platforms.md", "scope-platforms", ["8.5.1", "8.5.2", "8.5.3", "8.5.4", "8.5.5"], "8.5.1", "Universal Accessibility: Standards, Production Commitments & Verification KPIs"),
  ("scope-media.md", "scope-media", ["8.7.2", "8.7.3"], "8.7.2", "Press Operations: Journalist Engagement & Candidate Broadcast Training"),
  ("scope-media.md", "scope-media", ["8.7.4", "8.7.5"], "8.7.4", "Debate & Forum Playbook: Rules of Engagement & Rebuttal Matrix"),
  ("scope-media.md", "scope-media", ["8.7.7", "8.7.8"], "8.7.7", "Earned Broadcast Strategy: Gatekeeper Circumvention & Data-Led Pitching"),
  ("scope-ground.md", "scope-ground", ["8.8.1", "8.8.2"], "8.8.1", "Ward Intelligence Reporting & The 4-Hour Response Loop"),
  ("scope-ground.md", "scope-ground", ["8.9.1", "8.9.2"], "8.9.1", "Canvassing Architecture: Mobile Synchronization & Doorstep Privacy Controls"),
  ("scope-ground.md", "scope-ground", ["8.10.3", "8.10.4"], "8.10.3", "Interactive Offline Channels: USSD Menus & Pre-Recorded Audio Drops"),
  ("scope-ground.md", "scope-ground", ["8.11.1", "8.11.2", "8.11.3", "8.11.4", "8.11.5"], "8.11.1", "Grassroots Mobilization: Volunteer Tiers, Tooling & Performance KPIs"),
  ("scope-data.md", "scope-data", ["8.12.1", "8.12.2"], "8.12.1", "Voter Data Architecture & Data Protection Act Compliance"),
  ("scope-data.md", "scope-data", ["8.13.1", "8.13.2", "8.13.3", "8.13.4"], "8.13.1", "Voter Scoring Model: Objective, Data Inputs, Methodology & Feature Variables"),
  ("scope-data.md", "scope-data", ["8.13.5", "8.13.6", "8.13.7"], "8.13.5", "Model Operationalization: Validation Metrics, Field Activation & Legal Gate"),
  ("scope-data.md", "scope-data", ["8.14.2", "8.14.3"], "8.14.2", "Technology Procurement: Vendor Matrix, SaaS Risk & Security Controls"),
  ("scope-data.md", "scope-data", ["8.15.1", "8.15.2"], "8.15.1", "Attribution Architecture, Offline Conversions & Media Benchmarks"),
  ("scope-data.md", "scope-data", ["8.15.3", "8.15.4"], "8.15.3", "Analytics Capability Roadmap & Intellectual Property/Data Ownership"),
  ("roadmap.md", "roadmap", ["9.1.5", "9.1.6"], "9.1.5", "Phase 3 & Closeout: GOTV Mobilisation, Audit & Asset Handover"),
  ("roadmap.md", "roadmap", ["9.2.1", "9.2.2", "9.2.3", "9.2.4"], "9.2.1", "Coalition Strategy: Endorsement Sequencing, Partner Protocols & KPIs"),
  ("deliverables.md", "deliverables", ["10.1.1", "10.1.2"], "10.1.1", "Deliverable Tiers: Core, Advanced, and Comprehensive Scope Matrix"),
  ("measurement.md", "measurement", ["11.1.1", "11.1.2", "11.1.3"], "11.1.1", "Two-Stage Campaign Scorecards & 200,000 Vote Indicator Framework"),
  ("measurement.md", "measurement", ["11.2.3", "11.2.4"], "11.2.3", "Performance Governance: Vanity Metric Exclusion & Executive Escalation"),
  ("measurement.md", "measurement", ["11.3.1", "11.3.2"], "11.3.1", "Kitui Message Lab: Operational Structure, Hypotheses & Feedback Loops"),
  ("governance.md", "governance", ["12.1.1", "12.1.2"], "12.1.1", "Operational Governance: Meeting Rhythms, Tooling & RACI Matrix"),
  ("governance.md", "governance", ["12.5.2", "12.5.3"], "12.5.2", "Statutory Framework: CA/NCIC/ODPC Guidelines & Safeguards"),
  ("governance.md", "governance", ["12.5.4", "12.5.5"], "12.5.4", "Digital Ethics Charter & Mandatory Pre-Broadcast Sign-Off Gate"),
  ("risk.md", "risk", ["13.4.1", "13.4.4"], "13.4.1", "Competitive Intelligence: Ethical Boundaries & Current Field Monitoring"),
  ("risk.md", "risk", ["13.5.1", "13.5.2"], "13.5.1", "Electoral Compliance: IEBC Clearance Checklist & Legal Liability Envelope"),
  ("arithmetic.md", "arithmetic", ["3.4.3", "3.4.4"], "3.4.3", "Turnout Modeling: Four Routes to 200k & Decisive Constituency Blocks"),
  ("arithmetic.md", "arithmetic", ["3.5.1", "3.5.2", "3.5.3", "3.5.4"], "3.5.1", "Tri-Zone Regional Geography, Ward Allocations & Strategic Weighting"),
  ("reach.md", "reach", ["3.6.1", "3.6.2"], "3.6.1", "The Electoral Connectivity Divide: Digital Minority vs. Offline Majority"),
  ("reach.md", "reach", ["3.7.1", "3.7.2"], "3.7.1", "Kamba Broadcast Ownership, Editorial Bias & Gatekeeper Bottlenecks"),
  ("annex-evidence.md", "annex-evidence", ["3.2.1", "3.2.2", "3.2.3", "3.2.4"], "3.2.1", "Data Provenance Standard: Source Tiers, Conflict Resolution & Measurement Rigor"),
  ("annex-county.md", "annex-county", ["3.3.8", "3.3.9"], "3.3.8", "County Ecological & Resource Flashpoints: Water, Drought & Mui Basin Coal"),
]

def clean_title(raw):
    # Remove markdown formatting and tags
    t = re.sub(r"\*\((new|updated)\)\*", "", raw, flags=re.I)
    t = t.replace("**", "").replace("*", "").replace("`", "").strip()
    # Strip any trailing punctuation like period or colon
    t = t.rstrip(".:")
    return t

def get_heading_info(line):
    m = re.match(r"^(#{2,3})\s+(.+?)\s*$", line)
    if not m:
        return None
    level = len(m.group(1))
    raw = m.group(2)
    num_m = re.match(r"^(\d+[A-Z]?(?:\.\d+)*[a-z]?)\.?\s+(.+)$", raw, re.I)
    if num_m:
        return {"level": level, "num": num_m.group(1), "title": clean_title(num_m.group(2)), "raw": raw}
    return {"level": level, "num": None, "title": clean_title(raw), "raw": raw}

def process_file(fname, clusters):
    filepath = os.path.join("public/content", fname)
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # If first cluster is already updated, check if already processed
    if clusters and clusters[0][4] in content:
        print(f"Skipping {fname} (already restructured)")
        return

    # Build lookup for clusters
    cluster_by_first = {}
    cluster_by_part = {}
    for c in clusters:
        _, tab, parts, new_num, new_title = c
        cluster_by_first[parts[0]] = c
        for p in parts:
            cluster_by_part[p] = c

    # Split content into chunks by headings: ## or ###
    raw_chunks = re.split(r"(?=^#{2,3}\s+)", content, flags=re.MULTILINE)
    
    # Map each chunk to its part number if it is an H3 with a part number
    parsed_chunks = []
    for c in raw_chunks:
        first_line = c.split("\n", 1)[0] if c else ""
        info = get_heading_info(first_line)
        parsed_chunks.append({
            "chunk": c,
            "first_line": first_line,
            "info": info
        })

    # For fast lookup of chunks by part number
    part_to_chunk = {}
    for p in parsed_chunks:
        if p["info"] and p["info"]["level"] == 3 and p["info"]["num"]:
            part_to_chunk[p["info"]["num"]] = p

    # Now construct the output
    out_chunks = []
    consumed_parts = set()

    for p in parsed_chunks:
        info = p["info"]
        if not info or info["level"] != 3 or not info["num"]:
            # Prelude or H2 or unnumbered heading
            out_chunks.append(p["chunk"])
            continue

        num = info["num"]
        if num in consumed_parts:
            # Already merged into a cluster
            continue

        if num in cluster_by_first:
            # Head of a cluster!
            c = cluster_by_first[num]
            _, tab, parts, new_num, new_title = c
            
            # Combine all parts in cluster
            merged_parts_text = []
            for idx, part_num in enumerate(parts):
                consumed_parts.add(part_num)
                p_chunk_data = part_to_chunk.get(part_num)
                if not p_chunk_data:
                    raise Exception(f"Part {part_num} not found in {fname}")
                
                # Extract body text of this part (lines after the heading)
                lines = p_chunk_data["chunk"].split("\n", 1)
                body = lines[1].strip() if len(lines) > 1 else ""
                
                if idx == 0:
                    # Lead part: add body
                    merged_parts_text.append(body)
                else:
                    # Subsequent part: add bold lead-in followed by body
                    sub_title = p_chunk_data["info"]["title"]
                    # If body is non-empty
                    if body:
                        merged_parts_text.append(f"**{sub_title}.** {body}")
                    else:
                        merged_parts_text.append(f"**{sub_title}.**")

            # Format the merged section
            merged_body = "\n\n".join(merged_parts_text)
            new_section = f"### {new_num} {new_title}\n\n{merged_body}\n\n"
            out_chunks.append(new_section)

        elif num in cluster_by_part:
            # This is a subsequent part of a cluster whose head has not appeared or already appeared
            # (e.g. 7.3.4 in messaging.md)
            # If it has not been consumed yet, it means its head comes later?
            # For 7.3.4, head 7.3.1 comes BEFORE 7.3.4, so 7.3.4 will already be in consumed_parts!
            continue
        else:
            # Standalone preserved section
            out_chunks.append(p["chunk"])

    new_content = "".join(out_chunks)
    # Normalize excessive newlines at end of file
    new_content = new_content.rstrip() + "\n"
    
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(new_content)
    print(f"Updated {fname}")

def main():
    # Group merger plan by file
    by_file = {}
    for item in MERGER_PLAN:
        by_file.setdefault(item[0], []).append(item)

    for fname, clusters in by_file.items():
        process_file(fname, clusters)

    print("All markdown files successfully restructured!")

if __name__ == "__main__":
    main()
