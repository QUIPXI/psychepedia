"use client";

import * as React from "react";
import { useTranslations, useLocale } from "next-intl";
import { Search, Moon, Sun, FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { ThemeSelector } from "@/components/layout/ThemeSelector";
import { Logo } from "@/components/layout/Logo";
import { SearchDialog } from "@/components/search/SearchDialog";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";

// Search index for articles
const articleSearchIndex = [
  {
    id: "foundations/history-and-systems",
    title: "History & Systems",
    titleAr: "التاريخ والمدارس",
    description: "Historical development of psychology",
    descriptionAr: "التطور التاريخي لعلم النفس",
    domain: "foundations",
    domainTitle: "Foundations",
    topic: "history-and-systems",
    keywords: ["history", "systems", "schools"],
    content: "",
    sections: ["Introduction", "Philosophical Foundations", "The Birth of Scientific Psychology", "Major Schools of Psychology", "The Cognitive Revolution", "Contemporary Integrative Approaches", "Historical Perspectives on Key Debates", "The Humanistic Movement", "Diversity and Inclusion in Psychology's History", "The Development of Professional Psychology"],
    keyConcepts: ["Structuralism", "Functionalism", "Behaviorism", "Psychoanalysis", "Cognitive Revolution", "Dualism", "Introspection", "Operant Conditioning"],
    href: "/wiki/foundations/history-and-systems"
  },
  {
    id: "foundations/research-methods",
    title: "Research Methods",
    titleAr: "مناهج البحث",
    description: "Scientific methods in psychology",
    descriptionAr: "المناهج العلمية في علم النفس",
    domain: "foundations",
    domainTitle: "Foundations",
    topic: "research-methods",
    keywords: ["research", "methods", "science"],
    content: "",
    sections: ["Introduction to Research Methods", "Experimental Design", "Nonexperimental Research Methods", "Sampling", "Statistical Analysis", "Validity and Reliability"],
    keyConcepts: ["Variable", "Hypothesis", "Random Assignment", "Internal Validity", "External Validity", "Confounding Variable", "Control Group"],
    href: "/wiki/foundations/research-methods"
  },
  {
    id: "foundations/ethics",
    title: "Ethics",
    titleAr: "الأخلاقيات",
    description: "Ethical principles in psychology",
    descriptionAr: "المبادئ الأخلاقية في علم النفس",
    domain: "foundations",
    domainTitle: "Foundations",
    topic: "ethics",
    keywords: ["ethics", "principles"],
    content: "",
    sections: ["Introduction to Ethics", "Ethical Guidelines", "Informed Consent", "Protection from Harm", "Deception", "Ethics Committees"],
    keyConcepts: ["Informed Consent", "Confidentiality", "Debriefing", "Institutional Review Board", "Belmont Report", "APA Ethics Code"],
    href: "/wiki/foundations/ethics"
  },
  {
    id: "biological/neuropsychology",
    title: "Neuropsychology",
    titleAr: "علم النفس العصبي",
    description: "Brain and behavior relationships",
    descriptionAr: "العلاقة بين الدماغ والسلوك",
    domain: "biological",
    domainTitle: "Biological",
    topic: "neuropsychology",
    keywords: ["brain", "neuroscience"],
    content: "",
    sections: ["Introduction to Neuropsychology", "Organization of the Nervous System", "Neural Communication", "Neuroplasticity", "Hemispheric Specialization", "Neuropsychological Assessment", "Major Neurological Conditions", "Neuroimaging Techniques"],
    keyConcepts: ["Neuroplasticity", "Hemispheric Specialization", "Neurotransmitter", "Action Potential", "Cerebral Cortex", "Synapse", "Long-Term Potentiation", "Diaschisis", "BOLD Signal", "Diffuse Axonal Injury"],
    href: "/wiki/biological/neuropsychology"
  },
  {
    id: "biological/sensation-perception",
    title: "Sensation & Perception",
    titleAr: "الإحساس والإدراك",
    description: "How we sense and perceive the world",
    descriptionAr: "كيف نحس وندرك العالم",
    domain: "biological",
    domainTitle: "Biological",
    topic: "sensation-perception",
    keywords: ["sensation", "perception", "senses"],
    content: "",
    sections: ["Introduction to Sensation and Perception", "The Visual System", "The Auditory System", "The Chemical Senses", "The Somatosensory System", "Perception"],
    keyConcepts: ["Threshold", "Just Noticeable Difference", "Transduction", "Retina", "Pitch Perception", "Olfaction", "Gustation", "Gate Control Theory"],
    href: "/wiki/biological/sensation-perception"
  },
  {
    id: "biological/psychopharmacology",
    title: "Psychopharmacology",
    titleAr: "علم الأدوية النفسية",
    description: "Drugs and behavior",
    descriptionAr: "الأدوية والسلوك",
    domain: "biological",
    domainTitle: "Biological",
    topic: "psychopharmacology",
    keywords: ["drugs", "medication", "pharmacology"],
    content: "",
    sections: ["Introduction to Psychopharmacology", "Principles of Pharmacokinetics", "Neurotransmitter Systems", "Drug Classes", "Drug Development and Testing"],
    keyConcepts: ["Agonist", "Antagonist", "Receptor", "Blood-Brain Barrier", "Tolerance", "Withdrawal", "Placebo Effect"],
    href: "/wiki/biological/psychopharmacology"
  },
  {
    id: "cognitive/cognitive-psychology",
    title: "Cognitive Psychology",
    titleAr: "علم النفس المعرفي",
    description: "Memory, attention, and thinking",
    descriptionAr: "الذاكرة والانتباه والتفكير",
    domain: "cognitive",
    domainTitle: "Cognitive",
    topic: "cognitive-psychology",
    keywords: ["memory", "attention", "thinking"],
    content: "",
    sections: ["Introduction to Cognitive Psychology", "Attention", "Perception", "Memory", "Learning", "Language", "Thinking and Reasoning", "Decision Making"],
    keyConcepts: ["Working Memory", "Long-Term Memory", "Attention", "Schema", "Prototype", "Metacognition", "Heuristic", "Framing Effect"],
    href: "/wiki/cognitive/cognitive-psychology"
  },
  {
    id: "cognitive/emotion-motivation",
    title: "Emotion & Motivation",
    titleAr: "الانفعال والدافعية",
    description: "Emotions and what drives behavior",
    descriptionAr: "الانفعالات وما يحرك السلوك",
    domain: "cognitive",
    domainTitle: "Cognitive",
    topic: "emotion-motivation",
    keywords: ["emotion", "motivation", "feelings"],
    content: "",
    sections: ["Introduction to Emotion and Motivation", "Theories of Emotion", "The Biology of Emotion", "Motivation", "Applications"],
    keyConcepts: ["Amygdala", "Limbic System", "Drive Reduction", "Incentive Motivation", "James-Lange Theory", "Cannon-Bard Theory", "Opponent-Process Theory"],
    href: "/wiki/cognitive/emotion-motivation"
  },
  {
    id: "developmental/child-psychology",
    title: "Child Psychology",
    titleAr: "علم نفس الطفل",
    description: "Development in childhood",
    descriptionAr: "النمو في مرحلة الطفولة",
    domain: "developmental",
    domainTitle: "Developmental",
    topic: "child-psychology",
    keywords: ["child", "development", "childhood"],
    content: "",
    sections: ["Introduction to Child Psychology", "Physical Development", "Cognitive Development", "Social and Emotional Development", "Language Development", "Parenting and Family Dynamics"],
    keyConcepts: ["Attachment", "Object Permanence", "Zone of Proximal Development", "Scaffolding", "Theory of Mind", "Secure Attachment"],
    href: "/wiki/developmental/child-psychology"
  },
  {
    id: "developmental/adolescent-psychology",
    title: "Adolescent Psychology",
    titleAr: "علم نفس المراهقة",
    description: "Development in adolescence",
    descriptionAr: "النمو في مرحلة المراهقة",
    domain: "developmental",
    domainTitle: "Developmental",
    topic: "adolescent-psychology",
    keywords: ["adolescent", "teenager", "development"],
    content: "",
    sections: ["Introduction to Adolescent Psychology", "Physical Development", "Cognitive Development", "Identity Development", "Social Relationships", "Risk Behaviors"],
    keyConcepts: ["Identity vs. Role Confusion", "Puberty", "Peer Pressure", "Risk-taking", "Self-Concept"],
    href: "/wiki/developmental/adolescent-psychology"
  },
  {
    id: "social-personality/social-psychology",
    title: "Social Psychology",
    titleAr: "علم النفس الاجتماعي",
    description: "Social behavior and influence",
    descriptionAr: "السلوك الاجتماعي والتأثير",
    domain: "social-personality",
    domainTitle: "Social",
    topic: "social-psychology",
    keywords: ["social", "behavior", "influence"],
    content: "",
    sections: ["Introduction to Social Psychology", "Social Cognition", "Social Perception", "Attitudes", "Conformity and Obedience", "Group Influence", "Prosocial Behavior", "Aggression", "Prejudice and Discrimination"],
    keyConcepts: ["Attribution", "Cognitive Dissonance", "Social Norm", "Conformity", "Obedience", "Fundamental Attribution Error", "Self-Serving Bias", "Groupthink"],
    href: "/wiki/social-personality/social-psychology"
  },
  {
    id: "social-personality/personality-theories",
    title: "Personality Theories",
    titleAr: "نظريات الشخصية",
    description: "Understanding personality",
    descriptionAr: "فهم الشخصية",
    domain: "social-personality",
    domainTitle: "Social",
    topic: "personality-theories",
    keywords: ["personality", "theories", "traits"],
    content: "",
    sections: ["Introduction to Personality", "Psychodynamic Theory", "Humanistic Theory", "Trait Theory", "Social-Cognitive Theory", "Biological Perspective"],
    keyConcepts: ["Id", "Ego", "Superego", "Self-Actualization", "Trait", "Big Five", "Self-Efficacy", "Defense Mechanism"],
    href: "/wiki/social-personality/personality-theories"
  },
  {
    id: "clinical/psychopathology",
    title: "Psychopathology",
    titleAr: "علم النفس المرضي",
    description: "Mental disorders and abnormal psychology",
    descriptionAr: "الاضطرابات النفسية وعلم النفس الشاذ",
    domain: "clinical",
    domainTitle: "Clinical",
    topic: "psychopathology",
    keywords: ["disorders", "abnormal", "mental health"],
    content: "",
    sections: ["Introduction to Psychopathology", "Defining Abnormality", "Anxiety Disorders", "Mood Disorders", "Schizophrenia Spectrum Disorders", "Personality Disorders", "Neurodevelopmental Disorders"],
    keyConcepts: ["DSM-5", "Anxiety", "Depression", "Schizophrenia", "Hallucination", "Delusion", "Obsession", "Compulsion"],
    href: "/wiki/clinical/psychopathology"
  },
  {
    id: "clinical/assessment",
    title: "Psychological Assessment",
    titleAr: "التقييم النفسي",
    description: "Testing and evaluation",
    descriptionAr: "الاختبارات والتقييم",
    domain: "clinical",
    domainTitle: "Clinical",
    topic: "assessment",
    keywords: ["testing", "assessment", "evaluation"],
    content: "",
    sections: ["Introduction to Psychological Assessment", "Types of Tests", "Intelligence Testing", "Personality Assessment", "Neuropsychological Assessment", "Psychometric Principles"],
    keyConcepts: ["Reliability", "Validity", "Standardization", "Norm", "IQ", "Projective Test", "MMPI"],
    href: "/wiki/clinical/assessment"
  },
  {
    id: "clinical/evidence-based-therapies",
    title: "Evidence-Based Therapies",
    titleAr: "العلاجات المبنية على الأدلة",
    description: "CBT, DBT, and other treatments",
    descriptionAr: "العلاج المعرفي السلوكي وغيره",
    domain: "clinical",
    domainTitle: "Clinical",
    topic: "evidence-based-therapies",
    keywords: ["therapy", "CBT", "DBT", "treatment"],
    content: "",
    sections: ["Introduction to Evidence-Based Therapies", "Cognitive Behavioral Therapy", "Dialectical Behavior Therapy", "Psychodynamic Therapy", "Humanistic Therapies", "Pharmacotherapy"],
    keyConcepts: ["CBT", "Cognitive Restructuring", "Exposure Therapy", "Dialectics", "Unconditional Positive Regard", "Insight", "Behavioral Activation"],
    href: "/wiki/clinical/evidence-based-therapies"
  },
  {
    id: "applied/forensic-psychology",
    title: "Forensic Psychology",
    titleAr: "علم النفس الجنائي",
    description: "Psychology and the legal system",
    descriptionAr: "علم النفس والنظام القانوني",
    domain: "applied",
    domainTitle: "Applied",
    topic: "forensic-psychology",
    keywords: ["forensic", "legal", "crime"],
    content: "",
    sections: ["Introduction to Forensic Psychology", "Legal System Overview", "Criminal Behavior", "Victimization", "Legal Competency", "Assessment in Legal Contexts", "Ethics in Forensic Psychology"],
    keyConcepts: ["Competency", "Insanity Defense", "Malingering", "Eyewitness Testimony", "Risk Assessment", "Psychopathy"],
    href: "/wiki/applied/forensic-psychology"
  },
  {
    id: "applied/industrial-organizational",
    title: "I/O Psychology",
    titleAr: "علم النفس التنظيمي",
    description: "Psychology in the workplace",
    descriptionAr: "علم النفس في مكان العمل",
    domain: "applied",
    domainTitle: "Applied",
    topic: "industrial-organizational",
    keywords: ["workplace", "organizational", "work"],
    content: "",
    sections: ["Introduction to Industrial-Organizational Psychology", "Personnel Psychology", "Organizational Psychology", "Workplace Well-being", "Leadership and Management"],
    keyConcepts: ["Job Analysis", "Selection", "Performance Appraisal", "Motivation", "Leadership", "Organizational Culture"],
    href: "/wiki/applied/industrial-organizational"
  },
  {
    id: "new-and-now/ai-mental-health",
    title: "AI in Mental Health",
    titleAr: "الذكاء الاصطناعي في الصحة النفسية",
    description: "The rise of AI chatbots, diagnostics, and ethical considerations in therapy.",
    descriptionAr: "صعود روبوتات الدردشة، والتشخيص بالذكاء الاصطناعي، والاعتبارات الأخلاقية.",
    domain: "new-and-now",
    domainTitle: "New & Now",
    topic: "ai-mental-health",
    keywords: ["AI", "tech", "chatbots", "therapy"],
    content: "",
    sections: ["Introduction to AI in Mental Health", "AI Chatbots for Therapy", "AI in Diagnosis", "Ethical Considerations", "Future Directions"],
    keyConcepts: ["AI", "Machine Learning", "Chatbot", "Ethics", "Privacy"],
    href: "/wiki/new-and-now/ai-mental-health"
  },
  {
    id: "new-and-now/psychedelic-therapy",
    title: "Psychedelic-Assisted Therapy",
    titleAr: "العلاج بمساعدة المخدر",
    description: "Regulatory milestones and therapeutic mechanisms of MDMA and Psilocybin.",
    descriptionAr: "المعالم التنظيمية والآليات العلاجية لـ MDMA والسيلوسيبين.",
    domain: "new-and-now",
    domainTitle: "New & Now",
    topic: "psychedelic-therapy",
    keywords: ["psychedelic", "MDMA", "psilocybin", "therapy"],
    content: "",
    sections: ["Introduction to Psychedelic-Assisted Therapy", "Historical Context", "MDMA-Assisted Therapy", "Psilocybin-Assisted Therapy", "Regulatory Landscape", "Future Directions"],
    keyConcepts: ["Psychedelic", "MDMA", "Psilocybin", "Therapy", "Clinical Trials"],
    href: "/wiki/new-and-now/psychedelic-therapy"
  },
  {
    id: "new-and-now/eco-anxiety",
    title: "Eco-Anxiety & Climate Psychology",
    titleAr: "القلق البيئي وعلم النفس المناخي",
    description: "Understanding the psychological impact of the climate crisis.",
    descriptionAr: "فهم التأثير النفسي لأزمة المناخ.",
    domain: "new-and-now",
    domainTitle: "New & Now",
    topic: "eco-anxiety",
    keywords: ["climate", "anxiety", "environment", "psychology"],
    content: "",
    sections: ["Introduction to Eco-Anxiety", "Understanding Eco-Anxiety", "Climate Psychology", "Coping Strategies", "Collective Action"],
    keyConcepts: ["Eco-Anxiety", "Climate Change", "Solastalgia", "Climate Grief", "Collective Efficacy"],
    href: "/wiki/new-and-now/eco-anxiety"
  },
  {
    id: "new-and-now/algorithmic-impact",
    title: "The Impact of Algorithmic Feeds",
    titleAr: "تأثير الخلاصات الخوارزمية",
    description: "How TikTok and Reels affect attention and self-image.",
    descriptionAr: "كيف يؤثر TikTok و Reels على الانتباه والصورة الذاتية.",
    domain: "new-and-now",
    domainTitle: "New & Now",
    topic: "algorithmic-impact",
    keywords: ["social media", "algorithms", "tiktok", "attention"],
    content: "",
    sections: ["Introduction to Algorithmic Feeds", "How Algorithms Work", "Impact on Attention", "Impact on Self-Image", "Mitigation Strategies"],
    keyConcepts: ["Algorithm", "Engagement", "Attention Economy", "Social Comparison", "Filter Bubble"],
    href: "/wiki/new-and-now/algorithmic-impact"
  },
  {
    id: "relationships-family/attachment-theory",
    title: "Attachment Theory & Adult Relationships",
    titleAr: "نظرية التعلق والعلاقات الراشدة",
    description: "Understand how early attachment experiences shape adult relationships and emotional bonds throughout life.",
    descriptionAr: "فهم كيفية تشكيل تجارب التعلق المبكرة للعلاقات الراشدة والروابط العاطفية طوال الحياة.",
    domain: "relationships-family",
    domainTitle: "Relationships & Family",
    topic: "attachment-theory",
    keywords: ["attachment", "relationships", "bonding", "Bowlby", "emotional bonds"],
    content: "",
    sections: ["Introduction to Attachment Theory", "Bowlby's Attachment Theory", "Infant Attachment Styles", "Adult Attachment", "Attachment and Relationship Dynamics", "Attachment Across the Lifespan"],
    keyConcepts: ["Attachment", "Internal Working Model", "Secure Base", "Safe Haven", "Strange Situation", "Attachment Anxiety", "Attachment Avoidance", "Earned Security", "Demand-Withdraw Pattern", "Disorganized Attachment"],
    href: "/wiki/relationships-family/attachment-theory"
  },
  {
    id: "positive/well-being",
    title: "Well-Being & Happiness",
    titleAr: "الرفاهية والسعادة",
    description: "Explore the science of well-being, happiness, and flourishing from a psychological perspective.",
    descriptionAr: "استكشاف علم الرفاهية والسعادة والازدهار من منظر نفسي.",
    domain: "positive",
    domainTitle: "Positive Psychology",
    topic: "well-being",
    keywords: ["happiness", "well-being", "flourishing", "positive psychology", "Seligman"],
    content: "",
    sections: ["Introduction to Well-Being", "Subjective Well-Being", "Eudaimonic Well-Being", "Seligman's PERMA Model", "Determinants of Happiness", "Positive Interventions"],
    keyConcepts: ["Subjective Well-Being", "Eudaimonia", "PERMA Model", "Flow", "Hedonic Adaptation", "Signature Strengths", "Broaden-and-Build Theory", "Self-Determination Theory", "Gratitude", "Flourishing"],
    href: "/wiki/positive/well-being"
  },
  {
    id: "gender-sexuality/gender-psychology",
    title: "Psychology of Gender",
    titleAr: "علم نفس الجنس",
    description: "Explore psychological perspectives on gender, including gender development, identity, and differences.",
    descriptionAr: "استكشاف المنظورات النفسية للجنس، بما في ذلك تطور الجنس والهوية والاختلافات.",
    domain: "gender-sexuality",
    domainTitle: "Gender & Sexuality",
    topic: "gender-psychology",
    keywords: ["gender", "identity", "transgender", "gender roles", "sex differences"],
    content: "",
    sections: ["Introduction to Gender Psychology", "Sex vs. Gender", "Gender Development", "Gender Similarities and Differences", "Gender Identity Development", "Gender and Mental Health"],
    keyConcepts: ["Gender Identity", "Cisgender", "Transgender", "Non-Binary", "Gender Schema", "Gender Dysphoria", "Gender Similarities Hypothesis", "Stereotype Threat", "Intersex", "Gender-Affirming Care"],
    href: "/wiki/gender-sexuality/gender-psychology"
  },
  {
    id: "consumer-environmental/consumer-behavior",
    title: "Consumer Psychology & Behavior",
    titleAr: "علم نفس المستهلك والسلوك",
    description: "Understand the psychological processes underlying consumer decision-making, persuasion, and marketing psychology.",
    descriptionAr: "فهم العمليات النفسية الكامنة وراء صنع قرار المستهلك والإقناع وعلم نفس التسويق.",
    domain: "consumer-environmental",
    domainTitle: "Consumer & Environmental",
    topic: "consumer-behavior",
    keywords: ["consumer", "marketing", "decision-making", "persuasion", "behavioral economics"],
    content: "",
    sections: ["Introduction to Consumer Psychology", "Consumer Decision-Making", "Motivation and Needs", "Perception and Attention", "Attitudes and Persuasion", "Social and Cultural Influences", "Behavioral Economics in Marketing"],
    keyConcepts: ["Consumer Decision-Making", "Elaboration Likelihood Model", "Hedonic Consumption", "Sensory Marketing", "Choice Architecture", "Reference Group", "Mental Accounting", "Social Proof", "Loss Aversion", "Brand Community"],
    href: "/wiki/consumer-environmental/consumer-behavior"
  },
  {
    id: "consumer-environmental/environmental-psychology",
    title: "Environmental Psychology",
    titleAr: "علم النفس البيئي",
    description: "Explore the interrelationship between people and their physical environments, including sustainable behavior.",
    descriptionAr: "استكشاف العلاقة المتبادلة بين الناس وبيئاتهم المادية، بما في ذلك السلوك المستدام.",
    domain: "consumer-environmental",
    domainTitle: "Consumer & Environmental",
    topic: "environmental-psychology",
    keywords: ["environment", "restorative", "nature", "sustainability", "built environment"],
    content: "",
    sections: ["Introduction to Environmental Psychology", "Person-Environment Relationships", "Environmental Stressors", "Restorative Environments", "Pro-Environmental Behavior", "Built Environment Design", "Climate Change Psychology"],
    keyConcepts: ["Environmental Stressor", "Attention Restoration Theory", "Being Away", "Extent", "Fascination", "Compatibility", "Biophilia", "Place Attachment", "Crowding", "Pro-Environmental Behavior", "Psychological Distance", "Defensible Space", "Eco-Anxiety", "Biophilic Design"],
    href: "/wiki/consumer-environmental/environmental-psychology"
  },
  {
    id: "relationships-family/romantic-relationships",
    title: "Romantic Relationships & Marriage",
    titleAr: "العلاقات الرومانسية والزواج",
    description: "Explore the science of romantic love, relationship maintenance, and factors predicting relationship success.",
    descriptionAr: "استكشاف علم الحب الرومانسي، والحفاظ على العلاقات، والعوامل التي تتنبأ بنجاح العلاقات.",
    domain: "relationships-family",
    domainTitle: "Relationships & Family",
    topic: "romantic-relationships",
    keywords: ["relationships", "love", "marriage", "communication", "Gottman"],
    content: "",
    sections: ["Introduction to Relationship Science", "Attraction and Relationship Formation", "Love and Its Components", "Relationship Maintenance", "Conflict and Communication", "Relationship Satisfaction and Stability", "Divorce and Relationship Dissolution"],
    keyConcepts: ["Triangular Theory of Love", "Passionate Love", "Companionate Love", "Four Horsemen", "Matching Hypothesis", "Investment Model", "Mere Exposure Effect", "Repair Attempt", "Negative Sentiment Override", "Perpetual Problems"],
    href: "/wiki/relationships-family/romantic-relationships"
  },
  {
    id: "relationships-family/parenting-psychology",
    title: "Parenting Psychology",
    titleAr: "علم نفس الأبوة",
    description: "Understand the psychology of parenting, including parenting styles, child development, and parent-child relationships.",
    descriptionAr: "فهم علم نفس الأبوة، بما في ذلك أنماط الأبوة، وتطور الطفل، وعلاقات الوالدين والطفل.",
    domain: "relationships-family",
    domainTitle: "Relationships & Family",
    topic: "parenting-psychology",
    keywords: ["parenting", "children", "discipline", "attachment", "Baumrind"],
    content: "",
    sections: ["Introduction to Parenting Psychology", "Parenting Styles", "Parent-Child Attachment", "Discipline and Behavior Management", "Parenting Across Contexts", "Parent Well-Being and Self-Care"],
    keyConcepts: ["Authoritative Parenting", "Sensitive Responsiveness", "Induction", "Parenting Stress", "Intergenerational Transmission", "Psychological Control", "Co-parenting", "Earned Security"],
    href: "/wiki/relationships-family/parenting-psychology"
  },
  {
    id: "positive/character-strengths",
    title: "Character Strengths & Virtues",
    titleAr: "قوى الشخصية والفضائل",
    description: "Discover the science of human strengths and how to cultivate virtuous character.",
    descriptionAr: "اكتشف علم نقاط القوة البشرية وكيفية تنمية الشخصية الفاضلة.",
    domain: "positive",
    domainTitle: "Positive Psychology",
    topic: "character-strengths",
    keywords: ["character", "strengths", "virtues", "VIA", "signature strengths"],
    content: "",
    sections: ["Introduction to Character Strengths", "The VIA Classification", "Signature Strengths", "Strengths-Based Interventions", "Research Evidence"],
    keyConcepts: ["Character Strength", "VIA Classification", "Signature Strength", "Virtue", "Golden Mean", "Strength Overuse", "Strengths-Spotting", "Job Crafting"],
    href: "/wiki/positive/character-strengths"
  },
  {
    id: "positive/resilience",
    title: "Resilience & Post-Traumatic Growth",
    titleAr: "المرونة ونمو ما بعد الصدمة",
    description: "Understand psychological resilience and the potential for growth following adversity.",
    descriptionAr: "فهم المرونة النفسية وإمكانية النمو بعد الشدائد.",
    domain: "positive",
    domainTitle: "Positive Psychology",
    topic: "resilience",
    keywords: ["resilience", "trauma", "growth", "coping", "adversity"],
    content: "",
    sections: ["Introduction to Resilience", "Understanding Resilience", "Factors Promoting Resilience", "Post-Traumatic Growth", "Building Resilience"],
    keyConcepts: ["Resilience", "Post-Traumatic Growth", "Protective Factor", "Stress Inoculation", "Assumptive World", "Deliberate Rumination", "Emotional Regulation", "Hardiness"],
    href: "/wiki/positive/resilience"
  },
  {
    id: "gender-sexuality/human-sexuality",
    title: "Psychology of Human Sexuality",
    titleAr: "علم نفس الجنسانية البشرية",
    description: "Explore the psychology of sexual development, orientation, behavior, and well-being across the lifespan.",
    descriptionAr: "استكشاف علم نفس تطور الجنسانية والتوجه والسلوك والصحة عبر lifespan.",
    domain: "gender-sexuality",
    domainTitle: "Gender & Sexuality",
    topic: "human-sexuality",
    keywords: ["sexuality", "sexual orientation", "LGBTQ", "sexual health", "Kinsey"],
    content: "",
    sections: ["Introduction to Sexuality Psychology", "Sexual Development", "Sexual Orientation", "Sexual Response and Behavior", "Sexual Well-Being", "LGBTQ+ Mental Health"],
    keyConcepts: ["Sexual Orientation", "Sexual Response Cycle", "Minority Stress", "Consent", "Kinsey Scale", "Sexual Dysfunction", "Asexuality", "Affirmative Therapy", "Sexual Well-Being", "Internalized Stigma"],
    href: "/wiki/gender-sexuality/human-sexuality"
  },
];

// Search index for interactive experiments/tests
const experimentSearchIndex = [
  { id: "big-five", type: "experiment", title: "Big Five Personality Test", titleAr: "اختبار السمات الخمس الكبرى", description: "Assess your personality across five major dimensions", descriptionAr: "قيّم شخصيتك عبر خمسة أبعاد رئيسية", domain: "experiments", domainTitle: "Interactive", topic: "personality", keywords: ["personality", "traits", "OCEAN", "psychology test"], content: "", sections: [], keyConcepts: [], href: "/experiments/big-five" },
  { id: "iq", type: "experiment", title: "IQ Test", titleAr: "اختبار الذكاء", description: "Measure your cognitive abilities across multiple dimensions", descriptionAr: "قِس قدراتك المعرفية عبر أبعاد متعددة", domain: "experiments", domainTitle: "Interactive", topic: "intelligence", keywords: ["IQ", "intelligence", "cognitive", "reasoning"], content: "", sections: [], keyConcepts: [], href: "/experiments/iq" },
  { id: "stroop", type: "experiment", title: "Stroop Effect Test", titleAr: "تأثير ستروب", description: "Test your focus and reaction speed", descriptionAr: "اختبر تركيزك وسرعة رد فعلك", domain: "experiments", domainTitle: "Interactive", topic: "attention", keywords: ["Stroop", "attention", "reaction", "cognitive flexibility"], content: "", sections: [], keyConcepts: [], href: "/experiments/stroop" },
  { id: "motion", type: "experiment", title: "Motion Detection Test", titleAr: "اختبار اكتشاف الحركة", description: "Assess your visual motion perception", descriptionAr: "قيّم إدراكك البصري للحركة", domain: "experiments", domainTitle: "Interactive", topic: "perception", keywords: ["motion", "perception", "visual", "attention"], content: "", sections: [], keyConcepts: [], href: "/experiments/motion" },
  { id: "finger-tapping", type: "experiment", title: "Finger Tapping Test", titleAr: "اختبار النقر بالأصابع", description: "Measure your motor speed and coordination", descriptionAr: "قِس سرعتك وتنسيقك الحركي", domain: "experiments", domainTitle: "Interactive", topic: "motor", keywords: ["motor", "coordination", "speed", "neuroscience"], content: "", sections: [], keyConcepts: [], href: "/experiments/finger-tapping" },
  { id: "phq9", type: "experiment", title: "PHQ-9 Depression Screening", titleAr: "فحص الاكتئاب (PHQ-9)", description: "Brief screening for depressive symptoms", descriptionAr: "فحص موجز لأعراض الاكتئاب", domain: "experiments", domainTitle: "Interactive", topic: "depression", keywords: ["depression", "PHQ", "mental health", "screening"], content: "", sections: [], keyConcepts: [], href: "/experiments/phq9" },
  { id: "gad7", type: "experiment", title: "GAD-7 Anxiety Screening", titleAr: "فحص القلق (GAD-7)", description: "Brief screening for anxiety symptoms", descriptionAr: "فحص موجز لأعراض القلق", domain: "experiments", domainTitle: "Interactive", topic: "anxiety", keywords: ["anxiety", "GAD", "mental health", "screening"], content: "", sections: [], keyConcepts: [], href: "/experiments/gad7" },
  { id: "mmse", type: "experiment", title: "MMSE Cognitive Screening", titleAr: "فحص الإدراك (MMSE)", description: "Brief cognitive assessment for orientation and memory", descriptionAr: "تقييم معرفي موجز للتوجه والذاكرة", domain: "experiments", domainTitle: "Interactive", topic: "cognition", keywords: ["MMSE", "cognitive", "screening", "dementia"], content: "", sections: [], keyConcepts: [], href: "/experiments/mmse" },
  { id: "adhd", type: "experiment", title: "ADHD Rating Scale", titleAr: "مقياس ADHD", description: "Screen for attention-deficit/hyperactivity symptoms", descriptionAr: "فحص أعراض اضطراب فرط الحركة ونقص الانتباه", domain: "experiments", domainTitle: "Interactive", topic: "attention", keywords: ["ADHD", "attention", "hyperactivity", "screening"], content: "", sections: [], keyConcepts: [], href: "/experiments/adhd" },
  { id: "autism", type: "experiment", title: "Autism Spectrum Screening", titleAr: "فحص طيف التوحد", description: "Screen for autistic traits in adults", descriptionAr: "فحص سمات التوحد لدى البالغين", domain: "experiments", domainTitle: "Interactive", topic: "autism", keywords: ["autism", "ASD", "screening", "neurodevelopmental"], content: "", sections: [], keyConcepts: [], href: "/experiments/autism" },
  { id: "depth-perception", type: "experiment", title: "Depth Perception Test", titleAr: "اختبار إدراك العمق", description: "Assess your depth perception abilities", descriptionAr: "قيّم قدرتك على إدراك العمق", domain: "experiments", domainTitle: "Interactive", topic: "perception", keywords: ["depth", "perception", "visual", "spatial"], content: "", sections: [], keyConcepts: [], href: "/experiments/depth-perception" },
];

// Combined search index
const searchIndex = [...articleSearchIndex, ...experimentSearchIndex];

import { OPEN_SEARCH_EVENT } from "@/lib/events";

export function Header() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);

  React.useEffect(() => {
    const handleOpenSearch = () => setIsSearchOpen(true);
    window.addEventListener(OPEN_SEARCH_EVENT, handleOpenSearch);

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener(OPEN_SEARCH_EVENT, handleOpenSearch);
    };
  }, []);

  // Transform search index based on locale
  const localizedSearchIndex = searchIndex.map(item => ({
    ...item,
    title: locale === "ar" ? item.titleAr : item.title,
    description: locale === "ar" ? item.descriptionAr : item.description,
  }));

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center px-4 md:px-6">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-semibold text-lg me-6"
          >
            <Logo size={36} />
            <span className="hidden sm:inline-block">
              {locale === "ar" ? "سايكوبيديا" : "PsychePedia"}
            </span>
          </Link>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link
              href="/wiki"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("wiki")}
            </Link>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-2 ms-auto">
            {/* Search button - NO keyboard shortcut indicator */}
            <Button
              variant="outline"
              className={cn(
                "relative h-9 w-9 p-0 md:h-9 md:w-64 md:justify-start md:px-3 md:py-2"
              )}
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className="h-4 w-4 md:me-2" />
              <span className="hidden md:inline-flex text-muted-foreground">
                {t("searchPlaceholder")}
              </span>
            </Button>

            {/* Language switcher */}
            <LanguageSwitcher />

            {/* Theme selector */}
            <ThemeSelector />
          </div>
        </div>
      </header>

      {/* Search Dialog */}
      <SearchDialog
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        searchIndex={localizedSearchIndex}
      />
    </>
  );
}

export default Header;
