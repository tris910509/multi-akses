document.addEventListener("DOMContentLoaded", function () {
    const app = document.getElementById("app");
    const users = JSON.parse(localStorage.getItem("users")) || [];

    function renderUserPage() {
        app.innerHTML = `
            <div class="container mt-4">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h3>Manajemen User</h3>
                    <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addUserModal">+ Tambah User</button>
                </div>
                <table class="table table-hover table-striped">
                    <thead class="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>Nama</th>
                            <th>Peran</th>
                            <th>Email</th>
                            <th>Status</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody id="userTable">
                        ${users
                            .map(
                                (user) => `
                                <tr>
                                    <td>${user.id}</td>
                                    <td>${user.name}</td>
                                    <td>${user.role}</td>
                                    <td>${user.email}</td>
                                    <td>
                                        <div class="form-check form-switch">
                                            <input 
                                                class="form-check-input toggle-status" 
                                                type="checkbox" 
                                                data-id="${user.id}" 
                                                ${user.active ? "checked" : ""}
                                            >
                                            <label class="form-check-label">
                                                ${user.active ? "Aktif" : "Nonaktif"}
                                            </label>
                                        </div>
                                    </td>
                                    <td>
                                        <button class="btn btn-warning btn-sm edit-user" data-id="${user.id}">Edit</button>
                                        <button class="btn btn-danger btn-sm delete-user" data-id="${user.id}">Hapus</button>
                                    </td>
                                </tr>
                            `
                            )
                            .join("")}
                    </tbody>
                </table>
            </div>

            <!-- Modal Tambah/Edit User -->
            <div class="modal fade" id="addUserModal" tabindex="-1" aria-labelledby="addUserModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="addUserModalLabel">Tambah User</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form id="userForm">
                                <input type="hidden" id="userId">
                                <div class="mb-3">
                                    <label for="userName" class="form-label">Nama User</label>
                                    <input type="text" class="form-control" id="userName" required>
                                </div>
                                <div class="mb-3">
                                    <label for="userRole" class="form-label">Peran</label>
                                    <select class="form-select" id="userRole" required>
                                        <option value="SupAdm">SupAdm</option>
                                        <option value="Kasir">Kasir</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div class="mb-3">
                                    <label for="userEmail" class="form-label">Email</label>
                                    <input type="email" class="form-control" id="userEmail" required>
                                </div>
                                <div class="mb-3">
                                    <label for="userPassword" class="form-label">Password</label>
                                    <input type="password" class="form-control" id="userPassword" required>
                                </div>
                                <div class="mb-3" id="manualData" style="display: none;">
                                    <label for="otherData" class="form-label">Data Tambahan</label>
                                    <textarea class="form-control" id="otherData" placeholder="Masukkan data tambahan..."></textarea>
                                </div>
                                <button type="submit" class="btn btn-primary w-100">Simpan</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const toggleStatus = document.querySelectorAll(".toggle-status");
        toggleStatus.forEach((toggle) =>
            toggle.addEventListener("change", (e) => {
                const id = e.target.dataset.id;
                const user = users.find((u) => u.id === id);
                user.active = e.target.checked;
                saveUsers();
                renderUserPage();
            })
        );

        document.querySelectorAll(".edit-user").forEach((btn) =>
            btn.addEventListener("click", (e) => {
                const id = e.target.dataset.id;
                const user = users.find((u) => u.id === id);
                document.getElementById("userId").value = user.id;
                document.getElementById("userName").value = user.name;
                document.getElementById("userRole").value = user.role;
                document.getElementById("userEmail").value = user.email;
                document.getElementById("userPassword").value = "";
                document.getElementById("otherData").value = user.otherData || "";
                document.getElementById("manualData").style.display = user.role === "Other" ? "block" : "none";
                const modal = new bootstrap.Modal(document.getElementById("addUserModal"));
                modal.show();
            })
        );

        document.querySelectorAll(".delete-user").forEach((btn) =>
            btn.addEventListener("click", (e) => {
                const id = e.target.dataset.id;
                const index = users.findIndex((u) => u.id === id);
                if (index !== -1) {
                    users.splice(index, 1);
                    saveUsers();
                    renderUserPage();
                }
            })
        );

        document.getElementById("userRole").addEventListener("change", (e) => {
            document.getElementById("manualData").style.display = e.target.value === "Other" ? "block" : "none";
        });

        document.getElementById("userForm").addEventListener("submit", (e) => {
            e.preventDefault();
            const id = document.getElementById("userId").value || Date.now().toString();
            const name = document.getElementById("userName").value;
            const role = document.getElementById("userRole").value;
            const email = document.getElementById("userEmail").value;
            const password = md5(document.getElementById("userPassword").value);
            const otherData = document.getElementById("otherData").value;
            const active = true;

            const userIndex = users.findIndex((u) => u.id === id);

            if (userIndex !== -1) {
                users[userIndex] = { id, name, role, email, password, otherData, active };
            } else {
                users.push({ id, name, role, email, password, otherData, active });
            }

            saveUsers();
            const modal = bootstrap.Modal.getInstance(document.getElementById("addUserModal"));
            modal.hide();
            renderUserPage();
        });
    }

    function saveUsers() {
        localStorage.setItem("users", JSON.stringify(users));
    }

    renderUserPage();
});
