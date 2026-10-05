import os
import subprocess
import glob

# Configuration des 7 scènes
scenes = [
    {
        "id": "scene1",
        "image": "landing_hero_full.png",
        "audio": "pub_audio_scene1.mp3",
        "title": "CRÉDITTRACK PRO • GESTION COMMERCIALE UNIVERSELLE",
        "subtitle": "Fini les pertes de caisse & les carnets perdus | Application PWA 1-Clic Mobile & PC"
    },
    {
        "id": "scene2",
        "image": "hero_dashboard_pro.jpg",
        "audio": "pub_audio_scene2.mp3",
        "title": "TABLEAU DE BORD GÉRANT • VUE CHIRURGICALE EN DIRECT",
        "subtitle": "Chiffre d'affaires en temps réel | Suivi des créances clients | Taux de recouvrement 95.4%"
    },
    {
        "id": "scene3",
        "image": "img_caissier_officiel.jpg",
        "audio": "pub_audio_scene3.mp3",
        "title": "CAHIER DU JOUR DIGITAL • ENCAISSEMENT EN 5 SECONDES",
        "subtitle": "Saisie express ventes comptant & crédit | Reçus digitaux certifiés QR Code"
    },
    {
        "id": "scene4",
        "image": "scene_mobile_money.jpg",
        "audio": "pub_audio_scene4.mp3",
        "title": "RECOUVREMENT INTELLIGENT • RAPPELS WHATSAPP & MOBILE MONEY",
        "subtitle": "Rappels automatiques bienveillants | Paiement en 1 clic par Wave, MoMo & Orange Money"
    },
    {
        "id": "scene5",
        "image": "scene_stock_marges.jpg",
        "audio": "pub_audio_scene5.mp3",
        "title": "DÉPENSES, STOCKS & FOURNISSEURS • MAÎTRISE DU PROFIT",
        "subtitle": "Calcul automatique du bénéfice net réel | Contrôle rigoureux de vos flux de trésorerie"
    },
    {
        "id": "scene6",
        "image": "img_patron_officiel.jpg",
        "audio": "pub_audio_scene6.mp3",
        "title": "CLÔTURE DU SOIR & ÉTANCHÉITÉ PATRON • SÉCURITÉ TOTALE",
        "subtitle": "Bilan certifié reçu sur WhatsApp à 19h00 | Marges & trésorerie invisibles aux caissiers"
    },
    {
        "id": "scene7",
        "image": "maquette_fusion_hybride.jpg",
        "audio": "pub_audio_scene7.mp3",
        "title": "REJOIGNEZ LA RÉVOLUTION COMMERCIALE CRÉDITTRACK PRO",
        "subtitle": "Testez gratuitement dès maintenant sur : credit-track00.vercel.app"
    }
]

def get_audio_duration(audio_file):
    cmd = ['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'default=noprint_wrappers=1:nokey=1', audio_file]
    res = subprocess.run(cmd, capture_output=True, text=True)
    return float(res.stdout.strip())

def build_scene_clip(idx, scene, font_path):
    clip_name = f"clip_{idx}.mp4"
    audio_dur = get_audio_duration(scene["audio"])
    fps = 25
    total_frames = int(audio_dur * fps) + 5
    
    title_file = f"temp_title_{idx}.txt"
    sub_file = f"temp_sub_{idx}.txt"
    
    with open(title_file, "w", encoding="utf-8") as f:
        f.write(scene["title"])
    with open(sub_file, "w", encoding="utf-8") as f:
        f.write(scene["subtitle"])
        
    title_file_esc = title_file.replace("\\", "/")
    sub_file_esc = sub_file.replace("\\", "/")
    
    # Zoompan effect : zoom lent avant élégant
    # Overlay bandeaux semi-transparents + drawtext avec textfile
    vf = (
        f"scale=1280:720,"
        f"zoompan=z='min(zoom+0.0003,1.10)':d={total_frames}:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1280x720:fps={fps},"
        f"drawbox=y=0:w=1280:h=70:color=black@0.75:t=fill,"
        f"drawbox=y=640:w=1280:h=80:color=black@0.85:t=fill,"
        f"drawbox=y=638:w=1280:h=2:color=0x2563EB:t=fill,"
        f"drawtext=fontfile='{font_path}':textfile='{title_file_esc}':fontsize=25:fontcolor=0x60A5FA:x=(w-text_w)/2:y=22,"
        f"drawtext=fontfile='{font_path}':textfile='{sub_file_esc}':fontsize=20:fontcolor=0xFFFFFF:x=(w-text_w)/2:y=665,"
        f"fade=t=in:st=0:d=0.5,fade=t=out:st={audio_dur-0.5:.2f}:d=0.5"
    )
    
    cmd = [
        'ffmpeg', '-y',
        '-loop', '1', '-i', scene["image"],
        '-i', scene["audio"],
        '-vf', vf,
        '-c:v', 'libx264', '-preset', 'veryfast', '-pix_fmt', 'yuv420p',
        '-c:a', 'aac', '-b:a', '192k',
        '-t', f"{audio_dur:.2f}",
        clip_name
    ]
    
    print(f"--> Building {clip_name} ({audio_dur:.2f}s) for {scene['title']}...")
    res = subprocess.run(cmd, capture_output=True, text=True)
    
    # Nettoyage fichiers texte temporaires
    try:
        os.remove(title_file)
        os.remove(sub_file)
    except:
        pass
        
    if res.returncode != 0:
        print(f"ERROR on {clip_name}:", res.stderr[-500:])
        raise RuntimeError(f"FFmpeg failed for {clip_name}")
        
    print(f"SUCCESS {clip_name} ready.")
    return clip_name

def main():
    font_path = "C\\:/Windows/Fonts/segoeui.ttf"
    clip_files = []
    
    for i, s in enumerate(scenes, 1):
        clip = build_scene_clip(i, s, font_path)
        clip_files.append(clip)
        
    # Write concat list
    concat_txt = "concat_list.txt"
    with open(concat_txt, "w", encoding="utf-8") as f:
        for c in clip_files:
            f.write(f"file '{c}'\n")
            
    final_output = "publicite_credittrack_officielle.mp4"
    print(f"--> Concatenating all {len(clip_files)} scenes into {final_output}...")
    
    cmd_concat = [
        'ffmpeg', '-y',
        '-f', 'concat', '-safe', '0',
        '-i', concat_txt,
        '-c', 'copy',
        final_output
    ]
    res = subprocess.run(cmd_concat, capture_output=True, text=True)
    if res.returncode != 0:
        print("ERROR on concat:", res.stderr[-500:])
        raise RuntimeError("Concat failed")
        
    print(f"*** FINAL VIDEO CREATED: {final_output} ***")
    
    # Nettoyage clips intermédiaires
    for c in clip_files:
        try:
            os.remove(c)
        except:
            pass
    try:
        os.remove(concat_txt)
    except:
        pass
        
    final_sz = os.path.getsize(final_output) // 1024
    print(f"File size: {final_sz} KB")

if __name__ == "__main__":
    main()
