import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "How does AI Job Copilot tailor my application?",
    a: "Paste any job description and we compare it against your profile and resume. The AI identifies the keywords, skills, and themes the role is looking for, then drafts a cover letter, cold email, and CV rewrite that speak directly to that posting.",
  },
  {
    q: "Which AI models do you use?",
    a: "We use industry-leading large language models, including Opus 4.8, selected per task for the best balance of quality and speed. You always get human-sounding, persuasive output — never generic boilerplate.",
  },
  {
    q: "Is my data private?",
    a: "Yes. Your resume and job descriptions are used only to generate your results. We never sell your data or share it with recruiters, and you can delete your information at any time.",
  },
  {
    q: "Can I edit what the AI generates?",
    a: "Absolutely. Everything is fully editable — treat the output as a strong first draft. Tweak the tone, swap details, and make it yours before you send.",
  },
  {
    q: "Do I need to pay to get started?",
    a: "No. You can create a free account and generate your first tailored applications without entering a card. Upgrade only when you need higher volume.",
  },
];

export default function Faq() {
  return (
    <section className="py-20 sm:py-28 px-4 bg-white dark:bg-gray-950">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400 mb-3">
            FAQ
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
            Questions, answered
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-base leading-relaxed">
            Everything you need to know before you get started.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((item, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="border-gray-100 dark:border-gray-800"
            >
              <AccordionTrigger className="text-left text-base font-medium text-gray-900 dark:text-white hover:no-underline">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
