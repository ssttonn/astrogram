import "./global.css";
import { Routes, Route } from "react-router-dom";
import { LoginPage } from "./ui/auth/pages/LoginPage";
import { HomePage } from "./ui/home/pages/HomePage";
import { RegisterPage } from "./ui/auth/pages/RegisterPage";
import { AuthPage } from "./ui/auth/pages/AuthPage";
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <main className="flex h-screen">
      <Routes>
        <Route element={<AuthPage />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        
        
        <Route index element={<HomePage />} />
      </Routes>
      <Toaster/>
    </main>
  );
}

export default App;
