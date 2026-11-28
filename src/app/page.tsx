import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

interface SchoolSettings {
  id: number;
  school_name: string | null;
  subtitle: string | null;
  school_code: string | null;
  address: string | null;
  school_logo_url: string | null;
  sef_logo_url: string | null;
  hero_image_url: string | null;
  hero_heading: string | null;
  hero_subtitle: string | null;
  about_summary: string | null;
  school_history: string | null;
  total_students: number | null;
  total_teachers: number | null;
  total_sessions: number | null;
  completed_projects: number | null;
  total_achievements: number | null;
  official_email: string | null;
  contact_phone: string | null;
  facebook_url: string | null;
  youtube_url: string | null;
}

const FALLBACK_SETTINGS: SchoolSettings = {
  id: 1,
  school_name: "Shah Latif Model Secondary School Thikratho",
  subtitle: "Supported by Sindh Education Foundation",
  school_code: "340102001",
  address: "Thikratho, Taluka Pano Akil, District Sukkur, Sindh, Pakistan.",
  school_logo_url: null,
  sef_logo_url: "/logos/sef-logo.png",
  hero_image_url: "/images/school-building.jpg",
  hero_heading:
    "Welcome to Shah Latif Model Secondary School Thikratho",
  hero_subtitle:
    "Empowering Students Through Quality Education, Innovation and Excellence.",
  about_summary:
    "Dedicated to nurturing confident, disciplined, and capable learners in Thikratho with strong academic foundations, STEAM & project-based learning, and moral values.",
  school_history:
    "Serving students across Taluka Pano Akil, District Sukkur in partnership with the Sindh Education Foundation, building lasting educational milestones session after session.",
  total_students: 650,
  total_teachers: 24,
  total_sessions: 10,
  completed_projects: 35,
  total_achievements: 48,
  official_email: null,
  contact_phone: null,
  facebook_url: null,
  youtube_url: null,
};

async function getLandingData() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return {
      settings: FALLBACK_SETTINGS,
      partner: null as any,
      activeSession: null as any,
      projects: [] as any[],
      announcements: [] as any[],
      gallery: [] as any[],
    };
  }

  try {
    const supabase = createClient(url, anonKey, {
      auth: { persistSession: false },
    });

    const [setRes, partRes, sessRes, projRes, annRes, galRes] =
      await Promise.all([
        supabase.from("school_settings").select("*").eq("id", 1).single(),
        supabase.from("school_partner").select("*").eq("id", 1).single(),
        supabase
          .from("academic_sessions")
          .select("*")
          .order("start_year", { ascending: false }),
        supabase
          .from("projects")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(6),
        supabase
          .from("announcements")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(4),
        supabase
          .from("gallery_images")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(6),
      ]);

    const sessionsList = sessRes.data || [];
    const activeSession =
      sessionsList.find((s: any) => s.is_active) || sessionsList[0] || null;

    return {
      settings: {
        ...FALLBACK_SETTINGS,
        ...(setRes.data || {}),
      },
      partner: partRes.data || null,
      activeSession,
      projects: projRes.data || [],
      announcements: annRes.data || [],
      gallery: galRes.data || [],
    };
  } catch {
    return {
      settings: FALLBACK_SETTINGS,
      partner: null as any,
      activeSession: null as any,
      projects: [] as any[],
      announcements: [] as any[],
      gallery: [] as any[],
    };
  }
}

