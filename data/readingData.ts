
import { ReadingPassage } from "../types";

export const READING_TOPICS = [
  "Global Warming Effects", "Artificial Intelligence Ethics", "Quantum Physics Basics", "The History of Antibiotics", 
  "Economic Inflation", "Renewable Energy Sources", "Child Psychology", "The Roman Empire", 
  "Space Exploration", "Deep Sea Mysteries", "Cognitive Behavioral Therapy", "Supply Chain Management",
  "The Renaissance Era", "Modern Architecture", "Genetic Engineering", "Cybersecurity Threats",
  "Sustainable Agriculture", "The Industrial Revolution", "Language Acquisition", "Nutrition and Diet",
  "Globalization", "Social Media Impact", "Electric Vehicles", "Nano-technology",
  "Human Evolution", "Urban Planning", "Minimalism Lifestyle", "Remote Work Culture",
  "Cryptocurrency", "Meditation Benefits", "Climate Change Policy", "Plastic Pollution",
  "Vaccine Development", "Tourism Trends", "E-Commerce Growth", "Mental Health Awareness",
  "Biodiversity Loss", "Smart Cities", "Educational Technology", "Work-Life Balance"
];

// Örnek olarak 5 tam metin ekliyorum. Gerçek uygulamada 40'ı da bu formatta doldurulabilir.
// Diğer konular seçildiğinde demo amaçlı bu metinlerden biri veya jenerik bir yapı dönecektir.
export const STATIC_READING_PASSAGES: Record<string, ReadingPassage> = {
  "Global Warming Effects": {
    title: "The Effects of Global Warming",
    content: "Global warming, driven by the greenhouse effect, is one of the most pressing challenges of the 21st century. As carbon dioxide and other greenhouse gases accumulate in the atmosphere, they trap heat, causing the Earth's average temperature to rise. This phenomenon leads to melting polar ice caps, rising sea levels, and more frequent extreme weather events such as hurricanes, droughts, and heatwaves.\n\nFurthermore, global warming disrupts ecosystems, forcing species to migrate or face extinction. The agricultural sector is also heavily impacted, as changing weather patterns affect crop yields, threatening food security for a growing global population. Addressing this issue requires urgent international cooperation, a shift towards renewable energy sources, and sustainable land-use practices.",
    difficulty: "Hard",
    questions: [
      { id: 1, text: "What is the primary cause of global warming mentioned in the text?", options: ["Deforestation", "Volcanic eruptions", "Solar flares", "The greenhouse effect"], correctOptionIndex: 3 },
      { id: 2, text: "Which of the following is NOT mentioned as a consequence of global warming?", options: ["Extreme weather events", "Rising sea levels", "Increased volcanic activity", "Disruption of ecosystems"], correctOptionIndex: 2 },
      { id: 3, text: "How does global warming affect agriculture?", options: ["It reduces the need for irrigation.", "It has no significant impact.", "It threatens food security by affecting crop yields.", "It increases crop yields universally."], correctOptionIndex: 2 }
    ]
  },
  "Artificial Intelligence Ethics": {
    title: "Ethics in Artificial Intelligence",
    content: "Artificial Intelligence (AI) has permeated nearly every aspect of modern life, from healthcare to finance. However, its rapid development brings forth significant ethical considerations. One major concern is bias; AI systems trained on biased data can perpetuate discrimination in hiring, law enforcement, and lending. \n\nAnother issue is accountability. When an autonomous vehicle causes an accident or a medical AI makes a wrong diagnosis, determining liability becomes complex. Moreover, the potential for job displacement due to automation raises socio-economic questions. Ensuring that AI benefits humanity requires robust ethical guidelines, transparency in algorithms, and continuous human oversight.",
    difficulty: "Hard",
    questions: [
      { id: 1, text: "Why can AI systems become biased?", options: ["They are trained on biased data.", "They are too autonomous.", "They are programmed to be evil.", "They lack computational power."], correctOptionIndex: 0 },
      { id: 2, text: "What is the accountability issue mentioned in the text?", options: ["AI cannot be turned off.", "Determining liability when AI makes errors is difficult.", "AI developers refuse to take responsibility.", "AI systems are too expensive."], correctOptionIndex: 1 },
      { id: 3, text: "What is suggested to ensure AI benefits humanity?", options: ["Robust ethical guidelines and transparency.", "Replacing all humans with AI.", "Allowing AI to self-regulate.", "Stopping all AI research."], correctOptionIndex: 0 }
    ]
  },
  "Quantum Physics Basics": {
    title: "Understanding Quantum Physics",
    content: "Quantum physics explores the behavior of matter and energy at the most fundamental levels: atoms and subatomic particles. Unlike classical physics, which describes the world of everyday objects, quantum mechanics reveals a reality that is counter-intuitive. Concepts such as superposition, where a particle can exist in multiple states simultaneously, and entanglement, where particles remain connected across vast distances, challenge our traditional understanding of the universe.\n\nThese principles are not just theoretical curiosities; they form the basis of modern technology, including semiconductors, lasers, and magnetic resonance imaging (MRI). The ongoing development of quantum computers promises to revolutionize computing power, solving problems that are currently intractable for classical computers.",
    difficulty: "Hard",
    questions: [
      { id: 1, text: "What does quantum physics primarily explore?", options: ["Geological formations.", "Matter and energy at atomic levels.", "The motion of planets.", "Chemical reactions in biology."], correctOptionIndex: 1 },
      { id: 2, text: "What is 'superposition'?", options: ["Particles colliding with each other.", "Particles moving faster than light.", "The gravitational pull of atoms.", "A particle existing in multiple states at once."], correctOptionIndex: 3 },
      { id: 3, text: "Which technology is NOT mentioned as an application of quantum physics?", options: ["MRI", "Combustion engines", "Lasers", "Semiconductors"], correctOptionIndex: 1 }
    ]
  },
  "The History of Antibiotics": {
    title: "The Revolution of Antibiotics",
    content: "The discovery of penicillin by Alexander Fleming in 1928 marked the beginning of the antibiotic era, revolutionizing medicine. Before antibiotics, minor infections could be fatal, and surgeries carried high risks of bacterial contamination. These drugs work by killing bacteria or inhibiting their growth, effectively treating diseases like pneumonia, tuberculosis, and syphilis.\n\nHowever, the overuse and misuse of antibiotics have led to a global health crisis: antibiotic resistance. Bacteria evolve mechanisms to survive drug exposure, rendering standard treatments ineffective. This phenomenon threatens to return medicine to a pre-antibiotic age. Combatting resistance requires strict regulation of antibiotic use in healthcare and agriculture, alongside the development of new therapeutic agents.",
    difficulty: "Medium",
    questions: [
      { id: 1, text: "Who discovered penicillin?", options: ["Louis Pasteur", "Isaac Newton", "Marie Curie", "Alexander Fleming"], correctOptionIndex: 3 },
      { id: 2, text: "What is the main problem caused by the overuse of antibiotics?", options: ["They stop working on viruses.", "Antibiotic resistance.", "They cause more viral infections.", "They have become too expensive."], correctOptionIndex: 1 },
      { id: 3, text: "How do antibiotics work?", options: ["By boosting the immune system.", "By lowering body temperature.", "By killing bacteria or inhibiting their growth.", "By removing viruses from the blood."], correctOptionIndex: 2 }
    ]
  },
  "Economic Inflation": {
    title: "Causes and Effects of Inflation",
    content: "Inflation is the rate at which the general level of prices for goods and services is rising, and subsequently, purchasing power is falling. Central banks attempt to limit inflation, and avoid deflation, in order to keep the economy running smoothly. There are several causes of inflation, including demand-pull inflation, cost-push inflation, and built-in inflation.\n\nDemand-pull occurs when demand for goods exceeds supply. Cost-push happens when production costs increase prices. While moderate inflation is often a sign of a growing economy, hyperinflation can destroy a country's financial system, eroding savings and creating economic instability. Therefore, managing monetary policy is crucial for economic health.",
    difficulty: "Medium",
    questions: [
      { id: 1, text: "What happens to purchasing power during inflation?", options: ["It remains stable.", "It fluctuates randomly.", "It increases.", "It falls."], correctOptionIndex: 3 },
      { id: 2, text: "What is 'demand-pull' inflation?", options: ["When the government prints money.", "When demand exceeds supply.", "When wages increase.", "When production costs rise."], correctOptionIndex: 1 },
      { id: 3, text: "Why do central banks try to limit inflation?", options: ["To keep the economy running smoothly.", "To increase taxes.", "To stop people from spending.", "To lower the employment rate."], correctOptionIndex: 0 }
    ]
  }
};

