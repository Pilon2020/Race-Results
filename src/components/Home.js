import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Papa from "papaparse";

const Home = ({ athleteData }) => {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const [resultsData, setResultsData] = useState([]);

  // Load results data from results.csv
  useEffect(() => {
    const loadResultsData = async () => {
      const response = await fetch('/data/results.csv');
      const text = await response.text();
      Papa.parse(text, {
        header: true,
        dynamicTyping: true,
        complete: (results) => setResultsData(results.data),
        error: (error) => console.error("Error loading results data", error),
      });
    };

    loadResultsData();
  }, []);

  // Debounce input to reduce the frequency of filtering
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  // Filter athlete data based on query
  const filteredAthletes = athleteData.filter(
    (athlete) =>
      athlete.first_name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
      athlete.last_name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
      athlete.city.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
      athlete.state.toLowerCase().includes(debouncedQuery.toLowerCase())
  );

  // Filter results data based on event name in the query
  const filteredEvents = resultsData.filter(
    (result) => result.Race.toLowerCase().includes(debouncedQuery.toLowerCase())
  );

  // Create a Set to track unique events
  const uniqueEvents = new Set();

  // Create an array for unique race entries
  const uniqueRaceEntries = [];

  // Loop through the filtered events to extract unique events
  filteredEvents.forEach((result) => {
    const eventKey = `${result.Race}_${result.Date}`; // Combine race name and date as a unique key
    if (!uniqueEvents.has(eventKey)) {
      uniqueEvents.add(eventKey);
      uniqueRaceEntries.push(result);
    }
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div className="search-bar">
        <input
          placeholder="Search by Name or Event"
          onChange={(event) => setQuery(event.target.value)}
          className="SearchBar"
        />

        {/* Display filtered athletes */}
        {debouncedQuery && filteredAthletes.length > 0 ? (
          filteredAthletes.map((athlete, index) => (
            <Link 
              to={`/Athlete/${athlete.first_name}_${athlete.last_name}`} 
              key={index}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div>
                <p>{athlete.first_name} {athlete.last_name} - {athlete.city}, {athlete.state}</p>
              </div>
            </Link>
          ))
        ) : debouncedQuery ? (
          <p>No athlete results found</p>
        ) : (
          <p></p>
        )}

        {/* Display unique race events */}
        {debouncedQuery && uniqueRaceEntries.length > 0 ? (
          uniqueRaceEntries.map((result, index) => (
            <Link 
              to={`/race/${result.Race.replace(/ /g, '_')}/${result.Date.replace(/\//g, '-')}`} 
              key={index}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div>
                <p>{result.Race} - {result.Date}</p>
              </div>
            </Link>
          ))
        ) : debouncedQuery ? (
          <p>No event results found</p>
        ) : (
          <p></p>
        )}
      </div>
    </div>
  );
};

export default Home;
