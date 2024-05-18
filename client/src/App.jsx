import { BrowserRouter,Route,Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { SingnIn } from "./pages/SingnIn";
import {  SignUp } from "./pages/SignUp";
import { About } from "./pages/About";
import { Profil } from "./pages/Profile";
import Header from "./component/Header";

export default function App() {
  return (
    <BrowserRouter>
      <Header/>
      <Routes>
        <Route  path="/" element={<Home />}/>
        <Route  path="/sign-in" element={<SingnIn />}/>
        <Route  path="/sign-up" element={<SignUp />}/>
        <Route  path="/about" element={<About />}/>
        <Route  path="/profile" element={<Profil />}/>
      </Routes>
    </BrowserRouter>
  )
}
