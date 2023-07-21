import React, { useState, useEffect } from 'react';
import Web3 from 'web3';

const Interface = () => {
  const [cakeDeposit, setCakeDeposit] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [contractInstance, setContractInstance] = useState(null);

  useEffect(() => {
    connectWallet();
  }, []);

  const connectWallet = async () => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        await window.ethereum.enable();
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);

        const contractAddress = 'YOUR_CONTRACT_ADDRESS'; // Replace with your smart contract address
        const contractABI = []; // Replace with your smart contract ABI

        const contract = new web3Instance.eth.Contract(contractABI, contractAddress);
        setContractInstance(contract);

        console.log('Connected to wallet:', web3Instance.currentProvider);
      } else {
        console.log('Please install MetaMask or another wallet to use this DApp.');
      }
    } catch (error) {
      console.error('An error occurred while connecting to the wallet:', error);
    }
  };

  const handleDepositChange = (event) => {
    setCakeDeposit(event.target.value);
  };

  const handlePlaceBet = async () => {
    if (!web3) {
      console.log('Please connect your wallet.');
      return;
    }

    if (cakeDeposit < 1) {
      console.log('Minimum deposit requirement not met.');
      return;
    }

    try {
      const amountInWei = web3.utils.toWei(cakeDeposit.toString(), 'ether');
      const depositAmount = web3.utils.toBN(amountInWei);

      const accounts = await web3.eth.getAccounts();
      const sender = accounts[0];

      const gasPrice = await web3.eth.getGasPrice();
      const gasEstimate = await contractInstance.methods.placeBet(depositAmount).estimateGas({ from: sender, value: depositAmount });

      await contractInstance.methods.placeBet(depositAmount).send({ from: sender, value: depositAmount, gas: gasEstimate, gasPrice });

      console.log(`Successfully placed bet with ${cakeDeposit} CAKE tokens.`);
    } catch (error) {
      console.error('An error occurred during the bet placement:', error);
    }
  };

  const handleItemClick = (itemNumber) => {
    setSelectedItem(itemNumber);
  };

  return (
    <div>
      <div className="container">
        <div className={`item ${selectedItem === 1 ? 'selected' : ''}`} onClick={() => handleItemClick(1)}>
          <img src="C:\Users\daddy\OneDrive\Documents\WORK\MerchAntz\GiAntz\images\MetalTableMW.jpg" alt="Item 1" />
          <p>Item 1</p>
          <span className="highlight-message">{selectedItem === 1 ? 'BET ON THIS ITEM' : ''}</span>
        </div>

        <div className={`item ${selectedItem === 2 ? 'selected' : ''}`} onClick={() => handleItemClick(2)}>
          <img src="C:\Users\daddy\OneDrive\Documents\WORK\MerchAntz\GiAntz\images\SolidWoodTableMW.jpg" alt="Item 2" />
          <p>Item 2</p>
          <span className="highlight-message">{selectedItem === 2 ? 'BET ON THIS ITEM' : ''}</span>
        </div>
      </div>

      <div className="number-selector">
        <label htmlFor="cakeDeposit">Number of CAKE deposits (up to 1000):</label>
        <input type="number" id="cakeDeposit" min="1" max="1000" step="1" value={cakeDeposit} onChange={handleDepositChange} />
        <button onClick={handlePlaceBet}>Place Bet</button>
      </div>

      <div className="box">
        <p>Bet placements with CAKE</p>
        <div id="betPlacements"></div>
      </div>

      <div className="fee">
        <p>Note: A 3% fee will be taken from your deposit.</p>
      </div>

      <div className="risk-disclaimer">
        <p>You are depositing tokens to a smart contract. Use this bet platform at your own risk. DYOR!</p>
      </div>

      <div className="share-links">
        <a href="https://twitter.com/intent/tweet?url=https%3A%2F%2Fexample.com%2Fbet&amp;text=I%20just%20placed%20a%20bet%20at%20GiAntz%20DApp!%20Join%20me%20and%20try%20your%20luck%20too!%20%23GiAntz" target="_blank">Share on Twitter</a>
        <a href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fexample.com%2Fbet" target="_blank">Share on Facebook</a>
      </div>
    </div>
  );
};

export default Interface;
