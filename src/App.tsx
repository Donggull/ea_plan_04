import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

// React 19 Enhanced Components
import { EnhancedErrorBoundary, SuspenseErrorBoundary } from '@/components/error/EnhancedErrorBoundary'
import { EnhancedLoading, NetworkAwareLoading } from '@/components/loading/EnhancedLoadingStates'
import { ReactProfiler, PerformanceDashboard } from '@/lib/performance/ReactProfiler'

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

// React 19 Enhanced Loading Component
function EnhancedLoadingFallback({ message = '페이지를 로드하는 중...' }: { message?: string }) {
  return (
    <EnhancedLoading
      state={{
        isLoading: true,
        message,
        progress: undefined
      }}
      variant="skeleton"
      showMessage
      className="min-h-[400px]"
    />
  )
}

function App() {
  return (
    <ReactProfiler id="App" enabled={process.env.NODE_ENV === 'development'}>
      <EnhancedErrorBoundary
        level="page"
        maxRetries={3}
        onError={(error, errorInfo) => {
          // 에러 로깅 (실제 환경에서는 외부 서비스로 전송)
          console.error('App Level Error:', { error, errorInfo })
        }}
      >
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <AuthProvider>
              <NetworkAwareLoading>
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

                      {/* Planning Module - Enhanced with React 19 features */}
                      <Route
                        path="planning/proposal"
                        element={
                          <SuspenseErrorBoundary
                            level="feature"
                            loadingFallback={<EnhancedLoadingFallback message="제안 페이지를 로드하는 중..." />}
                            suspenseKey="planning-proposal"
                          >
                            <ReactProfiler id="PlanningProposal">
                              <PlanningProposalPage />
                            </ReactProfiler>
                          </SuspenseErrorBoundary>
                        }
                      />
                      <Route
                        path="planning/construction"
                        element={
                          <SuspenseErrorBoundary
                            level="feature"
                            loadingFallback={<EnhancedLoadingFallback message="구축 페이지를 로드하는 중..." />}
                            suspenseKey="planning-construction"
                          >
                            <ReactProfiler id="PlanningConstruction">
                              <PlanningConstructionPage />
                            </ReactProfiler>
                          </SuspenseErrorBoundary>
                        }
                      />
                      <Route
                        path="planning/operation"
                        element={
                          <SuspenseErrorBoundary
                            level="feature"
                            loadingFallback={<EnhancedLoadingFallback message="운영 페이지를 로드하는 중..." />}
                            suspenseKey="planning-operation"
                          >
                            <ReactProfiler id="PlanningOperation">
                              <PlanningOperationPage />
                            </ReactProfiler>
                          </SuspenseErrorBoundary>
                        }
                      />

                      {/* Design Module - Enhanced with React 19 features */}
                      <Route
                        path="design/workflow"
                        element={
                          <SuspenseErrorBoundary
                            level="feature"
                            loadingFallback={<EnhancedLoadingFallback message="워크플로우 페이지를 로드하는 중..." />}
                            suspenseKey="design-workflow"
                          >
                            <ReactProfiler id="DesignWorkflow">
                              <DesignWorkflowPage />
                            </ReactProfiler>
                          </SuspenseErrorBoundary>
                        }
                      />
                      <Route
                        path="design/resources"
                        element={
                          <SuspenseErrorBoundary
                            level="feature"
                            loadingFallback={<EnhancedLoadingFallback message="리소스 페이지를 로드하는 중..." />}
                            suspenseKey="design-resources"
                          >
                            <ReactProfiler id="DesignResources">
                              <DesignResourcesPage />
                            </ReactProfiler>
                          </SuspenseErrorBoundary>
                        }
                      />

                      {/* Other Modules - All enhanced with React 19 features */}
                      <Route
                        path="publishing/canvas"
                        element={
                          <SuspenseErrorBoundary
                            level="feature"
                            loadingFallback={<EnhancedLoadingFallback message="캔버스 페이지를 로드하는 중..." />}
                          >
                            <ReactProfiler id="PublishingCanvas">
                              <PublishingCanvasPage />
                            </ReactProfiler>
                          </SuspenseErrorBoundary>
                        }
                      />
                      <Route
                        path="publishing/preview"
                        element={
                          <SuspenseErrorBoundary
                            level="feature"
                            loadingFallback={<EnhancedLoadingFallback message="미리보기 페이지를 로드하는 중..." />}
                          >
                            <ReactProfiler id="PublishingPreview">
                              <PublishingPreviewPage />
                            </ReactProfiler>
                          </SuspenseErrorBoundary>
                        }
                      />

                      <Route
                        path="development/environment"
                        element={
                          <SuspenseErrorBoundary
                            level="feature"
                            loadingFallback={<EnhancedLoadingFallback message="환경 설정 페이지를 로드하는 중..." />}
                          >
                            <ReactProfiler id="DevelopmentEnvironment">
                              <DevelopmentEnvironmentPage />
                            </ReactProfiler>
                          </SuspenseErrorBoundary>
                        }
                      />
                      <Route
                        path="development/deployment"
                        element={
                          <SuspenseErrorBoundary
                            level="feature"
                            loadingFallback={<EnhancedLoadingFallback message="배포 페이지를 로드하는 중..." />}
                          >
                            <ReactProfiler id="DevelopmentDeployment">
                              <DevelopmentDeploymentPage />
                            </ReactProfiler>
                          </SuspenseErrorBoundary>
                        }
                      />

                      <Route
                        path="chatbot/ai-chat"
                        element={
                          <SuspenseErrorBoundary
                            level="feature"
                            loadingFallback={<EnhancedLoadingFallback message="AI 챗봇 페이지를 로드하는 중..." />}
                          >
                            <ReactProfiler id="ChatbotAIChat">
                              <ChatbotAIChatPage />
                            </ReactProfiler>
                          </SuspenseErrorBoundary>
                        }
                      />
                      <Route
                        path="chatbot/custom-bot"
                        element={
                          <SuspenseErrorBoundary
                            level="feature"
                            loadingFallback={<EnhancedLoadingFallback message="커스텀 봇 페이지를 로드하는 중..." />}
                          >
                            <ReactProfiler id="ChatbotCustomBot">
                              <ChatbotCustomBotPage />
                            </ReactProfiler>
                          </SuspenseErrorBoundary>
                        }
                      />

                      <Route
                        path="image-generation"
                        element={
                          <SuspenseErrorBoundary
                            level="feature"
                            loadingFallback={<EnhancedLoadingFallback message="이미지 생성 페이지를 로드하는 중..." />}
                          >
                            <ReactProfiler id="ImageGeneration">
                              <ImageGenerationPage />
                            </ReactProfiler>
                          </SuspenseErrorBoundary>
                        }
                      />
                    </Route>

                    {/* 404 Not Found */}
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </BrowserRouter>
              </NetworkAwareLoading>

              {/* Development Tools */}
              {process.env.NODE_ENV === 'development' && (
                <>
                  <ReactQueryDevtools initialIsOpen={false} />
                  <PerformanceDashboard />
                </>
              )}
            </AuthProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </EnhancedErrorBoundary>
    </ReactProfiler>
  )
}

export default App