import { GrammarTest, Question } from "../types";

// Helper to save space
const q = (id: number, text: string, options: string[], correct: number): Question => ({
  id, text, options, correctOptionIndex: correct
});

export const FILL_IN_TESTS: GrammarTest[] = [
  {
    id: 1,
    title: "Boşluk Doldurma Test 1 - Basic Grammar",
    questions: [
      q(1, "Emma missed her flight because she arrived ____ the airport after the gate had closed.", ["on", "at", "in", "into"], 1),
      q(2, "During the storm, the old bridge collapsed ____ the weight of the overloaded truck.", ["above", "over", "under", "onto"], 2),
      q(3, "The scientist insisted that the results ____ verified twice before publication.", ["was", "being", "is", "be"], 3),
      q(4, "The biologist stored the samples ____ ice to prevent any reaction.", ["in", "under", "over", "on"], 3),
      q(5, "By the time the rescue team arrived, the hikers ____ found shelter in a nearby cave.", ["will have", "have", "has", "had"], 3),
      q(6, "If only Daniel ____ more cautious, he wouldn’t have erased the entire database.", ["is", "had been", "were", "was"], 1),
      q(7, "No sooner ____ the auditorium than the power went out, leaving everyone in darkness.", ["they had entered", "they entered", "had they entered", "did they enter"], 2),
      q(8, "Lara prefers presenting with slides ____ speaking without any visual aid.", ["than", "to", "over", "instead"], 1),
      q(9, "The curator displayed the fragile manuscript ____ a glass case to protect it from humidity.", ["beneath", "within", "between", "inside"], 3),
      q(10, "Scarcely ____ to explain the hypothesis when the alarm interrupted the session.", ["began she", "she began", "had she begun", "she had begun"], 2),
    ]
  },
  {
    id: 2,
    title: "Boşluk Doldurma Test 2 - Advanced Structures",
    questions: [
      q(11, "Rarely ____ such a detailed map of the underground tunnels.", ["we see", "we have seen", "do we see", "we saw"], 2),
      q(12, "Because the budget was tight, the team ____ postpone the field study to autumn.", ["had to", "has to", "should", "must"], 0),
      q(13, "She treated the violin as though it ____ a living companion from her childhood.", ["is", "were", "had been", "was"], 1),
      q(14, "Not until the documentary aired ____ the hidden risks of the project.", ["the public understood", "the public had understood", "did the public understand", "was the public understanding"], 2),
      q(15, "During the keynote, the hall ____ completely silent for the live broadcast.", ["stayed", "had stayed", "would stay", "was staying"], 0),
      q(16, "Had they monitored the pressure gauges, the reactor ____ shut down safely.", ["would have", "have", "would", "will have"], 0),
      q(17, "Security required that every visitor ____ their badge before entering the server room.", ["scanning", "scan", "scans", "scanned"], 1),
      q(18, "Jamal acted as if he ____ every shortcut in the maze despite never visiting before.", ["knew", "knows", "has known", "had known"], 3),
      q(19, "Only after the final calibration ____ the device produce accurate readings.", ["did the device produce", "was the device producing", "the device had produced", "the device produced"], 0),
      q(20, "The pilot requested that the runway lights ____ kept on until the fog cleared.", ["be", "were", "being", "are"], 0),
    ]
  },
  {
    id: 3,
    title: "Boşluk Doldurma Test 3 - Inversions & Mix",
    questions: [
      q(21, "Despite ____ late, she managed to catch the last train.", ["be", "having been", "being", "to be"], 2),
      q(22, "It is essential that everyone ____ on time for the meeting.", ["was", "be", "is", "will be"], 1),
      q(23, "____ had I left the house than it started to rain.", ["As soon as", "Scarcely", "No sooner", "Hardly"], 2),
      q(24, "He speaks French as if he ____ a native speaker.", ["were", "had been", "has been", "is"], 0),
      q(25, "Not only ____ the competition, but he also broke the world record.", ["he did win", "he won", "did he win", "won he"], 2),
      q(26, "_______ by the sudden noise, the bird flew away.", ["Frightened", "Frighten", "To frighten", "Frightening"], 0),
      q(27, "It was the manager _______ approved the budget.", ["which", "whose", "who", "whom"], 2),
      q(28, "I regret _______ you that your application has been rejected.", ["to tell", "tell", "telling", "told"], 0),
      q(29, "You _______ seen him yesterday; he was out of town.", ["shouldn't have", "mustn't have", "can't have", "needn't have"], 2),
      q(30, "The new bridge _______ at the moment.", ["has constructed", "is constructing", "is being constructed", "constructs"], 2),
    ]
  },
  {
    id: 4,
    title: "Boşluk Doldurma Test 4 - Prepositions",
    questions: [
      q(31, "The committee is opposed ____ the proposal.", ["to", "at", "for", "with"], 0),
      q(32, "She is capable ____ solving complex problems.", ["for", "of", "in", "to"], 1),
      q(33, "They congratulated him ____ his promotion.", ["at", "on", "for", "with"], 1),
      q(34, "The book is composed ____ three parts.", ["in", "from", "with", "of"], 3),
      q(35, "He eventually succeeded ____ convincing the board.", ["in", "on", "at", "with"], 0),
      q(36, "Many people are addicted _______ social media.", ["with", "to", "in", "on"], 1),
      q(37, "Who is responsible _______ organizing the event?", ["with", "of", "for", "about"], 2),
      q(38, "Don't blame me _______ your mistakes.", ["at", "for", "on", "from"], 1),
      q(39, "Are you excited _______ the upcoming holiday?", ["in", "for", "with", "about"], 3),
      q(40, "His opinion differs _______ mine significantly.", ["from", "to", "with", "of"], 0),
    ]
  },
  {
    id: 5,
    title: "Boşluk Doldurma Test 5 - Tenses",
    questions: [
      q(41, "By next year, they ____ the project.", ["complete", "are completing", "will have completed", "will complete"], 2),
      q(42, "I ____ for him since morning.", ["wait", "am waiting", "was waiting", "have been waiting"], 3),
      q(43, "She ____ dinner when the phone rang.", ["was cooking", "cooked", "cooks", "has cooked"], 0),
      q(44, "He ____ to Paris three times so far.", ["is", "has been", "will be", "was"], 1),
      q(45, "After he ____ his homework, he went out.", ["has finished", "had finished", "finished", "finishes"], 1),
      q(46, "While I _______ to the radio, I heard the news.", ["listened", "am listening", "have listened", "was listening"], 3),
      q(47, "By the time we arrived, the show _______.", ["would start", "has already started", "already started", "had already started"], 3),
      q(48, "We _______ on this project for three months now.", ["have been working", "work", "were working", "are working"], 0),
      q(49, "I _______ never _______ such a beautiful sunset before.", ["have / seen", "had / seen", "was / seeing", "did / see"], 0),
      q(50, "This time next week, I _______ in Hawaii.", ["will swim", "will be swimming", "am swimming", "swim"], 1),
    ]
  },
  {
    id: 6,
    title: "Boşluk Doldurma Test 6 - Conjunctions",
    questions: [
      q(51, "____ it was raining, we went for a walk.", ["Although", "However", "In spite of", "Despite"], 0),
      q(52, "He studied hard; ____, he failed the exam.", ["however", "although", "therefore", "because"], 0),
      q(53, "She stayed home ____ she was ill.", ["because", "therefore", "although", "so"], 0),
      q(54, "____ the traffic, we arrived on time.", ["However", "Although", "Despite", "Even though"], 2),
      q(55, "I will call you ____ I arrive.", ["as soon as", "during", "while", "until"], 0),
      q(56, "_______ he is wealthy, he lives a simple life.", ["However", "Even though", "Despite", "Nevertheless"], 1),
      q(57, "Take your coat _______ it gets cold later.", ["if", "in case", "unless", "so that"], 1),
      q(58, "I like coffee, _______ my brother prefers tea.", ["since", "despite", "whereas", "so"], 2),
      q(59, "You cannot pass the exam _______ you study regularly.", ["unless", "so", "if", "when"], 0),
      q(60, "We cancelled the picnic _______ the heavy rain.", ["as", "due to", "since", "because"], 1),
    ]
  },
  {
    id: 7,
    title: "Boşluk Doldurma Test 7 - Vocabulary",
    questions: [
      q(61, "The company's primary ____ is customer satisfaction.", ["subject", "objective", "rejection", "objection"], 1),
      q(62, "His explanation was so ____ that everyone understood.", ["vague", "obscure", "clear", "ambiguous"], 2),
      q(63, "They made a ____ decision to sell the house.", ["junction", "joint", "joining", "joined"], 1),
      q(64, "The evidence was ____ to prove his innocence.", ["efficient", "sufficient", "deficient", "proficient"], 1),
      q(65, "She ____ the job offer because the salary was too low.", ["rejected", "accepted", "ejected", "injected"], 0),
      q(66, "The scientists announced a major _______ in cancer treatment.", ["breakup", "breakdown", "breakthrough", "breakout"], 2),
      q(67, "The government adopted a new _______ to reduce unemployment.", ["police", "policy", "polite", "politics"], 1),
      q(68, "She showed a remarkable _______ for music at a young age.", ["attitude", "gratitude", "aptitude", "altitude"], 2),
      q(69, "The environmental _______ of the factory was devastating.", ["contact", "impact", "compact", "contract"], 1),
      q(70, "He worked hard and finally _______ his goal.", ["believed", "received", "relieved", "achieved"], 3),
    ]
  },
  {
    id: 8,
    title: "Boşluk Doldurma Test 8 - Conditionals",
    questions: [
      q(71, "If I ____ more time, I would have visited you.", ["had", "would have", "have", "had had"], 3),
      q(72, "Unless he ____ soon, we will leave without him.", ["came", "comes", "will come", "has come"], 1),
      q(73, "If it ____ tomorrow, we will cancel the match.", ["snows", "snow", "will snow", "snowed"], 0),
      q(74, "I wish I ____ speak Japanese.", ["can", "would", "will", "could"], 3),
      q(75, "If only I ____ the truth earlier.", ["know", "would know", "knew", "had known"], 3),
      q(76, "Would you mind if I _______ the window?", ["had opened", "opening", "open", "opened"], 3),
      q(77, "If he _______ harder, he would pass the exam.", ["had studied", "would study", "studied", "studies"], 2),
      q(78, "Suppose you _______ the lottery, what would you do?", ["would win", "had won", "won", "win"], 2),
      q(79, "Providing that you _______ the rules, you can stay.", ["followed", "had followed", "will follow", "follow"], 3),
      q(80, "But for his help, we _______ in time.", ["wouldn't have finished", "wouldn't finish", "hadn't finished", "didn't finish"], 0),
    ]
  },
  {
    id: 9,
    title: "Boşluk Doldurma Test 9 - Passive Voice",
    questions: [
      q(81, "The document ____ by the manager yesterday.", ["was signing", "has been signed", "signed", "was signed"], 3),
      q(82, "A new hospital ____ in our town next year.", ["will be built", "was built", "builds", "is built"], 0),
      q(83, "English ____ all over the world.", ["is spoken", "is speaking", "has spoken", "speaks"], 0),
      q(84, "The cake ____ by the time we arrived.", ["ate", "had been eaten", "has been eaten", "was eating"], 1),
      q(85, "The rules ____ followed strictly.", ["must have", "must be", "must", "must being"], 1),
      q(86, "Rice _______ in many Asian countries.", ["is grown", "is growing", "grows", "grown"], 0),
      q(87, "My car _______ at the moment.", ["has repaired", "repairs", "is repairing", "is being repaired"], 3),
      q(88, "Many ancient cities _______ by archaeologists.", ["have discovered", "were discovering", "have been discovered", "discovered"], 2),
      q(89, "The decision _______ until tomorrow.", ["isn't making", "hasn't been made", "won't make", "won't be made"], 3),
      q(90, "It _______ that the economy will improve.", ["thinks", "is thinking", "is thought", "thought"], 2),
    ]
  },
  {
    id: 10,
    title: "Boşluk Doldurma Test 10 - Gerunds & Infinitives",
    questions: [
      q(91, "He avoided ____ to the party.", ["go", "going", "gone", "to go"], 1),
      q(92, "I hope ____ from you soon.", ["hear", "hearing", "to hearing", "to hear"], 3),
      q(93, "They decided ____ the meeting.", ["to postpone", "postponed", "postpone", "postponing"], 0),
      q(94, "She is looking forward ____ you.", ["seeing", "to see", "to seeing", "see"], 2),
      q(95, "We finished ____ the report.", ["to write", "written", "write", "writing"], 3),
      q(96, "I offered _______ them with the project.", ["to help", "help", "helping", "helped"], 0),
      q(97, "He suggested _______ for a walk.", ["to go", "gone", "going", "go"], 2),
      q(98, "They aren't used to _______ in a big city.", ["living", "lived", "to live", "live"], 0),
      q(99, "I promise _______ anyone your secret.", ["didn't tell", "not tell", "not telling", "not to tell"], 3),
      q(100, "It's no use _______ about the past.", ["cry", "cried", "crying", "to cry"], 2),
    ]
  },
  {
    id: 11,
    title: "Boşluk Doldurma Test 11 - Relative Clauses",
    questions: [
      q(101, "The woman ____ lives next door is a doctor.", ["which", "who", "whom", "whose"], 1),
      q(102, "This is the book ____ I told you about.", ["who", "whose", "whom", "that"], 3),
      q(103, "The city ____ I was born is very beautiful.", ["where", "which", "that", "in that"], 0),
      q(104, "The boy ____ father is a pilot is my friend.", ["whose", "whom", "which", "who"], 0),
      q(105, "I remember the day ____ we first met.", ["which", "when", "where", "that"], 1),
      q(106, "The house _______ they live is very old.", ["who", "where", "which", "whom"], 1),
      q(107, "The reason _______ he was late is still unknown.", ["why", "where", "how", "which"], 0),
      q(108, "Is this the man _______ you were looking for?", ["whose", "whom", "which", "who"], 1),
      q(109, "The car _______ broke down was brand new.", ["which", "whose", "whom", "who"], 0),
      q(110, "He is the person _______ I trust the most.", ["whom", "what", "whose", "which"], 0),
    ]
  },
  {
    id: 12,
    title: "Boşluk Doldurma Test 12 - Modals of Deduction",
    questions: [
      q(111, "He ____ be at home; his car is in the garage.", ["can", "might", "should", "must"], 3),
      q(112, "She ____ have forgotten the meeting; she's always punctual.", ["mustn't", "shouldn't", "needn't", "can't"], 3),
      q(113, "They ____ have arrived by now; the flight was on time.", ["must", "can", "might", "should"], 3),
      q(114, "I'm not sure, but he ____ be the new manager.", ["must", "can", "could", "should"], 2),
      q(115, "You ____ have seen him; he was away on holiday.", ["mustn't", "can't", "needn't", "shouldn't"], 1),
      q(116, "Listen! It _______ be raining outside.", ["can", "may", "might", "must"], 3),
      q(117, "She _______ have taken the wrong bus.", ["might", "must", "can", "should"], 0),
      q(118, "That _______ be true; it's completely impossible.", ["can't", "shouldn't", "needn't", "mustn't"], 0),
      q(119, "They _______ be very tired after the long journey.", ["should", "must", "can", "might"], 1),
      q(120, "Who _______ have left the door open?", ["should", "must", "could", "may"], 2),
    ]
  },
  {
    id: 13,
    title: "Boşluk Doldurma Test 13 - Reported Speech",
    questions: [
      q(121, "He said that he ____ the film before.", ["saw", "has seen", "had seen", "was seeing"], 2),
      q(122, "She asked me where I ____.", ["was going", "have gone", "go", "am going"], 0),
      q(123, "They told us that they ____ late.", ["will be", "would be", "have been", "are"], 1),
      q(124, "I asked him if he ____ me a favor.", ["can do", "could do", "will do", "does"], 1),
      q(125, "She said that she ____ to Paris twice.", ["was", "had been", "has been", "is"], 1),
      q(126, "The teacher told the students _______ talking.", ["stopping", "to stop", "stop", "stopped"], 1),
      q(127, "He asked me _______ I liked the food.", ["which", "what", "that", "if"], 3),
      q(128, "They said they _______ home the following day.", ["had gone", "go", "will go", "would go"], 3),
      q(129, "She told him _______ late again.", ["not being", "not to be", "didn't be", "not be"], 1),
      q(130, "I wondered _______ time it was.", ["if", "whether", "what", "that"], 2),
    ]
  },
  {
    id: 14,
    title: "Boşluk Doldurma Test 14 - Comparisons",
    questions: [
      q(131, "This is ____ book I have ever read.", ["better", "the best", "good", "best"], 1),
      q(132, "He is ____ than his brother.", ["taller", "tall", "the tallest", "tallest"], 0),
      q(133, "She speaks English ____ than me.", ["better", "well", "the best", "good"], 0),
      q(134, "The ____ I study, the more I learn.", ["hard", "more hard", "harder", "hardest"], 2),
      q(135, "This exercise is as ____ as the previous one.", ["easiest", "easy", "easier", "more easy"], 1),
      q(136, "It was _______ day of the year.", ["most hot", "hotter", "hot", "the hottest"], 3),
      q(137, "She is much _______ now than before.", ["the happiest", "more happy", "happy", "happier"], 3),
      q(138, "This is the _______ expensive car in the world.", ["more", "very", "most", "the most"], 2),
      q(139, "He doesn't work _______ as he used to.", ["as hard", "hard", "hardly", "so hardest"], 0),
      q(140, "The film was _______ more interesting than the book.", ["more", "too", "very", "far"], 3),
    ]
  },
  {
    id: 15,
    title: "Boşluk Doldurma Test 15 - Articles & Quantifiers",
    questions: [
      q(141, "I have ____ friends in London.", ["little", "a little", "a few", "few"], 2),
      q(142, "____ people attended the concert.", ["A little", "Any", "Many", "Much"], 2),
      q(143, "There isn't ____ milk left in the fridge.", ["some", "few", "many", "any"], 3),
      q(144, "Could you give me ____ water, please?", ["some", "a few", "any", "much"], 0),
      q(145, "He has ____ money to buy a new car.", ["any", "many", "enough", "few"], 2),
      q(146, "I spent _______ of my time reading.", ["most", "every", "many", "each"], 0),
      q(147, "_______ student in the class has a computer.", ["All", "Some", "Many", "Every"], 3),
      q(148, "Would you like _______ more cake?", ["some", "any", "few", "little"], 0),
      q(149, "There were _______ people at the stadium.", ["any", "hardly any", "much", "little"], 1),
      q(150, "_______ of the two plans is acceptable.", ["Either", "Both", "Neither", "Each"], 0),
    ]
  },
  {
    id: 16,
    title: "Boşluk Doldurma Test 16 - Adjectives & Adverbs",
    questions: [
      q(151, "The news was ____ surprising.", ["hard", "high", "hardly", "highly"], 3),
      q(152, "She sings ____.", ["beauty", "beautifully", "beautiful", "more beautiful"], 1),
      q(153, "He works ____.", ["hard", "harder", "hardest", "hardly"], 0),
      q(154, "I ____ ever see him these days.", ["highly", "nearly", "hardly", "hard"], 2),
      q(155, "The food tastes ____.", ["better", "good", "best", "well"], 1),
      q(156, "He ran _______ to catch the bus.", ["fastly", "fast", "the fastest", "faster"], 1),
      q(157, "She spoke _______ about her experiences.", ["enthusiastic", "enthusiastically", "more enthusiastic", "enthusiasm"], 1),
      q(158, "It was a _______ difficult task.", ["relatively", "relativity", "more relative", "relative"], 0),
      q(159, "The situation changed _______.", ["dramatic", "dramatically", "more dramatic", "drama"], 1),
      q(160, "He is _______ talented in music.", ["extreme", "most extreme", "extremity", "extremely"], 3),
    ]
  },
  {
    id: 17,
    title: "Boşluk Doldurma Test 17 - Causal Conjunctions",
    questions: [
      q(161, "The match was postponed ____ the weather.", ["because", "due to", "since", "as"], 1),
      q(162, "____ he was tired, he went to bed early.", ["Therefore", "So", "Because", "Consequently"], 2),
      q(163, "She was ill; ____, she couldn't come.", ["therefore", "as", "because", "since"], 0),
      q(164, "I'll take an umbrella ____ it rains.", ["unless", "if", "so that", "in case"], 3),
      q(165, "He studied hard ____ he could pass.", ["because", "unless", "so that", "due to"], 2),
      q(166, "_______ the heavy traffic, we arrived late.", ["Because", "Since", "As", "Owing to"], 3),
      q(167, "He didn't sleep well _______ the noise.", ["as", "since", "due to", "because"], 2),
      q(168, "I'm save money _______ I can buy a car.", ["if", "unless", "so that", "in case"], 2),
      q(169, "She was exhausted _______ she had worked all day.", ["therefore", "consequently", "since", "so"], 2),
      q(170, "_______ you are here, let's start.", ["Because", "Since", "As", "Due to"], 1),
    ]
  },
  {
    id: 18,
    title: "Boşluk Doldurma Test 18 - Contrast Conjunctions",
    questions: [
      q(171, "____ the rain, they went out.", ["Although", "Nevertheless", "Despite", "However"], 2),
      q(172, "He is rich; ____, he is not happy.", ["although", "despite", "however", "whereas"], 2),
      q(173, "____ he is young, he is very wise.", ["Despite", "However", "Although", "Nevertheless"], 2),
      q(174, "She likes tea, ____ I prefer coffee.", ["nevertheless", "despite", "whereas", "although"], 2),
      q(175, "He failed ____ his efforts.", ["in spite of", "even though", "although", "though"], 0),
      q(176, "_______ being tired, he finished the work.", ["Although", "In spite of", "However", "Even though"], 1),
      q(177, "He worked hard; _______, he failed.", ["while", "although", "whereas", "nevertheless"], 3),
      q(178, "_______ the fact that he was late, he was admitted.", ["However", "In spite of", "Although", "Despite"], 3),
      q(179, "I like winter, _______ my sister likes summer.", ["despite", "while", "even though", "though"], 1),
      q(180, "_______ he has a car, he often walks to work.", ["Even though", "Despite", "Nevertheless", "However"], 0),
    ]
  },
  {
    id: 19,
    title: "Boşluk Doldurma Test 19 - Phrasal Verbs 1",
    questions: [
      q(181, "The meeting was ____ due to the strike.", ["called up", "called off", "called for", "called in"], 1),
      q(182, "He ____ a brilliant idea.", ["came up with", "came down with", "came into", "came across"], 0),
      q(183, "She ____ her mother.", ["takes up", "takes off", "takes on", "takes after"], 3),
      q(184, "The plane ____ on time.", ["took over", "took in", "took off", "took up"], 2),
      q(185, "We ____ sugar.", ["ran through", "ran over", "ran into", "ran out of"], 3),
      q(186, "You should _______ smoking.", ["give in", "give away", "give off", "give up"], 3),
      q(187, "He _______ the offer.", ["turned up", "turned down", "turned off", "turned into"], 1),
      q(188, "I _______ an old friend yesterday.", ["ran away", "ran into", "ran up", "ran out of"], 1),
      q(189, "Please _______ the lights.", ["turn down", "turn into", "turn back", "turn off"], 3),
      q(190, "She _______ her shoes before entering.", ["took back", "took up", "took in", "took off"], 3),
    ]
  },
  {
    id: 20,
    title: "Boşluk Doldurma Test 20 - Phrasal Verbs 2",
    questions: [
      q(191, "He ____ the car and drove away.", ["got in", "got out", "got off", "got on"], 0),
      q(192, "Please ____ the form.", ["fill up", "fill in", "fill into", "fill out"], 1),
      q(193, "The fire ____ during the night.", ["broke in", "broke out", "broke up", "broke down"], 1),
      q(194, "She ____ her grandmother.", ["looked for", "looked up", "looked into", "looked after"], 3),
      q(195, "We ____ with our neighbors.", ["get in", "get on", "get over", "get by"], 1),
      q(196, "He _______ the truth eventually.", ["found up", "found in", "found off", "found out"], 3),
      q(197, "The car _______ on the highway.", ["broke down", "broke up", "broke out", "broke in"], 0),
      q(198, "I need to _______ this word in the dictionary.", ["look into", "look after", "look for", "look up"], 3),
      q(199, "She _______ her brother.", ["takes in", "takes up", "takes after", "takes off"], 2),
      q(200, "They _______ their trip until next week.", ["put up", "put off", "put out", "put on"], 1),
    ]
  },
  {
    id: 21,
    title: "Boşluk Doldurma Test 21 - Academic Vocabulary 1",
    questions: [
      q(201, "The results of the study ____ the hypothesis.", ["contradict", "confirm", "confront", "confuse"], 1),
      q(202, "Climate change is a ____ issue.", ["trivial", "minor", "local", "global"], 3),
      q(203, "We need to ____ the energy consumption.", ["reduce", "expand", "increase", "enhance"], 0),
      q(204, "The new law will be ____ next month.", ["implemented", "inherited", "indicated", "infected"], 0),
      q(205, "Education is ____ for personal development.", ["irrelevant", "crucial", "optional", "negligible"], 1),
      q(206, "The data _______ a clear trend.", ["indicates", "inspects", "isolates", "imitates"], 0),
      q(207, "His contribution to the field was _______.", ["common", "insignificant", "significant", "usual"], 2),
      q(208, "The research _______ a wide range of topics.", ["recovers", "uncovers", "discovers", "covers"], 3),
      q(209, "We must _______ the potential risks.", ["eliminate", "evacuate", "elevate", "evaluate"], 3),
      q(210, "The theory _______ the phenomenon.", ["explores", "expects", "expands", "explains"], 3),
    ]
  },
  {
    id: 22,
    title: "Boşluk Doldurma Test 22 - Academic Vocabulary 2",
    questions: [
      q(211, "The company tries to ____ its profits.", ["neutralize", "minimize", "stabilize", "maximize"], 3),
      q(212, "Technology has ____ the way we communicate.", ["translated", "transformed", "transported", "transferred"], 1),
      q(213, "Success ____ on hard work and dedication.", ["defends", "depends", "demands", "decides"], 1),
      q(214, "The professor gave an ____ lecture.", ["indifferent", "invisible", "incapable", "insightful"], 3),
      q(215, "The committee reached a ____.", ["consequence", "conflict", "contrast", "consensus"], 3),
      q(216, "The project requires _______ planning.", ["meticulous", "careless", "hasty", "random"], 0),
      q(217, "His behavior was _______ for the situation.", ["appropriate", "arbitrary", "approximate", "apparent"], 0),
      q(218, "The results are _______ to all cases.", ["applicable", "adaptable", "avoidable", "affordable"], 0),
      q(219, "We must _______ the high standards.", ["contain", "attain", "obtain", "maintain"], 3),
      q(220, "The experiment _______ the old theory.", ["refines", "refers", "reflects", "refutes"], 3),
    ]
  },
  {
    id: 23,
    title: "Boşluk Doldurma Test 23 - Noun Phrases",
    questions: [
      q(221, "There is a growing ____ about environmental pollution.", ["comfort", "conflict", "concern", "consent"], 2),
      q(222, "The government's ____ led to a crisis.", ["neutrality", "necessity", "negligence", "nutrition"], 2),
      q(223, "His ____ to help was appreciated.", ["resistance", "readiness", "reluctance", "relevance"], 1),
      q(224, "The ____ of the project is to reduce costs.", ["objective", "observation", "objection", "obstruction"], 0),
      q(225, "There is no ____ for his absence.", ["junction", "justice", "judgement", "justification"], 3),
      q(226, "The _______ between the two variables is strong.", ["correction", "correlation", "connection", "collection"], 1),
      q(227, "His _______ for the crime were suspicious.", ["notions", "motives", "motions", "options"], 1),
      q(228, "The _______ of the earthquake was devastating.", ["aspect", "prospect", "impact", "respect"], 2),
      q(229, "She made a quick _______ from the illness.", ["delivery", "recovery", "discovery", "slavery"], 1),
      q(230, "The _______ for the new job were strict.", ["appointments", "requirements", "achievements", "adjustments"], 1),
    ]
  },
  {
    id: 24,
    title: "Boşluk Doldurma Test 24 - Adjective + Prep",
    questions: [
      q(231, "She is very good ____ math.", ["in", "on", "at", "for"], 2),
      q(232, "He is afraid ____ spiders.", ["about", "at", "from", "of"], 3),
      q(233, "Are you interested ____ history?", ["to", "at", "in", "on"], 2),
      q(234, "He is responsible ____ the sales team.", ["to", "with", "for", "about"], 2),
      q(235, "She is famous ____ her paintings.", ["at", "for", "about", "with"], 1),
      q(236, "They are proud _______ their daughter.", ["with", "from", "at", "of"], 3),
      q(237, "He is addicted _______ video games.", ["with", "on", "to", "for"], 2),
      q(238, "I am aware _______ the situation.", ["about", "to", "from", "of"], 3),
      q(239, "She is capable _______ doing the job alone.", ["to", "in", "of", "for"], 2),
      q(240, "He is worried _______ his future.", ["for", "on", "about", "with"], 2),
    ]
  },
  {
    id: 25,
    title: "Boşluk Doldurma Test 25 - Verb + Prep",
    questions: [
      q(241, "He apologized ____ arriving late.", ["for", "from", "with", "to"], 0),
      q(242, "She believes ____ ghosts.", ["to", "at", "in", "on"], 2),
      q(243, "They are waiting ____ the bus.", ["at", "for", "to", "on"], 1),
      q(244, "He insisted ____ paying the bill.", ["in", "at", "on", "to"], 2),
      q(245, "She complained ____ the service.", ["about", "from", "to", "of"], 0),
      q(246, "He belongs _______ this club.", ["at", "in", "to", "on"], 2),
      q(247, "I rely _______ my best friend.", ["on", "at", "in", "to"], 0),
      q(248, "She takes care _______ her younger brother.", ["of", "with", "to", "for"], 0),
      q(249, "They succeeded _______ winning the game.", ["at", "on", "to", "in"], 3),
      q(250, "He applied _______ the new position.", ["on", "for", "to", "at"], 1),
    ]
  },
  {
    id: 26,
    title: "Boşluk Doldurma Test 26 - Purpose & Result",
    questions: [
      q(251, "He worked hard ____ he could buy a house.", ["because", "due to", "unless", "so that"], 3),
      q(252, "She went to the store ____ buy some milk.", ["because", "for", "so that", "to"], 3),
      q(253, "The match was cancelled ____ the rain.", ["since", "because", "due to", "as"], 2),
      q(254, "He was so tired ____ he fell asleep immediately.", ["so", "that", "than", "as"], 1),
      q(255, "She left early ____ avoid the traffic.", ["to", "in order to", "for", "so that"], 1),
      q(256, "I'm save money _______ I can travel.", ["due to", "since", "so that", "because"], 2),
      q(257, "The food was _______ cold that I couldn't eat it.", ["very", "too", "much", "so"], 3),
      q(258, "It was _______ a beautiful day that we went out.", ["too", "such", "so", "very"], 1),
      q(259, "They hurried _______ not to be late.", ["so as", "to", "in order", "for"], 0),
      q(260, "He failed the exam _______ his lack of study.", ["due to", "owing to", "because of", "since"], 2),
    ]
  },
  {
    id: 27,
    title: "Boşluk Doldurma Test 27 - Inversions",
    questions: [
      q(261, "Never ____ I seen such a beautiful view.", ["did", "had", "have", "was"], 2),
      q(262, "Seldom ____ he go to the cinema.", ["does", "is", "goes", "has"], 0),
      q(263, "Hardly ____ he arrived when it started to rain.", ["has", "did", "was", "had"], 3),
      q(264, "Not only ____ she smart, but she is also kind.", ["does", "was", "has", "is"], 3),
      q(265, "Under no circumstances ____ you leave the room.", ["should", "will", "must", "did"], 0),
      q(266, "Rarely _______ we witness such a talent.", ["are", "have", "do", "did"], 2),
      q(267, "Only then _______ I realize my mistake.", ["had", "was", "am", "did"], 3),
      q(268, "No sooner _______ the game begun than it rained.", ["did", "has", "had", "was"], 2),
      q(269, "Little _______ she know about the project.", ["did", "was", "does", "had"], 0),
      q(270, "At no time _______ I suspect him.", ["did", "had", "would", "was"], 0),
    ]
  },
  {
    id: 28,
    title: "Boşluk Doldurma Test 28 - Subjunctives",
    questions: [
      q(271, "I suggest that he ____ a doctor.", ["sees", "saw", "see", "seeing"], 2),
      q(272, "It is important that everyone ____ quiet.", ["be", "is", "was", "are"], 0),
      q(273, "I wish he ____ here now.", ["is", "was", "be", "were"], 3),
      q(274, "She treated me as if I ____ a child.", ["was", "am", "be", "were"], 3),
      q(275, "It is essential that she ____ the truth.", ["know", "knew", "knows", "knowing"], 0),
      q(276, "I recommend that you _______ more.", ["studying", "studied", "studies", "study"], 3),
      q(277, "He acted as though he _______ the boss.", ["was", "be", "is", "were"], 3),
      q(278, "If I _______ you, I wouldn't do that.", ["was", "were", "be", "am"], 1),
      q(279, "I'd rather you _______ me later.", ["calls", "calling", "called", "call"], 2),
      q(280, "It's time you _______ home.", ["went", "going", "go", "goes"], 0),
    ]
  },
  {
    id: 29,
    title: "Boşluk Doldurma Test 29 - Phrasal Verbs 3",
    questions: [
      q(281, "I can't ____ with his constant shouting.", ["put on", "put away", "put up", "put off"], 2),
      q(282, "The car ____ of petrol on the way home.", ["ran out", "ran into", "ran over", "ran away"], 0),
      q(283, "She ____ her father whom she hadn't seen for years.", ["looked into", "looked after", "looked for", "looked like"], 3),
      q(284, "The match was ____ due to heavy rain.", ["called for", "called up", "called out", "called off"], 3),
      q(285, "He ____ a story to explain his absence.", ["made up", "made for", "made off", "made out"], 0),
      q(286, "You should _______ this opportunity.", ["take in", "take of", "take on", "take up"], 3),
      q(287, "He _______ an old friend in the city center.", ["ran out", "ran through", "ran into", "ran over"], 2),
      q(288, "I need to _______ this word in the manual.", ["look for", "look into", "look after", "look up"], 3),
      q(289, "The plane _______ an hour late.", ["took in", "took off", "took over", "took up"], 1),
      q(290, "She _______ her mother in many ways.", ["takes off", "takes in", "takes after", "takes up"], 2),
    ]
  },
  {
    id: 30,
    title: "Boşluk Doldurma Test 30 - Complex Connectors",
    questions: [
      q(291, "____ he was exhausted, he continued working.", ["Despite", "However", "Even though", "Therefore"], 2),
      q(292, "I'll go to the party ____ you come with me.", ["on condition that", "unless", "except", "but"], 0),
      q(293, "____ of his wealth, he is very modest.", ["Regardless", "In spite", "Although", "Despite"], 0),
      q(294, "He studied hard; ____, he failed the test.", ["nevertheless", "furthermore", "otherwise", "consequently"], 0),
      q(295, "We cancelled the trip ____ the bad weather.", ["since", "as", "due to", "because"], 2),
      q(296, "I'll take an umbrella _______ it rains.", ["in case", "so that", "unless", "if"], 0),
      q(297, "He is wealthy, _______ his brother is poor.", ["so", "despite", "whereas", "since"], 2),
      q(298, "You cannot enter _______ you have a ticket.", ["while", "if", "unless", "when"], 2),
      q(299, "She went to bed early _______ she was tired.", ["consequently", "since", "although", "so"], 1),
      q(300, "_______ you are here, let's start.", ["Because", "Due to", "Since", "As"], 2),
    ]
  },
  {
    id: 31,
    title: "Boşluk Doldurma Test 31 - Advanced Mixed 1",
    questions: [
      q(301, "The company's ____ performance led to a bonus.", ["excessive", "exceptional", "external", "explicit"], 1),
      q(302, "He has the ____ to become a great leader.", ["process", "position", "poverty", "potential"], 3),
      q(303, "The report ____ the need for further research.", ["humbles", "heightens", "highlights", "hinders"], 2),
      q(304, "Water is ____ for all living beings.", ["evident", "eventual", "essential", "estimated"], 2),
      q(305, "The new law will ____ certain restrictions.", ["impede", "implies", "improve", "impose"], 3),
      q(306, "The data _______ the initial findings.", ["various", "validated", "vacated", "variable"], 1),
      q(307, "His speech was _______ and convincing.", ["eloquent", "elegant", "efficient", "elaborate"], 0),
      q(308, "The project _______ a wide range of tasks.", ["encompasses", "endures", "encounters", "encourages"], 0),
      q(309, "We must _______ the high quality.", ["assure", "assure", "insure", "ensure"], 3),
      q(310, "The theory _______ the old concepts.", ["supersedes", "surrounds", "survives", "surpasses"], 0),
    ]
  },
  {
    id: 32,
    title: "Boşluk Doldurma Test 32 - Advanced Mixed 2",
    questions: [
      q(311, "The city has undergone a ____ transformation.", ["radial", "radiant", "radio", "radical"], 3),
      q(312, "He made a ____ contribution to the project.", ["valuable", "vague", "variable", "vacant"], 0),
      q(313, "The results are ____ to change.", ["subtle", "subject", "subway", "subset"], 1),
      q(314, "The manager ____ the project to a subordinate.", ["declared", "delegated", "dedicated", "decided"], 1),
      q(315, "The new policy will ____ the economy.", ["stimulate", "stipulate", "simulate", "stumble"], 0),
      q(316, "The research _______ a new perspective.", ["yoked", "yielded", "yelled", "yield"], 1),
      q(317, "His behavior was _______ and unexpected.", ["erect", "erase", "erratic", "error"], 2),
      q(318, "The company _______ a new branch.", ["eliminated", "estimated", "established", "explained"], 2),
      q(319, "We must _______ the resources.", ["allocate", "allow", "ally", "alleviate"], 0),
      q(320, "The experiment _______ the hypothesis.", ["complete", "composed", "combined", "corroborated"], 3),
    ]
  },
  {
    id: 33,
    title: "Boşluk Doldurma Test 33 - YDS Mock Grammar 1",
    questions: [
      q(321, "Rarely ____ such a complex problem solved so quickly.", ["was", "has", "does", "is"], 3),
      q(322, "No sooner ____ the meeting started than the fire alarm went off.", ["has", "had", "was", "did"], 1),
      q(323, "Scarcely ____ he arrived when his phone rang.", ["has", "had", "was", "did"], 1),
      q(324, "Not only ____ they win, but they also set a record.", ["would", "did", "do", "had"], 1),
      q(325, "Seldom ____ she ever call me these days.", ["is", "has", "would", "does"], 3),
      q(326, "Hardly _______ I finished when the time was up.", ["was", "did", "had", "has"], 2),
      q(327, "Little _______ they know about the surprise.", ["does", "had", "was", "did"], 3),
      q(328, "Under no circumstances _______ you open the door.", ["must", "will", "did", "should"], 3),
      q(329, "Only when I arrived _______ I realize the truth.", ["had", "am", "did", "was"], 2),
      q(330, "Never _______ I seen such a beautiful sight.", ["did", "have", "was", "had"], 1),
    ]
  },
  {
    id: 34,
    title: "Boşluk Doldurma Test 34 - YDS Mock Vocabulary 1",
    questions: [
      q(331, "The report provides a ____ analysis of the situation.", ["compulsive", "competitive", "comprehensive", "comparative"], 2),
      q(332, "His contribution was ____ to the project's success.", ["vague", "vocal", "vital", "vivid"], 2),
      q(333, "The results were ____ with previous studies.", ["constant", "content", "conscious", "consistent"], 3),
      q(334, "They are trying to ____ a peaceful solution.", ["attain", "appreciate", "achieve", "attribute"], 2),
      q(335, "The factory's output has ____ significantly.", ["inherited", "indicated", "increased", "infected"], 2),
      q(336, "The disease _______ rapidly among the population.", ["spread", "stabilized", "standardized", "speculated"], 0),
      q(337, "He gave a _______ account of his experiences.", ["departed", "detailed", "detached", "defeated"], 1),
      q(338, "The company _______ a new marketing strategy.", ["adorned", "adopted", "adapted", "adventured"], 1),
      q(339, "We must _______ the potential consequences.", ["consider", "contain", "consume", "confuse"], 0),
      q(340, "The theory _______ the historical context.", ["overcomes", "overlooks", "overtakes", "overturns"], 1),
    ]
  },
  {
    id: 35,
    title: "Boşluk Doldurma Test 35 - YDS Mock Mixed 1",
    questions: [
      q(341, "The research ____ a wide range of scientific fields.", ["spans", "spins", "speeds", "spots"], 0),
      q(342, "He has an ____ ability to solve puzzles.", ["external", "exotic", "explicit", "extraordinary"], 3),
      q(343, "The results are ____ to change.", ["preach", "prone", "prime", "price"], 1),
      q(344, "Technology has ____ the way we work.", ["reversed", "revised", "revolutionized", "revealed"], 2),
      q(345, "Success is ____ on various factors.", ["contact", "content", "contingent", "contain"], 2),
      q(346, "The data _______ a significant improvement.", ["shapes", "shadows", "shocks", "showcases"], 3),
      q(347, "His behavior was _______ and erratic.", ["unanimous", "unauthorized", "unambiguous", "unpredictable"], 3),
      q(348, "The project _______ a high level of expertise.", ["defends", "details", "demands", "decides"], 2),
      q(349, "We must _______ the current standards.", ["uphold", "uplift", "update", "uproot"], 0),
      q(350, "The theory _______ the importance of ethics.", ["emphasizes", "employs", "empties", "emerges"], 0),
    ]
  },
  {
    id: 36,
    title: "Boşluk Doldurma Test 36 - Final Review 1",
    questions: [
      q(351, "____ the fact that it was late, we finished.", ["However", "Although", "In spite of", "Despite"], 3),
      q(352, "He studied hard; ____, he failed.", ["furthermore", "nevertheless", "otherwise", "consequently"], 1),
      q(353, "She stayed home ____ being ill.", ["as", "since", "due to", "because"], 1),
      q(354, "____ the traffic, we arrived on time.", ["Although", "However", "Because", "Despite"], 3),
      q(355, "I will call you ____ I arrive.", ["during", "as soon as", "while", "until"], 1),
      q(356, "_______ he is wealthy, he lives a simple life.", ["Even though", "Despite", "Nevertheless", "However"], 0),
      q(357, "Take your coat _______ it gets cold.", ["so that", "unless", "if", "in case"], 3),
      q(358, "I like coffee, _______ my brother prefers tea.", ["whereas", "since", "despite", "so"], 0),
      q(359, "You cannot pass the exam _______ you study.", ["unless", "when", "if", "while"], 0),
      q(360, "We cancelled the picnic _______ the rain.", ["because", "as", "since", "due to"], 3),
    ]
  },
  {
    id: 37,
    title: "Boşluk Doldurma Test 37 - Final Review 2",
    questions: [
      q(361, "The company's primary ____ is quality.", ["subject", "objective", "objection", "rejection"], 1),
      q(362, "His explanation was so ____.", ["vague", "obscure", "ambiguous", "clear"], 3),
      q(363, "They made a ____ decision.", ["junction", "joined", "joint", "joining"], 2),
      q(364, "The evidence was ____.", ["efficient", "sufficient", "proficient", "deficient"], 1),
      q(365, "She ____ the job offer.", ["accepted", "rejected", "injected", "ejected"], 1),
      q(366, "The scientists announced a major _______.", ["breakdown", "breakthrough", "breakup", "breakout"], 1),
      q(367, "The government adopted a new _______.", ["policy", "polite", "politics", "police"], 0),
      q(368, "She showed a remarkable _______.", ["altitude", "aptitude", "attitude", "gratitude"], 1),
      q(369, "The environmental _______.", ["contract", "impact", "compact", "contact"], 1),
      q(370, "He worked hard and finally _______.", ["received", "relieved", "achieved", "believed"], 2),
    ]
  },
  {
    id: 38,
    title: "Boşluk Doldurma Test 38 - Final Review 3",
    questions: [
      q(371, "I wish I ____ speak Japanese.", ["would", "will", "can", "could"], 3),
      q(372, "If only I ____ the truth earlier.", ["would know", "had known", "knew", "know"], 1),
      q(373, "If it ____ tomorrow, we will stay.", ["snowed", "will snow", "snow", "snows"], 3),
      q(374, "Unless he ____ soon, we leave.", ["came", "will come", "has come", "comes"], 3),
      q(375, "He treats me as if I ____ a child.", ["am", "was", "were", "be"], 2),
      q(376, "I suggest that he _______ a doctor.", ["sees", "saw", "see", "seeing"], 2),
      q(377, "It is important that everyone _______ quiet.", ["is", "was", "be", "are"], 2),
      q(378, "Suppose you _______ the lottery.", ["would win", "had won", "won", "win"], 2),
      q(379, "Providing that you _______ the rules.", ["followed", "had followed", "will follow", "follow"], 3),
      q(380, "But for his help, we _______.", ["didn't finish", "hadn't finished", "wouldn't finish", "wouldn't have finished"], 3),
    ]
  },
  {
    id: 39,
    title: "Boşluk Doldurma Test 39 - Final Review 4",
    questions: [
      q(381, "The document ____ by the manager.", ["was signing", "was signed", "signed", "has been signed"], 1),
      q(382, "A new hospital ____ next year.", ["was built", "builds", "is built", "will be built"], 3),
      q(383, "English ____ all over the world.", ["has spoken", "is spoken", "is speaking", "speaks"], 1),
      q(384, "The cake ____ by the time we arrived.", ["was eating", "ate", "has been eaten", "had been eaten"], 3),
      q(385, "The rules ____ followed strictly.", ["must being", "must have", "must be", "must"], 2),
      q(386, "Rice _______ in many Asian countries.", ["is grown", "grows", "is growing", "grown"], 0),
      q(387, "My car _______ at the moment.", ["has repaired", "repairs", "is being repaired", "is repairing"], 2),
      q(388, "Many ancient cities _______.", ["have been discovered", "have discovered", "were discovering", "discovered"], 0),
      q(389, "The decision _______ until tomorrow.", ["won't make", "isn't making", "won't be made", "hasn't been made"], 2),
      q(390, "It _______ that the economy will improve.", ["is thinking", "thinks", "thought", "is thought"], 3),
    ]
  },
  {
    id: 40,
    title: "Boşluk Doldurma Test 40 - Final Review 5",
    questions: [
      q(391, "He avoided ____ to the party.", ["to go", "going", "gone", "go"], 1),
      q(392, "I hope ____ from you soon.", ["hear", "to hearing", "to hear", "hearing"], 2),
      q(393, "They decided ____ the meeting.", ["postpone", "to postpone", "postponed", "postponing"], 1),
      q(394, "She is looking forward ____ you.", ["to see", "to seeing", "see", "seeing"], 1),
      q(395, "We finished ____ the report.", ["to write", "writing", "write", "written"], 1),
      q(396, "I offered _______ them with the project.", ["helping", "help", "to help", "helped"], 2),
      q(397, "He suggested _______ for a walk.", ["going", "go", "to go", "gone"], 0),
      q(398, "They aren't used to _______ in a city.", ["lived", "to live", "live", "living"], 3),
      q(399, "I promise _______ anyone your secret.", ["not telling", "not to tell", "didn't tell", "not tell"], 1),
      q(400, "It's no use _______ about the past.", ["cried", "cry", "to cry", "crying"], 3),
    ]
  }
];
