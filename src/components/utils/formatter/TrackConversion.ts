export const parseTrackId = (oldId: number): string => {
  switch (oldId) {
    case 350:
      return "charlotte_road";
    case 434:
      return "watkins_glen_boot";
    default:
      return oldId.toString();
  }
};
