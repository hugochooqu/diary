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
import Trash from "./pages/trash";
import Layout from "./components/layout";
import AddEntryForm from "./components/AddEntryForm";
import PublicDiaries from "./pages/PublicDiaries";
import Favorites from "./pages/Favorites";
import Reminders from "./pages/Reminders";

const router = createBrowserRouter([
  {
    path:'/',
    element: <Home />
  },
  {
    path:'/signin',
    element: <SignIn />
  },
  {
    path:'/register',
    element: <Register />
  },
  {
    path: '/dashboard',
    element: <Layout />,
    children: [
      {
        path:"/dashboard",
        element: <Entry />
      },
      {
        path:'/dashboard/new',
        element: <AddEntryForm />
      },
      {
        path:'/dashboard/trash',
        element: <Trash />
      },
      {
        path:'/dashboard/:crud/:id',
        element: <EntryDetails />
      },
      {
        path:'/dashboard/public-diaries',
        element: <PublicDiaries />
      },
      {
        path:'/dashboard/favorites',
        element: <Favorites />
      },
      {
        path:'/dashboard/reminders',
        element: <Reminders />
      }
    ]
  }
]
  // createRoutesFromElements(
  //   <Route>
  //     <Route index element={<Home />} />
  //     <Route path="/signin" element={<SignIn />} />
  //     <Route path="/register" element={<Register />} />
  //     <Route path="/dashboard" element={<Layout />} children={[
        
  //     ]} />
  //     <Route path='/entries' element={<Entry />} />
  //     <Route path="/entry/:crud/:id" element={<EntryDetails />} />
  //     <Route path="/trash" element={<Trash />} /> 
  //   </Route>
  // )
);

export const stateContext = createContext();

function App() {
  const { data, loading, setLoading, currentUser, expanded, setExpanded, handleToggleExpanded, formattedDate,  theme, setTheme, isOpen, setIsOpen, toggleTheme } = UseFetch("Entries");
  return (
    <main>
      <stateContext.Provider value={{ data, loading, setLoading, currentUser, expanded, setExpanded, handleToggleExpanded, formattedDate,  theme, setTheme, isOpen, setIsOpen, toggleTheme }}>
        <RouterProvider router={router} />
      </stateContext.Provider>
    </main>
  );
}

export default App;
