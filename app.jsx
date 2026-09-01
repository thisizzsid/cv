import React, { useState, useMemo, useRef, useEffect } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {
  Plus,
  Trash2,
  Download,
  FileDown,
  RotateCcw,
  Check,
  Save,
  Upload,
  Sparkles,
  Target,
  LogOut,
  LogIn,
  X,
} from "lucide-react";
import { onAuthChange, signOutUser, getCurrentUser, signIn, signUp } from "./firebase-auth";
import { saveResume, getUserResumes, getResume, deleteResume, saveToLocalStorage, loadFromLocalStorage } from "./firebase-service";

const STOPWORDS = new Set(
  "a an the and or of to in on for with at by from as is are was were be been being this that these those you your our we they it its their will can may should must have has had do does did not no about into over under after before more most other than then so such per across including include includes ability strong excellent looking role team work working experience years year".split(
    " "
  )
);

const ACCENTS = [
  { name: "Pine", value: "#2F5D50" },
  { name: "Ink", value: "#33465C" },
  { name: "Plum", value: "#5B3758" },
  { name: "Rust", value: "#7A4A2B" },
];

const uid = () => Math.random().toString(36).slice(2, 10);

const emptyExperience = () => ({
  id: uid(),
  role: "",
  company: "",
  location: "",
  start: "",
  end: "",
  current: false,
  bullets: "",
});

const emptyEducation = () => ({
  id: uid(),
  degree: "",
  school: "",
  location: "",
  start: "",
  end: "",
  score: "",
});

const emptyProject = () => ({ id: uid(), name: "", description: "", link: "" });
const emptyCert = () => ({ id: uid(), name: "", issuer: "", year: "" });

const SAMPLE = {
  personal: {
    name: "Ananya Sharma",
    title: "Product Analyst",
    email: "ananya.sharma@email.com",
    phone: "+91 98765 43210",
    location: "Delhi, India",
    link: "linkedin.com/in/ananyasharma",
  },
  summary:
    "Product analyst with 3 years turning user data into decisions that shipped. Cut churn 14% by redesigning onboarding; built the dashboard the growth team now checks daily.",
  experience: [
    {
      id: uid(),
      role: "Product Analyst",
      company: "Northgate Labs",
      location: "Gurugram",
      start: "Jul 2023",
      end: "",
      current: true,
      bullets:
        "Redesigned onboarding flow after funnel analysis, lifting activation rate by 22%\nBuilt a self-serve analytics dashboard adopted by 4 teams, cutting ad-hoc report requests by 60%\nRan 12 A/B tests on pricing and checkout; 5 shipped, adding an estimated ₹40L in annual revenue",
    },
    {
      id: uid(),
      role: "Business Analyst Intern",
      company: "Vantage Retail",
      location: "Delhi",
      start: "Jan 2023",
      end: "Jun 2023",
      current: false,
      bullets:
        "Automated a weekly sales report in Python, saving 5 hours of manual work per week\nPresented inventory forecasting model to leadership, adopted for Q3 planning",
    },
  ],
  education: [
    {
      id: uid(),
      degree: "B.A. Economics",
      school: "University of Delhi",
      location: "Delhi",
      start: "2019",
      end: "2023",
      score: "8.6 CGPA",
    },
  ],
  skills: [
    "SQL",
    "Python",
    "A/B Testing",
    "Tableau",
    "Excel",
    "Product Analytics",
    "Stakeholder Management",
  ],
  projects: [
    {
      id: uid(),
      name: "Fare Forecast",
      description:
        "Built a flight-price prediction model (Python, scikit-learn) with 84% accuracy on a 3-day-ahead window",
      link: "github.com/ananyasharma/fare-forecast",
    },
  ],
  certifications: [
    { id: uid(), name: "Google Data Analytics Certificate", issuer: "Google", year: "2023" },
  ],
};

const BLANK = {
  personal: { name: "", title: "", email: "", phone: "", location: "", link: "" },
  summary: "",
  experience: [emptyExperience()],
  education: [emptyEducation()],
  skills: [],
  projects: [],
  certifications: [],
};

function Field({ label, hint, children }) {
  return (
    <label className="cvm-field">
      <span className="cvm-field-label">{label}</span>
      {children}
      {hint && <span className="cvm-field-hint">{hint}</span>}
    </label>
  );
}

