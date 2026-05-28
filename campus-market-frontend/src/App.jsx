import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignUpForm from "./components/SignUpForm";
import Navbar from "./components/Navbar";
import SignInForm from "./components/SignInForm";
import SellForm from "./components/SellForm";
import ItemDetails from "./pages/ItemDetails";
import TestCart from "./pages/TestCart";
import Cart from "./pages/Cart";
import Browse from "./pages/Browse";
import Dashboard from "./pages/Dashboard";
import EditProfile from "./pages/EditProfile";
import Footer from "./components/Footer";

function App() {
  return (
    <Router>
     <Navbar/>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/browse" element={<h1>Browse Items Page</h1>} />
          <Route path="/sell" element={<h1>Sell Item Page</h1>} />
          <Route path="/cart" element={<h1>Cart Page</h1>} />
          <Route path="/auth" element={<h1>Login Page</h1>} />*/}
          <Route path="/dashboard" element={<Dashboard/>} /> 
          <Route path="/signup" element={<SignUpForm />} />
          <Route path="/signin" element={<SignInForm/>} />
          <Route path="/sell" element={<SellForm/>} />
          <Route path="/item/:id" element={<ItemDetails/>} />
          <Route path="/test-cart" element={<TestCart/>} />
          <Route path="/cart" element={<Cart/>} />
          <Route path="/browse" element={<Browse/>} />
          <Route path="/profile/edit" element={<EditProfile/>} />
        </Routes>
      </div>
      <Footer/>
    </Router>
  );
}

export default App;
