import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function scrapeAndStore(topic: string, url?: string) {
    console.log(`[Autonomous Scraper] Initializing for: ${topic}`);

    // Intelligence from Parallelpedia: Use Firecrawl or direct fetch
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

        // Store in Sovereign Knowledge Matrix (Supabase)
        const { data: stored, error } = await supabase
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

        return { success: true, data: stored[0] };
    } catch (error) {
        console.error("[Scraper Error]", error);
        return { success: false, error };
    }
}
