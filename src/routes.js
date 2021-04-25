import Home from './routes/Home.svelte';
import LogIn from './routes/LogIn.svelte';
import SignUp from './routes/SignUp.svelte';
import Help from './routes/Help.svelte';
import Birthday from './routes/Birthday.svelte';
import Calendar from './components/Calendar.svelte';

const routes = {
  '/': Home,
  '/login': LogIn,
  '/signup': SignUp,
  '/help': Help,
  '/annual': Calendar,
  '/monthly': Calendar,
  '/weekly': Calendar,
  '/birthday': Birthday,
};

export default routes;
