import { SocialPost } from './types';

const USERS = [
  { name: 'Alex River', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex' },
  { name: 'Sam Chen', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sam' },
  { name: 'Jordan Smith', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan' },
  { name: 'Taylor Swiftie', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Taylor' },
  { name: 'TechGuru', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tech' },
];

const REAL_SAMPLES = [
  {
    content: "The user experience on the new Oatly website is genuinely impressive. The way they handle the transition between the products and the impact report is a masterclass in modern web design. #UXDesign #Oatly",
    platform: 'twitter'
  },
  {
    content: "Honestly disappointed with the latest product batch. The consistency was way off compared to what we usually get. I hope this was just a one-off issue because I've been a loyal customer for years.",
    platform: 'facebook'
  },
  {
    content: "I've been following the corporate sustainability reports closely, and it's refreshing to see a company actually hitting their carbon reduction targets ahead of schedule. We need more of this transparency.",
    platform: 'instagram'
  },
  {
    content: "Is it just me or has the pricing significantly increased over the last 6 months? I understand inflation, but this feels like price gouging at this point. Might have to switch to a competitor.",
    platform: 'twitter'
  },
  {
    content: "Love the new packaging! The QR code that shows the exact farm where the oats were sourced is such a great touch for accountability. Definitely keeping this in my pantry.",
    platform: 'instagram'
  },
  {
    content: "Wait, so let me get this straight... they are expanding to three new countries while their local supply chain is still struggling with backlogs? Seems like aggressive expansion at the cost of stability.",
    platform: 'youtube'
  },
  {
    content: "The wait times for customer support have been getting ridiculous. 45 minutes on hold just to ask about a simple refund? Not a good look for a 'customer-first' company.",
    platform: 'twitter'
  },
  {
    content: "The partnership with the local farmers' cooperative is a huge win for the community. Supporting local while scaling globally is exactly what we should be seeing from modern brands.",
    platform: 'facebook'
  }
];

export const generateSyntheticPost = (): SocialPost => {
  const user = USERS[Math.floor(Math.random() * USERS.length)];
  const sample = REAL_SAMPLES[Math.floor(Math.random() * REAL_SAMPLES.length)];
  
  return {
    id: Math.random().toString(36).substring(7),
    platform: sample.platform as any,
    author: user.name,
    avatar: user.avatar,
    content: sample.content,
    timestamp: new Date().toISOString(),
    likes: Math.floor(Math.random() * 5000),
    shares: Math.floor(Math.random() * 500),
  };
};

export const generateInitialDataset = (count: number = 20): SocialPost[] => {
  return Array.from({ length: count }, () => generateSyntheticPost());
};
