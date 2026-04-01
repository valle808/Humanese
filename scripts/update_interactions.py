import os

def update_index_interactions():
    file_path = 'c:/xampp/htdocs/humanese/index.html'
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replacements
    old_monroe_chat = """    .monroe-tile-chat {
      height: 100%;
      padding: 24px;
      display: flex;
      flex-direction: column;
    }"""

    new_monroe_chat = """    .monroe-tile-chat {
      height: 100%;
      padding: 24px;
      display: flex;
      flex-direction: column;
      position: relative;
    }

    .monroe-tile-chat::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border-radius: inherit;
      box-shadow: inset 0 0 20px rgba(109, 40, 217, 0);
      animation: thinkingGlow 4s ease-in-out infinite;
      pointer-events: none;
      z-index: 0;
    }
    
    @keyframes thinkingGlow {
      0%, 100% { box-shadow: inset 0 0 0px rgba(109, 40, 217, 0); }
      50% { box-shadow: inset 0 0 30px rgba(109, 40, 217, 0.15); }
    }
    
    .monroe-chat-header {
      position: relative;
      z-index: 1;
    }
    
    .monroe-tile-messages {
      position: relative;
      z-index: 1;
    }
    
    .monroe-tile-input {
      position: relative;
      z-index: 1;
    }"""
    
    old_swarm_canvas = """    /* ── SWARM VISUALIZATION ── */
    .swarm-canvas-wrapper {
      position: absolute;
      inset: 0;
      overflow: hidden;
      border-radius: inherit;
    }"""

    new_swarm_canvas = """    /* ── SWARM VISUALIZATION ── */
    .swarm-canvas-wrapper {
      position: absolute;
      inset: 0;
      overflow: hidden;
      border-radius: inherit;
      animation: livePulseSovereign 3s ease-in-out infinite;
      box-shadow: inset 0 0 0px var(--ruby);
    }
    
    @keyframes livePulseSovereign {
      0%, 100% { box-shadow: inset 0 0 5px rgba(255, 107, 43, 0.1); }
      50% { box-shadow: inset 0 0 25px rgba(255, 107, 43, 0.4); }
    }"""

    content = content.replace(old_monroe_chat, new_monroe_chat)
    content = content.replace(old_swarm_canvas, new_swarm_canvas)

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

    print("Successfully added micro-interactions to index.html")

if __name__ == '__main__':
    update_index_interactions()
