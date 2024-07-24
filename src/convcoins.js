import React, { useState, useEffect } from 'react';
import './App.css';

function ConvCoins() {
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState('BRL');
  const [toCurrency, setToCurrency] = useState('USD');
  const [exchangeRate, setExchangeRate] = useState(1);
  const [currencies, setCurrencies] = useState([]);
  const [error, setError] = useState('');
  const [result, setResult] = useState('');

  useEffect(() => {
    fetch('https://economia.awesomeapi.com.br/json/available')
      .then(response => response.json())
      .then(data => {
        console.log(data); // Verifique a resposta da API
        const availableCurrencies = Object.keys(data).map(key => key.split('-')[0]).filter((value, index, self) => self.indexOf(value) === index);
        setCurrencies(availableCurrencies);
      })
      .catch(error => {
        setError('Erro ao obter moedas.');
        console.error('Erro ao obter moedas:', error);
      });
  }, []);

  const fetchExchangeRate = () => {
    if (fromCurrency !== toCurrency) {
      fetch(`https://economia.awesomeapi.com.br/json/last/${fromCurrency}-${toCurrency}`)
        .then(response => response.json())
        .then(data => {
          console.log(data); // Verifique a resposta da API
          const rate = data[`${fromCurrency}${toCurrency}`]?.bid;
          if (rate) {
            setExchangeRate(rate);
            setError('');
            const convertedValue = (parseFloat(amount) * parseFloat(rate)).toFixed(2);
            setResult(`${amount} ${fromCurrency} = ${convertedValue} ${toCurrency}`);
          } else {
            setError('Erro ao obter taxa de câmbio.');
            console.error('Erro ao obter taxa de câmbio:', data);
          }
        })
        .catch(error => {
          setError('Erro ao obter taxa de câmbio.');
          console.error('Erro ao obter taxa de câmbio:', error);
        });
    }
  };

  return (
    <div className="converter-container">
      <h1>Conversor de Moedas</h1>
      {error && <p className="error">{error}</p>}
      <div className="converter-inputs">
        <input 
          type="number" 
          value={amount} 
          onChange={(e) => setAmount(e.target.value)} 
          className="amount-input"
        />
        <div className="currency-selectors">
          <input 
            type="text" 
            list="from-currencies" 
            value={fromCurrency} 
            onChange={(e) => setFromCurrency(e.target.value)}
            className="currency-input"
          />
          <datalist id="from-currencies">
            {currencies.map((currency, idx) => (
              <option key={idx} value={currency}>{currency}</option>
            ))}
          </datalist>
          <span className="arrow">→</span>
          <input 
            type="text" 
            list="to-currencies" 
            value={toCurrency} 
            onChange={(e) => setToCurrency(e.target.value)}
            className="currency-input"
          />
          <datalist id="to-currencies">
            {currencies.map((currency, idx) => (
              <option key={idx} value={currency}>{currency}</option>
            ))}
          </datalist>
        </div>
      </div>
      <button onClick={fetchExchangeRate} className="convert-button">Converter</button>
      <h2 className="result">
        {result}
      </h2>
    </div>
  );
}

export default ConvCoins;
