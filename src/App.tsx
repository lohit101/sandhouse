import { useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import * as Dialog from '@radix-ui/react-dialog';
import { ArrowDown, ArrowUpRight, CaretDown, CaretLeft, CaretRight, Check, Coffee, ForkKnife, InstagramLogo, List, MapPin, Moon, Pause, Play, Sun, X } from '@phosphor-icons/react';
import { brands, contact, directionsUrl, locations, milestones } from './data';
import type { Brand, BrandId } from './data';

const ease = [0.22, 1, 0.36, 1] as const;

function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  return <motion.div className={className} initial={reduce ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.12 }} transition={{ duration: 0.75, ease, delay }}>{children}</motion.div>;
}

function Image({ src, alt, className = '', eager = false }: { src: string; alt: string; className?: string; eager?: boolean }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <div role="img" aria-label={alt} className={`image-error ${className}`}><ForkKnife size={34} /><span>Good food awaits.</span></div>;
  return <img src={src} alt={alt} className={className} loading={eager ? 'eager' : 'lazy'} decoding="async" onError={() => setFailed(true)} />;
}

function FoodVideo({ src, poster, label, className = '', paused = false }: { src: string; poster: string; label: string; className?: string; paused?: boolean }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (paused || reduce) { video.pause(); return; }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && document.visibilityState === 'visible') void video.play().catch(() => {});
      else video.pause();
    }, { threshold: 0.08 });
    observer.observe(video);
    const visibility = () => {
      if (document.hidden) { video.pause(); return; }
      const rect = video.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < window.innerHeight) void video.play().catch(() => {});
    };
    document.addEventListener('visibilitychange', visibility);
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', visibility); };
  }, [paused, reduce, failed]);
  return <div className={`food-video ${className}`}>
    <Image src={poster} alt={label} eager={className.includes('hero')} />
    {!reduce && !failed && <video ref={ref} muted loop playsInline preload="metadata" poster={poster} aria-hidden="true" className={ready ? 'is-ready' : ''} onLoadedData={() => setReady(true)} onError={() => setFailed(true)}><source src={src} type="video/mp4" /></video>}
  </div>;
}

