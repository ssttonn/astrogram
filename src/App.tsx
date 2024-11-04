import "./global.css";
import { Routes, Route } from "react-router-dom";
import { LoginPage } from "./ui/auth/pages/LoginPage";
import { RegisterPage } from "./ui/auth/pages/RegisterPage";
import { AuthPage } from "./ui/auth/pages/AuthPage";
import { Toaster } from "./components/ui/toaster";
import RootPage from "./ui/home/RootPage";
import { AllUsersPage, CreatePostPage, EditPostPage, ExplorePage, HomePage, PostDetailPage, ProfilePage, SavedPage, UpdateProfilePage } from "./ui/home/pages";

function App() {
  return (
    <main className="flex h-screen">
      <Routes>
        <Route element={<AuthPage />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        <Route path="/" element={<RootPage />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/explore" element={<ExplorePage/>}/>
          <Route path="/all-users" element={<AllUsersPage/>}/>
          <Route path="/saved" element={<SavedPage/>}/>
          <Route path="/create-post" element={<CreatePostPage/>} />
          <Route path="/update-post/:id" element={<EditPostPage/>} />
          <Route path="/posts/:id" element={<PostDetailPage/>} />
          <Route path="/profile/:id/*" element={<ProfilePage/>} />
          <Route path="/update-profile/:id" element={<UpdateProfilePage/>} />
        </Route>
      </Routes>
      <Toaster />
    </main>
  );
}

export default App;
