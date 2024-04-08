import { useState } from "react";
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
        <Route path="/register" element={<Register />}/>
        <Route path="/dashboard" element={<Dashboard />} />
    </Route>
  )
);

function App() {
  return (
    <main>
      <RouterProvider router={router} />
    </main>
  );
}

export default App;
