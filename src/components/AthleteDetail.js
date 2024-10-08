import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const AthleteDetail = ({ athleteData, resultsData }) => {
  const { athletename } = useParams();

  // Extract the full name from the URL parameter
  const fullName = decodeURIComponent(athletename).replace(/_/g, ' ');

  // State for filters
  const [search, setSearch] = useState('');
  const [selectedYear, setSelectedYear] = useState('All Years');
  const [selectedRaceType, setSelectedRaceType] = useState('All Race Types');

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

  // Calculate the athlete's age on the last day of the current year
  const calculateAge = (birthday) => {
    const birthDateObj = new Date(birthday);
    const endOfYear = new Date(new Date().getFullYear(), 11, 31); // December 31st of the current year
    let age = endOfYear.getFullYear() - birthDateObj.getFullYear();

    // Adjust if the birth date hasn't occurred yet this year
    if (endOfYear < new Date(endOfYear.getFullYear(), birthDateObj.getMonth(), birthDateObj.getDate())) {
      age--;
    }

    return age;
  };

  const athleteAge = calculateAge(athlete.birthday); // Use 'birthday' field from the CSV

  // Handle filter changes
  const handleSearchChange = (e) => setSearch(e.target.value);
  const handleYearChange = (e) => setSelectedYear(e.target.value);
  const handleRaceTypeChange = (e) => setSelectedRaceType(e.target.value);

  // Extract unique years and distances
  const uniqueYears = Array.from(new Set(athleteResults.map(result => result.Date.split('/')[2])));
  const uniqueDistances = Array.from(new Set(athleteResults.map(result => result.Distance)));

  // Filter athlete results based on search and dropdown selections
  const filteredResults = athleteResults.filter((result) => {
    const matchesSearch = result.Race.toLowerCase().includes(search.toLowerCase());
    const resultYear = result.Date.split('/')[2]; // Extract year from date
    const matchesYear = selectedYear === 'All Years' || resultYear === selectedYear;
    const matchesRaceType = selectedRaceType === 'All Race Types' || result.Distance === selectedRaceType;

    return matchesSearch && matchesYear && matchesRaceType;
  });

  return (
    <div>
      <div className='RacerInfo' style={{ padding: '10px' }}>
        <h1>{`${athlete.first_name} ${athlete.last_name}`}</h1>
        <h2>Racer Info:</h2>
        <p>Hometown: {athlete.city}, {athlete.state}</p>
        <p>Age: {athleteAge}</p>
        <p>Gender: {athlete.gender}</p>
      </div>

      {/* Filter Inputs */}
      <div className='filters' style={{ padding: '10px', display: 'flex', gap: '10px' }}>
        <input
          type='text'
          placeholder='Search'
          value={search}
          onChange={handleSearchChange}
          style={{ padding: '5px' }}
        />
        <select value={selectedYear} onChange={handleYearChange} style={{ padding: '5px' }}>
          <option value='All Years'>All Years</option>
          {uniqueYears.map((year, index) => (
            <option key={index} value={year}>{year}</option>
          ))}
        </select>
        <select value={selectedRaceType} onChange={handleRaceTypeChange} style={{ padding: '5px' }}>
          <option value='All Race Types'>All Race Types</option>
          {uniqueDistances.map((distance, index) => (
            <option key={index} value={distance}>{distance}</option>
          ))}
        </select>
      </div>

      {/* Display athlete's results in a table */}
      <div className='RacerResults' style={{ padding: '10px' }}>
        <h2>Race Results</h2>
        {filteredResults.length > 0 ? (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
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
              {filteredResults.map((result, index) => (
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
    </div>
  );
};

export default AthleteDetail;
