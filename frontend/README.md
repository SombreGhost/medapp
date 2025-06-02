# MedApp

## À quoi ça sert ?

MedApp est une appli web pour faciliter la gestion des soins médicaux au Sénégal. Elle aide les patients et les hôpitaux à gérer les rendez-vous, trouver des médecins, faire des téléconsultations, et voir des études médicales (DICOM).

## Ce qui est fait

- **Authentification** : Connexion avec mot de passe.
- **Connexion** : Voir un message de bienvenue (ex. "Jamm ak Jamm, Aminata !").
- **Gestion de Rendez-vous** : Prendre et voir une liste de rendez-vous.
- **Carte** : Chercher des médecins sur une carte.
- **Téléconsultation** : Liste de médecins pour simuler une consultation (démo).
- **Études DICOM** : Ajouter et voir des études.
- **Style** : Thème vert, design simple.

## Structure du Projet

```
medapp_base/
├── frontend/
│   ├── public/
│   │   ├── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Map/
│   │   │   │   ├── DoctorMap.jsx    # Carte des médecins
│   │   │   │   └── DoctorMap.css
│   │   │   ├── DicomStudies.jsx     # Gestion des études DICOM
│   │   │   ├── DicomStudies.css
│   │   │   ├── Telemedicine.jsx     # Téléconsultation
│   │   │   └── Telemedicine.css
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx        # Tableau de bord
│   │   │   └── Dashboard.css
│   │   ├── services/
│   │   │   └── orthancService.js    # Interaction avec Orthanc
│   │   ├── context/
│   │   │   └── AuthContext.js       # Gestion de l’authentification
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json
│   └── README.md
├── backend/
│   ├── appointments.json
│   ├── doctors.json
│   ├── establishments.json
│   ├── exams.json
│   ├── users.json
│   ├── node_modules/
│   ├── package-lock.json
│   ├── package.json
│   └── server.js
└── .gitignore
```

## Comment accéder et tester MedApp

1. Clone le projet depuis GitHub :

   ```bash
   git clone https://github.com/ton-utilisateur/medapp.git
   cd medapp
   ```

2. **Pour le frontend** :

   - Va dans le dossier frontend :

     ```bash
     cd frontend
     npm install
     npm start
     ```
   - Ouvre `http://localhost:3000`.

3. **Pour le backend** :

   - Va dans le dossier backend :

     ```bash
     cd backend
     npm install
     npm start
     ```
   - Vérifie que l’API tourne (ex. sur `http://localhost:5000`).

## Comment contribuer

- Fais tes changements.
- Ajoute tes fichiers :

  ```bash
  git add .
  ```
- Enregistre :

  ```bash
  git commit -m "Ton message ici"
  ```
- Pousse sur GitHub :

  ```bash
  git push origin main
  ```

## Ce qu’on doit/peut encore faire

- **Notifications** : Rappels pour les rendez-vous.
- **Tableau Admin** : Stats pour les hôpitaux.
- **Assistant Vocal** : Une idée, on pourrait ajouter des commandes vocales en wolof/français (ex. "Prendre un rendez-vous"). On peut intégrer une IA aussi.
- **Suivi Santé** : Ajouter poids, tension, allergies.
- **Visualisation DICOM** : Voir les images médicales.
- **Rôles Utilisateur** : Gérer admin, médecin, patient. Les médecins pourront ajouter leurs données (spécialité, disponibilité).

## Plan pour finir en 5 jours (5-9 juin)

- **5 juin** : Notifications + tableau admin.
- **6 juin** : Suivi santé + rôles utilisateur.
- **7 juin** : Visualisation DICOM.
- **8 juin** : Assistant vocal (ou IA si possible).
- **9 juin** : Tester tout et préparer la démo.

### 

## 