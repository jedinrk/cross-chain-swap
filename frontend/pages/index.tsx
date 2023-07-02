import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import Topbar from "../components/topbar.components";
import Requests from "../components/requests.components";
import Button from "@mui/material/Button";
import { createSwapRequest } from "../utils/apiService";

const Home: NextPage = () => {
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

  return (
    <div className={styles.container}>
      <Head>
        <title>Cross-Chain Token Swap</title>
        <link href="/favicon.ico" rel="icon" />
      </Head>
      <Topbar />
      <div className={styles.requestHeader}>
        <Button variant="contained" className={styles.requestButton} onClick={handleCreateSwapRequest}>
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
