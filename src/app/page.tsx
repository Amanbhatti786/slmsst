import React from "react";
import Link from "next/link";
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
} from "lucide-react";

export default function HomePage() {
  const stats = [
    { label: "Enrolled Students", value: "650+", icon: Users },
    { label: "Dedicated Teachers", value: "24", icon: GraduationCap },
    { label: "Academic Sessions", value: "10+", icon: Calendar },
    { label: "Completed Projects", value: "35+", icon: FolderKanban },
    { label: "School Achievements", value: "48+", icon: Award },
  ];

  const sampleAnnouncements = [
    {
      id: "1",
      title: "Academic Session 2026-2027 Admissions & Orientation Schedule",
      category: "Admissions",
      date: "November 2026",
      description:
        "Parents and students are informed regarding the academic calendar, class allocations, and orientation schedule for the ongoing session.",
    },
    {
      id: "2",
      title: "Annual STEAM & Science Exhibition Preparation Notice",
      category: "Academic Event",
      date: "November 2026",
      description:
        "Students from Grades VI to X are invited to register their science, robotics, and environmental models with their respective subject teachers.",
    },
    {
      id: "3",
      title: "Parent-Teacher Coordination Meeting (PTM)",
      category: "Parent Notice",
      date: "November 2026",
      description:
        "Monthly academic progress review and student attendance discussion scheduled at the main campus hall.",
    },
  ];

  const featuredProjects = [
    {
      id: "p1",
      title: "Solar Energy & Rural Sustainability Model",
      category: "STEAM Projects",
      session: "Session 2026-2027",
      status: "Completed",
      description:
        "Secondary students designed a working micro-solar irrigation and classroom lighting prototype demonstrating clean energy solutions for District Sukkur.",
    },
    {
      id: "p2",
      title: "Digital Literacy & Computer Lab Initiative",
      category: "Technology Projects",
      session: "Session 2026-2027",
      status: "Ongoing",
      description:
        "Hands-on foundational computing, coding logic, and educational software training for middle and secondary school learners.",
    },
    {
      id: "p3",
      title: "Green Campus & Tree Plantation Drive",
      category: "Environmental Projects",
      session: "Session 2026-2027",
      status: "Completed",
      description:
        "Student-led environmental stewardship campaign planting native shade trees and maintaining botanical learning corners.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-800">
      {/* TOP BAR */}
      <div className="bg-[#0B2545] text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <span className="font-medium text-[#F7EFE0]">
            School Code: <strong>340102001</strong> • Thikratho, Taluka Pano Akil, District Sukkur, Sindh
          </span>
          <Link
            href="/admin"
            className="bg-[#134074] hover:bg-[#C59B27] hover:text-[#0B2545] transition px-3 py-0.5 rounded text-white font-semibold"
          >
            Admin Panel
          </Link>
        </div>
      </div>

      {/* OFFICIAL 3-COLUMN HEADER */}
      <header className="bg-white border-b-2 border-[#C59B27] shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="grid grid-cols-12 items-center gap-2">
            <div className="col-span-2 flex justify-start">
              <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center p-1 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logos/school-logo.png"
                  alt="School Official Logo"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            </div>

            <div className="col-span-8 text-center px-1">
              <h1 className="font-serif text-base sm:text-2xl md:text-3xl font-bold text-[#0B2545] leading-tight">
                Shah Latif Model Secondary School Thikratho
              </h1>
              <p className="mt-1 inline-block text-xs sm:text-sm font-semibold text-[#134074] bg-[#F7EFE0] px-3 py-0.5 rounded-full border border-[#C59B27]/40">
                Supported by Sindh Education Foundation
              </p>
            </div>

            <div className="col-span-2 flex justify-end">
              <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center p-1 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logos/sef-logo.png"
                  alt="SEF Official Logo"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>

        {/* NAVIGATION BAR */}
        <nav className="bg-[#0B2545] text-white text-xs sm:text-sm overflow-x-auto">
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-start md:justify-center gap-1 whitespace-nowrap">
            {[
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
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-2.5 hover:bg-[#134074] hover:text-[#F7EFE0] transition font-medium"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      </header>

      <main className="flex-grow">
        {/* HERO SECTION */}
        <section className="relative bg-[#0B2545] text-white py-20 md:py-28 px-4 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1920&q=80')",
            }}
          />
          <div className="relative max-w-7xl mx-auto">
            <div className="max-w-3xl space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-[#C59B27]/50 text-[#F7EFE0] text-xs sm:text-sm">
                <Sparkles className="w-4 h-4 text-[#C59B27]" />
                <span>Model Secondary School • Code: 340102001</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-5xl font-bold leading-tight">
                Welcome to Shah Latif Model Secondary School Thikratho
              </h2>

              <p className="text-base sm:text-xl text-slate-200 font-light">
                Empowering Students Through Quality Education, Innovation and Excellence.
              </p>

              <div className="pt-3 flex flex-wrap gap-4">
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
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-[#C59B27]">
                About Our Institution
              </span>
              <h3 className="font-serif text-2xl sm:text-4xl font-bold text-[#0B2545]">
                Quality Secondary Education in Thikratho, District Sukkur
              </h3>
              <p className="text-slate-600 leading-relaxed">
                <strong>Shah Latif Model Secondary School Thikratho</strong> (Taluka
                Pano Akil, District Sukkur, Sindh) is supported by the{" "}
                <strong>Sindh Education Foundation (SEF)</strong> under the leadership
                of School Partner <strong>Muhammad Hassan Mangi</strong>. We focus on
                academic excellence, STEAM projects, digital skills, and holistic
                student development across every academic session.
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
            {sampleAnnouncements.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-slate-200 border-t-4 border-t-[#134074] rounded-xl p-6 shadow-sm"
              >
                <div className="flex justify-between text-xs mb-3">
                  <span className="bg-[#F7EFE0] text-[#0B2545] font-semibold px-2.5 py-0.5 rounded">
                    {item.category}
                  </span>
                  <span className="text-slate-500 flex items-center gap-1">
                    <Bell className="w-3.5 h-3.5 text-[#C59B27]" />
                    {item.date}
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
              {featuredProjects.map((proj) => (
                <div
                  key={proj.id}
                  className="bg-[#134074]/70 border border-white/15 rounded-xl p-6 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between text-xs text-[#F7EFE0] mb-2">
                      <span>{proj.category}</span>
                      <span>{proj.session}</span>
                    </div>
                    <h4 className="font-serif text-xl font-bold mb-2">
                      {proj.title}
                    </h4>
                    <p className="text-sm text-slate-200">{proj.description}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/10 text-xs text-[#C59B27] font-semibold">
                    Status: {proj.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ACTIVITIES, ACHIEVEMENTS & SCHOOL PARTNER */}
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
                literary events, and sports activities across every academic session.
              </p>
              <Link href="/activities" className="text-sm font-bold text-[#134074] hover:underline">
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
                milestones achieved by Shah Latif Model Secondary School Thikratho.
              </p>
              <Link href="/achievements" className="text-sm font-bold text-[#0B2545] hover:underline">
                View Achievements →
              </Link>
            </div>
          </div>

          {/* SCHOOL PARTNER SPOTLIGHT */}
          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm flex flex-col md:flex-row items-center gap-8">
            <div className="w-32 h-32 rounded-full bg-[#0B2545] border-4 border-[#C59B27] text-[#F7EFE0] font-serif text-3xl font-bold flex items-center justify-center shrink-0">
              MHM
            </div>
            <div className="space-y-2 text-center md:text-left">
              <span className="text-xs font-bold uppercase tracking-widest text-[#C59B27]">
                School Partner
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#0B2545]">
                Muhammad Hassan Mangi
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Leading school development, SEF partnership coordination, and
                quality education initiatives for Shah Latif Model Secondary School
                Thikratho.
              </p>
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

      {/* FOOTER */}
      <footer className="bg-[#0B2545] text-slate-200 border-t-4 border-[#C59B27] py-12 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
          <div className="space-y-2">
            <h4 className="font-serif text-lg font-bold text-white">
              Shah Latif Model Secondary School Thikratho
            </h4>
            <p className="text-[#F7EFE0]">Supported by Sindh Education Foundation</p>
            <p className="text-xs text-slate-300">School Code: 340102001</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-[#C59B27] shrink-0 mt-1" />
              <span>Thikratho, Taluka Pano Akil, District Sukkur, Sindh, Pakistan.</span>
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#C59B27] shrink-0" />
              <span>School Partner: Muhammad Hassan Mangi</span>
            </div>
          </div>
          <div className="md:text-right space-y-2">
            <p className="text-xs text-slate-300">
              © {new Date().getFullYear()} Shah Latif Model Secondary School Thikratho. All Rights Reserved.
  </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
