import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import Topbar from "../components/topbar-components";

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Cross-Chain Token Swap</title>
        <link href="/favicon.ico" rel="icon" />
      </Head>

      <Topbar/>
    </div>
  );
};

export default Home;