function OrderDialog({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) {
  return <Dialog.Root open={open} onOpenChange={setOpen}>
    <Dialog.Portal><Dialog.Overlay className="dialog-overlay" /><Dialog.Content className="dialog-content order-dialog">
      <Dialog.Close className="icon-button dialog-close" aria-label="Close ordering options"><X size={22} /></Dialog.Close>
      <Dialog.Title>What sounds good?</Dialog.Title>
      <Dialog.Description>Choose your brand to explore the menu and order on Zomato.</Dialog.Description>
      <div className="order-options">{brands.map(brand => <a className="order-option" key={brand.id} href={brand.orderUrl} target="_blank" rel="noopener noreferrer">
        <Image src={brand.image} alt={brand.imageAlt} /><div><span className="order-brand">{brand.name}</span><span>{brand.category}</span></div><CaretRight size={20} aria-hidden="true" />
      </a>)}</div>
      <p className="dialog-note">Availability and delivery details are shown on Zomato.</p>
    </Dialog.Content></Dialog.Portal>
  </Dialog.Root>;
}

function FilmDialog({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) {
  return <Dialog.Root open={open} onOpenChange={setOpen}>
    <Dialog.Portal><Dialog.Overlay className="dialog-overlay" /><Dialog.Content className="dialog-content film-dialog">
      <Dialog.Close className="icon-button dialog-close" aria-label="Close film"><X size={22} /></Dialog.Close>
      <Dialog.Title className="sr-only">From our table to yours</Dialog.Title>
      <Dialog.Description className="sr-only">A Sandhouse Hospitality motion film celebrating its three food brands.</Dialog.Description>
      <video controls playsInline autoPlay muted poster="/assets/film-poster.webp"><source src="/assets/sandhouse-film.mp4" type="video/mp4" />Your browser does not support embedded video.</video>
      <div className="film-caption"><span>From our table to yours.</span><a href="/assets/sandhouse-film.mp4" download>Download the film</a></div>
    </Dialog.Content></Dialog.Portal>
  </Dialog.Root>;
}

function Header({ onOrder, dark, onTheme }: { onOrder: () => void; dark: boolean; onTheme: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const path = window.location.pathname;
  const nav = <><a href="/" aria-current={path === '/' ? 'page' : undefined}>Home</a><a href="/about-us/" aria-current={path === '/about-us/' ? 'page' : undefined}>About Us</a><a href="/#brands" aria-current={brands.some(b => b.route === path) ? 'page' : undefined}>Brands</a><a href="/contact-us/" aria-current={path === '/contact-us/' ? 'page' : undefined}>Contact Us</a></>;
  return <header className="site-header">
    <div className="header-inner container"><a href="/" className="brand-home" aria-label="Sandhouse Hospitality home"><img src="/assets/logo-group.png" alt="Sandhouse Hospitality" width="224" height="54" /></a><img className="header-mark" src="/assets/mark-group.png" alt="" />
      <nav className="desktop-nav" aria-label="Main navigation">{nav}</nav>
      <div className="header-actions"><button className="icon-button theme-toggle" onClick={onTheme} aria-label={`Switch to ${dark ? 'light' : 'dark'} appearance`}>{dark ? <Sun size={20} /> : <Moon size={20} />}</button><button className="button button-small header-order" onClick={onOrder}>Order online <ArrowUpRight size={17} /></button>
        <Dialog.Root open={menuOpen} onOpenChange={setMenuOpen}><Dialog.Trigger className="icon-button mobile-menu-button" aria-label="Open navigation"><List size={27} /></Dialog.Trigger><Dialog.Portal><Dialog.Overlay className="dialog-overlay" /><Dialog.Content className="dialog-content mobile-menu"><Dialog.Close className="icon-button dialog-close" aria-label="Close navigation"><X size={24} /></Dialog.Close><Dialog.Title>Come together. Eat well.</Dialog.Title><Dialog.Description className="sr-only">Explore Sandhouse Hospitality</Dialog.Description><nav aria-label="Mobile navigation" onClick={() => setMenuOpen(false)}>{nav}<a href="/#locations">Find an outlet</a></nav><button className="button" onClick={() => { setMenuOpen(false); onOrder(); }}>Order online</button></Dialog.Content></Dialog.Portal></Dialog.Root>
      </div>
    </div>
  </header>;
}

function Hero({ onFilm }: { onFilm: () => void }) {
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();
  return <section className="hero" aria-labelledby="hero-title">
    <FoodVideo src="/assets/official-food-loop.mp4" poster="/assets/official-food-poster.webp" label="Freshly prepared food from the Sandhouse Hospitality brand film" className="hero-backdrop" paused={paused} />
    <div className="hero-shade" />
    <div className="hero-content container">
      <motion.p className="eyebrow" initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7 }}>GOOD FOOD. GOOD PEOPLE. SINCE 2015.</motion.p>
      <motion.h1 id="hero-title" initial={reduce ? false : { opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85, ease, delay: 0.1 }}>Our only rule.<br /><span>Eat well.</span></motion.h1>
      <motion.div initial={reduce ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, ease, delay: 0.25 }}><p className="hero-description">Gourmet burgers. Canteen favourites. A table to linger at. Three distinct brands, one shared love for food.</p><div className="hero-actions"><a className="button" href="#brands">Explore our brands <ArrowUpRight size={19} /></a><button className="text-button" onClick={onFilm}><span className="play-icon"><Play size={14} weight="fill" /></span>Watch the film</button></div></motion.div>
      <div className="hero-bottom"><a href="#brands" className="hero-scroll"><ArrowDown size={18} /> FIND YOUR KIND OF GOOD FOOD</a>{!reduce && <button className="icon-button media-pause" aria-label={paused ? 'Play food animation' : 'Pause food animation'} onClick={() => setPaused(!paused)}>{paused ? <Play size={17} weight="fill" /> : <Pause size={17} weight="fill" />}</button>}</div>
    </div>
  </section>;
}

