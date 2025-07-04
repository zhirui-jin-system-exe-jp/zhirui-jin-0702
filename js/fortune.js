// 占いデータ
const fortuneData = {
    overallFortunes: [
        { score: "大吉", description: "今日は最高の一日になりそうです！新しいことにチャレンジするのに最適な日。積極的に行動することで、素晴らしい結果が期待できます。" },
        { score: "中吉", description: "穏やかで安定した一日になりそうです。無理をせず、自分のペースで過ごすことが幸運の鍵。周りの人との調和を大切にしましょう。" },
        { score: "小吉", description: "小さな幸せが見つかる一日です。些細なことにも感謝の気持ちを持つことで、運気がアップします。リラックスして過ごしましょう。" },
        { score: "吉", description: "バランスの取れた良い一日になりそうです。計画的に物事を進めることで、着実に成果を上げることができるでしょう。" },
        { score: "末吉", description: "後半に向けて運気が上昇する兆しがあります。午後からの活動に力を入れると良い結果が期待できそうです。" }
    ],
    
    luckyItems: [
        { name: "ゆず入浴剤", description: "爽やかな香りがあなたの心を癒し、運気を上昇させます" },
        { name: "ラベンダー入浴剤", description: "リラックス効果で心身を整え、良い運気を呼び込みます" },
        { name: "温泉の素", description: "本格的な温泉気分で邪気を払い、運気をリセットします" },
        { name: "温泉手ぬぐい", description: "伝統的な和の力があなたを守護し、幸運をもたらします" },
        { name: "檜の湯桶", description: "天然木の力で浄化作用があり、運気を清めます" },
        { name: "温泉タオル", description: "清潔で純粋なエネルギーがあなたの運気を高めます" },
        { name: "薬草入浴剤", description: "自然の力があなたの体調と運気を整えます" },
        { name: "温泉石鹸", description: "清浄な力で悪い運気を洗い流し、新しい運気を呼び込みます" }
    ],
    
    luckyColors: [
        { name: "桜色", description: "優しさと愛情を象徴し、人間関係運をアップさせます" },
        { name: "若草色", description: "成長と希望を表し、新しいチャンスを引き寄せます" },
        { name: "空色", description: "自由と開放感をもたらし、創造性を高めます" },
        { name: "温泉色", description: "癒しと安らぎの力で、心身のバランスを整えます" },
        { name: "金色", description: "豊かさと成功を象徴し、金運をアップさせます" },
        { name: "紫色", description: "神秘的な力で直感力を高め、良い判断ができるようになります" },
        { name: "白色", description: "純粋さと清らかさで、新しいスタートを応援します" },
        { name: "橙色", description: "活力と情熱を与え、積極性を高めます" }
    ]
};

// DOM要素の取得
const fortuneButton = document.getElementById('fortune-button');
const loadingElement = document.getElementById('loading');
const fortuneResult = document.getElementById('fortune-result');
const overallScore = document.getElementById('overall-score');
const overallDescription = document.getElementById('overall-description');
const luckyItem = document.getElementById('lucky-item');
const luckyItemDescription = document.getElementById('lucky-item-description');
const luckyColor = document.getElementById('lucky-color');
const luckyColorDescription = document.getElementById('lucky-color-description');
const luckyNumber = document.getElementById('lucky-number');
const luckyNumberDescription = document.getElementById('lucky-number-description');
const recommendedProductsGrid = document.getElementById('recommended-products-grid');
const fortuneHistoryList = document.getElementById('fortune-history-list');

// 商品データ
let allProducts = [];

// ページ読み込み時の処理
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    loadFortuneHistory();
    checkTodaysFortune();
});

// 商品データを読み込む
function loadProducts() {
    try {
        allProducts = productsData.products;
    } catch (error) {
        console.error('商品データの読み込みに失敗しました:', error);
    }
}

// 今日の占い結果をチェック
function checkTodaysFortune() {
    const today = new Date().toDateString();
    const savedFortune = localStorage.getItem(`fortune_${today}`);
    
    if (savedFortune) {
        const fortuneData = JSON.parse(savedFortune);
        displayFortuneResult(fortuneData);
        fortuneButton.textContent = '今日の運勢を再表示';
    }
}

// 占いを実行
function getFortune() {
    const today = new Date().toDateString();
    const savedFortune = localStorage.getItem(`fortune_${today}`);
    
    if (savedFortune) {
        // 今日の占い結果が既にある場合は再表示
        const fortuneData = JSON.parse(savedFortune);
        displayFortuneResult(fortuneData);
        return;
    }
    
    // 新しい占い結果を生成
    showLoading();
    
    setTimeout(() => {
        const newFortune = generateFortune();
        saveTodaysFortune(newFortune);
        displayFortuneResult(newFortune);
        saveFortuneHistory(newFortune);
        hideLoading();
        fortuneButton.textContent = '今日の運勢を再表示';
    }, 2000);
}

// ローディング表示
function showLoading() {
    fortuneButton.disabled = true;
    loadingElement.classList.remove('hidden');
    fortuneResult.classList.add('hidden');
}

// ローディング非表示
function hideLoading() {
    fortuneButton.disabled = false;
    loadingElement.classList.add('hidden');
}

// 占い結果を生成
function generateFortune() {
    const overall = getRandomItem(fortuneData.overallFortunes);
    const item = getRandomItem(fortuneData.luckyItems);
    const color = getRandomItem(fortuneData.luckyColors);
    const number = Math.floor(Math.random() * 100) + 1;
    
    return {
        date: new Date().toDateString(),
        overall: overall,
        luckyItem: item,
        luckyColor: color,
        luckyNumber: {
            value: number,
            description: generateLuckyNumberDescription(number)
        },
        recommendedProducts: getRecommendedProducts(item.name)
    };
}

