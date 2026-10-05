import os
import subprocess

# Storyboard optimisé mettant en scène la Dame Gérante dans son bureau, 
# la Dame au comptoir de vente et l'application CréditTrack PRO en action directe.

audio_tracks = [
    {"file": "v2_audio_part1.mp3", "dur": 15.84},
    {"file": "v2_audio_part2.mp3", "dur": 17.52},
    {"file": "v2_audio_part3.mp3", "dur": 15.22},
    {"file": "v2_audio_part4.mp3", "dur": 15.67},
    {"file": "v2_audio_part5.mp3", "dur": 14.83},
    {"file": "v2_audio_part6.mp3", "dur": 12.55},
]

storyboard = [
    # --- PARTIE 1 : La Dame gérante dans son bureau & le problème des vieux carnets (15.84s) ---
    {
        "part": 1,
        "shots": [
            {
                "img": "dame_gerante_bureau.jpg",
                "dur": 4.10,
                "zoom": "min(zoom+0.0018,1.20)",
                "x": "iw/2-(iw/zoom/2)", "y": "ih/2-(ih/zoom/2)",
                "banner": "CHERS CONFRÈRES COMMERÇANTS",
                "sub": "Gérez votre boutique avec clarté, sérénité et modernité"
            },
            {
                "img": "img_caissier_officiel.jpg",
                "dur": 3.90,
                "zoom": "1.22-0.0015*on",
                "x": "iw/3-(iw/zoom/3)", "y": "ih/2-(ih/zoom/2)",
                "banner": "FINIS LES CARNETS PERDUS OU DÉCHIRÉS",
                "sub": "Combien d'argent dort dehors chez vos clients en ce moment ?"
            },
            {
                "img": "dame_comptoir_vente.jpg",
                "dur": 3.90,
                "zoom": "min(zoom+0.002,1.22)",
                "x": "iw/2-(iw/zoom/2)", "y": "ih/3-(ih/zoom/3)",
                "banner": "LA SOLUTION MODERNE TOUT-EN-UN",
                "sub": "Enregistrez vos ventes et vos crédits sans dispute"
            },
            {
                "img": "landing_hero_full.png",
                "dur": 3.94,
                "zoom": "1.1+0.0012*on",
                "x": "iw/2-(iw/zoom/2)", "y": "ih/2-(ih/zoom/2)",
                "banner": "DÉCOUVREZ CRÉDITTRACK PRO",
                "sub": "Accessible en 1 clic sur Smartphone et Ordinateur"
            }
        ]
    },

    # --- PARTIE 2 : Dashboard Chirurgical & La Dame au bureau (17.52s) ---
    {
        "part": 2,
        "shots": [
            {
                "img": "hero_dashboard_pro.jpg",
                "dur": 4.50,
                "zoom": "min(zoom+0.002,1.22)",
                "x": "iw/3-(iw/zoom/3)", "y": "ih/3-(ih/zoom/3)",
                "banner": "TABLEAU DE BORD CHIRURGICAL EN DIRECT",
                "sub": "Chiffre d'affaires encaissé et créances suivies au centime près"
            },
            {
                "img": "dame_gerante_bureau.jpg",
                "dur": 4.20,
                "zoom": "1.25-0.0018*on",
                "x": "iw/2-(iw/zoom/2)", "y": "ih/2-(ih/zoom/2)",
                "banner": "PILOTEZ VOTRE COMMERCE EN TOUTE SÉRÉNITÉ",
                "sub": "Visualisez en un instant l'état de votre trésorerie"
            },
            {
                "img": "hero_dashboard_pro.jpg",
                "dur": 4.50,
                "zoom": "min(zoom+0.0025,1.25)",
                "x": "2*iw/3-(iw/zoom/3)", "y": "ih/2-(ih/zoom/2)",
                "banner": "TAUX DE RECOUVREMENT RECORD : 95.4%",
                "sub": "Vos créances clients sont automatiquement tracées"
            },
            {
                "img": "scene_stock_marges.jpg",
                "dur": 4.32,
                "zoom": "min(zoom+0.002,1.20)",
                "x": "iw/2-(iw/zoom/2)", "y": "ih/3-(ih/zoom/3)",
                "banner": "SÉRÉNITÉ & CONTRÔLE FINANCIER ABSOLU",
                "sub": "Zéro trou de caisse, zéro surprise à la fin du mois"
            }
        ]
    },

    # --- PARTIE 3 : La Dame au comptoir & Saisie en 5s & Reçu QR Code (15.22s) ---
    {
        "part": 3,
        "shots": [
            {
                "img": "dame_comptoir_vente.jpg",
                "dur": 4.00,
                "zoom": "min(zoom+0.0025,1.25)",
                "x": "iw/2-(iw/zoom/2)", "y": "ih/2-(ih/zoom/2)",
                "banner": "AU COMPTOIR : VENTE EN 5 SECONDES CHRONO",
                "sub": "Saisissez les ventes au comptant et à crédit en 5 secondes"
            },
            {
                "img": "maquette_fusion_hybride.jpg",
                "dur": 3.80,
                "zoom": "1.22-0.0015*on",
                "x": "iw/2-(iw/zoom/2)", "y": "ih/2-(ih/zoom/2)",
                "banner": "REÇU OFFICIEL CERTIFIÉ AVEC QR CODE",
                "sub": "Reçu numérique infalsifiable avec signature tactile"
            },
            {
                "img": "dame_comptoir_vente.jpg",
                "dur": 3.80,
                "zoom": "min(zoom+0.0018,1.20)",
                "x": "iw/3-(iw/zoom/3)", "y": "ih/2-(ih/zoom/2)",
                "banner": "FINIS LES OUBLIS & LES CONTESTATIONS",
                "sub": "Chaque article et chaque acompte client sont validés"
            },
            {
                "img": "landing_hero_full.png",
                "dur": 3.62,
                "zoom": "min(zoom+0.002,1.18)",
                "x": "iw/2-(iw/zoom/2)", "y": "ih/3-(ih/zoom/3)",
                "banner": "RAPIDITÉ & FLUIDITÉ DU SERVICE CLIENT",
                "sub": "Fini les files d'attente, servez vos clients avec efficacité"
            }
        ]
    },

    # --- PARTIE 4 : Relances WhatsApp & Mobile Money (15.67s) ---
    {
        "part": 4,
        "shots": [
            {
                "img": "scene_mobile_money.jpg",
                "dur": 4.00,
                "zoom": "min(zoom+0.0025,1.25)",
                "x": "iw/2-(iw/zoom/2)", "y": "ih/3-(ih/zoom/3)",
                "banner": "RAPPELS WHATSAPP AUTOMATIQUES & COURTOIS",
                "sub": "À l'échéance convenue, un rappel bienveillant part au client"
            },
            {
                "img": "maquette_fusion_hybride.jpg",
                "dur": 4.00,
                "zoom": "1.25-0.0018*on",
                "x": "iw/2-(iw/zoom/2)", "y": "ih/2-(ih/zoom/2)",
                "banner": "PAIEMENT DIRECT : WAVE, MOMO, ORANGE MONEY",
                "sub": "Vos clients paient directement depuis leur téléphone"
            },
            {
                "img": "scene_mobile_money.jpg",
                "dur": 4.00,
                "zoom": "min(zoom+0.002,1.20)",
                "x": "iw/3-(iw/zoom/3)", "y": "ih/2-(ih/zoom/2)",
                "banner": "NOTIFICATION : FACTURE RÉGLÉE ✓",
                "sub": "Votre compte Mobile Money est immédiatement crédité"
            },
            {
                "img": "dame_gerante_bureau.jpg",
                "dur": 3.67,
                "zoom": "min(zoom+0.0015,1.16)",
                "x": "iw/2-(iw/zoom/2)", "y": "ih/2-(ih/zoom/2)",
                "banner": "VOTRE TRÉSORERIE RESPIRE ENFIN",
                "sub": "Récupérez votre argent sans dispute et sans gêne"
            }
        ]
    },

    # --- PARTIE 5 : Clôture certifiée à 19h00 & Sécurité Patron (14.83s) ---
    {
        "part": 5,
        "shots": [
            {
                "img": "dame_gerante_bureau.jpg",
                "dur": 4.00,
                "zoom": "min(zoom+0.0025,1.25)",
                "x": "iw/2-(iw/zoom/2)", "y": "ih/2-(ih/zoom/2)",
                "banner": "CHAQUE SOIR À 19H00 : CLÔTURE DE CAISSE CERTIFIÉE",
                "sub": "Le bilan complet de votre boutique reçu sur votre téléphone"
            },
            {
                "img": "scene_stock_marges.jpg",
                "dur": 3.80,
                "zoom": "1.22-0.0015*on",
                "x": "iw/2-(iw/zoom/2)", "y": "ih/3-(ih/zoom/3)",
                "banner": "ÉTANCHÉITÉ STRICTE VENDEURS / GÉRANT",
                "sub": "Vos caissiers encaissent, mais vos marges réelles restent secrètes"
            },
            {
                "img": "hero_dashboard_pro.jpg",
                "dur": 3.80,
                "zoom": "min(zoom+0.002,1.20)",
                "x": "iw/3-(iw/zoom/3)", "y": "ih/2-(ih/zoom/2)",
                "banner": "BÉNÉFICES RÉELS 100% SÉCURISÉS",
                "sub": "Gardez le contrôle absolu sur votre rentabilité"
            },
            {
                "img": "dame_gerante_bureau.jpg",
                "dur": 3.23,
                "zoom": "min(zoom+0.002,1.18)",
                "x": "2*iw/3-(iw/zoom/3)", "y": "ih/2-(ih/zoom/2)",
                "banner": "TRANQUILLITÉ D'ESPRIT TOTALE",
                "sub": "Pilotez vos affaires l'esprit tranquille chaque jour"
            }
        ]
    },

    # --- PARTIE 6 : Call-to-Action & Démarrage Gratuit (12.55s) ---
    {
        "part": 6,
        "shots": [
            {
                "img": "dame_comptoir_vente.jpg",
                "dur": 4.00,
                "zoom": "min(zoom+0.0025,1.25)",
                "x": "iw/2-(iw/zoom/2)", "y": "ih/2-(ih/zoom/2)",
                "banner": "REJOIGNEZ LES COMMERÇANTS QUI RÉUSSISSENT",
                "sub": "Prenez le contrôle absolu de vos bénéfices dès aujourd'hui"
            },
            {
                "img": "landing_hero_full.png",
                "dur": 4.50,
                "zoom": "1.2-0.0015*on",
                "x": "iw/2-(iw/zoom/2)", "y": "ih/2-(ih/zoom/2)",
                "banner": "ESSAYEZ GRATUITEMENT PENDANT 3 MOIS",
                "sub": "Rendez-vous sur : credit-track00.vercel.app"
            },
            {
                "img": "hero_dashboard_pro.jpg",
                "dur": 4.05,
                "zoom": "min(zoom+0.0025,1.25)",
                "x": "iw/2-(iw/zoom/2)", "y": "ih/2-(ih/zoom/2)",
                "banner": "CRÉDITTRACK PRO • INSTANTANÉ SUR MOBILE & PC",
                "sub": "Sans carte bancaire • Fonctionne même sans Internet !"
            }
        ]
    }
]

