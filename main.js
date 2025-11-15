/* =====================================================
   main.js — Unified Application Logic for MinorMap+
   All data stored in localStorage. No backend required.
   ===================================================== */

(function () {
  // ----------------------
  // Helpers
  // ----------------------
  const $ = (s, p = document) => p.querySelector(s);
  const $$ = (s, p = document) => Array.from((p || document).querySelectorAll(s));

  // ----------------------
  // Session Management
  // ----------------------
  function setSession(user) {
    const session = user || { name: "Guest User", email: "guest@college.edu" };
    localStorage.setItem("minor_user", JSON.stringify(session));
  }
  
  function clearSession() {
    localStorage.removeItem("minor_user");
    localStorage.removeItem("selectedMinor");
    localStorage.removeItem("selectedMinorName");
    localStorage.removeItem("quizAnswers");
    localStorage.removeItem("quizResults");
  }

  function getSession() {
    try {
      return JSON.parse(localStorage.getItem("minor_user"));
    } catch (e) {
      return null;
    }
  }
  
  // ----------------------
  // Mock Data (No Backend)
  // ----------------------
  const MINORS_DATA = [
    { id: "aiml", name: "AI & ML", desc: "Harnessing data for intelligent systems and automation." },
    { id: "ds", name: "Data Science", desc: "Extracting insights and value from complex datasets." },
    { id: "iot", name: "IoT", desc: "Connecting the physical world with digital networks." },
    { id: "pmd", name: "Product Management & Design", desc: "From idea to launch: building user-loved products." },
    { id: "fintech", name: "FinTech & Blockchain", desc: "Innovating finance with decentralized technologies." },
    { id: "cyber", name: "Blockchain & Cybersecurity", desc: "Securing digital assets and decentralized networks." },
    { id: "lifesci", name: "Life Sciences", desc: "Exploring biology, medicine, and biotechnology." },
    { id: "energy", name: "Energy Sciences", desc: "Developing sustainable and efficient energy solutions." },
    { id: "ent", name: "Entrepreneurship", desc: "Launching and scaling new business ventures." },
  ];

  const QUIZ_DATA = {
    "aiml": [
      { q: "What is your current overall GPA?", a: ["3.5 or higher", "3.0 - 3.49", "2.5 - 2.99", "Below 2.5"] },
      { q: "Have you completed 'Calculus II' and 'Linear Algebra'?", a: ["Both", "One of them", "Neither"] },
      { q: "What is your proficiency in Python?", a: ["High (comfortable with libraries)", "Medium (know basics)", "Low (beginner)"] },
      { q: "Have you taken an 'Intro to AI' or 'Machine Learning' course?", a: ["Yes", "No, but I plan to", "No"] },
    ],
    "ds": [
      { q: "What is your current overall GPA?", a: ["3.2 or higher", "2.8 - 3.19", "Below 2.8"] },
      { q: "Have you completed a college-level Statistics course?", a: ["Yes", "In Progress", "No"] },
      { q: "What is your proficiency in Python or R?", a: ["Proficient", "Familiar", "Beginner"] },
      { q: "Have you completed an 'Intro to Databases' course?", a: ["Yes", "No"] },
    ],
    "iot": [
      { q: "What is your current overall GPA?", a: ["3.0 or higher", "2.5 - 2.99", "Below 2.5"] },
      { q: "Have you completed an 'Intro to Programming' (C/C++ or Python) course?", a: ["Yes", "In Progress", "No"] },
      { q: "Have you completed a course in 'Digital Electronics' or 'Circuits'?", a: ["Yes", "No"] },
      { q: "Have you completed an 'Intro to Computer Networks' course?", a: ["Yes", "No"] },
    ],
    "pmd": [
      { q: "What is your current overall GPA?", a: ["3.0 or higher", "2.5 - 2.99", "Below 2.5"] },
      { q: "Have you taken an 'Intro to Business' or 'Marketing' course?", a: ["Yes", "No"] },
      { q: "Have you taken a 'Human-Computer Interaction' or 'Design Fundamentals' course?", a: ["Yes", "No"] },
      { q: "Have you worked on a team to build and launch a project (app, website, etc.)?", a: ["Yes", "No"] },
    ],
    "fintech": [
      { q: "What is your current overall GPA?", a: ["3.2 or higher", "2.8 - 3.19", "Below 2.8"] },
      { q: "Have you completed 'Principles of Finance' (FIN 201)?", a: ["Yes", "In Progress", "No"] },
      { q: "Do you have programming experience (e.g., Python, Java)?", a: ["Yes, proficient", "Yes, basic", "No"] },
      { q: "Have you taken an 'Intro to Blockchain' course?", a: ["Yes", "No"] },
    ],
    "cyber": [
      { q: "What is your current overall GPA?", a: ["3.0 or higher", "2.5 - 2.99", "Below 2.5"] },
      { q: "Have you completed 'Computer Networks' (CS 342)?", a: ["Yes", "In Progress", "No"] },
      { q: "Have you completed an 'Intro to Cybersecurity' course?", a: ["Yes", "No"] },
      { q: "Have you taken any courses on Blockchain or Cryptography?", a: ["Yes", "No"] },
    ],
    "lifesci": [
      { q: "What is your current overall GPA?", a: ["3.0 or higher", "2.5 - 2.99", "Below 2.5"] },
      { q: "Have you completed 'General Biology I' (BIO 101) with lab?", a: ["Yes", "In Progress", "No"] },
      { q: "Have you completed 'General Chemistry I' (CHEM 101) with lab?", a: ["Yes", "In Progress", "No"] },
      { q: "Have you completed 'Organic Chemistry I'?", a: ["Yes", "No"] },
    ],
    "energy": [
      { q: "What is your current overall GPA?", a: ["3.0 or higher", "2.5 - 2.99", "Below 2.5"] },
      { q: "Have you completed 'Physics I' (PHY 201)?", a: ["Yes", "In Progress", "No"] },
      { q: "Have you completed 'Chemistry I' (CHEM 101)?", a: ["Yes", "In Progress", "No"] },
      { q: "Have you taken an 'Intro to Energy Systems' or 'Thermodynamics' course?", a: ["Yes", "No"] },
    ],
    "ent": [
      { q: "What is your current overall GPA?", a: ["3.0 or higher", "2.5 - 2.99", "Below 2.5"] },
      { q: "Have you completed 'Intro to Entrepreneurship' (ENT 101)?", a: ["Yes", "No"] },
      { q: "Have you completed 'Principles of Marketing' (MKT 201)?", a: ["Yes", "No"] },
      { q: "Have you ever pitched a business idea (in a class, competition, or club)?", a: ["Yes", "No"] },
    ]
  };

  // ----------------------
  // Page Initializers
  // ----------------------

  /**
   * Login Page Logic
   */
  function initLoginPage() {
    const loginForm = $('#loginForm');
    if (!loginForm) return;

    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = $('#emailLogin')?.value;
      const name = email.split('@')[0]; // Simple name from email
      
      setSession({ name: name || "User", email: email });
      
      // Add a small delay for effect
      const btn = $('button[type="submit"]', loginForm);
      btn.disabled = true;
      btn.textContent = 'Signing In...';
      
      setTimeout(() => {
        window.location.href = 'selectminor.html';
      }, 500);
    });
  }
  
  /**
   * Register Page Logic
   */
  function initRegisterPage() {
    const registerForm = $('#registerForm');
    if (!registerForm) return;
    
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = $('#nameRegister')?.value;
      const email = $('#emailRegister')?.value;

      setSession({ name: name, email: email });

      const btn = $('button[type="submit"]', registerForm);
      btn.disabled = true;
      btn.textContent = 'Creating Account...';

      setTimeout(() => {
        window.location.href = 'selectminor.html';
      }, 500);
    });
  }

  /**
   * Select Minor Page Logic
   */
  function initSelectMinorPage() {
    const grid = $('#minorGrid');
    const continueBtn = $('#continueBtn');
    if (!grid || !continueBtn) return;
    
    let selectedMinorId = null;
    
    // Render minor cards
    grid.innerHTML = '';
    MINORS_DATA.forEach((minor, i) => {
      const el = document.createElement('div');
      el.className = 'card minor-card reveal-anim';
      el.style.animationDelay = `${i * 100}ms`;
      el.dataset.id = minor.id;
      el.innerHTML = `
        <h3>${minor.name}</h3>
        <p>${minor.desc}</p>
      `;
      el.addEventListener('click', () => {
        // Remove 'selected' from all other cards
        $$('.minor-card').forEach(card => card.classList.remove('selected'));
        // Add 'selected' to this card
        el.classList.add('selected');
        selectedMinorId = minor.id;
        continueBtn.disabled = false;
      });
      grid.appendChild(el);
    });

    // Continue button
    continueBtn.addEventListener('click', () => {
      if (selectedMinorId) {
        const minorName = MINORS_DATA.find(m => m.id === selectedMinorId)?.name;
        localStorage.setItem('selectedMinor', selectedMinorId);
        localStorage.setItem('selectedMinorName', minorName || 'Selected Minor');
        window.location.href = 'quiz.html';
      }
    });
  }

  /**
   * Quiz Page Logic
   */
  function initQuizPage() {
    const minorId = localStorage.getItem('selectedMinor');
    const minorName = localStorage.getItem('selectedMinorName');
    
    if (!minorId) {
      alert('No minor selected. Redirecting...');
      window.location.href = 'selectminor.html';
      return;
    }
    
    const questions = QUIZ_DATA[minorId] || []; // Get questions for the minor
    
    if (questions.length === 0) {
        alert(`Quiz data for '${minorName}' is not available. Redirecting...`);
        window.location.href = 'selectminor.html';
        return;
    }
    
    let currentQuestionIndex = 0;
    let answers = JSON.parse(localStorage.getItem('quizAnswers')) || {};

    const title = $('#quizTitle');
    const subtitle = $('#quizSubtitle');
    const questionText = $('#questionText');
    const answersGrid = $('#answersGrid');
    const prevBtn = $('#prevBtn');
    const nextBtn = $('#nextBtn');
    const progressText = $('#progressText');

    if (title) title.textContent = `${minorName} Quiz`;
    
    function loadQuestion(index) {
      const question = questions[index];
      if (!question) return;

      questionText.textContent = question.q;
      answersGrid.innerHTML = '';

      question.a.forEach(answer => {
        const answerId = `q${index}_${answer.replace(/\s+/g, '-')}`;
        const isChecked = answers[index] === answer;
        
        const label = document.createElement('label');
        label.className = 'answer-label';
        label.htmlFor = answerId;
        if (isChecked) {
            label.classList.add('selected');
        }
        
        label.innerHTML = `
          <input type="radio" name="question${index}" id="${answerId}" value="${answer}" ${isChecked ? 'checked' : ''}>
          ${answer}
        `;
        
        label.addEventListener('change', () => {
            answers[index] = answer;
            localStorage.setItem('quizAnswers', JSON.stringify(answers));
            // Update UI for selection
            $$('.answer-label').forEach(lbl => lbl.classList.remove('selected'));
            label.classList.add('selected');
        });
        
        answersGrid.appendChild(label);
      });

      progressText.textContent = `Question ${index + 1} / ${questions.length}`;
      prevBtn.disabled = index === 0;
      
      if (index === questions.length - 1) {
        nextBtn.textContent = 'Submit Quiz';
        nextBtn.classList.remove('btn--secondary');
        nextBtn.classList.add('btn--primary');
      } else {
        nextBtn.textContent = 'Next';
        nextBtn.classList.add('btn--secondary');
        nextBtn.classList.remove('btn--primary');
      }
    }

    prevBtn.addEventListener('click', () => {
      if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        loadQuestion(currentQuestionIndex);
      }
    });

    nextBtn.addEventListener('click', () => {
      if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        loadQuestion(currentQuestionIndex);
      } else {
        // Submit logic
        submitQuiz(answers, minorId);
      }
    });

    loadQuestion(currentQuestionIndex);
  }

  /**
   * Quiz Submission & Results Generation
   */
  function submitQuiz(answers, minorId) {
    // This is a mock eligibility calculator.
    // A real app would have complex logic.
    let score = 0;
    const results = [];
    const questions = QUIZ_DATA[minorId] || [];

    // Rule 1: GPA
    const gpaAnswer = Object.values(answers).find(a => a.includes('GPA') || a.includes('higher') || a.includes('Below'));
    let gpaStatus = {
        title: "GPA Requirement",
        status: "Ineligible",
        desc: "Your GPA is below the minimum requirement for this minor."
    };
    if (gpaAnswer && (gpaAnswer.includes('3.0') || gpaAnswer.includes('3.2') || gpaAnswer.includes('3.5'))) {
        score++;
        gpaStatus.status = "Eligible";
        gpaStatus.desc = "Your GPA meets the minimum requirement.";
    } else if (gpaAnswer && (gpaAnswer.includes('2.5') || gpaAnswer.includes('2.8'))) {
        gpaStatus.status = "Potential";
        gpaStatus.desc = "Your GPA is borderline. You may need special permission.";
    }
    results.push(gpaStatus);

    // Rule 2: Prerequisite courses
    const prereqAnswers = Object.values(answers).filter(a => a === 'Yes' || a === 'In Progress' || a.includes('Proficient') || a.includes('Both'));
    let prereqStatus = {
        title: "Prerequisites",
        status: "Ineligible",
        desc: "You are missing key prerequisite courses for this minor."
    };
    // Simple logic: need at least 2 "good" answers (total questions - GPA question - 1 buffer)
    if (prereqAnswers.length >= (questions.length - 2)) { 
        score++;
        prereqStatus.status = "Eligible";
        prereqStatus.desc = "You have completed most or all of the required prerequisites.";
    } else if (prereqAnswers.length >= 1) {
        prereqStatus.status = "Potential";
        prereqStatus.desc = "You are in progress or have completed some prerequisites.";
    }
    results.push(prereqStatus);

    // Overall Status
    let overallStatus = {
        title: "Overall Eligibility",
        status: "Ineligible",
        desc: "You do not meet the core requirements for this minor. Please speak with an advisor."
    };
    if (score === 2) {
        overallStatus.status = "Eligible";
        overallStatus.desc = "Congratulations! You appear to be eligible to declare this minor.";
    } else if (score === 1 || (gpaStatus.status === "Potential" && prereqStatus.status === "Potential")) {
        overallStatus.status = "Potential";
        overallStatus.desc = "You meet some requirements, but may need to complete more courses or raise your GPA.";
    }
    results.unshift(overallStatus); // Add to beginning

    // Save and redirect
    const finalReport = { minorName: localStorage.getItem('selectedMinorName'), results };
    localStorage.setItem('quizResults', JSON.stringify(finalReport));
    localStorage.removeItem('quizAnswers'); // Clear answers for next time
    
    window.location.href = 'results.html';
  }


  /**
   * Results Page Logic
   */
  function initResultsPage() {
    const resultsGrid = $("#resultsGrid");
    const subtitle = $("#resultsSubtitle");
    const homeBtn = $("#navHome"); // This is the button in the main content now

    if (!resultsGrid) return; // Not on results page

    let report;
    try {
      report = JSON.parse(localStorage.getItem("quizResults"));
    } catch (e) {
      report = null;
    }

    if (!report || !report.results || report.results.length === 0) {
      resultsGrid.innerHTML = "<p class='muted text-center' style='grid-column: 1 / -1;'>No results found. Please take a quiz first.</p>";
      return;
    }

    if (subtitle && report.minorName) {
        subtitle.textContent = `Here is the breakdown for the ${report.minorName} minor.`;
    }

    resultsGrid.innerHTML = ""; // Clear
    report.results.forEach((r, i) => {
      const el = document.createElement("div");
      el.className = "result-card reveal-anim";
      
      let statusColor;
      if (r.status === 'Eligible') statusColor = '#00A699'; // Teal (accent-secondary)
      else if (r.status === 'Potential') statusColor = '#F5B041'; // Yellow
      else statusColor = '#FF5A5F'; // Red/Pink (accent-primary)

      el.innerHTML = `
        <div class="result-header">
          <h3>${r.title}</h3>
          <span class="status-badge" style="background-color: ${statusColor};">${r.status}</span>
        </div>
        <div class="result-body">
          <p>${r.desc}</p>
        </div>
      `;
      // Staggered entrance
      el.style.animationDelay = `${100 * (i + 1)}ms`;
      resultsGrid.appendChild(el);
    });
    
    // Home button (in main content)
    if (homeBtn) {
        homeBtn.addEventListener('click', () => window.location.href = 'selectminor.html');
    }
  }

  /**
   * Common UI logic (Ripple, Reveal, Auth)
   */
  function initCommon() {
    // Page protection
    const protectedPages = ["selectminor.html", "quiz.html", "results.html"];
    const publicPages = ["login.html", "register.html"];
    const path = location.pathname.split("/").pop() || "login.html";
    const user = getSession();

    if (protectedPages.includes(path) && !user) {
      clearSession(); // Ensure all data is gone
      location.href = 'register.html'; // <-- CHANGED: Default start is now register
      return; // Stop further execution
    }
    
    if (publicPages.includes(path) && user) {
      location.href = 'selectminor.html';
      return; // Stop further execution
    }
    
    // Add user name to topbar
    const userNameEl = $('#userName');
    if (userNameEl && user) {
        userNameEl.textContent = `Welcome, ${user.name}`;
    }

    // Logout buttons
    $$(".logout-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        clearSession();
        location.href = 'login.html';
      });
    });

    // Ripple effect
    $$(".ripple").forEach(btn => {
      btn.addEventListener("mousedown", function (e) {
        const ripple = document.createElement("span");
        ripple.className = "ripple-effect";
        const rect = btn.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
        ripple.style.top = `${e.clientY - rect.top - size / 2}px`;

        // We need to inject this style dynamically as it's not in the CSS
        const style = document.createElement('style');
        style.innerHTML = `
          .ripple-effect {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: ripple-anim 600ms linear;
            pointer-events: none;
          }
          @keyframes ripple-anim {
            to {
              transform: scale(4);
              opacity: 0;
            }
          }
        `;
        document.head.appendChild(style);
        
        btn.appendChild(ripple);
        
        // Clean up
        ripple.addEventListener("animationend", () => {
          ripple.remove();
          style.remove();
        });
      });
    });
  }


  // ----------------------
  // App Entry Point
  // ----------------------
  window.addEventListener("DOMContentLoaded", () => {
    // Run common init first for auth checks
    initCommon();

    // Run page-specific logic
    const path = location.pathname.split("/").pop() || "login.html";
    
    if (path === "login.html" || path === "") {
      initLoginPage();
    } else if (path === "register.html") {
      initRegisterPage();
    } else if (path === "selectminor.html") {
      initSelectMinorPage();
    } else if (path === "quiz.html") {
      initQuizPage();
    } else if (path === "results.html") {
      initResultsPage();
    }
  });

})();