---
sidebar_position: 3
title: MoChat
---

# MoChat

> *"I speak to you directly"*

MoChat will provide AI-powered conversational coaching, advice, and education.

**Status:** ❌ Future (all systems planned)

---

## Systems

| System | Name | Status | Description |
|--------|------|--------|-------------|
| [MoVoice](./mo-voice) | *"The Conversationalist"* | ❌ Future | AI chat interface |
| [MoAdvice](./mo-advice) | *"The Counselor"* | ⚠️ Partial | Contextual recommendations |
| [MoEducate](./mo-educate) | *"The Teacher"* | ❌ Future | Training education |

---

## Vision

MoChat will be your personal AI training coach:

```
User: "Why am I not making progress on bench press?"

Mo: "Looking at your data, I see a few things:

1. Your RPE has been consistently at 9+ for the last 3 sessions -
   you might be going too heavy.

2. Sleep has averaged 5.8 hours this week - recovery matters!

3. You've been at 185 lbs for 6 sessions. This is a classic plateau.

I'd recommend:
- Drop to 175 lbs (95%) for 2 weeks
- Focus on 8-10 reps instead of 6
- Prioritize getting 7+ hours of sleep

Want me to adjust your workout plan?"
```

---

## Planned Features

### Conversational AI
- Natural language queries
- Context-aware responses
- Personalized to your data
- Voice input (future)

### Proactive Coaching
- Daily check-ins
- Warning about overtraining
- Celebration of PRs
- Goal reminders

### Educational Content
- Exercise form tips
- Training principles
- Nutrition basics
- Recovery optimization

---

## Vertical Interface (Planned)

```typescript
interface MoChatInterface {
  // Conversation
  sendMessage(userId: string, message: string): Promise<ChatResponse>;
  getConversationHistory(userId: string, limit: number): Promise<Message[]>;

  // Advice
  getDailyTip(userId: string): Promise<Tip>;
  getContextualAdvice(userId: string, context: string): Promise<Advice>;

  // Education
  getArticle(topic: string): Promise<Article>;
  explainConcept(concept: string): Promise<Explanation>;
}
```

---

## Technical Approach

Will use LLM (Claude/GPT) with:
- User data as context
- Training knowledge base
- Exercise database
- Safety guardrails

---

## Implementation Priority

MoChat is a Phase 8+ feature, after core training features are complete.
