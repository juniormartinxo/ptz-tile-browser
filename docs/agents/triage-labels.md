# Triage Labels

The skills speak in terms of five canonical triage roles. In this repo they are **not labels**. They are the options of the **Triagem** custom field (select, field id 7) on It's a Plan project PTZ.

| Role in mattpocock/skills | Triagem option    | Option id | Meaning                                  |
| ------------------------- | ----------------- | --------- | ---------------------------------------- |
| `needs-triage`            | `needs-triage`    | 31        | Maintainer needs to evaluate this issue  |
| `needs-info`              | `needs-info`      | 32        | Waiting on reporter for more information |
| `ready-for-agent`         | `ready-for-agent` | 33        | Fully specified, ready for an AFK agent  |
| `ready-for-human`         | `ready-for-human` | 34        | Requires human implementation            |
| `wontfix`                 | `wontfix`         | 35        | Will not be actioned                     |

When a skill says "apply the X label" or "remove the X label", set the Triagem field to the matching option with `set_issue_field_value`. The field holds one value at a time, so setting a new role replaces the old one. To filter by role, use `list_issues` on the field value. Do not create labels for these roles.

Option ids may change. If one is refused, re-check them with `get_project("PTZ")`.
