// Load dữ liệu từ products.json
async function loadProducts() {
    try {
        const response = await fetch('products.json'); // Đảm bảo đường dẫn đúng
        const { musicGenres, moodPlaylist, popularArtists, musicVideo, newReleaseSongs, newAlbums } = await response.json();

        // ✅ Giới hạn 5 sản phẩm cho mỗi danh sách
        renderMusicGenres(document.getElementById('musicGenres'), musicGenres.slice(0, 4));
        renderMoodPlaylist(document.getElementById('moodPlaylist'), moodPlaylist.slice(0, 5));
        renderPopularArtists(document.getElementById('popularArtists'), popularArtists.slice(0, 6));
        renderMusicVideo(document.getElementById('musicVideo'), musicVideo.slice(0, 6));
        renderNewReleaseSongs(document.getElementById('newReleaseSongs'), newReleaseSongs.slice(0, 5));
        renderNewAlbums(document.getElementById('newAlbums'), newAlbums.slice(0, 5));
    } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error);
    }
}
// Render card sản phẩm cho Music Genres
function renderMusicGenres(container, products) {
    container.innerHTML = products.map(product => ` 
<div class="card relative shadow-lg rounded-lg overflow-hidden h-52 w-60 hover:bg-[#ee10b0] hover:border-2 hover:border-[#e696cf] hover:shadow-[0_0_15px_#ee10b0]">
                                <img src="${product.imageLink}" 
                                     alt="${product.nameProduct}" 
                                     class="absolute inset-0 w-full h-full object-cover">
                                <div class="absolute inset-0 bg-black/50"></div>
                                <div class="relative z-10 p-4 flex flex-col justify-end items-center h-full">
                                    <h2 class="text-lg font-semibold text-white">${product.nameProduct}  </h2>
                                </div>
                            </div>


    `).join('');
}

// Render card sản phẩm cho Mood Playlist
function   renderMoodPlaylist(container, products) {
    container.innerHTML = products.map(product => `  
        <div class="card w-48 shadow-lg rounded-lg overflow-hidden hover:bg-[#ee10b0] hover:border-2 hover:border-[#e696cf] hover:shadow-[0_0_15px_#ee10b0]">
            <img class="w-full rounded-xl h-48 object-cover" src="${product.imageLink}" alt="${product.nameProduct}" />
            <div class="px-4 pt-4 pb-1 flex items-center space-x-2 justify-between">
                <h2 class="text-lg font-semibold text-white flex truncate max-w-[150px] items-center">${product.nameProduct}</h2>
               <div class="relative inline-block w-6 h-9 ml-16">
                    <i class="fa-solid fa-list text-2xl text-[#ee10b0]"></i>
                    <i class="fa-solid fa-music text-xs text-[#ee10b0] absolute top-1 right-0 icon-border"></i>
                </div>
            </div>
        </div>
    `).join('');
}

// Render card sản phẩm cho Popular Artists
function  renderPopularArtists(container, products) {
    container.innerHTML = products.map(product => ` 
        <div class="flex flex-col items-center text-center">
                                <div class="hover:bg-[#ee10b0] hover:border-2 hover:border-[#e696cf] hover:shadow-[0_0_15px_#ee10b0] w-36 h-36 rounded-full overflow-hidden shadow-lg">
                                    <img src="${product.imageLink}" 
                                         alt="${product.nameProduct}" 
                                         class="w-full h-full object-cover">
                                </div>
                                <h2 class="text-lg font-semibold text-white mt-4">${product.nameProduct}</h2>
                            </div>
    `).join('');
}

// Render card sản phẩm cho Music Video
function renderMusicVideo(container, products) {
    const columns = [[], [], []]; // 3 cột video, cột 4 dành cho nút "View All"

    // Phân bố video vào 3 cột
    products.forEach((video, index) => {
        columns[index % 3].push(video);
    });

    // Xóa nội dung cũ trước khi thêm mới
    container.innerHTML = '';

    // Render 3 cột
    for (let i = 0; i < 3; i++) {
        const colDiv = document.createElement("div");
        colDiv.className = "flex flex-col space-y-4";

        columns[i].forEach(video => {
            colDiv.innerHTML += `
                <div class="card hover:bg-[#ee10b0] hover:border-2 hover:border-[#e696cf] hover:shadow-[0_0_15px_#ee10b0] shadow-lg rounded-lg overflow-hidden">
                    <img src="${video.imageLink}" alt="${video.nameProduct}" class="w-80 rounded-xl h-48 object-cover">
                    <div class="px-4 pt-4 pb-2 flex items-center justify-between">
                        <h2 class="text-2xl font-semibold text-white">${video.nameProduct}</h2>
                    </div>
                    <div class="px-4 pb-4 flex items-center justify-between">
                        <span class="text-xs text-white">${video.artist}</span>
                        <span class="text-xs text-white">${video.views}</span>
                    </div>
                </div>
            `;
        });

        container.appendChild(colDiv);
    }
}

// Render danh sách New Realse Songs
function  renderNewReleaseSongs(container, products) {
    container.innerHTML = products.map(product => `
         <div class="card shadow-lg rounded-2xl overflow-hidden p-4 w-48 hover:bg-[#ee10b0] hover:border-2 hover:border-[#e696cf] hover:shadow-[0_0_15px_#ee10b0]">
            <img class="w-full rounded-xl h-36 object-cover" src="${product.imageLink}" alt="${product.nameProduct}" />
            <div class="px-4 pt-4 pb-1 flex items-center justify-between">
                <h2 class="mt-3 text-xl font-semibold truncate max-w-[150px] text-white">${product.nameProduct}</h2>
            </div>
            <div class="px-2 pb-1 flex items-center justify-between">
                <span class="px-2 pb-0 text-white text-xs">${product.nameArtist}</span>
                <i class="fa-solid fa-music text-[#ee10b0]"></i>
            </div>
        </div>
    `).join('');
}

// Render card sản phẩm cho New Albums
function   renderNewAlbums(container, products) {
    container.innerHTML = products.map(product => `  <!-- Sử dụng 'products' thay vì 'artistsAlbums' -->
        <div class="card w-48 shadow-lg rounded-lg overflow-hidden hover:bg-[#0e9eef] hover:border-2 hover:border-[#99e1ec] hover:shadow-[0_0_15px_#0e9eef]">
            <img class="w-full rounded-xl h-48 object-cover" src="${product.imageLink}" alt="${product.nameProduct}" />
            <div class="px-4 pt-4 pb-1 flex items-center space-x-2 justify-between">
                <h2 class="text-lg font-semibold text-white flex truncate max-w-[150px] items-center block">${product.nameProduct}</h2>
            </div>
            <div class="px-2 pb-4 flex items-center justify-between">
                <span class="px-2 text-white text-xs">${product.nameArtist}</span>
                <i class="fa-solid fa-compact-disc text-[#0e9eef]"></i>
            </div>
        </div>
    `).join('');
}
// Gọi hàm khi trang được load
window.onload = loadProducts;