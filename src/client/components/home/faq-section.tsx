import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/client/components/ui/accordion";
import { SectionHeader } from "@/client/components/shared/section-header";
import { faqs } from "@/client/content/marketing";

export function FAQSection() {
  return (
    <section className="section-padding bg-muted/30">
      <div className="container mx-auto max-w-3xl px-4 lg:px-8">
        <SectionHeader
          badge="FAQ"
          title="Frequently asked questions"
          description="Everything you need to know about Project Ace."
        />
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq) => (
            <AccordionItem key={faq.id} value={faq.id}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
