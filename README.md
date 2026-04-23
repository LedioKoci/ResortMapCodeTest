# Luxury Resort Map & Cabana Booking

An interactive web application for a luxury resort that allows guests to view a live map and book poolside cabanas in real time. 

## How to Run

This project uses a single entrypoint to launch both the frontend (React) and backend (Node/Express) concurrently.

**1. Install root dependencies** From the root directory of the project, run:
\`\`\`
npm install
\`\`\`

**2. Start the application** To launch the app using the default `map.ascii` and `bookings.json` files located in the root directory:
\`\`\`
npm start
\`\`\`
*The app will automatically open in your browser at `http://localhost:3000`.*

**3. Using Custom Data Files** To specify alternative map or booking files, pass the arguments through the start script. *(Note the `--` separator required by npm)*:
\`\`\`
npm start -- --map custom-map.ascii --bookings custom-bookings.json
\`\`\`
*(Alternatively, you can run `./run.sh --map <path> --bookings <path>` if you are on a Unix-based system).*

---

## 🧪 Running Tests

Automated tests are included to validate core booking logic, API behavior, and UI interactions.

**Backend Tests (Jest + Supertest):**
\`\`\`
cd backend
npm install  
npm test
\`\`\`

**Frontend Tests (React Testing Library):**
\`\`\`
cd frontend
npm install  
npm test
\`\`\`

---

## Core Design Decisions & Trade-offs

**Architecture:** I chose a decoupled Client/Server architecture using **React** and **Node.js/Express**. This cleanly separates the presentation layer from the business and validation logic while keeping the entire stack in JavaScript for consistency. 

**State Management & Storage:** To adhere to the "keep it simple" directive, I skipped persistent databases and complex frontend state management (like Redux). The backend uses an in memory `Set` to track booked cabanas, which perfectly satisfies the session-level storage requirement without over-engineering. On the frontend, standard React hooks (`useState`, `useEffect`) were more than sufficient.

**UI Mapping & Visuals:** I used **CSS Grid** to directly mirror the 2D array parsed from the `.ascii` file, ensuring perfect alignment. Rather than strictly hardcoding tile images, I implemented an **auto-tiling algorithm** for the paths (`#`). The frontend checks neighboring tiles to dynamically apply the correct intersections and rotations. This was a trade off: it added slight complexity to the frontend logic, but it resulted in a vastly superior and more professional UI without needing to change the backend API or require complex map editor metadata.
