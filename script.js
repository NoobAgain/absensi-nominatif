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
    const saveNotification = document.getElementById('save-notification');
    const summaryContainer = document.getElementById('summary-container');
    const tabsNav = document.getElementById('tabs-nav');
    const tabsContent = document.getElementById('tabs-content');

    // --- Logika Login Sederhana ---
    const validUsername = 'admin';
    const validPassword = 'password';

    if (localStorage.getItem('isLoggedIn') === 'true') showApp();
    else showLogin();
    
    function showLogin() {
        loginContainer.style.display = 'flex';
        appContainer.style.display = 'none';
    }
    
    function showApp() {
        loginContainer.style.display = 'none';
        appContainer.style.display = 'block';
        feather.replace(); // Re-initialize icons
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

    function initApp() {
        const today = new Date().toISOString().split('T')[0];
        datePicker.value = today;
        
        populateTabsAndTables();
        loadAttendanceData();

        datePicker.addEventListener('change', loadAttendanceData);
        resetButton.addEventListener('click', resetAttendance);
        saveButton.addEventListener('click', saveAttendanceData);
    }

    function populateTabsAndTables() {
        const groupedByProdi = personnelData.reduce((acc, person) => {
            (acc[person.prodi] = acc[person.prodi] || []).push(person);
            return acc;
        }, {});

        tabsNav.innerHTML = '';
        tabsContent.innerHTML = '';

        Object.keys(groupedByProdi).forEach((prodi, index) => {
            const isActive = index === 0 ? 'active' : '';
            
            // Buat tombol navigasi tab
            const tabButton = document.createElement('button');
            tabButton.className = `tab-link ${isActive}`;
            tabButton.textContent = prodi;
            tabButton.setAttribute('data-tab', prodi);
            tabsNav.appendChild(tabButton);

            // Buat konten tab (div yang berisi tabel dan rekap prodi)
            const tabPane = document.createElement('div');
            tabPane.id = prodi;
            tabPane.className = `tab-pane ${isActive}`;
            
            const tableHTML = `
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Nama</th>
                                <th>Status</th>
                                <th>Keterangan</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${groupedByProdi[prodi].map((person, personIndex) => {
                                const originalIndex = personnelData.findIndex(p => p.nama === person.nama && p.prodi === person.prodi);
                                return `
                                <tr>
                                    <td>${personIndex + 1}</td>
                                    <td>${person.nama}</td>
                                    <td>
                                        <select class="status-select" data-index="${originalIndex}">
                                            <option value="hadir">Hadir</option>
                                            <option value="dd">DD</option>
                                            <option value="sakit">Sakit</option>
                                            <option value="izin">Izin</option>
                                            <option value="alpa">Alpa</option>
                                        </select>
                                    </td>
                                    <td><input type="text" class="keterangan-input" placeholder="Isi jika perlu..." data-index="${originalIndex}"></td>
                                </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>`;
            
            const prodiSummaryHTML = `<div id="summary-${prodi}" class="prodi-summary"></div>`;
            tabPane.innerHTML = tableHTML + prodiSummaryHTML;
            tabsContent.appendChild(tabPane);
        });
        
        document.querySelectorAll('.tab-link').forEach(button => {
            button.addEventListener('click', () => {
                document.querySelectorAll('.tab-link, .tab-pane').forEach(el => el.classList.remove('active'));
                const tabId = button.getAttribute('data-tab');
                button.classList.add('active');
                document.getElementById(tabId).classList.add('active');
            });
        });

        document.querySelectorAll('.status-select, .keterangan-input').forEach(el => {
            el.addEventListener('change', updateAllSummaries);
            el.addEventListener('keyup', updateAllSummaries);
        });
    }
    
    function updateAllSummaries() {
        const groupedByProdi = personnelData.reduce((acc, person) => {
            (acc[person.prodi] = acc[person.prodi] || []).push(person);
            return acc;
        }, {});

        // Kalkulasi Global
        let total = personnelData.length, hadir = 0, dd = 0, sakit = 0, izin = 0;
        let piketRusun = 0, piketKelas = 0, lokananta = 0;
        
        for(let i=0; i < personnelData.length; i++) {
            const status = document.querySelector(`.status-select[data-index="${i}"]`).value;
            if (status === 'hadir') hadir++;
            if (status === 'dd') dd++;
            if (status === 'sakit') sakit++;
            if (status === 'izin') izin++;
            
            const keterangan = document.querySelector(`.keterangan-input[data-index="${i}"]`).value.toLowerCase();
            if (keterangan.includes('piket rusun')) piketRusun++;
            if (keterangan.includes('piket kelas')) piketKelas++;
            if (keterangan.includes('lokananta')) lokananta++;
        }

        const kurang = total - hadir;

        summaryContainer.innerHTML = `
            <h4>Rekapitulasi Keseluruhan</h4>
            <div class="summary-grid global-summary">
                <div class="summary-item"><span>Jumlah</span><strong>${total}</strong></div>
                <div class="summary-item"><span>Hadir</span><strong>${hadir}</strong></div>
                <div class="summary-item"><span>Kurang</span><strong>${kurang}</strong></div>
                <div class="summary-item"><span>DD</span><strong>${dd}</strong></div>
                <div class="summary-item"><span>Sakit</span><strong>${sakit}</strong></div>
                <div class="summary-item"><span>Izin</span><strong>${izin}</strong></div>
            </div>
            <hr>
            <div class="summary-grid global-summary">
                <div class="summary-item"><span>Piket Rusun</span><strong>${piketRusun}</strong></div>
                <div class="summary-item"><span>Piket Kelas</span><strong>${piketKelas}</strong></div>
                <div class="summary-item"><span>Lokananta</span><strong>${lokananta}</strong></div>
            </div>`;

        // Kalkulasi per Prodi
        Object.keys(groupedByProdi).forEach(prodi => {
            let prodiHadir = 0, prodiDD = 0, prodiSakit = 0, prodiIzin = 0;
            const prodiPersonnel = groupedByProdi[prodi];
            
            prodiPersonnel.forEach(person => {
                const originalIndex = personnelData.findIndex(p => p.nama === person.nama);
                const status = document.querySelector(`.status-select[data-index="${originalIndex}"]`).value;
                if (status === 'hadir') prodiHadir++;
                if (status === 'dd') prodiDD++;
                if (status === 'sakit') prodiSakit++;
                if (status === 'izin') prodiIzin++;
            });
            
            const prodiSummaryContainer = document.getElementById(`summary-${prodi}`);
            prodiSummaryContainer.innerHTML = `
                <h4>Rekap ${prodi}</h4>
                <div class="summary-grid">
                    <div class="summary-item"><span>Total</span><strong>${prodiPersonnel.length}</strong></div>
                    <div class="summary-item"><span>Hadir</span><strong>${prodiHadir}</strong></div>
                    <div class="summary-item"><span>DD</span><strong>${prodiDD}</strong></div>
                    <div class="summary-item"><span>Sakit</span><strong>${prodiSakit}</strong></div>
                    <div class="summary-item"><span>Izin</span><strong>${prodiIzin}</strong></div>
                </div>`;
        });
    }

    function saveAttendanceData() {
        const date = datePicker.value;
        const attendanceData = [];
        
        for(let i=0; i < personnelData.length; i++) {
            const status = document.querySelector(`.status-select[data-index="${i}"]`).value;
            const keterangan = document.querySelector(`.keterangan-input[data-index="${i}"]`).value;
            attendanceData.push({ status, keterangan });
        }

        localStorage.setItem(`attendance_${date}`, JSON.stringify(attendanceData));
        
        saveNotification.textContent = 'Data absensi untuk ' + date + ' berhasil disimpan!';
        saveNotification.style.display = 'block';
        setTimeout(() => saveNotification.style.display = 'none', 3000);
    }

    function loadAttendanceData() {
        const date = datePicker.value;
        const savedData = localStorage.getItem(`attendance_${date}`);
        
        if (savedData) {
            const attendanceData = JSON.parse(savedData);
            if(attendanceData.length === personnelData.length) {
                for(let i=0; i < personnelData.length; i++) {
                    document.querySelector(`.status-select[data-index="${i}"]`).value = attendanceData[i].status;
                    document.querySelector(`.keterangan-input[data-index="${i}"]`).value = attendanceData[i].keterangan;
                }
            } else {
                resetAttendance();
            }
        } else {
            resetAttendance();
        }
        updateAllSummaries();
    }

    function resetAttendance() {
        document.querySelectorAll('.status-select').forEach(select => select.value = 'hadir');
        document.querySelectorAll('.keterangan-input').forEach(input => input.value = '');
        updateAllSummaries();
    }
});

