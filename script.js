:root {
    --primary-color: #4f46e5;
    --secondary-color: #71717a;
    --success-color: #16a34a;
    --danger-color: #dc2626;
    --background-color: #18181b;
    --card-background: #27272a;
    --border-color: #3f3f46;
    --text-primary: #f4f4f5;
    --text-secondary: #a1a1aa;
    --font-family: 'Inter', sans-serif;
    --border-radius: 12px;
}

body {
    font-family: var(--font-family);
    background-color: var(--background-color);
    margin: 0;
    padding: 1rem;
    color: var(--text-primary);
}

.container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 90vh;
}

.card {
    background-color: var(--card-background);
    padding: 1.5rem;
    border-radius: var(--border-radius);
    border: 1px solid var(--border-color);
    width: 100%;
    max-width: 400px;
}

#app-container {
    width: 100%;
    max-width: 1200px;
    margin: auto;
}

.card-title {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0 0 0.5rem 0;
    text-align: center;
}
.card-subtitle {
    font-size: 1rem;
    color: var(--text-secondary);
    margin-bottom: 1.5rem;
    text-align: center;
}

.input-group { margin-bottom: 1rem; }
.input-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: var(--text-secondary);
}

input[type="text"], input[type="password"], input[type="date"], select {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid var(--border-color);
    background-color: var(--background-color);
    color: var(--text-primary);
    border-radius: var(--border-radius);
    box-sizing: border-box;
    font-size: 1rem;
    transition: all 0.2s;
}
input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(1); cursor: pointer; }
input:focus, select:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.5);
}

.btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.75rem 1.25rem;
    border: none;
    border-radius: var(--border-radius);
    cursor: pointer;
    font-size: 1rem;
    font-weight: 600;
    transition: all 0.2s;
}
.icon { width: 1.125rem; height: 1.125rem; }

.btn-primary { background-color: var(--primary-color); color: white; width: 100%; }
.btn-primary:hover { background-color: #4338ca; }
.btn-danger { background-color: var(--danger-color); color: white; }
.btn-danger:hover { background-color: #b91c1c; }
.btn-secondary { background-color: #3f3f46; color: var(--text-primary); }
.btn-secondary:hover { background-color: #52525b; }
.btn-success { background-color: var(--success-color); color: white; }
.btn-success:hover { background-color: #15803d; }

.header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;
    flex-wrap: wrap;
    gap: 1rem;
}
.header h1 { font-size: 1.75rem; margin: 0; }
.clock { color: var(--text-secondary); font-size: 0.875rem; margin-top: 0.25rem; }

.controls {
    max-width: none;
    margin-bottom: 1rem;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: flex-end;
    gap: 1rem;
}
.controls .input-group { margin-bottom: 0; flex-grow: 1; }
.button-group { display: flex; flex-wrap: wrap; gap: 0.5rem; }

.error-message { color: var(--danger-color); text-align: center; margin-top: 1rem; height: 1.25rem; }
.notification {
    padding: 1rem;
    background-color: var(--success-color);
    color: white;
    border-radius: var(--border-radius);
    text-align: center;
    margin-bottom: 1rem;
}

/* --- TABS BARU UNTUK APEL --- */
.session-tabs-nav {
    display: flex;
    background-color: var(--card-background);
    border-radius: var(--border-radius);
    padding: 0.5rem;
    margin-bottom: 1rem;
    overflow-x: auto;
}
.session-tab-link {
    flex: 1;
    text-align: center;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    cursor: pointer;
    border: none;
    background-color: transparent;
    color: var(--text-secondary);
    font-weight: 600;
    transition: all 0.3s;
    white-space: nowrap;
}
.session-tab-link.active {
    background-color: var(--primary-color);
    color: white;
}

.summary-card { max-width: none; margin-bottom: 1rem; }
.summary-card h4 { margin-top: 0; text-align: center; color: var(--text-secondary); font-weight: 500;}
.summary-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(90px, 1fr)); gap: 1rem; }
.summary-item { text-align: center; background: var(--background-color); padding: 1rem; border-radius: var(--border-radius);}
.summary-item span { font-size: 0.875rem; color: var(--text-secondary); display: block; margin-bottom: 0.25rem; }
.summary-item strong { font-size: 1.5rem; color: var(--text-primary); }
.summary-card hr { border: 0; border-top: 1px solid var(--border-color); margin: 1rem 0; }
.global-summary .summary-item strong { color: var(--primary-color); }

.tabs-nav {
    display: flex;
    border-bottom: 1px solid var(--border-color);
    margin-bottom: 1rem;
    overflow-x: auto;
}
.tab-link {
    padding: 1rem 1.5rem;
    cursor: pointer;
    border: none;
    background-color: transparent;
    border-bottom: 3px solid transparent;
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-secondary);
    transition: all 0.2s;
    white-space: nowrap;
}
.tab-link.active, .tab-link:hover {
    color: var(--primary-color);
    border-bottom-color: var(--primary-color);
}
.tab-pane { display: none; }
.tab-pane.active { display: block; animation: fadeIn 0.5s; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

.table-container { 
    background-color: var(--card-background);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    overflow-x: auto;
}
table { width: 100%; border-collapse: collapse; }
th, td { padding: 1rem; text-align: left; border-bottom: 1px solid var(--border-color); }
thead th { background-color: #3f3f46; font-weight: 600; white-space: nowrap; }
tbody tr:last-child td { border-bottom: none; }
tbody tr:hover { background-color: #3f3f46; }

.prodi-summary {
    margin-top: 1rem;
    padding: 1rem;
    background-color: var(--card-background);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
}
.prodi-summary h4 { margin-top: 0; color: var(--text-secondary); font-weight: 500; }
.prodi-summary .summary-item { background: transparent; padding: 0; }

/* --- TATA LETAK MOBILE --- */
@media (max-width: 768px) {
    body { padding: 0.5rem; }
    .header h1 { font-size: 1.5rem; }
    .btn-text { display: none; } /* Sembunyikan teks di tombol */
    .btn { padding: 0.75rem; }
    .button-group { justify-content: space-around; }
    .controls { align-items: stretch; }
    .controls .input-group { min-width: 100%; }
    .summary-grid { grid-template-columns: repeat(auto-fit, minmax(80px, 1fr)); gap: 0.5rem; }
    .summary-item strong { font-size: 1.25rem; }
    .tab-link { padding: 0.75rem 1rem; }
    th, td { padding: 0.75rem; }
}

