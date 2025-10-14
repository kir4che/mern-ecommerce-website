const Loading: React.FC = () => (
  <div className="flex flex-col items-center justify-center px-5 md:px-0 py-60">
    <p
      data-testid="loading-container"
      className="flex flex-col items-center text-2xl font-semibold leading-normal text-center gap-x-4 sm:text-4xl sm:flex-row text-primary/75"
    >
      請稍候，我們正在加載中。
      <span
        data-testid="loading-animation"
        className="loading loading-dots loading-lg"
      ></span>
    </p>
  </div>
);

export default Loading;
