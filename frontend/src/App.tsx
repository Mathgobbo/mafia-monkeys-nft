import { useEffect, useState } from "react";
import { ethers } from "ethers";
import mafiaMonkeysContract from "./utils/MafiaMonkeysNFT.json";
import "./styles/App.css";

// Constants
const GITHUB_LINK = `https://github.com/Mathgobbo`;
const OPENSEA_LINK = "";
const TOTAL_MINT_COUNT = 50;
const CONTRACT_ADDRESS = "0x70d962d4706Dca2e391e0c573f2D5F68183d04bc";
const openSeaCollectionLink = `https://testnets.opensea.io/collection/mafia-monkeys-nft-v3`;

const App = () => {
  const [loading, setLoading] = useState(false);
  const [currentAccount, setCurrentAccount] = useState("");

  const askContractToMintNft = async () => {
    try {
      const { ethereum } = window as any;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, mafiaMonkeysContract.abi, signer);

        console.log("Going to pop wallet now to pay gas...");
        console.log(await connectedContract.contractBalance());
        const mintPrice = await connectedContract.getMintPrice();
        let nftTxn = await connectedContract.makeAnEpicNFT({ value: mintPrice + 1 });

        console.log("Mining...please wait.");
        setLoading(true);
        await nftTxn.wait();

        console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window as any;
    if (!ethereum) {
      console.log("Make sure you have metamask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }

    const accounts = await ethereum.request({ method: "eth_accounts" });
    /*
     * User can have multiple authorized accounts, we grab the first one if its there!
     */
    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account);
      setupEventListener();
    } else {
      console.log("No authorized account found");
    }
  };

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
      setupEventListener();
    } catch (error) {
      console.log(error);
    }
  };

  // Setup our listener.
  const setupEventListener = async () => {
    // Most of this looks the same as our function askContractToMintNft
    try {
      const { ethereum } = window as any;

      if (ethereum) {
        // Same stuff again
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, mafiaMonkeysContract.abi, signer);

        // THIS IS THE MAGIC SAUCE.
        // This will essentially "capture" our event when our contract throws it.
        // If you're familiar with webhooks, it's very similar to that!

        let chainId = await ethereum.request({ method: "eth_chainId" });
        console.log("Connected to chain " + chainId);

        // String, hex code of the chainId of the Rinkebey test network
        const rinkebyChainId = "0x4";
        if (chainId !== rinkebyChainId) {
          alert("You are not connected to the Rinkeby Test Network!");
          return;
        }

        connectedContract.on("NewMafiaMonkeysNFTMinted", (from, tokenId) => {
          console.log(from, tokenId.toNumber());
          alert(
            `Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`
          );
        });

        console.log("Setup event listener!");
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  /*
   * This runs our function when the page loads.
   */
  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">Mafia Monkeys NFT</p>
          <p className="sub-text">
            Take care dealing with these Monkeys. They're tough and won't give up LOL.
            <br /> Don't waste time and mint your own NFT!
          </p>
          {currentAccount === "" ? (
            <button onClick={connectWallet} className="cta-button connect-wallet-button">
              Connect to Wallet
            </button>
          ) : (
            <button onClick={askContractToMintNft} className="cta-button connect-wallet-button">
              {loading ? "Loading..." : "Mint NFT"}
            </button>
          )}
        </div>
        <div className="footer-container">
          <a className="footer-text" href={openSeaCollectionLink} target="_blank" rel="noreferrer">
            🌊 View Collection on OpenSea
          </a>
          <a className="footer-text" href={GITHUB_LINK} target="_blank" rel="noreferrer">{`built by @Mathgobbo`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
