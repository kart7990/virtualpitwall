"use client"
import Image from 'next/image'
import { SiteHeader } from '@/components/core/site-header'
import { SiteFooter } from '@/components/core/site-footer'
import { Button } from '@/components/core/ui/button'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col">
      <SiteHeader isPublic={true} />
      <div className="flex-1 border-b">
        <main className="flex flex-col items-center justify-between p-24">
          <div className="grid grid-cols-2 gap-4 max-w-screen-lg">
            <div className="">
              <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                The realtime web-based race dashboard for iRacing
              </h2>
              <p>
                The virtual pitbox platform displays all relevant race event data directly to a web-based dashboard.
                Designed for collaborative racing events where a race engineer can give your team the edge over the competition.
                Simply give the dashboard link to anyone you wish to share with, all they need is a modern web browser!
              </p>
              <div>
                <Link href={'/pitwall/home'}><Button className='my-6'>Get Started</Button></Link></div>
            </div>
            <div><img src="generic_monitor_dashboard.png" className="img-fluid" alt="" /></div>
            <div className="col-span-2">
              <div id="alert-additional-content-4" className="p-4 mb-4 text-yellow-800 border border-yellow-300 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300 dark:border-yellow-800" role="alert">
                <div className="flex items-center">
                  <svg className="flex-shrink-0 w-4 h-4 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                  </svg>
                  <span className="sr-only">Info</span>
                  <h3 className="text-lg font-medium">This is a warning alert</h3>
                </div>
                <div className="mt-2 mb-4 text-sm">
                  The virtual pitbox platform is currently in beta. We are excited to share our progress with the community, but do not expect a bug-free or polished experience.
                  There will be issues and some features may not work entirely. Please report any issues or feature requests so we can build something awesome together.
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <SiteFooter />
    </div>
  )
}
