import { Indicator, Root } from "@radix-ui/react-progress";

const Pedal = ({ value }: { value: number }) => {
  return (
    <Root
      className="border border-white relative overflow-hidden bg-blackA6 rounded-md w-[15px] h-[80px]"
      style={{
        transform: "translateZ(0)",
      }}
      value={value}
    >
      <Indicator
        className="bg-white w-full h-full transition-transform ease-[cubic-bezier(0.65, 0, 0.35, 1)]"
        style={{ transform: `translateY(${100 - value}%)` }}
      />
    </Root>
  );
};

Pedal.displayName = "Pedal";

export default Pedal;
