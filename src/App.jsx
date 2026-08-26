'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { icons, money, store } from './content/product.js';

const Icon = ({ name, size = 22 }) => {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{(icons[name] || []).map(({ tag: Tag, props }, index) => <Tag key={`${name}-${index}`} {...props} />)}</svg>;
};

const Stars = ({ rating, dark = false }) => (
  <span className={`stars ${dark ? 'stars--dark' : ''}`} aria-label={`${rating} ${store.ui.starsLabel}`}>
    {[0, 1, 2, 3, 4].map((n) => <span key={n}>★</span>)}
  </span>
);

function MediaPlaceholder({ media, compact = false, wide = false }) {
  return (
    <div className={`media-placeholder ${compact ? 'media-placeholder--compact' : ''} ${wide ? 'media-placeholder--wide' : ''}`} role="img" aria-label={media.alt}>
      <span className="media-placeholder__number">{media.number}</span>
      <span className="media-placeholder__corner media-placeholder__corner--tl" />
      <span className="media-placeholder__corner media-placeholder__corner--tr" />
      <span className="media-placeholder__corner media-placeholder__corner--bl" />
      <span className="media-placeholder__corner media-placeholder__corner--br" />
      <span className="media-placeholder__picture" aria-hidden="true"><Icon name="image" size={compact ? 20 : 34} /></span>
      {!compact && <div className="media-placeholder__copy"><small>{media.label}</small><strong>{media.title}</strong><p>{media.direction}</p><code>{media.spec}</code></div>}
    </div>
  );
}

function LearnMarker({ id, label, onOpen }) {
  return (
    <button className="learn-marker" type="button" aria-label={`${store.ui.explanationLabel}: ${label}`} onClick={(event) => { event.stopPropagation(); onOpen(id); }}>
      <span>{label}</span><Icon name="info" size={18} />
    </button>
  );
}

