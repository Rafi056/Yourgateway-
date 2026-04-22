import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

// Pages
import Home from "./pages/Home";
import Institutions from "./pages/Institutions";
import InstitutionDetails from "./pages/InstitutionDetails";
import Dashboard from "./pages/Dashboard";
import Announcements from "./pages/Announcements";
import AdminPanel from "./pages/AdminPanel";
import Terms from "./pages/Terms";

// Components
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

// lib
import { LanguageProvider } from "./lib/i18n";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/institutions" component={Institutions} />
      <Route path="/institutions/:id" component={InstitutionDetails} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/announcements" component={Announcements} />
      <Route path="/admin" component={AdminPanel} />
      <Route path="/terms" component={Terms} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              <Router />
            </main>
            <Footer />
          </div>
          <Toaster />
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
