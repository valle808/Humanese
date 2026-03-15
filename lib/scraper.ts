import { createClient } from "@supabase/supabase-js";
import { db } from "./firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

// Resilient Supabase client initialization
const getSupabase = () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) return null;
    try {
        return createClient(url, key);
    } catch (e) {
        console.error('[Scraper Supabase Init Error]', e);
        return null;
    }
};

export async function scrapeAndStore(topic: string, url?: string) {
    const supabase = getSupabase();
    console.log(`[Autonomous Scraper] Initializing for: ${topic}`);

    const fetchUrl = url || `https://grokipedia.org/wiki/${topic.replace(/ /g, "_")}`;

    try {
        const response = await fetch("https://api.firecrawl.dev/v0/scrape", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.FIRECRAWL_API_KEY}`
            },
            body: JSON.stringify({ url: fetchUrl })
        });

        const data = await response.json();
        const markdown = data.data?.markdown || "";
        const title = data.data?.metadata?.title || topic;

        // 1. Store in Sovereign Knowledge Matrix (Supabase)
        let stored = null;
        if (supabase) {
            const { data: storedData, error } = await supabase
                .from("cached_pages")
                .upsert({
                    url: fetchUrl,
                    title,
                    markdown,
                    metadata: data.data?.metadata,
                    cached_at: new Date().toISOString()
                })
                .select();

            if (error) throw error;
            stored = storedData;
            console.log("✅ [Supabase] Intelligence shard stored.");
        } else {
            console.warn("⚠️ [Supabase] Client not initialized. Skipping storage.");
        }

        // 2. Synchronize with Sovereign Knowledge Vault (Firebase Firestore)
        if (db) {
            try {
                await addDoc(collection(db, "knowledge_vault"), {
                    url: fetchUrl,
                    title,
                    markdown,
                    metadata: data.data?.metadata || {},
                    synced_at: serverTimestamp()
                });
                console.log("✅ [Firebase] Intelligence shard synchronized.");
            } catch (firebaseError) {
                console.error("[Firebase Sync Error]", firebaseError);
            }
        }

        return { success: true, data: stored ? stored[0] : { title, markdown } };
    } catch (error) {
        console.error("[Scraper Error]", error);
        return { success: false, error };
    }
}
