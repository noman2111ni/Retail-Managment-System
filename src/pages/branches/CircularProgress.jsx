const CircularProgress = ({ progress, size = 50, strokeWidth = 6, color = 'purple' }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg width={size} height={size} className="transform rotate-360">
      <circle
        stroke="#e5e7eb" // gray-200
        fill="transparent"
        strokeWidth={strokeWidth}
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />
      <circle
        stroke={color === 'purple' ? '#7c3aed' : color} // Tailwind purple-600
        fill="transparent"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        r={radius}
        cx={size / 2}
        cy={size / 2}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
      />
      <text
        x="50%"
        y="50%"
        
        textAnchor="middle"
        dominantBaseline="middle"
        className="text-sm font-medium fill-gray-800"
      >
        {progress}%
      </text>
    </svg>
  );
};
export default CircularProgress;