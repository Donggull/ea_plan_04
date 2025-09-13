# ELUO Project Management System

## Environment Setup

This project is configured with the following technology stack:

### Frontend
- **React 19** with TypeScript
- **Vite** as build tool
- **Tailwind CSS** for styling
- **Shadcn/ui** component library
- **Wouter** for routing
- **Zustand** for state management
- **TanStack Query** for server state

### Backend & Database
- **Supabase** for backend services
- **Drizzle ORM** for database operations
- **PostgreSQL** database

### Development Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Configuration:**
   - Copy `.env.example` to `.env.local`
   - Fill in your Supabase credentials and API keys

3. **Start development server:**
   ```bash
   npm run dev
   ```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript checking
- `npm run db:generate` - Generate database migrations
- `npm run db:push` - Push schema to database
- `npm run db:migrate` - Run database migrations

### Project Structure

```
src/
├── components/     # React components
│   ├── ui/        # Shadcn/ui components
│   ├── forms/     # Form components
│   └── layouts/   # Layout components
├── lib/           # Utility libraries
│   ├── db/        # Database configuration
│   ├── auth/      # Authentication utilities
│   ├── ai/        # AI integration
│   └── storage/   # File storage utilities
├── hooks/         # Custom React hooks
├── stores/        # Zustand stores
├── pages/         # Page components
├── types/         # TypeScript type definitions
└── utils/         # Utility functions

api/               # API routes (for Vercel deployment)
├── auth/         # Authentication endpoints
├── projects/     # Project management endpoints
└── ai/           # AI integration endpoints
```

### Next Steps

The basic environment is now set up. You can proceed with:
1. Setting up Supabase database schema
2. Implementing authentication
3. Creating the project workflow system
4. Adding AI integration features
