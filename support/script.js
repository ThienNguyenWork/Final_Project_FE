document.addEventListener("DOMContentLoaded", () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        window.location.href = "/login";
        return;
    }

    if (user.role === "user") {
        document.getElementById("user-support").classList.remove("hidden");
    } else if (user.role === "artist") {
        document.getElementById("artist-support").classList.remove("hidden");
    } else if (user.role === "admin") {
        document.getElementById("admin-support").classList.remove("hidden");
    }

    const requests = JSON.parse(localStorage.getItem("supportRequests")) || [];
    renderRequests(requests);
});

function submitRequest(role) {
    const content = document.getElementById(`${role}-content`).value;
    const category = document.getElementById(`${role}-category`).value;

    if (!content) return alert("Vui lòng nhập nội dung yêu cầu.");

    const user = JSON.parse(localStorage.getItem("user"));
    const requests = JSON.parse(localStorage.getItem("supportRequests")) || [];

    requests.push({
        id: Date.now(),
        role: user.role,
        username: user.username,
        category: category,
        content: content,
        status: "Pending",
        timestamp: new Date().toLocaleString()
    });

    localStorage.setItem("supportRequests", JSON.stringify(requests));
    alert("Yêu cầu đã được gửi!");
    location.reload();
}

function renderRequests(requests) {
    const adminTable = document.getElementById("admin-table-body");
    adminTable.innerHTML = "";

    requests.forEach(req => {
        const row = `<tr class="border-b hover:bg-gray-100 transition">
            <td class="p-2">${req.username}</td>
            <td class="p-2">${req.role}</td>
            <td class="p-2">${req.category}</td>
            <td class="p-2">${req.content}</td>
            <td class="p-2">${req.status}</td>
            <td class="p-2">${req.timestamp}</td>
            <td class="p-2 flex gap-2">
                <button class="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-4 py-2 rounded shadow hover:scale-105 transition-transform" onclick="resolveRequest(${req.id})">Xử lý</button>
                <button class="bg-gradient-to-r from-red-500 to-red-700 text-white px-4 py-2 rounded shadow hover:scale-105 transition-transform" onclick="deleteRequest(${req.id})">Xoá</button>
            </td>
        </tr>`;
        adminTable.innerHTML += row;
    });
}

function resolveRequest(id) {
    const requests = JSON.parse(localStorage.getItem("supportRequests")) || [];
    const updatedRequests = requests.map(req => {
        if (req.id === id) req.status = "Resolved";
        return req;
    });

    localStorage.setItem("supportRequests", JSON.stringify(updatedRequests));
    alert("Đã xử lý yêu cầu.");
    location.reload();
}

function deleteRequest(id) {
    const requests = JSON.parse(localStorage.getItem("supportRequests")) || [];
    const updatedRequests = requests.filter(req => req.id !== id);

    localStorage.setItem("supportRequests", JSON.stringify(updatedRequests));
    alert("Đã xoá yêu cầu.");
    location.reload();
}