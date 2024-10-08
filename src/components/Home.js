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

    /* Search Bar idea from: https://codepen.io/bugrakocak/pen/EMbKoB */
    <div className="container">
      <input
        id="search"
        placeholder="Search by Name or Event"
        onChange={(event) => setQuery(event.target.value)}
        value={query}
        className="SearchBar"
      />
      
      {/* Apply 'show' class only if there are results */}
      <ul className={`drop ${filteredAthletes.length || uniqueRaceEntries.length ? 'show' : ''}`}>
        {/* Display filtered athletes */}
        {debouncedQuery && filteredAthletes.length > 0 && (
          filteredAthletes.map((athlete, index) => (
            <li key={index}>
              <Link 
                to={`/Athlete/${athlete.first_name}_${athlete.last_name}`} 
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                {athlete.first_name} {athlete.last_name} - {athlete.city}, {athlete.state}
              </Link>
            </li>
          ))
        )}

        {/* Display unique race events */}
        {debouncedQuery && uniqueRaceEntries.length > 0 && (
          uniqueRaceEntries.map((result, index) => (
            <li key={index}>
              <Link 
                to={`/race/${result.Race.replace(/ /g, '_')}/${result.Date.replace(/\//g, '-')}`} 
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                {result.Race} - {result.Date}
              </Link>
            </li>
          ))
        )}
        
        {/* Show 'No results found' if there are no matches */}
        {debouncedQuery && filteredAthletes.length === 0 && uniqueRaceEntries.length === 0 && (
          <li>No results found</li>
        )}
      </ul>
    </div>
  );
};

export default Home;
