import React, { Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginComponent from "../component/Admin/LoginComponent/Login";
import ForgotPassword from "../component/ForgotPassComponent/ForgotPassword";
import AccountManagement from "../component/Admin/AccountManagementComponent/AccountManagement";
import HomePage from "../component/HomeComponent/Home";
import WaitingRoomManagement from "../component/Admin/WaitingRoomManagementComponent/WaitingRoomManagement";
import PatientManagement from "../component/Admin/PatientManagementComponent/PatientManagement";
import LaboManagement from "../component/Admin/LaboComponent/LaboManagement";

import TimekeepingManagement from "../component/Admin/TimekeepingManagementComponet/TimekeepingManagement";

import MaterialManagement from "../component/Admin/MaterialManagementComponent/MaterialManagement";
import MaterialImportManagement from "../component/Admin/MaterialManagementComponent/MaterialImportManagement";
import MaterialExportManagement from "../component/Admin/MaterialManagementComponent/MaterialExportManagement";
import ServiceAndCategoryManagement from "../component/Admin/ServiceAndCategoryManagementComponent/ServiceAndCategoryManagement";
import IncomeManagement from "../component/Admin/IncomeManagementComponent/IncomeManagement";
import RecordManagement from "../component/Admin/RecordComponent/RecordManagement";
import BillManagement from "../component/Admin/BillManagementComponent/BillManagement";
import ProfileManagement from "../component/Admin/ProfileManagementComponent/ProfileManagement";
import SpecimenManagement from "../component/Admin/SpecimenManagementComponent/SpecimenManagement";
import ScheduleManagement from "../component/Admin/ScheduleManagementComponent/ScheduleManagement";
import DefaultLayout from "../component/Layout/default";
import ChangePassword from "../component/ChangePassword";

const Routing = () => {
  return (
    // <Dashboard title="Dashboard" component={  } />
    <Router>
      <Routes>
        <Route path="login" element={<LoginComponent />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="/" element={<DefaultLayout />}>
          <Route index element={<HomePage />} />
          <Route path="change-password" element={<ChangePassword />} />
          <Route path="accmanagement" element={<AccountManagement />} />
          <Route path="labo" element={<LaboManagement />} />
          <Route path="waitting-room/:tab" element={<WaitingRoomManagement />} />
          <Route path="patient-management">
            <Route index  element={<PatientManagement />} />
            <Route path="profile/:id" element={<RecordManagement />} />
          </Route>
          <Route path="timekeeping" element={<TimekeepingManagement />} />
          <Route path="materialmanagement" element={<MaterialManagement />} />
          <Route path="materialimport" element={<MaterialImportManagement />} />
          <Route path="materialexport" element={<MaterialExportManagement />} />
          <Route
            path="serviceandcategory"
            element={<ServiceAndCategoryManagement />}
          />
          <Route path='/serviceandcategory' element={<ServiceAndCategoryManagement />} />
          <Route path="income" element={<IncomeManagement />} />
          <Route path="bill" element={<BillManagement />} />
          <Route path="profile" element={<ProfileManagement />} />
          <Route path="specimen" element={<SpecimenManagement />} />
          <Route path="schedule" element={<ScheduleManagement />} />
        </Route>
          <Route path="*" element={<>404 Error</>} />
      </Routes>
    </Router>
  );
};

export default Routing;
