import {type RouteConfig, index, route} from "@react-router/dev/routes";


//BACKEND notes: from WebSecurityConfig
//NON-LOGGED users only have access to "/registration", "/email/**", "/h2-console/**","/change-password-from-token/**", "/error"
//any other address will take them directly to the login page

//BACKEND notes: from DefaultController (lowest precedence checks)
//after the above check from WebSecurityConfig
//if there is any address that does NOT match "/index.html","/api","/error","/h2-console"
//and not already checked beforehand will be forwarded to "index.html";

export default [
    //this is NOT the same thing as index.html.
    //this would connect "/" to "home.tsx" if security permissions from backend allow (if signed in).
    index("./routes/home.tsx"),

    //all non-logged in users will be rerouted here if they're trying to access a restricted page
    route("login", "./routes/SignIn.tsx"),


    route("registration", "./routes/SignUp.tsx"),
    //route("task/:taskId", "./routes/task.tsx"),

    //Nested routes


] satisfies RouteConfig;
