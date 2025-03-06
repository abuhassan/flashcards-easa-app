app/
├── (auth)/                            # Auth group
│   ├── sign-in/
│   │   └── page.tsx
│   ├── sign-up/
│   │   └── page.tsx
│   └── layout.tsx
│
├── actions/                           # Server actions
│   ├── flashcard-actions.ts           # Flashcard CRUD operations
│   ├── module-actions.ts              # Module operations
│   ├── quiz-actions.ts                # Quiz operations
│   ├── study-actions.ts               # Study session operations
│   └── community-actions.ts           # Community features
│
├── admin/                             # Admin routes
│   ├── flashcards/
│   │   └── page.tsx
│   ├── modules/
│   │   └── page.tsx
│   ├── users/
│   │   └── page.tsx
│   └── dashboard/
│       └── page.tsx
│
├── api/                               # API routes
│   ├── admin/
│   │   └── [...route].ts
│   ├── auth/
│   │   ├── [...nextauth]/
│   │   └── register/
│   ├── flashcards/
│   │   └── [...route].ts
│   └── webhooks/
│       └── [...route].ts
│
├── components/                        # Shared components
│   ├── dashboard/                     # Dashboard components
│   │   ├── components/
│   │   │   ├── authentication-wrapper.tsx
│   │   │   ├── navbar.tsx
│   │   │   └── sidebar.tsx
│   │   └── charts/                    # Analytics charts
│   │       ├── progress-chart.tsx
│   │       └── study-time-chart.tsx
│   │
│   ├── flashcards/                    # Flashcard components
│   │   ├── components/
│   │   │   ├── flashcard-form.tsx
│   │   │   ├── flashcard-card.tsx     # Individual flashcard display
│   │   │   ├── flashcard-deck.tsx     # Collection of flashcards
│   │   │   └── flashcard-filter.tsx   # Filtering UI
│   │   └── actions.ts
│   │
│   ├── modules/                       # Module components
│   │   ├── module-card.tsx
│   │   └── module-progress.tsx
│   │
│   ├── study/                         # Study session components
│   │   ├── study-session.tsx
│   │   ├── spaced-repetition.tsx
│   │   └── study-timer.tsx
│   │
│   ├── quizzes/                       # Quiz components
│   │   ├── quiz-form.tsx
│   │   ├── quiz-question.tsx
│   │   └── quiz-results.tsx
│   │
│   ├── community/                     # Community components
│   │   ├── community-hub.tsx          # Main community page
│   │   ├── contribution-card.tsx      # Individual contribution
│   │   ├── study-group-card.tsx       # Study group display
│   │   └── leaderboard.tsx            # Community leaderboard
│   │
│   ├── gamification/                  # Gamification components
│   │   ├── badge-display.tsx          # Display badges
│   │   ├── achievement-card.tsx       # Achievement display
│   │   ├── level-progress.tsx         # XP and level progress
│   │   └── streak-tracker.tsx         # Study streak UI
│   │
│   ├── layout/                        # Layout components
│   │   ├── main-layout.tsx
│   │   └── home-navbar.tsx
│   │
│   └── ui/                            # ShadCN UI components
│       └── ...                        # All shadcn components
│
├── dashboard/                         # User dashboard routes
│   ├── page.tsx                       # Main dashboard
│   ├── flashcards/                    # Flashcard management
│   │   ├── create/
│   │   │   └── page.tsx
│   │   └── page.tsx
│   ├── modules/                       # Module browsing
│   │   └── page.tsx
│   ├── study/                         # Study session pages
│   │   ├── [moduleId]/
│   │   │   └── page.tsx               # Study specific module
│   │   └── page.tsx                   # Study home
│   ├── quizzes/                       # Quiz pages
│   │   ├── [quizId]/
│   │   │   └── page.tsx               # Take specific quiz
│   │   └── page.tsx                   # Quiz list
│   ├── community/                     # Community pages
│   │   ├── study-groups/
│   │   │   └── page.tsx
│   │   └── page.tsx                   # Community home
│   ├── profile/                       # User profile
│   │   └── page.tsx
│   └── achievements/                  # Achievements/badges
│       └── page.tsx
│
├── lib/                               # Utility libraries
│   ├── auth.ts                        # Auth utilities
│   ├── auth.config.ts                 # Auth configuration
│   ├── db.ts                          # Database utilities
│   ├── prisma.ts                      # Prisma client
│   ├── utils.ts                       # General utilities
│   ├── spaced-repetition.ts           # Learning algorithm
│   └── validators.ts                  # Form validation schemas
│
├── hooks/                             # Custom React hooks
│   ├── use-flashcards.ts
│   ├── use-study-session.ts
│   ├── use-auth.ts
│   └── use-progress.ts
│
├── providers/                         # React providers
│   ├── theme-provider.tsx
│   └── session-provider.tsx
│
├── types/                             # TypeScript types
│   ├── index.ts                       # Shared types
│   ├── auth.ts                        # Auth types
│   ├── flashcard.ts                   # Flashcard types
│   └── module.ts                      # Module types
│
├── globals.css                        # Global styles
├── layout.tsx                         # Root layout
└── page.tsx                           # Homepage