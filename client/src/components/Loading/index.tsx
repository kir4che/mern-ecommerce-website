import AppLayout from "@/layouts/AppLayout";

const Loading = () => (
  <AppLayout>
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-secondary">
      <svg
        className="w-8 h-8 mr-3 text-primary animate-spin"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="12" r="10" stroke="#061222" strokeWidth="4" />
        <path
          fill="#f4f4f5"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      <span className="text-3xl font-bold text-primary">Loading...</span>
    </div>
  </AppLayout>
);

export default Loading;
