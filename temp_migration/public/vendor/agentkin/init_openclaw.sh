#!/bin/bash

# =================================================================
# AGENT KING - AUTONOMOUS INITIALIZATION SCRIPT
# Purpose: Sophisticated integration of the OpenClaw Ecosystem
# =================================================================

# Set colors for status updates
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}Starting Agent King Autonomous Deployment...${NC}"

# 1. CREATE DIRECTORY STRUCTURE
TARGET_DIR="agent_king_workspace"
mkdir -p $TARGET_DIR && cd $TARGET_DIR
echo -e "${GREEN}Workspace created: $(pwd)${NC}"

# 2. DEFINE REPOSITORY MAP
# Format: "FolderName|HTTPS_URL|GH_CLI_Alias"
REPOS=(
    "openclaw|https://github.com/openclaw/openclaw.git|openclaw/openclaw"
    "clawhub|https://github.com/openclaw/clawhub.git|openclaw/clawhub"
    "skills|https://github.com/openclaw/skills.git|openclaw/skills"
    "lobster|https://github.com/openclaw/lobster.git|openclaw/lobster"
    "nix-openclaw|https://github.com/openclaw/nix-openclaw.git|openclaw/nix-openclaw"
    "openclaw-ansible|https://github.com/openclaw/openclaw-ansible.git|openclaw/openclaw-ansible"
)

# 3. CLONING LOGIC (With Redundancy)
for entry in "${REPOS[@]}"; do
    IFS="|" read -r FOLDER URL CLI <<< "$entry"
    
    echo -e "\n${BLUE}Processing Repository: $FOLDER...${NC}"
    
    # Try GitHub CLI first (more sophisticated/secure)
    if command -v gh &> /dev/null && gh auth status &> /dev/null; then
        echo "Using GitHub CLI to clone $CLI..."
        gh repo clone "$CLI" "$FOLDER"
    else
        # Fallback to standard HTTPS
        echo "GH CLI not found or not logged in. Falling back to HTTPS..."
        git clone "$URL" "$FOLDER"
    fi

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}Successfully integrated $FOLDER${NC}"
    else
        echo -e "${RED}Failed to clone $FOLDER. Check network or permissions.${NC}"
        exit 1
    fi
done

# 4. IMPLEMENTATION & LINKING
echo -e "\n${BLUE}Configuring Autonomous Logic Paths...${NC}"

# Example of linking 'skills' to the core 'openclaw' module for immediate use
if [ -d "openclaw" ] && [ -d "skills" ]; then
    # In bash on Windows, ln -s might fail or create copies unless run as admin. Use junctions or MSYS=winsymlinks
    export MSYS=winsymlinks:nativestrict
    ln -s "$(pwd)/skills" "$(pwd)/openclaw/skills_lib"
    echo -e "${GREEN}Symlink established: Skills mapped to OpenClaw Core.${NC}"
fi

# 5. FINAL VERIFICATION
echo -e "\n${GREEN}=================================================${NC}"
echo -e "${GREEN}AGENT KING INITIALIZATION COMPLETE${NC}"
echo -e "System is ready for autonomous calculations."
echo -e "Location: $(pwd)"
echo -e "${GREEN}=================================================${NC}"
