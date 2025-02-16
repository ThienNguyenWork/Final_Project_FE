fetch("data.json")
  .then(response => response.json())  // Chuyển đổi thành JSON
  .then(data => {
    let userList = document.getElementById("user-list");
    userList.innerHTML = ""; // Xóa nội dung mặc định

    data.forEach(user => {
      let userCard = document.createElement("div");
      userCard.classList.add("user-card");
      userCard.innerHTML = `<h3>${user.name}</h3>
                            <img src="${user.img}"> 
                            <p>City: ${user.description}</p>`;
      userList.appendChild(userCard);
    });
  })
  .catch(error => console.error("Error loading JSON:", error));