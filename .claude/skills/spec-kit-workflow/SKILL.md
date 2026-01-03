---
name: spec-kit-workflow
description: Spec-Kit Plus workflow for Hackathon II Todo App. Use when implementing any feature - follow SDD-RI (Spec-Driven Development with Reusable Intelligence). Workflow: Specify → Plan → Tasks → Implement. AGENTS.md provides rules, Spec-Kit manages artifacts, Claude Code executes.
---

# Spec-Kit Plus Workflow

## The Golden Rule

**NO CODE WITHOUT SPEC.** Every line of code must map back to a task in `speckit.tasks`.

## Workflow

### 1. Specify (WHAT - Requirements)

**Purpose:** Define what to build with user journeys, requirements, acceptance criteria.

**Commands:**
```bash
sp.specify          # Create or update speckit.specify
sp.clarify          # Ask up to 5 targeted questions about underspecified areas
```

**File:** `speckit.specify` (or `phase-X/docs/spec.md`)
Contains: User journeys, requirements, acceptance criteria, domain rules, business constraints.

### 2. Plan (HOW - Architecture)

**Purpose:** Define technical approach based on Specify.

**Command:**
```bash
sp.plan             # Generate speckit.plan from speckit.specify
```

**File:** `speckit.plan` (or `phase-X/docs/plan.md`)
Contains: Component breakdown, APIs & schemas, service boundaries, system responsibilities.

### 3. Tasks (Breakdown - Atomic Work Units)

**Purpose:** Break plan into actionable, testable tasks.

**Command:**
```bash
sp.tasks            # Generate speckit.tasks from speckit.specify and speckit.plan
```

**File:** `speckit.tasks` (or `phase-X/docs/tasks.md`)
Each task contains: Task ID, description, preconditions, expected outputs, artifacts to modify.

### 4. Implement (Code - Execute Tasks)

**Purpose:** Write code based on tasks.

**Command:**
```bash
sp.implement         # Execute all tasks in speckit.tasks
sp.taskstoissues    # Convert tasks to GitHub issues
```

## Task Requirements

Every task in `speckit.tasks` MUST include:

- **Task ID**: T-001, T-002, etc.
- **Description**: Clear, actionable statement
- **Preconditions**: What must exist before starting
- **Expected Outputs**: What will be created/modified
- **Artifacts**: Files/directories to change
- **Links**: References back to speckit.specify §X.Y and speckit.plan §Z.A

## Agent Rules (From AGENTS.md)

1. **Never generate code without a referenced Task ID**
2. **Never modify architecture without updating `speckit.plan`**
3. **Never propose features without updating `speckit.specify`**
4. **Every code file must contain a comment linking to Task ID**
5. If spec is underspecified, STOP and request clarification

## Reference Format

When implementing, reference like this:

```python
# [Task T-005] Create task model
# [From]: speckit.specify §2.1, speckit.plan §3.2
from sqlmodel import SQLModel, Field

class Task(SQLModel):
    ...
```

## Quality Check

Before implementing, run:
```bash
sp.analyze          # Check consistency across spec, plan, tasks
```

After implementing, run:
```bash
sp.phr             # Record Prompt History Record for traceability
```

## Project Structure

```
project/
├── .specify/
│   └── memory/               # Constitution (principles)
├── phase-X/
│   └── docs/
│       ├── spec.md            # speckit.specify
│       ├── plan.md            # speckit.plan
│       └── tasks.md           # speckit.tasks
├── frontend/
├── backend/
└── AGENTS.md                 # Cross-agent rules
```

## When to Use Each Command

| Situation | Command |
|-----------|----------|
| New feature needed | `sp.specify` → `sp.plan` → `sp.tasks` |
| Spec unclear | `sp.clarify` |
| Ready to code | `sp.implement` |
| Track issues in GitHub | `sp.taskstoissues` |
| Check quality | `sp.analyze` |
| Save conversation history | `sp.phr` |
