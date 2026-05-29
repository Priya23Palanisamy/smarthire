import { Link, useNavigate } from "react-router-dom";

const RecruiterNavbar = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-dark bg-dark px-3">
      <Link className="navbar-brand" to="/recruiter/dashboard">
        SmartHire Recruiter
      </Link>

      <div className="d-flex gap-3">
        <Link to="/recruiter/dashboard" className="text-white">Dashboard</Link>
        <Link to="/recruiter/profile" className="text-white">Profile</Link>
        <Link to="/recruiter/post-job" className="text-white">Post Job</Link>
        <Link to="/recruiter/jobs" className="text-white">Jobs</Link>
        <Link to="/recruiter/applications" className="text-white">Applications</Link>

        <button className="btn btn-danger btn-sm" onClick={logout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default RecruiterNavbar;