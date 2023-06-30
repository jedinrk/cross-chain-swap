import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import styles from "../styles/Topbar.module.css";

const Topbar = () => {
  return (
    <div className={styles.topbar}>
      <div className={styles.logo}>SwapIT</div>
      <div className={styles.links}>
        <a href="#" className={styles.link}>
          Home
        </a>
        <a href="#" className={styles.link}>
          Requests
        </a>
      </div>
      <div className={styles.connectbutton}>
        <ConnectButton />
      </div>
    </div>
  );
};

export default Topbar;
