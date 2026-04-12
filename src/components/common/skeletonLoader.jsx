import "../../styles/Loader/skeletonLoader.css";

const SkeletonLoader = () => {
  return (
    <div className="skeleton-app-bg">
      {/* Topbar */}
      <div className="skeleton-topbar">
        <div className="skeleton-logo" />
        <div className="skeleton-brand" />
      </div>
      <div style={{ display: "flex", flex: 1 }}>
        {/* Sidebar */}
        <div className="skeleton-sidebar">
          {[...Array(5)].map((_, i) => (
            <div className="skeleton-sidebar-item" key={i} />
          ))}
        </div>
        {/* Main Content */}
        <div className="skeleton-main">
          {/* Cards */}
          <div className="skeleton-cards">
            {[...Array(4)].map((_, i) => (
              <div className="skeleton-card" key={i}>
                <div className="skeleton-card-bar" />
                <div className="skeleton-card-dot" />
              </div>
            ))}
          </div>
          {/* Table */}
          <div className="skeleton-table">
            <div className="skeleton-table-header">
              {[...Array(6)].map((_, i) => (
                <div className="skeleton-table-header-bar" key={i} />
              ))}
            </div>
            {[...Array(5)].map((_, i) => (
              <div className="skeleton-table-row" key={i}>
                {[...Array(6)].map((_, j) => (
                  <div className="skeleton-table-cell" key={j} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonLoader;
