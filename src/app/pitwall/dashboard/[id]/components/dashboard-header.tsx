import { Settings } from "@/components/core/settings";
import { Separator } from "@/components/core/ui/separator";

export function DashboardHeader({
  left,
  right,
}: {
  left: React.ReactNode;
  right: React.ReactNode;
}) {
  return (
    <>
      <div className="flow-root">
        <div className="float-left ml-2 mt-2">
          <div className="flex space-x-6">{left}</div>
        </div>
        <div className="float-right ml-2 mt-2 space-x-6">
          <div className="flex flex-wrap gap-4 p-3">
            {right}
            <Separator orientation="vertical" />
            <div className="mt-1">
              <Settings />
            </div>
          </div>
        </div>
      </div>
      <Separator />
    </>
  );
}
