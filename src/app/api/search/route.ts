import { NextRequest, NextResponse } from "next/server";
import Fuse from "fuse.js";

// In production, this would be loaded from generated search index
const searchIndex = [
  {
    id: "foundations/history-and-systems",
    title: "History & Systems of Psychology",
    description: "Explore the historical development of psychological thought from ancient philosophy to modern neuroscience.",
    domain: "foundations",
    domainTitle: "Foundations of Psychology",
    topic: "history-and-systems",
    keywords: ["history", "behaviorism", "psychoanalysis", "cognitive revolution", "Wundt", "James"],
    content: "Psychology as a scientific discipline. Wilhelm Wundt. Structuralism. Functionalism. Behaviorism. Cognitive revolution.",
    href: "/wiki/foundations/history-and-systems",
  },
  {
    id: "foundations/research-methods",
    title: "Research Methods & Statistics",
    description: "Learn the scientific methods used to study behavior and mental processes.",
    domain: "foundations",
    domainTitle: "Foundations of Psychology",
    topic: "research-methods",
    keywords: ["research", "statistics", "experiment", "correlation", "validity", "reliability"],
    content: "Scientific method. Experimental research. Correlational studies. Descriptive research. Statistical analysis.",
    href: "/wiki/foundations/research-methods",
  },
  {
    id: "foundations/ethics",
    title: "Ethics in Psychological Research",
    description: "Understand the ethical guidelines that govern psychological research and practice.",
    domain: "foundations",
    domainTitle: "Foundations of Psychology",
    topic: "ethics",
    keywords: ["ethics", "informed consent", "IRB", "Belmont Report", "APA"],
    content: "Ethical guidelines. Informed consent. Belmont Report. APA Ethics Code. Institutional Review Boards.",
    href: "/wiki/foundations/ethics",
  },
  {
    id: "biological/neuropsychology",
    title: "Neuropsychology",
    description: "Study brain structure, function, and plasticity in relation to behavior.",
    domain: "biological",
    domainTitle: "Biological Bases of Behavior",
    topic: "neuropsychology",
    keywords: ["brain", "neurons", "neuroscience", "plasticity", "cortex"],
    content: "Brain structure and function. Neural plasticity. Hemispheric specialization. Brain imaging.",
    href: "/wiki/biological/neuropsychology",
  },
  {
    id: "biological/sensation-perception",
    title: "Sensation & Perception",
    description: "Explore how we detect, process, and interpret sensory information.",
    domain: "biological",
    domainTitle: "Biological Bases of Behavior",
    topic: "sensation-perception",
    keywords: ["vision", "hearing", "perception", "senses", "attention"],
    content: "Sensory systems. Visual perception. Auditory processing. Bottom-up and top-down processing.",
    href: "/wiki/biological/sensation-perception",
  },
  {
    id: "clinical/psychopathology",
    title: "Psychopathology",
    description: "Study abnormal psychology and DSM-5-TR diagnostic categories.",
    domain: "clinical",
    domainTitle: "Clinical & Counseling Psychology",
    topic: "psychopathology",
    keywords: ["DSM-5", "disorders", "abnormal", "diagnosis", "mental illness", "anxiety", "depression"],
    content: "Mental disorders. DSM-5-TR. Anxiety disorders. Mood disorders. Schizophrenia. Personality disorders.",
    href: "/wiki/clinical/psychopathology",
  },
  {
    id: "clinical/assessment",
    title: "Psychological Assessment",
    description: "Learn testing, diagnosis, and clinical evaluation methods.",
    domain: "clinical",
    domainTitle: "Clinical & Counseling Psychology",
    topic: "assessment",
    keywords: ["testing", "diagnosis", "MMPI", "WAIS", "interview", "evaluation"],
    content: "Clinical interview. Psychological testing. Intelligence tests. Personality assessment. Neuropsychological testing.",
    href: "/wiki/clinical/assessment",
  },
  {
    id: "clinical/evidence-based-therapies",
    title: "Evidence-Based Psychotherapies",
    description: "Explore CBT, DBT, psychodynamic, and other therapeutic approaches.",
    domain: "clinical",
    domainTitle: "Clinical & Counseling Psychology",
    topic: "evidence-based-therapies",
    keywords: ["CBT", "DBT", "therapy", "psychotherapy", "treatment", "intervention"],
    content: "Cognitive-behavioral therapy. Dialectical behavior therapy. Psychodynamic therapy. ACT. IPT. EMDR.",
    href: "/wiki/clinical/evidence-based-therapies",
  },
  {
    id: "developmental/child-psychology",
    title: "Child Psychology",
    description: "Understand cognitive, social, and emotional development in childhood.",
    domain: "developmental",
    domainTitle: "Developmental Psychology",
    topic: "child-psychology",
    keywords: ["child", "development", "Piaget", "attachment", "cognitive development"],
    content: "Cognitive development. Social development. Emotional development. Piaget. Vygotsky. Attachment theory.",
    href: "/wiki/developmental/child-psychology",
  },
  {
    id: "cognitive/cognitive-psychology",
    title: "Cognitive Psychology",
    description: "Study memory, learning, attention, and problem-solving processes.",
    domain: "cognitive",
    domainTitle: "Cognitive & Affective Aspects",
    topic: "cognitive-psychology",
    keywords: ["memory", "attention", "learning", "thinking", "problem solving"],
    content: "Memory systems. Attention. Learning. Problem solving. Decision making. Language processing.",
    href: "/wiki/cognitive/cognitive-psychology",
  },
  {
    id: "social-personality/social-psychology",
    title: "Social Psychology",
    description: "Study group dynamics, prejudice, conformity, and social influence.",
    domain: "social-personality",
    domainTitle: "Social & Personality Psychology",
    topic: "social-psychology",
    keywords: ["social", "group", "conformity", "prejudice", "attitudes"],
    content: "Social influence. Conformity. Obedience. Attitudes. Prejudice. Group dynamics. Attribution.",
    href: "/wiki/social-personality/social-psychology",
  },
  {
    id: "applied/forensic-psychology",
    title: "Forensic Psychology",
    description: "Study criminal behavior and the psychology-legal system interface.",
    domain: "applied",
    domainTitle: "Applied Psychology",
    topic: "forensic-psychology",
    keywords: ["forensic", "criminal", "legal", "court", "crime"],
    content: "Criminal behavior. Legal psychology. Eyewitness testimony. Risk assessment. Competency evaluation.",
    href: "/wiki/applied/forensic-psychology",
  },
];

const fuseOptions = {
  keys: [
    { name: "title", weight: 0.4 },
    { name: "description", weight: 0.25 },
    { name: "keywords", weight: 0.2 },
    { name: "content", weight: 0.1 },
    { name: "domainTitle", weight: 0.05 },
  ],
  threshold: 0.3,
  includeScore: true,
  includeMatches: true,
};

const fuse = new Fuse(searchIndex, fuseOptions);

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";
  const limit = parseInt(searchParams.get("limit") || "10", 10);

  if (!query.trim()) {
    return NextResponse.json({ results: [], query: "" });
  }

  const results = fuse.search(query, { limit }).map((result) => ({
    id: result.item.id,
    title: result.item.title,
    description: result.item.description,
    domain: result.item.domain,
    domainTitle: result.item.domainTitle,
    topic: result.item.topic,
    href: result.item.href,
    score: result.score,
  }));

  return NextResponse.json({ results, query });
}
