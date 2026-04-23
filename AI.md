# AI Workflow Documentation

This document outlines the AI-assisted workflow used to build the Resort Map & Cabana Booking application.

## Tools Used
* **Primary LLM:** Gemini 
* **IDE Integration:** Visual Studio Code

## Workflow & Steps

The project was completed in approximately **4 iterative steps**, moving from backend foundation to frontend polish and orchestration.

1. **Initial Full-Stack Setup:** * *Prompt Focus:* Provided the `map.ascii`, `bookings.json`, project requirements, and file structure. Asked the AI to generate a "right-sized" baseline utilizing Node.js and React.
   * *Result:* Generated the Express server and the initial React grid structure, both boilerplate code.
2. **Visual Refinement (Auto-tiling):**
   * *Prompt Focus:* "The paths go horizontal but show vertical images. How do we make the paths look stylish and connect correctly?"
   * *Result:* The AI suggested an auto-tiling algorithm. We iterated on this specifically because T-junctions and dead-ends were facing the wrong directions based on the default orientation of the provided assets.
3. **Fixing Asset Connections:**
   * *Prompt Focus:* Pointed out that paths weren't connecting to the chalets and cabanas, causing visual breaks.
   * *Result:* Updated the neighbor-checking algorithm to recognize buildings (`c` and `W`) as valid connection points, smoothing out the map UI perfectly.
4. **Testing & Orchestration:**
   * *Prompt Focus:* Requested automated tests for both environments and a cross-platform single entrypoint that accepts CLI arguments (`--map` and `--bookings`).
   * *Result:* Implemented `jest`/`supertest` for the backend, mocked `fetch` tests for React.

## 🧠 Reflection on AI Usage
Using the AI as a pairing partner allowed for rapid prototyping of the boilerplate code (like setting up Express routes and CSS grids). The most valuable use of the AI, however, was iterating on the auto-tiling math—a notoriously tedious graphical task—allowing me to focus on the overall architecture, testing, and user experience rather than manually calculating rotation degrees for every map tile.