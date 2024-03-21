const SteeringWheel = ({ angle }: { angle: number }) => {
  return (
    <svg
      width="80"
      height="80"
      viewBox="0 0 80 80"
      style={{ transform: `rotate(${angle * -1}rad)` }}
    >
      <circle
        cx="40"
        cy="40"
        r="30"
        stroke="white"
        strokeWidth="5"
        fill="none"
      />
      <circle cx="40" cy="10" r="8" fill="rgb(100 116 139)" />
    </svg>
  );
};

export default SteeringWheel;