function BrandStrip() {
  return <div className="brand-strip container" aria-label="Explore our three brands">{brands.map(brand => <a href={brand.route} className={`brand-strip-link brand-logo-${brand.id}`} key={brand.id}><img src={brand.logo} alt={brand.name} /><span>{brand.id === 'sandburgs' ? 'BURGERS, SANDWICHES & SHAKES' : brand.id === 'canteen' ? 'CHAI, COMFORT & THE GOOD OLD DAYS' : 'GOOD FOOD & GREAT COMPANY'}</span><ArrowUpRight size={21} /></a>)}</div>;
}

function BrandCards() {
  const [active, setActive] = useState<BrandId>('sandburgs');
  const brand = brands.find(b => b.id === active)!;
  const reduce = useReducedMotion();
  return <section className="brands-section section container" id="brands" aria-labelledby="brands-title">
    <Reveal className="section-heading"><div><span className="eyebrow">THE SANDHOUSE FAMILY</span><h2 id="brands-title">Different cravings.<br />Same love for food.</h2></div><p>Your everyday favourite. Your comfort-food fix. Your next long catch-up. Meet the brands that bring it all to the table.</p></Reveal>
    <div className="brand-tabs" aria-label="Choose a brand">{brands.map((b, index) => <button key={b.id} className={`brand-tab brand-tab-${b.id}`} aria-pressed={active === b.id} aria-controls="brand-spotlight" onClick={() => setActive(b.id)}><span className="tab-index">0{index + 1}</span><span>{b.id === 'diner' ? 'Sandhouse' : b.name}</span><ArrowUpRight size={20} /></button>)}</div>
    <div id="brand-spotlight" className={`brand-spotlight spotlight-${active}`} aria-live="polite">
      <AnimatePresence mode="wait" initial={false}><motion.div className="spotlight-content" key={brand.id} initial={reduce ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: reduce ? 0 : 0.25 }}>
        <div className="spotlight-copy"><img className={`spotlight-logo logo-${brand.id}`} src={brand.logo} alt={brand.name} /><span className="eyebrow">{brand.category}</span><h3>{brand.headline}</h3><p>{brand.description}</p><a href={brand.route} className="button brand-button">Discover {brand.id === 'canteen' ? 'the canteen' : brand.id === 'diner' ? 'the diner' : 'Sandburgs'} <ArrowUpRight size={19} /></a><a href={brand.orderUrl} className="underlined-link" target="_blank" rel="noopener noreferrer">Order online <ArrowUpRight size={16} /></a></div>
        <div className="spotlight-media">{brand.id === 'sandburgs' ? <FoodVideo src="/assets/burger-loop.mp4" poster={brand.image} label={brand.imageAlt} /> : brand.id === 'canteen' ? <FoodVideo src="/assets/canteen-loop.mp4" poster={brand.image} label={brand.imageAlt} /> : <Image src="/assets/diner-pizza-concept.webp" alt="Thin-crust pizza inspired by Sandhouse All Day Diner" />}<span className="spotlight-caption">{brand.id === 'sandburgs' ? 'YOUR EVERYDAY GOURMET' : brand.id === 'canteen' ? 'COMFORT, BY THE BITE' : 'ALL DAY. YOUR WAY.'}</span></div>
      </motion.div></AnimatePresence>
    </div>
  </section>;
}

function FoodMoment({ onFilm }: { onFilm: () => void }) {
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();
  return <section className="moment-section section container" aria-labelledby="moment-title">
    <Reveal className="section-heading"><div><span className="eyebrow">A LITTLE TASTE OF OUR WORLD</span><h2 id="moment-title">From our table<br />to yours.</h2></div><p>For a quick bite, a chai break or a little more time together. There’s always a reason to eat well.</p></Reveal>
    <Reveal className="moment-media-wrap"><FoodVideo src="/assets/sandhouse-film.mp4" poster="/assets/film-poster.webp" label="A motion film exploring Sandburgs, The Canteen Project and Sandhouse All Day Diner" className="moment-media" paused={paused} /><button className="film-play" aria-label="Watch the film" onClick={onFilm}><Play size={24} weight="fill" /></button><div className="moment-controls"><span>THREE BRANDS. ONE SHARED APPETITE.</span><div><button className="text-button" onClick={onFilm}>Watch the film <ArrowUpRight size={18} /></button>{!reduce && <button className="icon-button" aria-label={paused ? 'Play brand film animation' : 'Pause brand film animation'} onClick={() => setPaused(!paused)}>{paused ? <Play size={18} weight="fill" /> : <Pause size={18} weight="fill" />}</button>}</div></div></Reveal>
  </section>;
}

