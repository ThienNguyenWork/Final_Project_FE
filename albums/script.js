// Load dữ liệu từ products.json
async function loadProducts() {
    try {
        const response = await fetch('products.json');
        const { Popular } = await response.json();

        // ✅ Giới hạn 5 sản phẩm cho mỗi danh sách
        renderPopular(document.getElementById('popular'), Popular.slice(0, 20));
      
    } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error);
    }
}
// Render danh sách Popular Songs
function renderPopular(container, Popular) {
    container.innerHTML = Popular.map(song => `
        <div class="bg-gray-900 p-4 ml-5 rounded-xl shadow-lg hover:bg-[#1a1d29] transition">
            <!-- Desktop Layout -->
            <div class="hidden lg:grid grid-cols-12 items-center gap-4">
                <!-- Ranking -->
                <div class="flex justify-content col-span-1">
                    <span class="text-white font-bold text-xl">#${song.rank}</span>
                </div>

                <!-- Ảnh và thông tin bài hát -->
                <div class="col-span-3 flex items-center gap-4">
                    <img class="w-14 h-14 rounded-lg object-cover" src="${song.imageLink}" alt="${song.nameProduct}" />
                    <div>
                        <h2 class="text-base text-white font-semibold leading-snug">${song.nameProduct}</h2>
                        <p class="text-xs text-gray-400">${song.nameArtist}</p>
                    </div>
                </div>

                <!-- Ngày phát hành -->
                <div class="col-span-2 text-center">
                    <span class="text-sm text-gray-400">${song.releaseDate}</span>
                </div>

                <!-- Played -->
                <div class="col-span-4 truncate text-center">
                    <span class="text-sm text-gray-400">${song.album || 'N/A'}</span>
                </div>

                <!-- Icon trái tim -->
                <div class="col-span-1 text-center">
                    <i class="fa-regular fa-heart text-[#ee10b0] cursor-pointer hover:scale-110 transition-transform"></i>
                </div>

                <!-- Thời gian -->
                <div class="col-span-1 text-center">
                    <span class="text-sm text-gray-400">${song.time}</span>
                </div>
            </div>

            <!-- Mobile/Tablet Layout -->
            <div class="lg:hidden flex flex-col gap-3">
                <!-- Ảnh + Tên bài hát -->
                <div class="flex gap-4 items-center">
                    <img class="w-16 h-16 rounded-lg object-cover" src="${song.imageLink}" alt="${song.nameProduct}" />
                    <div>
                        <h2 class="text-lg text-white font-semibold">${song.nameProduct}</h2>
                        <p class="text-sm text-gray-400">${song.nameArtist}</p>
                    </div>
                </div>

                <!-- Thông tin chi tiết -->
                <div class="flex justify-between text-gray-400 text-sm">
                    <span>#${song.rank}</span>
                    <span>${song.releaseDate}</span>
                    <span>${song.album || 'N/A'}</span>
                    <span>${song.time}</span>
                </div>

                <!-- Icon trái tim -->
                <div class="text-right">
                    <i class="fa-regular fa-heart text-[#ee10b0] cursor-pointer hover:scale-110 transition-transform"></i>
                </div>
            </div>
        </div>
    `).join('');
}

// Gọi hàm khi trang được load
window.onload = loadProducts;
