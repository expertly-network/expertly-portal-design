/* ==========================================================================
   Member Portal — single source of truth for mock content.
   Every dashboard/articles/events variant reads from this object instead of
   hardcoding numbers/names in markup, so stats can't drift between pages.
   ========================================================================== */
window.EXPERTLY_DASHBOARD = {
  member: {
    articlesPublished: 6,
    eventsUpcoming: 2,
    profileViews: 312,
    photo: 'https://randomuser.me/api/portraits/men/32.jpg'
  },

  peerMatch: {
    name: 'Ananya Krishnamurthy',
    role: 'Partner, Cross-Border Tax',
    org: 'Nishith Desai Associates',
    location: 'Bangalore, India',
    photo: 'https://randomuser.me/api/portraits/women/65.jpg',
    tags: ['M&A Tax', 'APAC'],
    meetingDate: 'Thu, 24 Jul'
  },

  peerStats: {
    sessionsDone: 7,
    monthStreak: 5,
    avgRatingGiven: 4.8
  },

  events: [
    { title: 'Compliance Leaders Forum', date: 'Tue, 22 Jul', location: 'New York, US', role: 'attending' },
    { title: 'Cross-Border Tax Roundtable', date: 'Thu, 31 Jul', location: 'Virtual', role: 'suggested' },
    { title: 'Private Equity Deal Flow Breakfast', date: 'Tue, 05 Aug', location: 'London, UK', role: 'members-only' }
  ],

  articles: [
    { title: 'Transfer Pricing Under the New GMT Rules', author: 'Priya K.', views: 842, category: 'Tax', status: 'live' },
    { title: "Cross-Border Tax Disputes: A Practitioner's Guide", author: 'Lena P.', views: 516, category: 'Disputes', status: 'live' },
    { title: 'M&A Due Diligence Checklist, 2026', author: 'You', views: null, category: 'M&A', status: 'draft' }
  ],

  members: [
    { name: 'Sunita Krishnamurthy', role: 'M&A Partner', location: 'Mumbai', photo: 'https://randomuser.me/api/portraits/women/68.jpg' },
    { name: 'Oluwaseun Adeyemi', role: 'Capital Markets', location: 'Lagos', photo: 'https://randomuser.me/api/portraits/men/22.jpg' },
    { name: 'Lena Pavlova', role: 'Tax Disputes', location: 'Zurich', photo: 'https://randomuser.me/api/portraits/women/50.jpg' },
    { name: 'Rohan Verma', role: 'Transfer Pricing', location: 'Singapore', photo: 'https://randomuser.me/api/portraits/men/54.jpg' },
    { name: 'Sheila Tanaka', role: 'ESG Disclosure', location: 'Tokyo', photo: 'https://randomuser.me/api/portraits/women/33.jpg' },
    { name: 'Marcus Chen', role: 'Private Equity', location: 'Hong Kong', photo: 'https://randomuser.me/api/portraits/men/45.jpg' },
    { name: 'Priya Nair', role: 'BEPS Pillar Two', location: 'Singapore', photo: 'https://randomuser.me/api/portraits/women/12.jpg' },
    { name: 'David Okafor', role: 'Capital Markets', location: 'Johannesburg', photo: 'https://randomuser.me/api/portraits/men/61.jpg' }
  ],

  /* Notification bell in the sidebar. `read: false` items show the
     unread dot / badge count. Newest first. */
  notifications: [
    { icon: 'peer', title: 'Peer Connect match confirmed', body: "You're paired with Ananya Krishnamurthy for July.", time: '2h ago', read: false },
    { icon: 'article', title: 'Article published', body: '"Transfer Pricing Under the New GMT Rules" is now live.', time: '1d ago', read: false },
    { icon: 'event', title: 'Event suggestion received', body: 'Our team is reviewing "Cross-Border Tax Roundtable".', time: '2d ago', read: false },
    { icon: 'profile', title: 'Profile views up 18%', body: '312 views this month — your best month yet.', time: '4d ago', read: true },
    { icon: 'member', title: 'New member nearby', body: 'Rohan Verma (Transfer Pricing, Singapore) just joined.', time: '6d ago', read: true }
  ]
};
