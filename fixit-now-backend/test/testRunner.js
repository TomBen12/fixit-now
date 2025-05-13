import "dotenv/config";
import { exec } from "child_process";
import path from "path";

const testFiles = [
  "resetDatabase.js",
  "authtest.js",
  "problemTest.js",
  "chatTest.js",
  "socketTest.js",
  "socketMediaTest.js",
];

function runFile(file) {
  return new Promise((resolve, reject) => {
    const command = `node ${path.resolve("./test", file)}`;
    console.log(`\n🧪 Running: ${file}`);
    exec(command, (err, stdout, stderr) => {
      if (err) {
        console.error(`❌ Error in ${file}:`, stderr);
        return reject(err);
      }
      console.log(`✅ Output from ${file}:
${stdout}`);
      resolve();
    });
  });
}

async function runAllTests() {
  for (const file of testFiles) {
    try {
      await runFile(file);
    } catch {
      console.warn(`⚠️ Test failed: ${file}`);
    }
  }
  console.log("\n🎉 All tests finished.");
}

runAllTests();
