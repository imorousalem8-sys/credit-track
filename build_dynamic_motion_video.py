import os
import subprocess

# Liste des plans dynamiques (plans courts de 2.5 à 3.5 secondes pour un rythme publicitaire dynamique)
# Chaque segment audio est accompagné d'une succession de micro-plans rythmés avec mouvements caméra vifs

audio_tracks = [
    {"file": "v2_audio_part1.mp3", "dur": 15.84},
    {"file": "v2_audio_part2.mp3", "dur": 17.52},
    {"file": "v2_audio_part3.mp3", "dur": 15.22},
    {"file": "v2_audio_part4.mp3", "dur": 15.67},
    {"file": "v2_audio_part5.mp3", "dur": 14.83},
    {"file": "v2_audio_part6.mp3", "dur": 12.55},
]

# Définition des micro-plans pour chaque partie audio
storyboard = [
    # --- PARTIE 1 : Accroche complice & problème des carnets (15.84s) ---
    {
        "part": 1,
        "shots": [
            {
                "img": "tutoriel_patron_bureau.jpg",
                "dur": 3.8,
                "zoom": "min(zoom+0.002,1.25)",
                "x": "iw/2-(iw/zoom/2)", "y": "ih/2-(ih/zoom/2)",
                "banner": "CHERS CONFRÈRES COMMERÇANTS",
                "sub": "Marre des bénéfices qui s'envolent et des fins de mois stressantes ?"
            },
            {
                "img": "img_caissier_officiel.jpg",
                "dur": 4.0,
                "zoom": "1.2-0.0015*on",
                "x": "iw/4-(iw/zoom/4)", "y": "ih/2-(ih/zoom/2)",
                "banner": "FINIS LES CARNETS PERDUS OU RATURÉS",
                "sub": "Combien d'argent dort dehors chez vos clients en ce moment ?"
            },
            {
                "img": "scene_mobile_money.jpg",
                "dur": 4.0,
                "zoom": "min(zoom+0.0025,1.28)",
                "x": "iw/2-(iw/zoom/2)", "y": "ih/3-(ih/zoom/3)",
                "banner": "LA SOLUTION MODERNE TOUT-EN-UN",
                "sub": "Gérez vos caisses et vos créances avec sérénité !"
            },
            {
                "img": "landing_hero_full.png",
                "dur": 4.04,
                "zoom": "1.1+0.001*on",
                "x": "iw/2-(iw/zoom/2)", "y": "ih/2-(ih/zoom/2)",
                "banner": "DÉCOUVREZ CRÉDITTRACK PRO",
                "sub": "Accessible en 1 clic sur Smartphone et Ordinateur"
            }
        ]
    },

    # --- PARTIE 2 : Tableau de bord gérant & vue chirurgicale (17.52s) ---
    {
        "part": 2,
        "shots": [
            {
                "img": "hero_dashboard_pro.jpg",
                "dur": 4.5,
                "zoom": "min(zoom+0.002,1.20)",
                "x": "iw/3-(iw/zoom/3)", "y": "ih/3-(ih/zoom/3)",
                "banner": "TABLEAU DE BORD CHIRURGICAL EN DIRECT",
                "sub": "Chiffre d'Affaires du jour encaissé en temps réel : 2 276 977 FCFA"
            },
            {
                "img": "tutoriel_patron_bureau.jpg",
                "dur": 4.2,
                "zoom": "1.25-0.0018*on",
                "x": "iw/2-(iw/zoom/2)", "y": "ih/2-(ih/zoom/2)",
                "banner": "PILOTEZ VOTRE COMMERCE AVEC CLARTÉ",
                "sub": "Suivez exactement l'argent dehors et vos encaissements"
            },
            {
                "img": "hero_dashboard_pro.jpg",
                "dur": 4.5,
                "zoom": "min(zoom+0.0025,1.25)",
                "x": "2*iw/3-(iw/zoom/3)", "y": "ih/2-(ih/zoom/2)",
                "banner": "TAUX DE RECOUVREMENT RECORD : 95.4%",
                "sub": "Vos créances sont sécurisées et suivies au centime près"
            },
            {
                "img": "scene_stock_marges.jpg",
                "dur": 4.32,
                "zoom": "min(zoom+0.002,1.20)",
                "x": "iw/2-(iw/zoom/2)", "y": "ih/3-(ih/zoom/3)",
                "banner": "SÉRÉNITÉ & CONTRÔLE ABSOLU",
                "sub": "Zéro trou de caisse, zéro surprise en fin de mois"
            }
        ]
    },

    # --- PARTIE 3 : La caissière au comptoir & le reçu QR (15.22s) ---
    {
        "part": 3,
        "shots": [
            {
                "img": "img_caissier_officiel.jpg",
                "dur": 4.0,
                "zoom": "min(zoom+0.0025,1.25)",
                "x": "iw/2-(iw/zoom/2)", "y": "ih/2-(ih/zoom/2)",
                "banner": "AU COMPTOIR : ENREGISTREMENT EN 5 SECONDES",
                "sub": "Vos vendeurs saisissent les ventes au comptant et à crédit en 5s chrono"
            },
            {
                "img": "tutoriel_caissier_boutique.jpg",
                "dur": 3.8,
                "zoom": "1.2-0.0015*on",
                "x": "iw/3-(iw/zoom/3)", "y": "ih/2-(ih/zoom/2)",
                "banner": "RAPIDITÉ & FLUIDITÉ DU SERVICE",
                "sub": "Plus de file d'attente, plus de disputes au comptoir"
            },
            {
                "img": "landing_hero_full.png",
                "dur": 3.8,
                "zoom": "min(zoom+0.002,1.20)",
                "x": "iw/2-(iw/zoom/2)", "y": "ih/2-(ih/zoom/2)",
                "banner": "REÇU OFFICIEL CERTIFIÉ AVEC QR CODE",
                "sub": "Ticket digital vérifiable envoyé immédiatement au client"
            },
            {
                "img": "img_caissier_officiel.jpg",
                "dur": 3.62,
                "zoom": "min(zoom+0.002,1.18)",
                "x": "2*iw/3-(iw/zoom/3)", "y": "ih/3-(ih/zoom/3)",
                "banner": "FINIS LES OUBLIS & CONTESTATIONS",
                "sub": "Chaque article et chaque centime sont tracés"
            }
        ]
    },

    # --- PARTIE 4 : Relances WhatsApp & Mobile Money (15.67s) ---
    {
        "part": 4,
        "shots": [
            {
                "img": "scene_mobile_money.jpg",
                "dur": 4.0,
                "zoom": "min(zoom+0.0025,1.25)",
                "x": "iw/2-(iw/zoom/2)", "y": "ih/3-(ih/zoom/3)",
                "banner": "RAPPELS WHATSAPP AUTOMATIQUES & COURTOIS",
                "sub": "À l'échéance, un message automatique part au client"
            },
            {
                "img": "maquette_fusion_hybride.jpg",
                "dur": 4.0,
                "zoom": "1.25-0.0018*on",
                "x": "iw/2-(iw/zoom/2)", "y": "ih/2-(ih/zoom/2)",
                "banner": "PAIEMENT DIRECT : WAVE, MOMO, ORANGE MONEY",
                "sub": "Le client clique et paye sa facture en 1 seconde"
            },
            {
                "img": "scene_mobile_money.jpg",
                "dur": 4.0,
                "zoom": "min(zoom+0.002,1.20)",
                "x": "iw/3-(iw/zoom/3)", "y": "ih/2-(ih/zoom/2)",
                "banner": "NOTIFICATION : FACTURE SOLDÉE ✓",
                "sub": "Votre compte bancaire ou mobile money est crédité aussitôt"
            },
            {
                "img": "tutoriel_patron_bureau.jpg",
                "dur": 3.67,
                "zoom": "min(zoom+0.0015,1.15)",
                "x": "iw/2-(iw/zoom/2)", "y": "ih/2-(ih/zoom/2)",
                "banner": "VOTRE TRÉSORERIE RESPIRE ENFIN",
                "sub": "Récupérez votre argent sans conflit et sans fatigue"
            }
        ]
    },

    # --- PARTIE 5 : Clôture certifiée & Sécurité Patron (14.83s) ---
    {
        "part": 5,
        "shots": [
            {
                "img": "img_patron_officiel.jpg",
                "dur": 4.0,
                "zoom": "min(zoom+0.0025,1.25)",
                "x": "iw/2-(iw/zoom/2)", "y": "ih/2-(ih/zoom/2)",
                "banner": "CHAQUE SOIR À 19H00 : CLÔTURE DE CAISSE CERTIFIÉE",
                "sub": "Le bilan complet de toutes vos boutiques reçu sur votre WhatsApp"
            },
            {
                "img": "scene_stock_marges.jpg",
                "dur": 3.8,
                "zoom": "1.22-0.0015*on",
                "x": "iw/2-(iw/zoom/2)", "y": "ih/3-(ih/zoom/3)",
                "banner": "ÉTANCHÉITÉ STRICTE CAISSIERS / PATRON",
                "sub": "Vos vendeurs encaissent, mais vos marges et votre trésorerie leur sont masquées"
            },
            {
                "img": "hero_dashboard_pro.jpg",
                "dur": 3.8,
                "zoom": "min(zoom+0.002,1.20)",
                "x": "iw/3-(iw/zoom/3)", "y": "ih/2-(ih/zoom/2)",
                "banner": "BÉNÉFICES RÉELS 100% SÉCURISÉS",
                "sub": "Contrôlez vos marges réelles même à distance"
            },
            {
                "img": "img_patron_officiel.jpg",
                "dur": 3.23,
                "zoom": "min(zoom+0.002,1.18)",
                "x": "2*iw/3-(iw/zoom/3)", "y": "ih/2-(ih/zoom/2)",
                "banner": "TRANQUILLITÉ D'ESPRIT TOTALE",
                "sub": "Partez en voyage l'esprit tranquille, votre caisse est sous contrôle"
            }
        ]
    },

    # --- PARTIE 6 : Call-to-Action & Démarrage Gratuit (12.55s) ---
    {
        "part": 6,
        "shots": [
            {
                "img": "maquette_fusion_hybride.jpg",
                "dur": 4.0,
                "zoom": "min(zoom+0.0025,1.25)",
                "x": "iw/2-(iw/zoom/2)", "y": "ih/2-(ih/zoom/2)",
                "banner": "REJOIGNEZ LES COMMERÇANTS QUI RÉUSSISSENT",
                "sub": "Prenez le contrôle absolu de votre argent dès aujourd'hui"
            },
            {
                "img": "landing_hero_full.png",
                "dur": 4.5,
                "zoom": "1.2-0.0015*on",
                "x": "iw/2-(iw/zoom/2)", "y": "ih/2-(ih/zoom/2)",
                "banner": "OUVREZ VOTRE APPLICATION GRATUITEMENT",
                "sub": "Rendez-vous sur : credit-track00.vercel.app"
            },
            {
                "img": "hero_dashboard_pro.jpg",
                "dur": 4.05,
                "zoom": "min(zoom+0.0025,1.25)",
                "x": "iw/2-(iw/zoom/2)", "y": "ih/2-(ih/zoom/2)",
                "banner": "CRÉDITTRACK PRO • INSTANTANÉ SUR MOBILE & PC",
                "sub": "Démarrez en 1 clic sans aucun téléchargement compliqué !"
            }
        ]
    }
]

