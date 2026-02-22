const Card = ({ children, className = '', hover = true }) => {
  return (
    <div 
      className={`
        bg-white/40 backdrop-blur-xl border border-white/50 
        shadow-lg rounded-2xl p-5 sm:p-7 lg:p-8
        transition-all duration-300
        ${hover ? 'hover:shadow-2xl hover:border-white/70 hover:bg-white/50 hover:backdrop-blur-2xl' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;
