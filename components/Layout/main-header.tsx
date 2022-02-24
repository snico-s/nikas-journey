import Link from "next/dist/client/link";
import classes from "./main-header.module.css";

function MainHeader() {
  return (
    <header className={classes.header}>
      <div className={classes.logo}>
        <Link href="/">Nikas Journey</Link>
      </div>
      <nav className={classes.navigation}>
        <Link href="/ueber-uns">Über uns</Link>
      </nav>
    </header>
  );
}

export default MainHeader;