function Story({ full = false }: { full?: boolean }) {
  const [active, setActive] = useState('2015');
  const reduce = useReducedMotion();
  return <section className={`story-section section container ${full ? 'story-full' : ''}`} aria-labelledby="story-title">
    <Reveal className="story-heading"><div><span className="eyebrow">OUR STORY, SO FAR</span><h2 id="story-title">Two brothers.<br />One shared appetite.</h2></div><div><p>In 2015, Pankaj and Danny Alagh brought their shared love for food to Baani Square, Gurugram. A small beginning became a family of brands.</p>{full && <p className="story-expanded">Pankaj’s inspiration came from the food and ideas he discovered through Eat Street. Danny brought his culinary experience from Australia back home. Together, they set out to share flavours from around the world, with their customers and community shaping the journey.</p>}</div></Reveal>
    <div className="story-grid"><Reveal className="story-image"><Image src="/assets/diner-venue.webp" alt="The welcoming setting at Sandhouse All Day Diner" /><span>A place to gather, since 2018.</span></Reveal><div className="story-timeline">{milestones.map(m => <div className={`timeline-item ${active === m.year ? 'is-active' : ''}`} key={m.year}><button aria-expanded={active === m.year} aria-controls={`story-${m.year}`} onClick={() => setActive(active === m.year ? '' : m.year)}><span className="timeline-year">{m.year}</span><span>{m.name}</span><CaretDown size={20} /></button><div id={`story-${m.year}`}><AnimatePresence initial={false}>{active === m.year && <motion.div initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduce ? 0 : 0.2 }}><p>{m.text}</p></motion.div>}</AnimatePresence></div></div>)}{!full && <a href="/about-us/" className="underlined-link story-link">Our whole story</a>}</div></div>
  </section>;
}

function Locations({ brand: initialBrand = 'all' }: { brand?: BrandId | 'all' }) {
  const [city, setCity] = useState('Gurugram');
  const [brand, setBrand] = useState<BrandId | 'all'>(initialBrand);
  const [expanded, setExpanded] = useState(false);
  const results = useMemo(() => locations.filter(location => location.city === city && (brand === 'all' || location.brand === brand)), [city, brand]);
  const displayed = expanded ? results : results.slice(0, 3);
  const changeBrand = (value: BrandId | 'all') => { setBrand(value); setExpanded(false); };
  return <section className="locations-section section container" id="locations" aria-labelledby="locations-title">
    <Reveal className="section-heading"><div><span className="eyebrow">COME ON OVER</span><h2 id="locations-title">A good bite.<br />Closer than you think.</h2></div><p>Your next burger, chai break or catch-up could be just around the corner. Find your nearest outlet.</p></Reveal>
    <div className="location-toolbar"><div className="brand-filters" aria-label="Filter locations by brand"><button aria-pressed={brand === 'all'} onClick={() => changeBrand('all')}>All brands</button>{brands.map(b => <button key={b.id} aria-pressed={brand === b.id} onClick={() => changeBrand(b.id)}>{b.id === 'diner' ? 'Sandhouse' : b.name}</button>)}</div><label className="city-select"><MapPin size={20} aria-hidden="true" /><span className="sr-only">Choose a city</span><select value={city} onChange={e => { setCity(e.target.value); setExpanded(false); }}><option>Gurugram</option><option>New Delhi</option><option>Chandigarh</option><option>Mohali</option><option>Dehradun</option></select><CaretDown size={15} aria-hidden="true" /></label></div>
    <p className="location-result-count" role="status">{results.length} {results.length === 1 ? 'location' : 'locations'} in {city}</p>
    <div className="location-grid">{displayed.map(location => {
      const b = brands.find(b => b.id === location.brand)!;
      return <article className={`location-card location-${b.id}`} key={location.id}><span className="location-brand">{b.name}</span><h3>{location.name}</h3><p>{location.address}</p><a href={directionsUrl(`${b.name}, ${location.address}`)} target="_blank" rel="noopener noreferrer" className="location-directions">Get directions <ArrowUpRight size={18} /></a></article>;
    })}</div>
    {results.length === 0 && <div className="locations-empty"><Coffee size={42} weight="light" /><h3>A different city, perhaps?</h3><p>There are no listed locations for this brand in {city}.</p><button className="button button-outline" onClick={() => { setCity('Gurugram'); changeBrand('all'); }}>See Gurugram locations</button></div>}
    {results.length > 3 && <button className="text-button show-locations" onClick={() => setExpanded(!expanded)}>{expanded ? 'Show fewer locations' : `See all ${results.length} locations`}<CaretDown size={17} className={expanded ? 'rotate' : ''} /></button>}
  </section>;
}

