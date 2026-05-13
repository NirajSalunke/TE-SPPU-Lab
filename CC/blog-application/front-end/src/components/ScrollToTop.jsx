import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";

const ScrollToTopButton = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / scrollHeight) * 360;
      
      setScrollProgress(progress);
      setIsVisible(scrollTop > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      id="scrollButton"
      className={`fixed bottom-6 right-6 w-14 h-14 flex items-center justify-center z-50 cursor-pointer transition-opacity duration-500 ${isVisible ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      <div
        className="relative w-full h-full rounded-full flex items-center justify-center"
        style={{
          background: `conic-gradient(blue 0deg, blue ${scrollProgress}deg, transparent ${scrollProgress}deg, transparent 360deg)`,
        
        }}
      >
        <div className="w-11 h-11 bg-white rounded-full flex items-center justify-center shadow-lg">
          <FontAwesomeIcon icon={faArrowUp} className="text-blue-500 text-2xl" />
        </div>
      </div>
    </div>
  );
};

export default ScrollToTopButton;
