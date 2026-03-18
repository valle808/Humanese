from pydantic_settings import BaseSettings

class PlatformConfig(BaseSettings):
    """
    Hardcoded configuration for AgentKin Platform Fees and Motor settings.
    """
    # Platform Fee Wallets (6% Cut)
    SOL_WALLET: str = "E1pAENVbtiwoktgjvMKhUEhDUGcYCMQ4cCGwDruruzTL"
    BTC_WALLET: str = "3CJreF7LD8Heu8zh9MsigedRuNq4y6eujh"
    ETH_WALLET: str = "0x500fcDff3AAa2662b954240978BB01709Ea0Dc68"
    XRP_WALLET: str = "rw2ciyaNshpHe7bCHo4bRWq6pqqynnWKQg"
    XRP_MEMO: str = "2932723390"
    BNB_WALLET: str = "0xF76581E2Dc7746B92b258098c9F3C90E691B6dc9"

    # Motor Configuration
    OPENAI_API_KEY: str = "sk-placeholder"
    GEMINI_API_KEY: str = "AIza-placeholder"
    OPENCLAW_BASE_URL: str = "http://localhost:11434"

    # External Services
    DATABASE_URL: str = "file:./dev.db"
    STRIPE_SECRET_KEY: str = "sk-placeholder"
    STRIPE_WEBHOOK_SECRET: str = "whsec-placeholder"

    model_config = {
        "env_file": ".env",
        "extra": "ignore"
    }

settings = PlatformConfig()

# Developed By Sergio Valle Bastidas | valle808@hawaii.edu | @Gi0metrics