def build_shot_clip(shot_id, shot, font_path):
    clip_name = f"shot_dame_{shot_id}.mp4"
    fps = 25
    frames = int(shot["dur"] * fps) + 5
    
    t_file = f"temp_td_{shot_id}.txt"
    s_file = f"temp_sd_{shot_id}.txt"
    with open(t_file, "w", encoding="utf-8") as f:
        f.write(shot["banner"])
    with open(s_file, "w", encoding="utf-8") as f:
        f.write(shot["sub"])
        
    t_esc = t_file.replace("\\", "/")
    s_esc = s_file.replace("\\", "/")
    
    # Motion dynamic filter avec travelling cinéma, bandeau supérieur et sous-titres premium
    vf = (
        f"scale=1280:720,"
        f"zoompan=z='{shot['zoom']}':d={frames}:x='{shot['x']}':y='{shot['y']}':s=1280x720:fps={fps},"
        f"drawbox=y=0:w=1280:h=70:color=black@0.82:t=fill,"
        f"drawbox=y=630:w=1280:h=90:color=black@0.90:t=fill,"
        f"drawbox=y=628:w=1280:h=3:color=0x2563EB:t=fill,"
        f"drawtext=fontfile='{font_path}':textfile='{t_esc}':fontsize=25:fontcolor=0x38BDF8:x=(w-text_w)/2:y=22,"
        f"drawtext=fontfile='{font_path}':textfile='{s_esc}':fontsize=21:fontcolor=0xFFFFFF:x=(w-text_w)/2:y=660,"
        f"fade=t=in:st=0:d=0.3,fade=t=out:st={shot['dur']-0.3:.2f}:d=0.3"
    )
    
    cmd = [
        'ffmpeg', '-y',
        '-loop', '1', '-i', shot["img"],
        '-vf', vf,
        '-c:v', 'libx264', '-preset', 'ultrafast', '-pix_fmt', 'yuv420p',
        '-t', f"{shot['dur']:.2f}",
        clip_name
    ]
    res = subprocess.run(cmd, capture_output=True, text=True)
    
    try:
        os.remove(t_file)
        os.remove(s_file)
    except:
        pass
        
    if res.returncode != 0:
        print(f"Error on {clip_name}:", res.stderr[-400:])
        raise RuntimeError(f"Failed {clip_name}")
    return clip_name

