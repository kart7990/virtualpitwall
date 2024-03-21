import * as RadixPopover from "@radix-ui/react-popover";
import { ReactElement } from "react";
import { Button } from "./button";

const Popover = ({
  title,
  content,
}: {
  title: string;
  content: ReactElement;
}) => (
  <RadixPopover.Root>
    <RadixPopover.Trigger asChild>
      <Button variant="outline">{title}</Button>
    </RadixPopover.Trigger>
    <RadixPopover.Portal>
      <RadixPopover.Content
        className="text-sm rounded-lg p-5 w-[400px] bg-card shadow-[0_10px_38px_-10px_hsla(206,22%,7%,.35),0_10px_20px_-15px_hsla(206,22%,7%,.2)] will-change-[transform,opacity] data-[state=open]:data-[side=top]:animate-slideDownAndFade data-[state=open]:data-[side=right]:animate-slideLeftAndFade data-[state=open]:data-[side=bottom]:animate-slideUpAndFade data-[state=open]:data-[side=left]:animate-slideRightAndFade"
        sideOffset={5}
      >
        {content}
        {/* <RadixPopover.Close
          className="rounded-full h-[15px] w-[15px] inline-flex items-center justify-center text-violet11 absolute top-[5px] right-[5px] hover:bg-violet4 focus:shadow-[0_0_0_2px] focus:shadow-violet7 outline-none cursor-default"
          aria-label="Close"
        >
          <Cross2Icon />
        </RadixPopover.Close> */}
        <RadixPopover.Arrow className="bg-card" />
      </RadixPopover.Content>
    </RadixPopover.Portal>
  </RadixPopover.Root>
);

export default Popover;
