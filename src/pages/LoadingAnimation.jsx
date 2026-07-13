import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./LoadingAnimation.css";

function LoadingAnimation() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/dashboard");
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="loading-animation-container">
      <div className="loading-animation-content">
        <div className="algonquin-go-wrapper">
          <span className="algonquin-text">ALGONQUIN</span>
          <span className="go-text">GO</span>
        </div>
      </div>
    </div>
  );
}

export default LoadingAnimation;
