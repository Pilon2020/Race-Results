import React from 'react';
import { useParams, Link } from 'react-router-dom';

const RaceAthleteDetail = ({ athleteData, resultsData }) => {
    const { racename, year, athletename } = useParams();

    // Replace underscores with spaces in the racename for comparison
    const formattedRaceName = racename.replace(/_/g, ' ');

    // Format the year to match mm/dd/yyyy
    const formattedDate = `${year.split('-')[0]}/${year.split('-')[1]}/${year.split('-')[2]}`;

    // Find the athlete based on the URL parameter
    const athlete = athleteData.find(athlete => 
        `${athlete.first_name}_${athlete.last_name}` === athletename
    );

    // If the athlete is not found, display a message
    if (!athlete) {
        console.log('Athlete:', athlete);
        console.log('Formatted Race Name:', formattedRaceName);
        console.log('Formatted Date:', formattedDate);
        return <h1>Athlete not found.</h1>;
    }

// Find the race results for this athlete based on race name and formatted date
    const athleteResults = resultsData.find(result => 
        `${athlete.first_name} ${athlete.last_name}` === result.Name && // Adjust for the property name in your CSV
        result.Race === formattedRaceName && // Check for the race name with spaces
        result.Date === formattedDate // Compare the formatted date
    );


    // If there are no results, display a message
    if (!athleteResults) {
        console.log('Athlete:', athlete);
        console.log('Formatted Race Name:', formattedRaceName);
        console.log('Formatted Date:', formattedDate);
        return <h1>No race results found for {athlete.first_name} {athlete.last_name} in {formattedRaceName} on {formattedDate}.</h1>;
    }

    return (
        <body>
        <h1>
            {athlete.first_name} {athlete.last_name} - <Link to={`/race/${athleteResults.Race.replace(/ /g, '_')}/${athleteResults.Date.replace(/\//g, '-')}`}>
                    {athleteResults.Race} {year.split('-')[2]}
                </Link>
        </h1>
        <h2><Link to={`/athlete/${athletename}`}>Athlete Profile</Link></h2>
        <div>
            <h2>Race Analysis</h2>
        </div>
        </body>
    );
};

export default RaceAthleteDetail;
