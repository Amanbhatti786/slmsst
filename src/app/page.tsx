"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
  Menu,
  X,
  Users,
  GraduationCap,
  Calendar,
  FolderKanban,
  Award,
  Bell,
  BookOpen,
  Image as ImageIcon,
  MapPin,
  Building2,
  Phone,
  Mail,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

const FALLBACK_SETTINGS = {
  school_name: "Shah Latif Model Secondary School Thikratho",
  subtitle: "Supported by Sindh Education Foundation",
  school_code: "340102001",
  address: "Thikratho, Taluka Pano Akil, District Sukkur, Sindh, Pakistan.",
  school_logo_url: "/logos/school-logo.png",
  sef_logo_url: "/logos/sef-logo.png",
  hero_image_url: "/images/school-building.jpg",
  hero_heading: "Welcome to Shah Latif Model Secondary School Thikratho",
  hero_subtitle:
    "Empowering Students Through Quality Education, Innovation and Excellence.",
  about_summary:
    "Shah Latif Model Secondary School Thikratho (Taluka Pano Akil, District Sukkur, Sindh) is supported by the Sindh Education Foundation (SEF). We focus on quality secondary education, STEAM & science learning, digital literacy, discipline, and overall student growth across every academic session.",
  school_history:
    "Established to serve students of Thikratho and nearby villages in Taluka Pano Akil, District Sukkur, the school continues to build strong academic foundations, practical skills, and student achievements session after session.",
  total_students: 650,
  total_teachers: 24,
  total_sessions: 10,
  completed_projects: 35,
  total_achievements: 48,
  official_email: "",
  contact_phone: "",
  facebook_url: "",
  youtube_url: "",
};

const FALLBACK_ANNOUNCEMENTS = [
  {
    id: "a1",
    title: "Academic Session 2026-2027 Admissions & Orientation Schedule",
    category: "Admissions",
    publish_date: "November 2026",
    description:
      "Parents and students are informed regarding the academic calendar, class allocations, and orientation schedule for the ongoing session.",
  },
  {
    id: "a2",
    title: "Annual STEAM & Science Exhibition Preparation Notice",
    category: "Academic Event",
    publish_date: "November 2026",
    description:
      "Students from Grades VI to X are invited to register their science, robotics, and environmental models with their respective teachers.",
  },
  {
    id: "a3",
    title: "Parent-Teacher Coordination Meeting (PTM)",
    category: "Parent Notice",
    publish_date: "November 2026",
    description:
      "Monthly academic progress review and student attendance discussion scheduled at the main school campus.",
  },
];

const FALLBACK_PROJECTS = [
  {
    id: "p1",
    title: "Solar Energy & Rural Sustainability Model",
    category: "STEAM Projects",
    session_title: "Session 2026-2027",
    status: "Completed",
    cover_image_url: "",
    description:
      "Secondary students designed a working micro-solar irrigation and classroom lighting prototype demonstrating clean energy solutions for District Sukkur.",
  },
  {
    id: "p2",
    title: "Digital Literacy & Computer Lab Initiative",
    category: "Technology Projects",
    session_title: "Session 2026-2027",
    status: "Ongoing",
    cover_image_url: "",
    description:
      "Hands-on foundational computing, digital productivity, and educational software training for middle and secondary learners.",
  },
  {
    id: "p3",
    title: "Green Campus & Tree Plantation Drive",
    category: "Environmental Projects",
    session_title: "Session 2026-2027",
    status: "Completed",
    cover_image_url: "",
    description:
      "Student-led environmental stewardship campaign planting native trees and maintaining a clean, green school environment.",
  },
];

