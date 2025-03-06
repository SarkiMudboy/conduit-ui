<script setup lang="ts">
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bell, Grid, Search } from "lucide-vue-next"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import ThemeToggle from '@/components/theme/ThemeToggle.vue'
import DrivesWindow from "@/components/Drives/DrivesWindow.vue"
import Notifications from "@/components/Notifications.vue"
</script>

<template>
  <div class="flex-1">
    <header class="flex items-center justify-between border-b px-6 py-4">
      <div class="w-96">
        <div class="relative">
          <Search class="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input type="search" placeholder="Search files..." class="pl-9" />
        </div>
      </div>
      <div class="flex items-center gap-4">
        <Button variant="ghost" size="icon">
          <Grid class="h-4 w-4" />
        </Button>
        <Notifications />
        <ThemeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button variant="secondary" size="icon" class="rounded-full">
              <CircleUser class="h-5 w-5" />
              <span class="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
    <DrivesWindow />
  </div>
</template>
