import { FAQ as faqData } from "@/data";

import Layout from "@/layouts/AppLayout";
import PageHeader from "@/components/molecules/PageHeader";

const FAQ = () => (
  <Layout>
    <PageHeader 
      breadcrumbText="常見問題"
      titleEn="FAQ"
      titleCh="常見問題"
    />
    <div className="max-w-3xl px-5 py-20 mx-auto md:px-8">
      <div className="w-full space-y-4 rounded-none join join-vertical">
        {faqData.map(({ question, answer }) => (
          <div
            key={question}
            className="border-b border-dashed collapse border-primary/80 collapse-arrow join-item"
          >
            <input type="radio" name="faq" />
            <h3 className="px-0 text-base collapse-title">{question}</h3>
            <div className="px-0 collapse-content">
              <p>{answer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </Layout>
);

export default FAQ;
