import fs from "fs";
import { OpenAI } from "openai";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

// Initialize .env file keys
dotenv.config();

// Initialize OpenAi and Supabase clients
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// Load NAICS data
const jsonData = JSON.parse(fs.readFileSync("./sample.json", "utf8"));

// Function to generate embeddings and insert into Supabase
async function generateEmbeddings() {
  const embeddings = [];

  for (const entry of jsonData) {

    const text = `${entry.description} - Keywords: ${entry.keywords.join(", ")}`;
    
    const response = await openai.embeddings.create({
      model: "text-embedding-3-large",
      input: text,
    });

    /*
    Create Table in Supabase database:
      CREATE TABLE naics_embeddings (
        name TEXT PRIMARY KEY,
        description TEXT NOT NULL,  -- Description is required
        keywords TEXT[] NOT NULL,     -- Keywords are required (even if empty array)
        embedding VECTOR(3072) NOT NULL -- Embedding is required
      );
    */
    const embeddingData = {
      name: entry.name,
      description: entry.description,
      keywords: entry.keywords,
      embeddibng: response.data[0].embedding, //
    };

    embeddings.push(embeddingData);

    // Insert into Supabase database
    const { error } = await supabase.from("sample_table").insert(embeddingData);

    if (error) {
      console.error(`Error inserting ${entry.code}:`, error.message);
    } else {
      console.log(`Inserted embedding for: ${entry.code}`);
    }
  }

  // Save embeddings locally as a backup
  fs.writeFileSync("./embeddings.json", JSON.stringify(embeddings, null, 2));
  console.log("Embeddings saved and uploaded to Supabase!");
}

generateEmbeddings();
// Run in terminal using 'node generateEmbeddings.js'

