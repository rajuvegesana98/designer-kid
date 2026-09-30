import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router'
import { AppShell } from './components/AppShell'
import { FullPageLoader } from './components/ui'
import { AccountPage, NotFound, ProfilePage, SearchPage } from './pages/Account'
import { CareerCentre, CareerSectionPage } from './pages/Career'
import { ChallengePage, ChallengesPage } from './pages/Challenges'
import { Home } from './pages/Dashboard'
import { Landing } from './pages/Landing'
import { LearnIndex, LevelRoadmap, ModulePage } from './pages/Learn'
import { LessonPage } from './pages/Lesson'
import { Onboarding } from './pages/Onboarding'
import { PrintGuide, PrintLesson, PrintModule } from './pages/Print'
import { ProgressPage } from './pages/Progress'
import { ReviewsPage } from './pages/Reviews'
import { ResourcesPage } from './pages/Resources'
import { AuthProvider } from './state/auth'
import { ContentProvider, useContent } from './state/content'
import { LearnerProvider } from './state/learner'
import { ThemeProvider, ToastProvider } from './state/ui'

// The admin is a separate chunk: students never download it.
const AdminApp = lazy(() => import('./admin/AdminApp'))

function Themed() {
  const { content } = useContent()
  return (
    <ThemeProvider content={content}>
      <ToastProvider>
        <AuthProvider>
          <LearnerProvider>
            <Routes>
              <Route path="/welcome" element={<Landing />} />
              <Route path="/start" element={<Onboarding />} />
              <Route path="/account" element={<AccountPage />} />
              <Route path="/print/lesson/:lessonId" element={<PrintLesson />} />
              <Route path="/print/module/:levelId/:moduleId" element={<PrintModule />} />
              <Route path="/print/guide/:guideId" element={<PrintGuide />} />
              <Route
                path="/admin/*"
                element={
                  <Suspense fallback={<FullPageLoader />}>
                    <AdminApp />
                  </Suspense>
                }
              />
              <Route path="/" element={<Home />} />
              <Route element={<AppShell />}>
                <Route path="/learn" element={<LearnIndex />} />
                <Route path="/learn/:levelId" element={<LevelRoadmap />} />
                <Route path="/learn/:levelId/:moduleId" element={<ModulePage />} />
                <Route path="/lesson/:lessonId" element={<LessonPage />} />
                <Route path="/challenges" element={<ChallengesPage />} />
                <Route path="/challenges/:challengeId" element={<ChallengePage />} />
                <Route path="/career" element={<CareerCentre />} />
                <Route path="/career/:section" element={<CareerSectionPage />} />
                <Route path="/resources" element={<ResourcesPage />} />
                <Route path="/progress" element={<ProgressPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/reviews" element={<ReviewsPage />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </LearnerProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  )
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      <ContentProvider fallback={<FullPageLoader />}>
        <Themed />
      </ContentProvider>
    </BrowserRouter>
  )
}