export default async function HomePage() {
  const {
    settings,
    partner,
    activeSession,
    projects,
    announcements,
    gallery,
  } = await getLandingData();

  const schoolName =
    settings.school_name?.trim() || FALLBACK_SETTINGS.school_name!;
  const subtitle =
    settings.subtitle?.trim() || FALLBACK_SETTINGS.subtitle!;
  const schoolCode = settings.school_code?.trim() || "340102001";
  const address = settings.address?.trim() || FALLBACK_SETTINGS.address!;
  const heroHeading =
    settings.hero_heading?.trim() || FALLBACK_SETTINGS.hero_heading!;
  const heroSubtitle =
    settings.hero_subtitle?.trim() || FALLBACK_SETTINGS.hero_subtitle!;
  const bgImage =
    settings.hero_image_url?.trim() || "/images/school-building.jpg";
  const schoolLogo = settings.school_logo_url?.trim() || null;
  const sefLogo = settings.sef_logo_url?.trim() || "/logos/sef-logo.png";

  const stats = [
    {
      label: "Total Students",
      value: settings.total_students ?? 0,
      cardClass:
        "from-emerald-500/20 to-teal-500/10 border-emerald-400/30 text-emerald-300",
    },
    {
      label: "Total Teachers",
      value: settings.total_teachers ?? 0,
      cardClass:
        "from-amber-500/20 to-yellow-500/10 border-amber-400/30 text-amber-300",
    },
    {
      label: "Academic Sessions",
      value: settings.total_sessions ?? 0,
      cardClass:
        "from-sky-500/20 to-cyan-500/10 border-sky-400/30 text-sky-300",
    },
    {
      label: "Completed Projects",
      value: settings.completed_projects ?? 0,
      cardClass:
        "from-violet-500/20 to-indigo-500/10 border-violet-400/30 text-violet-300",
    },
    {
      label: "Total Achievements",
      value: settings.total_achievements ?? 0,
      cardClass:
        "from-rose-500/20 to-orange-500/10 border-rose-400/30 text-rose-300",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-amber-400 selection:text-slate-950">
      {/* Header (Clean Public Navigation - No Admin Link) */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3 min-w-0">
            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-300 via-amber-400 to-emerald-500 p-[2px] shadow-lg">
              <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-[14px] bg-slate-900">
                {schoolLogo ? (
                  <img
                    src={schoolLogo}
                    alt={`${schoolName} Logo`}
                    className="h-full w-full object-contain p-1"
                  />
                ) : (
                  <span className="text-xs font-black tracking-wider text-amber-300">
                    SLMSST
                  </span>
                )}
              </div>
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-white sm:text-base">
                {schoolName}
              </p>
              <p className="truncate text-xs text-emerald-300/90">
                {subtitle} • Code: {schoolCode}
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-300 lg:flex">
            <a href="#stats" className="transition hover:text-amber-300">
              Highlights
            </a>
            <a href="#about" className="transition hover:text-amber-300">
              About & Leadership
            </a>
            {projects.length > 0 && (
              <a href="#projects" className="transition hover:text-amber-300">
                Projects
              </a>
            )}
            {gallery.length > 0 && (
              <a href="#gallery" className="transition hover:text-amber-300">
                Gallery
              </a>
            )}
            <a href="#contact" className="transition hover:text-amber-300">
              Contact
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section with School Building Background & Emblem */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div
          aria-hidden="true"
          className="absolute inset-0 scale-105 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url("${bgImage}")` }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-slate-950/75 to-slate-950"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.22),transparent_55%),radial-gradient(circle_at_bottom_left,rgba(245,158,11,0.18),transparent_50%)]"
        />

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7 space-y-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-1.5 text-xs font-semibold text-amber-300">
                  School Code: {schoolCode}
                </span>
                {activeSession?.title && (
                  <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-300">
                    Active Session: {activeSession.title}
                  </span>
                )}
              </div>

              <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-[3.25rem] lg:leading-[1.12]">
                {heroHeading}
              </h1>

              <p className="max-w-2xl text-base leading-relaxed text-slate-200/90 sm:text-lg">
                {heroSubtitle}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href="#stats"
                  className="rounded-xl bg-gradient-to-r from-amber-400 to-amber-300 px-6 py-3 text-sm font-bold text-slate-950 shadow-lg transition hover:brightness-105"
                >
                  Explore School Records
                </a>
                <a
                  href="#contact"
                  className="rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/10"
                >
                  Campus Location
                </a>
              </div>
            </div>

            {/* Signature Institutional Emblem Card */}
            <div className="lg:col-span-5">
              <div className="rounded-3xl border border-white/15 bg-slate-900/80 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-5 flex h-36 w-36 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-400 via-amber-300 to-amber-500 p-[3px] shadow-[0_0_45px_rgba(245,158,11,0.28)]">
                    <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-slate-950 p-3">
                      {schoolLogo ? (
                        <img
                          src={schoolLogo}
                          alt={schoolName}
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <span className="text-2xl font-black tracking-wider text-amber-300">
                          SLMSST
                        </span>
                      )}
                    </div>
                  </div>

                  <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-emerald-300">
                    Official School Crest
                  </span>

                  <h2 className="mt-3 text-lg font-bold text-white">
                    {schoolName}
                  </h2>
                  <p className="mt-1 text-xs text-slate-400">{address}</p>

                  {sefLogo && (
                    <div className="mt-6 flex w-full items-center justify-between gap-3 rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3">
                      <div className="text-left">
                        <p className="text-[11px] uppercase tracking-wider text-slate-400">
                          Supported By
                        </p>
                        <p className="text-xs font-semibold text-slate-200">
                          {subtitle}
                        </p>
                      </div>
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white p-1">
                        <img
                          src={sefLogo}
                          alt="Sindh Education Foundation Logo"
                          className="h-full w-full object-contain"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Statistics */}
      <section
        id="stats"
        className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Live School Statistics
            </p>
            <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              Academic & Campus Overview
            </h2>
          </div>
          <p className="text-sm text-slate-400">
            Synchronized directly from school records.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {stats.map((item) => (
            <div
              key={item.label}
              className={`rounded-2xl border bg-gradient-to-br p-6 transition hover:-translate-y-0.5 ${item.cardClass}`}
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                {item.label}
              </p>
              <p className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
                {item.value.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Latest Announcements (If any exist) */}
      {announcements.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-amber-400/20 bg-amber-400/5 p-6 sm:p-8">
            <h2 className="text-xl font-bold text-amber-300">
              Latest School Notices & Announcements
            </h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {announcements.map((a: any) => (
                <div
                  key={a.id}
                  className="rounded-2xl border border-white/10 bg-slate-900/80 p-4"
                >
                  <div className="flex items-center justify-between gap-2 text-xs text-slate-400">
                    <span className="font-semibold text-emerald-300">
                      {a.category || "Notice"}
                    </span>
                    <span>{a.publish_date || ""}</span>
                  </div>
                  <h3 className="mt-1.5 text-base font-bold text-white">
                    {a.title}
                  </h3>
                  {a.description && (
                    <p className="mt-1.5 text-sm text-slate-300">
                      {a.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* About, History & School Partner */}
      <section
        id="about"
        className="border-y border-white/10 bg-slate-900/40 py-16"
      >
        <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-7">
              <h3 className="text-xl font-bold text-white">About Our School</h3>
              <p className="mt-3 leading-relaxed text-slate-300">
                {settings.about_summary?.trim() ||
                  FALLBACK_SETTINGS.about_summary}
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-7">
              <h3 className="text-xl font-bold text-white">
                Journey & History
              </h3>
              <p className="mt-3 leading-relaxed text-slate-300">
                {settings.school_history?.trim() ||
                  FALLBACK_SETTINGS.school_history}
              </p>
            </div>
          </div>

          {partner && (partner.full_name || partner.introduction) && (
            <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-7">
              <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
                {partner.photo_url && (
                  <img
                    src={partner.photo_url}
                    alt={partner.full_name || "School Partner"}
                    className="h-24 w-24 shrink-0 rounded-2xl border border-amber-400/30 object-cover"
                  />
                )}
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    School Partner & Vision
                  </span>
                  <h3 className="mt-1 text-xl font-bold text-white">
                    {partner.full_name || "Muhammad Hassan Mangi"}
                  </h3>
                  {partner.introduction && (
                    <p className="mt-2 text-sm leading-relaxed text-slate-300">
                      {partner.introduction}
                    </p>
                  )}
                  {partner.educational_vision && (
                    <p className="mt-2 text-sm italic text-emerald-300/90">
                      “{partner.educational_vision}”
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Featured Projects */}
      {projects.length > 0 && (
        <section
          id="projects"
          className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
        >
          <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            Student & School Projects
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p: any) => (
              <div
                key={p.id}
                className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80"
              >
                {p.cover_image_url && (
                  <img
                    src={p.cover_image_url}
                    alt={p.title}
                    className="h-44 w-full object-cover"
                  />
                )}
                <div className="p-5">
                  <span className="text-xs font-semibold text-amber-300">
                    {p.category || "Project"}
                  </span>
                  <h3 className="mt-1 text-lg font-bold text-white">
                    {p.title}
                  </h3>
                  {p.description && (
                          <p className="mt-2 line-clamp-3 text-sm text-slate-300">
                      {p.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Gallery Preview */}
      {gallery.length > 0 && (
        <section
          id="gallery"
          className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8"
        >
          <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            Campus Photo Gallery
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {gallery.map((g: any) => (
              <div
                key={g.id}
                className="group overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80"
              >
                <img
                  src={g.image_url}
                  alt={g.title}
                  className="h-52 w-full object-cover transition duration-300 group-hover:scale-105"
                />
                <div className="p-4">
                  <p className="text-sm font-bold text-white">{g.title}</p>
                  <p className="text-xs text-slate-400">{g.category}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Footer (Clean Public Footer - No Admin Link) */}
      <footer
        id="contact"
        className="border-t border-white/10 bg-slate-950 px-4 py-12 sm:px-6 lg:px-8"
      >
        <div className="mx-auto grid max-w-7xl gap-8 rounded-3xl border border-white/10 bg-slate-900/70 p-6 sm:p-8 md:grid-cols-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Campus Address
            </p>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">
              {address}
            </p>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-amber-400">
              School Identity
            </p>
            <p className="mt-2 text-sm text-slate-300">{schoolName}</p>
            <p className="mt-1 text-xs text-slate-400">
              School Code: {schoolCode}
            </p>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Contact & Channels
            </p>
            <div className="mt-2 space-y-1 text-sm text-slate-300">
              {settings.official_email && <p>{settings.official_email}</p>}
              {settings.contact_phone && <p>{settings.contact_phone}</p>}
              {!settings.official_email && !settings.contact_phone && (
                <p className="text-slate-400">
                  {subtitle} — Taluka Pano Akil, District Sukkur
                </p>
              )}
              <div className="flex flex-wrap gap-4 pt-2 text-xs font-semibold text-emerald-300">
                {settings.facebook_url && (
                  <a
                    href={settings.facebook_url}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline"
                  >
                    Facebook Page
                  </a>
                )}
                {settings.youtube_url && (
                  <a
                    href={settings.youtube_url}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline"
                  >
                    YouTube Channel
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-8 flex max-w-7xl flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-slate-400 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {schoolName}. All rights reserved.
          </p>
          <p>{subtitle}</p>
        </div>
      </footer>
    </div>
  );
}