def main():
    font_path = "C\\:/Windows/Fonts/segoeui.ttf"
    shot_counter = 0
    part_videos = []
    
    print("=== DÉMARRAGE DU RENDU MOTION DESIGN : DAME GÉRANTE & APPLICATION EN ACTION ===")
    
    for p_idx, part in enumerate(storyboard):
        audio_info = audio_tracks[p_idx]
        print(f"\n--> Traitement de la Partie {part['part']} ({audio_info['file']} - {audio_info['dur']}s)...")
        part_shots = []
        for s in part["shots"]:
            shot_counter += 1
            clip = build_shot_clip(shot_counter, s, font_path)
            part_shots.append(clip)
            
        # Concat shots for this part
        part_concat_txt = f"concat_dame_part_{p_idx+1}.txt"
        with open(part_concat_txt, "w", encoding="utf-8") as f:
            for sc in part_shots:
                f.write(f"file '{sc}'\n")
                
        part_video_raw = f"part_dame_{p_idx+1}_video.mp4"
        cmd_v = ['ffmpeg', '-y', '-f', 'concat', '-safe', '0', '-i', part_concat_txt, '-c', 'copy', part_video_raw]
        subprocess.run(cmd_v, capture_output=True)
        
        # Mux with audio
        part_final = f"part_dame_{p_idx+1}_final.mp4"
        cmd_mux = [
            'ffmpeg', '-y',
            '-i', part_video_raw,
            '-i', audio_info["file"],
            '-c:v', 'copy',
            '-c:a', 'aac', '-b:a', '192k',
            '-shortest',
            part_final
        ]
        subprocess.run(cmd_mux, capture_output=True)
        part_videos.append(part_final)
        print(f"[OK] Partie {p_idx+1} finalisée avec audio.")
        
        # Cleanup
        for sc in part_shots:
            try: os.remove(sc)
            except: pass
        try:
            os.remove(part_concat_txt)
            os.remove(part_video_raw)
        except: pass

    # Concat all 6 final parts
    global_concat_txt = "concat_all_dame_parts.txt"
    with open(global_concat_txt, "w", encoding="utf-8") as f:
        for pv in part_videos:
            f.write(f"file '{pv}'\n")
            
    final_output = "publicite_credittrack_officielle.mp4"
    print(f"\n--> Assemblage final dans {final_output}...")
    cmd_all = ['ffmpeg', '-y', '-f', 'concat', '-safe', '0', '-i', global_concat_txt, '-c', 'copy', final_output]
    res_final = subprocess.run(cmd_all, capture_output=True)
    
    # Cleanup
    for pv in part_videos:
        try: os.remove(pv)
        except: pass
    try: os.remove(global_concat_txt)
    except: pass
    
    if os.path.exists(final_output):
        sz = os.path.getsize(final_output) // 1024
        print(f"[SUCCÈS TOTAL] : {final_output} recréé avec succès ({sz} KB) !")
    else:
        print("Erreur : Fichier final non trouvé.")

if __name__ == "__main__":
    main()
