import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import LandingPage from '@/pages/LandingPage';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import Dashboard from '@/pages/contractor/Dashboard';
import RequestForm from '@/pages/contractor/RequestForm';
import Confirmation from '@/pages/contractor/Confirmation';
import Requests from '@/pages/contractor/Requests';
import MatchingPage from '@/pages/matching/MatchingPage';
import DriverDashboard from '@/pages/driver/DriverDashboard';
import JobDetails from '@/pages/driver/JobDetails';

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/contractor/dashboard" component={Dashboard} />
      <Route path="/contractor/request" component={RequestForm} />
      <Route path="/contractor/confirmation/:id" component={Confirmation} />
      <Route path="/contractor/requests" component={Requests} />
      <Route path="/matching/:id" component={MatchingPage} />
      <Route path="/driver/dashboard" component={DriverDashboard} />
      <Route path="/driver/job/:id" component={JobDetails} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
