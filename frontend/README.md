# MedApp

## À quoi ça sert ?

 MedApp est une appli web pour faciliter la gestion des soins médicaux et la relation entre les patients et les hôpitaux au Sénégal. Elle permet de gérer les rendez-vous, trouver des médecins, faire des téléconsultations, et voir des études médicales (DICOM).

## Ce qui est fait

- **Authentification** : Authentification par mot de passe.
- **Connexion** : On peut se connecter et voir un message de bienvenue
- **Gestion de Rendez-vous** : Prendre et liste des rendez-vous 
- **Carte** : On peut chercher des médecins sur une carte
- **Téléconsultation** : Liste de médecins pour simuler une consultation (juste une démo).
- **Études DICOM** : Ajouter et voir des études
- **Style** : Thème vert, design simple et clair.

## Structure du Projet
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
│   │   │   ├── Dashboard.jsx        # Tableau de bord principal
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

## Comment tester MedApp

1. Va dans `C:\Users\dell\Downloads\medapp_base\frontend`.
2. Installe les dépendances :

   ```bash
   npm install
   ```
3. Lance l’appli :

   ```bash
   npm start
   ```
4. Ouvre `http://localhost:3000` dans ton navigateur.



## Ce qu’on doit/peut encore faire/update
- **Notifications** : Rappels pour les rendez-vous
- **Tableau Admin** : Stats pour les hôpitaux (ex. nombre de rendez-vous).
- **Assistant Vocal** : Juste une idée pour l’instant, on pourrait ajouter des commandes vocales en wolof/français (ex. "Prendre un rendez-vous avec Dr. Khadija"). On peut même intégrer une IA pour rendre ça plus malin.
- **Suivi Santé** : Ajouter poids, tension, allergies pour les patients.
- **Visualisation DICOM** : Pouvoir voir les images médicales directement.
- **Rôles Utilisateur** : Gérer différents rôles (admin, médecin, patient) pour la connexion. Les médecins pourront ajouter leurs données (ex. spécialité, disponibilité).

## Plan pour finir en 5 jours (proposition chat huh)

- **5 juin** : Notifications + tableau admin.
- **6 juin** : Suivi santé + rôles utilisateur.
- **7 juin** : Visualisation DICOM.
- **8 juin** : Assistant vocal (ou IA si on a le temps).
- **9 juin** : Tester tout et préparer la démo.

### 