const Container = ({ children, className = "" }) => {
  return (
    <div className={`relative flex-1 container mx-auto p-4 sm:p-6 bg-gray-200 dark:bg-black min-w-[300px] w-full sm:w-[92%] lg:w-[98%] max-w-[96%] min-h-full ${className} transition-all duration-500 ease-in-out`}>
      {children}
    </div>
  );
};


export default Container;