export default function HomePage() {
  const supabase = createClient();

  const [menuOpen, setMenuOpen] = useState(false);
  const [settings, setSettings] = useState<any>(FALLBACK_SETTINGS);
  const [activeSessionTitle, setActiveSessionTitle] = useState<string>(
    "Academic Session 2026-2027"
  );
  const [partner, setPartner] = useState<any>({
    full_name: "Muhammad Hassan Mangi",
    designation: "School Partner",
    photo_url: "",
    introduction:
      "Leading school development, SEF partnership coordination, and quality education initiatives for Shah Latif Model Secondary School Thikratho.",
    educational_vision:
      "Empowering rural learners with modern education, discipline, and confidence.",
  });
  const [announcements, setAnnouncements] =
    useState<any[]>(FALLBACK_ANNOUNCEMENTS);
  const [projects, setProjects] = useState<any[]>(FALLBACK_PROJECTS);
  const [activities, setActivities] = useState<any[]>([]);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [
          setRes,
          partRes,
          sessRes,
          annRes,
          projRes,
          actRes,
          achRes,
          galRes,
        ] = await Promise.all([
          supabase.from("school_settings").select("*").eq("id", 1).single(),
          supabase.from("school_partner").select("*").eq("id", 1).single(),
          supabase
            .from("academic_sessions")
            .select("*")
            .order("start_year", { ascending: false }),
          supabase
            .from("announcements")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(3),
          supabase
            .from("projects")
            .select("*, academic_sessions(title)")
            .order("created_at", { ascending: false })
            .limit(3),
          supabase
            .from("activities")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(4),
          supabase
            .from("achievements")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(4),
          supabase
            .from("gallery_images")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(6),
        ]);

        if (setRes.data) {
          setSettings({ ...FALLBACK_SETTINGS, ...setRes.data });
        }
        if (partRes.data) {
          setPartner((prev: any) => ({ ...prev, ...partRes.data }));
        }
        if (sessRes.data && sessRes.data.length > 0) {
          const active =
            sessRes.data.find((s: any) => s.is_active) || sessRes.data[0];
          if (active?.title) setActiveSessionTitle(active.title);
        }
        if (annRes.data && annRes.data.length > 0) {
          setAnnouncements(annRes.data);
        }
        if (projRes.data && projRes.data.length > 0) {
          setProjects(projRes.data);
        }
        if (actRes.data) setActivities(actRes.data);
        if (achRes.data) setAchievements(achRes.data);
        if (galRes.data) setGallery(galRes.data);
      } catch {
        // Keep fallbacks
      }
    };

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const schoolName =
    settings.school_name?.trim() || FALLBACK_SETTINGS.school_name;
  const subtitle = settings.subtitle?.trim() || FALLBACK_SETTINGS.subtitle;
  const schoolCode =
    settings.school_code?.trim() || FALLBACK_SETTINGS.school_code;
  const address = settings.address?.trim() || FALLBACK_SETTINGS.address;
  const schoolLogo =
    settings.school_logo_url?.trim() || FALLBACK_SETTINGS.school_logo_url;
  const sefLogo =
    settings.sef_logo_url?.trim() || FALLBACK_SETTINGS.sef_logo_url;
  const bgImage =
    settings.hero_image_url?.trim() || FALLBACK_SETTINGS.hero_image_url;

  const stats = [
    {
      label: "Total Students",
      value: Number(settings.total_students ?? 0).toLocaleString(),
      icon: Users,
      accent: "from-emerald-500/20 to-teal-500/10 border-emerald-400/30",
    },
    {
      label: "Total Teachers",
      value: Number(settings.total_teachers ?? 0).toLocaleString(),
      icon: GraduationCap,
      accent: "from-amber-500/20 to-yellow-500/10 border-amber-400/30",
    },
    {
      label: "Academic Sessions",
      value: Number(settings.total_sessions ?? 0).toLocaleString(),
      icon: Calendar,
      accent: "from-emerald-500/20 to-cyan-500/10 border-emerald-400/30",
    },
    {
      label: "Completed Projects",
      value: Number(settings.completed_projects ?? 0).toLocaleString(),
      icon: FolderKanban,
      accent: "from-amber-500/20 to-orange-500/10 border-amber-400/30",
    },
    {
      label: "Total Achievements",
      value: Number(settings.total_achievements ?? 0).toLocaleString(),
      icon: Award,
      accent: "from-emerald-500/20 to-lime-500/10 border-emerald-400/30",
    },
  ];

  const menuTabs = [
    { label: "Home", href: "/" },
    { label: "About", href: "#about" },
    { label: "School Partner", href: "#partner" },
    { label: "Highlights", href: "#stats" },
    { label: "Announcements", href: "#announcements" },
    { label: "Projects", href: "#projects" },
    { label: "Activities & Awards", href: "#highlights-more" },
    { label: "Gallery", href: "#gallery" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-amber-400 selection:text-slate-950">
      {/* HEADER: School Logo Left, Title Center, SEF Logo Right (No Admin Link) */}
      <header className="sticky top-0 z-40 border-b border-emerald-400/20 bg-slate-950/90 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <div className="grid grid-cols-12 items-center gap-2">
            {/* Left: School Logo */}
            <div className="col-span-2 flex justify-start">
              <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-amber-300 via-amber-400 to-emerald-500 p-[2px] shadow-lg">
                <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-[14px] bg-slate-900 p-1">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={schoolLogo}
                    alt="School Logo"
                    className="h-full w-full object-contain"
                  />
                </div>
              </div>
            </div>

            {/* Center: School Name & Subtitle */}
            <div className="col-span-8 text-center px-1 min-w-0">
              <p className="truncate text-sm font-bold tracking-tight text-white sm:text-lg">
                {schoolName}
              </p>
              <p className="truncate text-[11px] sm:text-xs text-emerald-300/90">
                {subtitle} • Code: {schoolCode}
              </p>
            </div>

            {/* Right: SEF Logo */}
            <div className="col-span-2 flex justify-end">
              <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center overflow-hidden rounded-2xl border border-amber-400/30 bg-white p-1 shadow-lg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={sefLogo}
                  alt="SEF Logo"
                  className="h-full w-full object-contain"
                />
              </div>
            </div>
          </div>

          {/* Menu Bar (Desktop Tabs + Mobile Menu Button) */}
          <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-2.5">
            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              className="lg:hidden inline-flex items-center gap-2 rounded-xl border border-amber-400/30 bg-amber-400/10 px-3.5 py-1.5 text-xs font-bold text-amber-300"
            >
              {menuOpen ? (
                <>
                  <X className="h-4 w-4" />
                  <span>Close Menu</span>
                </>
              ) : (
                <>
                  <Menu className="h-4 w-4" />
                  <span>Menu Tabs</span>
                </>
              )}
            </button>

            <nav className="hidden lg:flex w-full items-center justify-center gap-5 text-xs font-semibold text-slate-300">
              {menuTabs.map((tab) => (
                <a
                  key={tab.label}
                  href={tab.href}
                  className="rounded-lg px-2.5 py-1.5 transition hover:bg-emerald-500/10 hover:text-amber-300"
                >
                  {tab.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Mobile Dropdown Menu Tabs */}
          {menuOpen && (
            <div className="lg:hidden mt-2.5 grid grid-cols-2 sm:grid-cols-3 gap-2 rounded-2xl border border-white/10 bg-slate-900/95 p-3">
              {menuTabs.map((tab) => (
                <a
                  key={tab.label}
                  href={tab.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2 text-xs font-semibold text-slate-200 hover:border-amber-400/40 hover:text-amber-300"
                >
                  {tab.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* HERO SECTION WITH SCHOOL BUILDING BACKGROUND */}
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
            {/* Hero Copy */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-amber-300">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>School Code: {schoolCode}</span>
                </span>
                <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-300">
                  Active Session: {activeSessionTitle}
                </span>
              </div>

              <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-[3.25rem] lg:leading-[1.12]">
                {settings.hero_heading || FALLBACK_SETTINGS.hero_heading}
              </h1>

              <p className="max-w-2xl text-base leading-relaxed text-slate-200/90 sm:text-lg">
                {settings.hero_subtitle || FALLBACK_SETTINGS.hero_subtitle}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href="#stats"
                  className="rounded-xl bg-gradient-to-r from-amber-400 to-amber-300 px-6 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-amber-500/20 transition hover:brightness-105"
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

            {/* Signature Institutional Crest Card */}
            <div className="lg:col-span-5">
              <div className="rounded-3xl border border-white/15 bg-slate-900/80 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-5 flex h-36 w-36 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-400 via-amber-300 to-amber-500 p-[3px] shadow-[0_0_45px_rgba(245,158,11,0.28)]">
                    <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-slate-950 p-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={schoolLogo}
                        alt={schoolName}
                        className="h-full w-full object-contain"
                      />
                    </div>
                  </div>

                  <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-emerald-300">
                    Official Institutional Emblem
                  </span>

                  <h2 className="mt-3 text-lg font-bold text-white">
                    {schoolName}
                  </h2>
                  <p className="mt-1 text-xs text-slate-400">{address}</p>

                  {/* SEF Partner Strip */}
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
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={sefLogo}
                        alt="Sindh Education Foundation Logo"
                        className="h-full w-full object-contain"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LIVE SCHOOL STATISTICS */}
      <section
        id="stats"
        className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Live School Records
            </p>
            <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              Academic & Campus Highlights
            </h2>
          </div>
          <p className="text-sm text-slate-400">
            Synchronized directly from school records.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {stats.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className={`rounded-2xl border bg-gradient-to-br p-6 transition hover:-translate-y-0.5 ${item.accent}`}
              >
                <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                    {item.label}
                  </p>
                  <Icon className="h-4 w-4 text-amber-300" />
                </div>
                <p className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
                  {item.value}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ABOUT & HISTORY + SCHOOL PARTNER (NAME & PHOTO) */}
      <section
        id="about"
        className="border-y border-white/10 bg-slate-900/40 py-16"
      >
        <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-7">
              <h3 className="text-xl font-bold text-white">About Our School</h3>
              <p className="mt-3 leading-relaxed text-slate-300">
                {settings.about_summary || FALLBACK_SETTINGS.about_summary}
              </p>
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs font-medium text-emerald-300">
                {[
                  "SEF Supported Secondary School",
                  "Structured Academic Sessions",
                  "STEAM & Science Learning",
                  "Dedicated Teaching Faculty",
                ].map((pt) => (
                  <div key={pt} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0" />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-7">
              <h3 className="text-xl font-bold text-white">
                School Journey & History
              </h3>
              <p className="mt-3 leading-relaxed text-slate-300">
                {settings.school_history || FALLBACK_SETTINGS.school_history}
              </p>
            </div>
          </div>

          {/* SCHOOL PARTNER PROFILE (NAME + PHOTO) */}
          <div
            id="partner"
            className="rounded-3xl border border-amber-400/25 bg-slate-900/85 p-7 shadow-xl"
          >
            <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:items-center sm:text-left">
              {partner?.photo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={partner.photo_url}
                  alt={partner.full_name || "School Partner"}
                  className="h-28 w-28 shrink-0 rounded-2xl border-2 border-amber-400/60 object-cover shadow-lg"
                />
              ) : (
                <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-2xl border-2 border-amber-400/60 bg-slate-950 text-2xl font-black text-amber-300">
                  MHM
                </div>
              )}

              <div className="space-y-2">
                <span className="inline-block rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider text-amber-300">
                  {partner?.designation || "School Partner"}
                </span>
                <h3 className="text-2xl font-extrabold text-white">
                  {partner?.full_name || "Muhammad Hassan Mangi"}
                </h3>
                {partner?.introduction && (
                  <p className="text-sm leading-relaxed text-slate-300">
                    {partner.introduction}
                  </p>
                )}
                {partner?.educational_vision && (
                  <p className="text-xs italic text-emerald-300">
                    “{partner.educational_vision}”
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ANNOUNCEMENTS */}
      <section
        id="announcements"
        className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-amber-400">
            School Notice Board
          </p>
          <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            Latest Announcements
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {announcements.map((a) => (
            <div
              key={a.id}
              className="rounded-2xl border border-white/10 bg-slate-900/80 p-6"
            >
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 font-semibold text-emerald-300">
                  {a.category || "Notice"}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Bell className="h-3.5 w-3.5 text-amber-300" />
                  {a.publish_date || "Latest"}
                </span>
              </div>
              <h3 className="mt-3 text-base font-bold text-white">{a.title}</h3>
              {a.description && (
                <p className="mt-2 text-sm text-slate-300">{a.description}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* PROJECTS */}
      <section
        id="projects"
        className="border-t border-white/10 bg-slate-900/40 py-16"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Student Innovation
            </p>
            <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              School & Student Projects
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {projects.map((p) => (
              <div
                key={p.id}
                className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/85 flex flex-col justify-between"
              >
                <div>
                  {p.cover_image_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.cover_image_url}
                      alt={p.title}
                      className="h-44 w-full object-cover"
                    />
                  )}
                  <div className="p-6">
                    <div className="flex items-center justify-between text-xs text-amber-300">
                      <span className="font-semibold">
                        {p.category || "Project"}
                      </span>
                      <span className="text-slate-400">
                        {p.academic_sessions?.title || p.session_title || ""}
                      </span>
                    </div>
                    <h3 className="mt-2 text-lg font-bold text-white">
                      {p.title}
                    </h3>
                    {p.description && (
                      <p className="mt-2 text-sm text-slate-300">
                        {p.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="border-t border-white/10 px-6 py-3 text-xs font-semibold text-emerald-300">
                  Status: {p.status || "Completed"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ACTIVITIES & ACHIEVEMENTS */}
      <section
        id="highlights-more"
        className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-7">
            <div className="flex items-center gap-2.5">
              <BookOpen className="h-5 w-5 text-emerald-400" />
              <h3 className="text-xl font-bold text-white">
                School Activities
              </h3>
            </div>
            <p className="mt-2 text-sm text-slate-300">
              Classroom practicals, STEAM exhibitions, cultural programs,
              literary events, and sports activities across academic sessions.
            </p>
            {activities.length > 0 && (
              <ul className="mt-4 space-y-2 text-sm text-slate-200">
                {activities.map((ac) => (
                  <li key={ac.id}>• {ac.title}</li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-3xl border border-amber-400/25 bg-slate-900/80 p-7">
            <div className="flex items-center gap-2.5">
              <Award className="h-5 w-5 text-amber-400" />
              <h3 className="text-xl font-bold text-white">
                Achievements & Milestones
              </h3>
            </div>
            <p className="mt-2 text-sm text-slate-300">
              Academic excellence, awards, certificates, and student competition
              milestones achieved by the school.
            </p>
            {achievements.length > 0 && (
              <ul className="mt-4 space-y-2 text-sm text-emerald-300">
                {achievements.map((ah) => (
                  <li key={ah.id}>• {ah.title}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      {/* GALLERY (If photos uploaded) */}
      {gallery.length > 0 && (
        <section
          id="gallery"
          className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8"
        >
          <div className="mb-8 flex items-center gap-2.5">
            <ImageIcon className="h-5 w-5 text-amber-400" />
            <h2 className="text-2xl font-extrabold tracking-tight text-white">
              Campus Photo Gallery
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {gallery.map((g) => (
              <div
                key={g.id}
                className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={g.image_url}
                  alt={g.title}
                  className="h-48 w-full object-cover"
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

      {/* FOOTER (Clean Public Footer - No Admin Link) */}
      <footer
        id="contact"
        className="border-t border-white/10 bg-slate-950 px-4 py-12 sm:px-6 lg:px-8"
      >
        <div className="mx-auto grid max-w-7xl gap-8 rounded-3xl border border-white/10 bg-slate-900/70 p-6 sm:p-8 md:grid-cols-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Campus Address
            </p>
            <p className="mt-2 flex items-start gap-2 text-sm leading-relaxed text-slate-300">
              <MapPin className="h-4 w-4 text-amber-400 shrink-0 mt-1" />
              <span>{address}</span>
            </p>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-amber-400">
              School Identity & Leadership
            </p>
            <p className="mt-2 text-sm text-slate-300">{schoolName}</p>
            <p className="mt-1 text-xs text-slate-400">
              School Code: {schoolCode}
            </p>
            <p className="mt-2 flex items-center gap-2 text-xs text-emerald-300">
              <Building2 className="h-4 w-4 text-amber-400 shrink-0" />
              <span>
                School Partner: {partner?.full_name || "Muhammad Hassan Mangi"}
              </span>
            </p>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Contact & Channels
            </p>
            <div className="mt-2 space-y-1.5 text-sm text-slate-300">
              {settings.official_email && (
                <p className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-amber-400 shrink-0" />
                  <span>{settings.official_email}</span>
                </p>
              )}
              {settings.contact_phone && (
                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-amber-400 shrink-0" />
                  <span>{settings.contact_phone}</span>
                </p>
              )}
              {!settings.official_email && !settings.contact_phone && (
                <p className="text-slate-400">
                  {subtitle} — Taluka Pano Akil, District Sukkur
                </p>
              )}
              {(settings.facebook_url || settings.youtube_url) && (
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
              )}
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
