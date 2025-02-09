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
const naicsData = JSON.parse(fs.readFileSync("./sample.json", "utf8"));

// Function to generate embeddings and insert into Supabase
async function generateEmbeddings() {
  const embeddings = [];

  for (const entry of naicsData) {

    const text = `${entry.description} - Keywords: ${entry.keywords.join(", ")}`;
    
    const response = await openai.embeddings.create({
      model: "text-embedding-3-large",
      input: text,
    });

    const embeddingData = {
      column01: entry.code,
      column02: entry.description,
      column03: entry.keywords,
      column04: response.data[0].embedding,
    };

    embeddings.push(embeddingData);

    // Insert into Supabase
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

