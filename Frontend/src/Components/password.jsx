export const hide = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Hide password"
      role="img"
    >
      <path
        d="M3 3L21 21M10.584 10.587A2 2 0 0013.414 13.414M9.88 5.08A10.94 10.94 0 0112 4.875c5.523 0 9 7.125 9 7.125a16.474 16.474 0 01-2.08 2.916M6.228 6.228C3.62 8.1 3 12 3 12s3.477 7.125 9 7.125a9.98 9.98 0 004.228-.912M3 3L21 21"
        stroke="#6173ff"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const show = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Show password"
      role="img"
    >
      <path
        d="M2.458 12C3.732 7.943 7.523 5 12 5s8.268 2.943 9.542 7C20.268 16.057 16.477 19 12 19s-8.268-2.943-9.542-7Z"
        stroke="#6173ff"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="12"
        cy="12"
        r="3"
        stroke="#6173ff"
        strokeWidth="1.8"
      />
    </svg>
  );
};
