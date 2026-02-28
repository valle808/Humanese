# env_push_vercel.ps1
# Pushes all Sovereign Knowledge Matrix environment variables to Vercel.
# Run this after filling in your real API keys below.
# Usage: .\env_push_vercel.ps1

# ─── FILL IN YOUR REAL VALUES BELOW ────────────────────────────────────────────
$FIRECRAWL_API_KEY             = "your_firecrawl_api_key_here"
$OPENROUTER_API_KEY            = "your_openrouter_api_key_here"
$NEXT_PUBLIC_SUPABASE_URL      = "https://your-project-id.supabase.co"
$NEXT_PUBLIC_SUPABASE_ANON_KEY = "your-supabase-anon-key-here"
$SUPABASE_SERVICE_ROLE_KEY     = "your-supabase-service-role-key-here"
$NEXT_PUBLIC_FIREBASE_API_KEY  = "your-firebase-api-key-here"
$NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN      = "your-project.firebaseapp.com"
$NEXT_PUBLIC_FIREBASE_PROJECT_ID       = "your-firebase-project-id"
$NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET   = "your-project.appspot.com"
$NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = "your-messaging-sender-id"
$NEXT_PUBLIC_FIREBASE_APP_ID           = "your-firebase-app-id"
$NEXT_PUBLIC_APP_URL                   = "https://humanese.vercel.app"
$DKG_BASE_URL                          = "http://localhost:9200"
# ────────────────────────────────────────────────────────────────────────────────

function AddEnvVar($name, $value, $target = "production") {
    Write-Host "Setting $name ($target)..."
    echo $value | npx vercel env add $name $target
}

# Server-side secrets (production + preview + development)
foreach ($env in @("production", "preview", "development")) {
    AddEnvVar "FIRECRAWL_API_KEY" $FIRECRAWL_API_KEY $env
    AddEnvVar "OPENROUTER_API_KEY" $OPENROUTER_API_KEY $env
    AddEnvVar "SUPABASE_SERVICE_ROLE_KEY" $SUPABASE_SERVICE_ROLE_KEY $env
    AddEnvVar "DKG_BASE_URL" $DKG_BASE_URL $env
}

# Public vars (all environments)
foreach ($env in @("production", "preview", "development")) {
    AddEnvVar "NEXT_PUBLIC_SUPABASE_URL" $NEXT_PUBLIC_SUPABASE_URL $env
    AddEnvVar "NEXT_PUBLIC_SUPABASE_ANON_KEY" $NEXT_PUBLIC_SUPABASE_ANON_KEY $env
    AddEnvVar "NEXT_PUBLIC_FIREBASE_API_KEY" $NEXT_PUBLIC_FIREBASE_API_KEY $env
    AddEnvVar "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN" $NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN $env
    AddEnvVar "NEXT_PUBLIC_FIREBASE_PROJECT_ID" $NEXT_PUBLIC_FIREBASE_PROJECT_ID $env
    AddEnvVar "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET" $NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET $env
    AddEnvVar "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID" $NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID $env
    AddEnvVar "NEXT_PUBLIC_FIREBASE_APP_ID" $NEXT_PUBLIC_FIREBASE_APP_ID $env
    AddEnvVar "NEXT_PUBLIC_APP_URL" $NEXT_PUBLIC_APP_URL $env
}

Write-Host ""
Write-Host "✅ All Sovereign Knowledge Matrix environment variables pushed to Vercel!"
Write-Host "   Trigger a new Vercel deployment: npx vercel --prod"
