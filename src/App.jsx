import { useState } from 'react';
import ScrollStage from './ScrollStage';
import Booking from './Booking';
import { SALON, SERVICES, GALLERY, WHY, TESTIMONIALS } from './content';

// Tries the given file name with common extensions (.jpg, .jpeg, .png, .webp, upper-case variants).
// If none exist, shows a labelled placeholder instead.
const EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.JPG', '.JPEG', '.PNG', '.WEBP'];
function Img({ src, alt, label }) {
  const base = src.replace(/\.[a-z]+$/i, '');
  const candidates = EXTENSIONS.map((ext) => base + ext);
  const [idx, setIdx] = useState(0);
  if (idx >= candidates.length) return <span className="ph-label">{label}</span>;
  return (
    <img
      src={candidates[idx]}
      alt={alt}
      loading="lazy"
      onError={() => setIdx((i) => i + 1)}
    />
  );
}

// Decorative background photo, softened with a navy overlay for readability.
function BgPhoto({ src, label }) {
  return (
    <div className="bg-photo" aria-hidden="true">
      <Img src={src} alt="" label={label} />
    </div>
  );
}

const ICONS = [
  'M12 2l2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4z',
  'M12 2l8 3v6c0 5-3.5 9-8 11-4.5-2-8-6-8-11V5z',
  'M12 2.5c3.5 4.5 6 7.6 6 11a6 6 0 0 1-12 0c0-3.4 2.5-6.5 6-11z',
  'M4 20l5-5 2 2-5 5H4zM13 4l7 7-5 5-7-7z',
  'M12 21s-7-4.5-9.5-9A5 5 0 0 1 12 6a5 5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9z',
];

