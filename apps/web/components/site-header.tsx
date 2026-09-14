import Link from "next/link";
import { HomeIcon, RadioIcon, SearchIcon } from "./icons";

export function SiteHeader() {
  return (
    <>
      <header className="site-header">
        <Link className="wordmark" href="/" aria-label="StageLog events home">
          <span className="wordmark__mark">S</span>
          <span>STAGELOG</span>
        </Link>
        <nav className="desktop-nav" aria-label="Primary navigation">
          <Link href="/">Event</Link>
          <Link href="/event/global-stage-drop">Traffic lab</Link>
          <Link href="/#case-study">System</Link>
        </nav>
        <div className="header-actions">
          <Link className="header-search" href="/#case-study" aria-label="Open system overview">
            <SearchIcon />
          </Link>
          <span className="avatar" aria-label="Load testing lab">LAB</span>
        </div>
      </header>
      <nav className="mobile-nav" aria-label="Mobile navigation">
        <Link href="/"><HomeIcon /><span>Event</span></Link>
        <Link href="/event/global-stage-drop"><RadioIcon /><span>Traffic lab</span></Link>
        <Link href="/#case-study"><SearchIcon /><span>System</span></Link>
      </nav>
    </>
  );
}
