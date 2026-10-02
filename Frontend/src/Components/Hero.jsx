function Hero () {
    return (
    <>
    
    <section className="hero" id="home">

    {/* FLOATING ORBS */}
    <div className="hero-orb hero-orb--purple"></div>
    <div className="hero-orb hero-orb--blue"></div>

    {/* PARTICLE CANVAS */}
    <canvas className="hero-canvas" id="particleCanvas"></canvas>


    <div className="hero-content">

        <div className="hero-tag">
            <span className="tag-dot"></span>
            A new home for curious minds
        </div>


        <h1>
            Where ideas
            <br/>
            find their
            <span className="gradient-text">voice.</span>
        </h1>


        <p>
            Discover stories, ideas and perspectives
            from people who have something meaningful
            to say.
        </p>


        <div className="hero-buttons">

            <a href="/blog">
                <button className="primary-btn">
                    Start Reading →
                </button>
            </a>

            <a href="/blog/create">
                <button className="secondary-btn">
                    ✍ Start Writing
                </button>
            </a>

        </div>

    </div>

</section>

    </>
    )
}

export default Hero;