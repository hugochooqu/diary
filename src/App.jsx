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

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route index element={<Home />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Route>
  )
);

export const stateContext = createContext();

function App() {
  const { data, loading, setLoading, currentUser } = UseFetch("Entries");
  return (
    <main>
      <stateContext.Provider value={{ data, loading, setLoading, currentUser }}>
        <RouterProvider router={router} />
      </stateContext.Provider>
    </main>
  );
}

export default App;
