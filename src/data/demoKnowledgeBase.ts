import { DocumentItem, DocumentChunk } from '../types';

export const INITIAL_DEMO_DOCUMENTS: DocumentItem[] = [
  {
    id: 'doc-exam-rules-2026',
    name: 'Examination Rules.pdf',
    fileName: 'Examination_Rules_2026.pdf',
    fileType: 'pdf',
    fileSize: 2457600, // 2.4 MB
    category: 'Examination',
    version: '2.1',
    isActive: true,
    uploadedBy: 'Office of the Controller of Examinations',
    uploadedAt: '2026-08-10T09:30:00.000Z',
    updatedAt: '2026-08-10T09:30:00.000Z',
    status: 'completed',
    pageCount: 28,
    chunkCount: 6,
    description: 'Official regulations governing semester-end examinations, minimum attendance prerequisites, passing standards, and re-evaluation policies.',
    isDemo: true,
  },
  {
    id: 'doc-attendance-policy-2026',
    name: 'Attendance Policy.pdf',
    fileName: 'Campus_Attendance_Policy_2026.pdf',
    fileType: 'pdf',
    fileSize: 1240000,
    category: 'Attendance',
    version: '1.4',
    isActive: true,
    uploadedBy: 'Dean of Student Affairs',
    uploadedAt: '2026-07-25T11:15:00.000Z',
    updatedAt: '2026-07-25T11:15:00.000Z',
    status: 'completed',
    pageCount: 16,
    chunkCount: 4,
    description: 'Campus-wide attendance requirements, smart RFID portal logging, medical leaves, condonation ceilings, and disciplinary protocols.',
    isDemo: true,
  },
  {
    id: 'doc-academic-regulations-2026',
    name: 'Academic Regulations.pdf',
    fileName: 'BTech_Academic_Regulations_2025_2026.pdf',
    fileType: 'pdf',
    fileSize: 3145728,
    category: 'Academics',
    version: '3.0',
    isActive: true,
    uploadedBy: 'Academic Council Secretariat',
    uploadedAt: '2026-06-15T14:00:00.000Z',
    updatedAt: '2026-06-15T14:00:00.000Z',
    status: 'completed',
    pageCount: 42,
    chunkCount: 7,
    description: 'Choice-based credit system framework, degree conferral criteria, honors division, credit requirements, and disciplinary guidelines.',
    isDemo: true,
  },
  {
    id: 'doc-scholarship-guidelines-2026',
    name: 'Scholarship Guidelines.pdf',
    fileName: 'Scholarship_Assistance_Guidelines_2026.pdf',
    fileType: 'pdf',
    fileSize: 1850000,
    category: 'Scholarships',
    version: '2.0',
    isActive: true,
    uploadedBy: 'Financial Aid & Student Welfare Bureau',
    uploadedAt: '2026-07-01T10:00:00.000Z',
    updatedAt: '2026-07-01T10:00:00.000Z',
    status: 'completed',
    pageCount: 18,
    chunkCount: 5,
    description: 'Merit-cum-Means scholarships, fee waivers, required verification documents, renewal deadlines, and CGPA thresholds.',
    isDemo: true,
  },
  {
    id: 'doc-semester-timetable-2026',
    name: 'Semester Timetable.pdf',
    fileName: 'Academic_Calendar_Timetable_2026_2027.pdf',
    fileType: 'pdf',
    fileSize: 980000,
    category: 'Timetable',
    version: '1.0',
    isActive: true,
    uploadedBy: 'Central Scheduling Division',
    uploadedAt: '2026-08-01T16:20:00.000Z',
    updatedAt: '2026-08-01T16:20:00.000Z',
    status: 'completed',
    pageCount: 12,
    chunkCount: 4,
    description: 'Academic calendar, instruction start dates, mid-semester exams, semester end examination dates, and vacation blocks.',
    isDemo: true,
  },
  {
    id: 'doc-placement-guidelines-2026',
    name: 'Placement Cell Guidelines.pdf',
    fileName: 'Training_Placement_Cell_Guidelines_2026.pdf',
    fileType: 'pdf',
    fileSize: 2100000,
    category: 'Placements',
    version: '2.2',
    isActive: true,
    uploadedBy: 'Director of Training & Placement',
    uploadedAt: '2026-07-18T13:45:00.000Z',
    updatedAt: '2026-07-18T13:45:00.000Z',
    status: 'completed',
    pageCount: 22,
    chunkCount: 5,
    description: 'Campus placement eligibility, registration steps, dream job policies, resume verification, and mandatory training sessions.',
    isDemo: true,
  },
  {
    id: 'doc-student-handbook-2026',
    name: 'Student Handbook.pdf',
    fileName: 'Official_Student_Handbook_2026.pdf',
    fileType: 'pdf',
    fileSize: 4200000,
    category: 'Student Rules',
    version: '4.0',
    isActive: true,
    uploadedBy: 'Office of the Registrar',
    uploadedAt: '2026-06-20T08:30:00.000Z',
    updatedAt: '2026-06-20T08:30:00.000Z',
    status: 'completed',
    pageCount: 56,
    chunkCount: 8,
    description: 'Campus code of conduct, hostel rules and curfews, anti-ragging measures, central library facilities, health services, and grievance redressal.',
    isDemo: true,
  },
  {
    id: 'doc-college-events-notice-2026',
    name: 'College Events Notice.pdf',
    fileName: 'Campus_Events_Notices_2026.pdf',
    fileType: 'pdf',
    fileSize: 750000,
    category: 'Events',
    version: '1.1',
    isActive: true,
    uploadedBy: 'Student Council Activities Cell',
    uploadedAt: '2026-09-01T15:00:00.000Z',
    updatedAt: '2026-09-01T15:00:00.000Z',
    status: 'completed',
    pageCount: 8,
    chunkCount: 3,
    description: 'Upcoming annual cultural and technical fest AURA 2026, campus hackathon dates, sports meet, and NSS blood donation drive.',
    isDemo: true,
  },
];

