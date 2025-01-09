import AddBranches from "views/admin/AddBranches";
import AddInstructor from "views/admin/AddInstructor";
import AddManager from "views/admin/AddManager";
import AddVehicle from "views/admin/AddVehicles";
import Admission from "views/admin/Admission";
import Admissions from "views/admin/Admissions";
import Alert from "views/admin/Alert";
import Branches from "views/admin/Branches";
import Cars from "views/admin/Cars";
import Courses from "views/admin/Courses";
import Dashboard from "views/admin/Dashboard";
import Finances from "views/admin/Finances";
import Instructors from "views/admin/Instructors";
import Managers from "views/admin/Managers";
import Users from "views/admin/Users";
import Login from "views/auth/Login";
import SortFinancesByDate from "../views/admin/SortFinancesByDate";
import Schedules from "../views/admin/Schedules";

import AddCourse from "views/admin/AddCourse";
import AddAttendance from "views/admin/AddAttendance";
import Attendance from "views/admin/Attendance";
import Notifications from "views/admin/Notifications";
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
    path: "/attendance",
    component: Attendance,
    name: "Attendance",
    layout: "admin",
    isMenu: true,
  },
  {
    path: "/notifications",
    component: Notifications,
    name: "Notifications",
    layout: "admin",
    isMenu: true,
  },
  {
    path: "/add-attendance",
    component: AddAttendance,
    name: "Attendance",
    layout: "admin",
    isMenu: true,
  },
  {
    path: "/courses",
    component: Courses,
    name: "Courses",
    layout: "admin",
    isMenu: true,
  },
  {
    path: "/alert",
    component: Alert,
    name: "Alert",
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
    path: "/add-course",
    name: "Courses",
    component: AddCourse,
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
    path: "/addmission",
    name: "Admissions",
    component: Admission,
    layout: "admin",
    isMenu: false,
  },
  {
    path: "/addmissions",
    name: "Admissions",
    component: Admissions,
    layout: "admin",
    isMenu: false,
  },
  {
    path: "/finances",
    name: "Finances",
    component: Finances,
    layout: "admin",
    isMenu: true,
  },
  {
    path: "/sort-finances-by-date",
    name: "sort-finances-by-date",
    component: SortFinancesByDate,
    layout: "admin",
    isMenu: false,
  },
  {
    path: "/login",
    component: Login,
    layout: "auth",
    isMenu: false,
  },
  {
    path:"/schedules",
    name:"Schedule",
    component: Schedules,
    layout: "admin",
    isMenu: false,
  }
];
export default routes;
