import { FAQ as faqData } from "@/data";

import Layout from "@/layouts/AppLayout";
import Breadcrumb from "@/components/molecules/Breadcrumb";

const FAQ = () => (
  <Layout>
    <div className="px-5 pt-4 md:px-8 min-h-40 bg-primary">
      <Breadcrumb text="常見問題" textColor="text-secondary" />
      <h2 className="text-center text-secondary">
        <span className="block text-lg font-light">FAQ</span>
        <span className="text-2xl">常見問題</span>
      </h2>
    </div>
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
              <p className="text-sm">{answer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </Layout>
);

export default FAQ;
