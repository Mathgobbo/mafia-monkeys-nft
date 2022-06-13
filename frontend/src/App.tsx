import { useEffect, useState } from 'react';
import { ethers } from "ethers";
import mafiaMonkeysContract from './utils/MafiaMonkeysNFT.json';
import './styles/App.css';

// Constants
const GITHUB_LINK = `https://github.com/Mathgobbo`;
const OPENSEA_LINK = '';
const TOTAL_MINT_COUNT = 50;

const App = () => {
  /*
  * Just a state variable we use to store our user's public wallet. Don't forget to import useState.
  */
  const [currentAccount, setCurrentAccount] = useState("");

  const askContractToMintNft = async () => {
    const CONTRACT_ADDRESS = "0x3D58DE77AE06a6c6B14Dd44437ddB6922C8e5790";
  
    try {
      const { ethereum } = window as any;
  
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, mafiaMonkeysContract.abi, signer);
  
        console.log("Going to pop wallet now to pay gas...")
        let nftTxn = await connectedContract.makeAnEpicNFT();
  
        console.log("Mining...please wait.")
        await nftTxn.wait();
        
        console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);
  
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window as any;
    if (!ethereum) {
      console.log("Make sure you have metamask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }

     const accounts = await ethereum.request({ method: 'eth_accounts' });
     /*
     * User can have multiple authorized accounts, we grab the first one if its there!
     */
     if (accounts.length !== 0) {
       const account = accounts[0];
       console.log("Found an authorized account:", account);
       setCurrentAccount(account);
     } else {
       console.log("No authorized account found");
     }
  }

   const connectWallet = async () => {
    try {
      const { ethereum } = window as any;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]); 
    } catch (error) {
      console.log(error);
    }
  }


    /*
  * This runs our function when the page loads.
  */
    useEffect(() => {
      checkIfWalletIsConnected();
    }, [])

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">Mafia Monkeys NFT</p>
          <p className="sub-text">
            Take care dealing with these Monkeys. They're tough and won't give up LOL.<br/> Don't waste time and mint your own NFT!
          </p>
          {currentAccount === "" ? (
           <button onClick={connectWallet} className="cta-button connect-wallet-button">
            Connect to Wallet
            </button>
          ) : (
            <button onClick={askContractToMintNft} className="cta-button connect-wallet-button">
              Mint NFT
            </button>
          )}
        </div>
        <div className="footer-container">
          <a
            className="footer-text"
            href={GITHUB_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built by @Mathgobbo`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;