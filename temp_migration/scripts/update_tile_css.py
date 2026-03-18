import os

def update_index_css():
    file_path = 'c:/xampp/htdocs/humanese/index.html'
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replacements
    old_tile_base = """    /* Glass tile base */
    .tile {
      position: relative;
      border-radius: 18px;
      border: 1px solid var(--border);
      background: var(--bg-surface);
      -webkit-backdrop-filter: blur(20px);
      backdrop-filter: blur(20px);
      overflow: hidden;
      transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1),
        border-color 0.2s,
        box-shadow 0.2s;
      cursor: default;
    }

    .tile:hover {
      transform: translateY(-4px) scale(1.008);
      border-color: rgba(245, 240, 232, 0.2);
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
    }

    .tile a {
      text-decoration: none;
      color: inherit;
    }

    .tile-link {
      display: block;
      height: 100%;
      padding: 28px;
    }

    /* Jewel corner accent */
    .tile::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 2px;
      border-radius: 18px 18px 0 0;
      opacity: 0;
      transition: opacity 0.3s;
    }

    .tile:hover::after {
      opacity: 1;
    }

    .tile.ruby::after {
      background: var(--ruby);
    }"""

    new_tile_base = """    /* Glass tile base */
    .tile {
      position: relative;
      border-radius: 18px;
      border: 1px solid var(--border);
      background: var(--bg-surface);
      -webkit-backdrop-filter: blur(var(--glass-blur));
      backdrop-filter: blur(var(--glass-blur));
      overflow: hidden;
      transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1),
        border-color 0.2s,
        box-shadow 0.2s;
      cursor: default;
    }

    .tile:hover {
      transform: translateY(-4px) scale(1.008);
      border-color: var(--border-hover);
      box-shadow: 0 0 25px rgba(0, 255, 65, 0.15);
    }

    .tile a {
      text-decoration: none;
      color: inherit;
    }

    .tile-link {
      display: block;
      height: 100%;
      padding: 32px;
    }

    /* Jewel corner accent */
    .tile::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      border-radius: 18px 18px 0 0;
      opacity: 0;
      transition: opacity 0.3s;
    }

    .tile:hover::after {
      opacity: 1;
      box-shadow: 0 4px 12px var(--matrix-green);
    }

    .tile.ruby::after {
      background: var(--ruby);
    }"""
    
    old_guardian = """    font-family: var(--mono);
      font-size: 11px;
      font-weight: 600;
      color: var(--green)
    }

    .dir-stat.armed {
      color: var(--orange)
    }

    .g-stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      margin-top: 20px
    }

    .g-stat {
      background: var(--surf);
      border: 1px solid var(--bd);
      border-radius: 12px;"""

    new_guardian = """    font-family: var(--mono);
      font-size: 11px;
      font-weight: 700;
      color: var(--matrix-green);
    }

    .dir-stat.armed {
      color: var(--orange)
    }

    .g-stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      margin-top: 24px;
    }

    .g-stat {
      background: rgba(5, 5, 5, 0.4);
      border: 1px solid var(--border);
      border-radius: 12px;"""
      
    content = content.replace(old_tile_base, new_tile_base)
    content = content.replace(old_guardian, new_guardian)

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

    print("Successfully replaced tile styles in index.html")

if __name__ == '__main__':
    update_index_css()
