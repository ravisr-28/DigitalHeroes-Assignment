

export function Card({ children, className = '', glow = false, ...props }) {
  return (
    <div 
      className={`
        bg-[#111827] border border-white/10 rounded-2xl p-4
        ${glow ? 'shadow-lg border-green-500/30' : 'shadow-2xl'}
        ${className}
      `} 
      {...props}
    >
      {children}
    </div>
  );
}


export function Badge({ children, variant = 'default', className = '' }) {
  const colors = {
    default: 'bg-white/5 text-gray-400 border-white/10',
    green: 'bg-green-500/10 text-green-400 border-green-500/20',
    red: 'bg-red-500/10 text-red-400 border-red-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  };
  
  return (
    <span className={`
      inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full border
      ${colors[variant]} ${className}
    `}>
      {children}
    </span>
  );
}


export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  loading = false, 
  className = '', 
  as: Component = 'button',
  ...props 
}) {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold transition-all rounded-xl disabled:opacity-50 disabled:cursor-not-allowed border-none cursor-pointer';
  
  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  };

  const variants = {
    primary: 'bg-green-500 text-[#0b1120] hover:bg-green-400',
    secondary: 'bg-white/10 text-white hover:bg-white/20',
    danger: 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border-red-500/30',
    ghost: 'bg-transparent text-gray-400 hover:text-white',
  };

  return (
    <Component 
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} 
      disabled={loading}
      {...props}
    >
      {loading ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> : children}
    </Component>
  );
}


export function Spinner() {
  return (
    <div className="flex flex-col items-center justify-center p-8 gap-3">
      <div className="w-10 h-10 border-4 border-green-500/20 border-t-green-500 rounded-full animate-spin" />
      <p className="text-xs text-gray-400 font-medium tracking-widest uppercase">Loading...</p>
    </div>
  );
}


export function EmptyState({ icon: Icon, text, description }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center mb-4 border border-white/10">
        {Icon && <Icon size={32} className="text-gray-500 opacity-50" />}
      </div>
      <h3 className="text-sm font-bold text-gray-300">{text}</h3>
      {description && <p className="text-xs text-gray-500 mt-1 max-w-[200px]">{description}</p>}
    </div>
  );
}


export function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#0b1120]/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[#111827] border border-white/10 rounded-3xl shadow-2xl overflow-hidden z-10">
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-xl transition-colors border-none bg-transparent cursor-pointer text-gray-400 hover:text-white"
          >
            Close
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
