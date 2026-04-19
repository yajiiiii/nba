function escapeHtml(input: string) {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const matchup = escapeHtml(searchParams.get("matchup") ?? "NBA Demo Feed");
  const label = escapeHtml(searchParams.get("label") ?? "Licensed Demo Feed");

  const html = `<!doctype html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>${matchup}</title>
      <style>
        :root { color-scheme: dark; }
        * { box-sizing: border-box; }
        body {
          margin: 0;
          min-height: 100vh;
          display: grid;
          place-items: center;
          font-family: Arial, Helvetica, sans-serif;
          background:
            radial-gradient(circle at top, rgba(225,29,46,0.2), transparent 35%),
            linear-gradient(160deg, #050505, #0d0d0d 58%, #090909);
          color: #f5f5f5;
        }
        .frame {
          width: min(92vw, 960px);
          aspect-ratio: 16 / 9;
          border-radius: 32px;
          border: 1px solid rgba(255,255,255,0.1);
          background:
            linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02)),
            radial-gradient(circle at top right, rgba(244,63,94,0.22), transparent 24%);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 32px;
          box-shadow: 0 24px 80px rgba(0,0,0,0.35);
        }
        .eyebrow {
          letter-spacing: 0.22em;
          text-transform: uppercase;
          font-size: 12px;
          color: #a3a3a3;
        }
        h1 {
          margin: 0;
          font-size: clamp(40px, 7vw, 84px);
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        p {
          margin: 0;
          max-width: 56ch;
          color: #d4d4d4;
          line-height: 1.6;
        }
        .pill {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          border-radius: 999px;
          padding: 12px 18px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.08);
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.18em;
        }
        .dot {
          width: 10px;
          height: 10px;
          border-radius: 999px;
          background: #22c55e;
          box-shadow: 0 0 20px rgba(34,197,94,0.65);
        }
      </style>
    </head>
    <body>
      <div class="frame">
        <div>
          <div class="eyebrow">${label}</div>
          <h1>${matchup}</h1>
        </div>
        <p>
          This is a first-party demo embed surface included with the app so the
          player can be exercised without depending on any scraped or unauthorized
          third-party source.
        </p>
        <div class="pill"><span class="dot"></span> Demo embed active</div>
      </div>
    </body>
  </html>`;

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  });
}
