---
title: Hiding System Complexity Behind Microsoft Graph API
slug: microsoft-graph-api-calendar-meetings
excerpt: >-
  How a 4-step backend orchestration masked Microsoft Graph's strange separation
  between calendar events and online meeting policies.
author: Rauhan Sheikh
publishedAt: '2025-09-10T00:00:00.000Z'
readingTime: 6 min read
tags:
  - APIs
  - Microsoft Graph
  - Integration
  - Backend
isFeatured: false
isPublished: true
coverImage: /articles/graph.png
---
## A Tale of Two Endpoints

If you have ever integrated Microsoft 365 or Teams into an enterprise application, you have likely encountered the peculiar disconnect between:
- `/me/events` (The user's Outlook calendar)
- `/me/onlineMeetings` (The Teams audio/video infrastructure)

For our academic portal, lecturers needed scheduled classes to appear on their corporate calendars so they didn't miss lectures, but our safety policies required restricting attendee screen-sharing and auto-recording sessions.

Microsoft Graph did not provide a single endpoint that satisfied both needs simultaneously.

### The Orchestration
Instead of leaking this complexity to the UI or asking lecturers to configure meetings twice, we engineered an asynchronous pipeline that:
1. Created the calendar event.
2. Extracted the opaque join URL coordinates.
3. Decoded and queried the underlying online meeting entity.
4. Patched permissions, lobby controls, and recording parameters.
5. Returned a unified representation to the LMS.

Good software engineering is often about absorbing awkward third-party impedance mismatches so the human at the keyboard never has to think about them.
