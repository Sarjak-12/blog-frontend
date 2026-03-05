const LoadingSpinner = ({ label = "Loading..." }) => {
  return (
    <div className="flex min-h-[240px] items-center justify-center">
      <div className="flex items-center gap-3 rounded-full bg-white/90 px-5 py-3 shadow-card">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-ink border-t-transparent" />
        <span className="text-sm font-medium text-ink">{label}</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;