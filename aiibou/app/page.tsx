'use client'
import { AppSidebar } from "@/components/app-sidebar"
import { TaskVelocityChart } from "@/components/ui/task-velocity-chart"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

import { PomodoroTimer } from "@/components/ui/pomodoro-timer"
import { TaskInputWithList } from "@/components/ui/task-input-list"
import { AutoPrioritizeButton } from "@/components/ui/auto-prioritize-button"


export default function Page() {


  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards />
                <div className="px-4 lg:px-6 flex flex-col gap-4">
                <PomodoroTimer/>
                <AutoPrioritizeButton />
              <TaskInputWithList/>
              </div>
              <div className="px-4 lg:px-6">
                <TaskVelocityChart />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
