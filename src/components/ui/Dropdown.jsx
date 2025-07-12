import { useState, useRef, useEffect } from 'react';
import { FaChevronDown } from 'react-icons/fa';

export default function Dropdown({ options, value, onChange, disabled, placeholder, className = "" }) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef(null);
  const menuRef = useRef(null);
  const [highlighted, setHighlighted] = useState(-1);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;
    function handleKeyDown(e) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlighted((h) => (h + 1) % options.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlighted((h) => (h - 1 + options.length) % options.length);
      } else if (e.key === 'Enter' && highlighted >= 0) {
        onChange(options[highlighted].value);
        setOpen(false);
      } else if (e.key === 'Escape') {
        setOpen(false);
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, highlighted, options, onChange]);

  useEffect(() => {
    if (open) {
      setHighlighted(options.findIndex(opt => opt.value === value));
    }
  }, [open, value, options]);

  const selectedLabel = options.find(opt => opt.value === value)?.label || placeholder || 'Select';

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        ref={buttonRef}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls="dropdown-listbox"
        disabled={disabled}
        className={`h-12 w-full flex items-center justify-between rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 px-4 py-2 text-base text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600 transition shadow-sm ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
        onClick={() => setOpen((o) => !o)}
        tabIndex={0}
      >
        <span className={value ? '' : 'text-gray-400 dark:text-gray-500'}>{selectedLabel}</span>
        <FaChevronDown className={`ml-2 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <ul
          ref={menuRef}
          id="dropdown-listbox"
          role="listbox"
          tabIndex={-1}
          className="absolute z-20 mt-2 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg py-1 max-h-60 overflow-auto animate-dropdown-fade-scale"
        >
          {options.map((opt, idx) => (
            <li
              key={opt.value}
              role="option"
              aria-selected={value === opt.value}
              tabIndex={0}
              className={`px-4 py-2 text-base cursor-pointer select-none transition-colors
                ${value === opt.value ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold' :
                  highlighted === idx ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white' :
                  'text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              onClick={() => { onChange(opt.value); setOpen(false); }}
              onMouseEnter={() => setHighlighted(idx)}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onChange(opt.value); setOpen(false);
                }
              }}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
      {/* Animation styles */}
      <style>{`
        .animate-dropdown-fade-scale {
          animation: dropdownFadeScale 0.18s cubic-bezier(.4,0,.2,1);
        }
        @keyframes dropdownFadeScale {
          from { opacity: 0; transform: scale(0.98) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
} 