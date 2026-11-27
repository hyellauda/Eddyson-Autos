# Customer account setup

1. In `supabase.js`, replace `https://YOUR-PROJECT-REF.supabase.co` with the project URL shown in **Supabase Dashboard → Settings → API**. The generic `https://supabase.co` host is not a project URL.
2. Set `SUPABASE_PUBLISHABLE_KEY` in the same file to the project's publishable key. This browser-side key is intended for public use; never put a service-role key or a user's password in the site.
3. Run `admin-access.sql` in the Supabase SQL Editor. It creates or repairs the `profiles`, `cars`, and `inquiries` schemas, applies their row-level security policies, and installs the profile-on-signup trigger. `profiles.sql` is the earlier profile-only setup and is no longer needed for a new setup.
4. Configure the Supabase Auth site's **Site URL** and allowed redirect URLs for the deployed site. The sign-up flow requests email confirmation when that setting is enabled.
5. Serve the static site over HTTP/HTTPS (for example with any static file server). Browser ES modules do not load reliably from a `file://` URL.

The customer account page is `auth.html`. The existing HTML pages load the shared `supabase.js` module to show the signed-in customer's name and a sign-out control.

## Supabase data map

- Signup uses Supabase Auth's `auth.users` record. The submitted email and password go to Auth; `full_name` and `phone` are stored as Auth user metadata. The `public.profiles` trigger and `saveProfile` upsert write `id`, `full_name`, `phone`, and `email`. Profile reads use `id`, `full_name`, `phone`, and `email`.
- The contact and parts forms insert into `public.inquiries` using `full_name`, `phone`, `email`, `message`, `enquiry_type`, and `enquiry_status`. The database supplies `id` and `created_at`. Admin enquiry queries read `id`, `full_name`, `phone`, `email`, `created_at`, `message`, and `enquiry_status`; status updates set `enquiry_status` and filter by `id`.
- The admin overview reads `public.profiles`, `public.cars`, and `public.inquiries` with `select('*')`. There is no website code that inserts or updates `public.cars`; its minimal schema contains `id`.
- Make.com receives exactly `full_name`, `email`, `phone`, `message`, and `eventType`. Signup messages use `New account signup`; enquiry messages use the saved enquiry message. These are webhook fields, not database columns.

## Make.com webhook

1. The Make.com webhook URL is stored as `MAKE_WEBHOOK_URL` in the ignored root `.env` file. Keep `.env` private and never put this URL in browser code.
2. Deploy `supabase/functions/make-webhook` to the same Supabase project. For local testing, run `supabase functions serve make-webhook --env-file .env`. For a deployed function, run `supabase secrets set --env-file .env --project-ref siyuiswtwfjzhixrrkyi`, then `supabase functions deploy make-webhook --project-ref siyuiswtwfjzhixrrkyi`.
3. After Supabase confirms a signup profile or inquiry insert, the site queues exactly one event to the Edge Function. Signup payloads use `eventType: "signup"` and `message: "New account signup"`; inquiries use `eventType: "enquiry"` and the same normalized message/details stored in `public.inquiries`. Both payloads contain exactly `full_name`, `email`, `phone`, `message`, and `eventType`. Passwords and other database fields are not sent. Make.com delivery runs asynchronously with an eight-second timeout; delivery failures are logged and do not change the customer's successful submission.
4. In Make.com, add routes for `eventType = signup` and `eventType = enquiry`, then connect them to your email, SMS and WhatsApp provider modules if needed. The website only queues events; it does not configure or send through those external providers.

## Admin dashboard

1. Configure the project URL and publishable key in `supabase.js`. `https://supabase.co` is a generic host, not a project URL; use the project-specific URL from **Settings → API**.
2. Create or invite only `hyellaudaedward@gmail.com` and `eddygsk2018@gmail.com` as administrator users in Supabase Auth. `admin.html` does not provide sign-up, checks this allowlist before showing data, and signs out other accounts. Keep email confirmation enabled.
3. Run `admin-access.sql` in the Supabase SQL Editor. It is rerunnable, creates missing tables, adds missing fields including `public.inquiries.email`, and configures RLS for public inquiry submissions and administrator-only inquiry management. If a legacy `customer_name` column exists, it copies its values into `full_name` and removes its required constraint. Existing nonstandard profile rows with a missing `id` must be associated with their Auth user UUID before the migration can complete.
4. Open `admin.html` over HTTP/HTTPS and sign in with an authorized admin account. The **Customer Enquiries** page reads website submissions from `public.inquiries`, supports server-side search and pagination, and lets authorized admins set status to New, In progress or Resolved. RLS remains the database access control; the page's email check is not a substitute for database policies.
5. The homepage contact form and spare-parts enquiry form now save directly to `public.inquiries`; they do not redirect form data to WhatsApp. Customer account registrations are stored separately in `public.profiles`.
