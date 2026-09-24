import { useEffect, useMemo, useState } from 'react'
import './App.css'

const companies = [
  { name: 'TCS', detail: 'Technology services' }, { name: 'Infosys', detail: 'Digital innovation' },
  { name: 'Wipro', detail: 'IT consulting' }, { name: 'HCLTech', detail: 'Engineering & R&D' },
  { name: 'Accenture', detail: 'Strategy & technology' }, { name: 'Cognizant', detail: 'Business technology' },
  { name: 'Capgemini', detail: 'Consulting & services' }, { name: 'IBM', detail: 'Cloud & AI' },
  { name: 'Deloitte', detail: 'Advisory & consulting' }, { name: 'Microsoft', detail: 'Product engineering' },
]
const initialForm = { studentName: '', rollNumber: '', dateOfBirth: '', bloodGroup: '', phone: '', email: '', address: '', department: '', gender: '', year: '', section: '', arrears: '' }
const departments = ['Computer Science & Engineering', 'Information Technology', 'Electronics & Communication', 'Electrical & Electronics', 'Mechanical Engineering', 'Civil Engineering']

function App() {
  const [activeView, setActiveView] = useState('register')
  const [step, setStep] = useState(1)
  const [form, setForm] = useState(initialForm)
  const [selectedCompanies, setSelectedCompanies] = useState([])
  const [registrations, setRegistrations] = useState(() => { try { return JSON.parse(localStorage.getItem('campus-registrations')) || [] } catch { return [] } })
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState('')

  useEffect(() => { localStorage.setItem('campus-registrations', JSON.stringify(registrations)) }, [registrations])
  const groupedRegistrations = useMemo(() => companies.map((company) => ({ ...company, students: registrations.filter((registration) => registration.companies.includes(company.name)) })), [registrations])
  const updateField = (event) => { const { name, value } = event.target; setForm((current) => ({ ...current, [name]: value })) }
  const handleDetailsSubmit = (event) => { event.preventDefault(); if (Number(form.arrears) === 0) setStep(2) }
  const toggleCompany = (name) => setSelectedCompanies((current) => current.includes(name) ? current.filter((company) => company !== name) : current.length < 4 ? [...current, name] : current)
  const handleRegistrationSubmit = async (event) => {
    event.preventDefault()
    setSubmitError('')
    try {
      const response = await fetch('http://localhost:5000/api/registrations', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, companies: selectedCompanies }) })
      if (!response.ok) throw new Error('Registration could not be saved')
      const registration = await response.json()
      setRegistrations((current) => [registration, ...current])
      setForm(initialForm)
      setSelectedCompanies([])
      setStep(1)
      setSubmitted(true)
    } catch (error) {
      setSubmitError(error.message)
    }
  }
  const startRegistration = () => { setActiveView('register'); setSubmitted(false) }

  return (
    <div className="app-shell">
      <header className="topbar"><a className="brand" href="#top" onClick={startRegistration}><span className="brand-mark">N</span><span><strong>NEXUS</strong><small>CAREER CELL</small></span></a><nav className="main-nav"><button className={activeView === 'register' ? 'nav-link active' : 'nav-link'} onClick={startRegistration}>Student registration</button><button className={activeView === 'admin' ? 'nav-link active' : 'nav-link'} onClick={() => setActiveView('admin')}>Admin view <span className="nav-badge">{registrations.length}</span></button></nav><span className="secure-label"><span className="lock-mark">*</span> Secure portal</span></header>
      <main id="top">{activeView === 'register' ? <section className="registration-page"><div className="page-intro"><div><p className="eyebrow">2024 - 25 PLACEMENT DRIVE</p><h1>Shape your <em>next move.</em></h1><p className="intro-copy">Register once, unlock the right opportunities. Your details help our placement team connect you with companies that match your ambition.</p></div><div className="intro-stat"><strong>10</strong><span>partner companies</span></div></div>
        <div className="progress-bar"><div className="progress-step current"><span>01</span><div><strong>Student details</strong><small>Tell us about you</small></div></div><div className="progress-line"><span className={step === 2 ? 'filled' : ''}></span></div><div className={step === 2 ? 'progress-step current' : 'progress-step'}><span>02</span><div><strong>Company preferences</strong><small>Choose your top four</small></div></div></div>
        {submitted && <div className="success-banner"><span className="success-icon">OK</span><div><strong>Registration received</strong><p>Your preferences are saved. The career cell will be in touch with next steps.</p></div><button onClick={() => setSubmitted(false)} aria-label="Dismiss success message">x</button></div>}
        {submitError && <div className="success-banner"><div><strong>Registration failed</strong><p>{submitError}. Please try again.</p></div><button onClick={() => setSubmitError('')} aria-label="Dismiss error message">x</button></div>}
        {step === 1 ? <form className="form-panel" onSubmit={handleDetailsSubmit}><div className="section-heading"><span className="section-number">01</span><div><h2>Personal & academic details</h2><p>All fields are required unless marked optional.</p></div></div><div className="form-grid">
          <label className="field span-2"><span>Student name</span><input name="studentName" value={form.studentName} onChange={updateField} placeholder="e.g. Ananya Sharma" required /></label><label className="field"><span>Roll number</span><input name="rollNumber" value={form.rollNumber} onChange={updateField} placeholder="e.g. CSE24A001" required /></label><label className="field"><span>Date of birth</span><input type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={updateField} required /></label><label className="field"><span>Blood group</span><select name="bloodGroup" value={form.bloodGroup} onChange={updateField} required><option value="">Select group</option>{['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((group) => <option key={group}>{group}</option>)}</select></label><label className="field"><span>Phone number</span><input type="tel" name="phone" value={form.phone} onChange={updateField} placeholder="10-digit mobile number" pattern="[0-9]{10}" required /></label><label className="field span-2"><span>Email ID</span><input type="email" name="email" value={form.email} onChange={updateField} placeholder="you@college.edu" required /></label><label className="field span-2"><span>Address</span><textarea name="address" value={form.address} onChange={updateField} placeholder="Your current address" rows="3" required></textarea></label><label className="field span-2"><span>Department of engineering</span><select name="department" value={form.department} onChange={updateField} required><option value="">Select your department</option>{departments.map((department) => <option key={department}>{department}</option>)}</select></label><label className="field"><span>Gender</span><select name="gender" value={form.gender} onChange={updateField} required><option value="">Select</option><option>Female</option><option>Male</option><option>Non-binary</option><option>Prefer not to say</option></select></label><label className="field"><span>Year</span><select name="year" value={form.year} onChange={updateField} required><option value="">Select year</option><option>1st year</option><option>2nd year</option><option>3rd year</option><option>4th year</option></select></label><label className="field"><span>Section</span><input name="section" value={form.section} onChange={updateField} placeholder="e.g. A" required /></label><label className="field"><span>Number of arrears</span><input type="number" name="arrears" value={form.arrears} onChange={updateField} min="0" placeholder="0" required /><small className="field-note">Only students with 0 arrears can continue.</small></label>
        </div><div className="form-footer"><span className="required-note"><i>*</i> Required fields</span><button className="primary-button" type="submit">Continue to preferences <span>-&gt;</span></button></div></form> : <form className="form-panel company-panel" onSubmit={handleRegistrationSubmit}><div className="section-heading"><span className="section-number">02</span><div><h2>Choose your company preferences</h2><p>Select exactly four companies in the order you prefer them.</p></div><span className="selection-count">{selectedCompanies.length}<small> / 4 selected</small></span></div><div className="company-grid">{companies.map((company, index) => { const selected = selectedCompanies.includes(company.name); const preference = selectedCompanies.indexOf(company.name) + 1; return <button type="button" className={selected ? 'company-card selected' : 'company-card'} key={company.name} onClick={() => toggleCompany(company.name)}><span className="company-number">{String(index + 1).padStart(2, '0')}</span><span className="company-logo">{company.name.slice(0, 1)}</span><span className="company-info"><strong>{company.name}</strong><small>{company.detail}</small></span><span className="choice-indicator">{selected ? `0${preference}` : '+'}</span></button> })}</div><div className="preference-tip"><span>i</span><p>Your first selection becomes preference 01. You can change the order by deselecting and selecting again.</p></div><div className="form-footer"><button className="back-button" type="button" onClick={() => setStep(1)}><span>&lt;-</span> Back to details</button><button className="primary-button" type="submit" disabled={selectedCompanies.length !== 4}>Submit registration <span>-&gt;</span></button></div></form>}</section> : <section className="admin-page"><div className="admin-heading"><div><p className="eyebrow">PLACEMENT OFFICE / ADMIN</p><h1>Registration overview</h1><p>Track student preferences and coordinate company-wise shortlisting.</p></div><button className="primary-button" onClick={startRegistration}>+ New registration</button></div><div className="overview-stats"><div><span>Total registrations</span><strong>{registrations.length}</strong></div><div><span>Companies listed</span><strong>{companies.length}</strong></div><div><span>Preferences submitted</span><strong>{registrations.length * 4}</strong></div><div><span>Top preference</span><strong>{groupedRegistrations.sort((a, b) => b.students.length - a.students.length)[0]?.name || '--'}</strong></div></div><div className="dashboard-toolbar"><div><h2>Company-wise registrations</h2><p>Students who selected each company in their preferences</p></div><span className="live-pill"><i></i> Live data</span></div><div className="company-table">{groupedRegistrations.map((company) => <div className="company-row" key={company.name}><div className="company-cell"><span className="company-logo">{company.name.slice(0, 1)}</span><div><strong>{company.name}</strong><small>{company.detail}</small></div></div><div className="student-count"><strong>{company.students.length}</strong><span>students</span></div><div className="student-list">{company.students.length ? company.students.slice(0, 3).map((student) => <span className="student-chip" key={student.id}>{student.studentName}<small>{student.rollNumber}</small></span>) : <span className="empty-state">No selections yet</span>}{company.students.length > 3 && <span className="more-chip">+{company.students.length - 3} more</span>}</div><span className="row-arrow">-&gt;</span></div>)}</div></section>}</main>
      <footer><span>NEXUS CAREER CELL</span><span>Student opportunity portal <i>·</i> 2024 - 25</span></footer>
    </div>
  )
}

export default App
