# F16s Freight OS Conventions

This file documents mandatory coding conventions and patterns for the F16s Freight OS project.

## Cross-Modal Queries and `PortalScope`

The `FreightJob` model applies a global scope (`App\Scopes\PortalScope`) filtering by `transport_mode` derived from the session (`air` or `sea`). 

Any report, audit query, or admin dashboard that needs to see **both** air and sea jobs simultaneously (e.g., the Boss Dashboard's cross-modal aggregations, the Unbilled Jobs tracker, financial reconciliation) will silently return incomplete data unless the scope is explicitly removed.

**Mandatory Pattern:**
For cross-modal queries, always explicitly use `withoutGlobalScope`:

```php
// Explicitly bypass PortalScope for cross-modal queries
FreightJob::withoutGlobalScope(\App\Scopes\PortalScope::class)
    ->where('agent_id', $agentId)
    ->whereIn('status', ['Completed'])
    ->get();
```

Without this, queries might appear correct in testing (when a session has a portal scope set) but will silently return incomplete data in production reporting contexts.

## Boss/Director Dashboard and Dual-Scope Bypass

The Boss Dashboard requires cross-branch (multi-agent) and cross-modal (multi-portal) visibility. Therefore, queries built for these executive dashboards must bypass **both** `AgentScope` (filters by `agent_id`) and `PortalScope` (filters by `transport_mode`) simultaneously.

**Mandatory Pattern:**
For boss-level executive queries, always use `withoutGlobalScopes` to clear both constraints:

```php
// Boss/Director dashboard queries that need cross-branch, cross-modal data:
FreightJob::withoutGlobalScopes([\App\Scopes\AgentScope::class, \App\Scopes\PortalScope::class])
    ->where('status', 'Completed')
    ->get();
```
