export function getScheduledPosts() {
  return {
    ready: [],
    future: [],
  };
}

export function updateScheduledPosts(posts: any[]) {
  console.log("Updating scheduled posts:", posts);
  return posts;
}

export function schedulePost(post: { content: string; scheduledAt: string }) {
  console.log("Scheduling post:", post);
  return { success: true };
}
