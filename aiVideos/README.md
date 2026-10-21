# Vidéos Vid30

Dépose ici tes fichiers vidéo sous les noms suivants :

| Fichier      | Titre                            | Durée |
|--------------|----------------------------------|-------|
| film1.mp4    | The AI Directors · Commercial FUT| 0:15  |
| film2.mp4    | Adidas · Creative Direction      | 0:33  |
| film3.mp4    | creativeproject-visualstorytelli | 8:42  |
| film4.mp4    | É3“Les années retrouvées” Aujourd| 14:20 |
| film5.mp4    | histoire-patrimoine-grandeguerre-| 6:55  |
| film6.mp4    | Un court métrage d'animation av  | 3:00  |
| film7.mp4    | Arrière-grand-mère née 6/12/26   | 18:00 |
| film8.mp4    | 🎬 Un hommage aux photojournali  | 22:15 |
| film9.mp4    | restaurationarchives-paris1900-  | 5:30  |

## Flux HLS

Si tu as des flux .m3u8 (recommandé pour les longs métrages), remplace
le champ `hls` dans `src/data/films.js` par l'URL complète du flux.

Exemple :
```js
hls: "https://cdn.vid30.fr/films/nocturne-data/index.m3u8",
```
