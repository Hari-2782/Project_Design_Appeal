import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./components/theme/theme";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminSidebar from "./components/AdminSidebar/AdminSidebar";
import Login from "./components/Login/Login";
import Signup from "./components/Signup/Signup";
import SimpleContainer from "./screens/LandingPage";
import EditSpace from "./screens/EditSpace";
import RegistrationSuccess from "./components/RegistrationSuccess/RegistrationSuccess";
import Profile from "./components/Homepage/Profile";
import Rate from "./components/Rate & Rev/Rate";
import ErrorBoundary from "./error";
import AddToCart from "./components/Workstage/addtocart";
import FeedbackForm from "./components/Homepage/FeedbackForm";
import VotingPage from "./components/Workstage/votes";
import RateForm from "./components/Rate Form/RateForm";
import AdminReviewApproval from "./components/Adminreviewapprove/AdminReviewList";
import AdminReviewList from "./components/Adminreviewapprove/AdminReviewList";


function App() {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ErrorBoundary>
        <Routes>
          <Route path="/admin/*" element={<AdminSidebar />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Signup />} />
          <Route path="/" element={<SimpleContainer />} />
          <Route path="/myproject" element={<EditSpace />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/cart" element={<AddToCart/>} />
          <><Route path="/feedback" element={<FeedbackForm />} />
          <Route path="/voting" element={<VotingPage/>} />
          <Route path="/ratings" element={<Rate />} />
          <Route path="/ratings" element={<Rate />} />
          <Route path="/addrate" element={<RateForm />} />
          <Route path="/cart" element={<AddToCart/>} />
          <Route path="/feedback" element={<FeedbackForm/>} />
          <Route path="/ap" element={<AdminReviewList/>} />
          <Route
        path="/registration-success"
        element={<RegistrationSuccess />} /></>
        </Routes>
        </ErrorBoundary>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
