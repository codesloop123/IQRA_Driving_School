import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Loginform from './components/Assets/loginform/Login';
import Register from './components/Assets/loginform/Register';
import Dashboard from './components/pages/Dashboard';

//SadarBranch imports
import Sidebarmanag from './components/sidebar/sidebarmanag';
import Sadardash from './components/pages/sadardash';
import Admissions from './components/pages/admissions';
import Attendance from './components/pages/attendance';
import AlertsSadar from './components/pages/alertssadar';
import Instructorsadar from './components/pages/instructorsadar';
import Financessadar from './components/pages/financessadar';
import Carsdetail from './components/pages/carsdetail';
import Schedule from './components/pages/schedule';
import StudentDetailsModal from './components/pages/StudentDetailsModal';


// Golra Branch Imports
import Sidebargolra from './components/sidebar/sidebargolra';
import Golradash from './components/pages/golradash';
import AdmissionsGolra from './components/pages/admissionsgolra';  // Admissions page for Melody branch
import AttendanceGolra from './components/pages/attendancegolra';  // Golra-specific attendance
import AlertsGolra from './components/pages/alertsgolra';  // Golra-specific alerts
import InstructorsGolra from './components/pages/instructorsgolra';  // Instructors page for Melody branch
import FinancesGolra from './components/pages/financesgolra';  // Golra-specific finances
import CarsDetailGolra from './components/pages/carsdetailgolra';  // Golra-specific car details
import ScheduleGolra from './components/pages/schedulegolra';  // Golra-specific schedule

// Melody branch imports
import Sidebarmel from './components/sidebar/sidebarmel'; 
import Melodydash from './components/pages/melodydash';
import AdmissionsMel from './components/pages/admissionsmel';  // Admissions page for Melody branch
import AttendanceMel from './components/pages/attendancemel';  // Attendance page for Melody branch
import AlertsMel from './components/pages/alertsmel';  // Alerts page for Melody branch
import InstructorsMel from './components/pages/instructorsmel';  // Instructors page for Melody branch
import FinancesMel from './components/pages/financesmel';  // Finances page for Melody branch
import CarsDetailMel from './components/pages/carsdetailmel';  // Cars Detail page for Melody branch
import ScheduleMel from './components/pages/schedulemel';  // Schedule page for Melody branch
//sixth 
import Sidebar6 from './components/sidebar/sidebar6'; 
import Sixthdash from './components/pages/sixthdash';
import AdmissionsSixth from './components/pages/admissionssixth';  // Import for AdmissionsSixth
import AttendanceSixth from './components/pages/attendancesixth';  // Sixth-specific attendance
import AlertsSixth from './components/pages/alertssixth';  // Sixth-specific alerts
import InstructorsDetailSixth from './components/pages/instructorssixth';  // Import for InstructorsDetailSixth
import FinancesSixth from './components/pages/financessixth';  // Sixth-specific finances
import CarsDetailSixth from './components/pages/carsdetailsixth';  // Sixth-specific car details
import ScheduleSixth from './components/pages/schedulesixth';  // Sixth-specific schedule
// Chaklala Branch Imports
import Sidebarchak from './components/sidebar/sidebarchak'; 
import Chaklaladash from './components/pages/chaklaladash';
import AdmissionsChak from './components/pages/admissionschak';  // Admissions page for Chaklala branch
import AttendanceChak from './components/pages/attendancechak';  // Attendance page for Chaklala branch
import AlertsChak from './components/pages/alertschak';  // Alerts page for Chaklala branch
import InstructorsDetailChak from './components/pages/instructorschak';
import FinancesChak from './components/pages/financeschak';  // Finances page for Chaklala branch
import CarsDetailChak from './components/pages/carsdetailchak';  // Cars Detail page for Chaklala branch
import ScheduleChak from './components/pages/schedulechak';  // Import the ScheduleChak page
//g10
import Sidebarg10 from './components/sidebar/sidebarg10'; 
import G10dash from './components/pages/g10dash';
import AdmissionsG10 from './components/pages/admissionsg10';  // G10-specific admissions
import AttendanceG10 from './components/pages/attendanceg10';  // G10-specific attendance
import AlertsG10 from './components/pages/alertsg10';  // G10-specific alerts
import InstructorsG10 from './components/pages/instructorsg10';  // G10-specific instructors
import FinancesG10 from './components/pages/financesg10';  // G10-specific finances
import CarsDetailG10 from './components/pages/carsdetailg10';  // G10-specific car details
import ScheduleG10 from './components/pages/scheduleg10';  // G10-specific schedule
//ali
import Sidebarali from './components/sidebar/sidebarali'; 
import Alipurdash from './components/pages/alipurdash';
import AdmissionsAli from './components/pages/admissionsali';
import AttendanceAli from './components/pages/attendancealipur';
import AlertsAli from './components/pages/alertsali';
import InstructorsAli from './components/pages/instructorsali';
import FinancesAli from './components/pages/financesali';
import CarsDetailAli from './components/pages/carsdetailali';
import ScheduleAli from './components/pages/scheduleali';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Loginform />} />
          <Route path="/register" element={<Register/>} />

          {/* Removed SidebarWithRoutes */}
          <Route path="/sidebarmanag/*" element={<SidebarmanagWithRoutes />} />
          <Route path="/sidebarmel/*" element={<SidebarmelWithRoutes />} />
          <Route path="/sidebargolra/*" element={<SidebargolraWithRoutes />} /> {/* Golra branch sidebar */}
          <Route path="/sidebarg10/*" element={<Sidebarg10WithRoutes />} />
          <Route path="/sidebar6/*" element={<Sidebar6WithRoutes />} />
          <Route path="/sidebarchak/*" element={<SidebarChakWithRoutes />} />
          <Route path="/sidebarali/*" element={<SidebarAliWithRoutes />} />

          {/* Routes without sidebar */}
          <Route path="/sadardash" element={<Sadardash />} />
          <Route path="/melodydash" element={<Melodydash />} />
          <Route path="/golradash" element={<Golradash />} />  {/* Golra branch dashboard */}
          <Route path="/sixthdash" element={<Sixthdash />} />
          <Route path="/chaklaladash" element={<Chaklaladash />} />
          <Route path="/g10dash" element={<G10dash />} />
          <Route path="/alipurdash" element={<Alipurdash />} />

          {/* Default fallback to Dashboard */}
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

