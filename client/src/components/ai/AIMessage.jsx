function AIMessage({ children }) {
  return (
    <div className="max-w-2xl">
      <p className="text-[15px] leading-7 text-[var(--color-text-primary)]">
        {children}
      </p>
    </div>
  );
}

export default AIMessage;
