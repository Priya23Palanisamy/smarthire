import React from "react";

const JobApplicants = ({ applicant }) => {

  if (!applicant) {
    return <p>No applicant selected</p>;
  }

  return (
    <div className="card p-4 shadow">
      <h3>{applicant.fullName}</h3>

      <p><strong>Email:</strong> {applicant.email}</p>

      <p><strong>Skills:</strong> {applicant.skills}</p>

      <p><strong>Education:</strong> {applicant.education}</p>

      <p><strong>Experience:</strong> {applicant.experience}</p>

      <p><strong>Certifications:</strong> {applicant.certifications}</p>

      <p>
        <strong>Resume:</strong>
        {" "}
        {applicant.resumeFileName}
      </p>
    </div>
  );
};

export default JobApplicants;