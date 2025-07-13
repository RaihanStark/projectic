# Project Dashboard Mockup

This is a visual mockup of how project features would integrate into the current dashboard.

## Current Dashboard Layout
- **Sidebar**: Logo, New Task button, "All Tasks" link, Labels section
- **Main Area**: List of tasks with checkboxes, stars, titles, descriptions, status badges
- **Task Items**: Full-width cards with hover actions

## Proposed Project Integration

### 1. Updated Sidebar Layout
```
┌─────────────────────────────┐
│ 📁 Projectic                │
├─────────────────────────────┤
│ [+ New Task]                │
├─────────────────────────────┤
│ 🏠 All Tasks           (24) │
│ 📊 My Projects         (3)  │
├─────────────────────────────┤
│ PROJECTS                    │
│ 🔵 Work Website        (8)  │
│ 🟢 Personal           (12)  │
│ 🟡 Mobile App          (4)  │
│ + Add Project               │
├─────────────────────────────┤
│ LABELS                      │
│ 🔴 Important                │
│ 🟢 Updates                  │
└─────────────────────────────┘
```

### 2. Main Dashboard Views

#### A. All Tasks View (Current + Enhanced)
```
┌─────────────────────────────────────────────────────────────────┐
│ All Tasks                                           [Filter] [⚙️] │
├─────────────────────────────────────────────────────────────────┤
│ ☐ ⭐ Fix login bug                                              │
│     🔵 Work Website • Bug fix needed                           │
│     [in-progress] [high] • Due: Dec 25                         │
├─────────────────────────────────────────────────────────────────┤
│ ☐ ⭐ Plan vacation                                              │
│     🟢 Personal • Research destinations                        │
│     [todo] [medium] • Due: Jan 15                              │
├─────────────────────────────────────────────────────────────────┤
│ ☐ ⭐ Design mobile mockups                                      │
│     🟡 Mobile App • Create initial wireframes                  │
│     [todo] [high] • Due: Dec 30                                │
└─────────────────────────────────────────────────────────────────┘
```

#### B. Project Overview View (New)
```
┌─────────────────────────────────────────────────────────────────┐
│ My Projects                                         [+ New]     │
├─────────────────────────────────────────────────────────────────┤
│ 🔵 Work Website                                    [⚙️] [⭐]     │
│     ████████░░ 8/10 tasks completed                             │
│     2 overdue • 3 due today • Updated 2 hours ago              │
├─────────────────────────────────────────────────────────────────┤
│ 🟢 Personal                                        [⚙️]         │
│     ██░░░░░░░░ 2/8 tasks completed                              │
│     1 due today • Updated yesterday                             │
├─────────────────────────────────────────────────────────────────┤
│ 🟡 Mobile App                                      [⚙️]         │
│     ░░░░░░░░░░ 0/4 tasks completed                              │
│     Just started • Created 3 days ago                          │
└─────────────────────────────────────────────────────────────────┘
```

#### C. Individual Project View (New)
```
┌─────────────────────────────────────────────────────────────────┐
│ ← 🔵 Work Website                              [Edit] [Archive]  │
│ Website redesign and development project                        │
│ ████████░░ 8/10 completed • 2 overdue • 3 due today           │
├─────────────────────────────────────────────────────────────────┤
│ ☐ ⭐ Fix login bug                                              │
│     Bug fix needed for authentication                           │
│     [in-progress] [high] • Due: Dec 25                         │
├─────────────────────────────────────────────────────────────────┤
│ ☑️ ⭐ Research competitors                                       │
│     Analyze competitor websites and features                    │
│     [done] [medium] • Completed: Dec 20                        │
├─────────────────────────────────────────────────────────────────┤
│ ☐ Create wireframes                                            │
│     Design initial page layouts                                │
│     [todo] [high] • Due: Dec 28                                │
└─────────────────────────────────────────────────────────────────┘
```

### 3. Enhanced Task Creation Modal
```
┌─────────────────────────────────────────┐
│ Create New Task                    [×]  │
├─────────────────────────────────────────┤
│ Title: [Fix navigation menu bug____]    │
│                                         │
│ Description:                            │
│ [The mobile menu doesn't close_____]    │
│ [properly on smaller screens______]    │
│                                         │
│ Project: [🔵 Work Website ▼]            │
│                                         │
│ Status: [Todo ▼]                        │
│ Priority: [High ▼]                      │
│ Due Date: [Dec 25, 2024 ▼]             │
│                                         │
│ Labels: [🔴 Bug] [+ Add Label]          │
│                                         │
│                    [Cancel] [Create]    │
└─────────────────────────────────────────┘
```

### 4. Project Management Features

#### Create New Project Modal
```
┌─────────────────────────────────────────┐
│ Create New Project                 [×]  │
├─────────────────────────────────────────┤
│ Name: [Mobile App Redesign_________]    │
│                                         │
│ Description:                            │
│ [Complete redesign of mobile app___]    │
│ [with modern UI and better UX_____]    │
│                                         │
│ Color: 🔵 🟢 🟡 🟠 🔴 🟣              │
│                                         │
│                    [Cancel] [Create]    │
└─────────────────────────────────────────┘
```

#### Project Settings Menu
```
┌─────────────────────────┐
│ Edit Project            │
│ Duplicate Project       │
│ ─────────────────────── │
│ Archive Project         │
│ Delete Project          │
└─────────────────────────┘
```

## Key UI Changes Summary

### What Stays the Same:
- Overall layout structure (sidebar + main area)
- Task list design and interactions
- Task creation flow (enhanced with project selector)
- Current color scheme and styling

### What Gets Added:
- **Projects section** in sidebar with colored project indicators
- **Project selector** in task creation modal
- **Project overview page** showing all projects with progress
- **Individual project pages** showing filtered tasks
- **Project badges** on tasks in "All Tasks" view
- **Project management** (create, edit, archive projects)

### Navigation Flow:
1. **All Tasks** → See all tasks across projects with project badges
2. **My Projects** → Overview of all projects with stats
3. **Click Project** → View tasks within specific project
4. **Sidebar Projects** → Quick access to individual projects

This integration maintains the current clean design while adding powerful project organization without overwhelming the interface.
