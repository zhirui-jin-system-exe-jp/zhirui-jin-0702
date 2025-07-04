# 🚀 GitHub Pages デプロイメントガイド

## 📋 チェックリスト

### 1. GitHub リポジトリ設定
- [ ] リポジトリが public または GitHub Pro アカウント
- [ ] Settings > Pages で Source を "GitHub Actions" に設定
- [ ] Actions タブでワークフローが有効化されている

### 2. ワークフローファイル確認
- [ ] `.github/workflows/static.yml` が存在
- [ ] ファイル内容が正しい YAML 形式
- [ ] ブランチ名が正しい（main または master）

### 3. 権限設定
- [ ] Settings > Actions > General で "Read and write permissions" が有効
- [ ] Workflow permissions で "Allow GitHub Actions to create and approve pull requests" が有効

## 🔧 トラブルシューティング

### GitHub Actions が実行されない場合

**1. 手動実行を試す**
```
1. GitHub リポジトリの Actions タブに移動
2. "Deploy static content to Pages" ワークフローを選択
3. "Run workflow" ボタンをクリック
4. "Run workflow" を実行
```

**2. ブランチ名を確認**
```bash
git branch  # 現在のブランチを確認
git checkout main  # main ブランチに切り替え（必要に応じて）
```

**3. ワークフローファイルの構文チェック**
- YAML の構文エラーがないか確認
- インデントが正しいか確認

### よくあるエラーと解決方法

**エラー: "Pages deployment failed"**
```
解決方法:
1. Settings > Pages で Source を確認
2. "GitHub Actions" が選択されているか確認
3. カスタムドメインが設定されている場合は一時的に無効化
```

**エラー: "Workflow not found"**
```
解決方法:
1. .github/workflows/ ディレクトリが存在するか確認
2. ワークフローファイルが正しい場所にあるか確認
3. ファイル名が .yml または .yaml で終わっているか確認
```

**エラー: "Permission denied"**
```
解決方法:
1. Settings > Actions > General に移動
2. "Workflow permissions" を "Read and write permissions" に設定
3. "Allow GitHub Actions to create and approve pull requests" を有効化
```

## 📝 手動デプロイ手順

GitHub Actions が動作しない場合の代替手順：

### 方法1: GitHub Web UI を使用
```
1. GitHub リポジトリの Settings > Pages に移動
2. Source を "Deploy from a branch" に変更
3. Branch を "main" に設定
4. Folder を "/ (root)" に設定
5. Save をクリック
```

### 方法2: gh-pages ブランチを使用
```bash
# gh-pages ブランチを作成してプッシュ
git checkout --orphan gh-pages
git add .
git commit -m "Deploy to GitHub Pages"
git push origin gh-pages

# Settings > Pages で gh-pages ブランチを選択
```

## 🌐 デプロイ確認

デプロイが成功すると：
- Actions タブで緑のチェックマークが表示
- Settings > Pages に URL が表示
- 通常 5-10 分でサイトがアクセス可能

## 📞 サポート

問題が解決しない場合：
1. GitHub Actions のログを確認
2. GitHub Community Forum で検索
3. GitHub Support に問い合わせ

---

**🛁 温泉癒し館を世界中にお届けしましょう！**