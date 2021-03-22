import Home from './routes/Home.svelte';
import LogIn from './routes/LogIn.svelte';
import SignUp from './routes/SignUp.svelte';
import Help from './routes/Help.svelte';
import Annual from './components/tabs/Annual.svelte';
import Monthly from './components/tabs/Monthly.svelte';
import Weekly from './components/tabs/Weekly.svelte';

const routes = {
  '/': Home,
  '/login': LogIn,
  '/signup': SignUp,
  '/help': Help,
  '/annual': Annual,
  '/monthly': Monthly,
  '/weekly': Weekly,
};

export default routes;
