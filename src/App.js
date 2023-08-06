
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";

import "react-toastify/dist/ReactToastify.css";

// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import "react-responsive-carousel/lib/styles/carousel.min.css";
// import MyAccount from "./pages/MyAccount";
// import ViewProfile from "./pages/ViewProfile";


// import ScrollToTop from "./utils/ScrollToTop";
import PrivateRoute from "./utils/PrivateRoute";

import Header from "./components/UI/Header";
import Main from "./pages/Main";
import UploadMovies from "./pages/UploadMovies"
import PublicList from "./pages/PublicList";
import Privatelist from "./pages/Privatelist";

const App = () => {
  return (
    <>
      <BrowserRouter scrollBehavior="manual">
        {/* <ScrollToTop /> */}
        <Header />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signUp" element={<SignUp />} />
          <Route path="/up" element={<UploadMovies />} />
         
          <Route
            path="/public"
            element={<PrivateRoute Component={PublicList} />}
          />
          <Route
            path="/private"
            element={<PrivateRoute Component={Privatelist} />}
          />

          
          
          
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
