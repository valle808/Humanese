import os

def update_index_buttons():
    file_path = 'c:/xampp/htdocs/humanese/index.html'
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replacements
    old_buttons = """    .btn-ruby {
      background: var(--ruby);
      color: var(--eggshell);
      box-shadow: 0 4px 20px var(--ruby-glow), inset 0 1px 0 rgba(255, 255, 255, 0.15);
    }

    .btn-ruby:hover {
      box-shadow: 0 8px 32px var(--ruby-glow);
    }

    .btn-outline {
      background: transparent;
      color: var(--text-main);
      border: 1.5px solid var(--border);
      box-shadow: inset 0 0 0 0 var(--text-main);
    }

    .btn-outline:hover {
      background: rgba(245, 240, 232, 0.06);
      border-color: rgba(245, 240, 232, 0.5);
    }

    .btn-sapphire {
      background: var(--sapphire);
      color: #fff;
      box-shadow: 0 4px 20px var(--sap-glow), inset 0 1px 0 rgba(255, 255, 255, 0.15);
    }

    .btn-sapphire:hover {
      box-shadow: 0 8px 32px var(--sap-glow);
    }"""

    new_buttons = """    .btn-ruby {
      background: var(--matrix-green);
      color: var(--bg-primary);
      box-shadow: 0 4px 20px rgba(0, 255, 65, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.15);
      border: 1px solid var(--matrix-green);
    }

    .btn-ruby:hover {
      box-shadow: 0 8px 32px rgba(0, 255, 65, 0.6);
      background: #00e63a;
    }

    .btn-outline {
      background: transparent;
      color: var(--matrix-green);
      border: 1.5px solid var(--matrix-green);
      box-shadow: inset 0 0 0 0 var(--text-main);
    }

    .btn-outline:hover {
      background: rgba(0, 255, 65, 0.1);
      border-color: var(--matrix-green);
      box-shadow: 0 0 15px rgba(0, 255, 65, 0.2);
    }

    .btn-sapphire {
      background: var(--cyber-blue);
      color: var(--bg-primary);
      box-shadow: 0 4px 20px rgba(0, 209, 255, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.15);
      border: 1px solid var(--cyber-blue);
    }

    .btn-sapphire:hover {
      box-shadow: 0 8px 32px rgba(0, 209, 255, 0.6);
      background: #00bce6;
    }"""
    
    old_pulse = """    @keyframes livePulse {

      0%,
      100% {
        opacity: 1;
        box-shadow: 0 0 0 0 rgba(46, 204, 113, 0.4);
      }

      50% {
        opacity: 0.6;
        box-shadow: 0 0 0 6px rgba(46, 204, 113, 0);
      }
    }"""

    new_pulse = """    @keyframes livePulse {

      0%,
      100% {
        opacity: 1;
        box-shadow: 0 0 0 0 rgba(0, 255, 65, 0.6);
      }

      50% {
        opacity: 0.6;
        box-shadow: 0 0 0 8px rgba(0, 255, 65, 0);
      }
    }"""

    old_chip = """    .live-chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-family: var(--mono);
      font-size: 10px;
      letter-spacing: 1.5px;
      padding: 5px 12px;
      border-radius: 20px;
      background: rgba(13, 122, 95, 0.15);
      border: 1px solid rgba(13, 122, 95, 0.4);
      color: #2ecc71;
    }

    .live-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #2ecc71;
      animation: livePulse 2s ease-in-out infinite;
    }"""
    
    new_chip = """    .live-chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-family: var(--mono);
      font-size: 10px;
      letter-spacing: 1.5px;
      padding: 5px 12px;
      border-radius: 20px;
      background: rgba(0, 255, 65, 0.1);
      border: 1px solid rgba(0, 255, 65, 0.3);
      color: var(--matrix-green);
    }

    .live-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--matrix-green);
      animation: livePulse 2s ease-in-out infinite;
    }"""

    content = content.replace(old_buttons, new_buttons)
    content = content.replace(old_pulse, new_pulse)
    content = content.replace(old_chip, new_chip)

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

    print("Successfully replaced CTA button and Pulse CSS in index.html")

if __name__ == '__main__':
    update_index_buttons()
