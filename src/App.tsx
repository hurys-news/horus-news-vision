
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Sports from "./pages/Sports";
import NewsDetail from "./pages/NewsDetail";
import CategoryPage from "./pages/CategoryPage";
import Login from "./pages/Login";
import LoginDirect from "./pages/LoginDirect";
import BasicLogin from "./pages/BasicLogin";
import SimpleLogin from "./pages/SimpleLogin";
import ForgotPassword from "./pages/ForgotPassword";
import Admin from "./pages/Admin";
import SimpleAdmin from "./pages/SimpleAdmin";
import TestAuth from "./pages/TestAuth";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1
    }
  }
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/sports" element={<Sports />} />
            <Route path="/politics" element={<CategoryPage />} />
            <Route path="/economy" element={<CategoryPage />} />
            <Route path="/tech" element={<CategoryPage />} />
            <Route path="/pulse" element={<CategoryPage />} />
            <Route path="/depth" element={<CategoryPage />} />
            <Route path="/insights" element={<CategoryPage />} />
            <Route path="/street-voice" element={<CategoryPage />} />
            <Route path="/special-files" element={<CategoryPage />} />
            <Route path="/opinion" element={<CategoryPage />} />
            <Route path="/news/:id" element={<NewsDetail />} />
            <Route path="/category/:slug" element={<CategoryPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/login-direct" element={<LoginDirect />} />
            <Route path="/basic-login" element={<BasicLogin />} />
            <Route path="/simple-login" element={<SimpleLogin />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/admin/*" element={<Admin />} />
            <Route path="/simple-admin" element={<SimpleAdmin />} />
            <Route path="/test-auth" element={<TestAuth />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
