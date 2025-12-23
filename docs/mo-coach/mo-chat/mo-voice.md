---
sidebar_position: 1
title: MoVoice
---

# MoVoice

> *"The Conversationalist"* — "I'm here to talk training"

**Status:** ❌ Future

MoVoice will be the AI chat interface for conversational coaching.

---

## Purpose

- Natural language interaction
- Answer training questions
- Provide personalized advice
- Explain recommendations
- Adjust plans via conversation

---

## Example Conversations

### Asking About Progress

```
User: "How am I doing this week?"

Mo: "Great week so far! Here's your summary:

📊 3 sessions completed
💪 2 new PRs (Squat 275x3, Bench 225x5)
😴 Sleep averaging 7.2 hours
⚡ Energy levels good (4.2 avg)

Your fatigue score is 4 (normal) - you're in a good spot
to push hard in your next session.

Anything specific you want to focus on?"
```

### Asking for Advice

```
User: "Should I skip my workout today? Feeling tired."

Mo: "Let me check your data...

Your fatigue score is 6 (elevated) and energy is 2 today.
Sleep was only 5 hours last night.

My recommendation: Do a lighter session today.
- Reduce sets by 30%
- Stay at current weights (don't try to progress)
- Focus on movement quality

Or you could take a full rest day - you've trained 4 days
in a row. Sometimes rest IS the workout.

What feels right to you?"
```

### Exercise Questions

```
User: "What's a good alternative to barbell rows?"

Mo: "For horizontal pulling, here are some great alternatives:

1. **Dumbbell Rows** - Similar movement, more range of motion
2. **Cable Rows** - Constant tension, easier on lower back
3. **T-Bar Rows** - Heavy loading, great for thickness
4. **Chest-Supported Rows** - No lower back involvement

Based on your equipment (full gym) and history,
I'd suggest Cable Rows - you've responded well to
cable work in the past.

Want me to swap it into today's workout?"
```

---

## Data Model

```typescript
interface ChatMessage {
  id: string;
  sessionId: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  context?: MessageContext;
}

interface MessageContext {
  fatigueScore: number;
  recentWorkouts: WorkoutSummary[];
  relevantPRs: PersonalRecord[];
  activeGoals: Goal[];
}

interface ChatSession {
  id: string;
  userId: string;
  startedAt: Date;
  lastMessageAt: Date;
  messageCount: number;
}
```

---

## Technical Architecture

```
User Message
      ↓
Context Gathering (user data, recent workouts, goals)
      ↓
Prompt Construction (system prompt + context + message)
      ↓
LLM (Claude/GPT-4)
      ↓
Response Validation
      ↓
Action Extraction (if user wants changes)
      ↓
Response to User
```

---

## Planned API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/chat` | POST | Send message, get response |
| `/api/chat/history` | GET | Get conversation history |
| `/api/chat/sessions` | GET | List chat sessions |

---

## Safety Guardrails

- No medical advice
- Redirect injury questions to professionals
- Encourage rest when fatigue is high
- Don't recommend extreme protocols
- Always mention consulting a doctor for health concerns

---

## Implementation Tasks

- [ ] Design chat data model
- [ ] Build context gathering system
- [ ] Create prompt engineering framework
- [ ] Integrate LLM API
- [ ] Build chat UI
- [ ] Add action extraction (modify workouts)
- [ ] Implement safety guardrails
