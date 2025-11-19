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
  "iot": [  { id: 1, question: "What does IoT stand for?", options: ["Internet of Things", "Input Output Transmission", "Internal Operating Task"], correct: "Internet of Things" },

  { id: 2, question: "Which protocol is commonly used in IoT?", options: ["MQTT", "SMTP", "POP3"], correct: "MQTT" },

  { id: 3, question: "Which device collects sensor data?", options: ["Microcontroller", "Monitor", "Printer"], correct: "Microcontroller" },

  { id: 4, question: "Which board is widely used in IoT projects?", options: ["Arduino", "PlayStation", "Raspberry Pi 5"], correct: "Arduino" },

  { id: 5, question: "What is a sensor?", options: ["Device that detects physical changes", "Device that prints pages", "Device that stores movies"], correct: "Device that detects physical changes" },

  { id: 6, question: "Which wireless technology is used for short range?", options: ["Bluetooth", "RFID", "Fiber optics"], correct: "Bluetooth" },

  { id: 7, question: "Which network is used for low-power wide-area IoT?", options: ["LoRaWAN", "Ethernet", "HDMI"], correct: "LoRaWAN" },

  { id: 8, question: "What is an actuator?", options: ["Device that acts on commands", "Device that stores data", "Device that plays audio"], correct: "Device that acts on commands" },

  { id: 9, question: "What does RFID use?", options: ["Radio waves", "Light pulses", "Magnetic tapes"], correct: "Radio waves" },

  { id: 10, question: "Which cloud platform is used for IoT?", options: ["AWS IoT Core", "Figma", "Premiere Pro"], correct: "AWS IoT Core" },

  { id: 11, question: "Which communication uses very little power?", options: ["Zigbee", "5G", "VGA"], correct: "Zigbee" },

  { id: 12, question: "Which sensor measures temperature?", options: ["DHT11", "IR sensor", "Buzzer"], correct: "DHT11" },

  { id: 13, question: "What is the purpose of a gateway?", options: ["Connect IoT devices to network", "Store emails", "Enhance camera quality"], correct: "Connect IoT devices to network" },

  { id: 14, question: "Which module enables WiFi in IoT?", options: ["ESP8266", "HDMI", "VLC"], correct: "ESP8266" },

  { id: 15, question: "Which layer transmits data in IoT?", options: ["Network layer", "Presentation layer", "Physical security"], correct: "Network layer" },

  { id: 16, question: "Which communication protocol is lightweight?", options: ["CoAP", "SMTP", "SSH"], correct: "CoAP" },

  { id: 17, question: "Edge computing means?", options: ["Processing data near the device", "Processing in remote cloud only", "Deleting sensor data"], correct: "Processing data near the device" },

  { id: 18, question: "What is the main challenge in IoT?", options: ["Security", "Color theme selection", "Font selection"], correct: "Security" },

  { id: 19, question: "Which is a wearable IoT device?", options: ["Smartwatch", "Projector", "Whiteboard"], correct: "Smartwatch" },

  { id: 20, question: "Which protocol is used for device discovery?", options: ["UPnP", "SMTP", "POP"], correct: "UPnP" },

  { id: 21, question: "What does the term ‘smart home’ refer to?", options: ["Automated IoT-enabled home", "A home with many TVs", "A home with extra lights"], correct: "Automated IoT-enabled home" },

  { id: 22, question: "Which power source is common for IoT sensors?", options: ["Battery", "Nuclear reactor", "Diesel"], correct: "Battery" },

  { id: 23, question: "Which pin is used to read sensor values?", options: ["Analog pin", "HDMI port", "LAN port"], correct: "Analog pin" },

  { id: 24, question: "Which sensor detects motion?", options: ["PIR sensor", "GPS sensor", "Gas sensor"], correct: "PIR sensor" },

  { id: 25, question: "Which language is often used to program Arduino?", options: ["C/C++", "Ruby", "Swift"], correct: "C/C++" },

  { id: 26, question: "IoT devices are usually?", options: ["Low-power", "High-voltage systems", "Large servers"], correct: "Low-power" },

  { id: 27, question: "What does a GPS module provide?", options: ["Location data", "Audio recording", "Image capture"], correct: "Location data" },

  { id: 28, question: "Which protocol is used for IoT messaging?", options: ["AMQP", "IMAP", "MPEG"], correct: "AMQP" },

  { id: 29, question: "Which sensor is used for distance measurement?", options: ["Ultrasonic sensor", "Thermal sensor", "Gyroscope"], correct: "Ultrasonic sensor" },

  { id: 30, question: "Smart agriculture uses?", options: ["IoT soil sensors", "Bluetooth speakers", "Gaming GPUs"], correct: "IoT soil sensors" }
],
 "product-management-and-desgin": [
  { 
    id: 1,
    question: "What is the primary role of a Product Manager?",
    options: ["Write code for the product", "Define product vision and strategy", "Handle company finances"],
    correct: "Define product vision and strategy"
  },
  { 
    id: 2,
    question: "What is a user persona?",
    options: ["A fictional character representing target users", "A company employee", "A marketing slogan"],
    correct: "A fictional character representing target users"
  },
  { 
    id: 3,
    question: "What does MVP stand for?",
    options: ["Most Valuable Price", "Minimum Viable Product", "Market Value Proposition"],
    correct: "Minimum Viable Product"
  },
  { 
    id: 4,
    question: "Which method is used to understand user pain points?",
    options: ["User interviews", "Coding", "Debugging"],
    correct: "User interviews"
  },
  { 
    id: 5,
    question: "Wireframes are used to represent:",
    options: ["Final UI", "Basic structure of screens", "App performance"],
    correct: "Basic structure of screens"
  },
  { 
    id: 6,
    question: "What is a product backlog?",
    options: ["A list of all project expenses", "A prioritized list of features", "A bug report"],
    correct: "A prioritized list of features"
  },
  { 
    id: 7,
    question: "Which methodology uses sprints?",
    options: ["Agile", "Waterfall", "DevOps"],
    correct: "Agile"
  },
  { 
    id: 8,
    question: "What does UI stand for?",
    options: ["Universal Interaction", "User Interface", "Unique Idea"],
    correct: "User Interface"
  },
  { 
    id: 9,
    question: "What does UX refer to?",
    options: ["User Exchange", "User Experience", "Unit Execution"],
    correct: "User Experience"
  },
  { 
    id: 10,
    question: "A prototype is:",
    options: ["A fully coded product", "A test version to validate ideas", "A database model"],
    correct: "A test version to validate ideas"
  },
  { 
    id: 11,
    question: "Which tool is commonly used for UI/UX design?",
    options: ["Photoshop", "Figma", "Excel"],
    correct: "Figma"
  },
  { 
    id: 12,
    question: "What is A/B testing used for?",
    options: ["Comparing two versions of a product", "Checking backend speed", "Loading images"],
    correct: "Comparing two versions of a product"
  },
  { 
    id: 13,
    question: "Roadmap in product management shows:",
    options: ["Team salaries", "Timeline and plan of product features", "UI color themes"],
    correct: "Timeline and plan of product features"
  },
  { 
    id: 14,
    question: "What is a KPI?",
    options: ["Key Performance Indicator", "Known Production Issue", "Key Product Image"],
    correct: "Key Performance Indicator"
  },
  { 
    id: 15,
    question: "Design thinking starts with:",
    options: ["Coding", "Empathizing with users", "Marketing"],
    correct: "Empathizing with users"
  },
  { 
    id: 16,
    question: "What is usability testing?",
    options: ["Testing server load", "Observing users interact with product", "Fixing memory leaks"],
    correct: "Observing users interact with product"
  },
  { 
    id: 17,
    question: "What does feature prioritization help with?",
    options: ["Arranging product screens", "Deciding what to build first", "Writing documentation"],
    correct: "Deciding what to build first"
  },
  { 
    id: 18,
    question: "Which technique uses importance vs effort?",
    options: ["Kanban", "Prioritization matrix", "Wireframing"],
    correct: "Prioritization matrix"
  },
  { 
    id: 19,
    question: "What is a user journey map?",
    options: ["A travel plan", "A flow showing user interactions", "A team task list"],
    correct: "A flow showing user interactions"
  },
  { 
    id: 20,
    question: "Purpose of a design system:",
    options: ["Store bugs", "Maintain consistent UI components", "Improve battery life"],
    correct: "Maintain consistent UI components"
  },
  { 
    id: 21,
    question: "What is a sprint review?",
    options: ["Testing internet speed", "Reviewing completed work", "Approving budgets"],
    correct: "Reviewing completed work"
  },
  { 
    id: 22,
    question: "Low-fidelity designs are typically:",
    options: ["Fully interactive", "Simple sketches", "High-resolution screens"],
    correct: "Simple sketches"
  },
  { 
    id: 23,
    question: "What is a PRD?",
    options: ["Code documentation", "Product Requirement Document", "Team schedule"],
    correct: "Product Requirement Document"
  },
  { 
    id: 24,
    question: "What is customer segmentation?",
    options: ["Dividing products", "Dividing customers based on characteristics", "Dividing code into modules"],
    correct: "Dividing customers based on characteristics"
  },
  { 
    id: 25,
    question: "Success metrics are used to:",
    options: ["Measure product performance", "Hire team members", "Change color themes"],
    correct: "Measure product performance"
  },
  { 
    id: 26,
    question: "User onboarding aims to:",
    options: ["Teach users how to use product", "Backup data", "Test servers"],
    correct: "Teach users how to use product"
  },
  { 
    id: 27,
    question: "What is a mockup?",
    options: ["Final coded product", "High-fidelity visual design", "Error message"],
    correct: "High-fidelity visual design"
  },
  { 
    id: 28,
    question: "CAC stands for:",
    options: ["Campaign Analysis Code", "Customer Acquisition Cost", "Client Admin Control"],
    correct: "Customer Acquisition Cost"
  },
  { 
    id: 29,
    question: "Goal of product-market fit:",
    options: ["Increase meetings", "Ensure product solves user needs", "Reduce design time"],
    correct: "Ensure product solves user needs"
  },
  { 
    id: 30,
    question: "A UX researcher mainly:",
    options: ["Builds backend APIs", "Studies user behavior", "Prepares sales reports"],
    correct: "Studies user behavior"
  }
 ],
 "fintech-Block-chain":[
  {
    id: 1,
    question: "What is the main purpose of FinTech?",
    options: ["Improve financial services using technology", "Sell physical financial devices", "Replace banks completely"],
    correct: "Improve financial services using technology"
  },
  {
    id: 2,
    question: "Blockchain is essentially a:",
    options: ["Centralized database", "Distributed ledger", "Local file system"],
    correct: "Distributed ledger"
  },
  {
    id: 3,
    question: "What is a cryptocurrency?",
    options: ["Digital currency secured by cryptography", "Paper-based digital money", "Encrypted PDF"],
    correct: "Digital currency secured by cryptography"
  },
  {
    id: 4,
    question: "Which was the first cryptocurrency?",
    options: ["Ethereum", "Bitcoin", "Dogecoin"],
    correct: "Bitcoin"
  },
  {
    id: 5,
    question: "In blockchain, a block mainly contains:",
    options: ["Images only", "Transactions and hash", "Passwords"],
    correct: "Transactions and hash"
  },
  {
    id: 6,
    question: "What does KYC stand for?",
    options: ["Know Your Customer", "Keep Your Card", "Know Your Code"],
    correct: "Know Your Customer"
  },
  {
    id: 7,
    question: "Smart contracts run on which platform?",
    options: ["Ethereum", "Photoshop", "Excel"],
    correct: "Ethereum"
  },
  {
    id: 8,
    question: "A digital wallet is used to:",
    options: ["Store cryptocurrency", "Store emails", "Store documents securely"],
    correct: "Store cryptocurrency"
  },
  {
    id: 9,
    question: "What is a hash in blockchain?",
    options: ["A random number", "Unique identifier generated by algorithm", "A color code"],
    correct: "Unique identifier generated by algorithm"
  },
  {
    id: 10,
    question: "Which technology makes blockchain secure?",
    options: ["Cryptography", "WiFi", "Bluetooth"],
    correct: "Cryptography"
  },
  {
    id: 11,
    question: "What is a decentralized network?",
    options: ["Single central authority controls data", "Multiple nodes share control", "No computers involved"],
    correct: "Multiple nodes share control"
  },
  {
    id: 12,
    question: "What does NFT stand for?",
    options: ["Non-Financial Token", "Non-Fungible Token", "Network File Transfer"],
    correct: "Non-Fungible Token"
  },
  {
    id: 13,
    question: "Which consensus mechanism is used by Bitcoin?",
    options: ["Proof of Work", "Proof of Stake", "Proof of Identity"],
    correct: "Proof of Work"
  },
  {
    id: 14,
    question: "What is Proof of Stake?",
    options: ["Users mine using computing power", "Users validate blocks by staking coins", "Users vote using tokens"],
    correct: "Users validate blocks by staking coins"
  },
  {
    id: 15,
    question: "Which company launched UPI in India?",
    options: ["NPCI", "Google", "Paytm"],
    correct: "NPCI"
  },
  {
    id: 16,
    question: "What does API stand for in FinTech?",
    options: ["Automatic Payment Integration", "Application Programming Interface", "Account Processing Index"],
    correct: "Application Programming Interface"
  },
  {
    id: 17,
    question: "What is robo-advisory?",
    options: ["Robots repairing ATMs", "AI-based automated financial advice", "Chatbots answering calls"],
    correct: "AI-based automated financial advice"
  },
  {
    id: 18,
    question: "A blockchain ‘node’ refers to:",
    options: ["A file", "A computer participating in blockchain", "A password"],
    correct: "A computer participating in blockchain"
  },
  {
    id: 19,
    question: "Tokenization means:",
    options: ["Converting assets into digital tokens", "Deleting user accounts", "Encrypting passwords"],
    correct: "Converting assets into digital tokens"
  },
  {
    id: 20,
    question: "What is DeFi?",
    options: ["Deep Finance", "Decentralized Finance", "Defined Financial Institute"],
    correct: "Decentralized Finance"
  },
  {
    id: 21,
    question: "Digital payments in India are monitored by:",
    options: ["NPCI", "Amazon", "ICICI"],
    correct: "NPCI"
  },
  {
    id: 22,
    question: "Which of the following is a blockchain use case?",
    options: ["Gaming skins only", "Secure supply chain tracking", "Shipping food"],
    correct: "Secure supply chain tracking"
  },
  {
    id: 23,
    question: "UPI uses which type of authentication?",
    options: ["OTP + PIN", "Voice recognition", "None"],
    correct: "OTP + PIN"
  },
  {
    id: 24,
    question: "Which platform is widely used for CBDCs?",
    options: ["Blockchain", "Bluetooth", "Infrared"],
    correct: "Blockchain"
  },
  {
    id: 25,
    question: "What is a blockchain explorer?",
    options: ["Tool for viewing transactions", "AI chatbot", "Password keeper"],
    correct: "Tool for viewing transactions"
  },
  {
    id: 26,
    question: "Which FinTech service does Google Pay provide?",
    options: ["Video streaming", "Digital payments", "Email marketing"],
    correct: "Digital payments"
  },
  {
    id: 27,
    question: "Private blockchain means:",
    options: ["Open to everyone", "Restricted access to selected members", "Only government can use it"],
    correct: "Restricted access to selected members"
  },
  {
    id: 28,
    question: "Which of these stores a crypto private key?",
    options: ["Digital wallet", "USB cable", "QR code"],
    correct: "Digital wallet"
  },
  {
    id: 29,
    question: "A blockchain transaction is verified by:",
    options: ["Miners/validators", "A single admin", "Antivirus software"],
    correct: "Miners/validators"
  },
  {
    id: 30,
    question: "The main benefit of blockchain is:",
    options: ["Opacity", "Transparency & security", "Slow processing"],
    correct: "Transparency & security"
  }
],
 "blockchain-and-cybersecurity": [
  {
    id: 1,
    question: "What is the basic unit of life?",
    options: ["Atom", "Cell", "Organ"],
    correct: "Cell"
  },
  {
    id: 2,
    question: "DNA stands for:",
    options: ["Deoxyribonucleic Acid", "Dynamic Natural Acid", "Digital Nucleic Algorithm"],
    correct: "Deoxyribonucleic Acid"
  },
  {
    id: 3,
    question: "Which organism performs photosynthesis?",
    options: ["Plants", "Animals", "Fungi"],
    correct: "Plants"
  },
  {
    id: 4,
    question: "The human heart has how many chambers?",
    options: ["2", "4", "6"],
    correct: "4"
  },
  {
    id: 5,
    question: "Which vitamin is produced by sunlight?",
    options: ["Vitamin C", "Vitamin D", "Vitamin B12"],
    correct: "Vitamin D"
  },
  {
    id: 6,
    question: "Red blood cells carry:",
    options: ["Oxygen", "Sugar", "Water"],
    correct: "Oxygen"
  },
  {
    id: 7,
    question: "Which organ filters blood?",
    options: ["Liver", "Kidney", "Lungs"],
    correct: "Kidney"
  },
  {
    id: 8,
    question: "Which is the largest organ in the human body?",
    options: ["Skin", "Heart", "Lungs"],
    correct: "Skin"
  },
  {
    id: 9,
    question: "What do enzymes do?",
    options: ["Speed up chemical reactions", "Store DNA", "Transport blood"],
    correct: "Speed up chemical reactions"
  },
  {
    id: 10,
    question: "A virus is:",
    options: ["Non-living particle", "Type of bacteria", "Plant organism"],
    correct: "Non-living particle"
  },
  {
    id: 11,
    question: "Which system controls body movement?",
    options: ["Nervous system", "Digestive system", "Respiratory system"],
    correct: "Nervous system"
  },
  {
    id: 12,
    question: "Chlorophyll gives plants their:",
    options: ["Green color", "Red color", "Blue color"],
    correct: "Green color"
  },
  {
    id: 13,
    question: "Which gas do humans exhale?",
    options: ["Oxygen", "Carbon dioxide", "Nitrogen"],
    correct: "Carbon dioxide"
  },
  {
    id: 14,
    question: "Insulin controls:",
    options: ["Blood sugar levels", "Heart beat", "Body temperature"],
    correct: "Blood sugar levels"
  },
  {
    id: 15,
    question: "What is an ecosystem?",
    options: ["Interaction of living and non-living things", "A plant cell", "A type of bacteria"],
    correct: "Interaction of living and non-living things"
  },
  {
    id: 16,
    question: "Which organism has a backbone?",
    options: ["Vertebrates", "Invertebrates", "Plants"],
    correct: "Vertebrates"
  },
  {
    id: 17,
    question: "Genetics is the study of:",
    options: ["Heredity", "Weather", "Chemistry"],
    correct: "Heredity"
  },
  {
    id: 18,
    question: "Which organ pumps blood?",
    options: ["Heart", "Liver", "Stomach"],
    correct: "Heart"
  },
  {
    id: 19,
    question: "RNA is mainly used for:",
    options: ["Protein synthesis", "Bone formation", "Breathing"],
    correct: "Protein synthesis"
  },
  {
    id: 20,
    question: "Which part of the cell contains genetic material?",
    options: ["Nucleus", "Mitochondria", "Golgi body"],
    correct: "Nucleus"
  },
  {
    id: 21,
    question: "Bacteria reproduce by:",
    options: ["Binary fission", "Laying eggs", "Photosynthesis"],
    correct: "Binary fission"
  },
  {
    id: 22,
    question: "Which is a communicable disease?",
    options: ["Flu", "Cancer", "Diabetes"],
    correct: "Flu"
  },
  {
    id: 23,
    question: "Which nutrient builds muscles?",
    options: ["Proteins", "Fats", "Water"],
    correct: "Proteins"
  },
  {
    id: 24,
    question: "Humans normally have how many chromosomes?",
    options: ["46", "23", "92"],
    correct: "46"
  },
  {
    id: 25,
    question: "The study of fungi is called:",
    options: ["Mycology", "Botany", "Zoology"],
    correct: "Mycology"
  },
  {
    id: 26,
    question: "Which blood cells fight infections?",
    options: ["White blood cells", "Red blood cells", "Platelets"],
    correct: "White blood cells"
  },
  {
    id: 27,
    question: "DNA is located in:",
    options: ["Nucleus", "Ribosome", "Chloroplast"],
    correct: "Nucleus"
  },
  {
    id: 28,
    question: "What is biodiversity?",
    options: ["Variety of life forms", "Type of plant", "Food chain"],
    correct: "Variety of life forms"
  },
  {
    id: 29,
    question: "Which organism is used in making bread?",
    options: ["Yeast", "Bacteria", "Virus"],
    correct: "Yeast"
  },
  {
    id: 30,
    question: "The process of breathing is called:",
    options: ["Respiration", "Evaporation", "Reproduction"],
    correct: "Respiration"
  }
 ],
 "life-sciences": [{
    id: 1,
    question: "What is the basic unit of life?",
    options: ["Atom", "Cell", "Organ"],
    correct: "Cell"
  },
  {
    id: 2,
    question: "DNA stands for:",
    options: ["Deoxyribonucleic Acid", "Dynamic Natural Acid", "Digital Nucleic Algorithm"],
    correct: "Deoxyribonucleic Acid"
  },
  {
    id: 3,
    question: "Which organism performs photosynthesis?",
    options: ["Plants", "Animals", "Fungi"],
    correct: "Plants"
  },
  {
    id: 4,
    question: "The human heart has how many chambers?",
    options: ["2", "4", "6"],
    correct: "4"
  },
  {
    id: 5,
    question: "Which vitamin is produced by sunlight?",
    options: ["Vitamin C", "Vitamin D", "Vitamin B12"],
    correct: "Vitamin D"
  },
  {
    id: 6,
    question: "Red blood cells carry:",
    options: ["Oxygen", "Sugar", "Water"],
    correct: "Oxygen"
  },
  {
    id: 7,
    question: "Which organ filters blood?",
    options: ["Liver", "Kidney", "Lungs"],
    correct: "Kidney"
  },
  {
    id: 8,
    question: "Which is the largest organ in the human body?",
    options: ["Skin", "Heart", "Lungs"],
    correct: "Skin"
  },
  {
    id: 9,
    question: "What do enzymes do?",
    options: ["Speed up chemical reactions", "Store DNA", "Transport blood"],
    correct: "Speed up chemical reactions"
  },
  {
    id: 10,
    question: "A virus is:",
    options: ["Non-living particle", "Type of bacteria", "Plant organism"],
    correct: "Non-living particle"
  },
  {
    id: 11,
    question: "Which system controls body movement?",
    options: ["Nervous system", "Digestive system", "Respiratory system"],
    correct: "Nervous system"
  },
  {
    id: 12,
    question: "Chlorophyll gives plants their:",
    options: ["Green color", "Red color", "Blue color"],
    correct: "Green color"
  },
  {
    id: 13,
    question: "Which gas do humans exhale?",
    options: ["Oxygen", "Carbon dioxide", "Nitrogen"],
    correct: "Carbon dioxide"
  },
  {
    id: 14,
    question: "Insulin controls:",
    options: ["Blood sugar levels", "Heart beat", "Body temperature"],
    correct: "Blood sugar levels"
  },
  {
    id: 15,
    question: "What is an ecosystem?",
    options: ["Interaction of living and non-living things", "A plant cell", "A type of bacteria"],
    correct: "Interaction of living and non-living things"
  },
  {
    id: 16,
    question: "Which organism has a backbone?",
    options: ["Vertebrates", "Invertebrates", "Plants"],
    correct: "Vertebrates"
  },
  {
    id: 17,
    question: "Genetics is the study of:",
    options: ["Heredity", "Weather", "Chemistry"],
    correct: "Heredity"
  },
  {
    id: 18,
    question: "Which organ pumps blood?",
    options: ["Heart", "Liver", "Stomach"],
    correct: "Heart"
  },
  {
    id: 19,
    question: "RNA is mainly used for:",
    options: ["Protein synthesis", "Bone formation", "Breathing"],
    correct: "Protein synthesis"
  },
  {
    id: 20,
    question: "Which part of the cell contains genetic material?",
    options: ["Nucleus", "Mitochondria", "Golgi body"],
    correct: "Nucleus"
  },
  {
    id: 21,
    question: "Bacteria reproduce by:",
    options: ["Binary fission", "Laying eggs", "Photosynthesis"],
    correct: "Binary fission"
  },
  {
    id: 22,
    question: "Which is a communicable disease?",
    options: ["Flu", "Cancer", "Diabetes"],
    correct: "Flu"
  },
  {
    id: 23,
    question: "Which nutrient builds muscles?",
    options: ["Proteins", "Fats", "Water"],
    correct: "Proteins"
  },
  {
    id: 24,
    question: "Humans normally have how many chromosomes?",
    options: ["46", "23", "92"],
    correct: "46"
  },
  {
    id: 25,
    question: "The study of fungi is called:",
    options: ["Mycology", "Botany", "Zoology"],
    correct: "Mycology"
  },
  {
    id: 26,
    question: "Which blood cells fight infections?",
    options: ["White blood cells", "Red blood cells", "Platelets"],
    correct: "White blood cells"
  },
  {
    id: 27,
    question: "DNA is located in:",
    options: ["Nucleus", "Ribosome", "Chloroplast"],
    correct: "Nucleus"
  },
  {
    id: 28,
    question: "What is biodiversity?",
    options: ["Variety of life forms", "Type of plant", "Food chain"],
    correct: "Variety of life forms"
  },
  {
    id: 29,
    question: "Which organism is used in making bread?",
    options: ["Yeast", "Bacteria", "Virus"],
    correct: "Yeast"
  },
  {
    id: 30,
    question: "The process of breathing is called:",
    options: ["Respiration", "Evaporation", "Reproduction"],
    correct: "Respiration"
  }
],
"energy-sciences": [
    {
    id: 1,
    question: "Energy cannot be created or destroyed. This is:",
    options: ["Law of conservation of energy", "Newton’s law", "Thermal expansion law"],
    correct: "Law of conservation of energy"
  },
  {
    id: 2,
    question: "Which is a renewable energy source?",
    options: ["Solar power", "Petroleum", "Coal"],
    correct: "Solar power"
  },
  {
    id: 3,
    question: "Wind turbines convert:",
    options: ["Kinetic energy to electrical", "Heat to sound", "Light to chemical"],
    correct: "Kinetic energy to electrical"
  },
  {
    id: 4,
    question: "Fossil fuels are formed from:",
    options: ["Dead plants & animals", "Rocks", "Water"],
    correct: "Dead plants & animals"
  },
  {
    id: 5,
    question: "Which gas is a major contributor to global warming?",
    options: ["CO2", "Oxygen", "Helium"],
    correct: "CO2"
  },
  {
    id: 6,
    question: "Hydropower uses:",
    options: ["Flowing water", "Sunlight", "Batteries"],
    correct: "Flowing water"
  },
  {
    id: 7,
    question: "Which device converts sunlight into electricity?",
    options: ["Solar panel", "Transformer", "Windmill"],
    correct: "Solar panel"
  },
  {
    id: 8,
    question: "Nuclear fission splits:",
    options: ["Atoms", "Rocks", "Water molecules"],
    correct: "Atoms"
  },
  {
    id: 9,
    question: "Coal is an example of:",
    options: ["Non-renewable energy", "Renewable energy", "Organic fuel"],
    correct: "Non-renewable energy"
  },
  {
    id: 10,
    question: "Which energy is stored in food?",
    options: ["Chemical energy", "Nuclear energy", "Light energy"],
    correct: "Chemical energy"
  },
  {
    id: 11,
    question: "Geothermal energy comes from:",
    options: ["Heat inside Earth", "Ocean waves", "Sunlight"],
    correct: "Heat inside Earth"
  },
  {
    id: 12,
    question: "Which state of matter has the most energy?",
    options: ["Gas", "Solid", "Liquid"],
    correct: "Gas"
  },
  {
    id: 13,
    question: "Biomass energy uses:",
    options: ["Organic waste", "Plastic", "Metals"],
    correct: "Organic waste"
  },
  {
    id: 14,
    question: "Electricity is measured in:",
    options: ["Volts", "Meters", "Liters"],
    correct: "Volts"
  },
  {
    id: 15,
    question: "Which country is known for wind energy production?",
    options: ["Denmark", "Saudi Arabia", "Brazil"],
    correct: "Denmark"
  },
  {
    id: 16,
    question: "Greenhouse effect traps:",
    options: ["Heat", "Water", "Dust"],
    correct: "Heat"
  },
  {
    id: 17,
    question: "Kinetic energy is energy of:",
    options: ["Motion", "Rest", "Color"],
    correct: "Motion"
  },
  {
    id: 18,
    question: "Nuclear reactors use:",
    options: ["Uranium", "Coal", "Wood"],
    correct: "Uranium"
  },
  {
    id: 19,
    question: "Electric vehicles run on:",
    options: ["Batteries", "Diesel", "Water"],
    correct: "Batteries"
  },
  {
    id: 20,
    question: "Which energy source is the cleanest?",
    options: ["Solar", "Coal", "Diesel"],
    correct: "Solar"
  },
  {
    id: 21,
    question: "Hydrogen fuel is considered:",
    options: ["A clean energy", "Non-renewable", "Dangerous only"],
    correct: "A clean energy"
  },
  {
    id: 22,
    question: "Which device measures electricity consumption?",
    options: ["Electric meter", "Thermometer", "Barometer"],
    correct: "Electric meter"
  },
  {
    id: 23,
    question: "Solar energy is converted into power using:",
    options: ["Photovoltaic cells", "Magnets", "Metal rods"],
    correct: "Photovoltaic cells"
  },
  {
    id: 24,
    question: "The world’s largest source of energy currently is:",
    options: ["Oil", "Solar", "Wind"],
    correct: "Oil"
  },
  {
    id: 25,
    question: "Energy stored due to position is:",
    options: ["Potential energy", "Kinetic energy", "Chemical energy"],
    correct: "Potential energy"
  },
  {
    id: 26,
    question: "Which is an example of clean transportation?",
    options: ["Electric cars", "Diesel trucks", "Oil ships"],
    correct: "Electric cars"
  },
  {
    id: 27,
    question: "What is an energy audit?",
    options: ["Assessment of energy usage", "Tax report", "Solar repair"],
    correct: "Assessment of energy usage"
  },
  {
    id: 28,
    question: "LED bulbs consume:",
    options: ["Less energy", "More energy", "Same as CFL"],
    correct: "Less energy"
  },
  {
    id: 29,
    question: "Which is a greenhouse gas?",
    options: ["Carbon dioxide", "Argon", "Helium"],
    correct: "Carbon dioxide"
  },
  {
    id: 30,
    question: "Sustainable energy means:",
    options: ["Energy that doesn't run out", "Expensive energy", "Energy from machines"],
    correct: "Energy that doesn't run out"
  }
],
"enterentrepreneurship": [
    {
    id: 1,
    question: "Entrepreneurship means:",
    options: ["Starting and managing a business", "Working for a company", "Government job"],
    correct: "Starting and managing a business"
  },
  {
    id: 2,
    question: "A startup is:",
    options: ["A new business with innovation", "An old shop", "A government office"],
    correct: "A new business with innovation"
  },
  {
    id: 3,
    question: "What is a business plan?",
    options: ["Roadmap for a business", "Bank account", "Resume"],
    correct: "Roadmap for a business"
  },
  {
    id: 4,
    question: "Which is a type of funding?",
    options: ["Venture capital", "House rent", "Water bill"],
    correct: "Venture capital"
  },
  {
    id: 5,
    question: "An elevator pitch is:",
    options: ["Short business intro", "Lift design", "Technical report"],
    correct: "Short business intro"
  },
  {
    id: 6,
    question: "What is bootstrapping?",
    options: ["Self-funding a startup", "Hiring many employees", "Buying assets"],
    correct: "Self-funding a startup"
  },
  {
    id: 7,
    question: "A profit is:",
    options: ["Revenue - expenses", "Only revenue", "Only expenses"],
    correct: "Revenue - expenses"
  },
  {
    id: 8,
    question: "What is market research?",
    options: ["Understanding customer needs", "Buying stocks", "Hiring interns"],
    correct: "Understanding customer needs"
  },
  {
    id: 9,
    question: "Which is a popular startup methodology?",
    options: ["Lean Startup", "Waterfall dance", "Vertical scaling"],
    correct: "Lean Startup"
  },
  {
    id: 10,
    question: "A founder is someone who:",
    options: ["Starts the company", "Files taxes", "Builds roads"],
    correct: "Starts the company"
  },
  {
    id: 11,
    question: "What does ROI stand for?",
    options: ["Return on Investment", "Rate of Internet", "Run on Innovation"],
    correct: "Return on Investment"
  },
  {
    id: 12,
    question: "What is a target audience?",
    options: ["Intended customer group", "Random people", "Investors only"],
    correct: "Intended customer group"
  },
  {
    id: 13,
    question: "What does USP mean?",
    options: ["Unique Selling Proposition", "Universal Sales Plan", "Unit Stock Price"],
    correct: "Unique Selling Proposition"
  },
  {
    id: 14,
    question: "A pitch deck is:",
    options: ["Presentation to investors", "Game board", "Ad campaign"],
    correct: "Presentation to investors"
  },
  {
    id: 15,
    question: "Revenue means:",
    options: ["Total income", "Total expenses", "Profit"],
    correct: "Total income"
  },
  {
    id: 16,
    question: "What is innovation?",
    options: ["Creating something new", "Copying ideas", "Deleting files"],
    correct: "Creating something new"
  },
  {
    id: 17,
    question: "Angel investors are:",
    options: ["Individuals who invest early", "Bank clerks", "Loan officers"],
    correct: "Individuals who invest early"
  },
  {
    id: 18,
    question: "A prototype is:",
    options: ["Basic model of product", "Final website", "Marketing poster"],
    correct: "Basic model of product"
  },
  {
    id: 19,
    question: "What is cash flow?",
    options: ["Money moving in and out", "Credit card design", "Loan interest"],
    correct: "Money moving in and out"
  },
  {
    id: 20,
    question: "A business that solves a real problem has:",
    options: ["Product-market fit", "More ads", "More employees"],
    correct: "Product-market fit"
  },
  {
    id: 21,
    question: "What does CEO stand for?",
    options: ["Chief Executive Officer", "Central Energy Officer", "City Expansion Officer"],
    correct: "Chief Executive Officer"
  },
  {
    id: 22,
    question: "Scalability means:",
    options: ["Ability to grow", "Ability to shrink", "Ability to stop"],
    correct: "Ability to grow"
  },
  {
    id: 23,
    question: "A competitor is:",
    options: ["A rival business", "Employee", "Investor"],
    correct: "A rival business"
  },
  {
    id: 24,
    question: "What is a subscription model?",
    options: ["Pay monthly or yearly", "Pay once", "Pay never"],
    correct: "Pay monthly or yearly"
  },
  {
    id: 25,
    question: "Pivoting means:",
    options: ["Changing business strategy", "Hiring managers", "Selling assets"],
    correct: "Changing business strategy"
  },
  {
    id: 26,
    question: "What is equity?",
    options: ["Ownership in a company", "Monthly salary", "Loan interest"],
    correct: "Ownership in a company"
  },
  {
    id: 27,
    question: "Minimum Viable Product is:",
    options: ["Basic working version", "Final version", "Prototype only"],
    correct: "Basic working version"
  },
  {
    id: 28,
    question: "What is branding?",
    options: ["Creating company identity", "Writing code", "Buying ads"],
    correct: "Creating company identity"
  },
  {
    id: 29,
    question: "A customer feedback loop helps in:",
    options: ["Improving product", "Paying taxes", "Hiring employees"],
    correct: "Improving product"
  },
  {
    id: 30,
    question: "Entrepreneurs must have:",
    options: ["Risk-taking ability", "Guaranteed income", "Zero competition"],
    correct: "Risk-taking ability"
  } ]
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
