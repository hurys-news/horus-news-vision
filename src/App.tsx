
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Sports from "./pages/Sports";
import NewsDetail from "./pages/NewsDetail";
import CategoryPage from "./pages/CategoryPage";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import Admin from "./pages/Admin";

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
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/admin/*" element={<Admin />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
