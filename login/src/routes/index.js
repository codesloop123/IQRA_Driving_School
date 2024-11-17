import AddBranches from "views/admin/AddBranches";
import AddInstructor from "views/admin/AddInstructor";
import AddManager from "views/admin/AddManager";
import AddVehicle from "views/admin/AddVehicles";
import Branches from "views/admin/Branches";
import Cars from "views/admin/Cars";
import Dashboard from "views/admin/Dashboard";
import Instructors from "views/admin/Instructors";
import Managers from "views/admin/Managers";
import Users from "views/admin/Users";
import Login from "views/auth/Login";

let routes = [
  {
    path: "/",
    component: Dashboard,
    name: "Dashboard",
    layout: "admin",
    isMenu: true,
  },
  {
    path: "/branches",
    component: Branches,
    name: "Branches",
    layout: "admin",
    isMenu: true,
  },
  {
    path: "/managers",
    name: "Managers",
    component: Managers,
    layout: "admin",
    isMenu: true,
  },
  {
    path: "/users",
    name: "Users",
    component: Users,
    layout: "admin",
    isMenu: true,
  },
  {
    path: "/vehicles",
    name: "Vehicles",
    component: Cars,
    layout: "admin",
    isMenu: true,
  },
  {
    path: "/instructors",
    name: "Instructors",
    component: Instructors,
    layout: "admin",
    isMenu: true,
  },
  {
    path: "/add-instructors",
    name: "Instructors",
    component: AddInstructor,
    layout: "admin",
    isMenu: false,
  },
  {
    path: "/add-vehicles",
    name: "Vehicles",
    component: AddVehicle,
    layout: "admin",
    isMenu: false,
  },
  {
    path: "/add-branches",
    name: "Branches",
    component: AddBranches,
    layout: "admin",
    isMenu: false,
  },
  {
    path: "/add-manager",
    name: "Managers",
    component: AddManager,
    layout: "admin",
    isMenu: false,
  },
  {
    path: "/login",
    component: Login,
    layout: "auth",
    isMenu: false,
  },
];
export default routes;
