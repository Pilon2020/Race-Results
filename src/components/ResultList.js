// src/ResultList.js
import React from 'react';

const ResultList = ({ results }) => {
    return (
        <div>
            {results.length === 0 ? (
                <p>No results found.</p>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th style={{ border: '1px solid black' }}>Name</th>
                            <th style={{ border: '1px solid black' }}>Gender</th>
                            <th style={{ border: '1px solid black' }}>Race</th>
                            <th style={{ border: '1px solid black' }}>Date</th>
                            <th style={{ border: '1px solid black' }}>Distance</th>
                            <th style={{ border: '1px solid black' }}>Swim</th>
                            <th style={{ border: '1px solid black' }}>T1</th>
                            <th style={{ border: '1px solid black' }}>Bike</th>
                            <th style={{ border: '1px solid black' }}>T2</th>
                            <th style={{ border: '1px solid black' }}>Run</th>
                            <th style={{ border: '1px solid black' }}>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.map((result, index) => (
                            <tr key={index}>
                                <td style={{ border: '1px solid black' }}>{result.Name}</td>
                                <td style={{ border: '1px solid black' }}>{result.Gender}</td>
                                <td style={{ border: '1px solid black' }}>{result.Race}</td>
                                <td style={{ border: '1px solid black' }}>{result.Date}</td>
                                <td style={{ border: '1px solid black' }}>{result.Distance}</td>
                                <td style={{ border: '1px solid black' }}>{result.Swim}</td>
                                <td style={{ border: '1px solid black' }}>{result.T1}</td>
                                <td style={{ border: '1px solid black' }}>{result.Bike}</td>
                                <td style={{ border: '1px solid black' }}>{result.T2}</td>
                                <td style={{ border: '1px solid black' }}>{result.Run}</td>
                                <td style={{ border: '1px solid black' }}>{result.Total}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ResultList;
