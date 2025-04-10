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

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePageLanding />} />
            <Route path="/profile/:id" element={<UserProfile />} />
            <Route path="/booking/:serviceId" element={<BookingDetails />} />
            <Route path="/mentors" element={<AllMentors />} />
            <Route path="/questions" element={<QuestionSection />} />
            <Route path="/questions/:questionId/answers" element={<QuestionAnswers />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;