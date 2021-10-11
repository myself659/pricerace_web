import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import Web3 from 'web3-eth';

function App() {
  const [pricerace, setPricerace] = useState(0);
  const [accounts, setAccounts] = useState(0);
  const [loaded, setLoaded] = useState(0);
  const [raceChoice, setRaceChoice] = useState(0);
  const [raceDesc, setRaceDesc] = useState({});
  const [playerRace, setPlayRace] = useState({});

  useEffect(() => {
    if (typeof web3 !== 'undefined') {
      window.web3 = new Web3(window.web3.currentProvider);
      if (window.web3.currentProvider.isMetaMask === true) {
        connectMetaMask();
        connectToSelectedNetwork();
      } else {

      }
    } else {
      throw new Error("No web3 support, redirect user to a download page or something :) ");
    }
  }, []);

  useEffect(() => {
    if(loaded && (accounts !== 0)){
      console.log("account:",accounts);
      // getUserProfile();
      let options = {
        filter: {
            address: [accounts[0]]
        },
      };
      // pricerace.events.Bet(options)
      // .on('data', event => console.log("Data: " , event))
      // .on('changed', changed => console.log("Changed: ", changed))
      // .on('error', err => console.log("Err: ", err))
      // .on('connected', str => console.log("Conntected: ", str))

    } else{
      setTimeout(setLoaded(true),500);
    }
  },[loaded, accounts, pricerace]);


  function connectMetaMask() {
    // We need to make the connection to MetaMask work.
    // Send Request for accounts and to connect to metamask.
    window.web3.requestAccounts()
      .then((result) => {
        // Whenever the user accepts this will trigger
        console.log(result);
        setAccounts(result);
      })
      .catch((error) => {
        // Handle errors, such as when a user does not accept
        throw new Error(error);
      });
  };

  async function connectToSelectedNetwork() {
    const web3 = new Web3(Web3.givenProvider);
    const abi = await getABI();
    const address = getContractAddress();

    const pricerace = new web3.Contract(abi, address);
    console.log("pricerace:", pricerace);
    setPricerace(pricerace);
  }

  async function getABI() {
    let ABI = "";
    await fetch('./PriceRace.json', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then((response) => {
      if (response.status === 200) {
        return response.json();
      } else {
        throw new Error('Error fetch ABI');
      }
    }).then((data) => {
      ABI = data.abi;

    }).catch((error) => {
      throw new Error(error);
    });

    return ABI;
  }

  function getContractAddress() {
    return "0xFC8e1dE9d3aA258E047cEda710Ca374982dc172E";
  }

  function betup( choice) {
    let amount = 10*10**18;
    pricerace.methods.betUp().estimateGas({from: accounts[0]})
    .then((gas) => {
      pricerace.methods.betUp().send({
        value: amount.toString(),
        from: accounts[0],
        gas:gas
      })
    });
  }

  function betdown( choice) {
    let amount = 10*10**18;
    pricerace.methods.betDown().estimateGas({from: accounts[0]})
    .then((gas) => {
      pricerace.methods.betDown().send({
        value: amount.toString(),
        from: accounts[0],
        gas:gas
      })
    });

  }
  function liquidate(){
    pricerace.methods.Liquidate().estimateGas({from: accounts[0]})
    .then((gas) => {
      pricerace.methods.Liquidate().send({
        from: accounts[0],
        gas:gas
      })
    });
  }
  function getCurrentRaceDesc() {
    pricerace.methods.getCurrentRaceDesc().call()
    .then((result) => {
      console.log(result);
      setRaceDesc(result);
    })
    .catch( (error) => {
      throw new Error(error);
    });
  }

  return (
    <div className="App">
      <header className="App-header">
      <p> Welcome to pricerace, {accounts[0]}</p>

      <button onClick={betup}><p> bet 10 ONE for UP </p></button>

      <button onClick={betdown}><p> bet 10 ONE for Down </p></button>

      <button onClick={liquidate}><p> Liquidate  </p></button>
      </header>

      <p> pricerace is powered by harmony and chainlink</p>
    </div>
  );
}

export default App;
