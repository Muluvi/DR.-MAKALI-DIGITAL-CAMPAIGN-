import React from "react";

/**
 * §13.1 Rapid-Response Decision & Escalation Flow diagram.
 *
 * Replaces the 80-column ASCII box-drawing diagram with an inline SVG flow architecture.
 * Reflows legibly across viewports from 360px phones up to wide desktop screens without
 * horizontal scrolling or loss of information.
 */
export function RapidResponseFlowDiagram() {
  return (
    <figure
      role="img"
      aria-labelledby="rr-flow-title rr-flow-desc"
      className="not-prose my-6 rounded-2xl border border-line bg-card p-3 sm:p-5 shadow-sm"
    >
      {/* Desktop & Tablet Layout (>= 640px) */}
      <svg
        className="hidden sm:block w-full h-auto overflow-visible"
        viewBox="0 0 740 310"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <title id="rr-flow-title">RAPID RESPONSE DECISION &amp; ESCALATION FLOW</title>
        <desc id="rr-flow-desc">
          Four monitoring feeds (Morning Radio, WhatsApp Groups, Social Listening, 400 Ward Capts)
          route via a directional arrow into the Response Decision Tree (Reach, Source, Virality Check).
          The decision tree routes directly into Response Channels (Radio Live Call, Ward SMS Alert,
          WhatsApp Audio, Fact-Check Card), and routes downward into the Legal / Defamation Gateway
          (OAG, Hansard, KNBS Verification) which clears verified factual rebuttals back up into the
          Response Channels.
        </desc>

        <defs>
          <marker
            id="rr-arrowhead"
            markerWidth="8"
            markerHeight="8"
            refX="6"
            refY="4"
            orient="auto"
          >
            <path d="M 1 1 L 7 4 L 1 7 Z" fill="var(--accent)" />
          </marker>
        </defs>

        {/* Outer Banner */}
        <rect
          x="15"
          y="10"
          width="710"
          height="34"
          rx="6"
          fill="var(--paper)"
          stroke="var(--line)"
          strokeWidth="1"
        />
        <text
          x="370"
          y="32"
          textAnchor="middle"
          fill="var(--ink)"
          fontSize="12"
          fontWeight="700"
          letterSpacing="0.08em"
          fontFamily="var(--font-serif), Georgia, serif"
        >
          RAPID RESPONSE DECISION &amp; ESCALATION FLOW
        </text>

        {/* 1. MONITORING FEEDS */}
        <g>
          <rect
            x="15"
            y="65"
            width="180"
            height="136"
            rx="8"
            fill="var(--card)"
            stroke="var(--line)"
            strokeWidth="1.2"
          />
          <path
            d="M 15 73 Q 15 65 23 65 L 187 65 Q 195 65 195 73 L 195 93 L 15 93 Z"
            fill="var(--paper)"
          />
          <text
            x="27"
            y="84"
            fill="var(--ink)"
            fontSize="11"
            fontWeight="700"
            letterSpacing="0.04em"
            fontFamily="var(--font-sans), system-ui, sans-serif"
          >
            MONITORING FEEDS
          </text>
          <line x1="15" y1="93" x2="195" y2="93" stroke="var(--line)" strokeWidth="1" />

          <text x="27" y="115" fill="var(--ink)" fontSize="12" fontFamily="var(--font-sans), system-ui, sans-serif">
            • Morning Radio
          </text>
          <text x="27" y="137" fill="var(--ink)" fontSize="12" fontFamily="var(--font-sans), system-ui, sans-serif">
            • WhatsApp Groups
          </text>
          <text x="27" y="159" fill="var(--ink)" fontSize="12" fontFamily="var(--font-sans), system-ui, sans-serif">
            • Social Listening
          </text>
          <text x="27" y="181" fill="var(--ink)" fontSize="12" fontFamily="var(--font-sans), system-ui, sans-serif">
            • 400 Ward Capts
          </text>
        </g>

        {/* Arrow 1: Feeds -> Decision Tree */}
        <path
          d="M 195 133 L 246 133"
          stroke="var(--accent)"
          strokeWidth="2"
          markerEnd="url(#rr-arrowhead)"
        />

        {/* 2. RESPONSE DECISION TREE */}
        <g>
          <rect
            x="254"
            y="98"
            width="232"
            height="70"
            rx="8"
            fill="var(--card)"
            stroke="var(--accent)"
            strokeWidth="1.5"
          />
          <text
            x="370"
            y="126"
            textAnchor="middle"
            fill="var(--ink)"
            fontSize="12"
            fontWeight="700"
            fontFamily="var(--font-sans), system-ui, sans-serif"
          >
            RESPONSE DECISION TREE
          </text>
          <text
            x="370"
            y="148"
            textAnchor="middle"
            fill="var(--muted)"
            fontSize="11"
            fontFamily="var(--font-sans), system-ui, sans-serif"
          >
            (Reach, Source, Virality Check)
          </text>
        </g>

        {/* Arrow 2: Decision Tree -> Response Channels */}
        <path
          d="M 486 133 L 537 133"
          stroke="var(--accent)"
          strokeWidth="2"
          markerEnd="url(#rr-arrowhead)"
        />

        {/* 3. RESPONSE CHANNELS */}
        <g>
          <rect
            x="545"
            y="65"
            width="180"
            height="136"
            rx="8"
            fill="var(--card)"
            stroke="var(--line)"
            strokeWidth="1.2"
          />
          <path
            d="M 545 73 Q 545 65 553 65 L 717 65 Q 725 65 725 73 L 725 93 L 545 93 Z"
            fill="var(--paper)"
          />
          <text
            x="557"
            y="84"
            fill="var(--ink)"
            fontSize="11"
            fontWeight="700"
            letterSpacing="0.04em"
            fontFamily="var(--font-sans), system-ui, sans-serif"
          >
            RESPONSE CHANNELS
          </text>
          <line x1="545" y1="93" x2="725" y2="93" stroke="var(--line)" strokeWidth="1" />

          <text x="557" y="115" fill="var(--ink)" fontSize="12" fontFamily="var(--font-sans), system-ui, sans-serif">
            • Radio Live Call
          </text>
          <text x="557" y="137" fill="var(--ink)" fontSize="12" fontFamily="var(--font-sans), system-ui, sans-serif">
            • Ward SMS Alert
          </text>
          <text x="557" y="159" fill="var(--ink)" fontSize="12" fontFamily="var(--font-sans), system-ui, sans-serif">
            • WhatsApp Audio
          </text>
          <text x="557" y="181" fill="var(--ink)" fontSize="12" fontFamily="var(--font-sans), system-ui, sans-serif">
            • Fact-Check Card
          </text>
        </g>

        {/* Arrow 3: Decision Tree -> Legal Gateway */}
        <path
          d="M 370 168 L 370 216"
          stroke="var(--accent)"
          strokeWidth="2"
          markerEnd="url(#rr-arrowhead)"
        />

        {/* 4. LEGAL / DEFAMATION GATEWAY */}
        <g>
          <rect
            x="254"
            y="224"
            width="232"
            height="70"
            rx="8"
            fill="var(--card)"
            stroke="var(--gold)"
            strokeWidth="1.5"
          />
          <text
            x="370"
            y="252"
            textAnchor="middle"
            fill="var(--ink)"
            fontSize="12"
            fontWeight="700"
            fontFamily="var(--font-sans), system-ui, sans-serif"
          >
            LEGAL / DEFAMATION GATEWAY
          </text>
          <text
            x="370"
            y="274"
            textAnchor="middle"
            fill="var(--muted)"
            fontSize="11"
            fontFamily="var(--font-sans), system-ui, sans-serif"
          >
            (OAG, Hansard, KNBS Verification)
          </text>
        </g>

        {/* Arrow 4: Legal Gateway -> Response Channels */}
        <path
          d="M 486 259 L 635 259 L 635 209"
          stroke="var(--gold)"
          strokeWidth="2"
          markerEnd="url(#rr-arrowhead)"
        />
      </svg>

      {/* Mobile Reflow Layout (< 640px) */}
      <svg
        className="block sm:hidden w-full h-auto overflow-visible"
        viewBox="0 0 340 540"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <marker
            id="rr-arrowhead-m"
            markerWidth="8"
            markerHeight="8"
            refX="6"
            refY="4"
            orient="auto"
          >
            <path d="M 1 1 L 7 4 L 1 7 Z" fill="var(--accent)" />
          </marker>
          <marker
            id="rr-arrowhead-m-gold"
            markerWidth="8"
            markerHeight="8"
            refX="6"
            refY="4"
            orient="auto"
          >
            <path d="M 1 1 L 7 4 L 1 7 Z" fill="var(--gold)" />
          </marker>
        </defs>

        {/* Title Banner */}
        <rect
          x="10"
          y="8"
          width="320"
          height="32"
          rx="6"
          fill="var(--paper)"
          stroke="var(--line)"
          strokeWidth="1"
        />
        <text
          x="170"
          y="28"
          textAnchor="middle"
          fill="var(--ink)"
          fontSize="10.5"
          fontWeight="700"
          letterSpacing="0.05em"
          fontFamily="var(--font-serif), Georgia, serif"
        >
          RAPID RESPONSE DECISION &amp; ESCALATION FLOW
        </text>

        {/* 1. MONITORING FEEDS */}
        <g>
          <rect
            x="10"
            y="52"
            width="320"
            height="96"
            rx="8"
            fill="var(--card)"
            stroke="var(--line)"
            strokeWidth="1.2"
          />
          <path
            d="M 10 60 Q 10 52 18 52 L 322 52 Q 330 52 330 60 L 330 76 L 10 76 Z"
            fill="var(--paper)"
          />
          <text
            x="20"
            y="69"
            fill="var(--ink)"
            fontSize="11"
            fontWeight="700"
            letterSpacing="0.04em"
            fontFamily="var(--font-sans), system-ui, sans-serif"
          >
            MONITORING FEEDS
          </text>
          <line x1="10" y1="76" x2="330" y2="76" stroke="var(--line)" strokeWidth="1" />

          <text x="22" y="99" fill="var(--ink)" fontSize="12" fontFamily="var(--font-sans), system-ui, sans-serif">
            • Morning Radio
          </text>
          <text x="175" y="99" fill="var(--ink)" fontSize="12" fontFamily="var(--font-sans), system-ui, sans-serif">
            • WhatsApp Groups
          </text>
          <text x="22" y="127" fill="var(--ink)" fontSize="12" fontFamily="var(--font-sans), system-ui, sans-serif">
            • Social Listening
          </text>
          <text x="175" y="127" fill="var(--ink)" fontSize="12" fontFamily="var(--font-sans), system-ui, sans-serif">
            • 400 Ward Capts
          </text>
        </g>

        {/* Arrow 1: Down to Decision Tree */}
        <path
          d="M 170 148 L 170 174"
          stroke="var(--accent)"
          strokeWidth="2"
          markerEnd="url(#rr-arrowhead-m)"
        />

        {/* 2. RESPONSE DECISION TREE */}
        <g>
          <rect
            x="10"
            y="182"
            width="320"
            height="62"
            rx="8"
            fill="var(--card)"
            stroke="var(--accent)"
            strokeWidth="1.5"
          />
          <text
            x="170"
            y="207"
            textAnchor="middle"
            fill="var(--ink)"
            fontSize="12"
            fontWeight="700"
            fontFamily="var(--font-sans), system-ui, sans-serif"
          >
            RESPONSE DECISION TREE
          </text>
          <text
            x="170"
            y="227"
            textAnchor="middle"
            fill="var(--muted)"
            fontSize="11"
            fontFamily="var(--font-sans), system-ui, sans-serif"
          >
            (Reach, Source, Virality Check)
          </text>
        </g>

        {/* Arrow 2: Down to Legal Gateway */}
        <path
          d="M 170 244 L 170 270"
          stroke="var(--accent)"
          strokeWidth="2"
          markerEnd="url(#rr-arrowhead-m)"
        />

        {/* Direct bypass arrow around side to Response Channels */}
        <path
          d="M 330 213 L 336 213 Q 338 213 338 220 L 338 410 Q 338 420 330 420"
          stroke="var(--accent)"
          strokeWidth="1.5"
          strokeDasharray="3 3"
        />

        {/* 3. LEGAL / DEFAMATION GATEWAY */}
        <g>
          <rect
            x="10"
            y="278"
            width="320"
            height="62"
            rx="8"
            fill="var(--card)"
            stroke="var(--gold)"
            strokeWidth="1.5"
          />
          <text
            x="170"
            y="303"
            textAnchor="middle"
            fill="var(--ink)"
            fontSize="12"
            fontWeight="700"
            fontFamily="var(--font-sans), system-ui, sans-serif"
          >
            LEGAL / DEFAMATION GATEWAY
          </text>
          <text
            x="170"
            y="323"
            textAnchor="middle"
            fill="var(--muted)"
            fontSize="11"
            fontFamily="var(--font-sans), system-ui, sans-serif"
          >
            (OAG, Hansard, KNBS Verification)
          </text>
        </g>

        {/* Arrow 3: Down to Response Channels */}
        <path
          d="M 170 340 L 170 366"
          stroke="var(--gold)"
          strokeWidth="2"
          markerEnd="url(#rr-arrowhead-m-gold)"
        />

        {/* 4. RESPONSE CHANNELS */}
        <g>
          <rect
            x="10"
            y="374"
            width="320"
            height="96"
            rx="8"
            fill="var(--card)"
            stroke="var(--line)"
            strokeWidth="1.2"
          />
          <path
            d="M 10 382 Q 10 374 18 374 L 322 374 Q 330 374 330 382 L 330 398 L 10 398 Z"
            fill="var(--paper)"
          />
          <text
            x="20"
            y="391"
            fill="var(--ink)"
            fontSize="11"
            fontWeight="700"
            letterSpacing="0.04em"
            fontFamily="var(--font-sans), system-ui, sans-serif"
          >
            RESPONSE CHANNELS
          </text>
          <line x1="10" y1="398" x2="330" y2="398" stroke="var(--line)" strokeWidth="1" />

          <text x="22" y="421" fill="var(--ink)" fontSize="12" fontFamily="var(--font-sans), system-ui, sans-serif">
            • Radio Live Call
          </text>
          <text x="175" y="421" fill="var(--ink)" fontSize="12" fontFamily="var(--font-sans), system-ui, sans-serif">
            • Ward SMS Alert
          </text>
          <text x="22" y="449" fill="var(--ink)" fontSize="12" fontFamily="var(--font-sans), system-ui, sans-serif">
            • WhatsApp Audio
          </text>
          <text x="175" y="449" fill="var(--ink)" fontSize="12" fontFamily="var(--font-sans), system-ui, sans-serif">
            • Fact-Check Card
          </text>
        </g>
      </svg>
    </figure>
  );
}
