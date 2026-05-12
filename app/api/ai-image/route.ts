import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const AI_PROMPTS = [
  "A glowing molecular structure floating in a futuristic lab, neon colors, ultra detailed 8k",
  "A breathtaking galaxy cluster with colorful nebulae and supernovas, cinematic space photography",
  "A microscopic view of cellular mitosis with vibrant neon organelles, macro photography",
  "An alien planet covered in bioluminescent jungles under a violet sky, fantasy art",
  "A cyberpunk city at night with flying vehicles rain-slicked streets neon holograms",
  "A surreal fairy tale forest with giant glowing mushrooms and floating lanterns",
  "A majestic wolf face made of aurora borealis and starlight cosmic wildlife",
  "A human face dissolving into a swirling galaxy digital art surrealism",
  "A futuristic utopian city floating above clouds with waterfalls and lush vegetation",
  "A blooming lotus flower made entirely of light and energy macro photography",
  "An ancient Mayan temple in a dense tropical jungle at golden hour photorealistic",
  "A time vortex portal showing images of past civilizations and future worlds",
  "A deep sea bioluminescent ocean floor with alien-like creatures glowing",
  "An ice crystal landscape on an arctic planet with two suns rising",
  "A dragon made entirely of fire and lightning soaring over stormy mountains",
  "A microscopic diatom algae seen under electron microscope ultra detailed",
  "A neural network visualization glowing like neon circuits digital art",
  "The surface of Jupiter storm system seen from orbit NASA photography style",
  "A cherry blossom tree at night with fireflies and moonlight reflection on water",
  "Ancient Egyptian gods in a hyper-realistic futuristic setting digital art",
  "A black hole event horizon with swirling accretion disk scientific visualization",
  "A pride of lions in a golden savanna at sunset ultra realistic wildlife photography",
  "A crystal cave with glowing geodes and underground waterfalls fantasy",
  "A futuristic human city on Mars with geodesic domes and red rocky landscape",
  "A whale swimming through clouds instead of water dreamlike surrealism",
  "A quantum computing chip magnified 1000x glowing with data streams",
  "The northern lights reflected in a perfectly still fjord lake Norway photography",
  "A samurai warrior in neon-lit feudal Japan at night cinematic art",
  "Thousands of monarch butterflies filling an enchanted forest magical realism",
  "A coral reef teeming with tropical fish in crystal clear water underwater photography"
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const seed = parseInt(searchParams.get('seed') || '0');
    const promptIndex = seed % AI_PROMPTS.length;
    const prompt = AI_PROMPTS[promptIndex];
    const encoded = encodeURIComponent(prompt);
    const url = `https://image.pollinations.ai/prompt/${encoded}?width=512&height=512&nologo=true&seed=${seed}&model=flux`;

    const response = await fetch(url, {
      headers: { 'User-Agent': 'Humanese/1.0' },
      signal: AbortSignal.timeout(20000), // 20s timeout
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Image fetch failed' }, { status: 502 });
    }

    const buffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'image/jpeg';

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
