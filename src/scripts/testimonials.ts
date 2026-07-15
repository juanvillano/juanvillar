const setupTestimonialsDrag = () => {
  const tracks = document.querySelectorAll<HTMLElement>(
    "[data-testimonials-track]",
  );

  tracks.forEach((track) => {
    if (track.dataset.dragReady === "true") return;

    track.dataset.dragReady = "true";

    let pointerId: number | null = null;
    let startX = 0;
    let startScrollLeft = 0;
    let dragged = false;

    const endDrag = (event?: PointerEvent) => {
      if (
        pointerId !== null &&
        event &&
        track.hasPointerCapture(pointerId)
      ) {
        track.releasePointerCapture(pointerId);
      }

      pointerId = null;
      track.classList.remove("is-dragging");

      window.setTimeout(() => {
        dragged = false;
      }, 0);
    };

    track.addEventListener("pointerdown", (event) => {
      if (event.pointerType === "touch" || event.button !== 0) return;

      pointerId = event.pointerId;
      startX = event.clientX;
      startScrollLeft = track.scrollLeft;
      dragged = false;

      track.classList.add("is-dragging");
      track.setPointerCapture(event.pointerId);
    });

    track.addEventListener("pointermove", (event) => {
      if (pointerId !== event.pointerId) return;

      const delta = event.clientX - startX;
      if (Math.abs(delta) > 4) dragged = true;

      track.scrollLeft = startScrollLeft - delta;
    });

    track.addEventListener("pointerup", endDrag);
    track.addEventListener("pointercancel", endDrag);
    track.addEventListener("lostpointercapture", () => {
      pointerId = null;
      track.classList.remove("is-dragging");
    });

    track.addEventListener(
      "click",
      (event) => {
        if (!dragged) return;

        event.preventDefault();
        event.stopPropagation();
      },
      true,
    );
  });
};

setupTestimonialsDrag();
document.addEventListener("astro:page-load", setupTestimonialsDrag);