function useFocusTrap(open, dialogRef, restoreRef, onClose) {
  useEffect(() => {
    if (!open || !dialogRef.current) return undefined;
    const dialog = dialogRef.current;
    const selector = 'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const focusables = () => [...dialog.querySelectorAll(selector)];
    (focusables()[0] || dialog).focus();
    const trap = (event) => {
      if (event.key === 'Escape') { event.preventDefault(); onClose(); return; }
      if (event.key !== 'Tab') return;
      const items = focusables();
      if (!items.length) { event.preventDefault(); return; }
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    dialog.addEventListener('keydown', trap);
    return () => {
      dialog.removeEventListener('keydown', trap);
      requestAnimationFrame(() => restoreRef.current?.focus?.());
    };
  }, [open, dialogRef, restoreRef]);
}

function App() {
  const [learnMode, setLearnMode] = useState(false);
  const [annotations, setAnnotations] = useState([]);
  const [activeAnnotationId, setActiveAnnotationId] = useState(null);
  const [mediaIndex, setMediaIndex] = useState(0);
  const [bundleId, setBundleId] = useState(store.product.bundles[0].id);
  const [quantity, setQuantity] = useState(1);
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [notice, setNotice] = useState('');
  const [previewAnnotationId, setPreviewAnnotationId] = useState(null);
  const panelRef = useRef(null);
  const cartRef = useRef(null);
  const annotationTriggerRef = useRef(null);
  const cartTriggerRef = useRef(null);

  const selectedBundle = store.product.bundles.find((bundle) => bundle.id === bundleId);
  const activeAnnotation = annotations.find((item) => item.id === activeAnnotationId);
  const previewAnnotation = annotations.find((item) => item.id === previewAnnotationId);
  const palette = useMemo(() => ({
    '--paper': store.colors.paper,
    '--ink': store.colors.ink,
    '--cobalt': store.colors.cobalt,
    '--tomato': store.colors.tomato,
    '--amber': store.colors.amber,
  }), []);

  useEffect(() => {
    fetch('/learning.json')
      .then((response) => response.json())
      .then((data) => {
        setAnnotations(data.annotations);
        const params = new URLSearchParams(window.location.search);
        const annotation = params.get('annotation');
        if (params.get('learn') === '1') setLearnMode(true);
        if (annotation && data.annotations.some((item) => item.id === annotation)) {
          setLearnMode(true);
          setActiveAnnotationId(annotation);
        }
      });
  }, []);

  const openAnnotation = (id) => {
    annotationTriggerRef.current = document.activeElement;
    setActiveAnnotationId(id);
    const url = new URL(window.location.href);
    url.searchParams.set('learn', '1');
    url.searchParams.set('annotation', id);
    window.history.replaceState({}, '', url);
  };

  const openCart = () => {
    cartTriggerRef.current = document.activeElement;
    setCartOpen(true);
  };

  const closeCart = () => setCartOpen(false);

  const closeAnnotation = () => {
    setActiveAnnotationId(null);
    const url = new URL(window.location.href);
    url.searchParams.delete('annotation');
    window.history.replaceState({}, '', url);
  };

  const toggleLearn = () => {
    const next = !learnMode;
    setLearnMode(next);
    if (!next) setActiveAnnotationId(null);
    const url = new URL(window.location.href);
    if (next) url.searchParams.set('learn', '1'); else { url.searchParams.delete('learn'); url.searchParams.delete('annotation'); }
    window.history.replaceState({}, '', url);
  };

  const addToCart = () => {
    setCart({ bundle: selectedBundle, quantity, total: selectedBundle.price * quantity });
    openCart();
  };

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(activeAnnotation.prompt);
    } catch {
      const text = document.createElement('textarea');
      text.value = activeAnnotation.prompt;
      document.body.appendChild(text);
      text.select();
      document.execCommand('copy');
      text.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const demoCheckout = () => {
    setCartOpen(false);
    setCart(null);
    setNotice(store.ui.demoComplete);
    setTimeout(() => setNotice(''), 4000);
  };

  useFocusTrap(Boolean(activeAnnotation), panelRef, annotationTriggerRef, closeAnnotation);
  useFocusTrap(cartOpen, cartRef, cartTriggerRef, closeCart);

  const learnEventId = (event) => event.target.closest('[data-learn-id]')?.dataset.learnId || null;

  return (
    <div className={`app ${learnMode ? 'is-learning' : ''}`} style={palette}
      onPointerOver={(event) => learnMode && setPreviewAnnotationId(learnEventId(event))}
      onPointerOut={(event) => learnMode && setPreviewAnnotationId(event.relatedTarget?.closest?.('[data-learn-id]')?.dataset.learnId || null)}
      onFocusCapture={(event) => learnMode && setPreviewAnnotationId(learnEventId(event))}
      onBlurCapture={(event) => learnMode && setPreviewAnnotationId(event.relatedTarget?.closest?.('[data-learn-id]')?.dataset.learnId || null)}>
      <a className="skip-link" href="#product-main">{store.ui.skipLink}</a>

      <div className="announcement learn-target" data-learn-id="announcement-bar">
        <span>{store.announcement}</span>
        {learnMode && <LearnMarker id="announcement-bar" label={store.ui.markerLabels.announcement} onOpen={openAnnotation} />}
      </div>

      <header className="site-header" id="top">
        <a className="brand learn-target" data-learn-id="brand-logo" href="#top" aria-label={`${store.brand.name}, ${store.ui.backToTop}`}>
          <span className="brand__mark">{store.brand.logoMark}</span>
          <span className="brand__name">{store.brand.name}</span>
          {learnMode && <LearnMarker id="brand-logo" label={store.ui.markerLabels.logo} onOpen={openAnnotation} />}
        </a>
        <nav className="desktop-nav" aria-label={store.ui.mainNavigationLabel}>
          {store.navigation.map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}
        </nav>
        <div className="header-actions">
          <button className={`learn-toggle ${learnMode ? 'is-active' : ''}`} type="button" onClick={toggleLearn} aria-pressed={learnMode}>
            <span className="learn-toggle__dot" /> {learnMode ? store.ui.learnOn : store.ui.learnOff}
          </button>
          <button className="icon-button cart-button" type="button" onClick={openCart} aria-label={`${store.ui.demoCart}${cart ? `, ${cart.quantity} ${store.ui.productSingular}` : ''}`}>
            <Icon name="cart" /><span>{cart?.quantity || 0}</span>
          </button>
          <button className="icon-button menu-button" type="button" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label={menuOpen ? store.ui.closeMenu : store.ui.openMenu}><Icon name={menuOpen ? 'close' : 'menu'} /></button>
        </div>
      </header>

      {menuOpen && <nav className="mobile-nav" aria-label={store.ui.mobileNavigationLabel}>{store.navigation.map((item) => <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>{item.label}<Icon name="arrow" /></a>)}</nav>}

      <main id="product-main">
        <section className="product-shell">
          <div className="gallery learn-target" data-learn-id="product-gallery">
            <div className="gallery__stage">
              <MediaPlaceholder media={store.product.media[mediaIndex]} />
              <span className="gallery__count">{String(mediaIndex + 1).padStart(2, '0')} / {String(store.product.media.length).padStart(2, '0')}</span>
              {learnMode && <LearnMarker id="product-gallery" label={store.ui.markerLabels.gallery} onOpen={openAnnotation} />}
            </div>
            <div className="gallery__thumbs" aria-label={store.ui.galleryLabel}>
              {store.product.media.map((media, index) => (
                <button key={media.id} type="button" className={mediaIndex === index ? 'is-active' : ''} onClick={() => setMediaIndex(index)} aria-label={`${store.ui.viewImage} ${index + 1}: ${media.title}`} aria-pressed={mediaIndex === index}>
                  <MediaPlaceholder media={media} compact />
                </button>
              ))}
            </div>
          </div>

          <div className="buy-column">
            <div className="breadcrumb"><a href="#top">{store.ui.home}</a><span>/</span><span>{store.ui.breadcrumbCategory}</span></div>
            <div className="eyebrow">{store.product.eyebrow}</div>
            <div className="title-block learn-target" data-learn-id="product-title">
              <h1>{store.product.name}</h1>
              <p className="subtitle">{store.product.subtitle}</p>
              {learnMode && <LearnMarker id="product-title" label={store.ui.markerLabels.title} onOpen={openAnnotation} />}
            </div>
            <a className="rating-summary learn-target" data-learn-id="review-summary" href="#reviews">
              <Stars rating={store.product.rating} /><strong>{store.product.rating}</strong><span>{store.product.reviewCount} {store.ui.exampleReviews}</span>
              {learnMode && <LearnMarker id="review-summary" label={store.ui.markerLabels.proof} onOpen={openAnnotation} />}
            </a>
            <p className="product-description">{store.product.description}</p>

            <div className="price-block learn-target" data-learn-id="price-block" aria-live="polite">
              <strong>{money(selectedBundle.price)}</strong>
              {selectedBundle.compareAtPrice && <><s>{money(selectedBundle.compareAtPrice)}</s><span>{store.ui.save} {money(selectedBundle.compareAtPrice - selectedBundle.price)}</span></>}
              {!selectedBundle.compareAtPrice && selectedBundle.id === 'starter' && <><s>{money(store.product.compareAtPrice)}</s><span>{store.ui.exampleDeal}</span></>}
              {learnMode && <LearnMarker id="price-block" label={store.ui.markerLabels.price} onOpen={openAnnotation} />}
            </div>

            <fieldset className="bundle-selector learn-target" data-learn-id="bundle-selector">
              <legend>{store.ui.chooseSet}</legend>
              {store.product.bundles.map((bundle) => (
                <label key={bundle.id} className={bundleId === bundle.id ? 'is-selected' : ''}>
                  <input type="radio" name="bundle" value={bundle.id} checked={bundleId === bundle.id} onChange={() => setBundleId(bundle.id)} />
                  <span className="radio-dot" />
                  <span className="bundle-copy"><strong>{bundle.label}</strong><small>{bundle.detail}</small></span>
                  <span className="bundle-price"><strong>{money(bundle.price)}</strong>{bundle.badge && <small>{bundle.badge}</small>}</span>
                </label>
              ))}
              {learnMode && <LearnMarker id="bundle-selector" label={store.ui.markerLabels.offer} onOpen={openAnnotation} />}
            </fieldset>

            <div className="purchase-row learn-target" data-learn-id="add-to-cart">
              <div className="quantity" aria-label={store.ui.quantity}>
                <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} aria-label={store.ui.decreaseQuantity}><Icon name="minus" size={18} /></button>
                <span aria-live="polite">{quantity}</span>
                <button type="button" onClick={() => setQuantity(quantity + 1)} aria-label={store.ui.increaseQuantity}><Icon name="plus" size={18} /></button>
              </div>
              <button className="primary-button" type="button" onClick={addToCart}>{store.ui.add} — {money(selectedBundle.price * quantity)} <Icon name="arrow" /></button>
              {learnMode && <LearnMarker id="add-to-cart" label={store.ui.markerLabels.cta} onOpen={openAnnotation} />}
            </div>
            <div className="micro-trust"><span><Icon name="check" size={17} /> {store.ui.shippingTrust}</span><span><Icon name="check" size={17} /> {store.ui.guaranteeTrust}</span></div>

            <div className="benefit-grid learn-target" data-learn-id="benefit-strip">
              {store.product.benefits.map((benefit) => <div key={benefit.title}><Icon name={benefit.icon} /><span><strong>{benefit.title}</strong><small>{benefit.text}</small></span></div>)}
              {learnMode && <LearnMarker id="benefit-strip" label={store.ui.markerLabels.benefits} onOpen={openAnnotation} />}
            </div>
          </div>
        </section>

        <section className="story-section" id="zo-werkt-het">
          <div className="story-intro"><span className="section-number">{store.ui.storySectionLabel}</span><p>{store.story.kicker}</p><h2>{store.story.title}</h2><p className="story-lead">{store.story.intro}</p></div>
          <div className="steps learn-target" data-learn-id="how-it-works">
            {store.story.steps.map((step) => <article key={step.number}><span>{step.number}</span><h3>{step.title}</h3><p>{step.text}</p></article>)}
            {learnMode && <LearnMarker id="how-it-works" label={store.ui.markerLabels.process} onOpen={openAnnotation} />}
          </div>
        </section>

        <section className="included-section" id="in-de-doos">
          <div className="included-image"><MediaPlaceholder media={store.story.includedImage} wide /></div>
          <div className="included-copy"><span className="section-number">{store.ui.includedSectionLabel}</span><h2>{store.ui.includedTitle}</h2><ul>{store.story.included.map((item) => <li key={item}><Icon name="check" />{item}</li>)}</ul><button type="button" className="text-button" onClick={() => { document.querySelector('.bundle-selector').scrollIntoView({ behavior: 'smooth' }); }}>{store.ui.chooseSet} <Icon name="arrow" /></button></div>
        </section>

        <section className="guarantee-section learn-target" data-learn-id="guarantee-block">
          <div className="guarantee-stamp"><span>{store.product.guarantee.days}</span><small>{store.product.guarantee.daysLabel}</small></div>
          <div><span className="section-number">{store.ui.guaranteeSectionLabel}</span><h2>{store.product.guarantee.title}</h2><p>{store.product.guarantee.text}</p></div>
          {learnMode && <LearnMarker id="guarantee-block" label={store.ui.markerLabels.guarantee} onOpen={openAnnotation} />}
        </section>

        <section className="reviews-section learn-target" id="reviews" data-learn-id="reviews-section">
          <div className="reviews-heading"><div><span className="section-number">{store.ui.reviewsSectionLabel}</span><h2>{store.ui.reviewsTitle}</h2></div><div className="score-card"><strong>{store.product.rating}</strong><div><Stars rating={store.product.rating} dark /><span>{store.ui.basedOn} {store.product.reviewCount} {store.ui.exampleReviews}</span></div></div></div>
          <div className="review-carousel" aria-live="polite">
            <button type="button" className="carousel-arrow prev" onClick={() => setReviewIndex((reviewIndex - 1 + store.reviews.length) % store.reviews.length)} aria-label={store.ui.previousReview}>←</button>
            <article className="review-card">
              <div className="review-card__top"><span className="avatar">{store.reviews[reviewIndex].initials}</span><div><strong>{store.reviews[reviewIndex].name}</strong><small><Icon name="check" size={14} /> {store.ui.verifiedExamplePurchase}</small></div><Stars rating={store.reviews[reviewIndex].rating} dark /></div>
              <h3>{store.reviews[reviewIndex].title}</h3><blockquote>“{store.reviews[reviewIndex].quote}”</blockquote>
              <span className="review-count">{String(reviewIndex + 1).padStart(2, '0')} / {String(store.reviews.length).padStart(2, '0')}</span>
            </article>
            <button type="button" className="carousel-arrow next" onClick={() => setReviewIndex((reviewIndex + 1) % store.reviews.length)} aria-label={store.ui.nextReview}>→</button>
          </div>
          {learnMode && <LearnMarker id="reviews-section" label={store.ui.markerLabels.reviews} onOpen={openAnnotation} />}
        </section>

        <section className="faq-section learn-target" id="faq" data-learn-id="faq-section">
          <div className="faq-heading"><span className="section-number">{store.ui.faqSectionLabel}</span><h2>{store.ui.faqTitle}</h2><p>{store.ui.faqIntro}</p></div>
          <div className="faq-list">{store.faqs.map((faq, index) => <Faq key={faq.question} faq={faq} defaultOpen={index === 0} />)}</div>
          {learnMode && <LearnMarker id="faq-section" label={store.ui.markerLabels.faq} onOpen={openAnnotation} />}
        </section>
      </main>

      <footer className="site-footer"><a className="brand brand--footer" href="#top"><span className="brand__mark">{store.brand.logoMark}</span><span className="brand__name">{store.brand.name}</span></a><p>{store.brand.tagline}</p><p className="footer-note">{store.ui.footerNote}</p><a href="/learning.json">{store.ui.learningDataLink}</a></footer>

      <div className="mobile-buy"><div><small>{store.ui.from}</small><strong>{money(selectedBundle.price)}</strong></div><button type="button" onClick={addToCart}>{store.ui.add}</button></div>

      {previewAnnotation && learnMode && !activeAnnotation && <div className="learn-preview" role="status">
        <strong>{previewAnnotation.label}</strong><span>{previewAnnotation.guidance}</span><code>{previewAnnotation.prompt}</code>
      </div>}

      {activeAnnotation && <><button className="overlay" onClick={closeAnnotation} aria-label={store.ui.closeExplanation} /><aside className="learn-panel" ref={panelRef} tabIndex="-1" role="dialog" aria-modal="true" aria-labelledby="learn-title">
        <div className="learn-panel__handle" />
        <div className="learn-panel__header"><div><span>{store.ui.learningLayer} · {activeAnnotation.elementType}</span><h2 id="learn-title">{activeAnnotation.label}</h2></div><button type="button" className="icon-button" onClick={closeAnnotation} aria-label={store.ui.closeExplanation}><Icon name="close" /></button></div>
        <p className="learn-guidance">{activeAnnotation.guidance}</p>
        <div className="checklist"><strong>{store.ui.checkThis}</strong>{activeAnnotation.checklist.map((item) => <span key={item}><Icon name="check" size={16} />{item}</span>)}</div>
        <div className="prompt-card"><div><span>{store.ui.aiPrompt}</span><button type="button" onClick={copyPrompt}><Icon name={copied ? 'check' : 'copy'} size={17} />{copied ? store.ui.copied : store.ui.copy}</button></div><code>{activeAnnotation.prompt}</code></div>
        {activeAnnotation.riskFlags.length > 0 && <div className="risk-note"><strong>{store.ui.attention}</strong><span>{activeAnnotation.riskFlags.join(' · ')}</span></div>}
        <a className="json-link" href="/learning.json" target="_blank" rel="noreferrer">{store.ui.machineJson} <Icon name="arrow" size={17} /></a>
      </aside></>}

      {cartOpen && <><button className="overlay overlay--cart" onClick={closeCart} aria-label={store.ui.closeCart} /><aside className="cart-drawer" ref={cartRef} tabIndex="-1" role="dialog" aria-modal="true" aria-labelledby="cart-title">
        <div className="cart-drawer__header"><div><span>{store.ui.demoCart}</span><h2 id="cart-title">{store.ui.cartTitle}</h2></div><button type="button" className="icon-button" onClick={closeCart} aria-label={store.ui.closeCart}><Icon name="close" /></button></div>
        {!cart ? <div className="empty-cart"><Icon name="cart" size={44} /><h3>{store.ui.emptyCartTitle}</h3><p>{store.ui.emptyCartText}</p><button type="button" className="secondary-button" onClick={closeCart}>{store.ui.continueViewing}</button></div> : <div className="cart-content">
          <div className="cart-product"><MediaPlaceholder media={store.product.media[0]} compact /><div><strong>{cart.bundle.label}</strong><span>{cart.bundle.detail}</span><small>{store.ui.quantity}: {cart.quantity}</small></div><strong>{money(cart.total)}</strong></div>
          <div className="cart-summary"><span>{store.ui.shipping} <strong>{store.ui.free}</strong></span><span>{store.ui.total} <strong>{money(cart.total)}</strong></span></div>
          <p className="demo-disclosure"><Icon name="info" /> {store.ui.demoDisclosure}</p>
          <button type="button" className="primary-button checkout-button" onClick={demoCheckout}>{store.ui.finishDemo} <Icon name="arrow" /></button>
          <button type="button" className="remove-button" onClick={() => setCart(null)}>{store.ui.removeDemo}</button>
        </div>}
      </aside></>}

      {notice && <div className="toast" role="status"><Icon name="check" />{notice}</div>}
    </div>
  );
}

function Faq({ faq, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen);
  return <article className={open ? 'is-open' : ''}><h3><button type="button" onClick={() => setOpen(!open)} aria-expanded={open}>{faq.question}<Icon name="chevron" /></button></h3>{open && <p>{faq.answer}</p>}</article>;
}

export default App;
