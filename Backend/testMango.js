const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = "mongodb+srv://diamondpeter643:MyNewPassword123@cluster0.c3xvy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with options
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server
    await client.connect();
    // Ping MongoDB to test connection
    await client.db("admin").command({ ping: 1 });
    ("✅ Successfully connected to MongoDB!");
  } catch (error) {
    console.error("❌ Connection failed:", error);
  } finally {
    // Close the client connection
    await client.close();
  }
}

run();
