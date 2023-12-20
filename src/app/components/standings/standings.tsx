'use client'
import { StatusOnlineIcon } from "@heroicons/react/outline";
import {
    Badge,
    Card,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeaderCell,
    TableRow,
    Text,
    Title,
} from "@tremor/react";

import {
    useSelector,
    selectLiveTimimg,
} from '@/lib/redux'

export const Standings = () => {
    const standings = useSelector(selectLiveTimimg)
    console.log('STANDING REDUX', standings)
    return (
        <Card className="h-full overflow-y-scroll">
            <Title>Standings</Title>
            <Table className="mt-5">
                <TableHead>
                    <TableRow>
                        <TableHeaderCell>Name</TableHeaderCell>
                        <TableHeaderCell>Position</TableHeaderCell>
                        <TableHeaderCell>Department</TableHeaderCell>
                        <TableHeaderCell>Status</TableHeaderCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {standings.map((item) => (
                        <TableRow>
                            <TableCell>{JSON.stringify(item)}</TableCell>
                            <TableCell>
                                <Text></Text>
                            </TableCell>
                            <TableCell>
                                <Text></Text>
                            </TableCell>
                            <TableCell>
                                <Badge color="emerald" icon={StatusOnlineIcon}>
                                </Badge>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>

    )
}