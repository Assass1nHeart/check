import React from 'react';
import styles from './Loader.less';

const Loader = () => {
  return (
    <div className={styles.preloader}>
      <div className={styles.loader}>
        <div className={styles.ytp_spinner}>
          <div className={styles.ytp_spinner_container}>
            <div className={styles.ytp_spinner_rotator}>
              <div className={styles.ytp_spinner_left}>
                <div className={styles.ytp_spinner_circle}></div>
              </div>
              <div className={styles.ytp_spinner_right}>
                <div className={styles.ytp_spinner_circle}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
