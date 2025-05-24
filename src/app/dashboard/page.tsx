const handleDelete = async (post: Post) => {
  if (confirm("Are you sure you want to delete this post?")) {
    await fetch("/api/posts/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: post.content,
        scheduledAt: post.scheduledAt,
        type: view, // "scheduled" or "published"
      }),
    });
    window.location.reload();
  }
};
