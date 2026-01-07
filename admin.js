import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

// CONFIG (Mesma do script.js)
const firebaseConfig = {
  apiKey: "AIzaSyBt0TzT0r5-WeWaS6TRmSnd7OMJmHcW0SQ",
  authDomain: "senaicar.firebaseapp.com",
  projectId: "senaicar",
  storageBucket: "senaicar.firebasestorage.app",
  messagingSenderId: "462791287476",
  appId: "1:462791287476:web:967ed163d8007a4fbdede1"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const loginSection = document.getElementById('login-section');
const dashboardSection = document.getElementById('dashboard-section');
const adminList = document.getElementById('admin-list');
const totalCount = document.getElementById('total-count');

onAuthStateChanged(auth, (user) => {
    if (user) {
        loginSection.style.display = 'none';
        dashboardSection.style.display = 'flex'; // Layout flex para sidebar
        loadAppointments();
    } else {
        loginSection.style.display = 'flex';
        dashboardSection.style.display = 'none';
    }
});

document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('admin-email').value;
    const pass = document.getElementById('admin-password').value;
    try {
        await signInWithEmailAndPassword(auth, email, pass);
    } catch (error) {
        alert("Login inválido: " + error.code);
    }
});

document.getElementById('logout-btn').addEventListener('click', () => signOut(auth));

function loadAppointments() {
    const q = query(collection(db, "agendamentos"), orderBy("criado_em", "desc"));
    onSnapshot(q, (snapshot) => {
        adminList.innerHTML = '';
        totalCount.innerText = snapshot.size;

        if (snapshot.empty) {
            adminList.innerHTML = '<tr><td colspan="5" style="text-align:center;">Nenhum agendamento.</td></tr>';
            return;
        }

        snapshot.forEach((doc) => {
            const data = doc.data();
            
            // Formatar Data
            let dataVisita = data.data_visita.split('-').reverse().join('/');
            
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>
                    <div style="font-weight:bold; color:white;">${dataVisita}</div>
                    <div style="font-size:0.85rem; color:#888;">${data.hora_visita}</div>
                </td>
                <td>
                    <div style="color:white;">Cliente Web</div>
                    <div style="font-size:0.8rem; color:#aaa;">ID: ${doc.id.substr(0,5)}</div>
                </td>
                <td>
                    <div><i class="fab fa-whatsapp" style="color:#00c851;"></i> ${data.cliente_whatsapp}</div>
                    <div style="font-size:0.85rem;"><i class="fas fa-envelope"></i> ${data.cliente_email || '-'}</div>
                </td>
                <td><span class="status-badge">Confirmado</span></td>
                <td style="font-size:0.85rem; color:#ccc; max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                    ${data.resumo_ia ? data.resumo_ia.replace(/<[^>]*>?/gm, '') : 'Sem IA'}
                </td>
            `;
            adminList.appendChild(tr);
        });
    });
}