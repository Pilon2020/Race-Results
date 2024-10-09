import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Analysis = () => {
    const [nameCounts, setNameCounts] = useState({});
    const [uniqueRaces, setUniqueRaces] = useState([]);
    const [raceRacerCounts, setRaceRacerCounts] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [startDate, setStartDate] = useState(() => {
        const today = new Date();
        today.setFullYear(today.getFullYear() - 1);
        return today;
    });
    const [endDate, setEndDate] = useState(new Date());

    useEffect(() => {
        const fetchAndParseCSV = async () => {
            try {
                const response = await fetch('/data/results.csv');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const csvText = await response.text();

                Papa.parse(csvText, {
                    header: true,
                    dynamicTyping: true,
                    skipEmptyLines: true,
                    complete: (results) => {
                        const data = results.data;
                        const nameFrequency = {};
                        const raceSet = new Set();
                        const raceCounts = {};

                        data.forEach((row) => {
                            const name = row.Name?.trim();
                            const race = row.Race?.trim();
                            const date = new Date(row.Date);

                            if ((!startDate || date >= startDate) && (!endDate || date <= endDate)) {
                                if (name) {
                                    nameFrequency[name] = (nameFrequency[name] || 0) + 1;
                                }
                                if (race) {
                                    raceSet.add(race);
                                    raceCounts[race] = (raceCounts[race] || 0) + 1;
                                }
                            }
                        });

                        setNameCounts(nameFrequency);
                        setUniqueRaces(Array.from(raceSet));
                        setRaceRacerCounts(raceCounts);
                        setLoading(false);
                    },
                    error: (err) => {
                        console.error('Error parsing CSV:', err);
                        setError(err);
                        setLoading(false);
                    },
                });
            } catch (err) {
                console.error('Error fetching CSV:', err);
                setError(err);
                setLoading(false);
            }
        };

        fetchAndParseCSV();
    }, [startDate, endDate]);

    if (loading) {
        return <div>Loading unique racer names and races...</div>;
    }

    if (error) {
        return <div>Error loading racer names and races: {error.message}</div>;
    }

    // Calculate totals and averages based on the filtered data
    const filteredRacers = Object.keys(nameCounts);
    const totalRacers = filteredRacers.length;
    const totalRaces = filteredRacers.reduce((sum, name) => sum + nameCounts[name], 0);
    const averageRaces = totalRacers > 0 ? (totalRaces / totalRacers).toFixed(2) : 0;

    // Count number of racers per race participation count
    const participationCounts = {};
    Object.values(nameCounts).forEach(count => {
        participationCounts[count] = (participationCounts[count] || 0) + 1;
    });

    // Convert participationCounts to an array and sort from largest to smallest
    const sortedParticipationCounts = Object.entries(participationCounts)
        .sort(([, countA], [, countB]) => countB - countA);

    return (
        <div className="racer-list">
            <h1>Racer Names and Counts</h1>
            <div className="content-wrapper">
                <div className="table-column">
                    {totalRacers === 0 ? (
                        <p>No racers found.</p>
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th>Racer Name</th>
                                    <th>Race Count</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(nameCounts)
                                    .sort(([nameA], [nameB]) => nameA.localeCompare(nameB))
                                    .map(([name, count], index) => (
                                        <tr key={index}>
                                            <td>{name}</td>
                                            <td>{count}</td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    )}
                </div>

                <div className="info-column">
                    <h2>Number of Races</h2>
                    <div className="date-filter" style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', marginRight: '20px' }}>
                            Start Date:
                            <DatePicker
                                selected={startDate}
                                onChange={(date) => setStartDate(date)}
                                dateFormat="MM/dd/yyyy"
                                placeholderText="Select start date"
                                className="narrow-datepicker"
                            />
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center' }}>
                            End Date:
                            <DatePicker
                                selected={endDate}
                                onChange={(date) => setEndDate(date)}
                                dateFormat="MM/dd/yyyy"
                                placeholderText="Select end date"
                                className="narrow-datepicker"
                            />
                        </label>
                    </div>
                    <h2>Unique Races and Participant Counts</h2>
                    {uniqueRaces.length === 0 ? (
                        <p>No races found within the selected date range.</p>
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th>Race Name</th>
                                    <th>Racer Count</th>
                                </tr>
                            </thead>
                            <tbody>
                                {uniqueRaces.map((race, index) => (
                                    <tr key={index}>
                                        <td>{race}</td>
                                        <td>{raceRacerCounts[race]}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                    <h2>Numeric Analysis</h2>
                    <p>Total Unique Racers: {totalRacers}</p>
                    <p>Average Races per Racer: {averageRaces}</p>
                </div>

                <div className="info-column">
                    <h2>Race Participation Counts</h2>
                    {sortedParticipationCounts.length === 0 ? (
                        <p>No participation counts available.</p>
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th>Number of Races</th>
                                    <th>Racer Count</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedParticipationCounts.map(([raceCount, racerCount], index) => (
                                    <tr key={index}>
                                        <td>{raceCount}</td>
                                        <td>{racerCount}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Analysis;
