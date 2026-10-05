import asyncio
import edge_tts
import os
import subprocess

segments = [
    {
        "id": "v2_audio_part1.mp3",
        "voice": "fr-FR-DeniseNeural",
        "text": "Bonjour cher confrère commerçant. Si comme moi, vous en avez assez de voir votre argent dormir dehors, de perdre du temps avec de vieux carnets raturés, ou de stresser chaque soir devant votre caisse... Sachez qu'il existe enfin une solution simple et moderne."
    },
    {
        "id": "v2_audio_part2.mp3",
        "voice": "fr-FR-DeniseNeural",
        "text": "Découvrez CréditTrack PRO. Dès votre connexion, le tableau de bord vous offre une vue chirurgicale : votre chiffre d'affaires encaissé en direct, vos créances clients, et votre taux de recouvrement en temps réel. Vous pilotez enfin votre entreprise avec clarté et sérénité."
    },
    {
        "id": "v2_audio_part3.mp3",
        "voice": "fr-FR-DeniseNeural",
        "text": "Au comptoir de votre boutique, vos vendeurs enregistrent chaque vente en cinq secondes chrono. Vente au comptant ou vente à crédit, le système génère un reçu officiel avec QR code sécurisé. Fini les oublis, fini les contestations."
    },
    {
        "id": "v2_audio_part4.mp3",
        "voice": "fr-FR-DeniseNeural",
        "text": "Et pour récupérer vos crédits ? L'application s'occupe de tout. À la date convenue, un rappel WhatsApp bienveillant part automatiquement avec un lien direct Wave ou Mobile Money. Vos clients règlent sans dispute et votre trésorerie respire."
    },
    {
        "id": "v2_audio_part5.mp3",
        "voice": "fr-FR-DeniseNeural",
        "text": "Chaque soir à dix-neuf heures, la clôture certifiée arrive directement sur votre téléphone. Vos caissiers gèrent les encaissements, mais vos marges réelles et votre coffre-fort leur restent strictement invisibles. Vous gardez le contrôle absolu."
    },
    {
        "id": "v2_audio_part6.mp3",
        "voice": "fr-FR-DeniseNeural",
        "text": "Ne laissez plus vos bénéfices s'envoler. Prenez le contrôle dès aujourd'hui. Rendez-vous sur credit-track00 point vercel point app pour ouvrir CréditTrack PRO gratuitement dès maintenant !"
    }
]

async def main():
    print("Generating natural complice audio files with fr-FR-DeniseNeural...")
    for s in segments:
        out = s["id"]
        comm = edge_tts.Communicate(s["text"], s["voice"], rate="+0%", pitch="+0Hz")
        await comm.save(out)
        
        # Get duration
        cmd = ['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'default=noprint_wrappers=1:nokey=1', out]
        res = subprocess.run(cmd, capture_output=True, text=True)
        dur = float(res.stdout.strip())
        print(f"SUCCESS {out} ({dur:.2f}s)")

if __name__ == "__main__":
    asyncio.run(main())
