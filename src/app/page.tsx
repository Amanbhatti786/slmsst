"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
  ArrowRight,
  Award,
  BookOpen,
  Calendar,
  FolderKanban,
  GraduationCap,
  Sparkles,
  Users,
  Bell,
  CheckCircle2,
  MapPin,
  Building2,
  Menu,
  X,
  Image as ImageIcon,
  Phone,
  Mail,
} from "lucide-react";

const FALLBACK_SETTINGS = {
  school_name: "Shah Latif Model Secondary School Thikratho",
  subtitle: "Supported by Sindh Education Foundation",
  school_code: "340102001",
  address: "Thikratho, Taluka Pano Akil, District Sukkur, Sindh, Pakistan.",
  school_logo_url: "/logos/school-logo.png",
  sef_logo_url: "/logos/sef-logo.png",
  hero_image_url:
    "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1920&q=80",
  hero_heading:
    "Welcome to Shah Latif Model Secondary School Thikratho",
  hero_subtitle:
    "Empowering Students Through Quality Education, Innovation and Excellence.",
  about_summary:
    "Shah Latif Model Secondary School Thikratho (Taluka Pano Akil, District Sukkur, Sindh) is supported by the Sindh Education Foundation (SEF). We focus on academic excellence, STEAM projects, digital skills, and holistic student development across every academic session.",
  school_history:
    "Serving students across Thikratho and surrounding communities in Taluka Pano Akil, District Sukkur with dedicated educators, structured academic sessions, and co-curricular growth.",
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
      "Students from Grades VI to X are invited to register their science, robotics, and environmental models with their respective subject teachers.",
  },
  {
    id: "a3",
    title: "Parent-Teacher Coordination Meeting (PTM)",
    category: "Parent Notice",
    publish_date: "November 2026",
    description:
      "Monthly academic progress review and student attendance discussion scheduled at the main campus hall.",
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
      "Hands-on foundational computing, coding logic, and educational software training for middle and secondary school learners.",
  },
  {
    id: "p3",
    title: "Green Campus & Tree Plantation Drive",
    category: "Environmental Projects",
    session_title: "Session 2026-2027",
    status: "Completed",
    cover_image_url: "",
    description:
      "Student-led environmental stewardship campaign planting native shade trees and maintaining botanical learning corners.",
  },
];

