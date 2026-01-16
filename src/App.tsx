import { Routes, Route, useLocation, Link, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import GeneratePage from './pages/GeneratePage';
import DashBoardPage from './pages/DashboardPage';
import ViewPage from './pages/ViewPage';

import type React from 'react';
import { useAuthStore } from './state/auth';

function PrivateRoute({ children }: { children: React.JSX.Element }) {
  // Mimic: Token is true means user aldready logged in
  const token = useAuthStore((s) => s.accessToken);
  return token ? children : <Navigate to='/login' replace />
  // if (token) return children;
  // else return <Navigate to='/login' replace />
}

function Layout({ children }: { children: React.JSX.Element }) {
  const { accessToken, logout, user } = useAuthStore();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const isAuthPage = useLocation().pathname === '/login' || useLocation().pathname === '/register';

  // If it's a login or register page, don't wrap with Layout
  if (isAuthPage) {
    return children;
  }
  return (
    <div>
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo/Title */}
            <div className="flex items-center gap-1">
              <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                SDETPRO Test Assistant
              </h1>
            </div>

            {/* Navigation Links */}
            <nav className="flex items-center gap-1">
              <Link
                to="/"
                // eslint-disable-next-line react-hooks/rules-of-hooks
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${useLocation().pathname === '/'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-100'
                  }`}
              >
                Generate
              </Link>
              <Link
                to="/dashboard"
                // eslint-disable-next-line react-hooks/rules-of-hooks
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${useLocation().pathname === '/dashboard'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-100'
                  }`}
              >
                Dashboard
              </Link>
            </nav>

            {/* User Email (Hardcoded for now) */}
            <div className="flex items-center gap-4">
              {accessToken && user && (
                <span className="text-sm text-gray-600 hidden sm:block">
                  {user.email}
                </span>
              )}
              {accessToken && (
                <div onClick={logout} className='text-gray-600 hover:bg-gray-100 bg-white border border-gray-300 px-3 py-2 rounded-lg font-low hidden sm:block '>Logout</div>
              )}

            </div>
          </div>
        </div>
      </header>
      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>

        <Route path="/login" element={
          <Layout>
            <LoginPage />
          </Layout>
        } />

        <Route path="/register" element={
          <Layout>
            <RegisterPage />
          </Layout>
        } />
        <Route path="/" element={
          <Layout>
            <PrivateRoute><GeneratePage /></PrivateRoute>
          </Layout>
        } />

        <Route path="/dashboard" element={
          <Layout>
            <PrivateRoute><DashBoardPage /></PrivateRoute>
          </Layout>
        } />
        <Route
          path="/view/:id"
          element={
            <Layout>
              <PrivateRoute>
                <ViewPage />
              </PrivateRoute>
            </Layout>
          }
        />

        {/* <Route path="/login" element={<LoginPage />} /> */}
        {/* <Route path="/register" element={<RegisterPage />} /> */}
        {/* <Route path="/generate" element={<GeneratePage />} /> */}
        {/* <Route path="/dashboard" element={<DashBoardPage />} /> */}
        {/* <Route path="/" element={
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900">Welcome to Test Assistant</h1>
            <p className="mt-4 text-yello-600">Frontend structure initialized!</p>
          </div>
        } /> */}
      </Routes>
    </div>
  )
}

export default App
