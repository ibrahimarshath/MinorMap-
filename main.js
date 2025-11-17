/* ===================================================
   main.js - MinorMap+
   Client-side logic for fake auth and quiz.
   Now uses admin-managed data from localStorage.
   =================================================== */

(function () {
  'use strict';

  // --- Helpers ---
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => document.querySelectorAll(s);

  // --- Toast Notification ---
  const toast = $('#toast');
  function showToast(message, type = "success", duration = 3000) {
    if (!toast) return; // Exit if toast element not on page
    toast.textContent = message;
    toast.className = 'toast show';
    if (type === 'error') toast.classList.add('error');
    if (type === 'info') toast.classList.add('info');

    setTimeout(() => {
      toast.className = 'toast';
    }, duration);
  }

  // --- Fake Auth System (localStorage) ---
  // Use a small transient cache but persist important state to localStorage
  const tempState = {
    currentUser: null,
    selectedMinor: null,
    quizAnswers: null,
    quizResults: null,
    // cached admin-managed minors and quizzes
    minors: null,
    quizzes: null,
  };

  function setSession(user) {
    tempState.currentUser = user;
    try { localStorage.setItem('minor_user', JSON.stringify(user)); } catch (e) { /* ignore */ }
  }
  function clearSession() {
    tempState.currentUser = null;
    tempState.selectedMinor = null;
    tempState.quizAnswers = null;
    tempState.quizResults = null;
    try {
      localStorage.removeItem('minor_user');
      localStorage.removeItem('selectedMinor');
      localStorage.removeItem('quizAnswers');
      localStorage.removeItem('quizResults');
    } catch (e) { /* ignore */ }
    window.location.href = 'login.html';
  }
  function getSession() {
    if (tempState.currentUser) return tempState.currentUser;
    try {
      const raw = localStorage.getItem('minor_user');
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  // --- Data Management - Get from admin or use defaults ---
  function getMinors() {
    if (tempState.minors) return tempState.minors;
    try {
      const raw = localStorage.getItem('admin_minors');
      if (raw) {
        tempState.minors = JSON.parse(raw);
        return tempState.minors;
      }
    } catch (e) { /* ignore */ }
    const defs = getDefaultMinors();
    tempState.minors = JSON.parse(JSON.stringify(defs));
    return tempState.minors;
  }

  function getDefaultMinors() {
    return {
      'ai-ml': {
        id: 'ai-ml',
        name: 'AI & ML',
        description: 'Explore the frontiers of artificial intelligence and machine learning.',
      },
      'data-science': {
        id: 'data-science',
        name: 'Data Science',
        description: 'Learn to extract insights and knowledge from data.',
      },
      'iot': {
        id: 'iot',
        name: 'IoT',
        description: 'Connect the physical world to the digital with the Internet of Things.',
      },
      'pm-design': {
        id: 'pm-design',
        name: 'Product Management & Design',
        description: 'Master the art of building and designing successful products.',
      },
      'fintech': {
        id: 'fintech',
        name: 'FinTech & Blockchain',
        description: 'Innovate at the intersection of finance and technology.',
      },
      'cybersecurity': {
        id: 'cybersecurity',
        name: 'Blockchain & Cybersecurity',
        description: 'Secure digital assets and explore decentralized systems.',
      },
      'life-sci': {
        id: 'life-sci',
        name: 'Life Sciences',
        description: 'Dive into the biology and technology shaping modern medicine.',
      },
      'energy': {
        id: 'energy',
        name: 'Energy Sciences',
        description: 'Explore sustainable and renewable energy solutions.',
      },
      'entrepreneurship': {
        id: 'entrepreneurship',
        name: 'Entrepreneurship',
        description: 'Learn to build and scale your own business venture.',
      },
    };
  }

  function getQuizzes() {
    if (tempState.quizzes) return tempState.quizzes;
    try {
      const raw = localStorage.getItem('admin_quizzes');
      if (raw) {
        tempState.quizzes = JSON.parse(raw);
        return tempState.quizzes;
      }
    } catch (e) { /* ignore */ }
    const defs = getDefaultQuizzes();
    tempState.quizzes = JSON.parse(JSON.stringify(defs));
    return tempState.quizzes;
  }

  function getDefaultQuizzes() {
    const yesNo = (question, positive = 'Yes', negative = 'No') => ({
      text: question,
      options: [
        { text: positive, value: true },
        { text: negative, value: false },
      ],
    });

    return {
      'ai-ml': [
        yesNo('Have you completed an introductory course in Python programming?'),
        yesNo('Are you comfortable with linear algebra and calculus concepts?'),
        yesNo('Have you taken a course in Data Structures and Algorithms?'),
      ],
      'data-science': [
        yesNo('Have you completed a course in Statistics or Probability?'),
        yesNo('Are you familiar with SQL or other database query languages?'),
        yesNo('Do you have experience with a programming language like Python or R?'),
      ],
      'iot': [
        yesNo('Have you built or programmed with microcontrollers such as Arduino or ESP32?'),
        yesNo('Do you understand basic electronics (sensors, actuators, circuits)?'),
        yesNo('Are you comfortable working with networking concepts like MQTT or HTTP?'),
      ],
      'pm-design': [
        yesNo('Have you participated in a product design or UX project before?'),
        yesNo('Can you define user personas and write simple product requirements?'),
        yesNo('Are you familiar with prototyping tools such as Figma or Sketch?'),
      ],
      'fintech': [
        yesNo('Have you taken foundational courses in finance or economics?'),
        yesNo('Do you understand how basic blockchain transactions work?'),
        yesNo('Are you comfortable writing scripts or small apps that interact with APIs?'),
      ],
      'cybersecurity': [
        yesNo('Have you studied computer networks or operating system internals?'),
        yesNo('Do you know how to secure accounts with multi-factor authentication?'),
        yesNo('Have you practiced identifying common vulnerabilities (OWASP Top 10)?'),
      ],
      'life-sci': [
        yesNo('Have you completed introductory biology or biotechnology coursework?'),
        yesNo('Are you familiar with laboratory safety and basic lab equipment?'),
        yesNo('Do you understand how to analyze experimental data using statistics?'),
      ],
      'energy': [
        yesNo('Do you understand concepts like power, energy, and efficiency?'),
        yesNo('Have you studied renewable energy systems such as solar or wind?'),
        yesNo('Can you interpret basic electrical diagrams or specifications?'),
      ],
      'entrepreneurship': [
        yesNo('Have you worked on a business plan or pitch deck before?'),
        yesNo('Do you understand basics of market research and customer interviews?'),
        yesNo('Are you comfortable presenting ideas to small groups or mentors?'),
      ],
    };
  }

  // --- Page Initializers ---

  // 1. Login Page
  function initLoginPage() {
    const loginForm = $('#loginForm');

    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = ($('#emailLogin').value || '').trim();
        const password = ($('#passwordLogin').value || '').trim();

        if (!email || !password) {
          showToast('Please enter both email and password', 'error');
          return;
        }

        showToast('Welcome back — redirecting...', 'success');
        const guestName = email.split('@')[0];
        setSession({ name: guestName, email, role: 'user' });
        setTimeout(() => {
          window.location.href = `selectminor.html?role=user&name=${encodeURIComponent(guestName)}&email=${encodeURIComponent(email)}`;
        }, 600);
      });
    }

  }

  // 2. Register Page
  function initRegisterPage() {
    const registerForm = $('#registerForm');
    if (!registerForm) return;
    // UI-only registration: redirect to combined user UI (no persistence)
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = ($('#nameRegister').value || '').trim();
      const email = ($('#emailRegister').value || '').trim();
      const password = ($('#passwordRegister').value || '').trim();

      if (!name || !email || !password) {
        showToast('Please fill out all fields', 'error');
        return;
      }

      showToast('Account created (UI-only). Opening user UI...', 'success');
      setSession({ name, email, role: 'user' });
      setTimeout(() => { window.location.href = `selectminor.html?role=user&name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}`; }, 700);
    });
  }

  // 3. Select Minor Page
  function initSelectMinorPage() {
    const minorGrid = $('#minorGrid');
    if (!minorGrid) return; // Not on the right page
    const continueBtn = $('#continueBtn');
    // Show user name in topbar if available
    const userNameElem = document.getElementById('userName');
    if (tempState.currentUser && userNameElem) {
      userNameElem.style.display = 'flex';
      userNameElem.textContent = `Welcome, ${tempState.currentUser.name}!`;
    }
    // Use in-memory selected minor when in combined page
    let selectedMinor = tempState.selectedMinor || null;

    // Get minors (defaults only in UI-only mode)
    const MINOR_DATA = getMinors();

    minorGrid.innerHTML = '';
    Object.values(MINOR_DATA).forEach((minor, i) => {
      const el = document.createElement('div');
      el.className = 'card minor-card reveal-anim';
      el.style.setProperty('--delay', `${(i + 1) * 0.1}s`);
      el.dataset.id = minor.id;
      el.innerHTML = `
        <h3>${minor.name}</h3>
        <p>${minor.description}</p>
      `;

      if (minor.id === selectedMinor) {
        el.classList.add('selected');
        if (continueBtn) continueBtn.disabled = false;
      }

      el.addEventListener('click', () => {
        $$('.minor-card').forEach(card => card.classList.remove('selected'));
        el.classList.add('selected');
        selectedMinor = minor.id;
        tempState.selectedMinor = selectedMinor; // transient
        try { localStorage.setItem('selectedMinor', selectedMinor); } catch (e) { /* ignore */ }
        if (continueBtn) continueBtn.disabled = false;
      });
      minorGrid.appendChild(el);
    });

    if (continueBtn) {
      continueBtn.addEventListener('click', () => {
        if (!selectedMinor) return;
        // If running inside the combined page, navigate views in-page
        if (window.appViews) {
          tempState.quizAnswers = new Array((getQuizzes()[selectedMinor] || []).length).fill(null);
          try { localStorage.setItem('quizAnswers', JSON.stringify(tempState.quizAnswers)); } catch (e) { }
          window.appViews.showOnly(document.getElementById('quizView'));
        } else {
          // Persist selected minor and open standalone quiz page
          try { localStorage.setItem('selectedMinor', selectedMinor); } catch (e) { }
          window.location.href = `quiz.html`;
        }
      });
    }
  }

  // 4. Quiz Page
  function initQuizPage() {
    const quizContainer = $('#quizContainer');
    if (!quizContainer) return;

    // Determine minor id: prefer transient state, then URL param
    const urlMinor = new URLSearchParams(window.location.search).get('minor');
    const minorId = tempState.selectedMinor || urlMinor;
    const MINOR_DATA = getMinors();
    const QUIZ_DATA = getQuizzes();
    const minor = MINOR_DATA[minorId];
    if (!minor) {
      showToast('No minor selected. Redirecting...', 'error');
      if (window.appViews) {
        window.appViews.showOnly(document.getElementById('selectMinorView'));
      } else {
        window.location.href = 'selectminor.html';
      }
      return;
    }

    const questions = QUIZ_DATA[minorId] || [];
    if (questions.length === 0) {
      // Handle case where quiz isn't defined
      quizContainer.innerHTML = `
        <div class="quiz-header">
          <h2>Quiz: ${minor.name}</h2>
          <p class="muted">Sorry, the quiz for this minor is not available yet.</p>
        </div>
        <div class="actions-row">
          <a href="selectminor.html" class="btn btn--primary">Back to Minors</a>
        </div>
      `;
      return;
    }
    
    let currentQuestionIndex = 0;
    let userAnswers = tempState.quizAnswers || new Array(questions.length).fill(null);

    const quizTitle = $('#quizTitle');
    const quizSubtitle = $('#quizSubtitle');
    const questionText = $('#questionText');
    const answersGrid = $('#answersGrid');
    const progressText = $('#progressText');
    const prevBtn = $('#prevBtn');
    const nextBtn = $('#nextBtn');

    quizTitle.textContent = `Quiz: ${minor.name}`;
    quizSubtitle.textContent = minor.description;

    function renderQuestion() {
      const q = questions[currentQuestionIndex];
      questionText.textContent = q.text;
      answersGrid.innerHTML = '';

      q.options.forEach((option, index) => {
        const el = document.createElement('div');
        el.className = 'answer-card';
        el.textContent = option.text;
        
        if (userAnswers[currentQuestionIndex] !== null && userAnswers[currentQuestionIndex].text === option.text) {
          el.classList.add('selected');
        }

        el.addEventListener('click', () => {
          userAnswers[currentQuestionIndex] = option; // Save the full option
          tempState.quizAnswers = userAnswers; // transient
          try { localStorage.setItem('quizAnswers', JSON.stringify(userAnswers)); } catch (e) { /* ignore */ }

          $$('.answer-card').forEach(card => card.classList.remove('selected'));
          el.classList.add('selected');
          updateNav();

          setTimeout(() => {
            if (currentQuestionIndex < questions.length - 1) {
              currentQuestionIndex++;
              renderQuestion();
            }
          }, 300);
        });
        answersGrid.appendChild(el);
      });
      updateNav();
    }

    function updateNav() {
      progressText.textContent = `Question ${currentQuestionIndex + 1} / ${questions.length}`;
      prevBtn.disabled = (currentQuestionIndex === 0);
      
      if (currentQuestionIndex === questions.length - 1) {
        nextBtn.textContent = 'Finish Quiz';
        nextBtn.disabled = (userAnswers[currentQuestionIndex] === null);
      } else {
        nextBtn.textContent = 'Next';
        nextBtn.disabled = (userAnswers[currentQuestionIndex] === null);
      }
    }

    prevBtn.addEventListener('click', () => {
      if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        renderQuestion();
      }
    });

    nextBtn.addEventListener('click', () => {
      if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        renderQuestion();
      } else {
        // Finish Quiz
        if (userAnswers.includes(null)) {
          showToast('Please answer all questions', 'info');
          return;
        }

        const results = {
          questions: questions.map(q => q.text),
          answers: userAnswers,
        };
        tempState.quizResults = results;
        try { localStorage.setItem('quizResults', JSON.stringify(results)); } catch (e) { }
        if (window.appViews) {
          window.appViews.showOnly(document.getElementById('resultsView'));
        } else {
          // Standalone flow: redirect to results page
          window.location.href = 'results.html';
        }
      }
    });

    renderQuestion(); // Initial render
  }

  // 5. Results Page
  function initResultsPage() {
    const resultsGrid = $('#resultsGrid');
    if (!resultsGrid) return;
    // Determine results from transient state, URL, or localStorage
    const urlMinor = new URLSearchParams(window.location.search).get('minor');
    const minorId = tempState.selectedMinor || urlMinor || (localStorage.getItem('selectedMinor') || null);
    const MINOR_DATA = getMinors();
    const minor = MINOR_DATA[minorId];
    let resultsData = tempState.quizResults || null;
    if (!resultsData) {
      try {
        const raw = localStorage.getItem('quizResults');
        resultsData = raw ? JSON.parse(raw) : null;
      } catch (e) { resultsData = null; }
    }

    if (!minor || !resultsData) {
      showToast('Please complete the quiz before viewing results.', 'error');
      if (window.appViews) {
        window.appViews.showOnly(document.getElementById('selectMinorView'));
      } else {
        setTimeout(() => { window.location.href = 'selectminor.html'; }, 600);
      }
      return;
    }

    $('#resultsSubtitle').textContent = `Here is the breakdown for the "${minor.name}" minor.`;
    resultsGrid.innerHTML = ''; // Clear

    let eligibleCount = 0;
    
    resultsData.answers.forEach((answer, i) => {
      const questionText = resultsData.questions[i];
      const isEligible = answer.value === true;
      
      if (isEligible) eligibleCount++;
      
      let status = isEligible ? 'Eligible' : 'Not Eligible';
      let statusClass = isEligible ? 'status-badge--eligible' : 'status-badge--ineligible';
      let description = `Your answer ("${answer.text}") indicates you ${isEligible ? 'meet' : 'do not meet'} this requirement.`;

      const el = document.createElement('div');
      el.className = 'result-card reveal-anim';
      el.style.setProperty('--delay', `${(i + 1) * 0.1}s`);
      el.innerHTML = `
        <div class="result-header">
          <h3>${questionText}</h3>
          <span class="status-badge ${statusClass}">${status}</span>
        </div>
        <div class="result-body">
          <p>${description}</p>
        </div>
      `;
      resultsGrid.appendChild(el);
    });

    // Add overall result card
    const totalQuestions = resultsData.questions.length;
    const score = (eligibleCount / totalQuestions);
    let overallStatus, overallStatusClass, overallDescription;

    if (score === 1) {
      overallStatus = 'Fully Eligible';
      overallStatusClass = 'status-badge--eligible';
      overallDescription = 'Congratulations! You meet all the preliminary requirements for this minor.';
    } else if (score >= 0.5) {
      overallStatus = 'Potentially Eligible';
      overallStatusClass = 'status-badge--potential';
      overallDescription = `You meet ${eligibleCount} out of ${totalQuestions} requirements. You may still be eligible, but should consult an advisor.`;
    } else {
      overallStatus = 'Not Eligible';
      overallStatusClass = 'status-badge--ineligible';
      overallDescription = `You meet ${eligibleCount} out of ${totalQuestions} requirements. This minor may not be the right fit.`;
    }

    const overallCard = document.createElement('div');
    overallCard.className = 'result-card reveal-anim';
    overallCard.style.setProperty('--delay', '0s');
    overallCard.style.gridColumn = '1 / -1'; // Span full width
    overallCard.innerHTML = `
      <div class="result-header">
        <h3>Overall Result</h3>
        <span class="status-badge ${overallStatusClass}">${overallStatus}</span>
      </div>
      <div class="result-body">
        <p>${overallDescription}</p>
      </div>
    `;
    resultsGrid.prepend(overallCard);

    $('#navHome').addEventListener('click', () => {
      if (window.appViews) {
        window.appViews.showOnly(document.getElementById('selectMinorView'));
      } else {
        window.location.href = 'selectminor.html';
      }
    });
  }

  // --- Global Init & Common Listeners ---
  function initCommon() {
    // Logout buttons
    $$('.logout-btn').forEach(btn => {
      btn.addEventListener('click', clearSession);
    });
    // No persistent page protection in UI-only mode. Use combined page for full demo.
  }

  // --- Run Initializers ---
  document.addEventListener('DOMContentLoaded', () => {
    const qp = new URLSearchParams(window.location.search);
    const name = qp.get('name');
    const email = qp.get('email');
    const selectedMinor = qp.get('selectedMinor');

    if (name || email) {
      tempState.currentUser = {
        name: name || (email ? email.split('@')[0] : 'Guest'),
        email: email || '',
        role: 'user',
      };
    }
    if (selectedMinor) tempState.selectedMinor = selectedMinor;

    if (!tempState.currentUser) {
      const sess = getSession();
      if (sess) tempState.currentUser = sess;
    }
    if (!tempState.selectedMinor) {
      try { tempState.selectedMinor = localStorage.getItem('selectedMinor') || null; } catch (e) { }
    }

    const userNameElem = document.getElementById('userName');
    if (tempState.currentUser && userNameElem) {
      userNameElem.style.display = 'flex';
      userNameElem.textContent = `Welcome, ${tempState.currentUser.name}!`;
    }
    if (tempState.currentUser) {
      $$('.logout-btn').forEach(b => b.style.display = 'inline-flex');
    }

    initCommon();
    initLoginPage();
    initRegisterPage();
    initSelectMinorPage();
    initQuizPage();
    initResultsPage();
  });

})();