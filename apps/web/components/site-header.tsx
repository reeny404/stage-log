import Link from "next/link";
import { BookmarkIcon, HomeIcon, RadioIcon, SearchIcon } from "./icons";

export function SiteHeader() {
  return (
    <>
      <header className="site-header">
        <Link className="wordmark" href="/" aria-label="StageLog home">
          <span className="wordmark__mark">S</span>
          <span>STAGELOG</span>
        </Link>
        <nav className="desktop-nav" aria-label="Primary navigation">
          <Link href="/">Discover</Link>
          <Link href="/#live">Live</Link>
          <Link href="/saved">Saved</Link>
        </nav>
        <div className="header-actions">
          <Link className="header-search" href="/#discover" aria-label="Search shows">
            <SearchIcon />
          </Link>
          <button className="avatar" aria-label="Open profile">SH</button>
        </div>
      </header>
      <nav className="mobile-nav" aria-label="Mobile navigation">
        <Link href="/"><HomeIcon /><span>Discover</span></Link>
        <Link href="/#live"><RadioIcon /><span>Live</span></Link>
        <Link href="/saved"><BookmarkIcon /><span>Saved</span></Link>
      </nav>
    </>
  );
}
