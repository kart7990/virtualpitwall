import tinycolor from "tinycolor2";
import { number } from "zod";

export const getCarClassName = (classId: number, className: string): string => {
  switch (classId) {
    case 2523:
      return "LMP2 Class";
    case 3189:
      return "TCR Class";
    case 4008:
      return "GT4 Class";
    case 4011:
      return "GTD Class";
    case 4018:
      return "LMP3 Class";
    case 4029:
      return "GPT Class";
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
