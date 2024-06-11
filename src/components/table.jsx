import React, { useEffect, useState } from 'react';

const Table = () => {
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/latestassignments');
        const data = await response.json();
        setAssignments(data);
      } catch (error) {
        console.error('Error fetching project assignments:', error);
      }
    };

    fetchData();

    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th style={tableHeaderStyle}>Employee ID</th>
          <th style={tableHeaderStyle}>Employee Name</th>
          <th style={tableHeaderStyle}>Project Name</th>
          <th style={tableHeaderStyle}>Start Date</th>
        </tr>
      </thead>
      <tbody>
        {assignments.length > 0 ? (
          assignments.map(assignment => (
            <tr key={assignment._id}>
              <td style={tableCellStyle}>{assignment.employee_id}</td>
              <td style={tableCellStyle}>{assignment.full_name}</td>
              <td style={tableCellStyle}>{assignment.project_name}</td>
              <td style={tableCellStyle}>{new Date(assignment.start_date).toLocaleDateString()}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="4" style={tableCellStyle}>No data available</td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

const tableHeaderStyle = {
    backgroundColor: '#f2f2f2',
    padding: '8px',
    textAlign: 'center',
    fontWeight: 'bold',
  };
  
  const tableCellStyle = {
    padding: '8px',
    textAlign: 'center',
  };

export default Table;
