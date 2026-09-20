export default function GermanMitraLogo({
  showText = true,
  size = 52,
  className = '',
}) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Logo Icon */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="German Mitra logo"
      >
        {/* Left Person - Blue */}
        <circle
          cx="28"
          cy="18"
          r="12"
          fill="#003B73"
        />

        <path
          d="M15 38C15 31.4 20.4 26 27 26H29C35.6 26 41 31.4 41 38V78H15V38Z"
          fill="#003B73"
        />

        {/* Right Person - Orange */}
        <circle
          cx="72"
          cy="18"
          r="12"
          fill="#F59E0B"
        />

        <path
          d="M59 38C59 31.4 64.4 26 71 26H73C79.6 26 85 31.4 85 38V78H59V38Z"
          fill="#F59E0B"
        />

        {/* Blue diagonal */}
        <path
          d="M27 30L50 50L73 30L82 39L50 68L18 39L27 30Z"
          fill="#003B73"
        />

        {/* Orange diagonal */}
        <path
          d="M73 30L50 50L27 30L18 39L50 68L82 39L73 30Z"
          fill="#F59E0B"
        />

        {/* Center diamond */}
        <path
          d="M50 29L70 49L50 69L30 49L50 29Z"
          fill="white"
        />

        <path
          d="M50 36L63 49L50 62L37 49L50 36Z"
          fill="#003B73"
        />

        {/* Center orange section */}
        <path
          d="M50 36L63 49L50 62L50 50L56 44L50 38V36Z"
          fill="#F59E0B"
        />
      </svg>

      {/* Brand Name */}
      {showText && (
        <div className="whitespace-nowrap text-2xl font-extrabold tracking-tight">
          <span style={{ color: '#003B73' }}>German</span>
          <span style={{ color: '#F59E0B' }}> Mitra</span>
        </div>
      )}
    </div>
  )
}