import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/public/home";
import About from "@/pages/public/about";
import Courses from "@/pages/public/courses";
import Faculty from "@/pages/public/faculty";
import Notes from "@/pages/public/notes";
import Papers from "@/pages/public/papers";
import Gallery from "@/pages/public/gallery";
import Announcements from "@/pages/public/announcements";
import Contact from "@/pages/public/contact";

import StudentLogin from "@/pages/student/login";
import StudentRegister from "@/pages/student/register";
import StudentDashboard from "@/pages/student/dashboard";
import StudentProfile from "@/pages/student/profile";
import StudentFees from "@/pages/student/fees";

import AdminLogin from "@/pages/admin/login";
import AdminChangePassword from "@/pages/admin/change-password";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminStudents from "@/pages/admin/students";
import StudentDetail from "@/pages/admin/student-detail";
import AdminTerminatedStudents from "@/pages/admin/terminated-students";
import AdminContent from "@/pages/admin/content";
import AdminMessages from "@/pages/admin/messages";

import { PublicLayout } from "@/components/layout/public-layout";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      {/* Public Routes with PublicLayout */}
      <Route path="/">
        <Home />
      </Route>
      <Route path="/about">
        <About />
      </Route>
      <Route path="/courses">
        <Courses />
      </Route>
      <Route path="/faculty">
        <Faculty />
      </Route>
      <Route path="/notes">
        <Notes />
      </Route>
      <Route path="/papers">
        <Papers />
      </Route>
      <Route path="/gallery">
        <Gallery />
      </Route>
      <Route path="/announcements">
        <Announcements />
      </Route>
      <Route path="/contact">
        <Contact />
      </Route>

      {/* Student Auth Routes */}
      <Route path="/student/login" component={StudentLogin} />
      <Route path="/student/register" component={StudentRegister} />
      
      {/* Student Portal Routes */}
      <Route path="/student/dashboard" component={StudentDashboard} />
      <Route path="/student/profile" component={StudentProfile} />
      <Route path="/student/fees" component={StudentFees} />

      {/* Admin Auth Routes */}
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin/change-password" component={AdminChangePassword} />

      {/* Admin Portal Routes */}
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/admin/students" component={AdminStudents} />
      <Route path="/admin/students/:id" component={StudentDetail} />
      <Route path="/admin/terminated-students" component={AdminTerminatedStudents} />
      <Route path="/admin/content" component={AdminContent} />
      <Route path="/admin/messages" component={AdminMessages} />

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
