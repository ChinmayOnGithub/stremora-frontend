const Container = ({ children, className = "" }) => {
  return (
    <div className={`relative flex-1 container mx-auto p-4 sm:p-6 bg-gray-200 dark:bg-black w-full sm:w-[92%] lg:w-[98%] max-w-[96%] min-h-full rounded-md ${className}`}>
      {children}
    </div>
  );
};

export default Container;