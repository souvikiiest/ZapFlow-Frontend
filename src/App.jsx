import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import Header from "./components/header";
import ProtectedRoute from "./context/protectedRoute";
import CreateZap from "./pages/createzap";
import Dashboard from "./pages/dashboard";
import History from "./pages/history";
import Landing from "./pages/landing";
import Signin from "./pages/signin";
import Signup from "./pages/signup";

export default function App() {


  return (
    <Router>
      <Header  />
      <main>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/create-zap" element={<ProtectedRoute><CreateZap /></ProtectedRoute>} />
          <Route path="/zaps/edit/:zapId" element={<ProtectedRoute><CreateZap /></ProtectedRoute>} />
          <Route path="/zaps/history/:zapId" element={<ProtectedRoute><History /></ProtectedRoute>} />
        </Routes>
      </main>
    </Router>
  );
}
