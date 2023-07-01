import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import Topbar from "../components/topbar.components";
import Requests from "../components/requests.components";
import Button from "@mui/material/Button";

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Cross-Chain Token Swap</title>
        <link href="/favicon.ico" rel="icon" />
      </Head>
      <Topbar />
      <div className={styles.requestHeader}>
        <Button variant="contained" className={styles.requestButton}>
          Create Request
        </Button>
      </div>
      <div className={styles.requestList}>
        <Requests/>
      </div>
    </div>
  );
};

export default Home;