// Fallback generator for topics without full content (Simulated)
export const getPassageForTopic = (topic: string): ReadingPassage => {
  if (STATIC_READING_PASSAGES[topic]) {
    return STATIC_READING_PASSAGES[topic];
  }
  
  // Generic template for topics not yet fully written
  return {
    title: topic,
    content: `This is a sample academic text about ${topic}. In the actual YDS exam, you will encounter texts similar to this one in length and complexity. ${topic} is a significant subject in modern academia, involving various theories and practical applications.\n\nResearchers have long debated the implications of ${topic} on society. Some argue that it provides essential benefits, while others point out potential drawbacks. Understanding the nuances of ${topic} requires a deep dive into its history, current state, and future projections. As we move forward, the importance of this subject is likely to grow, influencing policy and public opinion alike.`,
    difficulty: "Medium",
    questions: [
      { id: 1, text: `What is the main focus of the text?`, options: [`The history of ${topic}`, `The economic impact of ${topic}`, `A general overview of ${topic}`, `The future of technology`], correctOptionIndex: 2 },
      { id: 2, text: "According to the text, what is required to understand this subject?", options: ["Only looking at the future.", "Ignoring public opinion.", "Focusing solely on benefits.", "A deep dive into its history and current state."], correctOptionIndex: 3 },
      { id: 3, text: "What is the author's stance on the future of this subject?", options: ["It will become irrelevant.", "It will be banned.", "It is uncertain.", "It will likely grow in importance."], correctOptionIndex: 3 }
    ]
  };
};
