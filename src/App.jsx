import { createContext } from "react";
import UseFetch from "./components/useFetch";
import Home from "./pages/home";
import {
  Route,
  createRoutesFromElements,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import SignIn from "./pages/signIn";
import Register from "./pages/register";
import Dashboard from "./pages/dashboard";
import EntryDetails from "./pages/entryDetails";
import Entry from "./pages/entry";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route index element={<Home />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path='/entries' element={<Entry />} />
      <Route path="/entry/:crud/:id" element={<EntryDetails />} />
    </Route>
  )
);

export const stateContext = createContext();

function App() {
  const { data, loading, setLoading, currentUser, expanded, setExpanded, handleToggleExpanded, formattedDate } = UseFetch("Entries");
  return (
    <main>
      <stateContext.Provider value={{ data, loading, setLoading, currentUser, expanded, setExpanded, handleToggleExpanded, formattedDate }}>
        <RouterProvider router={router} />
      </stateContext.Provider>
    </main>
  );
}

export default App;
