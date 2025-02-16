<script setup lang="ts">
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bell, Grid, Plus, Search } from "lucide-vue-next"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import ThemeToggle from '@/components/theme/ThemeToggle.vue'
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
        <Button variant="ghost" size="icon">
          <Bell class="h-4 w-4" />
        </Button>
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

    <div class="p-6">
      <div class="mb-6 flex items-center gap-4">
        <Button class="gap-2">
          <Plus class="h-4 w-4" />
          Create
        </Button>
        <Button variant="outline" class="gap-2">
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Upload
        </Button>
        <Button variant="outline" class="gap-2">
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Create folder
        </Button>
        <Button variant="outline" class="gap-2">
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M12 18.5a6.5 6.5 0 100-13 6.5 6.5 0 000 13zM12 14a2 2 0 100-4 2 2 0 000 4z" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Record
        </Button>
      </div>

    </div>
  </div>
</template>
