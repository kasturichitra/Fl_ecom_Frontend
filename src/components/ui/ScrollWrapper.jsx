const ScrollWrapper = ({ children, className = "", maxHeight = "500px" }) => {
  return (
    <div
      className={`overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 p-2 rounded-lg ${className}`}
      style={{ maxHeight }}
    >
      {children}
    </div>
  );
};

export default ScrollWrapper;
