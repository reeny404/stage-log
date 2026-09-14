import Link from "next/link";

export default function NotFound() {
  return <main className="not-found"><span>404 · LOST SIGNAL</span><h1>This stage has gone dark.</h1><p>The show may have ended or the link has moved.</p><Link className="hero-button hero-button--primary" href="/">Return home</Link></main>;
}
