import React, { useEffect, useState } from "react";

import twitterLogo from "./assets/twitter-logo.svg";
import "./App.css";

// Constants
const TWITTER_HANDLE = "_buildspace";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const TEST_GIFS = [
  "https://media.giphy.com/media/9zXWAIcr6jycE/giphy.gif",
  "https://media.giphy.com/media/l378BzHA5FwWFXVSg/giphy.gif",
  "https://media.giphy.com/media/wFbI8gwCfCxeo/giphy.gif",
  "https://media.giphy.com/media/DgLsbUL7SG3kI/giphy.gif",
  "https://media.giphy.com/media/3o7TKwBctlv08kY08M/giphy.gif",
  "https://media.giphy.com/media/MXLeMX1pZR6c0hBYuR/giphy.gif",
  "https://media.giphy.com/media/AqOioh3rTS0Z3pP6V2/giphy.gif",
  "https://media.giphy.com/media/gk3R16JhLP8RUka2nD/giphy.gif",
  "https://media.giphy.com/media/qPVzemjFi150Q/giphy.gif",
  "https://media.giphy.com/media/WOr2GEPlT5T54LlueS/giphy.gif",
];

const App = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [gifList, setGifList] = useState([]);

  const checkIfWalletConnected = async () => {
    try {
      const { solana } = window;
      if (solana) {
        if (solana.isPhantom) {
          console.log("Phantom wallet detected!");

          const response = await solana.connect({ onlyIfTrusted: true });
          console.log("Connected wallet:", response.publicKey.toString());

          setWalletAddress(response.publicKey.toString());
        }
      } else {
        alert("No Solana wallet detected - go get yoself a Phantom wallet!");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const connectWallet = async () => {
    const { solana } = window;

    if (solana) {
      const response = await solana.connect();
      console.log("Connected wallet:", response.publicKey.toString());
      setWalletAddress(response.publicKey.toString());
    }
  };

  const onInputChange = (event) => {
    const { value } = event.target;
    setInputValue(value);
  };

  const sendGif = async () => {
    if (inputValue.length > 0) {
      console.log("Gif link:", inputValue);
      setGifList([...gifList, inputValue]);
      setInputValue("");
    } else {
      console.log("Empty input. Try again.");
    }
  };

  const renderNotConnectedContainer = () => (
    <button
      className="cta-button connect-wallet-button"
      onClick={connectWallet}
    >
      Connect Wallet
    </button>
  );

  const renderConnectedContainer = () => (
    <div className="connected-container">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          sendGif();
        }}
      >
        <input
          type="text"
          placeholder="Enter gif link!"
          value={inputValue}
          onChange={onInputChange}
        />
        <button type="submit" className="cta-button submit-gif-button">
          Submit
        </button>
      </form>
      <div className="gif-grid">
        {gifList.map((gif) => (
          <div className="gif-item" key={gif}>
            <img src={gif} alt={gif} />
          </div>
        ))}
      </div>
    </div>
  );

  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletConnected();
    };

    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);

  useEffect(() => {
    if (walletAddress) {
      console.log("Fetching GIF list...");
      // TODO Call Solana program here.
      // Set state
      setGifList(TEST_GIFS);
    }
  }, [walletAddress]);

  return (
    <div className="App">
      <div className={walletAddress ? "authed-container" : "container"}>
        <div className="header-container">
          <p className="header">Rick and Morty GIFs</p>
          <p className="sub-text">✨ oooooweeeee ✨</p>
          {/* Render Connect Wallet btn here if no wallet connected */}
          {!walletAddress && renderNotConnectedContainer()}
          {/* Render GIFs if wallet connected */}
          {walletAddress && renderConnectedContainer()}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
