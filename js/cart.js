// カートデータを格納する変数
let cart = [];

// DOM要素の取得
const cartItemsContainer = document.getElementById('cart-items-container');
const emptyCartMessage = document.getElementById('empty-cart');
const cartSummary = document.getElementById('cart-summary');
const summaryContent = document.getElementById('summary-content');
const checkoutForm = document.getElementById('checkout-form');
const orderForm = document.getElementById('order-form');
const orderSuccess = document.getElementById('order-success');

// ページ読み込み時にカートを読み込む
document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    displayCart();
    setupOrderForm();
});

// ローカルストレージからカートデータを読み込む
function loadCart() {
    cart = JSON.parse(localStorage.getItem('cart') || '[]');
}

// カートデータをローカルストレージに保存
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// カートを表示
function displayCart() {
    if (cart.length === 0) {
        showEmptyCart();
        return;
    }
    
    hideEmptyCart();
    displayCartItems();
    displayCartSummary();
}

// 空のカート表示
function showEmptyCart() {
    cartItemsContainer.innerHTML = '';
    emptyCartMessage.classList.remove('hidden');
    cartSummary.style.display = 'none';
    checkoutForm.style.display = 'none';
}

// 空のカート非表示
function hideEmptyCart() {
    emptyCartMessage.classList.add('hidden');
    cartSummary.style.display = 'block';
}

