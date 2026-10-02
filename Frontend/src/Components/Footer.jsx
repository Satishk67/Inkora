function Footer() {
  return (
    <>
      <footer id="about">
        <div>
          <a href="/" className="logo">
            <div className="logo-icon">I</div>
            INKORA
          </a>

          <p className="footer-tagline">Where ideas find their voice.</p>
        </div>

        <ul className="footer-links">
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/blog">Stories</a>
          </li>
          <li>
            <a href="/blog/create">Write</a>
          </li>
        </ul>

        <p className="footer-right">
          © 2026 INKORA. Built for thinkers and storytellers.
        </p>
      </footer>
    </>
  );
}

export default Footer;
