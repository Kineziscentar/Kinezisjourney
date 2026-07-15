"use client";

import { useMemo, useState } from "react";
import {
  Bell,
  Check,
  ChevronRight,
  CircleUserRound,
  ClipboardCheck,
  Goal,
  Home,
  MessageCircle,
  Plus,
  Target,
  Users,
} from "lucide-react";

type Role = "member" | "coach";
type Screen = "today" | "goals" | "coach" | "profile";

type GoalData = {
  title: string;
  reason: string;
  startValue: number;
  currentValue: number;
  targetValue: number;
  due: string;
  status: string;
  started: boolean;
};

const defaultGoal: GoalData = {
  title: "Smršaviti 8 kg",
  reason: "Želim više energije i lakše kretanje.",
  startValue: 84,
  currentValue: 80.8,
  targetValue: 76,
  due: "30. studenoga 2026.",
  status: "Na dobrom putu",
  started: false,
};

export default function Page() {
  const [role, setRole] = useState<Role>("member");
  const [screen, setScreen] = useState<Screen>("today");
  const [goal, setGoal] = useState<GoalData>(defaultGoal);
  const [workouts, setWorkouts] = useState(1);
  const [habitDays, setHabitDays] = useState(3);
  const [showGoalForm, setShowGoalForm] = useState(false);

  const progress = useMemo(() => {
    const total = goal.startValue - goal.targetValue;
    const done = goal.startValue - goal.currentValue;
    return Math.max(0, Math.min(100, Math.round((done / total) * 100)));
  }, [goal]);

  const main = role === "coach"
    ? <CoachView goal={goal} onCreate={() => setShowGoalForm(true)} />
    : goal.started
      ? <MemberApp goal={goal} progress={progress} screen={screen} setScreen={setScreen} workouts={workouts} habitDays={habitDays} setWorkouts={setWorkouts} setHabitDays={setHabitDays} />
      : <GoalKickoff goal={goal} onStart={() => setGoal({ ...goal, started: true })} />;

  return (
    <main className="site-shell">
      <div className="app-frame">
        <header className="topbar">
          <div className="brand"><div className="brand-mark">K</div><span>Kinezis Journey</span></div>
          <div className="top-actions">
            <button className="role-switch" onClick={() => { setRole(role === "member" ? "coach" : "member"); setScreen("today"); }}>
              {role === "member" ? "Coach prikaz" : "Prikaz člana"}
            </button>
            <Bell size={20} />
          </div>
        </header>
        {main}
        {role === "member" && goal.started && <MemberNav active={screen} onChange={setScreen} />}
        {role === "coach" && <CoachNav />}
      </div>
      {showGoalForm && <GoalWizard onClose={() => setShowGoalForm(false)} onSave={(newGoal) => { setGoal(newGoal); setShowGoalForm(false); setRole("member"); }} />}
    </main>
  );
}

function GoalKickoff({ goal, onStart }: { goal: GoalData; onStart: () => void }) {
  return (
    <section className="content kickoff">
      <div className="kickoff-icon"><Target size={34} /></div>
      <p className="eyebrow">Paula ti je postavila novi cilj</p>
      <h1>{goal.title}</h1>
      <p className="lead">{goal.reason}</p>
      <div className="card kickoff-card">
        <InfoRow label="Trajanje" value={`Do ${goal.due}`} />
        <InfoRow label="Kako ćemo raditi" value="Trening, prehrana, navike i coach podrška" />
        <InfoRow label="Prvi korak" value="Započni Journey i potvrdi početno stanje" />
      </div>
      <button className="primary-button" onClick={onStart}>Započni Journey</button>
    </section>
  );
}

