import asyncio
import edge_tts
import os

scenes = [
    {
        "id": "pub_audio_scene1.mp3",
        "voice": "fr-FR-DeniseNeural",
        "text": "Chef d'entreprise, commerçant, gérant de boutique : marre des pertes de caisse inexpliquées, des cahiers raturés et des clients qui ne remboursent jamais à temps ? Découvrez CréditTrack PRO, la plateforme de gestion financière et commerciale tout-en-un. Accessible instantanément sur smartphone et ordinateur directement depuis votre navigateur, sans téléchargement compliqué !"
    },
    {
        "id": "pub_audio_scene2.mp3",
        "voice": "fr-FR-DeniseNeural",
        "text": "Dès votre connexion, le Tableau de Bord vous offre une vision chirurgicale de votre activité. Suivez en temps réel votre chiffre d'affaires encaissé, l'argent qui dort dehors chez vos clients, et votre taux de recouvrement. Grâce à des graphiques dynamiques et des indicateurs clairs, vous pilotez votre entreprise avec une sérénité totale."
    },
    {
        "id": "pub_audio_scene3.mp3",
        "voice": "fr-FR-DeniseNeural",
        "text": "Au comptoir de la boutique, la rapidité fait toute la différence. Avec le Cahier du Jour digital, vos vendeurs enregistrent les ventes au comptant et à crédit en cinq secondes chrono. Chaque transaction génère un reçu officiel avec QR code sécurisé, éliminant définitivement les erreurs de caisse et les contestations."
    },
    {
        "id": "pub_audio_scene4.mp3",
        "voice": "fr-FR-DeniseNeural",
        "text": "La véritable force de CréditTrack, c'est son système de relance automatique par WhatsApp. À l'échéance convenue, l'application envoie un message personnalisé et courtois au client avec le montant exact et un lien de paiement direct par Wave ou Mobile Money. Vos créances sont recouvrées sans dispute et sans perte de temps."
    },
    {
        "id": "pub_audio_scene5.mp3",
        "voice": "fr-FR-DeniseNeural",
        "text": "Encaisser c'est bien, mais maîtriser vos dépenses et vos marges réelles, c'est indispensable. CréditTrack catégorise vos charges d'exploitation, vos achats fournisseurs et calcule automatiquement votre bénéfice net. Vous savez exactement combien votre commerce vous rapporte jour après jour."
    },
    {
        "id": "pub_audio_scene6.mp3",
        "voice": "fr-FR-DeniseNeural",
        "text": "Et le soir à la fermeture ? Fini le casse-tête des comptes. D'un simple clic, le bilan certifié de la journée est compilé et envoyé directement sur votre WhatsApp personnel. Vos employés travaillent efficacement en boutique, mais vos marges et votre trésorerie globale leur restent strictement inaccessibles. Votre entreprise est verrouillée et protégée."
    },
    {
        "id": "pub_audio_scene7.mp3",
        "voice": "fr-FR-DeniseNeural",
        "text": "Rejoignez dès aujourd'hui les commerçants et chefs d'entreprise modernes qui ont choisi la tranquillité d'esprit et la rentabilité. Ouvrez CréditTrack PRO gratuitement dès maintenant sur credit-track00 point vercel point app et reprenez le contrôle absolu de votre argent !"
    }
]

async def generate_all():
    cwd = os.getcwd()
    print(f"Generating {len(scenes)} audio files in {cwd}...")
    for s in scenes:
        out_path = os.path.join(cwd, s["id"])
        print(f"Generating {s['id']} with {s['voice']}...")
        communicate = edge_tts.Communicate(s["text"], s["voice"], rate="+2%", pitch="+0Hz")
        await communicate.save(out_path)
        sz = os.path.getsize(out_path)
        print(f"SUCCESS {s['id']} -> {sz} bytes")

if __name__ == "__main__":
    asyncio.run(generate_all())
