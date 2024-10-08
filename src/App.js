import Papa from 'papaparse'; // Import PapaParse
import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import AthleteDetail from './components/AthleteDetail';


const App = () => {
  const [athleteData, setAthleteData] = useState([]);
  const [resultsData, setResultsData] = useState([]);

  useEffect(() => {
    // Load athlete data
    const loadAthleteData = async () => {
      const response = await fetch('/data/athletedata.csv');
      const text = await response.text();
      Papa.parse(text, {
        header: true,
        dynamicTyping: true,
        complete: (results) => setAthleteData(results.data),
        error: (error) => console.error("Error loading athlete data", error),
      });
    };

    // Load race results data
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

    loadAthleteData();
    loadResultsData();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home athleteData={athleteData} />} />
        <Route
          path="/athlete/:athletename"
          element={<AthleteDetail athleteData={athleteData} resultsData={resultsData} />}
        />
      </Routes>
    </Router>
  );
};

export default App;