// カート商品を表示
function displayCartItems() {
    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-image">
                ${item.name}の画像
            </div>
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">¥${item.price.toLocaleString()}</div>
                <div style="font-size: 0.9rem; color: #666;">在庫: ${item.stock}個</div>
            </div>
            <div class="quantity-controls">
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                <div class="quantity-display">${item.quantity}</div>
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
            </div>
            <div>
                <div style="font-weight: bold; margin-bottom: 0.5rem;">¥${(item.price * item.quantity).toLocaleString()}</div>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">削除</button>
            </div>
        </div>
    `).join('');
}

// カート概要を表示
function displayCartSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal >= 5000 ? 0 : 500; // 5000円以上で送料無料
    const tax = Math.floor(subtotal * 0.1); // 消費税10%
    const total = subtotal + shipping + tax;
    
    summaryContent.innerHTML = `
        <div class="summary-row">
            <span>小計:</span>
            <span>¥${subtotal.toLocaleString()}</span>
        </div>
        <div class="summary-row">
            <span>送料:</span>
            <span>${shipping === 0 ? '無料' : '¥' + shipping.toLocaleString()}</span>
        </div>
        <div class="summary-row">
            <span>消費税:</span>
            <span>¥${tax.toLocaleString()}</span>
        </div>
        <div class="summary-row summary-total">
            <span>合計:</span>
            <span>¥${total.toLocaleString()}</span>
        </div>
        ${subtotal < 5000 ? `
            <div style="font-size: 0.9rem; color: #666; margin-top: 1rem; padding: 1rem; background: #f8f9fa; border-radius: 5px;">
                あと¥${(5000 - subtotal).toLocaleString()}で送料無料！
            </div>
        ` : ''}
        <button onclick="showCheckoutForm()" class="btn btn-primary" style="width: 100%; margin-top: 1.5rem;">
            レジに進む
        </button>
        <button onclick="clearCart()" class="btn btn-secondary" style="width: 100%; margin-top: 0.5rem;">
            カートを空にする
        </button>
    `;
}

// 商品数量を更新
function updateQuantity(productId, newQuantity) {
    if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
    }
    
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    if (newQuantity > item.stock) {
        alert('在庫数を超えて追加することはできません。');
        return;
    }
    
    item.quantity = newQuantity;
    saveCart();
    displayCart();
}

// カートから商品を削除
function removeFromCart(productId) {
    if (confirm('この商品をカートから削除しますか？')) {
        cart = cart.filter(item => item.id !== productId);
        saveCart();
        displayCart();
        
        // 削除メッセージを表示
        showMessage('商品をカートから削除しました。', 'info');
    }
}

// カートを空にする
function clearCart() {
    if (confirm('カート内のすべての商品を削除しますか？')) {
        cart = [];
        saveCart();
        displayCart();
        showMessage('カートを空にしました。', 'info');
    }
}

// チェックアウトフォームを表示
function showCheckoutForm() {
    checkoutForm.style.display = 'block';
    checkoutForm.scrollIntoView({ behavior: 'smooth' });
    
    // 今日の日付を設定（お届け希望日の最小値）
    const today = new Date();
    today.setDate(today.getDate() + 2); // 最短2日後
    const minDate = today.toISOString().split('T')[0];
    document.getElementById('deliveryDate').min = minDate;
}

// チェックアウトフォームを非表示
function hideCheckoutForm() {
    checkoutForm.style.display = 'none';
}

// 注文フォームのセットアップ
function setupOrderForm() {
    orderForm.addEventListener('submit', handleOrderSubmit);
}

// 注文送信処理
function handleOrderSubmit(event) {
    event.preventDefault();
    
    if (cart.length === 0) {
        alert('カートが空です。');
        return;
    }
    
    // フォームデータを取得
    const formData = new FormData(orderForm);
    const orderData = {
        customer: {
            lastName: formData.get('lastName'),
            firstName: formData.get('firstName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            zipCode: formData.get('zipCode'),
            prefecture: formData.get('prefecture'),
            address: formData.get('address'),
            building: formData.get('building'),
            deliveryDate: formData.get('deliveryDate'),
            notes: formData.get('notes')
        },
        items: cart,
        orderDate: new Date().toISOString(),
        orderId: generateOrderId()
    };
    
    // 注文処理をシミュレート
    processOrder(orderData);
}

// 注文IDを生成
function generateOrderId() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `ORDER-${timestamp}-${random}`;
}

// 注文処理
function processOrder(orderData) {
    // ローディング表示
    const submitButton = orderForm.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = '処理中...';
    submitButton.disabled = true;
    
    // 注文処理をシミュレート（2秒後に完了）
    setTimeout(() => {
        // 注文データをローカルストレージに保存（実際のシステムでは不要）
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        orders.push(orderData);
        localStorage.setItem('orders', JSON.stringify(orders));
        
        // カートを空にする
        cart = [];
        saveCart();
        
        // 成功画面を表示
        showOrderSuccess(orderData);
        
        // フォームをリセット
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        orderForm.reset();
        
    }, 2000);
}

// 注文成功画面を表示
function showOrderSuccess(orderData) {
    // すべてのセクションを非表示
    document.querySelector('.cart-section').style.display = 'none';
    checkoutForm.style.display = 'none';
    
    // 成功メッセージを表示
    orderSuccess.classList.remove('hidden');
    orderSuccess.scrollIntoView({ behavior: 'smooth' });
    
    // 注文詳細を更新
    orderSuccess.innerHTML = `
        <h2 style="color: #00b894; margin-bottom: 1rem;">🎉 ご注文ありがとうございました！</h2>
        <div style="background: #f8f9fa; padding: 1.5rem; border-radius: 10px; margin: 2rem 0;">
            <p><strong>注文番号:</strong> ${orderData.orderId}</p>
            <p><strong>お名前:</strong> ${orderData.customer.lastName} ${orderData.customer.firstName} 様</p>
            <p><strong>メールアドレス:</strong> ${orderData.customer.email}</p>
            ${orderData.customer.deliveryDate ? `<p><strong>お届け希望日:</strong> ${orderData.customer.deliveryDate}</p>` : ''}
        </div>
        <p style="margin-bottom: 2rem;">
            ご注文を承りました。確認メールをお送りいたします。<br>
            商品の発送準備が整い次第、発送完了メールをお送りいたします。
        </p>
        <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
            <a href="index.html" class="btn btn-primary">ホームに戻る</a>
            <a href="catalog.html" class="btn btn-secondary">他の商品を見る</a>
        </div>
    `;
}

// メッセージを表示
function showMessage(message, type = 'success') {
    // 既存のメッセージがあれば削除
    const existingMessage = document.querySelector('.message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // メッセージ要素を作成
    const messageElement = document.createElement('div');
    messageElement.className = 'message';
    messageElement.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? 'linear-gradient(135deg, #00b894 0%, #00a085 100%)' : 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    `;
    messageElement.textContent = message;
    
    document.body.appendChild(messageElement);
    
    // 3秒後にメッセージを削除
    setTimeout(() => {
        if (messageElement.parentNode) {
            messageElement.remove();
        }
    }, 3000);
}