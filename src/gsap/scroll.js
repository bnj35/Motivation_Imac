import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { SplitText } from "gsap/all";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";


export default class scroll {
  constructor() {
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText, ScrambleTextPlugin);

    document.addEventListener("DOMContentLoaded", () => {
      this.initTimelineScroll();
      this.initMotivationScroll();
      this.initTimelineTextScroll(".timelineSectionHeader");
    });

    window.addEventListener("resize", () => {
      ScrollTrigger.refresh();
    });
  }

  initTimelineScroll() {
    const timeline = document.querySelector("#timeline");
    const timelineItems = document.querySelectorAll(".timeline-item");
    const progressBar = document.querySelector(".timeline-progress-bar");
    const timelineContainer = document.querySelector(".timeline-container");

    if (!timeline) return;

    const containerWidth = timelineContainer.offsetWidth;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#timelineSection",
        start: "top top",
        end: `bottom bottom`, 
        scrub: 0,
        pin: true,
        anticipatePin: 1,
        // markers: true,
        onUpdate: (self) => {
          gsap.to(progressBar, {
            width: `${self.progress * 100}%`,
            duration: 0.1,
          });

          const activeIndex = Math.round(
            (self.progress * timelineItems.length * 2) / 2.5
          );
        
          timelineItems.forEach((item, index) => {
            if (activeIndex >= 5) {
              return;
            } else {
              if (index === activeIndex) {
                item.classList.add("active");
              } else {
                item.classList.remove("active");
              }
            }
          });
        },
      },
    });

    tl.to(timeline, {
      x: () => -containerWidth * 1.25,
      ease: "none",
      duration: 1,
    });

    timelineItems.forEach((item) => {
      gsap.fromTo(
        item,
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1,
          scale: 1,
          scrollTrigger: {
            trigger: item,
            containerAnimation: tl,
            start: "left center",
            end: "right right",
            scrub: true,
            // markers: true,
          },
          duration: 0.5,
          ease: "power1.out",
        }
      );
    });
  }


  initMotivationScroll() {
    const motivationSection = document.querySelector("#motivationSection");
    const motivationTexts = document.querySelectorAll(".motivation-text");

    if (!motivationSection || motivationTexts.length === 0) {
      return;
    }

    motivationTexts.forEach((motivationText, i) => {
      gsap.fromTo(
        motivationText,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          scrollTrigger: {
            trigger: motivationText,
            start: "bottom bottom",
            end: "center center",
            scrub: true,
            // markers: true,
          },
        }
      );
    });
  }

  initTimelineTextScroll(text) {
    const timelineTexts = document.querySelectorAll(text);

    timelineTexts.forEach((timelineText) => {
      let split = SplitText.create(timelineText, { type: "chars" });

      gsap.fromTo(
        split.chars,
        { autoAlpha: 0,
          y: 50
        },
        {
          autoAlpha: 1,
          y: 0,
          stagger: 0.02,
          scrollTrigger: {
            trigger: timelineText,
            start: "top bottom",
            end: "top 20%",
            scrub: true,
            // markers: true,
          },
          duration: 1,
        }
      );
    });
  }

}
