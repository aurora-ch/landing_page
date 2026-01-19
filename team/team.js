// Team Page Interactive Cards Effect

document.addEventListener('DOMContentLoaded', function() {
    // Set viewport dimensions
    document.body.style.setProperty("--dw", document.body.clientWidth + "px");
    document.body.style.setProperty("--dh", document.body.clientHeight + "px");

    const cardsContainer = document.getElementById("cards");
    
    if (!cardsContainer) return;

    // Update dimensions on resize
    function updateDimensions() {
        document.body.style.setProperty("--dw", document.body.clientWidth + "px");
        document.body.style.setProperty("--dh", document.body.clientHeight + "px");
    }

    window.addEventListener('resize', updateDimensions);

    // Pointer move handler for interactive effect
    cardsContainer.onpointermove = e => {
        for (const card of document.getElementsByClassName("card")) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty("--mouse-x", `${x}px`);
            card.style.setProperty("--mouse-y", `${y}px`);

            const BOX = card.getBoundingClientRect();
            const POINT = { x: x, y: y };
            const RATIO = { x: POINT.x / BOX.width, y: POINT.y / BOX.height };
            const CENTER = fromCenter(RATIO);
            
            // Set CSS variables referenced in CSS
            card.style.setProperty("--ratio-x", RATIO.x);
            card.style.setProperty("--ratio-y", RATIO.y);
        }
    };

    // Reset effect when pointer leaves
    cardsContainer.onpointerleave = () => {
        for (const card of document.getElementsByClassName("card")) {
            card.style.setProperty("--mouse-x", "50%");
            card.style.setProperty("--mouse-y", "50%");
            card.style.setProperty("--ratio-x", "0.5");
            card.style.setProperty("--ratio-y", "0.5");
        }
    };
});

// Calculate distance from center
function fromCenter({ x, y }) {
    return Math.min(
        Math.max(0, Math.sqrt((y - 0.5) * (y - 0.5) + (x - 0.5) * (x - 0.5)) / 0.5),
        1
    );
}
