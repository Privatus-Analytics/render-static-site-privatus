# Static site for Render, with Privatus Analytics

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/Privatus-Analytics/render-static-site-privatus)

**A small website you can put online in two minutes, for free. It already
counts its visitors, with no cookies and no cookie pop-up.**

## The problem

You put a new site online and want to know if anyone visits it. The usual
tools make that hard. Google Analytics is slow to set up and confusing to
read. It sends what your visitors do to Google. In many countries it also
means showing a cookie pop-up (the box that asks visitors to accept
cookies), and many people click "reject", so you never see them. Bots fill
up the numbers that are left.

## The solution

This template is a plain website that Render hosts for free. When Render
builds it, a small script from
[Privatus Analytics](https://privatusanalytics.com) goes into every page.
That script counts visits without cookies and never stores IP addresses.
Bots are filtered out before they are counted. You give Render your site id
once, and that is all.

## What you get

- **You see who visits, from day one.** Visitors, top pages and where people
  came from, on one screen you understand in seconds.
- **No cookie pop-up needed for our analytics.** We set no cookies and store
  no personal data. Laws differ by country, so check your own legal advice.
- **Honest numbers.** Known bots and fake traffic are left out on every plan.
- **A fast site.** Plain HTML and CSS, served from Render's network. The
  tracking script is about 3 KB.
- **Free to start.** Render hosts static sites for free. Privatus Analytics
  has a Free plan with 10,000 events a month and 3 sites, with no card.

## Deploy it

1. [Create a Privatus Analytics account](https://privatusanalytics.com) and
   add a site. Copy its site id. It starts with `pa_`, and you find it under
   Site settings, Tracking.
2. Click **Deploy to Render** above. Render shows the site it will make.
3. Paste your site id into **PRIVATUS_SITE_ID** and click **Deploy
   Blueprint**.
4. When the build is done, Render gives your site an address like
   `https://my-site-with-privatus-analytics.onrender.com`. In Privatus
   Analytics, add that hostname under Site settings, General, **Additional
   domains** (or use it as the site's domain). Visits from a hostname that
   is not on the site are not counted.
5. Open your site, then open your Privatus Analytics dashboard. You show up
   in the live view within a few seconds.

## Make it your own site

The Deploy button builds this repository as it is. To change the pages:

1. Click **Use this template** on GitHub to get your own copy.
2. In Render, choose **New**, then **Blueprint**, and pick your copy. Render
   reads `render.yaml` and asks for your site id again.
3. In `render.yaml`, change `autoDeployTrigger` from `"off"` to `commit`, so
   each push to your copy goes online by itself.

Pages live in `src/`. Each page needs this line in its `<head>`:

```html
<!-- privatus-analytics -->
```

The build swaps it for the tracking script:

```html
<script defer src="https://privatusstats.com/js/pa.js" data-site="pa_YOURSITEID" data-modules="engage,auto,vitals,clicks,ask"></script>
```

## Settings

Both are environment variables on the Render service (Environment tab).
Change one, then deploy again so the pages are rebuilt.

| Variable | What it does |
|---|---|
| `PRIVATUS_SITE_ID` | Your site id, like `pa_7Q2K9XH3AB`. Without a valid one the site still builds, with no script. |
| `PRIVATUS_MODULES` | Extra tracker features, split by commas. `engage` is time on page and scroll depth, `auto` is downloads, outside links and forms, `vitals` is page speed, `clicks` is click maps and `ask` is on-site surveys. The default is all five. See [modules](https://privatusanalytics.com/docs/tracker/modules). |

## Try it on your computer

You need Node.js 18 or later. Nothing else is installed.

```sh
PRIVATUS_SITE_ID=pa_YOURSITEID npm run build
npm start
# open http://localhost:8080
```

The script loads, but visits from `localhost` are not counted, so your own
testing stays out of your reports. See
[debug mode](https://privatusanalytics.com/docs/tracker/debug) to watch the
hits in the browser console instead.

Run the tests with `npm test`.

## Privacy

Your visitors' browsers send page views straight to Privatus Analytics.
Render and your site send nothing. The script sets no cookies and stores
nothing in the browser. See the
[privacy documentation](https://privatusanalytics.com/docs/privacy) for what
is collected.

If you have a privacy policy, you can paste this:

> This website uses [Privatus Analytics](https://privatusanalytics.com/privacy-analytics)
> to count visits. It does not use cookies and does not follow you from one
> website to another. Your IP address is used for a moment to count visits and
> is never stored.

## License

MIT. See [LICENSE](LICENSE). Privatus Analytics is a product of Two Phase LLC,
Wyoming, USA.
