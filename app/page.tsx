import styles from "./page.module.css";
import Counter from "./components/Counter";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Counter />
      </main>
    </div>
  );
}
