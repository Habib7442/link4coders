# Link4Coders

**The developer portfolio that speaks for you.**

Link4Coders is a SaaS platform that helps developers create beautiful, customizable, one-page portfolios — with a major twist: every portfolio can include an AI-powered voice assistant that answers recruiter questions, performs mock interviews, and helps build the portfolio by voice.

---

## ⚡ Quick overview

* **Website:** Link4Coders — shareable, single-page developer portfolios
* **Core value:** Fast portfolio creation + developer-first templates + AI voice interactions
* **Audience:** Developers, students, open-source contributors, hackathon teams, and recruiters

---

## 🚀 Key features

* **Profile creation:** GitHub / Google / Email sign-up, bio, avatar, social links, projects, achievements
* **Templates:** Free + Premium templates (minimalist, terminal, cyberpunk, animated, event-themed)
* **Template marketplace:** Community templates with revenue sharing (creator-friendly)
* **Voice Assistant (AI):** VAPI-powered assistant per portfolio — answers questions, speaks project details, multi-language support
* **Voice-to-portfolio:** Build your portfolio by talking to an onboarding assistant
* **Recruiter voice notes:** Recruiters can leave short voice messages (recorded + transcribed)
* **AI tools:** Resume generator (from GitHub), project description writer, portfolio optimizer, skill gap analyzer, cover letter generator
* **Interview practice:** AI voice mock interviews with feedback and scoring
* **Analytics:** Profile views, link clicks, voice session metrics (Pro/Premium)

---

## 🎯 Why Link4Coders?

* **Unique:** First mover advantage with voice-enabled portfolios.
* **Recruiter-friendly:** Speech-based discovery speeds initial screening and increases engagement.
* **Developer-first:** Templates and AI tools are tuned for developer workflows (GitHub integration, code-focused resumes).
* **Viral:** Shareable preview cards, template voting, "Dev Wrapped" summaries.

---

## 🧭 Tech stack (MVP)

* **Frontend:** Next.js + TailwindCSS
* **Backend:** Supabase (Auth + DB) or Convex
* **DB:** PostgreSQL (Supabase)
* **Voice AI:** VAPI (voice assistant, recording, transcription)
* **Text AI:** OpenAI / Anthropic for text features (resume, descriptions)
* **Hosting:** Vercel (frontend) + Supabase
* **Payments:** Stripe

---

## 📦 Quickstart (developer)

> This assumes you have Node.js, pnpm/npm, and a Supabase project (or Convex) ready.

1. **Clone**

```bash
git clone https://github.com/yourorg/link4coders.git
cd link4coders
```

2. **Install**

```bash
pnpm install
# or
npm install
```

3. **Configure environment**

Copy `.env.example` to `.env.local` and set the following at minimum:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anonymous_key
DATABASE_URL=postgres://...
NEXT_PUBLIC_VAPI_KEY=your_public_vapi_key
VAPI_SECRET=your_vapi_secret
OPENAI_API_KEY=your_openai_api_key
STRIPE_SECRET_KEY=your_stripe_secret
```

4. **Run dev server**

```bash
pnpm dev
# or
npm run dev
```

5. **Run migrations / seed (Supabase / Prisma / chosen DB)**

```bash
# Example with Prisma
pnpm prisma migrate dev
pnpm prisma db seed
```

6. **Open** `http://localhost:3000`

---

## 🧩 Architecture overview

* **Client (Next.js)** — UI, template renderer, voice widget, public profile pages
* **API (Serverless / Next API)** — Auth, template management, AI orchestration, webhook handlers
* **VAPI** — Voice assistant instances per user; call handling for recruiter messages and voice onboarding
* **AI Services** — OpenAI/Anthropic for text generation; caching for common outputs
* **Payments** — Stripe webhooks for subscription lifecycle
* **DB** — Users, profiles, templates, AI artifacts (resume versions, transcripts, voice-messages metadata)

---

## 🔒 Security & compliance

* HTTPS/TLS everywhere
* OAuth for Google & GitHub
* GDPR/CCPA: Data export & deletion endpoints
* Payment PCI compliance via Stripe
* Encrypted sensitive fields and RBAC for template marketplace moderation

---

## 💸 Pricing & monetization (summary)

* **Free Plan:** Basic templates, footer branding, 5 voice conversations/month, resume (1/month)
* **Pro Plan:** $9/month — unlimited voice conversations, premium templates, custom domain, analytics
* **Premium Plan:** $29/month — voice cloning, priority processing, advanced analytics, unlimited recruiter notes
* **Marketplace:** Template creators keep **80%** revenue

---

## 🗺️ Roadmap (high-level)

* **MVP (0–2 months):** Core profiles, 3 templates, GitHub login
* **Premium (2–4 months):** Stripe, premium templates, analytics, custom domains
* **AI Rollout (4–8 months):** Voice assistant, voice-to-portfolio, resume generator
* **Marketplace & Community (8–12 months):** Template marketplace, voting, hackathon features

---

## 🛠️ Developer & contributor notes

* Follow the branching and commit message guidelines in `CONTRIBUTING.md`.
* Use feature flags for AI rollouts (e.g., `feature.voiceAssistant`).
* Keep token usage limits and caching in mind when integrating OpenAI / VAPI.

---

## 📣 Contributing

Contributions are welcome. Open issues for bugs/features and follow the contribution guidelines. If you're submitting templates to the marketplace, read `TEMPLATE_GUIDELINES.md`.

---

## 📄 License

This repository is available under the **MIT License**. See `LICENSE` for details.

---

## 🙋 Need help?

Join our Discord (link in project site) or open an issue. For security reports, email `security@link4coders.in`.

---

*Made with ❤️ by Habib Tanwir.*