function SidebarmanagWithRoutes() {
  return (
    <Sidebarmanag>
      <Routes>
        <Route path="admissions" element={<Admissions />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="alertssadar" element={<AlertsSadar />} />
        <Route path="instructorsadar" element={<Instructorsadar />} />
        <Route path="financessadar" element={<Financessadar />} />
        <Route path="carsdetail" element={<Carsdetail />} />
        <Route path="schedule" element={<Schedule />} />
        <Route path="studentDetailmodal" element={<StudentDetailsModal />} />

        <Route path="*" element={<Sadardash />} />
      </Routes>
    </Sidebarmanag>
  );
}

function SidebargolraWithRoutes() {
  return (
    <Sidebargolra>
      <Routes>
        <Route path="admissionsgolra" element={<AdmissionsGolra />} />
        <Route path="attendancegolra" element={<AttendanceGolra />} />  {/* Add the route for AttendanceGolra */}
        <Route path="alertsgolra" element={<AlertsGolra />} />  {/* Add the route for AlertsGolra */}
        <Route path="instructorsgolra" element={<InstructorsGolra />} />
        <Route path="financesgolra" element={<FinancesGolra />} />  {/* Add the route for FinancesGolra */}
        <Route path="carsdetailgolra" element={<CarsDetailGolra />} />  {/* Add the route for CarsDetailGolra */}
        <Route path="schedulegolra" element={<ScheduleGolra />} />  {/* Add the route for ScheduleGolra */}
        <Route path="*" element={<Golradash />} />  {/* Default to Golra dashboard */}
      </Routes>
    </Sidebargolra>
  );
}

  
function SidebarmelWithRoutes() {
  return (
    <Sidebarmel>
      <Routes>
        <Route path="admissionsmel" element={<AdmissionsMel />} />
        <Route path="attendancemel" element={<AttendanceMel />} />
        <Route path="alertsmel" element={<AlertsMel />} />
        <Route path="instructorsmel" element={<InstructorsMel />} />
        <Route path="financesmel" element={<FinancesMel />} />
        <Route path="carsdetailmel" element={<CarsDetailMel />} />
        <Route path="schedulemel" element={<ScheduleMel />} />
        <Route path="*" element={<Melodydash />} />
      </Routes>
    </Sidebarmel>
  );
}


function Sidebarg10WithRoutes() {
  return (
    <Sidebarg10>
      <Routes>
      <Route path="admissionsg10" element={<AdmissionsG10 />} />  {/* G10-specific admissions */}
        <Route path="attendanceg10" element={<AttendanceG10 />} />  {/* G10-specific attendance */}
        <Route path="alertsg10" element={<AlertsG10 />} />  {/* G10-specific alerts */}
        <Route path="financesg10" element={<FinancesG10 />} />  {/* G10-specific finances */}
        <Route path="instructorsg10" element={<InstructorsG10 />} />  {/* G10-specific instructors */}
        <Route path="carsdetailg10" element={<CarsDetailG10 />} />  {/* G10-specific car details */}
        <Route path="scheduleg10" element={<ScheduleG10 />} />  {/* G10-specific schedule */}
        <Route path="*" element={<G10dash />} />
      </Routes>
    </Sidebarg10>
  );
}

function Sidebar6WithRoutes() {
  return (
    <Sidebar6>
      <Routes>
      <Route path="admissionssixth" element={<AdmissionsSixth />} />  {/* Route for AdmissionsSixth */}
      <Route path="attendancesixth" element={<AttendanceSixth />} />  {/* Sixth-specific attendance */}
        <Route path="alertssixth" element={<AlertsSixth />} />  {/* Sixth-specific alerts */}
        <Route path="instructorsdetailsixth" element={<InstructorsDetailSixth />} />  {/* Sixth-specific instructors */}
        <Route path="financessixth" element={<FinancesSixth />} />  {/* Sixth-specific finances */}
        <Route path="carsdetailsixth" element={<CarsDetailSixth />} />  {/* Sixth-specific car details */}
        <Route path="schedulesixth" element={<ScheduleSixth />} />  {/* Sixth-specific schedule */}
        <Route path="*" element={<Sixthdash />} />
      </Routes>
    </Sidebar6>
  );
}

function SidebarChakWithRoutes() {
  return (
    <Sidebarchak>
      <Routes>
        <Route path="admissionschak" element={<AdmissionsChak />} />  {/* Chaklala-specific admissions */}
        <Route path="attendancechak" element={<AttendanceChak />} />  {/* Chaklala-specific attendance */}
        <Route path="alertschak" element={<AlertsChak />} />  {/* Chaklala-specific alerts */}
        <Route path="financeschak" element={<FinancesChak />} />  {/* Chaklala-specific finances */}
        <Route path="carsdetailchak" element={<CarsDetailChak />} />  {/* Chaklala-specific car details */}
        <Route path="instructorsdetailchak" element={<InstructorsDetailChak />} />  {/* Chaklala-specific instructors */}
        <Route path="schedulechak" element={<ScheduleChak />} />  {/* Chaklala-specific schedule */}

        <Route path="*" element={<Chaklaladash />} />  {/* Default to Chaklala dashboard */}
      </Routes>
    </Sidebarchak>
  );
}


function SidebarAliWithRoutes() {
  return (
    <Sidebarali>
      <Routes>
      <Route path="admissionsali" element={<AdmissionsAli />} />
        <Route path="attendanceali" element={<AttendanceAli />} />
        <Route path="alertsali" element={<AlertsAli />} />
        <Route path="financesali" element={<FinancesAli />} />
        <Route path="carsdetailali" element={<CarsDetailAli />} />
        <Route path="instructorsali" element={<InstructorsAli />} />
        <Route path="scheduleali" element={<ScheduleAli />} />
        <Route path="*" element={<Alipurdash />} />
      </Routes>
    </Sidebarali>
  );
}

export default App;
