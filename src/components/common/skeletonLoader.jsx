import "../../styles/Loader/skeletonLoader.css";

/* 🔥 Base Skeleton */
const Skeleton = ({ className, style }) => {
  return <div className={className} style={style} />;
};

/* 🔥 Random width */
const getRandomWidth = (min = 60, max = 100) =>
  `${Math.floor(Math.random() * (max - min) + min)}%`;

/* 🔥 Cards */
const CardsSkeleton = ({ count = 4 }) => (
  <div className="skeleton-cards">
    {Array.from({ length: count }).map((_, i) => (
      <div className="skeleton-card" key={i}>
        <Skeleton
          className="skeleton-card-bar"
          style={{ width: getRandomWidth(50, 90) }}
        />
        <Skeleton className="skeleton-card-dot" />
      </div>
    ))}
  </div>
);

/* 🔥 Table */
const TableSkeleton = ({ rows = 5, cols = 6 }) => (
  <div className="skeleton-table">
    <div className="skeleton-table-header">
      {Array.from({ length: cols }).map((_, i) => (
        <Skeleton
          className="skeleton-table-header-bar"
          key={i}
          style={{ width: getRandomWidth(60, 100) }}
        />
      ))}
    </div>

    {Array.from({ length: rows }).map((_, i) => (
      <div className="skeleton-table-row" key={i}>
        {Array.from({ length: cols }).map((_, j) => (
          <Skeleton
            className="skeleton-table-cell"
            key={j}
            style={{ width: getRandomWidth(40, 100) }}
          />
        ))}
      </div>
    ))}
  </div>
);

/* 🔥 MAIN */
const SkeletonLoader = ({ cards = 4, rows = 5, cols = 6 }) => {
  return (
    <div className="skeleton-app-bg">
      <div className="skeleton-container">
        <CardsSkeleton count={cards} />
        <TableSkeleton rows={rows} cols={cols} />
      </div>
    </div>
  );
};

export default SkeletonLoader;
