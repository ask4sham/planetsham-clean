{posts.map((post) => (
  <PostCard
    key={post.id}                  // always include key in lists
    postId={post.id}               // <-- This is what BoostButton needs
    content={post.content}
    publishedAt={post.publishedAt}
    isExpert={post.isExpert}       // optional if using expert badge
  />
))}
