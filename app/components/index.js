import { useState, useRef } from "react";
import Slideshow from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { motion } from "framer-motion";
import styles from "../styles/index.module.css";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.125 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.375 } },
};

export default function Index({ projects }) {
  const [openAccordion, setOpenAccordion] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };

  const getOpacity = (index) => {
    if (openAccordion !== null) return openAccordion === index ? 1 : 0.5;
    return hoveredIndex !== null && hoveredIndex !== index ? 0.5 : 1;
  };

  const handleMouseEnter = (index) => {
    if (openAccordion === null) {
      setTimeout(() => setHoveredIndex(index), 25);
    }
  };

  const handleMouseLeave = () => {
    if (openAccordion === null) {
      setTimeout(() => setHoveredIndex(null), 25);
    }
  };

  return (
    <main>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {projects.map((project, index) => (
          <motion.div
            key={index}
            className={styles.accordion}
            variants={itemVariants}
            animate={{ opacity: getOpacity(index) }}
            transition={{ duration: 0.25 }}
          >
            <div
              className={styles.accordionTrigger}
              onClick={() => toggleAccordion(index)}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
            >
              <p>{`0${index + 1}`}</p>
              <p>{project.name}</p>
              <p>{project.endDate}</p>
            </div>
            <motion.div
              className={styles.accordionContent}
              initial={{ height: 0 }}
              animate={{ height: openAccordion === index ? "auto" : 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
            >
              <p>{project.description}</p>
              {project.media?.length > 0 && (
                <MediaSlideshow media={project.media} />
              )}
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    </main>
  );
}

function MediaSlideshow({ media }) {
  const settings = {
    infinite: false,
    speed: 250,
    slidesToScroll: 1,
    variableWidth: true,
    swipeToSlide: true,
    touchThreshold: 12.25,
  };

  return (
    <Slideshow {...settings} className={styles.slideshow}>
      {media.map((item, mediaIndex) => (
        <div key={mediaIndex} className={styles.slideshowMedia}>
          {item.type === "image" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.url}
              alt={`Project media ${mediaIndex + 1}`}
              className={styles.slideshowMediaItem}
            />
          ) : item.type === "video" ? (
            <video
              className={styles.slideshowMediaItem}
              autoPlay
              muted
              playsInline
              loop
              disablePictureInPicture
            >
              <source src={item.url} type="video/webm" />
            </video>
          ) : null}
        </div>
      ))}
    </Slideshow>
  );
}
