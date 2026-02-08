#!/usr/bin/env python3
"""
Generate educational diagrams for HSC Biology Module 1 Lessons 1-3
Output: WebP format, optimized for web (<100KB per image)
"""

from PIL import Image, ImageDraw, ImageFont
import os
import math

def ensure_dir(path):
    os.makedirs(os.path.dirname(path), exist_ok=True)

def draw_rounded_rect(draw, xy, radius, fill, outline=None, width=1):
    """Draw a rounded rectangle"""
    x1, y1, x2, y2 = xy
    # Draw main rectangle
    draw.rectangle([x1+radius, y1, x2-radius, y2], fill=fill)
    draw.rectangle([x1, y1+radius, x2, y2-radius], fill=fill)
    # Draw circles at corners
    draw.ellipse([x1, y1, x1+radius*2, y1+radius*2], fill=fill)
    draw.ellipse([x2-radius*2, y1, x2, y1+radius*2], fill=fill)
    draw.ellipse([x1, y2-radius*2, x1+radius*2, y2], fill=fill)
    draw.ellipse([x2-radius*2, y2-radius*2, x2, y2], fill=fill)

def create_prokaryote_diagram():
    """Lesson 1: Prokaryotic cell diagram (800x600)"""
    img = Image.new('RGB', (800, 600), '#f8fafc')
    draw = ImageDraw.Draw(img)
    
    # Draw cell outline (bacillus/rod shape)
    cx, cy = 400, 300
    cell_w, cell_h = 500, 200
    
    # Cell wall (thick outline)
    draw.rounded_rectangle(
        [cx-cell_w//2-10, cy-cell_h//2-10, cx+cell_w//2+10, cy+cell_h//2+10],
        radius=80, outline='#059669', width=12
    )
    
    # Cell membrane
    draw.rounded_rectangle(
        [cx-cell_w//2, cy-cell_h//2, cx+cell_w//2, cy+cell_h//2],
        radius=70, outline='#3b82f6', width=4
    )
    
    # Cytoplasm fill (light blue)
    draw.rounded_rectangle(
        [cx-cell_w//2+5, cy-cell_h//2+5, cx+cell_w//2-5, cy+cell_h//2-5],
        radius=65, fill='#dbeafe'
    )
    
    # Nucleoid region (fibrillar DNA area)
    draw.ellipse([cx-80, cy-40, cx+20, cy+40], fill='#8b5cf6', outline='#7c3aed', width=2)
    # DNA strands
    for i in range(5):
        y = cy - 30 + i * 15
        draw.arc([cx-70, y-5, cx+10, y+5], start=0, end=180, fill='#a78bfa', width=2)
    
    # 70S Ribosomes (small dots throughout cytoplasm)
    ribosome_positions = [
        (cx+100, cy-50), (cx+120, cy-30), (cx+140, cy-60),
        (cx+80, cy+40), (cx+150, cy+20), (cx+130, cy+50),
        (cx-150, cy-60), (cx-120, cy+30), (cx-100, cy+50)
    ]
    for x, y in ribosome_positions:
        draw.ellipse([x-6, y-6, x+6, y+6], fill='#10b981', outline='#059669')
    
    # Plasmid (small circular DNA)
    draw.ellipse([cx+50, cy-80, cx+90, cy-40], outline='#ec4899', width=3)
    
    # Capsule (outer layer)
    draw.rounded_rectangle(
        [cx-cell_w//2-20, cy-cell_h//2-20, cx+cell_w//2+20, cy+cell_h//2+20],
        radius=90, outline='#a78bfa', width=3
    )
    
    # Flagellum
    flag_x, flag_y = cx+cell_w//2+10, cy
    # Basal body
    draw.rectangle([flag_x, flag_y-8, flag_x+20, flag_y+8], fill='#64748b')
    # Filament (wavy)
    for i in range(8):
        x = flag_x + 20 + i * 25
        y1 = flag_y - 15 if i % 2 == 0 else flag_y + 15
        y2 = flag_y + 15 if i % 2 == 0 else flag_y - 15
        draw.line([(x, flag_y if i == 0 else y1), (x+25, y2)], fill='#64748b', width=6)
    
    # Labels with leader lines
    label_color = '#1e293b'
    
    # Nucleoid label
    draw.line([(cx-30, cy), (cx-120, cy-80)], fill=label_color, width=2)
    draw.text((cx-220, cy-95), "Nucleoid", fill=label_color, font=None)
    draw.text((cx-220, cy-75), "(circular DNA)", fill='#64748b', font=None)
    
    # 70S Ribosomes label
    draw.line([(cx+130, cy-40), (cx+200, cy-100)], fill=label_color, width=2)
    draw.text((cx+210, cy-115), "70S Ribosomes", fill=label_color, font=None)
    
    # Peptidoglycan label
    draw.line([(cx-cell_w//2, cy-cell_h//2-10), (cx-cell_w//2-50, cy-cell_h//2-60)], fill=label_color, width=2)
    draw.text((cx-cell_w//2-180, cy-cell_h//2-80), "Peptidoglycan", fill=label_color, font=None)
    draw.text((cx-cell_w//2-180, cy-cell_h//2-60), "Cell Wall", fill='#64748b', font=None)
    
    # Flagellum label
    draw.line([(flag_x+100, flag_y), (flag_x+150, flag_y-40)], fill=label_color, width=2)
    draw.text((flag_x+160, flag_y-60), "Flagellum", fill=label_color, font=None)
    
    # Title
    draw.text((cx-150, 30), "Prokaryotic Cell Structure", fill='#1e3a5f', font=None)
    draw.text((cx-80, 55), "(Bacillus form)", fill='#64748b', font=None)
    
    ensure_dir('/workspaces/Learn/assets/images/mod1/lesson01/prokaryote-diagram.webp')
    img.save('/workspaces/Learn/assets/images/mod1/lesson01/prokaryote-diagram.webp', 'WEBP', quality=85, method=6)
    return img

def create_nucleoid_tem():
    """Lesson 1: TEM of nucleoid region (400x300)"""
    img = Image.new('RGB', (400, 300), '#1a1a2e')
    draw = ImageDraw.Draw(img)
    
    # Simulated TEM appearance (dark field with lighter structures)
    # Background grain
    for i in range(200):
        x, y = (i * 7) % 400, (i * 13) % 300
        draw.point((x, y), fill='#252542')
    
    # Nucleoid region (lighter fibrillar area)
    cx, cy = 200, 150
    for i in range(30):
        angle = i * 12
        for r in range(20, 80, 3):
            x = cx + int(r * math.cos(math.radians(angle + r)))
            y = cy + int(r * 0.6 * math.sin(math.radians(angle + r * 2)))
            if 0 <= x < 400 and 0 <= y < 300:
                draw.ellipse([x-2, y-2, x+2, y+2], fill='#6b7280')
    
    # Ribosomes (small dark dots)
    for _ in range(50):
        import random
        x = random.randint(50, 350)
        y = random.randint(50, 250)
        if ((x-cx)**2/10000 + (y-cy)**2/3600) > 1:  # Outside nucleoid
            draw.ellipse([x-2, y-2, x+2, y+2], fill='#374151')
    
    # Scale bar
    draw.rectangle([280, 270, 360, 278], fill='white')
    draw.text((285, 280), "0.5 µm", fill='white', font=None)
    
    draw.text((10, 10), "TEM: Nucleoid Region", fill='white', font=None)
    
    ensure_dir('/workspaces/Learn/assets/images/mod1/lesson01/nucleoid-tem.webp')
    img.save('/workspaces/Learn/assets/images/mod1/lesson01/nucleoid-tem.webp', 'WEBP', quality=85)
    return img

def create_70s_ribosome():
    """Lesson 1: 70S ribosome diagram (300x300)"""
    img = Image.new('RGB', (300, 300), '#f8fafc')
    draw = ImageDraw.Draw(img)
    
    cx, cy = 150, 150
    
    # 50S Large subunit (top)
    draw.pieslice([cx-70, cy-90, cx+70, cy+20], start=0, end=180, fill='#3b82f6', outline='#1d4ed8', width=3)
    draw.text((cx-20, cy-60), "50S", fill='white', font=None)
    
    # 30S Small subunit (bottom)
    draw.pieslice([cx-45, cy-10, cx+45, cy+80], start=180, end=360, fill='#10b981', outline='#059669', width=3)
    draw.text((cx-15, cy+30), "30S", fill='white', font=None)
    
    # mRNA channel
    draw.rectangle([cx-80, cy-5, cx+80, cy+5], fill='#fbbf24')
    
    # Labels
    draw.text((cx-40, 20), "70S Ribosome", fill='#1e3a5f', font=None)
    draw.text((cx-70, 260), "Prokaryotic (Bacterial)", fill='#64748b', font=None)
    
    ensure_dir('/workspaces/Learn/assets/images/mod1/lesson01/70s-ribosome.webp')
    img.save('/workspaces/Learn/assets/images/mod1/lesson01/70s-ribosome.webp', 'WEBP', quality=85)
    return img

def create_flagella_sem():
    """Lesson 1: SEM of flagella (400x400)"""
    img = Image.new('RGB', (400, 400), '#1a1a2e')
    draw = ImageDraw.Draw(img)
    
    # Simulated SEM appearance (3D shading effect)
    # Bacterial cell (coccus cluster)
    cells = [(150, 200), (220, 180), (180, 260), (250, 240)]
    for cx, cy in cells:
        # Shadow
        draw.ellipse([cx-42, cy-32, cx+42, cy+32], fill='#0f0f1a')
        # Cell body with 3D effect
        draw.ellipse([cx-40, cy-30, cx+40, cy+30], fill='#4b5563', outline='#6b7280')
        # Highlight
        draw.ellipse([cx-25, cy-20, cx-5, cy-5], fill='#9ca3af')
    
    # Flagella (wavy filaments)
    for i, (start_x, start_y) in enumerate([(180, 170), (240, 155), (200, 230)]):
        points = [(start_x, start_y)]
        for j in range(1, 15):
            x = start_x + j * 12
            y = start_y + int(15 * math.sin(j * 0.5 + i))
            points.append((x, y))
        for j in range(len(points)-1):
            draw.line([points[j], points[j+1]], fill='#d1d5db', width=5)
            draw.line([points[j], points[j+1]], fill='#9ca3af', width=3)
    
    # Scale bar
    draw.rectangle([280, 370, 360, 378], fill='white')
    draw.text((285, 380), "2 µm", fill='white', font=None)
    
    draw.text((10, 10), "SEM: Bacterial Flagella", fill='white', font=None)
    
    ensure_dir('/workspaces/Learn/assets/images/mod1/lesson01/flagella-sem.webp')
    img.save('/workspaces/Learn/assets/images/mod1/lesson01/flagella-sem.webp', 'WEBP', quality=85)
    return img

def create_nucleus_diagram():
    """Lesson 2: Nucleus diagram with layers (1000x800)"""
    img = Image.new('RGB', (1000, 800), '#f8fafc')
    draw = ImageDraw.Draw(img)
    
    cx, cy = 500, 400
    
    # Outer nuclear envelope
    draw.ellipse([cx-300, cy-250, cx+300, cy+250], outline='#3b82f6', width=4)
    
    # Inner nuclear envelope
    draw.ellipse([cx-290, cy-240, cx+290, cy+240], outline='#60a5fa', width=2)
    
    # Nuclear pores (distributed around envelope)
    for angle in range(0, 360, 20):
        rad = math.radians(angle)
        px = cx + int(295 * math.cos(rad))
        py = cy + int(245 * math.sin(rad))
        draw.ellipse([px-8, py-6, px+8, py+6], fill='#10b981', outline='#059669')
    
    # Nucleolus (dense region)
    draw.ellipse([cx-80, cy-20, cx+60, cy+100], fill='#f59e0b', outline='#d97706')
    draw.text((cx-35, cy+30), "Nucleolus", fill='#78350f', font=None)
    
    # Chromatin (dispersed throughout)
    for i in range(30):
        angle = i * 37
        r = 50 + (i * 7) % 180
        x = cx + int(r * math.cos(math.radians(angle)))
        y = cy + int(r * 0.7 * math.sin(math.radians(angle)))
        draw.ellipse([x-5, y-3, x+5, y+3], fill='#ec4899', outline='#db2777')
    
    # ER connection
    draw.polygon([(cx-200, cy-200), (cx-350, cy-350), (cx-300, cy-380), (cx-150, cy-230)], 
                 fill='#dbeafe', outline='#3b82f6')
    draw.text((cx-320, cy-320), "Rough ER", fill='#1e3a5f', font=None)
    
    # Labels
    draw.text((cx-100, 50), "Eukaryotic Nucleus", fill='#1e3a5f', font=None)
    draw.text((cx+320, cy-200), "Nuclear\nEnvelope", fill='#1e3a5f', font=None)
    draw.text((cx+310, cy+50), "Nuclear\nPores", fill='#059669', font=None)
    
    ensure_dir('/workspaces/Learn/assets/images/mod1/lesson02/nucleus-diagram.webp')
    img.save('/workspaces/Learn/assets/images/mod1/lesson02/nucleus-diagram.webp', 'WEBP', quality=85)
    return img

def create_nucleus_tem():
    """Lesson 2: TEM of nucleus (500x400)"""
    img = Image.new('RGB', (500, 400), '#1a1a2e')
    draw = ImageDraw.Draw(img)
    
    # Double membrane visible
    cx, cy = 250, 200
    
    # Outer nuclear envelope
    draw.arc([cx-200, cy-150, cx+200, cy+150], start=200, end=340, fill='#6b7280', width=4)
    # Inner nuclear envelope
    draw.arc([cx-190, cy-140, cx+190, cy+140], start=200, end=340, fill='#9ca3af', width=2)
    
    # Perinuclear space
    draw.arc([cx-195, cy-145, cx+195, cy+145], start=200, end=340, fill='#4b5563', width=1)
    
    # Nuclear pores (dark dots on envelope)
    for angle in range(200, 340, 15):
        rad = math.radians(angle)
        px = cx + int(195 * math.cos(rad))
        py = cy + int(145 * math.sin(rad))
        draw.ellipse([px-4, py-3, px+4, py+3], fill='#1f2937')
    
    # Nucleoplasm (granular texture)
    for i in range(100):
        x = cx + (i * 17) % 300 - 150
        y = cy + (i * 23) % 200 - 100
        draw.point((x, y), fill='#52525b')
    
    # Nucleolus (dense dark region)
    draw.ellipse([cx-40, cy-30, cx+30, cy+40], fill='#27272a')
    
    # Scale bar
    draw.rectangle([350, 370, 430, 378], fill='white')
    draw.text((355, 380), "0.5 µm", fill='white', font=None)
    
    draw.text((10, 10), "TEM: Nuclear Envelope & Pores", fill='white', font=None)
    
    ensure_dir('/workspaces/Learn/assets/images/mod1/lesson02/nucleus-tem.webp')
    img.save('/workspaces/Learn/assets/images/mod1/lesson02/nucleus-tem.webp', 'WEBP', quality=85)
    return img

def create_er_rough():
    """Lesson 2: Rough ER diagram (400x300)"""
    img = Image.new('RGB', (400, 300), '#f8fafc')
    draw = ImageDraw.Draw(img)
    
    # ER membrane (wavy lines)
    points_top = [(i, 100 + int(20 * math.sin(i * 0.05))) for i in range(0, 400, 10)]
    points_bottom = [(i, 180 + int(20 * math.sin(i * 0.05 + 1))) for i in range(0, 400, 10)]
    
    # Draw ER lumen (between membranes)
    all_points = points_top + points_bottom[::-1]
    draw.polygon(all_points, fill='#dbeafe', outline='#3b82f6')
    
    # Ribosomes (dots on top membrane)
    for x in range(20, 380, 25):
        y = 100 + int(20 * math.sin(x * 0.05)) - 8
        draw.ellipse([x-5, y-5, x+5, y+5], fill='#10b981', outline='#059669')
    
    # Labels
    draw.text((20, 20), "Rough Endoplasmic Reticulum", fill='#1e3a5f', font=None)
    draw.text((20, 240), "Ribosomes", fill='#059669', font=None)
    draw.text((200, 140), "ER Lumen", fill='#1e3a5f', font=None)
    
    ensure_dir('/workspaces/Learn/assets/images/mod1/lesson02/er-rough.webp')
    img.save('/workspaces/Learn/assets/images/mod1/lesson02/er-rough.webp', 'WEBP', quality=85)
    return img

def create_nucleolus_diagram():
    """Lesson 2: Nucleolus structure (400x400)"""
    img = Image.new('RGB', (400, 400), '#f8fafc')
    draw = ImageDraw.Draw(img)
    
    cx, cy = 200, 200
    
    # Nucleolus boundary (not a membrane!)
    draw.ellipse([cx-150, cy-150, cx+150, cy+150], outline='#d97706', width=3, fill='#fef3c7')
    
    # Fibrillar centre (inner)
    draw.ellipse([cx-60, cy-60, cx+60, cy+60], fill='#fbbf24', outline='#f59e0b')
    draw.text((cx-35, cy-10), "Fibrillar\nCentre", fill='#78350f', font=None)
    
    # Dense fibrillar component (ring)
    for r in range(70, 100, 10):
        draw.ellipse([cx-r, cy-r, cx+r, cy+r], outline='#f59e0b', width=8)
    
    # Granular component (outer)
    for angle in range(0, 360, 10):
        rad = math.radians(angle)
        for r in range(110, 140, 15):
            x = cx + int(r * math.cos(rad))
            y = cy + int(r * math.sin(rad))
            draw.ellipse([x-4, y-4, x+4, y+4], fill='#fcd34d')
    
    # Labels
    draw.text((cx-50, 20), "Nucleolus Structure", fill='#1e3a5f', font=None)
    draw.text((cx+70, cy-80), "Dense\nFibrillar", fill='#92400e', font=None)
    draw.text((cx+110, cy+50), "Granular\nComponent", fill='#92400e', font=None)
    
    ensure_dir('/workspaces/Learn/assets/images/mod1/lesson02/nucleolus-diagram.webp')
    img.save('/workspaces/Learn/assets/images/mod1/lesson02/nucleolus-diagram.webp', 'WEBP', quality=85)
    return img

def create_lm_vs_tem():
    """Lesson 3: LM vs TEM comparison (800x400)"""
    img = Image.new('RGB', (800, 400), '#f8fafc')
    draw = ImageDraw.Draw(img)
    
    # Left side - LM image (colourful but low detail)
    draw.rectangle([20, 50, 380, 350], fill='#fef3c7', outline='#d97706', width=2)
    
    # Draw simple cell (LM view)
    cx1 = 200
    draw.ellipse([cx1-100, 120, cx1+100, 280], fill='#dbeafe', outline='#3b82f6', width=3)
    # Nucleus visible
    draw.ellipse([cx1-40, 170, cx1+40, 230], fill='#8b5cf6', outline='#7c3aed')
    draw.text((cx1-30, 190), "N", fill='white', font=None)
    # Cell wall visible
    draw.ellipse([cx1-105, 115, cx1+105, 285], outline='#10b981', width=4)
    
    draw.text((cx1-80, 70), "Light Microscope", fill='#1e3a5f', font=None)
    draw.text((cx1-70, 300), "Resolution: ~200 nm", fill='#64748b', font=None)
    draw.text((cx1-50, 320), "Can see: Nucleus", fill='#64748b', font=None)
    
    # Arrow
    draw.polygon([(390, 180), (410, 200), (390, 220)], fill='#64748b')
    
    # Right side - TEM image (greyscale but high detail)
    draw.rectangle([420, 50, 780, 350], fill='#1a1a2e', outline='#475569', width=2)
    
    cx2 = 600
    # Cell outline
    draw.ellipse([cx2-100, 120, cx2+100, 280], outline='#6b7280', width=2)
    # Nucleus with envelope
    draw.ellipse([cx2-45, 165, cx2+45, 235], outline='#9ca3af', width=2)
    # Nuclear pores
    for angle in range(0, 360, 30):
        rad = math.radians(angle)
        px = cx2 + int(40 * math.cos(rad))
        py = 200 + int(30 * math.sin(rad))
        draw.ellipse([px-3, py-2, px+3, py+2], fill='#374151')
    # Mitochondria visible
    draw.ellipse([cx2-80, 140, cx2-40, 170], outline='#6b7280')
    draw.ellipse([cx2+30, 240, cx2+70, 270], outline='#6b7280')
    # Ribosomes (tiny dots)
    for _ in range(30):
        import random
        x = cx2 + random.randint(-90, 90)
        y = random.randint(130, 270)
        draw.point((x, y), fill='#4b5563')
    
    draw.text((cx2-100, 70), "Transmission EM", fill='#f8fafc', font=None)
    draw.text((cx2-90, 300), "Resolution: ~0.2 nm", fill='#9ca3af', font=None)
    draw.text((cx2-110, 320), "Can see: Ribosomes, membranes", fill='#9ca3af', font=None)
    
    ensure_dir('/workspaces/Learn/assets/images/mod1/lesson03/lm-vs-tem-comparison.webp')
    img.save('/workspaces/Learn/assets/images/mod1/lesson03/lm-vs-tem-comparison.webp', 'WEBP', quality=85)
    return img

def create_sem_pollen():
    """Lesson 3: SEM pollen (400x400)"""
    img = Image.new('RGB', (400, 400), '#1a1a2e')
    draw = ImageDraw.Draw(img)
    
    # Multiple pollen grains with 3D effect
    grains = [(120, 150, 60), (280, 180, 50), (200, 280, 70), (320, 300, 40)]
    
    for cx, cy, r in grains:
        # Shadow
        draw.ellipse([cx-r-5, cy-r//2+10, cx+r+5, cy+r//2+20], fill='#0f0f1a')
        # Main body with spherical shading
        for i in range(r, 0, -2):
            color_val = 60 + int((r-i) * 2)
            color = f'#{color_val:02x}{color_val:02x}{color_val+20:02x}'
            draw.ellipse([cx-i, cy-i//2, cx+i, cy+i//2], fill=color)
        # Surface texture (exine patterns)
        for angle in range(0, 360, 20):
            rad = math.radians(angle)
            for dist in range(10, r-5, 15):
                x = cx + int(dist * math.cos(rad))
                y = cy + int(dist * 0.5 * math.sin(rad))
                if (x-cx)**2 + (y-cy)**2*4 < r*r:
                    draw.ellipse([x-3, y-2, x+3, y+2], fill='#374151')
    
    # Scale bar
    draw.rectangle([280, 370, 360, 378], fill='white')
    draw.text((285, 380), "10 µm", fill='white', font=None)
    
    draw.text((10, 10), "SEM: Pollen Grains (3D Surface)", fill='white', font=None)
    
    ensure_dir('/workspaces/Learn/assets/images/mod1/lesson03/sem-pollen.webp')
    img.save('/workspaces/Learn/assets/images/mod1/lesson03/sem-pollen.webp', 'WEBP', quality=85)
    return img

def create_tem_mitochondria():
    """Lesson 3: TEM mitochondria (400x400)"""
    img = Image.new('RGB', (400, 400), '#1a1a2e')
    draw = ImageDraw.Draw(img)
    
    # Mitochondria cross-section
    cx, cy = 200, 200
    
    # Outer membrane
    draw.ellipse([cx-120, cy-80, cx+120, cy+80], outline='#6b7280', width=3)
    # Inner membrane (cristae)
    draw.ellipse([cx-110, cy-70, cx+110, cy+70], outline='#9ca3af', width=1)
    
    # Cristae folds (invaginations)
    for angle in [45, 90, 135, 225, 270, 315]:
        rad = math.radians(angle)
        r_inner, r_outer = 60, 105
        x1 = cx + int(r_inner * math.cos(rad))
        y1 = cy + int(r_inner * 0.6 * math.sin(rad))
        x2 = cx + int(r_outer * math.cos(rad))
        y2 = cy + int(r_outer * 0.6 * math.sin(rad))
        draw.line([(x1, y1), (x2, y2)], fill='#9ca3af', width=3)
        # Crista membrane fold back
        x3 = cx + int((r_outer-10) * math.cos(rad + 0.2))
        y3 = cy + int((r_outer-10) * 0.6 * math.sin(rad + 0.2))
        draw.line([(x2, y2), (x3, y3)], fill='#9ca3af', width=2)
    
    # Matrix (granular interior)
    for i in range(50):
        angle = i * 37
        r = (i * 11) % 50
        x = cx + int(r * math.cos(math.radians(angle)))
        y = cy + int(r * 0.6 * math.sin(math.radians(angle)))
        draw.point((x, y), fill='#52525b')
    
    # Scale bar
    draw.rectangle([280, 370, 360, 378], fill='white')
    draw.text((285, 380), "0.5 µm", fill='white', font=None)
    
    draw.text((10, 10), "TEM: Mitochondrion (Cristae Visible)", fill='white', font=None)
    
    ensure_dir('/workspaces/Learn/assets/images/mod1/lesson03/tem-mitochondria.webp')
    img.save('/workspaces/Learn/assets/images/mod1/lesson03/tem-mitochondria.webp', 'WEBP', quality=85)
    return img

def create_light_microscope():
    """Lesson 3: Light microscope diagram (600x800)"""
    img = Image.new('RGB', (600, 800), '#f8fafc')
    draw = ImageDraw.Draw(img)
    
    cx = 300
    
    # Eyepiece (top)
    draw.rectangle([cx-30, 50, cx+30, 150], fill='#64748b', outline='#475569', width=2)
    draw.ellipse([cx-35, 40, cx+35, 60], fill='#94a3b8')
    draw.text((cx-25, 20), "Eyepiece (10×)", fill='#1e3a5f', font=None)
    
    # Body tube
    draw.rectangle([cx-40, 150, cx+40, 300], fill='#e2e8f0', outline='#64748b', width=2)
    
    # Revolving nosepiece
    draw.polygon([(cx-50, 300), (cx+50, 300), (cx+60, 330), (cx-60, 330)], fill='#64748b')
    
    # Objective lenses (4x, 10x, 40x, 100x)
    objectives = [
        (cx-90, 330, "4×"),
        (cx-30, 330, "10×"),
        (cx+30, 330, "40×"),
        (cx+90, 330, "100× oil")
    ]
    for ox, oy, label in objectives:
        draw.polygon([(ox-20, oy), (ox+20, oy), (ox+15, oy+80), (ox-15, oy+80)], fill='#3b82f6', outline='#1d4ed8')
        draw.text((ox-15, oy+35), label, fill='white', font=None)
    
    # Stage
    draw.rectangle([cx-150, 450, cx+150, 470], fill='#475569', outline='#1e293b', width=2)
    draw.rectangle([cx-120, 430, cx+120, 450], fill='#f1f5f9', outline='#64748b')  # Stage opening
    draw.text((cx-40, 475), "Stage", fill='#1e3a5f', font=None)
    
    # Specimen slide
    draw.rectangle([cx-100, 435, cx+100, 450], fill='#dbeafe', outline='#3b82f6')
    
    # Condenser (below stage)
    draw.polygon([(cx-60, 500), (cx+60, 500), (cx+40, 560), (cx-40, 560)], fill='#10b981', outline='#059669')
    draw.text((cx-45, 520), "Condenser", fill='white', font=None)
    
    # Light source
    draw.rectangle([cx-50, 700, cx+50, 750], fill='#f59e0b', outline='#d97706', width=2)
    draw.ellipse([cx-30, 660, cx+30, 700], fill='#fcd34d')
    draw.text((cx-40, 755), "Light Source", fill='#1e3a5f', font=None)
    
    # Light rays
    for offset in [-20, 0, 20]:
        draw.line([(cx+offset, 680), (cx+offset*0.3, 530)], fill='#fcd34d', width=2)
    
    # Base
    draw.rectangle([cx-100, 750, cx+100, 780], fill='#1e293b', outline='#0f172a')
    
    # Arm
    draw.polygon([(cx+40, 150), (cx+100, 150), (cx+100, 700), (cx+60, 700)], fill='#64748b', outline='#475569')
    
    # Title
    draw.text((cx-120, 5), "Compound Light Microscope", fill='#1e3a5f', font=None)
    
    ensure_dir('/workspaces/Learn/assets/images/mod1/lesson03/light-microscope-diagram.webp')
    img.save('/workspaces/Learn/assets/images/mod1/lesson03/light-microscope-diagram.webp', 'WEBP', quality=85)
    return img

def create_scale_bar_example():
    """Lesson 3: Scale bar calculation practice (500x400)"""
    img = Image.new('RGB', (500, 400), '#f8fafc')
    draw = ImageDraw.Draw(img)
    
    # Draw a cell-like shape
    cx, cy = 250, 200
    draw.ellipse([cx-150, cy-100, cx+150, cy+100], fill='#dbeafe', outline='#3b82f6', width=3)
    
    # Nucleus
    draw.ellipse([cx-40, cy-30, cx+40, cy+30], fill='#8b5cf6', outline='#7c3aed')
    
    # Some organelles
    draw.ellipse([cx-100, cy-50, cx-60, cy-20], outline='#10b981', width=2)
    draw.ellipse([cx+60, cy+20, cx+110, cy+60], outline='#10b981', width=2)
    
    # Scale bar
    draw.rectangle([50, 350, 150, 362], fill='#1e293b')
    draw.text((55, 365), "Scale bar = 20 µm", fill='#1e293b', font=None)
    
    # Measurement prompt
    draw.text((200, 365), "Measure the cell diameter!", fill='#1e3a5f', font=None)
    
    # Title
    draw.text((cx-100, 20), "Practice: Calculate Actual Size", fill='#1e3a5f', font=None)
    
    ensure_dir('/workspaces/Learn/assets/images/mod1/lesson03/scale-bar-example.webp')
    img.save('/workspaces/Learn/assets/images/mod1/lesson03/scale-bar-example.webp', 'WEBP', quality=85)
    return img

def create_thumbnails():
    """Create 200x150 thumbnails for all images"""
    import glob
    
    base_path = '/workspaces/Learn/assets/images/mod1'
    
    for lesson in ['lesson01', 'lesson02', 'lesson03']:
        image_dir = os.path.join(base_path, lesson)
        thumb_dir = os.path.join(image_dir, 'thumbnails')
        os.makedirs(thumb_dir, exist_ok=True)
        
        webp_files = glob.glob(os.path.join(image_dir, '*.webp'))
        
        for webp_file in webp_files:
            filename = os.path.basename(webp_file)
            thumb_path = os.path.join(thumb_dir, filename.replace('.webp', '-thumb.webp'))
            
            try:
                img = Image.open(webp_file)
                img.thumbnail((200, 150), Image.Resampling.LANCZOS)
                img.save(thumb_path, 'WEBP', quality=75)
                print(f"Created thumbnail: {thumb_path}")
            except Exception as e:
                print(f"Error creating thumbnail for {webp_file}: {e}")

def main():
    print("Creating educational diagrams for HSC Biology Module 1...")
    
    # Lesson 1 images
    print("Creating Lesson 1 images...")
    create_prokaryote_diagram()
    create_nucleoid_tem()
    create_70s_ribosome()
    create_flagella_sem()
    
    # Lesson 2 images
    print("Creating Lesson 2 images...")
    create_nucleus_diagram()
    create_nucleus_tem()
    create_er_rough()
    create_nucleolus_diagram()
    
    # Lesson 3 images
    print("Creating Lesson 3 images...")
    create_lm_vs_tem()
    create_sem_pollen()
    create_tem_mitochondria()
    create_light_microscope()
    create_scale_bar_example()
    
    # Create thumbnails
    print("Creating thumbnails...")
    create_thumbnails()
    
    print("\nAll images created successfully!")
    
    # Print file sizes
    import glob
    base_path = '/workspaces/Learn/assets/images/mod1'
    for lesson in ['lesson01', 'lesson02', 'lesson03']:
        print(f"\n{lesson}:")
        for webp_file in glob.glob(os.path.join(base_path, lesson, '*.webp')):
            size_kb = os.path.getsize(webp_file) / 1024
            print(f"  {os.path.basename(webp_file)}: {size_kb:.1f} KB")

if __name__ == '__main__':
    main()
