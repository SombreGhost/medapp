// server/server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Initialisation de l'application Express
const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = 'votre_clé_secrète_jwt'; // À remplacer par une variable d'environnement en production

// Middleware
app.use(cors());
app.use(express.json());

// Fonction utilitaire pour lire/écrire dans les fichiers JSON
const dataPath = path.join(__dirname, 'data');

// S'assurer que le répertoire de données existe
if (!fs.existsSync(dataPath)) {
  fs.mkdirSync(dataPath, { recursive: true });
}

const getDataFromFile = (fileName) => {
  const filePath = path.join(dataPath, fileName);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([]));
    return [];
  }
  const data = fs.readFileSync(filePath);
  return JSON.parse(data);
};

const writeDataToFile = (fileName, data) => {
  const filePath = path.join(dataPath, fileName);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// Middleware d'authentification
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Token d\'authentification requis' });
  }
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token invalide ou expiré' });
    }
    req.user = user;
    next();
  });
};

// Routes d'authentification
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, fullName, dateOfBirth } = req.body;
    
    // Validation de base
    if (!email || !password || !fullName) {
      return res.status(400).json({ message: 'Tous les champs sont requis' });
    }
    
    const users = getDataFromFile('users.json');
    
    // Vérifier si l'utilisateur existe déjà
    if (users.some(user => user.email === email)) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }
    
    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Créer le nouvel utilisateur
    const newUser = {
      id: Date.now().toString(),
      email,
      password: hashedPassword,
      fullName,
      dateOfBirth,
      createdAt: new Date()
    };
    
    users.push(newUser);
    writeDataToFile('users.json', users);
    
    // Générer le token JWT
    const token = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET, { expiresIn: '24h' });
    
    // Renvoyer les informations utilisateur sans le mot de passe
    const { password: _, ...userWithoutPassword } = newUser;
    
    res.status(201).json({
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});
// Continuation de server/server.js
app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      
      // Validation de base
      if (!email || !password) {
        return res.status(400).json({ message: 'Email et mot de passe requis' });
      }
      
      const users = getDataFromFile('users.json');
      
      // Trouver l'utilisateur
      const user = users.find(user => user.email === email);
      if (!user) {
        return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
      }
      
      // Vérifier le mot de passe
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
      }
      
      // Générer le token JWT
      const token = jwt.sign(
        { id: user.id, email: user.email }, 
        JWT_SECRET, 
        { expiresIn: '24h' }
      );
      
      // Renvoyer les informations utilisateur sans le mot de passe
      const { password: _, ...userWithoutPassword } = user;
      
      res.status(200).json({
        user: userWithoutPassword,
        token
      });
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  });
  
  // Route pour vérifier le token
  app.get('/api/auth/verify', authenticateToken, (req, res) => {
    res.status(200).json({ valid: true, user: req.user });
  });
  
  // Routes pour les examens médicaux
  app.get('/api/exams', authenticateToken, (req, res) => {
    try {
      const exams = getDataFromFile('exams.json');
      // Filtrer les examens par utilisateur
      const userExams = exams.filter(exam => exam.userId === req.user.id);
      res.status(200).json(userExams);
    } catch (error) {
      console.error('Erreur lors de la récupération des examens:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  });
  
  app.post('/api/exams', authenticateToken, (req, res) => {
    try {
      const { type, description, date } = req.body;
      
      // Validation
      if (!type || !description || !date) {
        return res.status(400).json({ message: 'Tous les champs sont requis' });
      }
      
      const exams = getDataFromFile('exams.json');
      
      // Créer le nouvel examen
      const newExam = {
        id: Date.now().toString(),
        userId: req.user.id,
        type,
        description,
        date,
        createdAt: new Date()
      };
      
      exams.push(newExam);
      writeDataToFile('exams.json', exams);
      
      res.status(201).json(newExam);
    } catch (error) {
      console.error('Erreur lors de l\'ajout d\'un examen:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  });
  
  // Routes pour les rendez-vous
  app.get('/api/appointments', authenticateToken, (req, res) => {
    try {
      const appointments = getDataFromFile('appointments.json');
      // Filtrer les rendez-vous par utilisateur
      const userAppointments = appointments.filter(app => app.userId === req.user.id);
      res.status(200).json(userAppointments);
    } catch (error) {
      console.error('Erreur lors de la récupération des rendez-vous:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  });
  
  app.post('/api/appointments', authenticateToken, (req, res) => {
    try {
      const { doctorId, date, time, notes, specialty } = req.body;
      
      // Validation
      if (!doctorId || !date || !time) {
        return res.status(400).json({ message: 'Docteur, date et heure requis' });
      }
      
      const appointments = getDataFromFile('appointments.json');
      const doctors = getDataFromFile('doctors.json');
      
      // Vérifier si le médecin existe
      const doctor = doctors.find(doc => doc.id === doctorId);
      if (!doctor) {
        return res.status(404).json({ message: 'Médecin non trouvé' });
      }
      
      // Créer le nouveau rendez-vous
      const newAppointment = {
        id: Date.now().toString(),
        userId: req.user.id,
        doctorId,
        doctorName: doctor.name,
        specialty: specialty || doctor.specialty,
        establishment: doctor.establishment,
        date,
        time,
        notes,
        status: 'scheduled',
        createdAt: new Date()
      };
      
      appointments.push(newAppointment);
      writeDataToFile('appointments.json', appointments);
      
      res.status(201).json(newAppointment);
    } catch (error) {
      console.error('Erreur lors de l\'ajout d\'un rendez-vous:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  });
  
  app.put('/api/appointments/:id', authenticateToken, (req, res) => {
    try {
      const { id } = req.params;
      const { date, time, notes, status } = req.body;
      
      const appointments = getDataFromFile('appointments.json');
      
      // Trouver le rendez-vous
      const appointmentIndex = appointments.findIndex(
        app => app.id === id && app.userId === req.user.id
      );
      
      if (appointmentIndex === -1) {
        return res.status(404).json({ message: 'Rendez-vous non trouvé' });
      }
      
      // Mettre à jour le rendez-vous
      appointments[appointmentIndex] = {
        ...appointments[appointmentIndex],
        date: date || appointments[appointmentIndex].date,
        time: time || appointments[appointmentIndex].time,
        notes: notes !== undefined ? notes : appointments[appointmentIndex].notes,
        status: status || appointments[appointmentIndex].status,
        updatedAt: new Date()
      };
      
      writeDataToFile('appointments.json', appointments);
      
      res.status(200).json(appointments[appointmentIndex]);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du rendez-vous:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  });
  
  app.delete('/api/appointments/:id', authenticateToken, (req, res) => {
    try {
      const { id } = req.params;
      
      const appointments = getDataFromFile('appointments.json');
      
      // Vérifier si le rendez-vous appartient à l'utilisateur
      const appointment = appointments.find(
        app => app.id === id && app.userId === req.user.id
      );
      
      if (!appointment) {
        return res.status(404).json({ message: 'Rendez-vous non trouvé' });
      }
      
      // Filtrer le rendez-vous à supprimer
      const updatedAppointments = appointments.filter(app => app.id !== id);
      
      writeDataToFile('appointments.json', updatedAppointments);
      
      res.status(200).json({ message: 'Rendez-vous supprimé avec succès' });
    } catch (error) {
      console.error('Erreur lors de la suppression du rendez-vous:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  });
  
  // Routes pour les médecins et établissements
  app.get('/api/doctors', (req, res) => {
    try {
      const doctors = getDataFromFile('doctors.json');
      res.status(200).json(doctors);
    } catch (error) {
      console.error('Erreur lors de la récupération des médecins:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  });
  
  app.get('/api/establishments', (req, res) => {
    try {
      const establishments = getDataFromFile('establishments.json');
      res.status(200).json(establishments);
    } catch (error) {
      console.error('Erreur lors de la récupération des établissements:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  });
  
  // Route pour rechercher des médecins et établissements
  app.get('/api/search', (req, res) => {
    try {
      const { query, type } = req.query;
      
      if (!query) {
        return res.status(400).json({ message: 'Terme de recherche requis' });
      }
      
      const searchTerm = query.toLowerCase();
      let results = [];
      
      // Rechercher parmi les médecins
      if (type === 'all' || type === 'doctor') {
        const doctors = getDataFromFile('doctors.json');
        const matchedDoctors = doctors.filter(
          doctor => 
            doctor.name.toLowerCase().includes(searchTerm) ||
            doctor.specialty.toLowerCase().includes(searchTerm)
        );
        results = [...results, ...matchedDoctors];
      }
      
      // Rechercher parmi les établissements
      if (type === 'all' || type === 'establishment') {
        const establishments = getDataFromFile('establishments.json');
        const matchedEstablishments = establishments.filter(
          est => 
            est.name.toLowerCase().includes(searchTerm) ||
            est.address.toLowerCase().includes(searchTerm)
        );
        results = [...results, ...matchedEstablishments];
      }
      
      res.status(200).json(results);
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  });
  
  // Routes pour le profil utilisateur
  app.get('/api/profile', authenticateToken, (req, res) => {
    try {
      const users = getDataFromFile('users.json');
      const user = users.find(user => user.id === req.user.id);
      
      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }
      
      // Exclure le mot de passe
      const { password, ...userWithoutPassword } = user;
      
      res.status(200).json(userWithoutPassword);
    } catch (error) {
      console.error('Erreur lors de la récupération du profil:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  });
  
  app.put('/api/profile', authenticateToken, async (req, res) => {
    try {
      const { fullName, email, dateOfBirth, phone, address } = req.body;
      
      const users = getDataFromFile('users.json');
      const userIndex = users.findIndex(user => user.id === req.user.id);
      
      if (userIndex === -1) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }
      
      // Vérifier si l'email est déjà utilisé
      if (email && email !== users[userIndex].email) {
        const emailExists = users.some(
          user => user.email === email && user.id !== req.user.id
        );
        if (emailExists) {
          return res.status(400).json({ message: 'Cet email est déjà utilisé' });
        }
      }
      
      // Mettre à jour l'utilisateur
      users[userIndex] = {
        ...users[userIndex],
        fullName: fullName || users[userIndex].fullName,
        email: email || users[userIndex].email,
        dateOfBirth: dateOfBirth || users[userIndex].dateOfBirth,
        phone: phone !== undefined ? phone : users[userIndex].phone,
        address: address !== undefined ? address : users[userIndex].address,
        updatedAt: new Date()
      };
      
      writeDataToFile('users.json', users);
      
      // Exclure le mot de passe
      const { password, ...userWithoutPassword } = users[userIndex];
      
      res.status(200).json(userWithoutPassword);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  });
  
  // Initialisation des données
  const initializeData = () => {
    // Initialiser les fichiers JSON s'ils n'existent pas
    const files = ['users.json', 'exams.json', 'appointments.json', 'doctors.json', 'establishments.json'];
    
    files.forEach(file => {
      const filePath = path.join(dataPath, file);
      if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify([]));
      }
    });
    
    // Ajouter des données d'exemple pour les médecins et établissements
    const doctors = getDataFromFile('doctors.json');
    if (doctors.length === 0) {
      const sampleDoctors = [
        {
          id: '1',
          name: 'Dr. Aminata Ndiaye Traore',
          specialty: 'Gynécologie',
          establishment: 'Clinique la providence',
          location: { lat: 48.856614, lng: 2.3522219 },
          phone: '01 23 45 67 89',
          email: 'dr.traore@example.com'
        },
        {
          id: '2',
          name: 'Dr. Mohamed Ali',
          specialty: 'Cardiologie',
          establishment: 'Hôpital Central',
          location: { lat: 48.8584, lng: 2.3536 },
          phone: '01 23 45 67 90',
          email: 'dr.ali@example.com'
        },
        {
          id: '3',
          name: 'Dr. Sophie Martin',
          specialty: 'Pédiatrie',
          establishment: 'Centre Médical Saint-Louis',
          location: { lat: 48.8546, lng: 2.3477 },
          phone: '01 23 45 67 91',
          email: 'dr.martin@example.com'
        },
        {
          id: '4',
          name: 'Dr. Jean Dupont',
          specialty: 'Endocrinologie',
          establishment: 'Cabinet Médical Pasteur',
          location: { lat: 48.8605, lng: 2.3501 },
          phone: '01 23 45 67 92',
          email: 'dr.dupont@example.com'
        }
      ];
      writeDataToFile('doctors.json', sampleDoctors);
    }
    
    const establishments = getDataFromFile('establishments.json');
    if (establishments.length === 0) {
      const sampleEstablishments = [
        {
          id: '1',
          name: 'Clinique la providence',
          address: '15 Rue de la Paix, 75002 Paris',
          location: { lat: 48.856614, lng: 2.3522219 },
          phone: '01 23 45 67 89'
        },
        {
          id: '2',
          name: 'Hôpital Central',
          address: '5 Avenue des Champs-Élysées, 75008 Paris',
          location: { lat: 48.8584, lng: 2.3536 },
          phone: '01 23 45 67 90'
        },
        {
          id: '3',
          name: 'Centre Médical Saint-Louis',
          address: '10 Boulevard Saint-Germain, 75006 Paris',
          location: { lat: 48.8546, lng: 2.3477 },
          phone: '01 23 45 67 91'
        },
        {
          id: '4',
          name: 'Cabinet Médical Pasteur',
          address: '25 Rue de Rivoli, 75004 Paris',
          location: { lat: 48.8605, lng: 2.3501 },
          phone: '01 23 45 67 92'
        }
      ];
      writeDataToFile('establishments.json', sampleEstablishments);
    }
  };
  
  // Initialiser les données au démarrage du serveur
  initializeData();
  
  // Démarrer le serveur
  app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
  });
  
  module.exports = app;