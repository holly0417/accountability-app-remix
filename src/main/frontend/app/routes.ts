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
    //this would connect "/" to "_index.tsx" if security permissions from backend allow (AKA: if signed in successfully).
    index("./routes/_index.tsx"),

    //all non-logged in users will be rerouted here if they're trying to access a restricted page
    route("login", "./routes/login.tsx"),

    //both logged in/out users and non-user visitors have access to this page.
    route("registration", "./routes/registration.tsx"),

    route("task/:status?", "./routes/task.tsx"),

    route("partners", "./routes/partners.tsx"),

    //Nested routes


] satisfies RouteConfig;
