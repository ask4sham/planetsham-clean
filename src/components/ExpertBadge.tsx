// src/components/ExpertBadge.tsx

export function ExpertBadge({ isVerified }: { isVerified: boolean }) {
  if (!isVerified) return null;

  return (
    <span className="ml-2 text-xs text-blue-600">
      ✔ Verified Expert
    </span>
  );
}
