---
sidebar_position: 1
title: MoCommunity
---

# MoCommunity

> *"I connect you to others"*

MoCommunity will handle social features — sharing workouts, challenges, and leaderboards.

**Status:** ❌ Future (all systems planned)

---

## Systems

| System | Name | Status | Description |
|--------|------|--------|-------------|
| [MoShare](./mo-share) | *"The Broadcaster"* | ❌ Future | Workout sharing |
| [MoChallenges](./mo-challenges) | *"The Competitor"* | ❌ Future | Weekly challenges |
| [MoLeaderboard](./mo-leaderboard) | *"The Ranks"* | ❌ Future | Friend rankings |

---

## Vision

Social features that motivate without being distracting:

- Share PRs and milestones with friends
- Join weekly/monthly challenges
- See friend activity and streaks
- Compete on leaderboards
- Give encouragement (not just likes)

---

## Vertical Interface (Planned)

```typescript
interface MoCommunityInterface {
  // Sharing
  shareWorkout(sessionId: string): Promise<ShareResult>;
  sharePR(recordId: string): Promise<ShareResult>;
  getFeed(userId: string): Promise<FeedItem[]>;

  // Challenges
  getChallenges(): Promise<Challenge[]>;
  joinChallenge(challengeId: string): Promise<void>;
  getChallengeLeaderboard(challengeId: string): Promise<LeaderboardEntry[]>;

  // Friends
  getFriends(userId: string): Promise<Friend[]>;
  addFriend(userId: string, friendId: string): Promise<void>;
  getFriendActivity(userId: string): Promise<Activity[]>;
}
```

---

## Privacy Considerations

- All sharing is opt-in
- Private by default
- Granular controls (friends only, public, etc.)
- Can disable all social features
- No pressure to participate

---

## Implementation Priority

MoCommunity is Phase 10, after core features and device integration.
