const API_URL = "https://script.google.com/macros/s/AKfycbwWfdIBYuwk1P-KcxDjrkRFPfMDeXu4befHCob2xXu5kuYx48joMMHkUHIQejWvJbkI/exec";
let allTamu = [];

async function fetchData() {
    const res = await fetch(API_URL);
    allTamu = await res.json();
    renderList();
}

function showPage(page) {
    document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
    if (page === 'scan') {
        document.getElementById('page-scan').style.display = 'block';
        startScanner();
    } else {
        document.getElementById('page-list').style.display = 'block';
        const statusFilter = page === 'list-sudah' ? 'Sudah Hadir' : 'Belum Hadir';
        renderList(statusFilter);
    }
}

function renderList(filter = 'Belum Hadir') {
    const listE1 = document.getElementById('tamu-list');
    listE1.innerHTML = '';
    const filtered = allTamu.filter(t => t.Status === filter);
    filtered.forEach(t => {
        const li = document.createElement('li');
        li.innerHTML = `<b>${t.Nama}</b><br><small>${t.Instansi}</small>`;
        listE1.appendChild(li);
    });
}

function startScanner() {
    const html5QrCode = new Html5Qrcode("reader");
    html5QrCode.start({ facingMode: "environment" }, { fps: 10, qrbox: 250 },
        async (decodedText) => {
            html5QrCode.stop();
            document.getElementById('result-scan').innerText = "Memproses: " + decodedText;
            
            // Kirim ke Google Sheets
            await fetch(API_URL, {
                method: 'POST',
                body: JSON.stringify({ kodeQR: decodedText })
            });
            
            alert("Presensi Berhasil!");
            fetchData(); // Refresh data
            showPage('list-sudah');
        }
    );
}

fetchData(); 