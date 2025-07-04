// 商品データを格納する変数
let allProducts = [];
let filteredProducts = [];

// DOM要素の取得
const productsContainer = document.getElementById('products-container');
const productsCount = document.getElementById('products-count');
const noProductsMessage = document.getElementById('no-products');
const categoryFilter = document.getElementById('category-filter');
const sortFilter = document.getElementById('sort-filter');
const searchInput = document.getElementById('search-input');

// 商品データを読み込む
function loadProducts() {
    try {
        allProducts = productsData.products;
        filteredProducts = [...allProducts];
        displayProducts();
        updateProductsCount();
    } catch (error) {
        console.error('商品データの読み込みに失敗しました:', error);
        productsContainer.innerHTML = '<p class="text-center">商品データの読み込みに失敗しました。</p>';
    }
}

// 商品を表示する
function displayProducts() {
    if (filteredProducts.length === 0) {
        productsContainer.innerHTML = '';
        noProductsMessage.classList.remove('hidden');
        return;
    }

    noProductsMessage.classList.add('hidden');
    
    productsContainer.innerHTML = filteredProducts.map(product => `
        <div class="product-card fade-in">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px;">
            </div>
            <div class="product-name">${product.name}</div>
            <div class="product-price">¥${product.price.toLocaleString()}</div>
            <div class="product-description">${product.description}</div>
            <div class="product-stock">在庫: ${product.stock}個</div>
            <div style="display: flex; gap: 0.5rem; margin-top: 1rem;">
                <a href="detail.html?id=${product.id}" class="btn btn-primary" style="flex: 1;">詳細を見る</a>
                <button onclick="addToCart(${product.id})" class="btn btn-secondary" style="flex: 1;">カートに追加</button>
            </div>
        </div>
    `).join('');
}

// 商品数を更新
function updateProductsCount() {
    const count = filteredProducts.length;
    const total = allProducts.length;
    productsCount.textContent = `${count}件の商品を表示中（全${total}件）`;
}

// フィルタリング機能
function filterProducts() {
    const category = categoryFilter.value;
    const searchTerm = searchInput.value.toLowerCase();
    
    filteredProducts = allProducts.filter(product => {
        const matchesCategory = !category || product.category === category;
        const matchesSearch = !searchTerm ||
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm);
        
        return matchesCategory && matchesSearch;
    });
    
    sortProducts();
    displayProducts();
    updateProductsCount();
}

// ソート機能
function sortProducts() {
    const sortBy = sortFilter.value;
    
    filteredProducts.sort((a, b) => {
        switch (sortBy) {
            case 'name':
                return a.name.localeCompare(b.name, 'ja');
            case 'price-low':
                return a.price - b.price;
            case 'price-high':
                return b.price - a.price;
            case 'stock':
                return b.stock - a.stock;
            default:
                return 0;
        }
    });
}

// カートに商品を追加
function addToCart(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) {
        alert('商品が見つかりません。');
        return;
    }
    
    if (product.stock <= 0) {
        alert('申し訳ございません。この商品は在庫切れです。');
        return;
    }
    
    // ローカルストレージからカート情報を取得
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // 既にカートにある商品かチェック
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        if (existingItem.quantity >= product.stock) {
            alert('在庫数を超えて追加することはできません。');
            return;
        }
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: product.name,
            price: product.price,
            quantity: 1,
            stock: product.stock
        });
    }
    
    // カート情報をローカルストレージに保存
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // 成功メッセージを表示
    showAddToCartMessage(product.name);
}

// カート追加成功メッセージを表示
function showAddToCartMessage(productName) {
    // 既存のメッセージがあれば削除
    const existingMessage = document.querySelector('.cart-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // メッセージ要素を作成
    const message = document.createElement('div');
    message.className = 'cart-message';
    message.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #00b894 0%, #00a085 100%);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    `;
    message.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span>✅</span>
            <span>${productName}をカートに追加しました</span>
        </div>
    `;
    
    // CSSアニメーションを追加
    if (!document.querySelector('#cart-message-style')) {
        const style = document.createElement('style');
        style.id = 'cart-message-style';
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(message);
    
    // 3秒後にメッセージを削除
    setTimeout(() => {
        if (message.parentNode) {
            message.remove();
        }
    }, 3000);
}

// イベントリスナーの設定
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    
    // カテゴリーフィルターのイベントリスナー（堅牢なアプローチ）
    if (categoryFilter) {
        // メインのchangeイベント
        categoryFilter.addEventListener('change', handleCategoryChange);
        
        // フォールバック用のイベント（ブラウザ互換性対応）
        categoryFilter.addEventListener('click', handleCategoryClick);
        categoryFilter.addEventListener('input', handleCategoryChange);
        
        // 定期的なポーリング（確実な動作保証）
        let lastCategoryValue = categoryFilter.value;
        setInterval(() => {
            if (categoryFilter.value !== lastCategoryValue) {
                lastCategoryValue = categoryFilter.value;
                filterProducts();
            }
        }, 500);
    }
    
    // ソートフィルターのイベントリスナー
    if (sortFilter) {
        sortFilter.addEventListener('change', filterProducts);
    }
    
    // 検索入力のイベントリスナー
    if (searchInput) {
        searchInput.addEventListener('input', filterProducts);
    }
});

// カテゴリー変更ハンドラー
function handleCategoryChange(event) {
    filterProducts();
}

// カテゴリークリックハンドラー（フォールバック）
function handleCategoryClick(event) {
    // 遅延実行で値の変更を確実にキャッチ
    setTimeout(() => {
        filterProducts();
    }, 150);
}