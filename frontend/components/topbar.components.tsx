import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import styles from "../styles/Topbar.module.css";
import Link from "next/link";
import SwapLogo from "../assets/logo.svg";


const Topbar = () => {
  return (
    <div className={styles.topbar}>
      <Link href="/">
        <SwapLogo className={styles.logo}/>
      </Link>
      <div className={styles.links}>
        <a href="/my-requests" className={styles.link}>
          My Requests
        </a>
        <a href="/my-participations" className={styles.link}>
          My Participations
        </a>
      </div>
      <div className={styles.connectbutton}>
        <ConnectButton />
      </div>
    </div>
  );
};

export default Topbar;
