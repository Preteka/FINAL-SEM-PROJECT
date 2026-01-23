import React from 'react';

const MockChart = ({ title, type }) => {
    return (
        <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            border: '1px solid #dddddd',
            marginBottom: '1.5rem',
            flex: 1,
            minWidth: '300px'
        }}>
            <h3 style={{ marginBottom: '1rem', fontSize: '1rem', color: '#666666' }}>{title}</h3>
            <div style={{
                height: '200px',
                backgroundColor: '#f9f9f9',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px dashed #cccccc',
                color: '#999999'
            }}>
                {type} Chart Placeholder
            </div>
        </div>
    );
};

export default MockChart;
