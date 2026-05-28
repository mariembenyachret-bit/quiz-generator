#  Générateur de Quiz PDF avec IA

Une application web qui génère automatiquement des quiz QCM à partir de documents PDF en utilisant l'intelligence artificielle (Google Gemini).

##  Fonctionnalités

-  Upload d'un fichier PDF
-  Génération automatique de questions QCM avec Gemini AI
-  Correction interactive des réponses
-  Interface web moderne et responsive

##  Technologies utilisées

- **Backend** : Python, FastAPI
- **IA générative** : Google Gemini 2.5 Flash
- **Extraction PDF** : PyMuPDF
- **Frontend** : HTML, CSS, JavaScript

##  Installation

1. Clone le repository
```bash
git clone https://github.com/mariembenyachret-bit/quiz-generator.git
```

2. Crée un environnement virtuel
```bash
python -m venv venv
venv\Scripts\activate
```

3. Installe les dépendances
```bash
pip install fastapi uvicorn python-multipart pymupdf python-dotenv requests
```

4. Configure la clé API dans `backend/.env`
5. Lance le serveur
```bash
uvicorn backend.main:app --reload
```

6. Ouvre `frontend/index.html` dans le navigateur

##  Étudiants

- Mariem Ben Yachret

## 📸 Démonstration

![Quiz Generator Demo](demo.png)