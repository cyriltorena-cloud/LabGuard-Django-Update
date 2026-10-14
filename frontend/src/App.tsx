
import { useState, type FormEvent } from 'react';
import {
  Activity, AlertCircle, ArrowRight, CheckCircle2, Clock3,
  GraduationCap, LayoutDashboard, LockKeyhole, LogOut, Monitor,
  RefreshCw, ShieldCheck, Users, Search,
} from 'lucide-react';

type Role = 'Admin' | 'Teacher' | 'Student';
type AuthMode = 'login' | 'register';

type Profile = {
  username: string;
  first_name: string;
  last_name: string;
  student_id: string;
  role: Role;
};

type Computer = {
  id: number;
  computer_id: string;
  name: string;
  location: string;
  status: 'Available' | 'Occupied' | 'Disabled';
  active_student: string | null;
};

type LabSession = {
  id: number;
  student_username: string;
  computer_id: string;
  login_at: string;
  logout_at: string | null;
  is_active: boolean;
};

type SystemSettings = {
  laboratoryName: string;
  roomNumber: string;
  requireStudentLogin: boolean;
  registeredUsersOnly: boolean;
  sessionLogging: boolean;
  computerMonitoring: boolean;
  autoLogout: boolean;
  sessionLimit: number;
  offlineAlerts: boolean;
  unauthorizedAlerts: boolean;
};

const initialComputers: Computer[] = [
  { id: 1, computer_id: 'PC-01', name: 'Workstation 01', location: 'Computer Laboratory', status: 'Occupied', active_student: 'juan123' },
  { id: 2, computer_id: 'PC-02', name: 'Workstation 02', location: 'Computer Laboratory', status: 'Available', active_student: null },
  { id: 3, computer_id: 'PC-03', name: 'Workstation 03', location: 'Computer Laboratory', status: 'Occupied', active_student: 'maria01' },
  { id: 4, computer_id: 'PC-04', name: 'Workstation 04', location: 'Computer Laboratory', status: 'Available', active_student: null },
  { id: 5, computer_id: 'PC-05', name: 'Workstation 05', location: 'Computer Laboratory', status: 'Disabled', active_student: null },
  { id: 6, computer_id: 'PC-06', name: 'Workstation 06', location: 'Computer Laboratory', status: 'Available', active_student: null },
  { id: 7, computer_id: 'PC-07', name: 'Workstation 07', location: 'Computer Laboratory', status: 'Available', active_student: null },
  { id: 8, computer_id: 'PC-08', name: 'Workstation 08', location: 'Computer Laboratory', status: 'Occupied', active_student: 'alex2026' },
  { id: 9, computer_id: 'PC-09', name: 'Workstation 09', location: 'Computer Laboratory', status: 'Available', active_student: null },
  { id: 10, computer_id: 'PC-10', name: 'Workstation 10', location: 'Computer Laboratory', status: 'Available', active_student: null },
  { id: 11, computer_id: 'PC-11', name: 'Workstation 11', location: 'Computer Laboratory', status: 'Available', active_student: null },
  { id: 12, computer_id: 'PC-12', name: 'Workstation 12', location: 'Computer Laboratory', status: 'Available', active_student: null },
  { id: 13, computer_id: 'PC-13', name: 'Workstation 13', location: 'Computer Laboratory', status: 'Available', active_student: null },
  { id: 14, computer_id: 'PC-14', name: 'Workstation 14', location: 'Computer Laboratory', status: 'Available', active_student: null },
  { id: 15, computer_id: 'PC-15', name: 'Workstation 15', location: 'Computer Laboratory', status: 'Available', active_student: null },
  { id: 16, computer_id: 'PC-16', name: 'Workstation 16', location: 'Computer Laboratory', status: 'Available', active_student: null },
  { id: 17, computer_id: 'PC-17', name: 'Workstation 17', location: 'Computer Laboratory', status: 'Available', active_student: null },
  { id: 18, computer_id: 'PC-18', name: 'Workstation 18', location: 'Computer Laboratory', status: 'Available', active_student: null },
  { id: 19, computer_id: 'PC-19', name: 'Workstation 19', location: 'Computer Laboratory', status: 'Available', active_student: null },
  { id: 20, computer_id: 'PC-20', name: 'Workstation 20', location: 'Computer Laboratory', status: 'Available', active_student: null },
  { id: 21, computer_id: 'PC-21', name: 'Workstation 21', location: 'Computer Laboratory', status: 'Available', active_student: null },
  { id: 22, computer_id: 'PC-22', name: 'Workstation 22', location: 'Computer Laboratory', status: 'Available', active_student: null },
  { id: 23, computer_id: 'PC-23', name: 'Workstation 23', location: 'Computer Laboratory', status: 'Available', active_student: null },
  { id: 24, computer_id: 'PC-24', name: 'Workstation 24', location: 'Computer Laboratory', status: 'Available', active_student: null },
  { id: 25, computer_id: 'PC-25', name: 'Workstation 25', location: 'Computer Laboratory', status: 'Available', active_student: null },
  { id: 26, computer_id: 'PC-26', name: 'Workstation 26', location: 'Computer Laboratory', status: 'Available', active_student: null },
  { id: 27, computer_id: 'PC-27', name: 'Workstation 27', location: 'Computer Laboratory', status: 'Available', active_student: null },
  { id: 28, computer_id: 'PC-28', name: 'Workstation 28', location: 'Computer Laboratory', status: 'Available', active_student: null },
  { id: 29, computer_id: 'PC-29', name: 'Workstation 29', location: 'Computer Laboratory', status: 'Available', active_student: null },
  { id: 30, computer_id: 'PC-30', name: 'Workstation 30', location: 'Computer Laboratory', status: 'Available', active_student: null },
];
const initialStudents: Profile[] = [
  { username: 'juan123', first_name: 'Juan', last_name: 'Dela Cruz', student_id: '2026-001', role: 'Student' },
  { username: 'maria01', first_name: 'Maria', last_name: 'Santos', student_id: '2026-002', role: 'Student' },
  { username: 'alex2026', first_name: 'Alex', last_name: 'Reyes', student_id: '2026-003', role: 'Student' },
  { username: 'bea04', first_name: 'Bea', last_name: 'Garcia', student_id: '2026-004', role: 'Student' },
];

