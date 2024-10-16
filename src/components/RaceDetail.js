import React from 'react';
import { useParams, Link } from 'react-router-dom';

const RaceDetail = ({ athleteData, resultsData }) => {
  const { racename, year } = useParams();

  // Find race results based on the parameters
  const raceResults = resultsData.filter(result => 
    result.Race.replace(/ /g, '_') === racename && result.Date.replace(/\//g, '-') === year
  );

  // If no race results found, you might want to handle that case here
  const raceDate = raceResults.length > 0 ? raceResults[0].Date : 'N/A'; // Get the date from the first result or set to 'N/A'

  return (
    <div>
      <h1>Race Detail for </h1>
      <h2>Date: {raceDate}</h2>

      {raceResults.length > 0 ? (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Athlete</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Swim Time</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>T1</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Bike Time</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>T2</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Run Time</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Total Time</th>
            </tr>
          </thead>
          <tbody>
            {raceResults.map((result, index) => {
               return (
                <tr key={index}>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  <Link to={`/race/${result.Race.replace(/ /g, '_')}/${result.Date.replace(/\//g, '-')}/${result.Name.replace(/ /g, '_')}`}>
                     {result.Name} </Link>
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{result.Swim || 'N/A'}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{result.T1 || 'N/A'}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{result.Bike || 'N/A'}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{result.T2 || 'N/A'}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{result.Run || 'N/A'}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{result.Total || 'N/A'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <p>No results found for this race.</p>
      )}
    </div>
  );
};

export default RaceDetail;
