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
import MentorDashboard from './pages/MentorDashboard';
import CreateSession from './pages/CreateSession';
import MenteeDashboard from './pages/MenteeDashboard';
import EditSession from './pages/EditSession';
import EditProfile from './pages/editprofile';
import AMASessionform from './pages/AMASessionform';
import CreateAMASession from './pages/AMASessionform';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/mentor-dashboard" element={<MentorDashboard />} />
            <Route path="/mentee-dashboard" element={<MenteeDashboard />} />
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
                <HomePageLanding />
            } />
            <Route path="/profile/:mentorId" element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            } />
            <Route path="/profile/:mentorId/edit" element={
              <ProtectedRoute>
                <EditProfile />
              </ProtectedRoute>
            } />
            <Route path="/booking/:sessionId" element={
              <ProtectedRoute>
                <BookingDetails />
              </ProtectedRoute>
            } />
            <Route path="/mentors" element={
              <ProtectedRoute>
                <AllMentors />
              </ProtectedRoute>
            } />
            <Route path="/questions/:sessionId" element={
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
            <Route path="/sessions/:sessionId/edit" element={<EditSession />} />
            <Route path="/create-ama-session" element={
              <ProtectedRoute>
                <AMASessionform />
              </ProtectedRoute>
            } />
            <Route path="/create-ama-session" element={<CreateAMASession />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;