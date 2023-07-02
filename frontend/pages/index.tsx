import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import Topbar from "../components/topbar.components";
import Requests from "../components/requests.components";
import Button from "@mui/material/Button";
import { useState } from "react";
import { createSwapRequest, generateHash } from "../utils/apiService";

const Home: NextPage = () => {
  const [inputtedSecret, setInputtedSecret] = useState("");
  const [generatedHash, setGeneratedHash] = useState("");
  const handleCreateSwapRequest = async () => {
    try {
      const response = await createSwapRequest(
        "hash_value",
        100,
        "token_value",
        "user_address"
      );
      console.log("Swap request created:", response);
      // Handle success or update state
    } catch (error) {
      console.error("Error creating swap request:", error);
      // Handle error or show error message
    }
  };

  const handleGenerateHash = async () => {
    try {
      const hash = await generateHash(inputtedSecret);
      setGeneratedHash(hash);
      console.log("Generated hash: ", hash);
    } catch (error) {
      console.error("Error generating hash", error);
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Cross-Chain Token Swap</title>
        <link href="/favicon.ico" rel="icon" />
      </Head>
      <Topbar />
      <div className={styles.requestHeader}>
        <div>
          <span>
            <input
              type="text"
              id="secret"
              value={inputtedSecret}
              onChange={(e) => setInputtedSecret(e.target.value)}
            />
            <Button variant="contained" onClick={handleGenerateHash}>
              Generate Hash
            </Button>
          </span>
          <label>{generatedHash}</label>
        </div>
        <Button
          variant="contained"
          className={styles.requestButton}
          onClick={handleCreateSwapRequest}
        >
          Create Request
        </Button>
      </div>
      <div className={styles.requestList}>
        <Requests />
      </div>
    </div>
  );
};

export default Home;
