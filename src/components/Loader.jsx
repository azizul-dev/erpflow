const Loader = ({ fullScreen = false }) => {
  return (
    <div
      className={`flex items-center justify-center ${
        fullScreen ? 'fixed inset-0 z-50 bg-background/80 backdrop-blur-sm' : 'py-12'
      }`}
    >
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent shadow-md"></div>
        <span className="text-sm font-medium text-muted-foreground animate-pulse">
          Loading...
        </span>
      </div>
    </div>
  );
};

export default Loader;
