// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC62d1olej0GpIW5Vhd6hHo-gkne5Ggj7M",
  authDomain: "air-spyka.firebaseapp.com",
  projectId: "air-spyka",
  storageBucket: "air-spyka.firebasestorage.app",
  messagingSenderId: "699690884206",
  appId: "1:699690884206:web:f39fcc72c2af70f9089a7f"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const routeForm = document.getElementById('routeForm');
const aircraftForm = document.getElementById('aircraftForm');
const bookingForm = document.getElementById('bookingForm');
const aircraftType = document.getElementById('aircraftType');
const routeSelect = document.getElementById('routeSelect');
const currency = document.getElementById('currency');
const ticket = document.getElementById('ticket');

const exchangeRates = {
  mango: 1,
  usd: 5,
  brl: 1.2
};

function loadAircrafts() {
  db.ref('aircrafts').once('value', snapshot => {
    aircraftType.innerHTML = '';
    snapshot.forEach(child => {
      const option = document.createElement('option');
      option.value = child.key;
      option.textContent = child.val().name;
      aircraftType.appendChild(option);
    });
  });
}

function loadRoutes() {
  db.ref('routes').once('value', snapshot => {
    routeSelect.innerHTML = '';
    snapshot.forEach(child => {
      const option = document.createElement('option');
      option.value = child.key;
      option.textContent = `${child.val().name} - ${child.val().price} Mango Spykano`;
      routeSelect.appendChild(option);
    });
  });
}

aircraftForm.addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('aircraftName').value;
  const id = db.ref('aircrafts').push().key;
  db.ref('aircrafts/' + id).set({ name }).then(() => {
    aircraftForm.reset();
    loadAircrafts();
  });
});

routeForm.addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('routeName').value;
  const price = parseFloat(document.getElementById('routePrice').value);
  const aircraft = aircraftType.value;
  const id = db.ref('routes').push().key;
  db.ref('routes/' + id).set({ name, price, aircraft }).then(() => {
    routeForm.reset();
    loadRoutes();
  });
});

bookingForm.addEventListener('submit', e => {
  e.preventDefault();
  const routeId = routeSelect.value;
  const selectedCurrency = currency.value;

  db.ref('routes/' + routeId).once('value').then(snapshot => {
    const route = snapshot.val();
    const basePrice = route.price;
    const converted = (basePrice / exchangeRates[selectedCurrency]).toFixed(2);

    ticket.innerHTML = `
      <h3>Passagem Agendada</h3>
      <p><strong>Rota:</strong> ${route.name}</p>
      <p><strong>Aeronave:</strong> ${route.aircraft}</p>
      <p><strong>Preço:</strong> ${converted} ${selectedCurrency.toUpperCase()}</p>
    `;
  });
});

window.addEventListener('DOMContentLoaded', () => {
  loadAircrafts();
  loadRoutes();
});
