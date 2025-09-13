import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ErrorBoundary } from 'react-error-boundary'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

// Query Client
import { queryClient } from '@/lib/react-query'

// Providers
import { ThemeProvider } from '@/contexts/ThemeContext'
import { AuthProvider } from '@/contexts/AuthContext'

// Layout Components
import { MainLayout } from '@/components/layout/MainLayout'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

// Auth Pages
import { LoginPage } from '@/pages/LoginPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

// Dashboard
import { DashboardPage } from '@/pages/DashboardPage'

// Lazy-loaded Pages for better performance
const PlanningProposalPage = lazy(() => import('@/pages/planning/ProposalPage').then(module => ({ default: module.ProposalPage })))
const PlanningConstructionPage = lazy(() => import('@/pages/planning/ConstructionPage').then(module => ({ default: module.ConstructionPage })))
const PlanningOperationPage = lazy(() => import('@/pages/planning/OperationPage').then(module => ({ default: module.OperationPage })))

const DesignWorkflowPage = lazy(() => import('@/pages/design/WorkflowPage').then(module => ({ default: module.WorkflowPage })))
const DesignResourcesPage = lazy(() => import('@/pages/design/ResourcesPage').then(module => ({ default: module.ResourcesPage })))

const PublishingCanvasPage = lazy(() => import('@/pages/publishing/CanvasPage').then(module => ({ default: module.CanvasPage })))
const PublishingPreviewPage = lazy(() => import('@/pages/publishing/PreviewPage').then(module => ({ default: module.PreviewPage })))

const DevelopmentEnvironmentPage = lazy(() => import('@/pages/development/EnvironmentPage').then(module => ({ default: module.EnvironmentPage })))
const DevelopmentDeploymentPage = lazy(() => import('@/pages/development/DeploymentPage').then(module => ({ default: module.DeploymentPage })))

const ChatbotAIChatPage = lazy(() => import('@/pages/chatbot/AIChatPage').then(module => ({ default: module.AIChatPage })))
const ChatbotCustomBotPage = lazy(() => import('@/pages/chatbot/CustomBotPage').then(module => ({ default: module.CustomBotPage })))

const ImageGenerationPage = lazy(() => import('@/pages/image-gen/ImageGenerationPage').then(module => ({ default: module.ImageGenerationPage })))

// Error Fallback Component
function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">오류가 발생했습니다</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">{error.message}</p>
        <button
          onClick={resetErrorBoundary}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          다시 시도
        </button>
      </div>
    </div>
  )
}

// Loading Component
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  )
}

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <BrowserRouter>
          <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            {/* Dashboard */}
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />

            {/* Planning Module */}
            <Route
              path="planning/proposal"
              element={
                <Suspense fallback={<LoadingSpinner />}>
                  <PlanningProposalPage />
                </Suspense>
              }
            />
            <Route
              path="planning/construction"
              element={
                <Suspense fallback={<LoadingSpinner />}>
                  <PlanningConstructionPage />
                </Suspense>
              }
            />
            <Route
              path="planning/operation"
              element={
                <Suspense fallback={<LoadingSpinner />}>
                  <PlanningOperationPage />
                </Suspense>
              }
            />

            {/* Design Module */}
            <Route
              path="design/workflow"
              element={
                <Suspense fallback={<LoadingSpinner />}>
                  <DesignWorkflowPage />
                </Suspense>
              }
            />
            <Route
              path="design/resources"
              element={
                <Suspense fallback={<LoadingSpinner />}>
                  <DesignResourcesPage />
                </Suspense>
              }
            />

            {/* Publishing Module */}
            <Route
              path="publishing/canvas"
              element={
                <Suspense fallback={<LoadingSpinner />}>
                  <PublishingCanvasPage />
                </Suspense>
              }
            />
            <Route
              path="publishing/preview"
              element={
                <Suspense fallback={<LoadingSpinner />}>
                  <PublishingPreviewPage />
                </Suspense>
              }
            />

            {/* Development Module */}
            <Route
              path="development/environment"
              element={
                <Suspense fallback={<LoadingSpinner />}>
                  <DevelopmentEnvironmentPage />
                </Suspense>
              }
            />
            <Route
              path="development/deployment"
              element={
                <Suspense fallback={<LoadingSpinner />}>
                  <DevelopmentDeploymentPage />
                </Suspense>
              }
            />

            {/* Chatbot Module */}
            <Route
              path="chatbot/ai-chat"
              element={
                <Suspense fallback={<LoadingSpinner />}>
                  <ChatbotAIChatPage />
                </Suspense>
              }
            />
            <Route
              path="chatbot/custom-bot"
              element={
                <Suspense fallback={<LoadingSpinner />}>
                  <ChatbotCustomBotPage />
                </Suspense>
              }
            />

            {/* Image Generation */}
            <Route
              path="image-generation"
              element={
                <Suspense fallback={<LoadingSpinner />}>
                  <ImageGenerationPage />
                </Suspense>
              }
            />
          </Route>

          {/* 404 Not Found */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
            </BrowserRouter>

            {/* React Query DevTools (개발 환경에서만) */}
            {process.env.NODE_ENV === 'development' && (
              <ReactQueryDevtools initialIsOpen={false} />
            )}
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

export default App
