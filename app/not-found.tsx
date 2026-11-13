export default function NotFound() {
  return (
    <main className="wrap" style={{ padding: "64px 16px" }}>
      <p className="kicker">Kitui 2027</p>
      <h1 className="h2" style={{ marginTop: 8 }}>This page is not on the site</h1>
      <p className="lede" style={{ marginTop: 12 }}>Everything is on one page now: the data, the analysis, the objectives, the strategies and the plan.</p>
      <p style={{ marginTop: 20 }}>{/* eslint-disable-next-line @next/next/no-html-link-for-pages -- a plain link keeps this page free of router code */}
        <a className="btn btn-solid" href="/">Go to the site</a></p>
    </main>
  );
}
