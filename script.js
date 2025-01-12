const users = [
    { username: "admin", password: "1234", role: "supAdm" },
    { username: "manager", password: "1234", role: "perAdm" },
    { username: "kasir", password: "1234", role: "perKas" },
    { username: "guest", password: "1234", role: "perOther" },
];

const roleAccess = {
    supAdm: ["dashboard", "pelanggan", "transaksi", "laporan"],
    perAdm: ["dashboard", "pelanggan", "transaksi", "laporan"],
    perKas: ["dashboard", "transaksi", "laporan"],
    perOther: ["dashboard"],
};

document.addEventListener("DOMContentLoaded", function () {
    const app = document.getElementById("app");

    function renderPage(page) {
        fetch(page)
            .then((response) => response.text())
            .then((html) => {
                app.innerHTML = html;
                if (page === "dashboard.html") loadDashboard();
            })
            .catch(() => (app.innerHTML = "<h1>404 - Page Not Found</h1>"));
    }

    function loadDashboard() {
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        const accessiblePages = roleAccess[currentUser.role] || [];
        const nav = document.getElementById("navigation");

        nav.innerHTML = accessiblePages
            .map(
                (page) =>
                    `<li class="nav-item">
                        <a class="nav-link" href="#" data-page="${page}">${page.charAt(0).toUpperCase() + page.slice(1)}</a>
                    </li>`
            )
            .join("");

        document.getElementById("logout").addEventListener("click", () => {
            localStorage.removeItem("currentUser");
            renderPage("login.html");
        });

        nav.addEventListener("click", (e) => {
            if (e.target.tagName === "A") {
                const page = e.target.getAttribute("data-page");
                if (accessiblePages.includes(page)) renderPage(`halaman/${page}.html`);
                else alert("Anda tidak memiliki akses ke halaman ini.");
            }
        });
    }

    app.addEventListener("submit", (e) => {
        if (e.target.id === "loginForm") {
            e.preventDefault();
            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;

            const user = users.find((u) => u.username === username && u.password === password);

            if (user) {
                localStorage.setItem("currentUser", JSON.stringify(user));
                renderPage("dashboard.html");
            } else {
                alert("Username atau password salah!");
            }
        }
    });

    renderPage("login.html");
});
