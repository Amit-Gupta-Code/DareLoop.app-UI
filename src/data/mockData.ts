import {
  Activity,
  Eye,
  MousePointer2,
  Zap,
} from "lucide-react";


const MOCK_DATA = {
  stats: {
    total_challenges: 482,
    total_chains: 12450,
    total_participants: 128400,
  },
  challenges: [
    {
      id: "1",
      title: "Creator Growth Loop #1",
      description:
        "Stop relying on algorithms. Dareloop turns other creators into your distribution engine. Join this loop and grow automatically.",
      status: "exploding 🔥",
      root_code: "creator-loop-root",
      participantCount: 1284,
    },
    {
      id: "2",
      title: "Viral Reach 100x",
      description:
        "Make your content AMIT loop viral. Connect with 500+ creators waiting to pass your content forward.",
      status: "popular",
      root_code: "viral-reach-root",
      participantCount: 856,
    },
    {
      id: "3",
      title: "Algorithm Rebellion",
      description:
        "The next creator is waiting. Don't break the loop. Join the movement of creators helping creators.",
      status: "trending",
      root_code: "rebellion-root",
      participantCount: 420,
    },
  ],
  chains: {
    "creator-loop-root": {
      id: "c1",
      challenge_title: "Creator Growth Loop #1",
      challenge_description:
        "Stop relying on algorithms. Dareloop turns other creators into your distribution engine. Join this loop and grow automatically.",
      depth: 427,
      participants: [
        {
          id: "p1",
          username: "vlog_star",
          parentId: null,
          platform: "Youtube",
        },
        {
          id: "p2",
          username: "tech_guru",
          parentId: "p1",
          platform: "Twitter",
        },
        {
          id: "p3",
          username: "art_vibes",
          parentId: "p1",
          platform: "Instagram",
        },
        {
          id: "p4",
          username: "fitness_pro",
          parentId: "p2",
          platform: "Instagram",
        },
        {
          id: "p5",
          username: "crypto_king",
          parentId: "p2",
          platform: "Twitter",
        },
        {
          id: "p6",
          username: "travel_seeker",
          parentId: "p3",
          platform: "Youtube",
        },
      ],
    },
  },
  testimonials: [
    {
      id: 1,
      name: "Alex River",
      handle: "@alex_creatives",
      content:
        "I joined the Growth Loop #1 when I was stuck at 2k followers. In 3 weeks, the recursive reach pushed me to 25k. This isn't an algorithm, it's a movement.",
      avatar: "https://picsum.photos/seed/alex/100/100",
      platform: "Twitter",
    },
    {
      id: 2,
      name: "Sarah Chen",
      handle: "@sarah.vlogs",
      content:
        "The transparency of the growth chain is what sold me. You can see your impact in real-time. My videos are finally hitting the right audience.",
      avatar: "https://picsum.photos/seed/sarah/100/100",
      platform: "Instagram",
    },
    {
      id: 3,
      name: "Marcus Digital",
      handle: "@marcus_tech",
      content:
        "Dareloop solved the distribution problem. Instead of praying to the TikTok gods, I connected with other creators. Best decision ever.",
      avatar: "https://picsum.photos/seed/marcus/100/100",
      platform: "Youtube",
    },
  ],
  pricing: [
    {
      name: "Creator Free",
      price: "$0",
      description: "Perfect for starting your first loop.",
      features: ["Join 1 Active Loop", "Basic Analytics", "Public Growth Map"],
      buttonText: "Start for Free",
      isPopular: false,
    },
    {
      name: "Loop Pro",
      price: "$29",
      period: "/month",
      description: "For creators scaling their reach seriously.",
      features: [
        "Unlimited Loop Joins",
        "Advanced Viral Analytics",
        "Priority Chain Placement",
        "Direct Creator Messaging",
      ],
      buttonText: "Join Pro",
      isPopular: true,
    },
    {
      name: "Network Master",
      price: "$99",
      period: "/month",
      description: "Full control over the distribution engine.",
      features: [
        "Create Custom Loops",
        "Network Health API",
        "Custom Brand Links",
        "Full Chain Export",
      ],
      buttonText: "Get Master",
      isPopular: false,
    },
  ],
  analytics: {
    overview: [
      {
        label: "Total Reach",
        value: "842.5k",
        trend: "+12.4%",
        icon: Eye,
        color: "accent",
      },
      {
        label: "Viral Momentum",
        value: "x42",
        trend: "+8.2%",
        icon: Zap,
        color: "highlight",
      },
      {
        label: "Active Loops",
        value: "12",
        trend: "Steady",
        icon: Activity,
        color: "primary",
      },
      {
        label: "Conversions",
        value: "14.2%",
        trend: "+2.1%",
        icon: MousePointer2,
        color: "purple",
      },
    ],
    growthData: [
      { date: "04/01", reach: 12000 },
      { date: "04/05", reach: 18000 },
      { date: "04/10", reach: 45000 },
      { date: "04/12", reach: 89000 },
      { date: "04/14", reach: 120000 },
      { date: "04/16", reach: 210000 },
    ],
    topLoops: [
      { name: "Creator Growth Loop #1", reach: "420k", growth: "+150%" },
      { name: "Viral Reach 100x", reach: "310k", growth: "+90%" },
      { name: "Algorithm Rebellion", reach: "112k", growth: "+12%" },
    ],
  },
};

export default MOCK_DATA;