// ランダムアイテムを取得
function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// ラッキーナンバーの説明を生成
function generateLuckyNumberDescription(number) {
    const descriptions = [
        "この数字があなたに幸運をもたらします",
        "重要な決断をする時に参考にしてください",
        "今日のキーナンバーです",
        "この数字を意識して過ごしましょう",
        "特別な意味を持つ数字です"
    ];
    return getRandomItem(descriptions);
}

// おすすめ商品を取得
function getRecommendedProducts(luckyItemName) {
    if (allProducts.length === 0) return [];
    
    // ラッキーアイテムに関連する商品を優先的に選択
    let recommended = allProducts.filter(product => 
        product.name.includes(luckyItemName.replace('入浴剤', '').replace('温泉', ''))
    );
    
    // 関連商品が少ない場合はランダムに追加
    while (recommended.length < 3 && recommended.length < allProducts.length) {
        const randomProduct = getRandomItem(allProducts);
        if (!recommended.find(p => p.id === randomProduct.id)) {
            recommended.push(randomProduct);
        }
    }
    
    return recommended.slice(0, 3);
}

// 占い結果を表示
function displayFortuneResult(fortune) {
    // 総合運
    overallScore.textContent = fortune.overall.score;
    overallDescription.textContent = fortune.overall.description;
    
    // ラッキーアイテム
    luckyItem.textContent = fortune.luckyItem.name;
    luckyItemDescription.textContent = fortune.luckyItem.description;
    
    // ラッキーカラー
    luckyColor.textContent = fortune.luckyColor.name;
    luckyColorDescription.textContent = fortune.luckyColor.description;
    
    // ラッキーナンバー
    luckyNumber.textContent = fortune.luckyNumber.value;
    luckyNumberDescription.textContent = fortune.luckyNumber.description;
    
    // おすすめ商品
    displayRecommendedProducts(fortune.recommendedProducts);
    
    // 結果を表示
    fortuneResult.classList.remove('hidden');
    fortuneResult.scrollIntoView({ behavior: 'smooth' });
}

// おすすめ商品を表示
function displayRecommendedProducts(products) {
    if (products.length === 0) {
        recommendedProductsGrid.innerHTML = '<p class="text-center">おすすめ商品を読み込み中...</p>';
        return;
    }
    
    recommendedProductsGrid.innerHTML = products.map(product => `
        <div class="product-card fade-in">
            <div class="product-image">${product.name}の画像</div>
            <div class="product-name">${product.name}</div>
            <div class="product-price">¥${product.price.toLocaleString()}</div>
            <div class="product-description">${product.description}</div>
            <div class="product-stock">在庫: ${product.stock}個</div>
            <div style="display: flex; gap: 0.5rem; margin-top: 1rem;">
                <a href="detail.html?id=${product.id}" class="btn btn-primary" style="flex: 1;">詳細を見る</a>
                <button onclick="addToCartFromFortune(${product.id})" class="btn btn-secondary" style="flex: 1;">カートに追加</button>
            </div>
        </div>
    `).join('');
}

// 占いページからカートに追加
function addToCartFromFortune(productId) {
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
    alert(`${product.name}をカートに追加しました！運気アップ間違いなしです✨`);
}

// 今日の占い結果を保存
function saveTodaysFortune(fortune) {
    const today = new Date().toDateString();
    localStorage.setItem(`fortune_${today}`, JSON.stringify(fortune));
}

// 占い履歴を保存
function saveFortuneHistory(fortune) {
    let history = JSON.parse(localStorage.getItem('fortuneHistory') || '[]');
    
    // 同じ日の記録があれば更新、なければ追加
    const existingIndex = history.findIndex(h => h.date === fortune.date);
    if (existingIndex >= 0) {
        history[existingIndex] = fortune;
    } else {
        history.unshift(fortune); // 新しい記録を先頭に追加
    }
    
    // 最新10件のみ保持
    history = history.slice(0, 10);
    
    localStorage.setItem('fortuneHistory', JSON.stringify(history));
    loadFortuneHistory();
}

// 占い履歴を読み込み・表示
function loadFortuneHistory() {
    const history = JSON.parse(localStorage.getItem('fortuneHistory') || '[]');
    
    if (history.length === 0) {
        fortuneHistoryList.innerHTML = '<p class="text-center" style="color: #666;">まだ占い履歴がありません。</p>';
        return;
    }
    
    fortuneHistoryList.innerHTML = history.map((fortune, index) => `
        <div style="background: #f8f9fa; padding: 1rem; border-radius: 10px; margin-bottom: 1rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <strong>${new Date(fortune.date).toLocaleDateString('ja-JP')}</strong>
                <span style="background: linear-gradient(135deg, #fd79a8 0%, #fdcb6e 100%); color: white; padding: 0.2rem 0.8rem; border-radius: 15px; font-size: 0.9rem;">
                    ${fortune.overall.score}
                </span>
            </div>
            <div style="font-size: 0.9rem; color: #666;">
                ラッキーアイテム: ${fortune.luckyItem.name} | 
                ラッキーカラー: ${fortune.luckyColor.name} | 
                ラッキーナンバー: ${fortune.luckyNumber.value}
            </div>
        </div>
    `).join('');
}