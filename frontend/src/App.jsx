import Home from './pages/Home'
import Curriculum from './pages/Curriculum'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import Practice from './pages/Practice'
import Pricing from './pages/Pricing'
import Signup from './pages/Signup'
import User from './pages/admin/Users'
import Dashboard from './pages/app/Dashboard'
import AdminDashboard from './pages/admin/Dashboard'
import {  Route, Routes } from 'react-router-dom'
import AppLayout from './layout/AppLayout/AppLayout';
import AdminLayout from './layout/AdminLayout/AdminLayout';
import Assignments from './pages/app/Assignments'
import AdminAssignments from './pages/admin/Assignments';
import EditAssignment from './pages/admin/EditAssignment';
import Attempts from './pages/app/Attempts';
import CreateAssignment from './pages/admin/CreateAssignment'
import AssignmentPage from './pages/app/AssignmentPage'
import Profile from './pages/app/Profile'
import AdminProfile from './pages/admin/Profile'

function App() {
  return (
    <div>
      
        <Routes>
         <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* User dashboard area */}
      <Route path="/app" element={<AppLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="assignments" element={<Assignments />} />
        <Route path="assignment/:id" element={<AssignmentPage />} />
        <Route path="attempts" element={<Attempts />} />
        <Route path="profile" element={<Profile />} />
      </Route>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<User />} />
        <Route path="assignments" element={<AdminAssignments />} />
        <Route path="assignments/create" element={<CreateAssignment />} />
        <Route path="assignments/edit/:id" element={<EditAssignment/>} />
        <Route path="profile" element={<AdminProfile />} />
      </Route>  

      <Route path="*" element={<div style={{ padding: 16 }}>Not found</div>} />
        </Routes>
      
    </div>
  )
}

export default App
