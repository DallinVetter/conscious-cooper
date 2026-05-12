export default function Home() {
  const musicLinks = [
    { label: "Spotify", href: "https://open.spotify.com" },
    { label: "Apple Music", href: "https://music.apple.com" },
    { label: "YouTube", href: "https://www.youtube.com" },
    { label: "SoundCloud", href: "https://soundcloud.com" },
  ];

  return (
    <main className="site-shell">
      <section className="hero">
        <p className="eyebrow">Conscious Cooper</p>
        <h1>
          Thoughtful bars, clean energy, and a voice built for the long run.
        </h1>
        <p className="hero-copy">
          Conscious Cooper is a hip-hop persona focused on sharp writing,
          soulful production, and music that leaves something behind after the
          last note.
        </p>
        <div className="hero-actions">
          <a className="button button-solid" href="#music">
            Listen Now
          </a>
          <a className="button button-ghost" href="#contact">
            Book / Connect
          </a>
        </div>
      </section>

      <section className="content-grid">
        <article className="panel">
          <h2>About</h2>
          <p>
            Conscious Cooper blends introspection, rhythm, and a calm but
            deliberate presence. The sound aims to feel honest, polished, and
            memorable without overcomplicating the message.
          </p>
        </article>

        <article className="panel" id="music">
          <h2>Music Links</h2>
          <div className="link-list">
            {musicLinks.map((link) => (
              <a
                key={link.label}
                className="link-card"
                href={link.href}
                target="_blank"
                rel="noreferrer"
              >
                <span>{link.label}</span>
                <span aria-hidden="true">↗</span>
              </a>
            ))}
          </div>
        </article>

        <article className="panel">
          <h2>Latest Project</h2>
          <div className="project-card">
            <p className="project-label">Coming soon</p>
            <h3>The next Conscious Cooper release is in motion.</h3>
            <p>
              Add the release title, artwork, and drop date here when the first
              project is ready.
            </p>
          </div>
        </article>

        <article className="panel" id="contact">
          <h2>Contact / Social</h2>
          <p>
            For features, bookings, press, and collaborations, use one clean
            point of contact and keep the conversation moving.
          </p>
          <div className="social-list">
            <a href="mailto:hello@consciouscooper.com">hello@consciouscooper.com</a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer">
              Instagram
            </a>
            <a href="https://x.com" target="_blank" rel="noreferrer">
              X
            </a>
          </div>
        </article>
      </section>
    </main>
  );
}