const initialSessions: LabSession[] = [
  { id: 1, student_username: 'juan123', computer_id: 'PC-01', login_at: '2026-10-11T08:15:00', logout_at: null, is_active: true },
  { id: 2, student_username: 'maria01', computer_id: 'PC-03', login_at: '2026-10-11T08:30:00', logout_at: null, is_active: true },
  { id: 3, student_username: 'alex2026', computer_id: 'PC-08', login_at: '2026-10-11T09:00:00', logout_at: null, is_active: true },
  { id: 4, student_username: 'bea04', computer_id: 'PC-02', login_at: '2026-10-10T13:00:00', logout_at: '2026-10-10T14:30:00', is_active: false },
];

const defaultSettings: SystemSettings = {
  laboratoryName: 'Computer Laboratory 1',
  roomNumber: 'Room 101',
  requireStudentLogin: true,
  registeredUsersOnly: true,
  sessionLogging: true,
  computerMonitoring: true,
  autoLogout: true,
  sessionLimit: 120,
  offlineAlerts: true,
  unauthorizedAlerts: true,
};

function App() {
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [mode, setMode] = useState<AuthMode>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [studentId, setStudentId] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [page, setPage] = useState('Dashboard');
  const [computers, setComputers] = useState(initialComputers);
  const [students, setStudents] = useState(initialStudents);
  const [sessions, setSessions] = useState(initialSessions);
  const [registeredAccounts, setRegisteredAccounts] = useState<Record<string, { password: string; profile: Profile }>>({});
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [settings, setSettings] = useState<SystemSettings>({ ...defaultSettings });
  const [savedSettings, setSavedSettings] = useState<SystemSettings>({ ...defaultSettings });

  function updateSetting<K extends keyof SystemSettings>(key: K, value: SystemSettings[K]) {
    setSettings(previous => ({ ...previous, [key]: value }));
  }

  function saveSettings() {
    setSavedSettings({ ...settings });
    setNotice('System settings saved successfully.');
    setError('');
  }

  function cancelSettings() {
    setSettings({ ...savedSettings });
    setNotice('');
    setError('');
  }

  const occupied = computers.filter(pc => pc.status === 'Occupied').length;
  const available = computers.filter(pc => pc.status === 'Available').length;
  const activeSessions = sessions.filter(session => session.is_active).length;

  function signOut() {
    setShowSignOutConfirm(false);
    setProfile(null);
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setError('');
    setNotice('');
    setPage('Dashboard');
    setSearch('');
  }

  function handleLogin(event: FormEvent) {
    event.preventDefault();
    setError('');
    setNotice('');

    const name = username.trim();

    if (!name || !password) {
      setError('Please enter your username and password.');
      return;
    }

    const saved = registeredAccounts[name];
    let current: Profile;

    if (saved && saved.password === password) {
      current = saved.profile;
    } else if (saved) {
      setError('Incorrect demo password.');
      return;
    } else if (name.toLowerCase() === 'admin') {
      current = { username: name, first_name: 'Lab', last_name: 'Administrator', student_id: '', role: 'Admin' };
    } else if (name.toLowerCase() === 'teacher') {
      current = { username: name, first_name: 'Demo', last_name: 'Teacher', student_id: '', role: 'Teacher' };
    } else {
      const student = students.find(s => s.username === name);
      current = {
        username: name,
        first_name: student?.first_name || name,
        last_name: student?.last_name || '',
        student_id: student?.student_id || 'DEMO-STUDENT',
        role: 'Student',
      };
    }

    setProfile(current);
    setPage('Dashboard');
    setNotice('');
  }

  function handleRegister(event: FormEvent) {
    event.preventDefault();
    setError('');
    setNotice('');

    const name = username.trim();
    const id = studentId.trim();

    if (!name || !id || !password) {
      setError('Please complete the required fields.');
      return;
    }

    if (password.length < 8) {
      setError('Password must contain at least 8 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (registeredAccounts[name] || students.some(s => s.username === name)) {
      setError('This demo username is already registered.');
      return;
    }

    if (students.some(s => s.student_id === id)) {
      setError('This demo Student ID is already registered.');
      return;
    }

    const newProfile: Profile = {
      username: name,
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      student_id: id,
      role: 'Student',
    };

    setRegisteredAccounts(previous => ({
      ...previous,
      [name]: { password, profile: newProfile },
    }));

    setStudents(previous => [...previous, newProfile]);
    setMode('login');
    setPassword('');
    setConfirmPassword('');
    setNotice('Demo registration successful! You can now sign in using your demo account.');
  }

  function startDemoSession(computer: Computer) {
    if (!profile || profile.role !== 'Student') return;

    if (computer.status !== 'Available') {
      setError('This computer is not available in the demo.');
      return;
    }

    const newSession: LabSession = {
      id: Date.now(),
      student_username: profile.username,
      computer_id: computer.computer_id,
      login_at: new Date().toISOString(),
      logout_at: null,
      is_active: true,
    };

    setSessions(previous => [newSession, ...previous]);
    setComputers(previous => previous.map(pc =>
      pc.id === computer.id
        ? { ...pc, status: 'Occupied', active_student: profile.username }
        : pc
    ));

    setNotice(`Demo session started on ${computer.computer_id}.`);
    setError('');
    setPage('My Session');
  }

  function endSession(id: number) {
    const session = sessions.find(item => item.id === id);
    if (!session) return;

    setSessions(previous => previous.map(item =>
      item.id === id
        ? { ...item, is_active: false, logout_at: new Date().toISOString() }
        : item
    ));

    setComputers(previous => previous.map(pc =>
      pc.computer_id === session.computer_id
        ? { ...pc, status: 'Available', active_student: null }
        : pc
    ));

    setNotice('Demo session ended successfully.');
    setError('');
  }

  function toggleComputer(id: number) {
    setComputers(previous => previous.map(pc => {
      if (pc.id !== id || pc.status === 'Occupied') return pc;

      return {
        ...pc,
        status: pc.status === 'Disabled' ? 'Available' : 'Disabled',
        active_student: null,
      };
    }));

    setNotice('Demo computer status updated.');
    setError('');
  }

  if (!profile) {
    return (
      <main className="auth-page">
        <section className="auth-card">
          <div className="brand-mark"><ShieldCheck size={30} /></div>
          <p className="eyebrow">LABORATORY MONITORING SYSTEM</p>
          <h1>LabGuard</h1>
          <p className="muted auth-subtitle">A smarter way to monitor computer laboratory sessions.</p>

          <div className="demo-warning">
            <AlertCircle size={17} />
            <span>UI prototype only. Demo accounts and records are not saved to the Django database.</span>
          </div>

          <div className="auth-tabs">
            <button type="button" className={mode === 'login' ? 'active' : ''} onClick={() => { setMode('login'); setError(''); setNotice(''); }}>
              Sign in
            </button>
            <button type="button" className={mode === 'register' ? 'active' : ''} onClick={() => { setMode('register'); setError(''); setNotice(''); }}>
              Student registration
            </button>
          </div>

          <form onSubmit={mode === 'login' ? handleLogin : handleRegister} className="form-stack">
            {mode === 'register' && (
              <>
                <div className="form-row">
                  <label>First name<input value={firstName} onChange={e => setFirstName(e.target.value)} /></label>
                  <label>Last name<input value={lastName} onChange={e => setLastName(e.target.value)} /></label>
                </div>
                <label>Student ID<input value={studentId} onChange={e => setStudentId(e.target.value)} required /></label>
              </>
            )}

            <label>Username<input value={username} onChange={e => setUsername(e.target.value)} required autoComplete="username" /></label>
            <label>Password<input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={8} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} /></label>

            {mode === 'register' && (
              <label>Confirm password<input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required minLength={8} autoComplete="new-password" /></label>
            )}

            {error && <p className="message error"><AlertCircle size={16} />{error}</p>}
            {notice && <p className="message success"><CheckCircle2 size={16} />{notice}</p>}

            <button className="primary-btn" type="submit">
              {mode === 'login' ? 'Sign in' : 'Create demo account'} <ArrowRight size={17} />
            </button>
          </form>

          <div className="panel quick-demo">
            <strong>Quick demo access</strong>
            <p className="muted">Choose a demo role to preview the interface.</p>
            <div className="form-row quick-demo-buttons">
              <button className="outline-btn" type="button" onClick={() => { setUsername('admin'); setPassword('demo12345'); setMode('login'); setError(''); }}>Admin</button>
              <button className="outline-btn" type="button" onClick={() => { setUsername('teacher'); setPassword('demo12345'); setMode('login'); setError(''); }}>Teacher</button>
              <button className="outline-btn" type="button" onClick={() => { setUsername('juan123'); setPassword('demo12345'); setMode('login'); setError(''); }}>Student</button>
            </div>
            <p className="muted quick-demo-note">For the built-in demo accounts, any non-empty password works.</p>
          </div>

          <p className="auth-footnote">Prototype demonstration — no real authentication or Windows restrictions.</p>
        </section>
      </main>
    );
  }

  if (profile.role === 'Student') {
    const mySession = sessions.find(s => s.student_username === profile.username && s.is_active);

    return (
      <main className="student-page">
        <header className="student-header">
          <div className="brand-inline">
            <span className="brand-small"><ShieldCheck size={21} /></span>
            <div><strong>LabGuard</strong><small>Student workstation portal</small></div>
          </div>
          <button type="button" className="outline-btn" onClick={() => setShowSignOutConfirm(true)}>
            <LogOut size={16} /> Sign out
          </button>
        </header>

        {showSignOutConfirm && (
          <SignOutConfirmation
            role={profile.role}
            onCancel={() => setShowSignOutConfirm(false)}
            onConfirm={signOut}
          />
        )}

        <section className="student-panel">
          <div className="student-icon"><GraduationCap size={30} /></div>
          <p className="eyebrow">STUDENT PORTAL</p>
          <h1>Welcome, {profile.first_name || profile.username}!</h1>
          <p className="muted">View computer availability and manage your demo lab session.</p>

          <div className="session-summary">
            <div><span className="field-label">Student ID</span><strong>{profile.student_id || 'Not set'}</strong></div>
            <div><span className="field-label">Username</span><strong>{profile.username}</strong></div>
            <div><span className="field-label">Session status</span><strong className={mySession ? 'text-green' : 'text-amber'}>{mySession ? 'Active' : 'No active session'}</strong></div>
            {mySession && <div><span className="field-label">Computer</span><strong>{mySession.computer_id}</strong></div>}
          </div>

          {error && <p className="message error"><AlertCircle size={16} />{error}</p>}
          {notice && <p className="message success"><CheckCircle2 size={16} />{notice}</p>}

          {mySession ? (
            <button className="primary-btn" onClick={() => endSession(mySession.id)}>
              <LogOut size={17} /> End demo session
            </button>
          ) : (
            <section className="panel">
              <h2>Available computers</h2>
              <div className="computer-grid">
                {computers.filter(pc => pc.status === 'Available').map(pc => (
                  <div className="stat-card" key={pc.id}>
                    <Monitor size={22} />
                    <strong>{pc.computer_id}</strong>
                    <small>{pc.name}</small>
                    <button className="primary-btn" onClick={() => startDemoSession(pc)}>Start demo session</button>
                  </div>
                ))}
                {!computers.some(pc => pc.status === 'Available') && <EmptyState text="No computers are currently available." />}
              </div>
            </section>
          )}

          <div className="demo-warning wide"><AlertCircle size={17} /><span>Demo only: this does not lock Windows or control the actual computer.</span></div>
        </section>
      </main>
    );
  }

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard },
    { label: 'Computers', icon: Monitor },
    { label: 'Sessions', icon: Clock3 },
    { label: 'Activity Logs', icon: Activity },
    { label: 'Students', icon: Users },
    ...(profile.role === 'Admin' ? [{ label: 'Settings', icon: LockKeyhole }] : []),
  ];

  const filteredComputers = computers.filter(pc =>
    `${pc.computer_id} ${pc.name} ${pc.location} ${pc.status} ${pc.active_student || ''}`.toLowerCase().includes(search.toLowerCase())
  );

  const filteredStudents = students.filter(student =>
    `${student.username} ${student.first_name} ${student.last_name} ${student.student_id}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="brand-small"><ShieldCheck size={22} /></span>
          <div><strong>LabGuard</strong><small>Lab monitoring</small></div>
        </div>

        <div className="sidebar-label">WORKSPACE</div>

        <nav>
          {navItems.map(item => (
            <button
              type="button"
              key={item.label}
              className={page === item.label ? 'nav-item active' : 'nav-item'}
              onClick={() => { setPage(item.label); setSearch(''); setError(''); setNotice(''); }}
            >
              <item.icon size={18} />{item.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="user-chip">
            <div className="avatar">{profile.username.slice(0, 1).toUpperCase()}</div>
            <div className="user-details"><strong>{profile.username}</strong><small>{profile.role}</small></div>
          </div>
          <button type="button" className="nav-item signout" onClick={() => setShowSignOutConfirm(true)}>
            <LogOut size={18} />Sign out
          </button>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div><p className="eyebrow">LABORATORY CONTROL</p><h1>{page}</h1></div>
          <div className="topbar-right">
            <span className="status-pill"><span className="status-dot" /> Demo mode</span>
            <button type="button" className="icon-btn" title="Reset demo records" onClick={() => {
              setComputers(initialComputers);
              setSessions(initialSessions);
              setStudents(initialStudents);
              setNotice('Demo data reset.');
              setError('');
            }}>
              <RefreshCw size={18} />
            </button>
            <div className="top-user"><strong>{profile.username}</strong><span>{profile.role}</span></div>
          </div>
        </header>

        <div className="content-area">
          {error && <p className="message error"><AlertCircle size={16} />{error}</p>}
          {notice && <p className="message success"><CheckCircle2 size={16} />{notice}</p>}

          {page === 'Dashboard' && (
            <>
              <div className="welcome-row">
                <div><h2>Laboratory overview</h2><p className="muted">A quick view of laboratory computers and student sessions.</p></div>
                <button type="button" className="outline-btn" onClick={() => { setNotice('Demo data is up to date.'); setError(''); }}><RefreshCw size={16} /> Refresh</button>
              </div>

              <div className="stats-grid">
                {[
                  { label: 'Total computers', value: computers.length, icon: Monitor },
                  { label: 'Available PCs', value: available, icon: CheckCircle2 },
                  { label: 'Occupied PCs', value: occupied, icon: Activity },
                  { label: 'Registered students', value: students.length, icon: Users },
                ].map(card => (
                  <div className="stat-card" key={card.label}>
                    <div className="stat-top"><span>{card.label}</span><card.icon size={19} /></div>
                    <strong>{card.value}</strong><small>Sample prototype data</small>
                  </div>
                ))}
              </div>

              <section className="panel">
                <div className="panel-heading">
                  <div><h2>Current computer status</h2><p className="muted">Sample workstation availability.</p></div>
                  <button type="button" className="text-btn" onClick={() => { setPage('Computers'); setNotice(''); }} >View all <ArrowRight size={15} /></button>
                </div>
                <ComputerTable computers={computers.slice(0, 5)} onToggle={toggleComputer} />
              </section>

              <section className="panel">
                <div className="panel-heading">
                  <div><h2>Recent sessions</h2><p className="muted">Latest sample login records.</p></div>
                  <button type="button" className="text-btn" onClick={() => { setPage('Sessions'); setNotice(''); }}>View all <ArrowRight size={15} /></button>
                </div>
                <SessionTable sessions={sessions.slice(0, 4)} onEnd={endSession} />
              </section>
            </>
          )}

          {page === 'Computers' && (
            <section className="panel">
              <div className="panel-heading">
                <div><h2>Computer monitoring</h2><p className="muted">Search workstations and change their demo status.</p></div>
              </div>
              <label className="search-box"><Search size={17} /><input placeholder="Search computers..." value={search} onChange={e => setSearch(e.target.value)} /></label>
              <ComputerTable computers={filteredComputers} onToggle={toggleComputer} />
              <p className="muted table-note">Occupied computers cannot be disabled until their demo session ends.</p>
            </section>
          )}

          {page === 'Sessions' && (
            <section className="panel">
              <div className="panel-heading"><div><h2>Lab sessions</h2><p className="muted">{activeSessions} active demo sessions.</p></div></div>
              <SessionTable sessions={sessions} onEnd={endSession} />
            </section>
          )}

          {page === 'Activity Logs' && (
            <section className="panel">
              <div className="panel-heading"><div><h2>Activity logs</h2><p className="muted">Sample session history for demonstration.</p></div></div>
              <SessionTable sessions={sessions} onEnd={endSession} />
            </section>
          )}

          {page === 'Students' && (
            <section className="panel">
              <div className="panel-heading"><div><h2>Student management</h2><p className="muted">{students.length} sample student records.</p></div></div>
              <label className="search-box"><Search size={17} /><input placeholder="Search students..." value={search} onChange={e => setSearch(e.target.value)} /></label>
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Student ID</th><th>Username</th><th>First name</th><th>Last name</th><th>Role</th></tr></thead>
                  <tbody>
                    {filteredStudents.map(student => (
                      <tr key={student.username}>
                        <td>{student.student_id || '—'}</td>
                        <td><strong>{student.username}</strong></td>
                        <td>{student.first_name || '—'}</td>
                        <td>{student.last_name || '—'}</td>
                        <td><span className="badge badge-available"><span />{student.role}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {!filteredStudents.length && <EmptyState text="No matching students found." />}
              </div>
            </section>
          )}

          {page === 'Settings' && profile.role === 'Admin' && (
            <div className="settings-page">
              <section className="panel settings-panel">
                <div className="panel-heading">
                  <div><h2>Laboratory Configuration</h2><p className="muted">Manage the laboratory's general information.</p></div>
                </div>
                <div className="form-row">
                  <label>Laboratory Name<input value={settings.laboratoryName} onChange={e => updateSetting('laboratoryName', e.target.value)} /></label>
                  <label>Room Number<input value={settings.roomNumber} onChange={e => updateSetting('roomNumber', e.target.value)} /></label>
                </div>
              </section>

              <section className="panel settings-panel">
                <div className="panel-heading">
                  <div><h2>Security & Access Control</h2><p className="muted">Configure student authentication and access policies.</p></div>
                </div>
                <div className="settings-list">
                  <label className="setting-option">
                    <span><strong>Require Student Login</strong><small>Require students to sign in before using a workstation.</small></span>
                    <input type="checkbox" checked={settings.requireStudentLogin} onChange={e => updateSetting('requireStudentLogin', e.target.checked)} />
                  </label>
                  <label className="setting-option">
                    <span><strong>Registered Users Only</strong><small>Allow access only to registered student accounts.</small></span>
                    <input type="checkbox" checked={settings.registeredUsersOnly} onChange={e => updateSetting('registeredUsersOnly', e.target.checked)} />
                  </label>
                </div>
              </section>

              <section className="panel settings-panel">
                <div className="panel-heading">
                  <div><h2>Computer Management</h2><p className="muted">Configure workstation monitoring preferences.</p></div>
                </div>
                <label className="setting-option">
                  <span><strong>Computer Status Monitoring</strong><small>Enable workstation status monitoring in the system.</small></span>
                  <input type="checkbox" checked={settings.computerMonitoring} onChange={e => updateSetting('computerMonitoring', e.target.checked)} />
                </label>
              </section>

              <section className="panel settings-panel">
                <div className="panel-heading">
                  <div><h2>Session Policies</h2><p className="muted">Set the session duration and activity recording preferences.</p></div>
                </div>
                <label className="setting-option">
                  <span><strong>Session Logging</strong><small>Record student login and logout activity.</small></span>
                  <input type="checkbox" checked={settings.sessionLogging} onChange={e => updateSetting('sessionLogging', e.target.checked)} />
                </label>
                <label className="setting-option">
                  <span><strong>Automatic Logout</strong><small>Configure automatic session termination.</small></span>
                  <input type="checkbox" checked={settings.autoLogout} onChange={e => updateSetting('autoLogout', e.target.checked)} />
                </label>
                <label>
                  Maximum Session Duration
                  <select value={settings.sessionLimit} onChange={e => updateSetting('sessionLimit', Number(e.target.value))}>
                    <option value={30}>30 minutes</option>
                    <option value={60}>1 hour</option>
                    <option value={120}>2 hours</option>
                    <option value={180}>3 hours</option>
                    <option value={240}>4 hours</option>
                  </select>
                </label>
              </section>

              <section className="panel settings-panel">
                <div className="panel-heading">
                  <div><h2>Account & Role Management</h2><p className="muted">Manage user accounts and access permissions.</p></div>
                </div>
                <div className="settings-list">
                  <div><strong>Administrator Access</strong><span>Manage system configuration and user permissions.</span></div>
                  <div><strong>Teacher Access</strong><span>Monitor workstations and manage student sessions.</span></div>
                  <div><strong>Student Access</strong><span>Sign in and manage personal laboratory sessions.</span></div>
                </div>
                <button type="button" className="outline-btn" onClick={() => setPage('Students')}><Users size={16} /> Manage Student Accounts</button>
              </section>

              <section className="panel settings-panel">
                <div className="panel-heading">
                  <div><h2>System Notifications</h2><p className="muted">Choose which system alerts should be enabled.</p></div>
                </div>
                <label className="setting-option">
                  <span><strong>Offline Computer Alerts</strong><small>Enable alerts for unavailable workstations.</small></span>
                  <input type="checkbox" checked={settings.offlineAlerts} onChange={e => updateSetting('offlineAlerts', e.target.checked)} />
                </label>
                <label className="setting-option">
                  <span><strong>Unauthorized Login Alerts</strong><small>Enable alerts for unauthorized access attempts.</small></span>
                  <input type="checkbox" checked={settings.unauthorizedAlerts} onChange={e => updateSetting('unauthorizedAlerts', e.target.checked)} />
                </label>
              </section>

              <section className="panel settings-panel">
                <div className="panel-heading">
                  <div><h2>Data & Maintenance</h2><p className="muted">Restore the default configuration or reset demonstration records.</p></div>
                </div>
                <div className="settings-actions">
                  <button type="button" className="outline-btn" onClick={() => { setSettings({ ...defaultSettings }); setNotice('Default settings restored. Save to apply them.'); setError(''); }}>
                    <RefreshCw size={16} /> Restore Defaults
                  </button>
                  <button type="button" className="outline-btn" onClick={() => { setComputers(initialComputers); setSessions(initialSessions); setStudents(initialStudents); setNotice('Sample records restored.'); setError(''); }}>
                    <RefreshCw size={16} /> Reset Demo Records
                  </button>
                </div>
              </section>

              <div className="settings-footer">
                <button type="button" className="outline-btn" onClick={cancelSettings}>Cancel</button>
                <button type="button" className="primary-btn" onClick={saveSettings}><CheckCircle2 size={16} /> Save Changes</button>
              </div>
            </div>
          )}

          {page === 'My Session' && (
            <section className="panel">
              <div className="panel-heading"><div><h2>Session created</h2><p className="muted">The demo session has been recorded in browser memory.</p></div></div>
              <p>You can return to the dashboard or sign out.</p>
              <button type="button" className="primary-btn" onClick={() => setPage('Dashboard')}>Back to dashboard</button>
            </section>
          )}

          <footer className="app-footer"><LockKeyhole size={15} /> UI prototype • Sample data only • Windows lockdown not implemented</footer>
        </div>
      </main>

      {showSignOutConfirm && (
        <SignOutConfirmation
          role={profile.role}
          onCancel={() => setShowSignOutConfirm(false)}
          onConfirm={signOut}
        />
      )}
    </div>
  );
}

function SignOutConfirmation({
  role,
  onCancel,
  onConfirm,
}: {
  role: Role;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const accountType = role === 'Student' ? 'student' : role === 'Admin' ? 'administrator' : 'teacher';

  return (
    <div className="confirm-overlay" onClick={onCancel}>
      <section
        className="confirm-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="signout-title"
        onClick={event => event.stopPropagation()}
      >
        <div className="confirm-icon"><LogOut size={24} /></div>
        <h2 id="signout-title">Sign out?</h2>
        <p>Are you sure you want to sign out of your {accountType} account?</p>
        <div className="confirm-actions">
          <button type="button" className="outline-btn" onClick={onCancel}>Cancel</button>
          <button type="button" className="primary-btn" onClick={onConfirm}>
            <LogOut size={16} /> Yes, sign out
          </button>
        </div>
      </section>
    </div>
  );
}

function ComputerTable({ computers, onToggle }: { computers: Computer[]; onToggle: (id: number) => void }) {
  if (!computers.length) return <EmptyState text="No matching computers found." />;

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr><th>Computer</th><th>Location</th><th>Current student</th><th>Status</th><th>Demo action</th></tr>
        </thead>
        <tbody>
          {computers.map(pc => (
            <tr key={pc.id}>
              <td>
                <div className="computer-cell">
                  <span className="table-icon"><Monitor size={17} /></span>
                  <div><strong>{pc.computer_id}</strong><small>{pc.name}</small></div>
                </div>
              </td>
              <td>{pc.location}</td>
              <td>{pc.active_student || '—'}</td>
              <td>
                <span className={`badge ${pc.status === 'Occupied' ? 'badge-occupied' : pc.status === 'Available' ? 'badge-available' : 'badge-disabled'}`}>
                  <span />{pc.status}
                </span>
              </td>
              <td>{pc.status === 'Occupied' ? 'In use' : <button type="button" className="small-action" onClick={() => onToggle(pc.id)}>{pc.status === 'Disabled' ? 'Enable' : 'Disable'}</button>}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SessionTable({ sessions, onEnd }: { sessions: LabSession[]; onEnd: (id: number) => void }) {
  if (!sessions.length) return <EmptyState text="No demo sessions recorded." />;

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr><th>Student</th><th>Computer</th><th>Login time</th><th>Logout time</th><th>Status</th><th>Action</th></tr>
        </thead>
        <tbody>
          {sessions.map(session => (
            <tr key={session.id}>
              <td><strong>{session.student_username}</strong></td>
              <td>{session.computer_id}</td>
              <td>{new Date(session.login_at).toLocaleString()}</td>
              <td>{session.logout_at ? new Date(session.logout_at).toLocaleString() : '—'}</td>
              <td>
                <span className={`badge ${session.is_active ? 'badge-occupied' : 'badge-available'}`}>
                  <span />{session.is_active ? 'Active' : 'Ended'}
                </span>
              </td>
              <td>{session.is_active ? <button type="button" className="small-action" onClick={() => onEnd(session.id)}>End session</button> : '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return <div className="empty-state"><Monitor size={26} /><p>{text}</p></div>;
}

export default App;
