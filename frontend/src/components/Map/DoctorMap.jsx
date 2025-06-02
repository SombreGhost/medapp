import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './DoctorMap.css';

// Correction de l'icône par défaut de Leaflet pour éviter des erreurs d'affichage
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const DoctorMap = () => {
  // Liste statique des médecins (à remplacer par une API plus tard)
  const initialDoctors = [
    {
      id: 1,
      name: 'Dr. Khadija Mbaye',
      specialty: 'Cardiologue',
      location: 'Hôpital Général de Grand Yoff, Dakar',
      coordinates: { lat: 14.7167, lng: -17.4333 },
    },
    {
      id: 2,
      name: 'Dr. Samba Thiam',
      specialty: 'Pédiatre',
      location: 'Clinique Nabil Choucair, Dakar',
      coordinates: { lat: 14.6928, lng: -17.4467 },
    },
    {
      id: 3,
      name: 'Dr. Fatimata Sy',
      specialty: 'Gynécologue',
      location: 'Hôpital de Pikine, Dakar',
      coordinates: { lat: 14.7645, lng: -17.3944 },
    },
    {
      id: 4,
      name: 'Dr. Abdoulaye Faye',
      specialty: 'Dentiste',
      location: 'Centre Médical de Rufisque, Rufisque',
      coordinates: { lat: 14.7158, lng: -17.2733 },
    },
  ];

  // États pour gérer la recherche, le filtrage et les suggestions
  const [searchTerm, setSearchTerm] = useState(''); // Terme de recherche saisi
  const [filteredDoctors, setFilteredDoctors] = useState(initialDoctors); // Liste filtrée des médecins
  const [filterType, setFilterType] = useState('all'); // Type de filtre (nom, spécialité, lieu)
  const [suggestions, setSuggestions] = useState([]); // Suggestions pour l'autocomplétion
  const [showSuggestions, setShowSuggestions] = useState(false); // Afficher ou masquer les suggestions

  // Gère la recherche et l'autocomplétion
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setShowSuggestions(true);

    // Génère des suggestions basées sur le terme et le type de filtre
    const suggestionSet = new Set();
    initialDoctors.forEach((doctor) => {
      if (filterType === 'all' || filterType === 'name') {
        if (doctor.name.toLowerCase().includes(term)) suggestionSet.add(doctor.name);
      }
      if (filterType === 'all' || filterType === 'specialty') {
        if (doctor.specialty.toLowerCase().includes(term)) suggestionSet.add(doctor.specialty);
      }
      if (filterType === 'all' || filterType === 'location') {
        if (doctor.location.toLowerCase().includes(term)) suggestionSet.add(doctor.location);
      }
    });
    const suggestionList = Array.from(suggestionSet).slice(0, 5); // Limite à 5 suggestions
    setSuggestions(suggestionList);

    // Filtre les médecins affichés sur la carte
    const filtered = initialDoctors.filter((doctor) => {
      if (term === '') return true;
      if (filterType === 'all') {
        return (
          doctor.name.toLowerCase().includes(term) ||
          doctor.specialty.toLowerCase().includes(term) ||
          doctor.location.toLowerCase().includes(term)
        );
      }
      if (filterType === 'name') return doctor.name.toLowerCase().includes(term);
      if (filterType === 'specialty') return doctor.specialty.toLowerCase().includes(term);
      if (filterType === 'location') return doctor.location.toLowerCase().includes(term);
      return false;
    });
    setFilteredDoctors(filtered);
  };

  // Gère le clic sur une suggestion pour remplir la barre de recherche et filtrer
  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);

    const filtered = initialDoctors.filter((doctor) => {
      if (filterType === 'all') {
        return (
          doctor.name.toLowerCase() === suggestion.toLowerCase() ||
          doctor.specialty.toLowerCase() === suggestion.toLowerCase() ||
          doctor.location.toLowerCase() === suggestion.toLowerCase()
        );
      }
      if (filterType === 'name') return doctor.name.toLowerCase() === suggestion.toLowerCase();
      if (filterType === 'specialty') return doctor.specialty.toLowerCase() === suggestion.toLowerCase();
      if (filterType === 'location') return doctor.location.toLowerCase() === suggestion.toLowerCase();
      return false;
    });
    setFilteredDoctors(filtered);
  };

  // Gère le changement de type de filtre (nom, spécialité, lieu)
  const handleFilterChange = (e) => {
    const newFilterType = e.target.value;
    setFilterType(newFilterType);
    setSearchTerm(''); // Réinitialise la recherche
    setFilteredDoctors(initialDoctors); // Réinitialise les médecins affichés
    setSuggestions([]); // Réinitialise les suggestions
    setShowSuggestions(false); // Masque les suggestions
  };

  // Efface la recherche et réinitialise les filtres
  const clearSearch = () => {
    setSearchTerm('');
    setFilteredDoctors(initialDoctors);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  // Centre de la carte (Dakar, Sénégal)
  const center = [14.6928, -17.4467];

  return (
    <div className="map-container">
      <h2 className="section-title">Localisation des Médecins</h2>
      {/* Barre de recherche avec filtre et autocomplétion */}
      <div className="search-bar">
        <select value={filterType} onChange={handleFilterChange} className="filter-select">
          <option value="all">Tout</option>
          <option value="name">Nom</option>
          <option value="specialty">Spécialité</option>
          <option value="location">Lieu</option>
        </select>
        <div className="search-input-container">
          <input
            type="text"
            placeholder="Rechercher un médecin, spécialité ou lieu..."
            value={searchTerm}
            onChange={handleSearch}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          />
          {showSuggestions && suggestions.length > 0 && (
            <ul className="suggestions-list">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onMouseDown={() => handleSuggestionClick(suggestion)}
                  className="suggestion-item"
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>
        {searchTerm && (
          <button className="clear-search" onClick={clearSearch}>
            Effacer
          </button>
        )}
      </div>

      {/* Affichage de la carte ou d'un message si aucun médecin n'est trouvé */}
      {filteredDoctors.length === 0 ? (
        <p className="no-doctors">Aucun médecin trouvé pour cette recherche.</p>
      ) : (
        <MapContainer center={center} zoom={10} className="leaflet-map">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {filteredDoctors.map((doctor) => (
            <Marker
              key={doctor.id}
              position={[doctor.coordinates.lat, doctor.coordinates.lng]}
            >
              <Popup>
                <strong>{doctor.name}</strong><br />
                Spécialité: {doctor.specialty}<br />
                Lieu: {doctor.location}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      )}
    </div>
  );
};

export default DoctorMap;
