const concurrently = require('concurrently');
const path = require('path');

const args = process.argv.slice(2);
let backendArgs = [];

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--map' || args[i] === '--bookings') {
    const flag = args[i];
    const val = args[i + 1];
    
    if (val) {
      backendArgs.push(flag, `"${path.resolve(val)}"`);
      i++; 
    }
  }
}

console.log(`Starting full stack with backend args: ${backendArgs.join(' ') || '(defaults)'}`);

concurrently([
  { 
    command: `cd backend && npx nodemon app.js ${backendArgs.join(' ')}`, 
    name: 'backend', 
    prefixColor: 'blue' 
  },
  { 
    command: `cd frontend && npm start`, 
    name: 'frontend', 
    prefixColor: 'green' 
  }
]).result.catch((err) => {
    console.error("Process exited with error:", err);
});