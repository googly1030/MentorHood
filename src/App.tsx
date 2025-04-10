import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePageLanding from './components/HomePageLanding';
import UserProfile from './pages/userprofile';
import BookingDetails from './components/BookingDetails';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import AllMentors from './pages/AllMentors';
import QuestionSection from './components/QuestionSection';
import QuestionAnswers from './components/QuestionAnswers';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import UnauthenticatedRoute from './components/UnauthenticatedRoute';
import MentorProfileForm from './components/MentorProfileForm';
import Dashboard from './pages/Dashboard';
import CreateSession from './pages/CreateSession';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route 
              path="/register" 
              element={
                <UnauthenticatedRoute>
                  <Register />
                </UnauthenticatedRoute>
              } 
            />
            <Route 
              path="/login" 
              element={
                <UnauthenticatedRoute>
                  <Login />
                </UnauthenticatedRoute>
              } 
            />

            {/* Protected Routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <HomePageLanding />
              </ProtectedRoute>
            } />
            <Route path="/profile/:id" element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            } />
            <Route path="/booking/:serviceId" element={
              <ProtectedRoute>
                <BookingDetails />
              </ProtectedRoute>
            } />
            <Route path="/mentors" element={
              <ProtectedRoute>
                <AllMentors />
              </ProtectedRoute>
            } />
            <Route path="/questions" element={
              <ProtectedRoute>
                <QuestionSection />
              </ProtectedRoute>
            } />
            <Route path="/questions/:questionId/answers" element={
              <ProtectedRoute>
                <QuestionAnswers />
              </ProtectedRoute>
            } />
            <Route 
              path="/mentor-profile" 
              element={
                <ProtectedRoute>
                  <MentorProfileForm />
                </ProtectedRoute>
              } 
            />
            <Route path="/create-session" element={
              <ProtectedRoute>
                <CreateSession />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;