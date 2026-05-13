import Link from "next/link";

export default function Home() {
  const navigationLinks = [
    { label: "Home", href: "#home" },
    { label: "Shop", href: "#shop" },
    { label: "Music", href: "#music" },
    { label: "Drops", href: "#drops" },
    { label: "Contact", href: "#contact" },
  ];

  const categoryCards = [
    {
      name: "Apparel",
      copy: "Streetweight layers and statement pieces for the Conscious Cooper world.",
    },
    {
      name: "Accessories",
      copy: "Everyday carry, tour-night essentials, and subtle identity markers.",
    },
    {
      name: "Music",
      copy: "Singles, instrumental cuts, and release bundles with deep replay value.",
    },
    {
      name: "Digital",
      copy: "Download packs, wallpapers, and members-only creative assets.",
    },
  ];

  const featuredProducts = [
    {
      title: "Night Run Capsule Tee",
      category: "Apparel",
      status: "Published",
      price: 42,
      description: "Heavy cotton fit built around the Night Run visual era.",
      externalUrl: "#contact",
    },
    {
      title: "Signal Chain Utility Pack",
      category: "Accessories",
      status: "Draft",
      price: 24,
      description: "Patch set and sticker sheet inspired by studio signal flow.",
      externalUrl: "#shop",
    },
    {
      title: "Night Run Digital Deluxe",
      category: "Music",
      status: "Coming Soon",
      price: 9,
      description: "Expanded release with alternate cuts and voice-note interludes.",
      externalUrl: "#contact",
    },
  ];

  const musicLinks = [
    { label: "Spotify", href: "https://open.spotify.com" },
    { label: "Apple Music", href: "https://music.apple.com" },
    { label: "YouTube", href: "https://www.youtube.com" },
    { label: "SoundCloud", href: "https://soundcloud.com" },
  ];

  return (
    <main className="site-shell storefront-shell" id="home">
      <header className="storefront-header panel">
        <Link href="/" className="brand-lockup">
          <span className="brand-mark" aria-hidden="true">
            CC
          </span>
          <span className="brand-text">
            <strong>Conscious Cooper</strong>
            <small>Artist Storefront</small>
          </span>
        </Link>

        <nav aria-label="Primary">
          <ul className="nav-list">
            {navigationLinks.map((item) => (
              <li key={item.label}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <Link className="button button-ghost" href="/dashboard">
          Dashboard
        </Link>
      </header>

      <section className="hero hero-storefront">
        <div className="hero-story">
          <p className="eyebrow">Conscious Cooper - Drop Season</p>
          <h1>Merch, music, and message-driven design from the Conscious world.</h1>
          <p className="hero-copy">
            Conscious Cooper blends sharp writing and intentional design into a
            storefront built for listeners, collectors, and community. Explore
            the latest drop, wear the era, and stay close to what lands next.
          </p>
          <div className="hero-actions">
            <a className="button button-accent" href="#shop">
              Shop the Drop
            </a>
            <a className="button button-solid" href="#music">
              Listen Now
            </a>
          </div>
        </div>
        <div className="hero-visual">
          <article className="visual-card visual-card-main">
            <p>Featured Drop</p>
            <h3>Night Run Capsule</h3>
            <span>Apparel + Digital Bundle</span>
          </article>
          <article className="visual-card">
            <p>Next Window</p>
            <h3>Afterglow Collection</h3>
            <span>Coming Soon</span>
          </article>
        </div>
      </section>

      <section className="store-section" id="shop">
        <div className="section-heading">
          <p className="eyebrow">Shop by Category</p>
          <h2>Build your set from the Conscious Cooper catalog.</h2>
        </div>
        <div className="category-grid">
          {categoryCards.map((category) => (
            <article className="category-card" key={category.name}>
              <h3>{category.name}</h3>
              <p>{category.copy}</p>
              <a href="#drops">Browse {category.name}</a>
            </article>
          ))}
        </div>
      </section>

      <section className="store-section" id="drops">
        <div className="section-heading">
          <p className="eyebrow">Featured Drop</p>
          <h2>Products moving now.</h2>
        </div>
        <div className="product-grid">
          {featuredProducts.map((product) => (
            <article className="product-card" key={product.title}>
              <div className="product-art" aria-hidden="true">
                {product.category}
              </div>
              <div className="product-meta">
                <div className="product-tags">
                  <span>{product.category}</span>
                  <span>{product.status}</span>
                </div>
                <h3>{product.title}</h3>
                <p>{product.description}</p>
                <div className="product-row">
                  <strong>
                    {product.price === null ? "N/A" : `$${product.price}`}
                  </strong>
                  <a href={product.externalUrl}>View Product</a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="content-grid" id="music">
        <article className="panel story-panel">
          <h2>The Conscious World</h2>
          <p>
            Conscious Cooper is a long-form artist identity rooted in discipline,
            reflection, and momentum. Each release, visual, and product drop is
            built to feel like a chapter in the same universe.
          </p>
          <p>
            The mission is simple: make records that move people and merchandise
            that holds that energy in real life.
          </p>
        </article>

        <article className="panel art-grid">
          <h2>Release Visuals</h2>
          <div className="release-cards">
            <div className="release-card">
              <p>Night Run</p>
              <span>Single Era</span>
            </div>
            <div className="release-card">
              <p>Afterglow</p>
              <span>Collection Preview</span>
            </div>
            <div className="release-card">
              <p>Signal Tape</p>
              <span>In Development</span>
            </div>
          </div>
        </article>

        <article className="panel">
          <h2>Listen</h2>
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

        <article className="panel" id="contact">
          <h2>Mailing List + Contact</h2>
          <p>
            Get first notice on drops, release windows, and exclusive merch
            runs. For features or bookings, reach out directly.
          </p>
          <form className="signup-form">
            <label htmlFor="email" className="sr-only">
              Email address
            </label>
            <input id="email" type="email" placeholder="Email address" />
            <button type="submit" className="button button-accent">
              Join the List
            </button>
          </form>
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

      <footer className="store-footer">
        <p>Conscious Cooper - Built for the long run.</p>
        <Link href="/dashboard">Dashboard</Link>
      </footer>
    </main>
  );
}
