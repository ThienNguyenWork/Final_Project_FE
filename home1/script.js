// Load dữ liệu từ products.json
async function loadProducts() {
    try {
        const response = await fetch('products.json');
        const { weeklyTopSongs, newReleaseSongs, trendingSongs,eminemFansAlsoListenTo } = await response.json();

        // ✅ Giới hạn 5 sản phẩm cho mỗi danh sách
        renderProducts(document.getElementById('product-list'), weeklyTopSongs.slice(0, 5));
        renderProducts(document.getElementById('new-release-list'), newReleaseSongs.slice(0, 5));
        renderTrending(document.getElementById('trending-list'), trendingSongs.slice(0, 5));
        renderEminemFansAlsoListenTo(document.getElementById('eminemFansAlsoListenTo'), eminemFansAlsoListenTo.slice(0, 4));
    } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error);
    }
}

// Render card sản phẩm cho Weekly Top & New Release
function renderProducts(container, products) {
    container.innerHTML = products.map(product => `
        <div class="card shadow-lg rounded-2xl overflow-hidden p-4 w-48">
            <img class="w-full rounded-xl h-36 object-cover" src="${product.imageLink}" alt="${product.nameProduct}" />
            <div class="px-4 pt-4 pb-1 flex items-center justify-between">
                <h2 class="mt-3 text-xl font-semibold text-white">${product.nameProduct}</h2>
            </div>
            <div class="px-2 pb-1 flex items-center justify-between">
                <span class="px-2 pb-0 text-white text-xs">${product.nameArtist}</span>
                <i class="fa-solid fa-music text-[#ee10b0]"></i>
            </div>
        </div>
    `).join('');
}

// Render danh sách Trending Songs
function renderTrending(container, trendingSongs) {
    container.innerHTML = trendingSongs.map(song => `
        <div class="bg-gray-900 p-4 rounded-xl shadow-lg hover:bg-[#1a1d29] transition">
            <!-- Desktop Layout -->
            <div class="hidden lg:grid grid-cols-12 items-center gap-4">
                <!-- Ranking -->
                <div class="col-span-1">
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

                <!-- Album -->
                <div class="col-span-4 truncate text-center">
                    <span class="text-sm text-gray-400">${song.album}</span>
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
                    <span>${song.album}</span>
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
// Render card sản phẩm cho Eminem Fans Also Listen To
function renderEminemFansAlsoListenTo(container, products) {
    container.innerHTML = products.map(product => ` 
        <div class="flex flex-col items-center text-center">
                                <div class="w-52 h-52 rounded-full overflow-hidden shadow-lg">
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
