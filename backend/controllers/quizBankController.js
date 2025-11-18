// Simple in-memory quiz bank controller
// Exposes endpoints to list minors and fetch questions for a minor

const quizBank = {
    "ai-ml": [
    { id: 1, question: "What does ML primarily focus on?", options: ["Pattern learning", "Database queries", "HTML rendering"], correct: "Pattern learning" },
    { id: 2, question: "Which is an ML algorithm?", options: ["KNN", "TCP", "SMTP"], correct: "KNN" },
    { id: 3, question: "What is a label in ML?", options: ["Output value", "Dataset size", "Feature name"], correct: "Output value" },
    { id: 4, question: "Which is an unsupervised method?", options: ["K-Means", "Naive Bayes", "Logistic Regression"], correct: "K-Means" },
    { id: 5, question: "Which language is most used for ML?", options: ["Python", "PHP", "Swift"], correct: "Python" },
    { id: 6, question: "Deep learning uses?", options: ["Neural networks", "Styling sheets", "Routing tables"], correct: "Neural networks" },
    { id: 7, question: "Which is a regression algorithm?", options: ["Linear Regression", "DFS", "AES"], correct: "Linear Regression" },
    { id: 8, question: "Which library is used for ML?", options: ["Scikit-learn", "Bootstrap", "Laravel"], correct: "Scikit-learn" },
    { id: 9, question: "Overfitting means?", options: ["Model fits noise", "Model too small", "No training"], correct: "Model fits noise" },
    { id: 10, question: "Which is a loss function?", options: ["MSE", "DNS", "EC2"], correct: "MSE" },
    { id: 11, question: "Which is an activation function?", options: ["ReLU", "FTP", "SSH"], correct: "ReLU" },
    { id: 12, question: "Training data is used to?", options: ["Fit model", "Build UI", "Store logs"], correct: "Fit model" },
    { id: 13, question: "Which is reinforcement learning?", options: ["Learning by rewards", "Learning by HTML", "Learning by videos"], correct: "Learning by rewards" },
    { id: 14, question: "Confusion matrix is used for?", options: ["Classification", "Web hosting", "Encryption"], correct: "Classification" },
    { id: 15, question: "Which technique reduces dimensions?", options: ["PCA", "SMTP", "CSS"], correct: "PCA" },
    { id: 16, question: "What is a neuron in DL?", options: ["Computational unit", "Cell battery", "Memory chip"], correct: "Computational unit" },
    { id: 17, question: "CNNs are used in?", options: ["Image tasks", "Networking", "Data storage"], correct: "Image tasks" },
    { id: 18, question: "NLP stands for?", options: ["Natural Language Processing", "Network Layer Protocol", "New Logic Parsing"], correct: "Natural Language Processing" },
    { id: 19, question: "Which is a clustering method?", options: ["DBSCAN", "HTTPS", "JWT"], correct: "DBSCAN" },
    { id: 20, question: "Which term describes model accuracy?", options: ["Metric", "Callback", "Instance"], correct: "Metric" },
    { id: 21, question: "Dropout is used to?", options: ["Reduce overfitting", "Store emails", "Increase RAM"], correct: "Reduce overfitting" },
    { id: 22, question: "GAN stands for?", options: ["Generative Adversarial Network", "General AI Network", "Graphic Application Node"], correct: "Generative Adversarial Network" },
    { id: 23, question: "Which is a tree algorithm?", options: ["Decision Tree", "XML Tree", "DNS Tree"], correct: "Decision Tree" },
    { id: 24, question: "Feature scaling includes?", options: ["Normalization", "Encryption", "Deployment"], correct: "Normalization" },
    { id: 25, question: "Which algorithm predicts categories?", options: ["Logistic Regression", "Ping", "Traceroute"], correct: "Logistic Regression" },
    { id: 26, question: "Which technique splits data?", options: ["Train-test split", "IP split", "HTML split"], correct: "Train-test split" },
    { id: 27, question: "Which optimizes learning?", options: ["Gradient Descent", "Heap Sort", "Bubble Sort"], correct: "Gradient Descent" },
    { id: 28, question: "Model evaluation uses?", options: ["Validation set", "RSS Feed", "Firewalls"], correct: "Validation set" },
    { id: 29, question: "Which boosts weak learners?", options: ["Adaboost", "TimeBoost", "GeoBoost"], correct: "Adaboost" },
    { id: 30, question: "Which library is for DL?", options: ["TensorFlow", "Express.js", "Docker"], correct: "TensorFlow" }
   ],
   "data-science": [
   { id: 1, question: "What does EDA stand for?", options: ["Exploratory Data Analysis", "External Data Access", "Enhanced Data Analytics"], correct: "Exploratory Data Analysis" },
   { id: 2, question: "Which library is widely used for data manipulation in Python?", options: ["Pandas", "Flask", "Django"], correct: "Pandas" },
   { id: 3, question: "Which chart is best to visualize categorical data?", options: ["Bar chart", "Line chart", "Scatter plot"], correct: "Bar chart" },
   { id: 4, question: "Which file format is commonly used for datasets?", options: ["CSV", "EXE", "APK"], correct: "CSV" },
   { id: 5, question: "What does NA mean in datasets?", options: ["Missing value", "Negative attribute", "New array"], correct: "Missing value" },
   { id: 6, question: "Which technique is used for reducing dimensions?", options: ["PCA", "DNS", "OCR"], correct: "PCA" },
   { id: 7, question: "Which algorithm is used for clustering?", options: ["K-Means", "Linear Regression", "SVM"], correct: "K-Means" },
   { id: 8, question: "Which measure shows average?", options: ["Mean", "Variance", "Correlation"], correct: "Mean" },
   { id: 9, question: "What does correlation show?", options: ["Relationship between variables", "File size", "Execution time"], correct: "Relationship between variables" },
   { id: 10, question: "Which plot is used for outlier detection?", options: ["Box plot", "Pie chart", "Heatmap"], correct: "Box plot" },
   { id: 11, question: "Which metric is used for regression?", options: ["RMSE", "Accuracy", "Recall"], correct: "RMSE" },
   { id: 12, question: "Which database is used to store large data?", options: ["MongoDB", "Paint", "Notepad"], correct: "MongoDB" },
   { id: 13, question: "Which language is most used in data science?", options: ["Python", "Ruby", "C#"], correct: "Python" },
   { id: 14, question: "Which ML algorithm predicts continuous values?", options: ["Linear Regression", "K-Means", "Decision Tree Classifier"], correct: "Linear Regression" },
   { id: 15, question: "Which tool is used for big data processing?", options: ["Hadoop", "VS Code", "Excel"], correct: "Hadoop" },
   { id: 16, question: "Which function merges datasets in pandas?", options: ["merge()", "connect()", "compile()"], correct: "merge()" },
   { id: 17, question: "What does feature scaling do?", options: ["Normalizes data", "Prints data", "Deletes rows"], correct: "Normalizes data" },
   { id: 18, question: "Which measure shows data spread?", options: ["Standard deviation", "Mode", "Sum"], correct: "Standard deviation" },
   { id: 19, question: "Which chart is best for time-series?", options: ["Line chart", "Pie chart", "Donut chart"], correct: "Line chart" },
   { id: 20, question: "Which is a supervised algorithm?", options: ["SVM", "K-Means", "Apriori"], correct: "SVM" },
   { id: 21, question: "Which is used for association mining?", options: ["Apriori", "DNS lookup", "Sorting"], correct: "Apriori" },
   { id: 22, question: "Which term refers to biased sampling?", options: ["Sampling bias", "Data merging", "Clustering"], correct: "Sampling bias" },
   { id: 23, question: "Which library is used for visualization?", options: ["Matplotlib", "Spring Boot", "Bootstrap"], correct: "Matplotlib" },
   { id: 24, question: "Which SQL command retrieves data?", options: ["SELECT", "PUSH", "INSTALL"], correct: "SELECT" },
   { id: 25, question: "Which algorithm is used for classification?", options: ["Decision Tree", "Heap Sort", "AES Encryption"], correct: "Decision Tree" },
   { id: 26, question: "What is cleaning data called?", options: ["Data preprocessing", "Data painting", "Data freezing"], correct: "Data preprocessing" },
   { id: 27, question: "Which metric evaluates classification?", options: ["Accuracy", "Latency", "RAM size"], correct: "Accuracy" },
   { id: 28, question: "A heatmap is used to visualize?", options: ["Correlation", "File types", "RAM usage"], correct: "Correlation" },
   { id: 29, question: "What does data wrangling mean?", options: ["Transforming raw data", "Deleting hardware", "Installing OS"], correct: "Transforming raw data" },
   { id: 30, question: "Which is a cloud platform for data science?", options: ["AWS", "Blender", "Photoshop"], correct: "AWS" }
  ],
  "iot": [ /* truncated for brevity in file - full set available in repo */ ]
};

