// Load dữ liệu từ products.json
async function loadProducts() {
    try {
        const response = await fetch('products.json'); // Đảm bảo đường dẫn đúng
        const { musicGenres, moodPlaylist, popularArtists } = await response.json();

        // ✅ Giới hạn 5 sản phẩm cho mỗi danh sách
        renderMusicGenres(document.getElementById('musicGenres'), musicGenres.slice(0, 4));
        renderMoodPlaylist(document.getElementById('moodPlaylist'), moodPlaylist.slice(0, 5));
        renderPopularArtists(document.getElementById('popularArtists'), popularArtists.slice(0, 6));
        
    } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error);
    }
}
// Render card sản phẩm cho Music Genres
function renderMusicGenres(container, products) {
    container.innerHTML = products.map(product => ` 
<div class="card relative shadow-lg rounded-lg overflow-hidden h-52 w-60">
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
        <div class="card w-48 shadow-lg rounded-lg overflow-hidden">
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
                                <div class="w-36 h-36 rounded-full overflow-hidden shadow-lg">
                                    <img src="${product.imageLink}" 
                                         alt="${product.nameProduct}" 
                                         class="w-full h-full object-cover">
                                </div>
                                <h2 class="text-lg font-semibold text-white mt-4">${product.nameProduct}</h2>
                            </div>
    `).join('');
}

// Gọi hàm khi trang được load
window.onload = loadProducts;