function MemberApp({ goal, progress, screen, setScreen, workouts, habitDays, setWorkouts, setHabitDays }: {
  goal: GoalData; progress: number; screen: Screen; setScreen: (s: Screen) => void;
  workouts: number; habitDays: number; setWorkouts: (n: number) => void; setHabitDays: (n: number) => void;
}) {
  if (screen === "goals") return <GoalsScreen goal={goal} progress={progress} />;
  if (screen === "coach") return <CoachMemberScreen />;
  if (screen === "profile") return <ProfileScreen />;
  return (
    <section className="content">
      <p className="eyebrow">Danas</p>
      <h1>Bok, Ana.</h1>
      <p className="lead">Danas imaš jedan važan korak.</p>
      <article className="card hero-card">
        <div className="hero-top"><span className="status-pill">{goal.status}</span><strong>{progress}%</strong></div>
        <p className="eyebrow light">Primarni cilj</p>
        <h2>{goal.title}</h2>
        <div className="progress-track"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
        <p className="eyebrow light next-label">Sljedeći korak</p>
        <h3>Zabilježi težinu</h3>
        <p className="light-text">Petak ujutro</p>
        <button className="gold-button" onClick={() => alert("U Sprintu 3 ovdje se sprema stvarno mjerenje u Supabase.")}>Zabilježi težinu</button>
        <button className="outline-light" onClick={() => setScreen("goals")}>Nastavi cilj</button>
      </article>
      <article className="card">
        <p className="eyebrow">Ovaj tjedan</p>
        <ActionRow label="Treninzi" value={`${workouts} / 2`} onClick={() => setWorkouts(Math.min(2, workouts + 1))} />
        <ActionRow label="Proteinske večere" value={`${habitDays} / 5`} onClick={() => setHabitDays(Math.min(5, habitDays + 1))} />
        <ActionRow label="Tjedni check-in" value="Petak" />
      </article>
      <article className="card coach-note">
        <div className="avatar">P</div>
        <div><p className="eyebrow">Paula</p><p>Ovaj tjedan ne mijenjamo plan. Fokus ostaje na večerama i dva treninga.</p></div>
      </article>
    </section>
  );
}

function GoalsScreen({ goal, progress }: { goal: GoalData; progress: number }) {
  return <section className="content"><p className="eyebrow">Moji ciljevi</p><h1>Ciljevi</h1><article className="card"><div className="row"><div><p className="eyebrow">Primarni cilj</p><h2>{goal.title}</h2></div><span className="status-pill">{goal.status}</span></div><div className="big-number">−{(goal.startValue-goal.currentValue).toFixed(1)} kg</div><p>od ukupno −{(goal.startValue-goal.targetValue).toFixed(0)} kg</p><div className="progress-track"><div className="progress-fill" style={{width:`${progress}%`}} /></div><hr/><h3>Plan i sadržaj cilja</h3><InfoRow label="Plan" value="2 treninga, 5 proteinskih večera, tjedno vaganje"/><InfoRow label="Materijali" value="Plan prehrane, shopping lista, vodiči"/><InfoRow label="Coach" value="Paula"/></article><article className="card muted-card"><h3>Drugi cilj</h3><p>Nema aktivnog drugog cilja. Član može imati najviše dva.</p></article></section>;
}

function CoachMemberScreen() { return <section className="content"><p className="eyebrow">Podrška</p><h1>Coach</h1><article className="card coach-note"><div className="avatar">P</div><div><h3>Paula</h3><p>Najveći izazov ostaje vikend. Ne pokušavaj nadoknađivati; nastavi po planu.</p></div></article><article className="card"><p className="eyebrow">Tjedni sažetak</p><InfoRow label="Što ide dobro" value="Kontinuitet treninga"/><InfoRow label="Fokus" value="Proteinske večere"/><button className="dark-button">Napiši poruku</button></article></section>; }
function ProfileScreen() { return <section className="content"><p className="eyebrow">Profil</p><h1>Ana</h1><article className="card"><InfoRow label="Program" value="Move Well"/><InfoRow label="Trener" value="Paula"/><InfoRow label="Aktivni ciljevi" value="1 / 2"/></article></section>; }

function CoachView({ goal, onCreate }: { goal: GoalData; onCreate: () => void }) {
  return <section className="content coach-dashboard"><p className="eyebrow">Coach Workspace</p><div className="row"><div><h1>Dobro jutro, Igore.</h1><p className="lead">Danas tri stvari traže tvoju pažnju.</p></div><button className="square-add" onClick={onCreate}><Plus /></button></div><article className="card"><p className="eyebrow">Treba odgovor</p><CoachTask name="Ana Horvat" goal={goal.title} signal="Novi tjedni check-in"/><CoachTask name="Marko Kovač" goal="Prvi zgib" signal="Nova poruka"/></article><article className="card"><p className="eyebrow">Potrebna akcija</p><CoachTask name="Petra Marić" goal="Više energije" signal="Bez aktivnosti 7 dana"/><CoachTask name="Ana Horvat" goal={goal.title} signal="Vrijeme za novi fokus"/></article><article className="card"><p className="eyebrow">Aktivni član</p><div className="row"><div><h2>Ana Horvat</h2><p>Move Well · {goal.status}</p></div><ChevronRight/></div><div className="mini-grid"><div><span>Težina</span><strong>{goal.currentValue} kg</strong></div><div><span>Cilj</span><strong>{goal.targetValue} kg</strong></div></div></article></section>;
}