def build_shot_clip(shot_id, shot, font_path):
    clip_name = f"shot_{shot_id}.mp4"
    fps = 25
    frames = int(shot["dur"] * fps) + 5
    
    t_file = f"temp_t_{shot_id}.txt"
    s_file = f"temp_s_{shot_id}.txt"
    with open(t_file, "w", encoding="utf-8") as f:
        f.write(shot["banner"])
    with open(s_file, "w", encoding="utf-8") as f:
        f.write(shot["sub"])
        
    t_esc = t_file.replace("\\", "/")
    s_esc = s_file.replace("\\", "/")
    
    # Motion dynamic filter : scale, crop, zoompan dynamique, bandeau pro, drawtext
    vf = (
        f"scale=1280:720,"
        f"zoompan=z='{shot['zoom']}':d={frames}:x='{shot['x']}':y='{shot['y']}':s=1280x720:fps={fps},"
        f"drawbox=y=0:w=1280:h=68:color=black@0.80:t=fill,"
        f"drawbox=y=635:w=1280:h=85:color=black@0.88:t=fill,"
        f"drawbox=y=633:w=1280:h=3:color=0x2563EB:t=fill,"
        f"drawtext=fontfile='{font_path}':textfile='{t_esc}':fontsize=25:fontcolor=0x60A5FA:x=(w-text_w)/2:y=20,"
        f"drawtext=fontfile='{font_path}':textfile='{s_esc}':fontsize=21:fontcolor=0xFFFFFF:x=(w-text_w)/2:y=662,"
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
    
    print("=== DÉMARRAGE DU RENDU MOTION DESIGN DYNAMIQUE ===")
    
    for p_idx, part in enumerate(storyboard):
        audio_info = audio_tracks[p_idx]
        print(f"\n--> Traitement de la Partie {part['part']} ({audio_info['file']} - {audio_info['dur']}s)...")
        part_shots = []
        for s in part["shots"]:
            shot_counter += 1
            clip = build_shot_clip(shot_counter, s, font_path)
            part_shots.append(clip)
            
        # Concat shots for this part
        part_concat_txt = f"concat_part_{p_idx+1}.txt"
        with open(part_concat_txt, "w", encoding="utf-8") as f:
            for sc in part_shots:
                f.write(f"file '{sc}'\n")
                
        part_video_raw = f"part_{p_idx+1}_video.mp4"
        cmd_v = ['ffmpeg', '-y', '-f', 'concat', '-safe', '0', '-i', part_concat_txt, '-c', 'copy', part_video_raw]
        subprocess.run(cmd_v, capture_output=True)
        
        # Mux with audio
        part_final = f"part_{p_idx+1}_final.mp4"
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
        print(f"[OK] Partie {p_idx+1} finalisee avec audio complice.")
        
        # Cleanup
        for sc in part_shots:
            try: os.remove(sc)
            except: pass
        try:
            os.remove(part_concat_txt)
            os.remove(part_video_raw)
        except: pass

    # Concat all 6 final parts
    global_concat_txt = "concat_all_parts.txt"
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
        print(f"[SUCCES TOTAL] : {final_output} cree avec succes ({sz} KB) !")
    else:
        print("Erreur : Fichier final non trouvé.")

if __name__ == "__main__":
    main()