export const INITIAL_DEMO_CHUNKS: DocumentChunk[] = [
  // Examination Rules
  {
    id: 'chunk-exam-1',
    documentId: 'doc-exam-rules-2026',
    documentName: 'Examination Rules.pdf',
    chunkIndex: 0,
    pageNumber: 1,
    section: 'General Examination Schedule',
    documentVersion: '2.1',
    chunkText: `The Semester End Examinations for the Academic Year 2026-2027 will commence on December 1, 2026, and conclude on December 22, 2026. Detailed individual timetables will be published on the campus examination portal 14 days before the exams. Hall tickets will be issued 7 days prior to examination commencement subject to clearance of dues and attendance eligibility.`,
  },
  {
    id: 'chunk-exam-2',
    documentId: 'doc-exam-rules-2026',
    documentName: 'Examination Rules.pdf',
    chunkIndex: 1,
    pageNumber: 12,
    section: 'Examination Eligibility',
    documentVersion: '2.1',
    chunkText: `Minimum Attendance Requirement: Students must maintain at least 75% attendance in each registered theory and laboratory course during the semester to be eligible to appear for the semester end examination. 
Students having attendance between 65% and 74% due to medical conditions or institutional sports representation may appeal for attendance condonation with valid documentation submitted to the Dean's office. Students with attendance below 65% are strictly detained and not permitted to sit for the examinations, requiring course repetition in the subsequent year.`,
  },
  {
    id: 'chunk-exam-3',
    documentId: 'doc-exam-rules-2026',
    documentName: 'Examination Rules.pdf',
    chunkIndex: 2,
    pageNumber: 15,
    section: 'Passing Criteria and Grading System',
    documentVersion: '2.1',
    chunkText: `A candidate shall be declared to have passed a course if they secure a minimum of 40% marks in the semester-end examination and an aggregate of 40% combining continuous internal assessment (CIE) and semester-end examination (SEE). The 10-point Letter Grade system applies from Grade O (Outstanding, 10 points) down to Grade F (Fail, 0 points).`,
  },
  {
    id: 'chunk-exam-4',
    documentId: 'doc-exam-rules-2026',
    documentName: 'Examination Rules.pdf',
    chunkIndex: 3,
    pageNumber: 19,
    section: 'Re-evaluation & Script Inspection',
    documentVersion: '2.1',
    chunkText: `Students desiring re-evaluation or photocopy of answer scripts must apply through the student portal within 10 days from the publication of results. The prescribed fee is ₹500 per paper for re-evaluation and ₹300 for answer script photocopy. Revised marks shall stand final if the variation is greater than 5% of maximum marks.`,
  },

  // Attendance Policy
  {
    id: 'chunk-att-1',
    documentId: 'doc-attendance-policy-2026',
    documentName: 'Attendance Policy.pdf',
    chunkIndex: 0,
    pageNumber: 2,
    section: 'Attendance Requirement & Monitoring',
    documentVersion: '1.4',
    chunkText: `Every student is mandated to attend a minimum of 75% of the total classes held in each course including lectures, tutorials, and practicals. Daily attendance is recorded via RFID biometric card readers and synchronized daily to the student portal by 5:00 PM. Parents and students can monitor live attendance percentages on the campus mobile app.`,
  },
  {
    id: 'chunk-att-2',
    documentId: 'doc-attendance-policy-2026',
    documentName: 'Attendance Policy.pdf',
    chunkIndex: 1,
    pageNumber: 5,
    section: 'Medical Leave & Condonation Policy',
    documentVersion: '1.4',
    chunkText: `In case of absence due to illness exceeding 3 consecutive working days, a medical certificate issued by a registered civil surgeon or the campus Chief Medical Officer must be submitted to the Head of Department within 5 working days of resuming classes. Condonation up to a maximum of 10% (bringing the minimum threshold to 65%) may be sanctioned by the Dean on approved medical grounds or official university extracurricular delegations.`,
  },

  // Academic Regulations
  {
    id: 'chunk-acad-1',
    documentId: 'doc-academic-regulations-2026',
    documentName: 'Academic Regulations.pdf',
    chunkIndex: 0,
    pageNumber: 4,
    section: 'Degree Requirements and Credit Structure',
    documentVersion: '3.0',
    chunkText: `A student qualifies for the Bachelor of Technology (B.Tech) degree upon successfully earning 160 credits over a standard span of 8 semesters. The maximum permissible duration to complete the program is 6 consecutive academic years from the date of admission. A minimum CGPA of 5.0 is required for graduation.`,
  },
  {
    id: 'chunk-acad-2',
    documentId: 'doc-academic-regulations-2026',
    documentName: 'Academic Regulations.pdf',
    chunkIndex: 1,
    pageNumber: 8,
    section: 'Honors Degree and Special Specialization Regulations',
    documentVersion: '3.0',
    chunkText: `Students opting for Departmental Honors or Minor Degree must register for 20 additional credits across Semesters 4 to 8. Note on Attendance: Students enrolled in Departmental Honors projects must maintain 80% aggregate attendance in specialized capstone lab sessions. Standard undergraduate lecture courses remain strictly bound to the institutional 75% attendance rule.`,
  },
  {
    id: 'chunk-acad-3',
    documentId: 'doc-academic-regulations-2026',
    documentName: 'Academic Regulations.pdf',
    chunkIndex: 2,
    pageNumber: 18,
    section: 'Academic Malpractice and Disciplinary Penalties',
    documentVersion: '3.0',
    chunkText: `Possession of any unauthorized paper, unauthorized electronic devices, smartwatch, or mobile phone within the examination hall constitutes Level-1 Malpractice. The student will be debarred from the examination of that particular course and awarded an 'F' grade. Copying from another candidate or helping another candidate leads to suspension for the entire semester.`,
  },

  // Scholarship Guidelines
  {
    id: 'chunk-schol-1',
    documentId: 'doc-scholarship-guidelines-2026',
    documentName: 'Scholarship Guidelines.pdf',
    chunkIndex: 0,
    pageNumber: 2,
    section: 'Merit-cum-Means Scholarship Renewal',
    documentVersion: '2.0',
    chunkText: `What documents are required for scholarship renewal:
Students applying for the annual renewal of the Merit-cum-Means (MCM) Scholarship must submit the following mandatory documents before October 31:
1. Certified Grade Card of previous academic semesters proving minimum CGPA of 8.0 without any backlog.
2. Fresh Annual Family Income Certificate issued by an Executive Magistrate / Tehsildar certifying gross household annual income is less than ₹3,50,000.
3. Current academic year college tuition fee receipt.
4. Active Bank Passbook copy or canceled cheque showing student's personal savings account linked with Aadhaar.
5. Good conduct and character certificate issued by the Head of Department.
Incomplete submissions or applications after October 31 will be rejected.`,
  },
  {
    id: 'chunk-schol-2',
    documentId: 'doc-scholarship-guidelines-2026',
    documentName: 'Scholarship Guidelines.pdf',
    chunkIndex: 1,
    pageNumber: 6,
    section: 'Institute Merit Scholarships & Fee Concessions',
    documentVersion: '2.0',
    chunkText: `The institution awards 100% tuition waiver to rank 1 holder in each department, and 50% tuition waiver to ranks 2 to 5. Eligible students must have zero disciplinary records. Applications open on August 15 and close on September 15 each academic cycle.`,
  },

  // Semester Timetable
  {
    id: 'chunk-time-1',
    documentId: 'doc-semester-timetable-2026',
    documentName: 'Semester Timetable.pdf',
    chunkIndex: 0,
    pageNumber: 1,
    section: 'Academic Calendar 2026-2027 Key Dates',
    documentVersion: '1.0',
    chunkText: `Key Institutional Dates for Fall 2026:
- Commencement of Classes: August 1, 2026
- Mid-Semester Assessments: October 12, 2026 to October 17, 2026
- Last Day of Instruction: November 24, 2026
- Preparation Break: November 25 to November 30, 2026
- Semester End Examinations: December 1, 2026 to December 22, 2026
- Winter Vacation: December 24, 2026 to January 10, 2027
- Spring Semester Registration: January 11, 2027`,
  },
  {
    id: 'chunk-time-2',
    documentId: 'doc-semester-timetable-2026',
    documentName: 'Semester Timetable.pdf',
    chunkIndex: 1,
    pageNumber: 3,
    section: 'Daily Class Schedules and Working Hours',
    documentVersion: '1.0',
    chunkText: `Daily lectures run from 09:00 AM to 04:30 PM Monday through Friday. Each period is 50 minutes long. Lunch interval is scheduled from 12:30 PM to 01:30 PM. Practical laboratory sessions are conducted in 2-hour slots from 02:30 PM to 04:30 PM. Saturday mornings (09:00 AM - 01:00 PM) are reserved for makeup classes, club meetings, and faculty office hours.`,
  },

  // Placement Cell Guidelines
  {
    id: 'chunk-place-1',
    documentId: 'doc-placement-guidelines-2026',
    documentName: 'Placement Cell Guidelines.pdf',
    chunkIndex: 0,
    pageNumber: 2,
    section: 'Placement Eligibility Requirements',
    documentVersion: '2.2',
    chunkText: `Criteria for Campus Placement Eligibility:
To be eligible to participate in on-campus placement recruitment drives:
1. Students must maintain a minimum cumulative CGPA of 6.5 or higher across all semesters up to the 6th semester.
2. The student must have NO active or uncleared backlogs at the time of registering for company drives.
3. Students must have logged a minimum of 80% attendance in all pre-placement training modules, soft skills workshops, and technical coding bootcamps.
4. Clean institutional conduct clearance from the Proctorial Board is required.`,
  },
  {
    id: 'chunk-place-2',
    documentId: 'doc-placement-guidelines-2026',
    documentName: 'Placement Cell Guidelines.pdf',
    chunkIndex: 1,
    pageNumber: 4,
    section: 'Registration Process for Campus Placements',
    documentVersion: '2.2',
    chunkText: `How to register for campus placements:
1. Eligible final-year students must sign up on the Central Training and Placement Portal (T&P Portal) by September 15.
2. Complete profile information and upload the verified Master Resume using the standard institutional LaTeX or Word template.
3. Upload self-attested digital copies of 10th marksheet, 12th marksheet, semester 1-6 grade sheets, and Government photo ID proof.
4. Submit the signed 'Placement Code of Conduct & Integrity Undertaking'.
5. Once registered and verified by the departmental faculty coordinator, students will receive credentials to apply to specific company job postings.`,
  },
  {
    id: 'chunk-place-3',
    documentId: 'doc-placement-guidelines-2026',
    documentName: 'Placement Cell Guidelines.pdf',
    chunkIndex: 2,
    pageNumber: 8,
    section: 'Placement Policy Tiers (Dream & Super Dream)',
    documentVersion: '2.2',
    chunkText: `Under the campus 'One Student One Job' policy, when an offer is secured with CTC up to ₹8 LPA (Tier-1), the candidate is deemed placed. Candidates securing Tier-1 can subsequently contest only for Dream companies (CTC between ₹8 LPA and ₹15 LPA). A candidate holding a Dream offer can only contest for Super Dream category offers (CTC exceeding ₹15 LPA).`,
  },

  // Student Handbook
  {
    id: 'chunk-hand-1',
    documentId: 'doc-student-handbook-2026',
    documentName: 'Student Handbook.pdf',
    chunkIndex: 0,
    pageNumber: 5,
    section: 'Campus Code of Conduct & Anti-Ragging',
    documentVersion: '4.0',
    chunkText: `The institution maintains strict zero-tolerance towards ragging, harassment, cyberbullying, and substance abuse. Any student found engaging in ragging will face immediate rustication, filing of criminal police complaint under state law, and permanent expulsion. 
Anti-Ragging Squad 24/7 Campus Emergency Contact: +91-98765-43210.
National Anti-Ragging Toll-Free Helpline: 1800-180-5522.`,
  },
  {
    id: 'chunk-hand-2',
    documentId: 'doc-student-handbook-2026',
    documentName: 'Student Handbook.pdf',
    chunkIndex: 1,
    pageNumber: 11,
    section: 'Campus Facilities & Library Access',
    documentVersion: '4.0',
    chunkText: `Central Library Services:
The Central Library is accessible to all registered students with valid smart ID cards. 
Operating Hours: Monday through Friday from 08:00 AM to 10:00 PM; Weekends and holidays from 09:00 AM to 05:00 PM.
Circulation Privileges: Undergraduate students can borrow up to 4 books simultaneously for an initial duration of 14 days. Borrowed books can be renewed twice online unless reserved by another borrower. Late return fee of ₹5 per book per day applies. High-speed Wi-Fi and 50 digital workstations are available in the e-learning wing.`,
  },
  {
    id: 'chunk-hand-3',
    documentId: 'doc-student-handbook-2026',
    documentName: 'Student Handbook.pdf',
    chunkIndex: 2,
    pageNumber: 22,
    section: 'Hostel Guidelines and Curfew Timings',
    documentVersion: '4.0',
    chunkText: `Hostel Residents Guidelines:
All first-year hostel students must return to the hostel premises before 09:00 PM. Second to fourth-year students must enter by 10:00 PM. Night-out permissions require advance online parent consent submitted through the hostel ERP portal at least 24 hours prior. Cooking inside dorm rooms or using heavy electrical appliances like room heaters and induction plates is prohibited.`,
  },

  // College Events Notice
  {
    id: 'chunk-event-1',
    documentId: 'doc-college-events-notice-2026',
    documentName: 'College Events Notice.pdf',
    chunkIndex: 0,
    pageNumber: 1,
    section: 'Annual Cultural & Technical Festival - AURA 2026',
    documentVersion: '1.1',
    chunkText: `Notice for AURA 2026:
The flagship Annual Inter-Collegiate Cultural and Technical Festival 'AURA 2026' will take place from November 18 to November 21, 2026.
Event highlights include:
- 'HackCampus 2026': 36-hour National Hackathon on November 19-20 with a total prize pool of ₹1,50,000.
- 'RoboWars 2026': Combat robotics championship in the indoor stadium on November 20.
- Cultural Music & Dance Nights on November 21.
Student registrations open October 10 on the student portal. Certificates of participation will be awarded to all shortlisted entries.`,
  },
  {
    id: 'chunk-event-2',
    documentId: 'doc-college-events-notice-2026',
    documentName: 'College Events Notice.pdf',
    chunkIndex: 1,
    pageNumber: 2,
    section: 'Health & Community Outreach Drive',
    documentVersion: '1.1',
    chunkText: `The National Service Scheme (NSS) Campus Chapter is organizing the Annual Mega Blood Donation and Free Health Screening Camp on October 25, 2026, in the Student Health Pavilion from 09:30 AM to 04:00 PM in collaboration with the Red Cross Society. Donors receive refreshment kits and voluntary donor recognition certificates.`,
  },
];
