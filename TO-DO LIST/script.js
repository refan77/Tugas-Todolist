const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");
const categorySelect = document.getElementById("category");
const filterSelect = document.getElementById("filter");
const completedCounter = document.getElementById("completed-counter");
const uncompletedCounter = document.getElementById("uncompleted-counter");
const clearAllButton = document.getElementById("clear-all");
const colorPicker = document.getElementById("color-picker");
const darkModeButton = document.getElementById("dark-mode-toggle");

// Dark mode toggle
darkModeButton.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
});

// Simpan & muat tugas dari local storage
function saveTask() {
    const tasks = [];
    document.querySelectorAll("#list-container li").forEach(li => {
        tasks.push({
            text: li.querySelector(".task-text").innerText,
            completed: li.classList.contains("completed"),
            category: li.dataset.category,
            color: li.style.backgroundColor
        });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTask() {
    listContainer.innerHTML = ""; // Kosongkan daftar sebelum memuat ulang
    const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    tasks.forEach(task => addTask(task.text, task.completed, task.color, task.category, false));
    updateCounter();
}

// Tambah tugas baru
function addTask(taskText = null, completed = false, taskColor = null, taskCategory = null, save = true) {
    if (!taskText) {
        taskText = inputBox.value.trim();
        taskColor = colorPicker.value;
        taskCategory = categorySelect.value;

        if (!taskText) {
            alert("Silahkan masukkan tugas!");
            return;
        }
    }

    const li = document.createElement("li");
    li.style.backgroundColor = taskColor;
    li.classList.add("task-item");
    li.dataset.category = taskCategory;

    li.innerHTML = `
        <label style="flex: 1; display: flex; align-items: center;">
            <input type="checkbox" class="task-checkbox" ${completed ? "checked" : ""}>
            <span class="task-text">${taskText} <small>(${taskCategory})</small></span>
        </label>
        <div class="button-group">
            <button class="edit-btn">✏️</button>
            <button class="delete-btn">❌</button>
        </div>
    `;

    if (completed) {
        li.classList.add("completed");
    }

    listContainer.appendChild(li);
    inputBox.value = "";

    if (save) saveTask();
    updateCounter(); // Perbarui jumlah selesai/belum selesai

    // Event Listener untuk checkbox
    const checkBox = li.querySelector(".task-checkbox");
    checkBox.addEventListener("change", function () {
        li.classList.toggle("completed", checkBox.checked);
        saveTask();
        updateCounter();
        filterTasks(); // Perbarui tampilan setelah mengubah status
    });

    // Edit Tugas
    li.querySelector(".edit-btn").addEventListener("click", function () {
        const taskText = li.querySelector(".task-text").innerText; // Ambil teks tugas saat ini
        const newText = prompt("Edit tugas:", taskText); // Meminta input baru dari pengguna

        if (newText) {
            li.querySelector(".task-text").innerHTML = `${newText} <small>(${taskCategory})</small>`; // Perbarui teks tugas
            saveTask(); // Simpan tugas setelah diedit
        }
    });

    // Hapus Tugas
    li.querySelector(".delete-btn").addEventListener("click", function () {
        if (confirm("Hapus tugas ini?")) {
            li.remove(); // Hapus elemen tugas
            saveTask(); // Simpan perubahan
            updateCounter(); // Perbarui jumlah tugas
        }
    });

    filterTasks(); // Pastikan filter tetap berlaku setelah menambah tugas
}

// Perbaiki fungsi Filter Tugas
function filterTasks() {
    const filterValue = filterSelect.value; // Ambil nilai filter
    document.querySelectorAll(".task-item").forEach(li => {
        const category = li.dataset.category; // Ambil kategori dari data atribut
        const isCompleted = li.classList.contains("completed"); // Cek apakah tugas sudah selesai

        // Tampilkan atau sembunyikan tugas berdasarkan filter
        if (filterValue === "all" || category === filterValue) {
            li.style.display = "flex"; // Tampilkan tugas
        } else {
            li.style.display = "none"; // Sembunyikan tugas
        }
    });
}

// Perbarui Jumlah Selesai/Belum Selesai
function updateCounter() {
    const totalTasks = document.querySelectorAll(".task-item").length; // Hitung total tugas
    const completedTasks = document.querySelectorAll(".task-item.completed").length; // Hitung tugas yang selesai
    const uncompletedTasks = totalTasks - completedTasks; // Hitung tugas yang belum selesai
    completedCounter.innerText = completedTasks; // Perbarui jumlah tugas selesai
    uncompletedCounter.innerText = uncompletedTasks; // Perbarui jumlah tugas belum selesai
}

// Event Listener untuk Filter
filterSelect.addEventListener("change", filterTasks);
// Event Listener untuk Hapus Semua
clearAllButton.addEventListener("click", () => {
    if (confirm("Hapus semua tugas?")) {
        listContainer.innerHTML = ""; // Kosongkan daftar tugas
        localStorage.removeItem("tasks"); // Hapus tugas dari localStorage
        updateCounter(); // Perbarui jumlah tugas
    }
});
// Panggil fungsi untuk memuat tugas saat halaman dimuat
loadTask();