// Return list of available minor IDs
exports.listMinors = (req, res) => {
  try {
    const minors = Object.keys(quizBank).map((id) => ({ id }));
    res.json({ success: true, count: minors.length, data: minors });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Return questions for a specific minor
exports.getMinorQuestions = (req, res) => {
  try {
    const minorId = req.params.minorId;
    const questions = quizBank[minorId];
    if (!questions) return res.status(404).json({ success: false, message: 'Minor not found' });

    // Do not send 'correct' field to client by default
    const sanitized = questions.map(q => ({ id: q.id, question: q.question, options: q.options }));
    res.json({ success: true, count: sanitized.length, data: sanitized });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Optional: endpoint to validate answers (simple check)
exports.validateAnswers = (req, res) => {
  try {
    const { minorId, answers } = req.body;
    if (!minorId || !answers) return res.status(400).json({ success: false, message: 'minorId and answers required' });
    const questions = quizBank[minorId];
    if (!questions) return res.status(404).json({ success: false, message: 'Minor not found' });

    const results = answers.map(ans => {
      const q = questions.find(o => o.id === ans.id);
      return { id: ans.id, correct: q ? q.correct === ans.answer : false };
    });
    res.json({ success: true, results });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Export quizBank for seed scripts
exports.quizBank = quizBank;
