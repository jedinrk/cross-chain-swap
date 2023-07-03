import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import Topbar from "../components/topbar.components";
import Requests from "../components/requests.components";
import Button from "@mui/material/Button";
import { useState } from "react";
import { createSwapRequest, generateHash } from "../utils/apiService";
import RequestDialog from "../components/request-dialog.component";
import Dialog from "@mui/material/Dialog";

const Home: NextPage = () => {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [inputtedSecret, setInputtedSecret] = useState("");
  const [generatedHash, setGeneratedHash] = useState("");

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
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
          onClick={handleOpenDialog}
        >
          Create Request
        </Button>
      </div>
      <div className={styles.requestList}>
        <Requests/>
      </div>
      <Dialog open={isDialogOpen}>
        <RequestDialog onClose={handleCloseDialog}/>
      </Dialog>
      
    </div>
  );
};

export default Home;
