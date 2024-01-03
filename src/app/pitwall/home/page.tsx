"use client"
import axios from 'axios'
import { API_V1_URL } from "@/config/urls"
import { Button } from "@/components/core/ui/button"

export default function Home() {
    const authenticatedPing = async () => {
        console.log(await axios.get(`${API_V1_URL}/ping`))
    }

    return (
        <div>
            <h2>Pit Wall Home</h2>
            <Button onClick={() => authenticatedPing()}>Authenticated Ping</Button>
        </div>
    )
}
