// Reusable skeleton loading components
export function SkeletonCard({ height=120 }) {
  return <div className="skeleton" style={{height, borderRadius:14, marginBottom:12}} />;
}

export function SkeletonText({ width="100%", height=14, mb=8 }) {
  return <div className="skeleton" style={{width, height, borderRadius:6, marginBottom:mb}} />;
}

export function SkeletonGrid({ cols=4, rows=1, height=120 }) {
  return (
    <div style={{display:"grid", gridTemplateColumns:`repeat(${cols},1fr)`, gap:14}}>
      {Array(cols*rows).fill(0).map((_,i) => (
        <div key={i} className="skeleton" style={{height, borderRadius:14}} />
      ))}
    </div>
  );
}

export function SkeletonPage() {
  return (
    <div style={{padding:4}}>
      <SkeletonText width="200px" height={28} mb={6} />
      <SkeletonText width="300px" height={14} mb={24} />
      <SkeletonGrid cols={4} height={100} />
      <div style={{marginTop:16}}>
        <SkeletonGrid cols={2} height={220} />
      </div>
      <div style={{marginTop:16}}>
        <SkeletonGrid cols={3} height={160} />
      </div>
    </div>
  );
}
