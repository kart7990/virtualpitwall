import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/core/ui/card"

export function DashboardCard({ children, title }: { children: React.ReactNode, title: string }) {
    return (
        <Card className="h-full">
            <CardHeader className="border-b p-3 drag-handle">
                <CardTitle className="m-0">{title}</CardTitle>
            </CardHeader>
            <CardContent className="p-0 w-full h-full">
                {children}
            </CardContent>
        </Card>
    )
}