// Mock data for the chat application
export const mockUsers = [
  {
    id: '1',
    name: 'Sarah Chen',
    avatar: '🧑‍💼',
    status: 'online',
    bio: 'Product Designer | Building great things',
    email: 'sarah@startup.com',
    lastSeen: new Date(),
    isFriend: true,
    mutualGroups: 3,
  },
  {
    id: '2',
    name: 'Alex Rivera',
    avatar: '👨‍💻',
    status: 'online',
    bio: 'Full-stack Engineer | React & Node',
    email: 'alex@startup.com',
    lastSeen: new Date(),
    isFriend: true,
    mutualGroups: 2,
  },
  {
    id: '3',
    name: 'Jordan Park',
    avatar: '🎨',
    status: 'away',
    bio: 'Creative Director',
    email: 'jordan@startup.com',
    lastSeen: new Date(Date.now() - 3600000),
    isFriend: true,
    mutualGroups: 4,
  },
  {
    id: '4',
    name: 'Casey Williams',
    avatar: '📊',
    status: 'offline',
    bio: 'Data Analyst | Analytics enthusiast',
    email: 'casey@startup.com',
    lastSeen: new Date(Date.now() - 86400000),
    isFriend: true,
    mutualGroups: 1,
  },
  {
    id: '5',
    name: 'Morgan Taylor',
    avatar: '🌟',
    status: 'online',
    bio: 'Marketing Manager',
    email: 'morgan@startup.com',
    lastSeen: new Date(),
    isFriend: false,
    mutualGroups: 2,
  },
];

export const mockConversations = [
  {
    id: 'conv-1',
    name: 'Sarah Chen',
    avatar: '🧑‍💼',
    lastMessage: 'That design looks amazing! 🎨',
    timestamp: new Date(Date.now() - 300000),
    unread: 2,
    isPinned: true,
    isFavorite: true,
    type: 'direct',
    userId: '1',
    status: 'online',
  },
  {
    id: 'conv-2',
    name: 'Alex Rivera',
    avatar: '👨‍💻',
    lastMessage: 'Let me review that PR tomorrow morning',
    timestamp: new Date(Date.now() - 900000),
    unread: 0,
    isPinned: true,
    isFavorite: true,
    type: 'direct',
    userId: '2',
    status: 'online',
  },
  {
    id: 'conv-3',
    name: 'Design Team',
    avatar: '🎨',
    lastMessage: 'Morgan: Can we schedule the review for next week?',
    timestamp: new Date(Date.now() - 1800000),
    unread: 5,
    isPinned: false,
    isFavorite: false,
    type: 'group',
    memberCount: 8,
    members: ['Sarah', 'Jordan', 'Morgan', '+5 others'],
  },
  {
    id: 'conv-4',
    name: 'Jordan Park',
    avatar: '🎨',
    lastMessage: 'See you at the meeting!',
    timestamp: new Date(Date.now() - 3600000),
    unread: 0,
    isPinned: false,
    isFavorite: true,
    type: 'direct',
    userId: '3',
    status: 'away',
  },
  {
    id: 'conv-5',
    name: 'Product Roadmap',
    avatar: '📊',
    lastMessage: 'Alex: Q2 timeline looks good to me',
    timestamp: new Date(Date.now() - 7200000),
    unread: 0,
    isPinned: false,
    isFavorite: false,
    type: 'group',
    memberCount: 12,
    members: ['Sarah', 'Alex', 'Casey', '+9 others'],
  },
  {
    id: 'conv-6',
    name: 'Casey Williams',
    avatar: '📊',
    lastMessage: 'The metrics look promising this quarter',
    timestamp: new Date(Date.now() - 14400000),
    unread: 0,
    isPinned: false,
    isFavorite: false,
    type: 'direct',
    userId: '4',
    status: 'offline',
  },
];

