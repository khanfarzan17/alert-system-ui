import "../../styles/Loader/loader.css";

const Loader = () => {
  return (
    <div>
      <div className="shell">
        <div className="splash">
          <div className="splash-bg"></div>
          <div
            className="logo-anim"
            style={{ position: "relative", zIndex: 1 }}
          >
            <div className="logo-anim-ring"></div>
            <div className="logo-anim-mark">
              <svg viewBox="0 0 20 20" fill="white">
                <path d="M10 2L3 6.5V17h5v-4h4v4h5V6.5L10 2z" />
              </svg>
            </div>
          </div>
          <div
            className="splash-brand"
            style={{ position: "relative", zIndex: 1 }}
          >
            Alert<span>IQ</span>
          </div>
          <div
            className="splash-sub"
            style={{ position: "relative", zIndex: 1 }}
          >
            Alert Management System
          </div>
          <div
            style={{
              position: "relative",
              zIndex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div className="splash-bar-wrap">
              <div className="splash-bar"></div>
            </div>
            <div id="splash-msg-el">
              loading Please wait <span className="splash-dots">...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Loader;