function Footer() {
  return <footer className="site-footer"><div className="container"><div className="footer-top"><div><span className="eyebrow">GOOD FOOD BRINGS US TOGETHER.</span><p className="footer-statement">See you<br />at the table.</p></div><div className="footer-intro"><img className="footer-mark" src="/assets/mark-group.png" alt="" /><a href="/" className="footer-brand"><img src="/assets/logo-group.png" alt="Sandhouse Hospitality" /></a><a className="footer-email underlined-link" href={`mailto:${contact.email}`}>Say hello <ArrowUpRight size={18} /></a></div></div><div className="footer-grid"><div><span className="footer-label">Our brands</span>{brands.map(b => <a href={b.route} key={b.id}>{b.name}<ArrowUpRight size={16} /></a>)}</div><div><span className="footer-label">Come say hi</span><p>{contact.address}</p><a href={directionsUrl(contact.address)} target="_blank" rel="noopener noreferrer">Find us on the map <ArrowUpRight size={16} /></a></div><div><span className="footer-label">Stay connected</span>{brands.map(b => <a href={b.instagram} target="_blank" rel="noopener noreferrer" key={b.id}><InstagramLogo size={16} />{b.id === 'sandburgs' ? '@sandburgs.in' : b.id === 'canteen' ? '@canteenproject.in' : '@sandhouse.in'}</a>)}</div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Sandhouse Hospitality Pvt. Ltd.</span><a href="https://www.basically.agency/" target="_blank" rel="noopener noreferrer">Website concept by <strong>basically.</strong></a><a href="https://sandhousehospitality.com/privacy-policy/" target="_blank" rel="noopener noreferrer">Privacy policy</a></div></div></footer>;
}

function BrandPage({ brand }: { brand: Brand }) {
  return <div className={`brand-page brand-page-${brand.id}`}><section className="brand-page-hero"><div className="brand-page-hero-inner container"><div className="brand-page-copy"><a className="back-link" href="/#brands"><CaretLeft size={16} /> All brands</a><img className={`brand-page-logo brand-logo-${brand.id}`} src={brand.logo} alt={brand.name} /><span className="eyebrow">{brand.category}</span><h1>{brand.headline}</h1><p>{brand.description}</p><div className="hero-actions"><a className="button brand-button" href={brand.orderUrl} target="_blank" rel="noopener noreferrer">Order online <ArrowUpRight size={18} /></a><a className="text-button" href="#locations"><MapPin size={19} /> Find an outlet</a></div></div><div className="brand-page-image">{brand.id === 'sandburgs' ? <FoodVideo src="/assets/burger-loop.mp4" poster={brand.image} label={brand.imageAlt} /> : brand.id === 'canteen' ? <FoodVideo src="/assets/canteen-loop.mp4" poster={brand.image} label={brand.imageAlt} /> : <Image src={brand.image} alt={brand.imageAlt} eager />}<span className="brand-image-caption">{brand.id === 'diner' ? '32ND AVENUE, GURUGRAM' : brand.id === 'canteen' ? 'A TASTE OF THE GOOD OLD DAYS' : 'CRAFTED TO PERFECTION'}</span></div></div></section><section className="brand-story section container"><Reveal className="brand-story-layout"><div><span className="eyebrow">THE BRAND STORY</span><h2>{brand.id === 'sandburgs' ? 'Made with care, from the start.' : brand.id === 'canteen' ? 'The comfort you grew up with.' : 'Your neighbourhood retreat.'}</h2></div><p>{brand.story}</p></Reveal></section><section className="brand-menu container"><div className="brand-food-grid">{brand.food.map(food => <Reveal className={`brand-food-card ${food.image.includes('sandburgs-food') || food.image.includes('canteen-food') ? 'compact-food' : ''}`} key={food.name}><div className="brand-food-image"><Image src={food.image} alt={food.name} /></div><div><h3>{food.name}</h3><p>{food.detail}</p></div></Reveal>)}</div><a className="underlined-link" href={brand.orderUrl} target="_blank" rel="noopener noreferrer">Explore the full menu on Zomato <ArrowUpRight size={17} /></a></section><Locations brand={brand.id} /></div>;
}

