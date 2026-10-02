function LoadingPage(){
    return (
    <main className="loading-page" aria-live="polite" aria-busy="true">
        <div className="loading-noise" aria-hidden="true"></div>
        <div className="loading-orbit loading-orbit-one" aria-hidden="true"></div>
        <div className="loading-orbit loading-orbit-two" aria-hidden="true"></div>

        <section className="loading-content">
            <div className="loading-mark" aria-hidden="true">
                <span className="loading-mark-letter">I</span>
                <span className="loading-mark-ring loading-mark-ring-one"></span>
                <span className="loading-mark-ring loading-mark-ring-two"></span>
            </div>

            <p className="loading-kicker">INKORA / YOUR READING ROOM</p>
            <h1 className="loading-title">Making space<br /><em>for good stories.</em></h1>
            <p className="loading-status">Gathering the latest pages<span className="loading-dots" aria-hidden="true">...</span></p>

            <div className="loading-progress" role="progressbar" aria-label="Loading content">
                <span className="loading-progress-bar"></span>
            </div>
        </section>

        <p className="loading-footer">Stay curious <span aria-hidden="true">·</span> Stay awhile</p>
    </main>
    )
}

export default LoadingPage;