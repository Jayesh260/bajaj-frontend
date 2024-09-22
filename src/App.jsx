import React, { useState } from 'react';
import axios from 'axios';
import Select from 'react-select'; 
import './App.css'; 
const options = [
  { value: 'Numbers', label: 'Numbers' },
  { value: 'Alphabets', label: 'Alphabets' },
  { value: 'Highest Alphabet', label: 'Highest Alphabet' },
];
const App = () => {
  const [inputData, setInputData] = useState('');
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState('');
  const [selectedOptions, setSelectedOptions] = useState([]);
  const handleInputChange = (e) => {
    setInputData(e.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const parsedData = JSON.parse(inputData);
      if (!Array.isArray(parsedData.data)) {
        setError('Invalid JSON input. "data" should be an array.');
        return;
      }
      setError('');
      const response = await axios.post('https://rest-api-development.onrender.com/bfhl', { data: parsedData.data });
      setResponseData(response.data);
    } catch (err) {
      setError('Invalid JSON format.');
    }
  };

  // Handle multi-select dropdown change
  const handleOptionChange = (selected) => {
    const values = selected.map(option => option.value);
    setSelectedOptions(values);
  };

  // Render filtered response based on selected options
  const renderFilteredResponse = () => {
    if (!responseData) return null;

    let filteredResponse = {};

    if (selectedOptions.includes('Numbers')) {
      filteredResponse.numbers = responseData.numbers;
    }
    if (selectedOptions.includes('Alphabets')) {
      filteredResponse.alphabets = responseData.alphabets;
    }
    if (selectedOptions.includes('Highest Alphabet')) {
      filteredResponse.highest_alphabet = responseData.highest_alphabet;
    }

    return (
      <div className="filtered-response">
        <h3>Filtered Response</h3>
        {filteredResponse.numbers && <p>Numbers: {filteredResponse.numbers.join(', ')}</p>}
        {filteredResponse.alphabets && <p>Alphabets: {filteredResponse.alphabets.join(', ')}</p>}
        {filteredResponse.highest_alphabet && <p>Highest Alphabet: {filteredResponse.highest_alphabet}</p>}
      </div>
    );
  };

  return (
    <div className="container">
      {/* API Input Section */}
      <div className="label-container">
        <label htmlFor="jsonInput">API Input</label>
        <div className="box-container">
          <textarea
            id="jsonInput"
            placeholder='{"data": ["M", "1", "334", "4", "B"]}'
            value={inputData}
            onChange={handleInputChange}
            rows="3"
            className="input-box"
          ></textarea>
        </div>
      </div>

      {error && <p className="error-message">{error}</p>}

      <button type="submit" className="submit-button" onClick={handleSubmit}>Submit</button>

      {/* Multi Filter Section */}
      {responseData && (
        <div className="select-container">
          <label htmlFor="multiFilter">Multi Filter</label>
          <div className="multi-select-box">
            <Select
              id="multiFilter"
              isMulti
              options={options}
              className="multi-select"
              onChange={handleOptionChange}
            />
          </div>

          {renderFilteredResponse()}
        </div>
      )}
    </div>
  );
};

export default App;