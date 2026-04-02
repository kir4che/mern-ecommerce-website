import Accordion from "@/components/molecules/Accordion";
import PageHeader from "@/components/molecules/PageHeader";
import { FAQ as faqData } from "@/constants/data";

const FAQ = () => (
  <>
    <PageHeader breadcrumbText="常見問題" titleEn="FAQ" titleCh="常見問題" />
    <div className="max-w-3xl w-full px-5 py-20 mx-auto md:px-8">
      <div className="w-full space-y-2">
        {faqData.map(({ question, answer }) => (
          <Accordion
            key={question}
            title={question}
            name="faq"
            defaultOpen={false}
          >
            {answer}
          </Accordion>
        ))}
      </div>
    </div>
  </>
);

export default FAQ;
