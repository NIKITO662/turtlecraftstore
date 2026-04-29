import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import Store from "./pages/Store.tsx";
import Forums from "./pages/Forums.tsx";
import ForumCategory from "./pages/ForumCategory.tsx";
import Thread from "./pages/Thread.tsx";
import Terms from "./pages/Terms.tsx";
import Privacy from "./pages/Privacy.tsx";
import { Account, ForgotPassword, Leaderboard, Rules, Support } from "./pages/Stubs.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/store" element={<Store />} />
          <Route path="/forums" element={<Forums />} />
          <Route path="/forums/:slug" element={<ForumCategory />} />
          <Route path="/forums/thread/:id" element={<Thread />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/rules" element={<Rules />} />
          <Route path="/support" element={<Support />} />
          <Route path="/account" element={<Account />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
