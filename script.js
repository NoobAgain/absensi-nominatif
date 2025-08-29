document.addEventListener('DOMContentLoaded', () => {
    // Definisi elemen-elemen dari HTML
    const loginContainer = document.getElementById('login-container');
    const appContainer = document.getElementById('app-container');
    const loginButton = document.getElementById('login-button');
    const logoutButton = document.getElementById('logout-button');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginError = document.getElementById('login-error');
    const datePicker = document.getElementById('date-picker');
    const resetButton = document.getElementById('reset-button');
    const saveButton = document.getElementById('save-button');
    const exportButton = document.getElementById('export-button');
    const clockElement = document.getElementById('clock');
    const saveNotification = document.getElementById('save-notification');
    const summaryContainer = document.getElementById('summary-container');
    const sessionTabsNav = document.getElementById('session-tabs-nav');
    const prodiTabsNav = document.getElementById('prodi-tabs-nav');
    const prodiTabsContent = document.getElementById('prodi-tabs-content');

    // --- Konfigurasi Aplikasi ---
    const SESSIONS = {
        ibadah: "Apel Ibadah",
        pagi: "Apel Pagi",
        sore: "Apel Sore",
        malam: "Apel Malam"
    };
    const validUsername = 'admin';
    const validPassword = 'password';
    let activeSession = 'ibadah'; // Sesi default
    let clockInterval;

    // --- Manajemen Login ---
    if (localStorage.getItem('isLoggedIn') === 'true') showApp();
    else showLogin();

    function showLogin() {
        loginContainer.style.display = 'flex';
        appContainer.style.display = 'none';
        if (clockInterval) clearInterval(clockInterval);
    }

    function showApp() {
        loginContainer.style.display = 'none';
        appContainer.style.display = 'block';
        initializeFeatherIcons();
        updateClock();
        clockInterval = setInterval(updateClock, 1000);
        initApp();
    }

    loginButton.addEventListener('click', () => {
        if (usernameInput.value === validUsername && passwordInput.value === validPassword) {
            localStorage.setItem('isLoggedIn', 'true');
            showApp();
        } else {
            loginError.textContent = 'Username atau password salah.';
        }
    });

    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('isLoggedIn');
        showLogin();
    });

    // --- Inisialisasi Aplikasi ---
    function initApp() {
        const today = new Date().toISOString().split('T')[0];
        datePicker.value = today;

        populateSessionTabs();
        populateProdiTabsAndTables();
        addEventListeners(); // Menggabungkan semua event listener
        loadAttendanceData();
    }

    // --- FUNGSI EVENT LISTENER TERPUSAT ---
    function addEventListeners() {
        datePicker.addEventListener('change', loadAttendanceData);
        resetButton.addEventListener('click', resetAttendance);
        saveButton.addEventListener('click', saveAttendanceData);
        exportButton.addEventListener('click', exportToExcel);
    }

    // --- Fungsi Jam & Tanggal ---
    function updateClock() {
        const now = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const dateString = now.toLocaleDateString('id-ID', options);
        const timeString = now.toLocaleTimeString('id-ID', { hour12: false });
        clockElement.textContent = `${dateString} | ${timeString}`;
    }

    // --- Pembuatan Tampilan (UI) ---
    function populateSessionTabs() {
        sessionTabsNav.innerHTML = '';
        Object.keys(SESSIONS).forEach(key => {
            const button = document.createElement('button');
            button.className = 'session-tab-link';
            if (key === activeSession) button.classList.add('active');
            button.dataset.session = key;
            button.textContent = SESSIONS[key];
            button.addEventListener('click', () => {
                activeSession = key;
                document.querySelectorAll('.session-tab-link').forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                loadAttendanceData();
            });
            sessionTabsNav.appendChild(button);
        });
    }

    function populateProdiTabsAndTables() {
        const groupedByProdi = personnelData.reduce((acc, person) => {
            (acc[person.prodi] = acc[person.prodi] || []).push(person);
            return acc;
        }, {});

        prodiTabsNav.innerHTML = '';
        prodiTabsContent.innerHTML = '';

        Object.keys(groupedByProdi).forEach((prodi, index) => {
            const isActive = index === 0 ? 'active' : '';
            
            const tabButton = document.createElement('button');
            tabButton.className = `tab-link ${isActive}`;
            tabButton.textContent = prodi;
            tabButton.dataset.tab = prodi;
            prodiTabsNav.appendChild(tabButton);

            const tabPane = document.createElement('div');
            tabPane.id = prodi;
            tabPane.className = `tab-pane ${isActive}`;
            
            const tableHTML = `
                <div class="table-container">
                    <table>
                        <thead>
                            <tr><th>No</th><th>Nama</th><th>Status</th><th>Keterangan</th></tr>
                        </thead>
                        <tbody>
                            ${groupedByProdi[prodi].map((person, personIndex) => {
                                const originalIndex = personnelData.findIndex(p => p.nama === person.nama && p.prodi === person.prodi);
                                return `
                                <tr>
                                    <td data-label="No">${personIndex + 1}</td>
                                    <td data-label="Nama">${person.nama}</td>
                                    <td data-label="Status">
                                        <select class="status-select" data-index="${originalIndex}">
                                            <option value="hadir">Hadir</option>
                                            <option value="dd">DD</option>
                                            <option value="sakit">Sakit</option>
                                            <option value="izin">Izin</option>
                                            <option value="piketRusun">Piket Rusun</option>
                                            <option value="piketKelas">Piket Kelas</option>
                                            <option value="lokananta">Lokananta</option>
                                            <option value="alpa">Alpa</option>
                                        </select>
                                    </td>
                                    <td data-label="Keterangan">
                                        <input type="text" class="keterangan-input" placeholder="Isi jika perlu..." data-index="${originalIndex}">
                                    </td>
                                </tr>`;
                            }).join('')}
                        </tbody>
                    </table>
                </div>`;
            
            const prodiSummaryHTML = `<div id="summary-${prodi}" class="prodi-summary"></div>`;
            tabPane.innerHTML = tableHTML + prodiSummaryHTML;
            prodiTabsContent.appendChild(tabPane);
        });
        
        document.querySelectorAll('.tab-link').forEach(button => {
            button.addEventListener('click', () => {
                document.querySelectorAll('.tab-link, .tab-pane').forEach(el => el.classList.remove('active'));
                const tabId = button.dataset.tab;
                button.classList.add('active');
                document.getElementById(tabId).classList.add('active');
            });
        });

        document.querySelectorAll('.status-select, .keterangan-input').forEach(el => {
            el.addEventListener('change', updateAllSummaries);
            el.addEventListener('keyup', updateAllSummaries);
        });
    }

    // --- Kalkulasi & Rekapitulasi ---
    function updateAllSummaries() {
        const groupedByProdi = personnelData.reduce((acc, person) => {
            (acc[person.prodi] = acc[person.prodi] || []).push(person);
            return acc;
        }, {});

        let totals = { hadir: 0, dd: 0, sakit: 0, izin: 0, alpa: 0, piketRusun: 0, piketKelas: 0, lokananta: 0 };
        
        for (let i = 0; i < personnelData.length; i++) {
            const status = document.querySelector(`.status-select[data-index="${i}"]`).value;
            if (totals[status] !== undefined) totals[status]++;
        }

        const kurang = personnelData.length - totals.hadir;
        summaryContainer.innerHTML = `
            <h4>Rekapitulasi ${SESSIONS[activeSession]}</h4>
            <div class="summary-grid global-summary">
                <div class="summary-item"><span>Jumlah</span><strong>${personnelData.length}</strong></div>
                <div class="summary-item"><span>Hadir</span><strong>${totals.hadir}</strong></div>
                <div class="summary-item"><span>Kurang</span><strong>${kurang}</strong></div>
                <div class="summary-item"><span>DD</span><strong>${totals.dd}</strong></div>
                <div class="summary-item"><span>Sakit</span><strong>${totals.sakit}</strong></div>
                <div class="summary-item"><span>Izin</span><strong>${totals.izin}</strong></div>
            </div>
            <hr>
            <div class="summary-grid global-summary">
                <div class="summary-item"><span>Piket Rusun</span><strong>${totals.piketRusun}</strong></div>
                <div class="summary-item"><span>Piket Kelas</span><strong>${totals.piketKelas}</strong></div>
                <div class="summary-item"><span>Lokananta</span><strong>${totals.lokananta}</strong></div>
            </div>`;

        Object.keys(groupedByProdi).forEach(prodi => {
            let prodiTotals = { hadir: 0 };
            const prodiPersonnel = groupedByProdi[prodi];
            
            prodiPersonnel.forEach(person => {
                const originalIndex = personnelData.findIndex(p => p.nama === person.nama);
                const status = document.querySelector(`.status-select[data-index="${originalIndex}"]`).value;
                if(status === 'hadir') prodiTotals.hadir++;
            });
            
            const prodiSummaryContainer = document.getElementById(`summary-${prodi}`);
            if (prodiSummaryContainer) {
                const prodiKurang = prodiPersonnel.length - prodiTotals.hadir;
                prodiSummaryContainer.innerHTML = `
                    <h4>Rekap ${prodi}</h4>
                    <div class="summary-grid">
                        <div class="summary-item"><span>Total</span><strong>${prodiPersonnel.length}</strong></div>
                        <div class="summary-item"><span>Hadir</span><strong>${prodiTotals.hadir}</strong></div>
                        <div class="summary-item"><span>Kurang</span><strong>${prodiKurang}</strong></div>
                    </div>`;
            }
        });
    }

    // --- Manajemen Data (Simpan, Muat, Reset) ---
    function getStorageKey() {
        return `attendance_${datePicker.value}_${activeSession}`;
    }

    function saveAttendanceData() {
        const attendanceData = [];
        for(let i=0; i < personnelData.length; i++) {
            const status = document.querySelector(`.status-select[data-index="${i}"]`).value;
            const keterangan = document.querySelector(`.keterangan-input[data-index="${i}"]`).value;
            attendanceData.push({ status, keterangan });
        }
        localStorage.setItem(getStorageKey(), JSON.stringify(attendanceData));
        
        saveNotification.textContent = `Data ${SESSIONS[activeSession]} untuk ${datePicker.value} berhasil disimpan!`;
        saveNotification.style.display = 'block';
        setTimeout(() => saveNotification.style.display = 'none', 3000);
    }

    function loadAttendanceData() {
        const savedData = localStorage.getItem(getStorageKey());
        if (savedData) {
            const attendanceData = JSON.parse(savedData);
            if(attendanceData.length === personnelData.length) {
                for(let i=0; i < personnelData.length; i++) {
                    document.querySelector(`.status-select[data-index="${i}"]`).value = attendanceData[i].status;
                    document.querySelector(`.keterangan-input[data-index="${i}"]`).value = attendanceData[i].keterangan;
                }
            } else { resetAttendance(); }
        } else { resetAttendance(); }
        updateAllSummaries();
    }

    function resetAttendance() {
        document.querySelectorAll('.status-select').forEach(select => select.value = 'hadir');
        document.querySelectorAll('.keterangan-input').forEach(input => input.value = '');
        updateAllSummaries();
    }
    
    // --- FUNGSI EKSPOR YANG DIPERBARUI ---
    function exportToExcel() {
        let csvContent = "data:text/csv;charset=utf-8,";
        const sessionTitle = `REKAPITULASI ${SESSIONS[activeSession].toUpperCase()} - ${datePicker.value}\r\n\r\n`;

        // 1. Hitung dan tambahkan Rekapitulasi Keseluruhan di awal
        let grandTotals = { hadir: 0, dd: 0, sakit: 0, izin: 0, alpa: 0, piketRusun: 0, piketKelas: 0, lokananta: 0 };
        for (let i = 0; i < personnelData.length; i++) {
            const status = document.querySelector(`.status-select[data-index="${i}"]`).value;
            if (grandTotals[status] !== undefined) grandTotals[status]++;
        }
        const grandKurang = personnelData.length - grandTotals.hadir;

        let summaryCsv = "REKAPITULASI KESELURUHAN\r\n";
        summaryCsv += `Jumlah,"${personnelData.length}"\r\n`;
        summaryCsv += `Hadir,"${grandTotals.hadir}"\r\n`;
        summaryCsv += `Kurang,"${grandKurang}"\r\n`;
        summaryCsv += `DD,"${grandTotals.dd}"\r\n`;
        summaryCsv += `Sakit,"${grandTotals.sakit}"\r\n`;
        summaryCsv += `Izin,"${grandTotals.izin}"\r\n`;
        summaryCsv += `Piket Rusun,"${grandTotals.piketRusun}"\r\n`;
        summaryCsv += `Piket Kelas,"${grandTotals.piketKelas}"\r\n`;
        summaryCsv += `Lokananta,"${grandTotals.lokananta}"\r\n\r\n`;
        summaryCsv += "----------------------------------------\r\n\r\n";
        
        csvContent += sessionTitle + summaryCsv;

        // 2. Kelompokkan data per prodi
        const groupedByProdi = personnelData.reduce((acc, person) => {
            (acc[person.prodi] = acc[person.prodi] || []).push(person);
            return acc;
        }, {});

        // 3. Buat tabel dan rekap untuk setiap prodi
        Object.keys(groupedByProdi).forEach(prodi => {
            const prodiPersonnel = groupedByProdi[prodi];
            
            csvContent += `PRODI: ${prodi.toUpperCase()}\r\n`;
            
            // Hitung rekap prodi
            let prodiTotals = { hadir: 0, dd: 0, sakit: 0, izin: 0, alpa: 0, piketRusun: 0, piketKelas: 0, lokananta: 0 };
            prodiPersonnel.forEach(person => {
                const originalIndex = personnelData.findIndex(p => p.nama === person.nama);
                const status = document.querySelector(`.status-select[data-index="${originalIndex}"]`).value;
                if (prodiTotals[status] !== undefined) prodiTotals[status]++;
            });
            const prodiKurang = prodiPersonnel.length - prodiTotals.hadir;

            csvContent += `Jumlah,"${prodiPersonnel.length}",Hadir,"${prodiTotals.hadir}",Kurang,"${prodiKurang}"\r\n`;
            csvContent += `DD,"${prodiTotals.dd}",Sakit,"${prodiTotals.sakit}",Izin,"${prodiTotals.izin}"\r\n`;
            csvContent += `Piket Rusun,"${prodiTotals.piketRusun}",Piket Kelas,"${prodiTotals.piketKelas}",Lokananta,"${prodiTotals.lokananta}"\r\n\r\n`;
            
            // Header tabel prodi
            csvContent += "No,Nama,Status,Keterangan\r\n";

            // Data personel prodi
            prodiPersonnel.forEach((person, personIndex) => {
                const originalIndex = personnelData.findIndex(p => p.nama === person.nama);
                const statusSelect = document.querySelector(`.status-select[data-index="${originalIndex}"]`);
                const statusText = statusSelect.options[statusSelect.selectedIndex].text;
                let keterangan = document.querySelector(`.keterangan-input[data-index="${originalIndex}"]`).value.replace(/"/g, '""');
                if (keterangan.includes(",")) keterangan = `"${keterangan}"`;
                
                csvContent += `${personIndex + 1},"${person.nama}","${statusText}","${keterangan}"\r\n`;
            });

            csvContent += "\r\n----------------------------------------\r\n\r\n";
        });
        
        // 4. Buat dan unduh file
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        const sessionName = SESSIONS[activeSession].replace(/\s+/g, '-');
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `Laporan-Absensi-${sessionName}-${datePicker.value}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
});

