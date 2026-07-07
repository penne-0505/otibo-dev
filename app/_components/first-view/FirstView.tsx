import styles from "./first-view.module.css";
import { LightShader } from "./LightShader.client";

export function FirstView() {
  return (
    <section aria-label="otibo" className={styles.firstView}>
      <div aria-hidden="true" className={styles.fallback} />
      <LightShader />
      <h1 className={styles.wordmark}>otibo</h1>
    </section>
  );
}