function Icon({ d }) {
  return (
    <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

function Nav() {
  const [open, setOpen] = useState(false);
  const links = [
    ['#about', 'About'], ['#gallery', 'Gallery'], ['#before-after', 'Before & After'],
    ['#services', 'Services'], ['#book', 'Book'], ['#contact', 'Contact'],
  ];
  return (
    <header className="nav">
      <a href="#top" className="brand">VELVET NAILS</a>
      <button className="menu-btn" aria-expanded={open} aria-controls="menu" onClick={() => setOpen((o) => !o)}>
        {open ? 'Close' : 'Menu'}
      </button>
      <nav id="menu" className={open ? 'open' : ''}>
        {links.map(([h, l]) => (
          <a key={h} href={h} onClick={() => setOpen(false)}>{l}</a>
        ))}
      </nav>
    </header>
  );
}

function BeforeAfter() {
  const [pos, setPos] = useState(50);
  return (
    <div className="ba">
      <div className="ba-layer">
        <Img src="/images/before.jpg" alt="Plain nails before treatment" label="BEFORE: plain nails (add /public/images/before.jpg)" />
      </div>
      <div className="ba-layer ba-after" style={{ clipPath: `inset(0 0 0 ${pos}%)` }}>
        <Img src="/images/after.jpg" alt="Finished luxury nail art" label="AFTER: luxury nail art (add /public/images/after.jpg)" />
      </div>
      <input
        type="range" min="0" max="100" value={pos}
        className="ba-range" aria-label="Drag to compare before and after"
        onChange={(e) => setPos(Number(e.target.value))}
      />
    </div>
  );
}

export default function App() {
  return (
    <>
      <Nav />
      <div id="top" />
      <ScrollStage />

      <section className="section hero-cta">
        <span className="deco-ring r1" aria-hidden="true" />
        <span className="deco-ring r2" aria-hidden="true" />
        <p className="eyebrow">VELVET NAILS</p>
        <h2>Your Nails. Your Signature.</h2>
        <div className="divider" />
        <p className="lead">Discover artful manicures crafted to express your individual style.</p>
        <div className="cta-row">
          <a href="#gallery" className="btn">Explore Our Designs</a>
          <a href="#book" className="btn btn-gold">Book Your Appointment</a>
        </div>
      </section>

      <section id="about" className="section split">
        <div className="about-stack">
          <div className="about-main ph">
            <Img src="/images/about-artist.jpg" alt="Nail artist at work" label="Nail artist photo (add /public/images/about-artist.jpg)" />
          </div>
          <div className="about-detail ph">
            <Img src="/images/about-detail.jpg" alt="Close-up of nail art detail" label="Detail photo (add /public/images/about-detail.jpg)" />
          </div>
        </div>
        <div className="about-text">
          <p className="eyebrow">About Us</p>
          <h2>Beauty in Every Detail</h2>
          <div className="divider left" />
          <p>
            At VELVET NAILS, every set begins with a conversation. Our artists focus on creative nail artistry,
            precise detailing, strict hygiene, and a calm, comfortable experience from the first step to the last.
          </p>
        </div>
      </section>

      <section id="gallery" className="section ivory">
        <BgPhoto src="/images/gallery-bg.jpg" label="Background photo (optional: /public/images/gallery-bg.jpg)" />
        <p className="eyebrow">Nail Art Gallery</p>
        <h2>Designs in Focus</h2>
        <div className="gallery-grid">
          {GALLERY.map((g) => (
            <figure key={g.title} className="gallery-card ph">
              <Img src={g.img} alt={g.title} label={`${g.title} (add ${g.img})`} />
              <figcaption>{g.title}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section id="before-after" className="section">
        <p className="eyebrow">Before &amp; After</p>
        <h2>The Transformation</h2>
        <div className="divider" />
        <BeforeAfter />
      </section>

      <section id="services" className="section ivory">
        <BgPhoto src="/images/services-bg.jpg" label="Background photo (optional: /public/images/services-bg.jpg)" />
        <p className="eyebrow">Our Services</p>
        <h2>Signature Services</h2>
        <div className="grid-3">
          {SERVICES.map((s, i) => (
            <article key={s.name} className="card">
              <div className="card-img ph">
                <Img src={`/images/service-${i + 1}.jpg`} alt={s.name} label={`${s.name} (add /public/images/service-${i + 1}.jpg)`} />
              </div>
              <h3>{s.name}</h3>
              <p>{s.desc}</p>
              <p className="price">Price: {s.price} <em>(placeholder)</em></p>
              <a href="#book" className="link">Book Now →</a>
            </article>
          ))}
        </div>
      </section>

      <section className="section why">
        <div className="why-img ph">
          <Img src="/images/why-studio.jpg" alt="VELVET NAILS studio" label="Studio photo (add /public/images/why-studio.jpg)" />
        </div>
        <div className="why-text">
          <p className="eyebrow">Why Choose Us</p>
          <h2>Made With Care</h2>
          <div className="divider left" />
          <ul className="why-list">
            {WHY.map((w, i) => (
              <li key={w}>
                <span className="why-icon"><Icon d={ICONS[i]} /></span>
                <span>{w}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section testi">
        <BgPhoto src="/images/testimonials-bg.jpg" label="Background photo (optional: /public/images/testimonials-bg.jpg)" />
        <div className="section-inner">
          <p className="eyebrow">Testimonials</p>
          <h2>What Clients Say</h2>
          <p className="note">Sample placeholder reviews. Replace with approved customer testimonials.</p>
          <div className="grid-3">
            {TESTIMONIALS.map((t) => (
              <blockquote key={t.name} className="card glass">
                <p className="stars" aria-label={`${t.rating} out of 5 stars`}>{'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}</p>
                <p>{t.text}</p>
                <cite>{t.name}</cite>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <section id="book" className="section booking">
        <BgPhoto src="/images/booking-bg.jpg" label="Background photo (optional: /public/images/booking-bg.jpg)" />
        <div className="section-inner">
          <p className="eyebrow">Booking</p>
          <h2>Your Perfect Nails Are One Appointment Away</h2>
          <div className="divider" />
          <Booking />
        </div>
      </section>

      <footer id="contact" className="footer">
        <div>
          <h3>VELVET NAILS</h3>
          <p>{SALON.address}</p>
          <p>{SALON.phone} · {SALON.email}</p>
          <p>{SALON.hours}</p>
        </div>
        <div className="social">
          {Object.entries(SALON.social).filter(([, url]) => url).map(([k, url]) => (
            <a key={k} href={url} target="_blank" rel="noopener noreferrer">{k}</a>
          ))}
          {!Object.values(SALON.social).some(Boolean) && <p className="note">Social links: add URLs in src/content.js</p>}
        </div>
        <div className="copy">© {new Date().getFullYear()} VELVET NAILS</div>
      </footer>
    </>
  );
}