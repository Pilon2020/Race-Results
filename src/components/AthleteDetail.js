import React from 'react';
import { useParams, Link } from 'react-router-dom';

const AthleteDetail = ({ athleteData, resultsData }) => {
  const { athletename } = useParams();

  // Extract the full name from the URL parameter
  const fullName = decodeURIComponent(athletename).replace(/_/g, ' ');

  // Find the athlete data based on the name passed in the URL
  const athlete = athleteData.find((athlete) => {
    const athleteFullName = `${athlete.first_name} ${athlete.last_name}`.toLowerCase().trim();
    return athleteFullName === fullName.toLowerCase().trim();
  });

  if (!athlete) {
    return <div>Athlete not found.</div>;
  }

  // Filter results data based on the athlete's full name
  const athleteResults = resultsData.filter((result) => {
    const resultFullName = result.Name.toLowerCase().trim(); // Match with 'Name' from CSV
    return resultFullName === fullName.toLowerCase().trim();
  });

  return (
    <div>
      <h1>{`${athlete.first_name} ${athlete.last_name}`}</h1>
      <p>City: {athlete.city}</p>
      <p>State: {athlete.state}</p>
      <p>Age: {athlete.age}</p>
      <p>Gender: {athlete.gender}</p>

      {/* Display athlete's results in a table */}
      <h2>Race Results</h2>
      {athleteResults.length > 0 ? (
        <table style={{ width: '100%', borderCollapse: 'collapse'}}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Race</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Date</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Distance</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Swim Time</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>T1</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Bike Time</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>T2</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Run Time</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Total Time</th>
            </tr>
          </thead>
          <tbody>
            {athleteResults.map((result, index) => (
              <tr key={index}>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                <Link to={`/race/${result.Race.replace(/ /g, '_')}/${result.Date.replace(/\//g, '-')}`}>
                    {result.Race}
                  </Link>
                </td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{result.Date}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{result.Distance}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{result.Swim || 'N/A'}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{result.T1 || 'N/A'}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{result.Bike || 'N/A'}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{result.T2 || 'N/A'}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{result.Run || 'N/A'}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{result.Total || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No race results found for this athlete.</p>
      )}
    </div>
  );
};

export default AthleteDetail;
