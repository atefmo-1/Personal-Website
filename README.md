# atef-mohamed-site

Personal site. Next.js 14 (App Router) + TypeScript + Tailwind + Framer Motion. Light and dark themes (follows the OS; the nav button overrides it and remembers the choice).

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (also type-checks + lints)
```

## Pages

Five routes share one root layout (`app/layout.tsx`: nav + footer): `/` (hero, story, experience, education), `/about` (hobbies, communities, route map with states visited), `/experience` (Work & Experience: work bio, roles with company links, skills), `/projects`, `/contact`. `/skills` redirects to the skills block.

## Edit content (no layout code needed)

| What | File |
| --- | --- |
| Name, email, LinkedIn, GitHub, hero copy, story, education, About page (hobbies, communities, route stops, US states visited), route stops | `lib/site.ts`. Hobby and city icons come from [Tabler Icons](https://tabler.io/icons) (`@tabler/icons-react`) |
| Roles (company, link, one-liner, role, dates, location) and the work bio | `lib/experience.ts` |
| Project cards, the intro line, and project pages (`caseStudy`) | `lib/projects.ts`. Add a `caseStudy` to any project and it gets a page at `/projects/<slug>` |
| Skills & tools on the Work & Experience page | `lib/skills.ts`. Icons come from [Simple Icons](https://simpleicons.org): import `siSomething` from `simple-icons` and set `icon` |
| Nav order | `lib/pages.ts` |
| Portrait | `public/portrait.webp` |
| Resume PDF | `public/resume.pdf`, replace the file, keep the name |
| Colors (both themes) | `app/globals.css`, the `--bg` / `--fg` / … variables |

### Project images

Reloco's images in `public/projects/reloco/` are real screens: `cover.webp` is the live landing page, and each feature image is a phone screenshot of the app (run locally in demo mode with a sample student) framed on one of Reloco's own paintings. `card.webp` is three of those phones on a transparent background for the Projects card.

For a new project, give it the same pieces in `lib/projects.ts`: a live link, meta, a few checkable numbers, real screens, product and engineering decisions, and the stack. The comment at the top of that file lists the order.

## Contact form

The form on `/contact` posts to `app/api/contact/route.ts`, which emails you through [Resend](https://resend.com) (free tier is plenty).

1. Sign up at resend.com **with the email you want messages delivered to** and create an API key.
2. In Vercel, go to Project, Settings, Environment Variables, and add `RESEND_API_KEY`. Redeploy.
3. For local testing, copy `.env.example` to `.env.local` and fill in the key.

Replies go straight to the sender (the email sets `reply_to`). Without a key, the form tells visitors to use their email app instead and pre-fills the message for them. To send from your own domain later, verify it in Resend and set `CONTACT_FROM_EMAIL`.

## Deploy (Vercel)

Push this folder to a GitHub repo, import it at vercel.com/new, accept the defaults. Add a custom domain under Project → Settings → Domains whenever you buy one. The footer's "Updated" stamp refreshes on every deploy.
