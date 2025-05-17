// Configuração Firebase
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

const exchangeRates = {
  mango: 1,
  usd: 5,
  brl: 1.2
};

const routeForm = document.getElementById("routeForm");
if (routeForm) {
  routeForm.addEventListener("submit", e => {
    e.preventDefault();
    const route = {
      origin: document.getElementById("origin").value,
      destination: document.getElementById("destination").value,
      distance: parseInt(document.getElementById("distance").value),
      duration: parseInt(document.getElementById("duration").value),
      price: parseFloat(document.getElementById("price").value)
    };
    db.ref("routes").push(route).then(() => {
      alert("Rota cadastrada!");
      routeForm.reset();
    });
  });
}

const routesTable = document.querySelector("#routesTable tbody");
if (routesTable) {
  const currency = document.getElementById("currency");
  currency.addEventListener("change", loadRoutes);
  window.addEventListener("DOMContentLoaded", loadRoutes);

  function loadRoutes() {
    db.ref("routes").once("value", snapshot => {
      routesTable.innerHTML = "";
      snapshot.forEach(child => {
        const route = child.val();
        const convPrice = (route.price / exchangeRates[currency.value]).toFixed(2);
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${route.origin}</td>
          <td>${route.destination}</td>
          <td>${route.distance} km</td>
          <td>${route.duration} min</td>
          <td>${convPrice} ${currency.value.toUpperCase()}</td>
        `;
        routesTable.appendChild(row);
      });
    });
  }
}
