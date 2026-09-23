import { createBrowserRouter } from "react-router";
import Root from "../pages/Root";
import Error from "../pages/Error";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
export const router = createBrowserRouter([
    {
        path: "/",
        Component: Root,
        errorElement: <Error/>,
        children:[
            {
                index: true,
                Component: Home,
            },
            {
                path: "/login",
                Component: Login,
            },
            {
                path: "/register",
                Component: Register,
            }
        ]
    },
])