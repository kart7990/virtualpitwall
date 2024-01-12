import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/core/ui/card";

export function DashboardCard({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <Card className="h-full overflow-hidden">
      <CardHeader className="drag-handle border-b p-3">
        <CardTitle className="m-0">{title}</CardTitle>
      </CardHeader>
      <CardContent className="h-full w-full p-0">{children}</CardContent>
    </Card>
  );
}