function GoalWizard({ onClose, onSave }: { onClose: () => void; onSave: (g: GoalData) => void }) {
  const [step, setStep] = useState(1);
  const [start, setStart] = useState(84);
  const [target, setTarget] = useState(76);
  const [reason, setReason] = useState("Želim više energije i lakše kretanje.");
  const goalTitle = `Smršaviti ${Math.max(0, start-target)} kg`;
  return <div className="modal-backdrop"><div className="wizard"><div className="row"><div><p className="eyebrow">Novi cilj · Korak {step} od 4</p><h2>{step===1?"Odaberi predložak":step===2?"Postavi rezultat":step===3?"Zašto je cilj važan?":"Pregled i aktivacija"}</h2></div><button className="close-button" onClick={onClose}>×</button></div>
    {step===1 && <div className="template-grid"><button className="template selected"><Target/><strong>Smršaviti</strong><span>Težina, navika, trening i check-in</span></button><button className="template" disabled><Goal/><strong>Prvi zgib</strong><span>Dolazi kasnije</span></button></div>}
    {step===2 && <div><label>Početna težina<input type="number" value={start} onChange={e=>setStart(Number(e.target.value))}/></label><label>Ciljna težina<input type="number" value={target} onChange={e=>setTarget(Number(e.target.value))}/></label></div>}
    {step===3 && <label>Osobni razlog<textarea value={reason} onChange={e=>setReason(e.target.value)} rows={5}/></label>}
    {step===4 && <div className="review"><InfoRow label="Cilj" value={goalTitle}/><InfoRow label="Početno stanje" value={`${start} kg`}/><InfoRow label="Ciljna vrijednost" value={`${target} kg`}/><InfoRow label="Alati" value="Vaganje, navika, trening, check-in"/><InfoRow label="Materijali" value="Plan prehrane, shopping lista, vodiči"/></div>}
    <div className="wizard-actions">{step>1&&<button className="outline-button" onClick={()=>setStep(step-1)}>Natrag</button>}<button className="primary-button" onClick={()=>step<4?setStep(step+1):onSave({...defaultGoal,title:goalTitle,reason,startValue:start,currentValue:start,targetValue:target,started:false})}>{step<4?"Nastavi":"Aktiviraj cilj"}</button></div></div></div>;
}

function MemberNav({ active, onChange }: { active: Screen; onChange: (s: Screen) => void }) { const items:[[Screen,React.ReactNode,string],[Screen,React.ReactNode,string],[Screen,React.ReactNode,string],[Screen,React.ReactNode,string]]=[["today",<Home key="h"/>,"Danas"],["goals",<Target key="g"/>,"Ciljevi"],["coach",<MessageCircle key="c"/>,"Coach"],["profile",<CircleUserRound key="p"/>,"Profil"]]; return <nav className="bottom-nav">{items.map(([id,icon,label])=><button key={id} className={active===id?"active":""} onClick={()=>onChange(id)}>{icon}<span>{label}</span></button>)}</nav>; }
function CoachNav(){ return <nav className="bottom-nav coach-nav"><button className="active"><ClipboardCheck/><span>Dashboard</span></button><button><Users/><span>Članovi</span></button><button><Goal/><span>Ciljevi</span></button><button><CircleUserRound/><span>Profil</span></button></nav>; }
function InfoRow({label,value}:{label:string;value:string}){return <div className="info-row"><span>{label}</span><strong>{value}</strong></div>}
function ActionRow({label,value,onClick}:{label:string;value:string;onClick?:()=>void}){return <div className="action-row"><div><strong>{label}</strong><span>{value}</span></div>{onClick?<button onClick={onClick}><Plus size={18}/></button>:<Check size={19}/>}</div>}
function CoachTask({name,goal,signal}:{name:string;goal:string;signal:string}){return <div className="coach-task"><div><strong>{name}</strong><span>{goal}</span><small>{signal}</small></div><ChevronRight size={19}/></div>}
