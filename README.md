This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

my-app/
│
├── app/ # App Router (UI + routes)
│ ├── layout.tsx
│ ├── page.tsx
│ ├── globals.css
│ │
│ ├── (auth)/ # Route group (doesn’t affect URL)
│ │ ├── login/
│ │ │ └── page.tsx
│ │ └── register/
│ │ └── page.tsx
│ │
│ ├── dashboard/
│ │ ├── page.tsx
│ │ ├── loading.tsx
│ │ ├── error.tsx
│ │ └── components/ # Route-specific components
│ │
│ └── api/ # API routes (backend inside Next)
│ ├── auth/
│ │ └── route.ts
│ └── users/
│ └── route.ts
│
├── components/ # Shared UI components
│ ├── ui/ # Buttons, Inputs, Modals
│ ├── forms/
│ └── layout/
│
├── lib/ # Core utilities (VERY IMPORTANT)
│ ├── db.ts # Database connection
│ ├── auth.ts # Auth logic
│ ├── validations.ts
│ ├── utils.ts
│ └── constants.ts
│
├── services/ # Business logic layer (clean architecture)
│ ├── user.service.ts
│ ├── auth.service.ts
│ └── post.service.ts
│
├── hooks/ # Custom React hooks
│ ├── useAuth.ts
│ └── useDebounce.ts
│
├── store/ # Zustand / Redux (if using)
│ └── auth.store.ts
│
├── types/ # Global TypeScript types
│ ├── user.types.ts
│ └── api.types.ts
│
├── middleware.ts # Route protection
├── .env
├── next.config.js
└── package.json
