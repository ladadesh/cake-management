const Loader = () => {
  return (
    <div
      aria-hidden
      className="absolute inset-0 flex items-center justify-center rounded-xl"
      style={{ backgroundColor: "rgba(255,255,255,0.75)" }}
    >
      <div className="flex flex-col items-center gap-3">
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <g>
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="#ec4899"
              strokeWidth="2"
              strokeOpacity="0.2"
            />
            <path fill="#ec4899">
              <animateTransform
                attributeType="xml"
                attributeName="transform"
                type="rotate"
                from="0 12 12"
                to="360 12 12"
                dur="1s"
                repeatCount="indefinite"
              />
            </path>
          </g>
        </svg>
        <div className="text-pink-600 font-semibold">Loading...</div>
      </div>
    </div>
  );
};
export default Loader;
