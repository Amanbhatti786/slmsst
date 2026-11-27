"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  LayoutDashboard,
  Calendar,
  Users,
  UserCheck,
  FolderKanban,
  Bell,
  Image as ImageIcon,
  Award,
  BookOpen,
  Settings,
  Download,
  LogOut,
  Plus,
  Trash2,
  CheckCircle2,
  Upload,
  Mail,
  ExternalLink,
} from "lucide-react";

type TabKey =
  | "overview"
  | "sessions"
  | "school_info"
  | "partner"
  | "teachers"
  | "projects"
  | "announcements"
  | "activities"
  | "achievements"
  | "gallery"
  | "messages"
  | "backup";

export default function AdminDashboardPage() {
  const router = useRouter();
  const supabase = createClient();

  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [loading, setLoading] = useState(true);
  const [statusBanner, setStatusBanner] = useState<string | null>(null);

  // Core Data States
  const [sessions, setSessions] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({});
  const [partner, setPartner] = useState<any>({});

  // Form States
  const [newSession, setNewSession] = useState({
    title: "",
    slug: "",
    start_year: 2027,
    end_year: 2028,
    overview: "",
  });

  const [newTeacher, setNewTeacher] = useState({
    full_name: "",
    designation: "",
    subject: "",
    qualification: "",
    experience: "",
    biography: "",
    photo_url: "",
  });

  const [newProject, setNewProject] = useState({
    title: "",
    category: "STEAM Projects",
    session_id: "",
    project_leader: "",
    student_participation: "",
    description: "",
    cover_image_url: "",
    status: "Completed",
  });

  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    category: "General Notice",
    session_id: "",
    description: "",
    status: "published",
  });

  const [newGalleryItem, setNewGalleryItem] = useState({
    title: "",
    category: "School Projects",
    session_id: "",
    description: "",
    image_url: "",
  });

  const notify = (msg: string) => {
    setStatusBanner(msg);
    setTimeout(() => setStatusBanner(null), 4000);
  };

  // Load All Admin Data
  const fetchAllData = async () => {
    setLoading(true);
    const [
      sessRes,
      teachRes,
      projRes,
      annRes,
      actRes,
      achRes,
      galRes,
      msgRes,
      setRes,
      partRes,
    ] = await Promise.all([
      supabase.from("academic_sessions").select("*").order("start_year", { ascending: false }),
      supabase.from("teachers").select("*").order("created_at", { ascending: false }),
      supabase.from("projects").select("*, academic_sessions(title)").order("created_at", { ascending: false }),
      supabase.from("announcements").select("*").order("created_at", { ascending: false }),
      supabase.from("activities").select("*").order("created_at", { ascending: false }),
      supabase.from("achievements").select("*").order("created_at", { ascending: false }),
      supabase.from("gallery_images").select("*").order("created_at", { ascending: false }),
      supabase.from("contact_messages").select("*").order("created_at", { ascending: false }),
      supabase.from("school_settings").select("*").eq("id", 1).single(),
      supabase.from("school_partner").select("*").eq("id", 1).single(),
    ]);

    if (sessRes.data) {
      setSessions(sessRes.data);
      const active = sessRes.data.find((s: any) => s.is_active) || sessRes.data[0];
      if (active) {
        setNewProject((p) => ({ ...p, session_id: p.session_id || active.id }));
        setNewAnnouncement((a) => ({ ...a, session_id: a.session_id || active.id }));
        setNewGalleryItem((g) => ({ ...g, session_id: g.session_id || active.id }));
      }
    }
    if (teachRes.data) setTeachers(teachRes.data);
    if (projRes.data) setProjects(projRes.data);
    if (annRes.data) setAnnouncements(annRes.data);
    if (actRes.data) setActivities(actRes.data);
    if (achRes.data) setAchievements(achRes.data);
    if (galRes.data) setGallery(galRes.data);
    if (msgRes.data) setMessages(msgRes.data);
    if (setRes.data) setSettings(setRes.data);
    if (partRes.data) setPartner(partRes.data);

    setLoading(false);
  };

  useEffect(() => {
    fetchAllData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Permanent Cloud Image Upload Helper
  const handleImageUpload = async (
    file: File,
    folder: string,
    onSuccess: (publicUrl: string) => void
  ) => {
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be under 5MB.");
      return;
    }
    const ext = file.name.split(".").pop();
    const filePath = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error } = await supabase.storage
      .from("school-media")
      .upload(filePath, file, { upsert: true });

    if (error) {
      alert("Upload failed: " + error.message);
      return;
    }

    const { data } = supabase.storage.from("school-media").getPublicUrl(filePath);
    onSuccess(data.publicUrl);
    notify("Image uploaded permanently to cloud storage!");
  };

  // CSV Backup Export Helper
  const exportToCSV = (rows: any[], filename: string) => {
    if (!rows.length) {
      alert("No records available to export.");
      return;
    }
    const headers = Object.keys(rows[0]);
    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        headers
          .map((h) => `"${String(row[h] ?? "").replace(/"/g, '""')}"`)
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${filename}-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  const menuItems: { key: TabKey; label: string; icon: any }[] = [
    { key: "overview", label: "Dashboard Overview", icon: LayoutDashboard },
    { key: "sessions", label: "Academic Sessions", icon: Calendar },
    { key: "school_info", label: "School Info & Stats", icon: Settings },
    { key: "partner", label: "School Partner", icon: UserCheck },
    { key: "teachers", label: "Teachers Directory", icon: Users },
    { key: "projects", label: "School Projects", icon: FolderKanban },
    { key: "announcements", label: "Announcements", icon: Bell },
    { key: "gallery", label: "Photo Gallery", icon: ImageIcon },
    { key: "activities", label: "Activities", icon: BookOpen },
    { key: "achievements", label: "Achievements", icon: Award },
    { key: "messages", label: "Contact Messages", icon: Mail },
    { key: "backup", label: "Backup & Export", icon: Download },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* SIDEBAR */}
      <aside className="w-full md:w-64 bg-[#0B2545] text-white flex flex-col shrink-0">
        <div className="p-5 border-b border-white/10">
          <div className="text-xs font-bold uppercase tracking-wider text-[#C59B27]">
            School Code: 340102001
          </div>
          <h1 className="font-serif text-base font-bold mt-1">
            SLMSS Thikratho Admin
          </h1>
        </div>

        <nav className="flex-grow p-3 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition text-left ${
                  active
                    ? "bg-[#C59B27] text-[#0B2545] font-bold"
                    : "text-slate-200 hover:bg-[#134074]"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-2">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-1.5 bg-white/10 hover:bg-white/20 py-2 rounded-lg text-xs font-semibold"
          >
            <span>View Live Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-1.5 bg-red-600/80 hover:bg-red-600 py-2 rounded-lg text-xs font-semibold"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-grow p-5 md:p-8 max-w-6xl">
        {statusBanner && (
          <div className="mb-6 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow flex items-center gap-2 text-sm font-semibold">
            <CheckCircle2 className="w-5 h-5" />
            <span>{statusBanner}</span>
          </div>
        )}

        {loading ? (
          <div className="text-center py-20 text-slate-500 font-medium">
            Loading school database records...
          </div>
        ) : (
          <>
            {/* 1. DASHBOARD OVERVIEW */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <h2 className="font-serif text-2xl font-bold text-[#0B2545]">
                  Institutional Control Dashboard
                </h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: "Academic Sessions", count: sessions.length },
                    { label: "Registered Teachers", count: teachers.length },
                    { label: "School Projects", count: projects.length },
                    { label: "Announcements", count: announcements.length },
                    { label: "Gallery Photos", count: gallery.length },
                    { label: "Activities", count: activities.length },
                    { label: "Achievements", count: achievements.length },
                    { label: "Visitor Messages", count: messages.length },
                  ].map((box) => (
                    <div
                      key={box.label}
                      className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm"
                    >
                      <div className="text-3xl font-serif font-bold text-[#0B2545]">
                        {box.count}
                      </div>
                      <div className="text-xs font-semibold text-slate-500 mt-1">
                        {box.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 2. ACADEMIC SESSIONS MANAGEMENT */}
            {activeTab === "sessions" && (
              <div className="space-y-8">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                  <h2 className="font-serif text-xl font-bold text-[#0B2545]">
                    Create New Academic Session
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Title (e.g., Academic Session 2027-2028)"
                      value={newSession.title}
                      onChange={(e) => setNewSession({ ...newSession, title: e.target.value })}
                      className="border p-2.5 rounded-lg text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Slug (e.g., 2027-2028)"
                      value={newSession.slug}
                      onChange={(e) => setNewSession({ ...newSession, slug: e.target.value })}
                      className="border p-2.5 rounded-lg text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Start Year (e.g., 2027)"
                      value={newSession.start_year}
                      onChange={(e) => setNewSession({ ...newSession, start_year: Number(e.target.value) })}
                      className="border p-2.5 rounded-lg text-sm"
                    />
                    <input
                      type="number"
                      placeholder="End Year (e.g., 2028)"
                      value={newSession.end_year}
                      onChange={(e) => setNewSession({ ...newSession, end_year: Number(e.target.value) })}
                      className="border p-2.5 rounded-lg text-sm"
                    />
                  </div>
                  <textarea
                    placeholder="Session Overview & Academic Goals"
                    value={newSession.overview}
                    onChange={(e) => setNewSession({ ...newSession, overview: e.target.value })}
                    className="w-full border p-2.5 rounded-lg text-sm"
                    rows={3}
                  />
                  <button
                    onClick={async () => {
                      if (!newSession.title || !newSession.slug) return alert("Title & Slug required");
                      const { error } = await supabase.from("academic_sessions").insert([newSession]);
                      if (error) return alert(error.message);
                      notify("New Academic Session created permanently!");
                      setNewSession({ title: "", slug: "", start_year: 2027, end_year: 2028, overview: "" });
                      fetchAllData();
                    }}
                    className="inline-flex items-center gap-2 bg-[#0B2545] text-white px-5 py-2.5 rounded-lg text-sm font-bold"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Academic Session</span>
                  </button>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
                  <h3 className="font-serif text-lg font-bold text-[#0B2545]">
                    Existing Academic Sessions (Separate Permanent Records)
                  </h3>
                  {sessions.map((s) => (
                    <div
                      key={s.id}
                      className="p-4 border rounded-xl flex flex-wrap items-center justify-between gap-3"
                    >
                      <div>
                        <div className="font-bold text-[#0B2545]">{s.title}</div>
                        <div className="text-xs text-slate-500">Slug: /sessions/{s.slug}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        {s.is_active ? (
                          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
                            Current Active Session
                          </span>
                        ) : (
                          <button
                            onClick={async () => {
                              await supabase.from("academic_sessions").update({ is_active: false }).neq("id", s.id);
                              await supabase.from("academic_sessions").update({ is_active: true, is_archived: false }).eq("id", s.id);
                              notify(`${s.title} is now the Active Session!`);
                              fetchAllData();
                            }}
                            className="px-3 py-1.5 bg-[#134074] text-white text-xs font-semibold rounded-lg"
                          >
                            Set as Active
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. SCHOOL INFO & LOGOS */}
            {activeTab === "school_info" && (
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-5">
                <h2 className="font-serif text-xl font-bold text-[#0B2545]">
                  School Statistics, Official Logos & Contact Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <label className="font-bold text-xs uppercase text-slate-600">Upload Official School Logo</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          handleImageUpload(e.target.files[0], "logos", (url) =>
                            setSettings({ ...settings, school_logo_url: url })
                          );
                        }
                      }}
                      className="mt-1 block w-full text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-xs uppercase text-slate-600">Upload Official SEF Logo</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          handleImageUpload(e.target.files[0], "logos", (url) =>
                            setSettings({ ...settings, sef_logo_url: url })
                          );
                        }
                      }}
                      className="mt-1 block w-full text-xs"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-xs uppercase text-slate-600">Total Students</label>
                    <input
                      type="number"
                      value={settings.total_students || 0}
                      onChange={(e) => setSettings({ ...settings, total_students: Number(e.target.value) })}
                      className="w-full border p-2.5 rounded-lg mt-1"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-xs uppercase text-slate-600">Total Teachers</label>
                    <input
                      type="number"
                      value={settings.total_teachers || 0}
                      onChange={(e) => setSettings({ ...settings, total_teachers: Number(e.target.value) })}
                      className="w-full border p-2.5 rounded-lg mt-1"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-xs uppercase text-slate-600">Official Email</label>
                    <input
                      type="email"
                      value={settings.official_email || ""}
                      onChange={(e) => setSettings({ ...settings, official_email: e.target.value })}
                      className="w-full border p-2.5 rounded-lg mt-1"
                    />
                  </div>
           <div>
                    <label className="font-bold text-xs uppercase text-slate-600">Contact Number</label>
                    <input
                      type="text"
                      value={settings.contact_phone || ""}
                      onChange={(e) => setSettings({ ...settings, contact_phone: e.target.value })}
                      className="w-full border p-2.5 rounded-lg mt-1"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="font-bold text-xs uppercase text-slate-600">Official Facebook Page URL</label>
                    <input
                      type="url"
                      value={settings.facebook_url || ""}
                      onChange={(e) => setSettings({ ...settings, facebook_url: e.target.value })}
                      className="w-full border p-2.5 rounded-lg mt-1"
                    />
                  </div>
                </div>

                <button
                  onClick={async () => {
                    const { error } = await supabase
                      .from("school_settings")
                      .update(settings)
                      .eq("id", 1);
                    if (error) return alert(error.message);
                    notify("School settings & statistics updated!");
                  }}
                  className="bg-[#0B2545] text-white font-bold px-6 py-2.5 rounded-lg text-sm"
                >
                  Save School Settings
                </button>
              </div>
            )}
{/* 4. SCHOOL PARTNER MANAGEMENT */}
            {activeTab === "partner" && (
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <h2 className="font-serif text-xl font-bold text-[#0B2545]">
                  School Partner Profile (Muhammad Hassan Mangi)
                </h2>
                <div>
                  <label className="font-bold text-xs uppercase text-slate-600">Upload Partner Portrait Photo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        handleImageUpload(e.target.files[0], "partner", (url) =>
                          setPartner({ ...partner, photo_url: url })
                        );
                      }
                    }}
                    className="mt-1 block text-xs"
                  />
                </div>
                <input
                  type="text"
                  value={partner.full_name || ""}
                  onChange={(e) => setPartner({ ...partner, full_name: e.target.value })}
                  className="w-full border p-2.5 rounded-lg text-sm"
                  placeholder="Full Name"
                />
                <textarea
                  rows={4}
                  value={partner.introduction || ""}
                  onChange={(e) => setPartner({ ...partner, introduction: e.target.value })}
                  className="w-full border p-2.5 rounded-lg text-sm"
                  placeholder="Professional Introduction"
                />
                <textarea
                  rows={3}
                  value={partner.educational_vision || ""}
                  onChange={(e) => setPartner({ ...partner, educational_vision: e.target.value })}
                  className="w-full border p-2.5 rounded-lg text-sm"
                  placeholder="Educational Vision"
                />
                <button
                  onClick={async () => {
                    const { error } = await supabase.from("school_partner").update(partner).eq("id", 1);
                    if (error) return alert(error.message);
                    notify("School Partner profile saved!");
                  }}
                  className="bg-[#0B2545] text-white font-bold px-6 py-2.5 rounded-lg text-sm"
                >
                  Update Partner Profile
                </button>
              </div>
            )}

            {/* 5. TEACHERS MANAGEMENT */}
            {activeTab === "teachers" && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                  <h2 className="font-serif text-xl font-bold text-[#0B2545]">Add New Teacher</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Full Name *"
                      value={newTeacher.full_name}
                      onChange={(e) => setNewTeacher({ ...newTeacher, full_name: e.target.value })}
                      className="border p-2.5 rounded-lg text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Designation (e.g., Senior Science Teacher) *"
                      value={newTeacher.designation}
                      onChange={(e) => setNewTeacher({ ...newTeacher, designation: e.target.value })}
                      className="border p-2.5 rounded-lg text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Subject (e.g., Physics, Mathematics) *"
                      value={newTeacher.subject}
                      onChange={(e) => setNewTeacher({ ...newTeacher, subject: e.target.value })}
                      className="border p-2.5 rounded-lg text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Qualification (e.g., M.Sc. / B.Ed.) *"
                      value={newTeacher.qualification}
                      onChange={(e) => setNewTeacher({ ...newTeacher, qualification: e.target.value })}
                      className="border p-2.5 rounded-lg text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Experience (e.g., 8 Years) *"
                      value={newTeacher.experience}
                      onChange={(e) => setNewTeacher({ ...newTeacher, experience: e.target.value })}
                      className="border p-2.5 rounded-lg text-sm"
                    />
                    <div>
                      <label className="text-xs font-bold text-slate-600 block">Teacher Photo</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            handleImageUpload(e.target.files[0], "teachers", (url) =>
                              setNewTeacher({ ...newTeacher, photo_url: url })
                            );
                          }
                        }}
                        className="text-xs mt-1"
                      />
                    </div>
                  </div>
                  <button
                    onClick={async () => {
                      if (!newTeacher.full_name || !newTeacher.subject) return alert("Name and Subject required");
                      const { error } = await supabase.from("teachers").insert([newTeacher]);
                      if (error) return alert(error.message);
                      notify("Teacher added successfully!");
                      setNewTeacher({ full_name: "", designation: "", subject: "", qualification: "", experience: "", biography: "", photo_url: "" });
                      fetchAllData();
                    }}
                    className="bg-[#0B2545] text-white font-bold px-5 py-2.5 rounded-lg text-sm"
                  >
                    Save Teacher Profile
                  </button>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
                  <h3 className="font-serif text-lg font-bold text-[#0B2545]">Teachers List ({teachers.length})</h3>
                  {teachers.map((t) => (
                    <div key={t.id} className="p-3.5 border rounded-lg flex items-center justify-between">
                      <div>
                        <div className="font-bold text-sm text-[#0B2545]">{t.full_name}</div>
                        <div className="text-xs text-slate-500">{t.designation} • {t.subject} ({t.qualification})</div>
                      </div>
                      <button
                        onClick={async () => {
                          if (!confirm(`Delete ${t.full_name}?`)) return;
                          await supabase.from("teachers").delete().eq("id", t.id);
                          notify("Teacher deleted.");
                          fetchAllData();
                        }}
                        className="text-red-600 hover:bg-red-50 p-2 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. PROJECTS MANAGEMENT */}
            {activeTab === "projects" && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                  <h2 className="font-serif text-xl font-bold text-[#0B2545]">Publish New School Project</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Project Title *"
                      value={newProject.title}
                      onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                      className="border p-2.5 rounded-lg text-sm"
                    />
                    <select
                      value={newProject.category}
                      onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
                      className="border p-2.5 rounded-lg text-sm"
                    >
                      {[
                        "STEAM Projects",
                        "Science Projects",
                        "Technology Projects",
                        "Educational Projects",
                        "Sports Projects",
                        "Environmental Projects",
                        "Cultural Activities",
                        "School Development Projects",
                      ].map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    <select
                      value={newProject.session_id}
                      onChange={(e) => setNewProject({ ...newProject, session_id: e.target.value })}
                      className="border p-2.5 rounded-lg text-sm"
                    >
                      {sessions.map((s) => (
                        <option key={s.id} value={s.id}>{s.title}</option>
                      ))}
                    </select>
                    <input
                      type="text"
                      placeholder="Project Leader / Mentor"
                      value={newProject.project_leader}
                      onChange={(e) => setNewProject({ ...newProject, project_leader: e.target.value })}
                      className="border p-2.5 rounded-lg text-sm"
                    />
                    <div>
                      <label className="text-xs font-bold text-slate-600 block">Project Photograph</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            handleImageUpload(e.target.files[0], "projects", (url) =>
                              setNewProject({ ...newProject, cover_image_url: url })
                            );
                          }
                        }}
                        className="text-xs mt-1"
                      />
                    </div>
                  </div>
                  <textarea
                    rows={3}
                    placeholder="Project Description & Student Participation *"
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    className="w-full border p-2.5 rounded-lg text-sm"
                  />
                  <button
                    onClick={async () => {
                      if (!newProject.title || !newProject.session_id) return alert("Title & Session required");
                      const { error } = await supabase.from("projects").insert([newProject]);
                      if (error) return alert(error.message);
                      notify("Project published to website!");
                      setNewProject({ ...newProject, title: "", description: "", cover_image_url: "" });
                      fetchAllData();
                    }}
                    className="bg-[#0B2545] text-white font-bold px-5 py-2.5 rounded-lg text-sm"
                  >
                    Publish Project
                  </button>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
                  <h3 className="font-serif text-lg font-bold text-[#0B2545]">Published Projects ({projects.length})</h3>
                  {projects.map((p) => (
                    <div key={p.id} className="p-3.5 border rounded-lg flex items-center justify-between">
                      <div>
                        <div className="font-bold text-sm text-[#0B2545]">{p.title}</div>
                        <div className="text-xs text-slate-500">
                          {p.category} • {p.academic_sessions?.title}
                        </div>
                      </div>
                      <button
                        onClick={async () => {
                          if (!confirm(`Delete "${p.title}"?`)) return;
                          await supabase.from("projects").delete().eq("id", p.id);
                          notify("Project deleted.");
                          fetchAllData();
                        }}
                        className="text-red-600 hover:bg-red-50 p-2 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 7. ANNOUNCEMENTS */}
            {activeTab === "announcements" && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                  <h2 className="font-serif text-xl font-bold text-[#0B2545]">Post School Announcement</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Announcement Title *"
                      value={newAnnouncement.title}
                      onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                      className="border p-2.5 rounded-lg text-sm"
                    />
                    <select
                      value={newAnnouncement.session_id}
                      onChange={(e) => setNewAnnouncement({ ...newAnnouncement, session_id: e.target.value })}
                      className="border p-2.5 rounded-lg text-sm"
                    >
                      {sessions.map((s) => (
                        <option key={s.id} value={s.id}>{s.title}</option>
                      ))}
                    </select>
                  </div>
                  <textarea
                    rows={3}
                    placeholder="Notice Details *"
                    value={newAnnouncement.description}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, description: e.target.value })}
                    className="w-full border p-2.5 rounded-lg text-sm"
                  />
                  <button
                    onClick={async () => {
                      if (!newAnnouncement.title) return alert("Title required");
                      const { error } = await supabase.from("announcements").insert([newAnnouncement]);
                      if (error) return alert(error.message);
                      notify("Announcement published!");
                      setNewAnnouncement({ ...newAnnouncement, title: "", description: "" });
                      fetchAllData();
                    }}
                    className="bg-[#0B2545] text-white font-bold px-5 py-2.5 rounded-lg text-sm"
                  >
                    Publish Notice
                  </button>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
                  {announcements.map((a) => (
                    <div key={a.id} className="p-3.5 border rounded-lg flex items-center justify-between">
                      <div>
                        <div className="font-bold text-sm text-[#0B2545]">{a.title}</div>
                        <div className="text-xs text-slate-500">{a.publish_date} • {a.status}</div>
                      </div>
                      <button
                        onClick={async () => {
                          if (!confirm("Delete announcement?")) return;
                          await supabase.from("announcements").delete().eq("id", a.id);
                          fetchAllData();
                        }}
                        className="text-red-600 p-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
  {/* 8. GALLERY UPLOAD */}
            {activeTab === "gallery" && (
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <h2 className="font-serif text-xl font-bold text-[#0B2545]">
                  Upload Photograph to School Gallery
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Photo Title *"
                    value={newGalleryItem.title}
                    onChange={(e) => setNewGalleryItem({ ...newGalleryItem, title: e.target.value })}
                    className="border p-2.5 rounded-lg text-sm"
                  />
                  <select
                    value={newGalleryItem.category}
                    onChange={(e) => setNewGalleryItem({ ...newGalleryItem, category: e.target.value })}
                    className="border p-2.5 rounded-lg text-sm"
                  >
                    {[
                      "School Building",
                      "Classrooms",
                      "Teachers",
                      "Students' Activities",
                      "School Projects",
                      "STEAM Festival",
                      "Educational Events",
                      "Sports",
                      "School Ceremonies",
                      "Awards and Achievements",
                    ].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <select
                    value={newGalleryItem.session_id}
                    onChange={(e) => setNewGalleryItem({ ...newGalleryItem, session_id: e.target.value })}
                    className="border p-2.5 rounded-lg text-sm"
                  >
                    {sessions.map((s) => (
                      <option key={s.id} value={s.id}>{s.title}</option>
                    ))}
                  </select>
                  <div className="flex items-center gap-2">
                    <Upload className="w-4 h-4 text-[#134074]" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          handleImageUpload(e.target.files[0], "gallery", (url) =>
                            setNewGalleryItem({ ...newGalleryItem, image_url: url })
                          );
                        }
                      }}
                      className="text-xs"
                    />
                  </div>
                </div>
                <button
                  onClick={async () => {
                    if (!newGalleryItem.title || !newGalleryItem.image_url) {
                      return alert("Please enter a title and upload an image first.");
                    }
                    const { error } = await supabase.from("gallery_images").insert([newGalleryItem]);
                    if (error) return alert(error.message);
                    notify("Photograph added to permanent gallery!");
                    setNewGalleryItem({ ...newGalleryItem, title: "", image_url: "" });
                    fetchAllData();
                  }}
                  className="bg-[#0B2545] text-white font-bold px-5 py-2.5 rounded-lg text-sm"
                >
                  Save to Gallery
                </button>
              </div>
            )}

            {/* 9. CONTACT MESSAGES */}
            {activeTab === "messages" && (
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
                <h2 className="font-serif text-xl font-bold text-[#0B2545]">
                  Visitor Inquiries ({messages.length})
                </h2>
                {messages.length === 0 ? (
                  <p className="text-sm text-slate-500">No messages submitted yet.</p>
                ) : (
                  messages.map((m) => (
                    <div key={m.id} className="p-4 border rounded-xl space-y-1">
                      <div className="flex justify-between font-bold text-sm text-[#0B2545]">
                        <span>{m.subject}</span>
                        <span className="text-xs text-slate-400">
                          {new Date(m.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="text-xs text-[#134074] font-semibold">
                        From: {m.sender_name} ({m.contact_info})
                      </div>
                      <p className="text-sm text-slate-600 pt-1">{m.message}</p>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* 10. BACKUP & CSV DATA EXPORT */}
            {activeTab === "backup" && (
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-5">
                <h2 className="font-serif text-xl font-bold text-[#0B2545]">
                  School Database Backup & CSV Export
                </h2>
                <p className="text-sm text-slate-600">
                  Download permanent offline CSV backups of your school records at any time.
                  Your photographs are permanently stored in Supabase Cloud Storage (<code>school-media</code> bucket).
                </p>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => exportToCSV(sessions, "slmsst-academic-sessions")}
                    className="bg-[#0B2545] text-white px-4 py-2.5 rounded-lg text-xs font-bold"
                  >
                    Export Academic Sessions (CSV)
                  </button>
                  <button
                    onClick={() => exportToCSV(teachers, "slmsst-teachers-directory")}
                    className="bg-[#134074] text-white px-4 py-2.5 rounded-lg text-xs font-bold"
                  >
                    Export Teachers List (CSV)
                  </button>
                  <button
                    onClick={() => exportToCSV(projects, "slmsst-school-projects")}
                    className="bg-[#C59B27] text-[#0B2545] px-4 py-2.5 rounded-lg text-xs font-bold"
                  >
                    Export School Projects (CSV)
                  </button>
                  <button
                    onClick={() => exportToCSV(announcements, "slmsst-announcements")}
                    className="bg-slate-800 text-white px-4 py-2.5 rounded-lg text-xs font-bold"
                  >
                    Export Announcements (CSV)
                  </button>
                </div>
              </div>
            )}

            {/* ACTIVITIES & ACHIEVEMENTS QUICK NOTICE */}
            {(activeTab === "activities" || activeTab === "achievements") && (
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h2 className="font-serif text-xl font-bold text-[#0B2545] capitalize mb-2">
                  Manage {activeTab}
                </h2>
                <p className="text-sm text-slate-600">
                  Connected to Supabase table <code>public.{activeTab}</code>. Use the same session selector to record {activeTab} per academic year.
                </p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
                  }