export const mockMessages = {
  'conv-1': [
    {
      id: 'msg-1',
      userId: '1',
      userName: 'Sarah Chen',
      avatar: '🧑‍💼',
      content: 'Hey! Just finished the user research findings',
      timestamp: new Date(Date.now() - 3600000),
      status: 'delivered',
      reactions: [{ emoji: '👍', users: 2 }],
      attachments: [],
    },
    {
      id: 'msg-2',
      userId: 'current',
      userName: 'You',
      avatar: '👤',
      content: 'Great! Can you share the deck with me?',
      timestamp: new Date(Date.now() - 3300000),
      status: 'seen',
      reactions: [],
      attachments: [],
    },
    {
      id: 'msg-3',
      userId: '1',
      userName: 'Sarah Chen',
      avatar: '🧑‍💼',
      content: 'Already sent it to your email. Key insights:',
      timestamp: new Date(Date.now() - 3000000),
      status: 'seen',
      reactions: [],
      attachments: [],
    },
    {
      id: 'msg-4',
      userId: '1',
      userName: 'Sarah Chen',
      avatar: '🧑‍💼',
      content: '• 78% of users prefer dark mode\n• Mobile-first experience is critical\n• Search functionality needs improvement',
      timestamp: new Date(Date.now() - 2800000),
      status: 'seen',
      reactions: [{ emoji: '🚀', users: 1 }],
      attachments: [],
    },
    {
      id: 'msg-5',
      userId: 'current',
      userName: 'You',
      avatar: '👤',
      content: 'That design looks amazing! 🎨',
      timestamp: new Date(Date.now() - 300000),
      status: 'delivered',
      reactions: [],
      attachments: [],
    },
  ],
  'conv-2': [
    {
      id: 'msg-1',
      userId: '2',
      userName: 'Alex Rivera',
      avatar: '👨‍💻',
      content: 'I\'ve completed the refactoring on the chat module',
      timestamp: new Date(Date.now() - 86400000),
      status: 'seen',
      reactions: [],
      attachments: [],
    },
    {
      id: 'msg-2',
      userId: 'current',
      userName: 'You',
      avatar: '👤',
      content: 'Nice! How\'s the performance looking?',
      timestamp: new Date(Date.now() - 82800000),
      status: 'seen',
      reactions: [],
      attachments: [],
    },
    {
      id: 'msg-3',
      userId: '2',
      userName: 'Alex Rivera',
      avatar: '👨‍💻',
      content: 'Much better. Load time improved by 40%. Let me review that PR tomorrow morning',
      timestamp: new Date(Date.now() - 900000),
      status: 'delivered',
      reactions: [{ emoji: '✅', users: 1 }],
      attachments: [],
    },
  ],
};

export const mockGroups = [
  {
    id: 'group-1',
    name: 'Design Team',
    avatar: '🎨',
    description: 'Product design collaboration',
    memberCount: 8,
    members: mockUsers.slice(0, 4),
    createdBy: 'Sarah Chen',
    createdAt: new Date(Date.now() - 2592000000),
  },
  {
    id: 'group-2',
    name: 'Product Roadmap',
    avatar: '📊',
    description: 'Q1-Q4 planning and tracking',
    memberCount: 12,
    members: mockUsers.slice(0, 5),
    createdBy: 'Alex Rivera',
    createdAt: new Date(Date.now() - 5184000000),
  },
];

export const mockNotifications = [
  {
    id: 'notif-1',
    type: 'message',
    title: 'New message from Sarah',
    message: 'That design looks amazing! 🎨',
    avatar: '🧑‍💼',
    timestamp: new Date(Date.now() - 300000),
    read: false,
  },
  {
    id: 'notif-2',
    type: 'mention',
    title: 'You were mentioned',
    message: 'Jordan mentioned you in Design Team',
    avatar: '🎨',
    timestamp: new Date(Date.now() - 1800000),
    read: false,
  },
  {
    id: 'notif-3',
    type: 'activity',
    title: 'Group activity',
    message: 'New members added to Design Team',
    avatar: '🎨',
    timestamp: new Date(Date.now() - 3600000),
    read: true,
  },
];

export const mockSearchResults = {
  users: mockUsers.slice(0, 3),
  chats: mockConversations.slice(0, 3),
  messages: [
    {
      id: 'search-msg-1',
      content: 'That design looks amazing! 🎨',
      sender: 'Sarah Chen',
      chatName: 'Sarah Chen',
      timestamp: new Date(Date.now() - 300000),
    },
    {
      id: 'search-msg-2',
      content: 'The metrics look promising this quarter',
      sender: 'Casey Williams',
      chatName: 'Casey Williams',
      timestamp: new Date(Date.now() - 14400000),
    },
  ],
};

export const generateRandomMessage = (userId) => {
  const messages = [
    'Sounds good to me!',
    'I agree, let\'s proceed with that approach',
    'Can we discuss this in the standup?',
    'Perfect! Let\'s ship it 🚀',
    'That makes sense. I\'ll get started on this',
    'Great feedback. I\'ll incorporate these changes',
    'Thanks for the update!',
    'This looks incredible 🎉',
  ];
  
  return messages[Math.floor(Math.random() * messages.length)];
};

export const getTimeAgo = (date) => {
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};
