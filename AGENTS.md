# Agent Guidelines

Keep user-invoked image analysis behind a client-safe `*.functions.ts` wrapper and a server-only `*.server.ts` implementation, so private AI calls never enter browser code.