function ContactPage() {
  return <section className="contact-page container"><Reveal><span className="eyebrow">WE’D LOVE TO HEAR FROM YOU</span><h1>Come say hello.</h1><p>A question, a little feedback or simply a hello. Our team would love to hear from you.</p><a className="contact-email" href={`mailto:${contact.email}`}>{contact.email}</a></Reveal><div className="contact-details"><div><MapPin size={28} weight="light" /><h2>Come say hi.</h2><p>{contact.address}</p><a className="underlined-link" href={directionsUrl(contact.address)} target="_blank" rel="noopener noreferrer">Get directions</a></div><div><Coffee size={28} weight="light" /><h2>The office is open.</h2><p>{contact.hours}</p><span className="contact-office-note">For dining and delivery availability, check the relevant outlet’s listing.</span></div></div><Image src="/assets/diner-venue.webp" alt="Sandhouse All Day Diner, a place to gather over good food" className="contact-image" /></section>;
}

export default function App() {
  const [orderOpen, setOrderOpen] = useState(false);
  const [filmOpen, setFilmOpen] = useState(false);
  const [dark, setDark] = useState(() => {
    try { const stored = localStorage.getItem('sandhouse-theme-v2'); if (stored) return stored === 'dark'; } catch { /* The brand's default remains available. */ }
    return true;
  });
  const path = window.location.pathname.replace(/\/?$/, '/');
  const brand = brands.find(b => b.route === path);
  const home = path === '/';
  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#191a19' : '#fffaed');
    try { localStorage.setItem('sandhouse-theme-v2', dark ? 'dark' : 'light'); } catch { /* Theme still works in this session. */ }
  }, [dark]);
  useEffect(() => {
    const name = brand?.name ?? (path === '/about-us/' ? 'Our Story' : path === '/contact-us/' ? 'Contact Us' : 'Come together. Eat well.');
    document.title = `${name} | Sandhouse Hospitality`;
    if (window.location.hash) requestAnimationFrame(() => document.getElementById(window.location.hash.slice(1))?.scrollIntoView());
  }, [brand, path]);
  return <><a className="skip-link" href="#main">Skip to content</a><Header onOrder={() => setOrderOpen(true)} dark={dark} onTheme={() => setDark(!dark)} /><main id="main">
    {home ? <><Hero onFilm={() => setFilmOpen(true)} /><BrandStrip /><BrandCards /><FoodMoment onFilm={() => setFilmOpen(true)} /><Story /><Locations /></> : brand ? <BrandPage brand={brand} /> : path === '/about-us/' ? <><div className="about-intro container"><span className="eyebrow">OUR STORY</span><h1>Our story, so far.</h1></div><Story full /><BrandStrip /></> : path === '/contact-us/' ? <ContactPage /> : <section className="not-found container"><Check size={36} /><h1>Let’s get you to the right table.</h1><p>The page you’re looking for isn’t here.</p><a className="button" href="/">Return home</a></section>}
  </main><Footer /><OrderDialog open={orderOpen} setOpen={setOrderOpen} /><FilmDialog open={filmOpen} setOpen={setFilmOpen} /></>;
}