export default function HomePage() {
  const supabase = createClient();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [settings, setSettings] = useState<any>(FALLBACK_SETTINGS);
  const [partner, setPartner] = useState<any>({
    full_name: "Muhammad Hassan Mangi",
    designation: "School Partner",
    photo_url: "",
    introduction:
      "Leading school development, SEF partnership coordination, and quality education initiatives for Shah Latif Model Secondary School Thikratho.",
    educational_vision:
      "Empowering rural learners with modern education, discipline, and confidence.",
  });
  const [announcements, setAnnouncements] = useState<any[]>(FALLBACK_ANNOUNCEMENTS);
  const [projects, setProjects] = useState<any[]>(FALLBACK_PROJECTS);
  const [activities, setActivities] = useState<any[]>([]);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);

  useEffect(() => {
    const loadPublicData = async () => {
      try {
        const [setRes, partRes, annRes, projRes, actRes, achRes, galRes] =
          await Promise.all([
            supabase.from("school_settings").select("*").eq("id", 1).single(),
            supabase.from("school_partner").select("*").eq("id", 1).single(),
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
              .limit(3),
            supabase
              .from("achievements")
              .select("*")
              .order("created_at", { ascending: false })
              .limit(3),
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
        // Keep fallback values if offline/unconfigured
      }
    };

    loadPublicData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const schoolName =
    settings.school_name?.trim() || FALLBACK_SETTINGS.school_name;
  const subtitle = settings.subtitle?.trim() || FALLBACK_SETTINGS.subtitle;
  const schoolCode = settings.school_code?.trim() || FALLBACK_SETTINGS.school_code;
  const address = settings.address?.trim() || FALLBACK_SETTINGS.address;
  const schoolLogo =
    settings.school_logo_url?.trim() || FALLBACK_SETTINGS.school_logo_url;
  const sefLogo = settings.sef_logo_url?.trim() || FALLBACK_SETTINGS.sef_logo_url;
  const heroBg =
    settings.hero_image_url?.trim() || FALLBACK_SETTINGS.hero_image_url;

  const stats = [
    {
      label: "Enrolled Students",
      value: `${Number(settings.total_students ?? 0).toLocaleString()}`,
      icon: Users,
    },
    {
      label: "Dedicated Teachers",
      value: `${Number(settings.total_teachers ?? 0).toLocaleString()}`,
      icon: GraduationCap,
    },
    {
      label: "Academic Sessions",
      value: `${Number(settings.total_sessions ?? 0).toLocaleString()}`,
      icon: Calendar,
    },
    {
      label: "Completed Projects",
      value: `${Number(settings.completed_projects ?? 0).toLocaleString()}`,
      icon: FolderKanban,
    },
    {
      label: "School Achievements",
      value: `${Number(settings.total_achievements ?? 0).toLocaleString()}`,
      icon: Award,
    },
  ];

  const navItems = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "School Partner", href: "/partner" },
    { label: "Academic Sessions", href: "/sessions" },
    { label: "Teachers", href: "/teachers" },
    { label: "Projects", href: "/projects" },
    { label: "Activities", href: "/activities" },
    { label: "Achievements", href: "/achievements" },
    { label: "Gallery", href: "/gallery" },
    { label: "Announcements", href: "/announcements" },
    { label: "Events", href: "/events" },
    { label: "Contact Us", href: "/contact" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-800">
      {/* TOP BAR (No Admin Link) */}
      <div className="bg-[#0B2545] text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <span className="font-medium text-[#F7EFE0]">
            School Code: <strong>{schoolCode}</strong> • {address}
          </span>
          <span className="text-slate-300 hidden sm:inline">
            {subtitle}
          </span>
        </div>
      </div>

      {/* OFFICIAL 3-COLUMN HEADER (School Logo Left, Title Center, SEF Logo Right) */}
      <header className="bg-white border-b-2 border-[#C59B27] shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3.5">
          <div className="grid grid-cols-12 items-center gap-2">
            {/* Left: School Logo */}
            <div className="col-span-2 flex justify-start">
              <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center p-1 overflow-hidden shadow-xs">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={schoolLogo}
                  alt="School Official Logo"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            </div>

            {/* Center: School Name & SEF Subtitle */}
            <div className="col-span-8 text-center px-1">
              <h1 className="font-serif text-base sm:text-2xl md:text-3xl font-bold text-[#0B2545] leading-tight">
                {schoolName}
              </h1>
              <p className="mt-1 inline-block text-xs sm:text-sm font-semibold text-[#134074] bg-[#F7EFE0] px-3 py-0.5 rounded-full border border-[#C59B27]/40">
                {subtitle}
              </p>
            </div>

            {/* Right: SEF Logo */}
            <div className="col-span-2 flex justify-end">
              <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center p-1 overflow-hidden shadow-xs">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={sefLogo}
                  alt="SEF Official Logo"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>

        {/* NAVIGATION BAR + MOBILE MENU TOGGLE */}
        <nav className="bg-[#0B2545] text-white text-xs sm:text-sm border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between md:justify-center py-1.5 md:py-0">
              <button
                type="button"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                className="md:hidden inline-flex items-center gap-2 py-1.5 px-2.5 rounded-lg bg-[#134074] text-white font-semibold text-xs"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? (
                  <>
                    <X className="w-4 h-4 text-[#C59B27]" />
                    <span>Close Menu</span>
                  </>
                ) : (
                  <>
                    <Menu className="w-4 h-4 text-[#C59B27]" />
                    <span>Menu</span>
                  </>
                )}
              </button>

              <div className="hidden md:flex items-center justify-center gap-1 overflow-x-auto whitespace-nowrap">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="px-3 py-2.5 hover:bg-[#134074] hover:text-[#F7EFE0] transition font-medium"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {mobileMenuOpen && (
              <div className="md:hidden grid grid-cols-2 gap-1.5 pb-3 pt-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-2 rounded-lg bg-[#134074]/80 hover:bg-[#C59B27] hover:text-[#0B2545] transition font-medium text-xs"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>
      </header>

      <main className="flex-grow">
        {/* HERO SECTION WITH SCHOOL BUILDING BACKGROUND */}
        <section className="relative bg-[#0B2545] text-white py-20 md:py-28 px-4 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-25"
            style={{ backgroundImage: `url("${heroBg}")` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B2545]/95 via-[#0B2545]/80 to-[#0B2545]/70" />

          <div className="relative max-w-7xl mx-auto">
            <div className="max-w-3xl space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-[#C59B27]/50 text-[#F7EFE0] text-xs sm:text-sm">
                <Sparkles className="w-4 h-4 text-[#C59B27]" />
                <span>
                  Model Secondary School • Code: {schoolCode}
                </span>
              </div>

              <h2 className="font-serif text-3xl sm:text-5xl font-bold leading-tight">
                {settings.hero_heading || FALLBACK_SETTINGS.hero_heading}
              </h2>

              <p className="text-base sm:text-xl text-slate-200 font-light">
                {settings.hero_subtitle || FALLBACK_SETTINGS.hero_subtitle}
              </p>

              <div className="pt-3 flex flex-wrap gap-3 sm:gap-4">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 bg-[#C59B27] hover:bg-amber-500 text-[#0B2545] font-bold px-6 py-3 rounded-lg shadow transition"
                >
                  <span>Explore Our School</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-2 bg-white text-[#0B2545] hover:bg-slate-100 font-semibold px-6 py-3 rounded-lg transition"
                >
                  <span>View Our Projects</span>
                </Link>
                <Link
                  href="/teachers"
                  className="inline-flex items-center gap-2 border-2 border-white/80 hover:border-[#C59B27] hover:text-[#F7EFE0] text-white font-semibold px-6 py-3 rounded-lg transition"
                >
                  <span>Meet Our Teachers</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* SCHOOL INTRODUCTION & STATISTICS */}
        <section className="py-16 bg-slate-50 border-b border-slate-200 px-4">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-7 space-y-5">
              <span className="text-xs font-bold uppercase tracking-widest text-[#C59B27]">
                About Our Institution
              </span>
              <h3 className="font-serif text-2xl sm:text-4xl font-bold text-[#0B2545]">
                Quality Secondary Education in Thikratho, District Sukkur
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {settings.about_summary || FALLBACK_SETTINGS.about_summary}
              </p>
              <p className="text-slate-600 leading-relaxed text-sm">
                {settings.school_history || FALLBACK_SETTINGS.school_history}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 text-sm font-medium text-[#0B2545]">
                {[
                  "SEF Supported Model Secondary School",
                  "Separate Academic Session Records",
                  "STEAM & Science Practical Focus",
                  "Experienced & Dedicated Faculty",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#C59B27] shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className={`bg-white p-5 rounded-xl border border-slate-200 shadow-sm ${
                      index === stats.length - 1 ? "col-span-2" : ""
                    }`}
                  >
                    <Icon className="w-5 h-5 text-[#C59B27] mb-2" />
                    <div className="font-serif text-2xl sm:text-3xl font-bold text-[#0B2545]">
                      {stat.value}
                    </div>
                    <div className="text-xs sm:text-sm text-slate-600 mt-1">
                      {stat.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* LATEST ANNOUNCEMENTS */}
        <section className="py-16 max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#C59B27]">
                School Notice Board
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#0B2545] mt-1">
                Latest Announcements
              </h3>
            </div>
            <Link
              href="/sessions"
              className="inline-flex items-center gap-2 bg-[#0B2545] text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#134074] transition"
            >
              <Calendar className="w-4 h-4 text-[#C59B27]" />
              <span>Academic Sessions</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {announcements.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-slate-200 border-t-4 border-t-[#134074] rounded-xl p-6 shadow-sm"
              >
                <div className="flex justify-between text-xs mb-3">
                  <span className="bg-[#F7EFE0] text-[#0B2545] font-semibold px-2.5 py-0.5 rounded">
                    {item.category || "Notice"}
                  </span>
                  <span className="text-slate-500 flex items-center gap-1">
                    <Bell className="w-3.5 h-3.5 text-[#C59B27]" />
                    {item.publish_date || "Latest"}
                  </span>
                </div>
                <h4 className="font-serif text-lg font-bold text-[#0B2545] mb-2">
                           {item.title}
                </h4>
                <p className="text-sm text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FEATURED PROJECTS */}
        <section className="py-16 bg-[#0B2545] text-white px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#C59B27]">
                  Student Innovation
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold mt-1">
                  Featured School Projects
                </h3>
              </div>
              <Link
                href="/projects"
                className="bg-[#C59B27] text-[#0B2545] font-bold px-4 py-2 rounded-lg text-sm"
              >
                All Projects
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  className="bg-[#134074]/70 border border-white/15 rounded-xl overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    {proj.cover_image_url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={proj.cover_image_url}
                        alt={proj.title}
                        className="h-40 w-full object-cover"
                      />
                    )}
                    <div className="p-6">
                      <div className="flex justify-between text-xs text-[#F7EFE0] mb-2">
                        <span>{proj.category || "Project"}</span>
                        <span>
                          {proj.academic_sessions?.title ||
                            proj.session_title ||
                            "Academic Session"}
                        </span>
                      </div>
                      <h4 className="font-serif text-xl font-bold mb-2">
                        {proj.title}
                      </h4>
                      <p className="text-sm text-slate-200">{proj.description}</p>
                    </div>
                  </div>
                  <div className="px-6 py-3 border-t border-white/10 text-xs text-[#C59B27] font-semibold">
                    Status: {proj.status || "Completed"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ACTIVITIES, ACHIEVEMENTS, GALLERY & SCHOOL PARTNER */}
        <section className="py-16 max-w-7xl mx-auto px-4 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-7">
              <div className="flex items-center gap-2.5 mb-3">
                <BookOpen className="w-6 h-6 text-[#134074]" />
                <h3 className="font-serif text-2xl font-bold text-[#0B2545]">
                  School Activities
                </h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Classroom practicals, STEAM exhibitions, cultural programs,
                literary events, and sports activities across every academic
                session.
              </p>
              {activities.length > 0 && (
                <ul className="space-y-2 mb-4 text-sm text-slate-700">
                  {activities.map((ac) => (
                    <li key={ac.id} className="font-medium">
                      • {ac.title}
                    </li>
                  ))}
                </ul>
              )}
              <Link
                href="/activities"
                className="text-sm font-bold text-[#134074] hover:underline"
              >
                Explore Activities →
              </Link>
            </div>

            <div className="bg-[#F7EFE0]/60 border border-[#C59B27]/40 rounded-2xl p-7">
              <div className="flex items-center gap-2.5 mb-3">
                <Award className="w-6 h-6 text-[#C59B27]" />
                <h3 className="font-serif text-2xl font-bold text-[#0B2545]">
                  School Achievements
                </h3>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed mb-4">
                Academic results, awards, certificates, and student competition
                milestones achieved by Shah Latif Model Secondary School
                Thikratho.
              </p>
              {achievements.length > 0 && (
                <ul className="space-y-2 mb-4 text-sm text-slate-800">
                  {achievements.map((ah) => (
                    <li key={ah.id} className="font-medium">
                      • {ah.title}
                    </li>
                  ))}
                </ul>
              )}
              <Link
                href="/achievements"
                className="text-sm font-bold text-[#0B2545] hover:underline"
              >
                View Achievements →
              </Link>
            </div>
          </div>

          {/* PHOTO GALLERY PREVIEW (If photos exist in DB) */}
          {gallery.length > 0 && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-7">
              <div className="flex items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-2.5">
                  <ImageIcon className="w-6 h-6 text-[#134074]" />
                  <h3 className="font-serif text-2xl font-bold text-[#0B2545]">
                    Campus Gallery
                  </h3>
                </div>
                <Link
                  href="/gallery"
                  className="text-sm font-bold text-[#134074] hover:underline"
                >
                  Full Gallery →
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {gallery.map((g) => (
                  <div
                    key={g.id}
                    className="rounded-xl overflow-hidden border border-slate-200 bg-white"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={g.image_url}
                      alt={g.title}
                      className="h-40 w-full object-cover"
                    />
                    <div className="p-3">
                      <p className="text-xs font-bold text-[#0B2545] truncate">
                        {g.title}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">
                        {g.category}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SCHOOL PARTNER SPOTLIGHT (Name + Photo) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm flex flex-col md:flex-row items-center gap-8">
            {partner?.photo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={partner.photo_url}
                alt={partner.full_name || "School Partner"}
                className="w-32 h-32 rounded-full border-4 border-[#C59B27] object-cover shrink-0 shadow-md"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-[#0B2545] border-4 border-[#C59B27] text-[#F7EFE0] font-serif text-3xl font-bold flex items-center justify-center shrink-0">
                MHM
              </div>
            )}

            <div className="space-y-2 text-center md:text-left">
              <span className="text-xs font-bold uppercase tracking-widest text-[#C59B27]">
                {partner?.designation || "School Partner"}
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#0B2545]">
                {partner?.full_name || "Muhammad Hassan Mangi"}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {partner?.introduction ||
                  "Leading school development, SEF partnership coordination, and quality education initiatives for Shah Latif Model Secondary School Thikratho."}
              </p>
              {partner?.educational_vision && (
                <p className="text-xs italic text-[#134074] font-medium">
                  “{partner.educational_vision}”
                </p>
              )}
              <div className="pt-2">
                <Link
                  href="/partner"
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-[#134074] hover:text-[#0B2545]"
                >
                  <span>Full Partner Profile</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER (Clean Public Footer - No Admin Link) */}
      <footer className="bg-[#0B2545] text-slate-200 border-t-4 border-[#C59B27] py-12 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
          <div className="space-y-2">
            <h4 className="font-serif text-lg font-bold text-white">
              {schoolName}
            </h4>
            <p className="text-[#F7EFE0]">{subtitle}</p>
            <p className="text-xs text-slate-300">
              School Code: {schoolCode}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-[#C59B27] shrink-0 mt-1" />
              <span>{address}</span>
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#C59B27] shrink-0" />
              <span>
                School Partner: {partner?.full_name || "Muhammad Hassan Mangi"}
              </span>
            </div>
            {settings.contact_phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#C59B27] shrink-0" />
                <span>{settings.contact_phone}</span>
              </div>
            )}
            {settings.official_email && (
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#C59B27] shrink-0" />
                <span>{settings.official_email}</span>
              </div>
            )}
          </div>

          <div className="md:text-right space-y-2">
            {(settings.facebook_url || settings.youtube_url) && (
              <div className="flex md:justify-end gap-4 text-xs font-semibold text-[#F7EFE0]">
                {settings.facebook_url && (
                  <a
                    href={settings.facebook_url}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-[#C59B27]"
                  >
                    Facebook
                  </a>
                )}
                {settings.youtube_url && (
                  <a
                    href={settings.youtube_url}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-[#C59B27]"
                  >
                    YouTube
                  </a>
                )}
              </div>
            )}
            <p className="text-xs text-slate-300">
              © {new Date().getFullYear()} {schoolName}. All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
          }
