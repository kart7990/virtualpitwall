import tinycolor from "tinycolor2";
import { number } from "zod";

export const getCarClassName = (classId: number, className: string): string => {
  switch (classId) {
    case 2523:
      return "LMP2 Class"; // Dallara P217 LMP2
    case 2708:
      return "GT3 Class"; // GT3 Class
    case 3189:
      return "TCR Class"; // Touring Car
    case 4008:
      return "GT4 Class"; // IMPCGT4 Class
    case 4011:
      return "GTD Class"; // GT3 Class
    case 4018:
      return "LMP3 Class"; // Ligier JS P320
    case 4029:
      return "GPT Class"; // GTP
    default:
      return className;
  }
};

export const parseIRating = (total: number, count: number): string => {
  return Math.round(total / count).toString();
};

export const parseCarClassColor = (classColor: string): string => {
  const res = tinycolor(classColor);
  res.setAlpha(0.1);
  return res.toHex8String();
};
