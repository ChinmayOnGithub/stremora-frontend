import PropTypes from 'prop-types';

const FileUploadField = ({
  label,
  required,
  tooltip,
  preview,
  onFileChange,
  onRemove,
  isCircular = false,
  icon,
  helpText
}) => {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-foreground dark:text-gray-300 flex items-center">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
        {!required && <span className="ml-1 text-xs text-muted-foreground">(Optional)</span>}
        {tooltip && (
          <div className="relative ml-1 inline-block">
            <div className="hover-trigger">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5 text-muted-foreground/70">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM8.94 6.94a.75.75 0 11-1.061-1.061 3 3 0 112.871 5.026v.345a.75.75 0 01-1.5 0v-.5c0-.72.57-1.172 1.081-1.287A1.5 1.5 0 108.94 6.94zM10 15a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
              <div className="absolute -left-2 bottom-full mb-2 w-48 rounded-md bg-black/90 p-2 text-xs text-white shadow-lg hover-target dark:bg-gray-800 z-50">
                {tooltip}
                <div className="absolute -bottom-1 left-2 h-2 w-2 rotate-45 bg-black/90 dark:bg-gray-800"></div>
              </div>
            </div>
          </div>
        )}
      </label>
      <div className="relative">
        <div className={`h-16 w-full rounded-lg border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center ${preview
          ? 'border-primary/50 bg-primary/5 dark:border-amber-500/50 dark:bg-amber-500/5'
          : 'border-muted-foreground/20 hover:border-muted-foreground/30 dark:border-gray-600'
          }`}>
          {preview ? (
            <div className={`relative h-full w-full ${isCircular ? 'flex items-center justify-center' : ''}`}>
              <img
                src={preview}
                alt={`${label} preview`}
                className={isCircular
                  ? "h-16 w-16 rounded-full object-cover border-2 border-white dark:border-gray-700"
                  : "h-full w-full rounded-lg object-cover"
                }
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                }}
                className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 shadow-md text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3 w-3">
                  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                </svg>
              </button>
            </div>
          ) : (
            <>
              {icon}
              <p className="mt-2 text-xs text-muted-foreground">Click to upload</p>
            </>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={onFileChange}
            required={required}
            className="absolute inset-0 cursor-pointer opacity-0 z-10"
          />
        </div>
        {helpText && (
          <p className="mt-1 text-xs text-muted-foreground dark:text-gray-400">
            {helpText}
          </p>
        )}
      </div>
    </div>
  );
};

FileUploadField.propTypes = {
  label: PropTypes.string.isRequired,
  required: PropTypes.bool,
  tooltip: PropTypes.string,
  preview: PropTypes.string,
  onFileChange: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  isCircular: PropTypes.bool,
  icon: PropTypes.node,
  helpText: PropTypes.string
};

export default FileUploadField; 