function TextInput(props) {
  return <input {...props} className="cvm-input" />;
}

function TextArea(props) {
  return <textarea {...props} className="cvm-textarea" />;
}

function SectionHeader({ step, title, desc }) {
  return (
    <div className="cvm-section-head">
      <span className="cvm-step">{step}</span>
      <div>
        <h2>{title}</h2>
        {desc && <p>{desc}</p>}
      </div>
    </div>
  );
}

export default function CVMaker() {
  const [user, setUser] = useState(null);
  const [data, setData] = useState(loadFromLocalStorage('currentResume') || BLANK);
  const [accent, setAccent] = useState(ACCENTS[0].value);
  const [mobileView, setMobileView] = useState("edit");
  const [copied, setCopied] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [currentResumeId, setCurrentResumeId] = useState(null);
  const [savedResumes, setSavedResumes] = useState([]);
  const [saving, setSaving] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const fileInputRef = useRef(null);
  const printRef = useRef(null);

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthChange((currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Load user's saved resumes from cloud
        loadUserResumes();
      }
    });
    return () => unsubscribe();
  }, []);

  // Auto-save to local storage every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (data.personal.name) {
        saveToLocalStorage('currentResume', data);
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [data]);

  const loadUserResumes = async () => {
    try {
      const resumes = await getUserResumes();
      setSavedResumes(resumes);
    } catch (error) {
      console.error('Error loading resumes:', error);
    }
  };

  const loadResumeData = async (resumeId) => {
    try {
      const resume = await getResume(resumeId);
      setData({
        personal: resume.personal,
        summary: resume.summary,
        experience: resume.experience,
        education: resume.education,
        skills: resume.skills,
        projects: resume.projects,
        certifications: resume.certifications,
      });
      setCurrentResumeId(resumeId);
    } catch (error) {
      console.error('Error loading resume:', error);
    }
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);
    try {
      if (isSignUp) {
        await signUp(authEmail, authPassword, authName);
      } else {
        await signIn(authEmail, authPassword);
      }
      setShowAuthModal(false);
      setAuthEmail('');
      setAuthPassword('');
      setAuthName('');
      setIsSignUp(false);
    } catch (err) {
      setAuthError(err.message || 'Authentication failed');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSaveToCloud = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    setSaving(true);
    try {
      const resumeId = await saveResume(data, currentResumeId);
      setCurrentResumeId(resumeId);
      saveToLocalStorage('currentResume', data);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
      await loadUserResumes();
      alert('Resume saved to cloud!');
    } catch (error) {
      alert('Error saving resume: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOutUser();
      setUser(null);
      setSavedResumes([]);
    } catch (error) {
      alert('Error signing out: ' + error.message);
    }
  };

  const setPersonal = (key, val) =>
    setData((d) => ({ ...d, personal: { ...d.personal, [key]: val } }));

  const updateList = (listKey, id, key, val) =>
    setData((d) => ({
      ...d,
      [listKey]: d[listKey].map((item) => (item.id === id ? { ...item, [key]: val } : item)),
    }));

  const addItem = (listKey, factory) =>
    setData((d) => ({ ...d, [listKey]: [...d[listKey], factory()] }));

  const removeItem = (listKey, id) =>
    setData((d) => ({ ...d, [listKey]: d[listKey].filter((i) => i.id !== id) }));

  const skillsInput = data.skills.join(", ");
  const setSkills = (val) =>
    setData((d) => ({
      ...d,
      skills: val
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    }));

  const handlePrint = async () => {
    const input = printRef.current;
    if (!input) return;

    const previousView = mobileView;
    if (mobileView !== "preview") {
      setMobileView("preview");
      await new Promise((resolve) => setTimeout(resolve, 150));
    }

    try {
      const canvas = await html2canvas(input, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight, undefined, "FAST");
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight, undefined, "FAST");
        heightLeft -= pageHeight;
      }

      pdf.save(`${(data.personal.name || "resume").replace(/\s+/g, "_")}_resume.pdf`);
    } catch (error) {
      console.error("PDF export failed:", error);
      window.alert("PDF export failed. Please try again.");
    } finally {
      if (previousView !== "preview") {
        setMobileView(previousView);
      }
    }
  };

  const atsText = useMemo(() => {
    const p = data.personal;
    const lines = [];
    lines.push(p.name || "Your Name");
    lines.push(
      [p.title, p.location, p.email, p.phone, p.link].filter(Boolean).join(" | ")
    );
    lines.push("");
    if (data.summary) {
      lines.push("SUMMARY");
      lines.push(data.summary);
      lines.push("");
    }
    if (data.experience.some((e) => e.role || e.company)) {
      lines.push("EXPERIENCE");
      data.experience.forEach((e) => {
        if (!e.role && !e.company) return;
        lines.push(
          `${e.role || ""}${e.company ? ", " + e.company : ""}${
            e.location ? " - " + e.location : ""
          }`
        );
        lines.push(`${e.start || ""} - ${e.current ? "Present" : e.end || ""}`);
        e.bullets
          .split("\n")
          .filter(Boolean)
          .forEach((b) => lines.push(`- ${b}`));
        lines.push("");
      });
    }
    if (data.education.some((e) => e.degree || e.school)) {
      lines.push("EDUCATION");
      data.education.forEach((e) => {
        if (!e.degree && !e.school) return;
        lines.push(`${e.degree || ""}${e.school ? ", " + e.school : ""}`);
        lines.push(
          [e.location, [e.start, e.end].filter(Boolean).join(" - "), e.score]
            .filter(Boolean)
            .join(" | ")
        );
        lines.push("");
      });
    }
    if (data.skills.length) {
      lines.push("SKILLS");
      lines.push(data.skills.join(", "));
      lines.push("");
    }
    if (data.projects.some((p2) => p2.name)) {
      lines.push("PROJECTS");
      data.projects.forEach((pr) => {
        if (!pr.name) return;
        lines.push(`${pr.name}${pr.link ? " - " + pr.link : ""}`);
        if (pr.description) lines.push(pr.description);
        lines.push("");
      });
    }
    if (data.certifications.some((c) => c.name)) {
      lines.push("CERTIFICATIONS");
      data.certifications.forEach((c) => {
        if (!c.name) return;
        lines.push(`${c.name}${c.issuer ? ", " + c.issuer : ""}${c.year ? " (" + c.year + ")" : ""}`);
      });
    }
    return lines.join("\n").trim();
  }, [data]);

  const score = useMemo(() => {
    let s = 0;
    const notes = [];
    const p = data.personal;
    if (p.name && p.email && p.phone) s += 15;
    else notes.push("Add name, email and phone");
    if (data.summary && data.summary.length >= 40) s += 15;
    else notes.push("Write a 2–3 line summary");
    const bulletsAll = data.experience.flatMap((e) => e.bullets.split("\n").filter(Boolean));
    if (data.experience.some((e) => e.role && e.company)) s += 20;
    else notes.push("Add at least one role");
    const quantified = bulletsAll.filter((b) => /\d/.test(b)).length;
    if (quantified >= 2) s += 20;
    else notes.push("Add numbers to 2+ bullets (%, ₹, time saved)");
    if (data.skills.length >= 5) s += 15;
    else notes.push("List 5+ role-relevant skills");
    if (data.education.some((e) => e.degree || e.school)) s += 10;
    else notes.push("Add your education");
    if (bulletsAll.some((b) => /^(led|built|managed|designed|reduced|increased|launched|created|drove|improved|automated|analyzed|owned|shipped)/i.test(b.trim())))
      s += 5;
    else notes.push("Start bullets with an action verb");
    return { value: Math.min(s, 100), notes };
  }, [data]);

  const scoreLabel =
    score.value >= 85 ? "Strong" : score.value >= 60 ? "Good" : score.value >= 35 ? "Needs work" : "Just started";

  const jdMatch = useMemo(() => {
    if (!jobDescription.trim()) return null;
    const resumeBlob = [
      data.summary,
      data.skills.join(" "),
      ...data.experience.map((e) => `${e.role} ${e.bullets}`),
      ...data.projects.map((p) => `${p.name} ${p.description}`),
    ]
      .join(" ")
      .toLowerCase();
    const jdWords = Array.from(
      new Set(
        jobDescription
          .toLowerCase()
          .replace(/[^a-z0-9+#./ -]/g, " ")
          .split(/\s+/)
          .filter((w) => w.length > 2 && !STOPWORDS.has(w))
      )
    );
    const matched = jdWords.filter((w) => resumeBlob.includes(w));
    const missing = jdWords.filter((w) => !resumeBlob.includes(w)).slice(0, 14);
    const pct = jdWords.length ? Math.round((matched.length / jdWords.length) * 100) : 0;
    return { pct, matchedCount: matched.length, total: jdWords.length, missing };
  }, [jobDescription, data]);

  const downloadJson = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(data.personal.name || "resume").replace(/\s+/g, "_")}_draft.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleImportJson = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        setData({ ...BLANK, ...parsed });
      } catch {
        window.alert("That file doesn't look like a valid saved draft.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const loadExample = () => setData(SAMPLE);

  const downloadTxt = () => {
    const blob = new Blob([atsText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(data.personal.name || "resume").replace(/\s+/g, "_")}_ATS.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const reset = () => {
    if (window.confirm("Clear everything and start blank?")) setData(BLANK);
  };

  return (
    <div className="cvm-root" style={{ "--accent": accent }}>
      <div className="cvm-topbar">
        <div className="cvm-brand">
          <span className="cvm-brand-mark" />
          <div className="cvm-brand-text">
            <h1>Lets make CV</h1>
            <span>free, ATS-friendly, one page resume builder</span>
          </div>
        </div>
        <div className="cvm-topbar-actions">
          <div className="cvm-swatches">
            {ACCENTS.map((a) => (
              <button
                key={a.value}
                className={"cvm-swatch" + (accent === a.value ? " active" : "")}
                style={{ background: a.value }}
                onClick={() => setAccent(a.value)}
                title={a.name}
                aria-label={a.name}
              />
            ))}
          </div>
          <button className="cvm-btn cvm-btn-ghost" onClick={reset}>
            <RotateCcw size={14} /> Clear
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            style={{ display: "none" }}
            onChange={handleImportJson}
          />
          <button className="cvm-btn cvm-btn-ghost" onClick={() => fileInputRef.current?.click()}>
            <Upload size={14} /> Load draft
          </button>
          <button className="cvm-btn cvm-btn-ghost" onClick={downloadJson}>
            <Save size={14} /> Export JSON
          </button>
          <button className="cvm-btn" onClick={handleSaveToCloud} disabled={saving} title={user ? "Save to cloud" : "Sign in to save to cloud"}>
            <Save size={14} /> {saving ? 'Saving...' : (user ? 'Cloud Save' : 'Save Locally')}
          </button>
          <button className="cvm-btn" onClick={downloadTxt}>
            {copied ? <Check size={14} /> : <FileDown size={14} />}
            {copied ? "Downloaded" : "ATS text"}
          </button>
          <button className="cvm-btn cvm-btn-primary" onClick={handlePrint}>
            <Download size={14} /> Download PDF
          </button>
          {user ? (
            <button className="cvm-btn cvm-btn-ghost" onClick={handleLogout}>
              <LogOut size={14} /> Logout
            </button>
          ) : (
            <button className="cvm-btn" onClick={() => setShowAuthModal(true)}>
              <LogIn size={14} /> Sign In
            </button>
          )}
        </div>
      </div>

      <div className="cvm-mobile-tabs">
        <button
          className={mobileView === "edit" ? "active" : ""}
          onClick={() => setMobileView("edit")}
        >
          Edit
        </button>
        <button
          className={mobileView === "preview" ? "active" : ""}
          onClick={() => setMobileView("preview")}
        >
          Preview
        </button>
      </div>

      <div className="cvm-layout">
        <div className={"cvm-form-pane" + (mobileView !== "edit" ? " hide-mobile" : "")}>
          <div className="cvm-intro">
            <div className="cvm-intro-top">
              <div>
                <h3>Fill in what's true. We'll handle the formatting.</h3>
                <p>
                  One column, standard headings, no tables or icons in the resume itself — the
                  layout every ATS (Workday, Greenhouse, Taleo, iCIMS) can parse cleanly. Only
                  fields that actually earn a place on a one-page CV are here.
                </p>
              </div>
              <button className="cvm-btn cvm-btn-ghost cvm-example-btn" onClick={loadExample}>
                <Sparkles size={14} /> Load example
              </button>
            </div>
            <div className="cvm-score">
              <div className="cvm-score-ring" style={{ "--pct": score.value }}>
                <span>{score.value}</span>
              </div>
              <div className="cvm-score-body">
                <div className="cvm-score-label">
                  Resume strength: <strong>{scoreLabel}</strong>
                </div>
                {score.notes.length > 0 && (
                  <ul className="cvm-score-notes">
                    {score.notes.slice(0, 3).map((n, i) => (
                      <li key={i}>{n}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          <div className="cvm-section">
            <SectionHeader step="1" title="Contact" desc="Keep it to essentials — no full address needed." />
            <div className="cvm-row">
              <Field label="Full name">
                <TextInput
                  value={data.personal.name}
                  onChange={(e) => setPersonal("name", e.target.value)}
                  placeholder="Ananya Sharma"
                />
              </Field>
              <Field label="Target role / title">
                <TextInput
                  value={data.personal.title}
                  onChange={(e) => setPersonal("title", e.target.value)}
                  placeholder="Product Analyst"
                />
              </Field>
            </div>
            <div className="cvm-row">
              <Field label="Email">
                <TextInput
                  value={data.personal.email}
                  onChange={(e) => setPersonal("email", e.target.value)}
                  placeholder="you@email.com"
                />
              </Field>
              <Field label="Phone">
                <TextInput
                  value={data.personal.phone}
                  onChange={(e) => setPersonal("phone", e.target.value)}
                  placeholder="+91 90000 00000"
                />
              </Field>
            </div>
            <div className="cvm-row">
              <Field label="City">
                <TextInput
                  value={data.personal.location}
                  onChange={(e) => setPersonal("location", e.target.value)}
                  placeholder="Delhi, India"
                />
              </Field>
              <Field label="LinkedIn / portfolio" hint="Optional — omit if you don't have one">
                <TextInput
                  value={data.personal.link}
                  onChange={(e) => setPersonal("link", e.target.value)}
                  placeholder="linkedin.com/in/you"
                />
              </Field>
            </div>
          </div>

          <div className="cvm-section">
            <SectionHeader
              step="2"
              title="Summary"
              desc="2–3 lines. Skip this if you're a fresher with strong projects instead."
            />
            <Field label="Professional summary">
              <TextArea
                value={data.summary}
                onChange={(e) => setData((d) => ({ ...d, summary: e.target.value }))}
                placeholder="What you do, one standout result, in your target function."
              />
            </Field>
          </div>

          <div className="cvm-section">
            <SectionHeader
              step="3"
              title="Experience"
              desc="Reverse chronological. Start bullets with an action verb, quantify results."
            />
            {data.experience.map((exp, i) => (
              <div className="cvm-card" key={exp.id}>
                {data.experience.length > 1 && (
                  <button className="cvm-card-remove" onClick={() => removeItem("experience", exp.id)}>
                    <Trash2 size={15} />
                  </button>
                )}
                <div className="cvm-row">
                  <Field label="Role">
                    <TextInput
                      value={exp.role}
                      onChange={(e) => updateList("experience", exp.id, "role", e.target.value)}
                      placeholder="Product Analyst"
                    />
                  </Field>
                  <Field label="Company">
                    <TextInput
                      value={exp.company}
                      onChange={(e) => updateList("experience", exp.id, "company", e.target.value)}
                      placeholder="Company name"
                    />
                  </Field>
                </div>
                <div className="cvm-row3">
                  <Field label="Location">
                    <TextInput
                      value={exp.location}
                      onChange={(e) => updateList("experience", exp.id, "location", e.target.value)}
                      placeholder="City"
                    />
                  </Field>
                  <Field label="Start">
                    <TextInput
                      value={exp.start}
                      onChange={(e) => updateList("experience", exp.id, "start", e.target.value)}
                      placeholder="Jul 2023"
                    />
                  </Field>
                  <Field label="End">
                    <TextInput
                      value={exp.end}
                      onChange={(e) => updateList("experience", exp.id, "end", e.target.value)}
                      placeholder="Present"
                      disabled={exp.current}
                    />
                  </Field>
                </div>
                <label className="cvm-checkbox">
                  <input
                    type="checkbox"
                    checked={exp.current}
                    onChange={(e) => updateList("experience", exp.id, "current", e.target.checked)}
                  />
                  I currently work here
                </label>
                <Field label="What you did" hint="One line per bullet — each becomes its own point">
                  <TextArea
                    value={exp.bullets}
                    onChange={(e) => updateList("experience", exp.id, "bullets", e.target.value)}
                    placeholder={"Redesigned onboarding, lifting activation 22%\nBuilt a dashboard adopted by 4 teams"}
                  />
                </Field>
              </div>
            ))}
            <button className="cvm-add" onClick={() => addItem("experience", emptyExperience)}>
              <Plus size={14} /> Add role
            </button>
          </div>

          <div className="cvm-section">
            <SectionHeader step="4" title="Education" />
            {data.education.map((ed) => (
              <div className="cvm-card" key={ed.id}>
                {data.education.length > 1 && (
                  <button className="cvm-card-remove" onClick={() => removeItem("education", ed.id)}>
                    <Trash2 size={15} />
                  </button>
                )}
                <div className="cvm-row">
                  <Field label="Degree">
                    <TextInput
                      value={ed.degree}
                      onChange={(e) => updateList("education", ed.id, "degree", e.target.value)}
                      placeholder="B.A. Economics"
                    />
                  </Field>
                  <Field label="Institution">
                    <TextInput
                      value={ed.school}
                      onChange={(e) => updateList("education", ed.id, "school", e.target.value)}
                      placeholder="University of Delhi"
                    />
                  </Field>
                </div>
                <div className="cvm-row3">
                  <Field label="Start year">
                    <TextInput
                      value={ed.start}
                      onChange={(e) => updateList("education", ed.id, "start", e.target.value)}
                      placeholder="2019"
                    />
                  </Field>
                  <Field label="End year">
                    <TextInput
                      value={ed.end}
                      onChange={(e) => updateList("education", ed.id, "end", e.target.value)}
                      placeholder="2023"
                    />
                  </Field>
                  <Field label="CGPA / %" hint="Include if strong">
                    <TextInput
                      value={ed.score}
                      onChange={(e) => updateList("education", ed.id, "score", e.target.value)}
                      placeholder="8.6 CGPA"
                    />
                  </Field>
                </div>
              </div>
            ))}
            <button className="cvm-add" onClick={() => addItem("education", emptyEducation)}>
              <Plus size={14} /> Add education
            </button>
          </div>

          <div className="cvm-section">
            <SectionHeader
              step="5"
              title="Skills"
              desc="Only tools and skills from the job description — no soft skills like 'hardworking'."
            />
            <Field label="Skills" hint="Comma-separated">
              <TextInput
                value={skillsInput}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="SQL, Python, A/B Testing, Tableau"
              />
            </Field>
          </div>

          <div className="cvm-section">
            <SectionHeader
              step="6"
              title="Projects"
              desc="High-value if you're a fresher or switching careers. Skip otherwise."
            />
            {data.projects.map((pr) => (
              <div className="cvm-card" key={pr.id}>
                <button className="cvm-card-remove" onClick={() => removeItem("projects", pr.id)}>
                  <Trash2 size={15} />
                </button>
                <div className="cvm-row">
                  <Field label="Project name">
                    <TextInput
                      value={pr.name}
                      onChange={(e) => updateList("projects", pr.id, "name", e.target.value)}
                      placeholder="Fare Forecast"
                    />
                  </Field>
                  <Field label="Link" hint="Optional">
                    <TextInput
                      value={pr.link}
                      onChange={(e) => updateList("projects", pr.id, "link", e.target.value)}
                      placeholder="github.com/you/project"
                    />
                  </Field>
                </div>
                <Field label="What it does / result">
                  <TextArea
                    value={pr.description}
                    onChange={(e) => updateList("projects", pr.id, "description", e.target.value)}
                    placeholder="Built a flight-price prediction model with 84% accuracy"
                  />
                </Field>
              </div>
            ))}
            <button className="cvm-add" onClick={() => addItem("projects", emptyProject)}>
              <Plus size={14} /> Add project
            </button>
          </div>

          <div className="cvm-section">
            <SectionHeader step="7" title="Certifications" desc="Only ones relevant to the role." />
            {data.certifications.map((c) => (
              <div className="cvm-card" key={c.id}>
                <button className="cvm-card-remove" onClick={() => removeItem("certifications", c.id)}>
                  <Trash2 size={15} />
                </button>
                <div className="cvm-row3">
                  <Field label="Certification">
                    <TextInput
                      value={c.name}
                      onChange={(e) => updateList("certifications", c.id, "name", e.target.value)}
                      placeholder="Google Data Analytics"
                    />
                  </Field>
                  <Field label="Issuer">
                    <TextInput
                      value={c.issuer}
                      onChange={(e) => updateList("certifications", c.id, "issuer", e.target.value)}
                      placeholder="Google"
                    />
                  </Field>
                  <Field label="Year">
                    <TextInput
                      value={c.year}
                      onChange={(e) => updateList("certifications", c.id, "year", e.target.value)}
                      placeholder="2023"
                    />
                  </Field>
                </div>
              </div>
            ))}
            <button className="cvm-add" onClick={() => addItem("certifications", emptyCert)}>
              <Plus size={14} /> Add certification
            </button>
          </div>

          <div className="cvm-section">
            <SectionHeader
              step={<Target size={12} />}
              title="Match a job description"
              desc="Optional — paste a posting to see which of its keywords your CV already covers."
            />
            <Field label="Job description">
              <TextArea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job posting here…"
                style={{ minHeight: 110 }}
              />
            </Field>
            {jdMatch && (
              <div className="cvm-jd-result">
                <div className="cvm-jd-bar-row">
                  <div className="cvm-jd-bar">
                    <div className="cvm-jd-bar-fill" style={{ width: `${jdMatch.pct}%` }} />
                  </div>
                  <span className="cvm-jd-pct">{jdMatch.pct}% match</span>
                </div>
                <p className="cvm-jd-summary">
                  {jdMatch.matchedCount} of {jdMatch.total} key terms from the posting show up in your CV.
                </p>
                {jdMatch.missing.length > 0 && (
                  <>
                    <span className="cvm-field-label">Consider working these in, if genuinely true:</span>
                    <div className="cvm-r-skills">
                      {jdMatch.missing.map((w, i) => (
                        <span className="cvm-r-skill cvm-missing-skill" key={i}>
                          {w}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        <div className={"cvm-preview-pane" + (mobileView !== "preview" ? " hide-mobile" : "")}>
          <div className="cvm-page" id="resume-print-area" ref={printRef}>
            <h1 className="cvm-r-name">
              {data.personal.name || <span className="cvm-r-empty">Your Name</span>}
            </h1>
            {data.personal.title && <p className="cvm-r-title">{data.personal.title}</p>}
            <p className="cvm-r-contact">
              {[data.personal.location, data.personal.email, data.personal.phone, data.personal.link]
                .filter(Boolean)
                .map((c, i) => (
                  <span key={i}>{c}</span>
                ))}
              {![data.personal.location, data.personal.email, data.personal.phone, data.personal.link].some(
                Boolean
              ) && <span className="cvm-r-empty">City • email • phone</span>}
            </p>
            <hr className="cvm-r-hr" />

            {data.summary && (
              <div className="cvm-r-section">
                <h2 className="cvm-r-h2">Summary</h2>
                <p className="cvm-r-summary">{data.summary}</p>
              </div>
            )}

            {data.experience.some((e) => e.role || e.company) && (
              <div className="cvm-r-section">
                <h2 className="cvm-r-h2">Experience</h2>
                {data.experience.map(
                  (e) =>
                    (e.role || e.company) && (
                      <div className="cvm-r-entry" key={e.id}>
                        <div className="cvm-r-entry-top">
                          <span>
                            <span className="cvm-r-role">{e.role}</span>
                            {e.company && <span className="cvm-r-org">, {e.company}</span>}
                          </span>
                          <span className="cvm-r-dates">
                            {e.start}
                            {(e.start || e.end || e.current) && " – "}
                            {e.current ? "Present" : e.end}
                          </span>
                        </div>
                        {e.location && <div className="cvm-r-loc">{e.location}</div>}
                        {e.bullets && (
                          <ul className="cvm-r-bullets">
                            {e.bullets
                              .split("\n")
                              .filter(Boolean)
                              .map((b, i) => (
                                <li key={i}>{b}</li>
                              ))}
                          </ul>
                        )}
                      </div>
                    )
                )}
              </div>
            )}

            {data.education.some((e) => e.degree || e.school) && (
              <div className="cvm-r-section">
                <h2 className="cvm-r-h2">Education</h2>
                {data.education.map(
                  (e) =>
                    (e.degree || e.school) && (
                      <div className="cvm-r-entry" key={e.id}>
                        <div className="cvm-r-entry-top">
                          <span>
                            <span className="cvm-r-role">{e.degree}</span>
                            {e.school && <span className="cvm-r-org">, {e.school}</span>}
                          </span>
                          <span className="cvm-r-dates">
                            {[e.start, e.end].filter(Boolean).join(" – ")}
                          </span>
                        </div>
                        {(e.location || e.score) && (
                          <div className="cvm-r-loc">{[e.location, e.score].filter(Boolean).join(" · ")}</div>
                        )}
                      </div>
                    )
                )}
              </div>
            )}

            {data.skills.length > 0 && (
              <div className="cvm-r-section">
                <h2 className="cvm-r-h2">Skills</h2>
                <div className="cvm-r-skills">
                  {data.skills.map((s, i) => (
                    <span className="cvm-r-skill" key={i}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {data.projects.some((p) => p.name) && (
              <div className="cvm-r-section">
                <h2 className="cvm-r-h2">Projects</h2>
                {data.projects.map(
                  (p) =>
                    p.name && (
                      <div className="cvm-r-entry" key={p.id}>
                        <div className="cvm-r-entry-top">
                          <span className="cvm-r-role">{p.name}</span>
                          {p.link && <span className="cvm-r-dates">{p.link}</span>}
                        </div>
                        {p.description && <p className="cvm-r-summary">{p.description}</p>}
                      </div>
                    )
                )}
              </div>
            )}

            {data.certifications.some((c) => c.name) && (
              <div className="cvm-r-section">
                <h2 className="cvm-r-h2">Certifications</h2>
                {data.certifications.map(
                  (c) =>
                    c.name && (
                      <div className="cvm-r-loc" key={c.id} style={{ marginBottom: 4 }}>
                        {c.name}
                        {c.issuer && `, ${c.issuer}`}
                        {c.year && ` (${c.year})`}
                      </div>
                    )
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <footer className="cvm-footer">
        <div className="cvm-footer-inner">
          <p>
            Nothing you type is uploaded or stored — everything stays in this browser tab. {user ? "Your changes sync to cloud." : 'Use "Save Locally" or sign in to sync to cloud.'}
          </p>
        </div>
      </footer>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="cvm-modal-overlay" onClick={() => setShowAuthModal(false)}>
          <div className="cvm-modal" onClick={(e) => e.stopPropagation()}>
            <button className="cvm-modal-close" onClick={() => setShowAuthModal(false)}>
              <X size={20} />
            </button>
            <h2>{isSignUp ? 'Create Account' : 'Sign In'}</h2>
            <p className="cvm-modal-subtitle">{isSignUp ? 'Save your drafts to cloud' : 'Access your saved resumes'}</p>
            
            <form onSubmit={handleAuthSubmit} className="cvm-auth-form">
              {isSignUp && (
                <div className="cvm-form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    placeholder="John Doe"
                    disabled={authLoading}
                  />
                </div>
              )}
              <div className="cvm-form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="you@example.com"
                  disabled={authLoading}
                  required
                />
              </div>
              <div className="cvm-form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={authLoading}
                  required
                />
              </div>
              {authError && <p className="cvm-error">{authError}</p>}
              <button type="submit" className="cvm-btn cvm-btn-primary" disabled={authLoading} style={{ width: '100%', marginBottom: '10px' }}>
                {authLoading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Sign In')}
              </button>
            </form>
            
            <div className="cvm-auth-toggle">
              <p>{isSignUp ? 'Already have an account?' : "Don't have an account?"}</p>
              <button className="cvm-link-btn" onClick={() => { setIsSignUp(!isSignUp); setAuthError(''); }}>
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
