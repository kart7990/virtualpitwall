import * as RadixTabs from "@radix-ui/react-tabs";

export interface TabProps {
  value: string;
  content: React.ReactNode;
}

const Tabs = ({
  defaultTab,
  tabs,
}: {
  defaultTab: string;
  tabs: TabProps[];
}) => (
  <RadixTabs.Root className="flex flex-cols-2 p-1" defaultValue={defaultTab}>
    <RadixTabs.List className="flex flex-col">
      {tabs.map((tab, idx) => (
        <RadixTabs.Trigger
          className="shadow-sm hover:bg-accent hover:text-accent-foreground text-left p-2 leading-none select-none text-slate-500 hover:text-white data-[state=active]:text-white data-[state=active]:shadow-[inset_-1px_0_0_0,1px_0_0_0] data-[state=active]:shadow-current data-[state=active]:bg-accent outline-none cursor-default"
          value={tab.value}
          key={idx}
        >
          {tab.value}
        </RadixTabs.Trigger>
      ))}
    </RadixTabs.List>
    {tabs.map((tab, idx) => (
      <RadixTabs.Content
        className="grow outline-none focus:shadow-[0_0_0_2px] focus:shadow-black"
        value={tab.value}
        key={idx}
      >
        {tab.content}
      </RadixTabs.Content>
    ))}
  </RadixTabs.Root>
);

export default Tabs;
