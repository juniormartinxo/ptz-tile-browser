# Issue tracker: It's a Plan

Issues and specs for this repo live in **It's a Plan**, project **PTZ** (ref `canary.PTZ`, "PTZ Tiles Brownser"). Use the `itsaplan` MCP tools for every operation, never `gh issue`. The GitHub remote (`juniormartinxo/ptz-tile-browser`) is for code and PRs only.

An issue identifier looks like `PTZ-42`. Resolve it with `get_issue_by_number` (`projectKey: "PTZ"`, `sequenceNumber: 42`). Most other tools take the internal numeric id from that result.

## Project setup

Get the ids from `get_project("PTZ")`. Never guess them. These were the values when this file was written:

- **Columns**: pick one by `stateType`, not by name. `backlog` → Backlog (93), `unstarted` → Todo (94), `started` → In Progress (95) / In Review (98), `completed` → Done (96), `canceled` → Canceled (97).
- **Issue types**: Feature (46, the default), Bug (47), Task (48), Tech debt (49), Research (50).
- **Triage**: the **Triagem** custom field (id 7), not labels. See `docs/agents/triage-labels.md`.
- **Labels**: none yet. Create them with `create_label` when a skill needs one.

## Conventions

- **Create an issue**: `create_issue` with the title, a markdown description, the type, and the column.
- **Read an issue**: `get_issue` (or `get_issue_by_number`). It includes checklists and custom field values. Read `list_issue_activity` before commenting on a long-running issue.
- **List or search issues**: `list_issues` to filter by field, `search_issues` to search by text.
- **Sub-issues**: subtasks are enabled. Create the child with its parent set (`create_issue` / `update_issue`). Without that, put `Part of PTZ-<n>` at the top of the child's description.
- **Comment**: `add_comment`. To answer an existing comment, pass `replyToId`.
- **Set triage state**: `set_issue_field_value` on field 7 with the matching option.
- **Move or close an issue**: `update_issue` with a `columnId` whose stateType is `completed` or `canceled`.

## Working on an issue

Move the issue to a `started` column before you begin. Move it to `completed` (or `canceled`) when you finish. Add a comment only if part of the work was not done. Propose a one-line commit message in chat, `PTZ-42 short summary`, and don't commit it yourself.

When you open a PR for an issue, put `Closes PTZ-42` on the first line of the PR body. The It's a Plan webhook uses it to link and close the issue.

## When a skill says "publish to the issue tracker"

Create an It's a Plan issue in project PTZ.

## When a skill says "fetch the relevant ticket"

Read it as in **Read an issue** above.

## Wayfinding operations

Used by `/wayfinder`. The **map** is a single issue, and its **child** issues are the tickets.

- **Map**: one issue with the label `wayfinder:map` (create the label if it's missing). Its description holds the Notes / Decisions-so-far / Fog sections.
- **Child ticket**: a subtask of the map issue, labelled `wayfinder:<type>` (`research`/`prototype`/`grilling`/`task`).
- **Blocking**: call `link_issues` with a "blocked by" relation. If that's not available, put a `Blocked by: PTZ-<n>, ...` line at the top of the description. A ticket is unblocked once every blocker is in a `completed` or `canceled` column.
- **Frontier query**: list the map's open children, then skip any with an open blocker or an assignee. The first remaining one, in map order, wins.
- **Claim**: `update_issue` to assign the driving dev. Make this the session's first write.
- **Resolve**: `add_comment` with the answer, move the ticket to `completed`, then add a pointer (gist + `PTZ-<n>`) to the map's Decisions-so-far.
