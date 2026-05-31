import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { Landing } from '../pages/Landing';
import { Login } from '../pages/Login';
import { Register } from '../pages/Register';
import { PatientDashboard } from '../pages/PatientDashboard';
import { PatientSearch } from '../pages/PatientSearch';
import { PsychologistDetail } from '../pages/PsychologistDetail';
import { PatientAppointments } from '../pages/PatientAppointments';
import { PsychologistDashboard } from '../pages/PsychologistDashboard';
import { PsychologistAvailability } from '../pages/PsychologistAvailability';
import { PsychologistRequests } from '../pages/PsychologistRequests';
import { PsychologistSchedule } from '../pages/PsychologistSchedule';
import { PsychologistMessages } from '../pages/PsychologistMessages';
import { PsychologistRecord } from '../pages/PsychologistRecord';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        element={
          <ProtectedRoute role="patient">
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/patient/dashboard" element={<PatientDashboard />} />
        <Route path="/patient/search" element={<PatientSearch />} />
        <Route
          path="/patient/psychologist/:id"
          element={<PsychologistDetail />}
        />
        <Route path="/patient/appointments" element={<PatientAppointments />} />
      </Route>

      <Route
        element={
          <ProtectedRoute role="psychologist">
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/psychologist/dashboard" element={<PsychologistDashboard />} />
        <Route
          path="/psychologist/availability"
          element={<PsychologistAvailability />}
        />
        <Route path="/psychologist/requests" element={<PsychologistRequests />} />
        <Route path="/psychologist/schedule" element={<PsychologistSchedule />} />
        <Route path="/psychologist/messages" element={<PsychologistMessages />} />
        <Route path="/psychologist/record" element={<PsychologistRecord />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
