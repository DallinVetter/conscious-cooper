import Link from "next/link";
import styles from "./dashboard.module.css";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={styles.shell}>
      <header className={styles.topbar}>
        <div className={styles.brandBlock}>
          <p className={styles.eyebrow}>Internal admin</p>
          <div>
            <h1 className={styles.title}>Conscious Cooper Product Manager</h1>
            <p className={styles.subtitle}>
              Browse products, inspect a selection, and add new items for the
              brand site.
            </p>
          </div>
        </div>

        <Link className={styles.homeLink} href="/">
          View public site
        </Link>
      </header>

      <main className={styles.main}>{children}</main>
    </div>
  );
}
