# PM₂.₅ Health Benefits — v1.0.0
# PM₂.₅ 健康收益网站 — 第一版

独立静态网站，用于探索 2020–2023 年室外 PM₂.₅ 降至 WHO 年均指南值 5 μg/m³ 时，25 岁及以上成人的潜在死亡减少收益。本目录是新 `pm2.5` 仓库的第一版网站文件，可直接部署，不需要旧版本目录或后端。

An independent static website exploring potential reductions in annual mortality among adults aged 25+ if outdoor PM₂.₅ were reduced to the WHO annual guideline of 5 μg/m³, using estimates for 2020–2023. This directory contains the first website release for the new `pm2.5` repository. It can be deployed directly without earlier version folders or an application backend.

版本号 / Version: **1.0.0**. This is a prepared release; publication and Git tagging are separate steps. / 此版本已整理就绪，线上发布和 Git 标签需另行操作。

**团队 / Team:** Drew Shindell · Yifei Yan · Qianru Zhang — Duke University

## 1. 本地运行 / Run locally

在此目录启动服务器，然后访问 [本地网站 / Local website](http://127.0.0.1:8765/)：

Start a server from this directory, then open the local website:

```bash
python -B -m http.server 8765 --bind 127.0.0.1
```

如果端口已被使用，可改为 8766，并访问对应地址。使用期间保持服务器运行。

If the port is occupied, use 8766 and open the corresponding address. Keep the server running while using the site.

也可直接打开 `index.html`；推荐 HTTP 方式，以获得更一致的导航、状态保存和下载行为。网站运行不需要数据库、Node.js 或 Python 数据分析库；上述 Python 命令只用于提供本地 HTTP 服务。

Opening `index.html` directly is also possible; HTTP is recommended for consistent navigation, state and downloads. The website does not require a database, Node.js or Python analysis libraries. The Python command above only serves local files over HTTP.

## 2. 页面与功能 / Pages and features

| 文件 / File | 中文说明 | English description |
| --- | --- | --- |
| `index.html` | 地图首页、地点/年份/年龄选择、城市窗口、结果下载和最多四地点比较 | Explore: map, selectors, city footprints, downloads and comparison of up to four locations |
| `methods.html` | 指标、来源、计算、年龄范围、地理范围、参数区间和局限 | Indicators, sources, calculation, age/geographic scope, parameter bounds and limitations |
| `data.html` | 国家和城市 CSV 下载及字段说明 | Country/city CSV downloads and data dictionary |
| `about.html` | 项目目的和团队 | Project purpose and team |
| `styles.css` | 原地图界面基础样式 | Base map-interface styling |
| `site.css` / `site.js` | 公共导航和响应式布局 | Shared navigation and responsive layout |
| `app.js` | 地图与交互逻辑 | Map and interaction logic |
| `features.js` | 年龄表、窗口、比较、CSV 导出和 URL 状态 | Age table, footprints, comparison, CSV export and URL state |

四页均使用相对链接，可放在同一个子目录发布。只有 Explore 加载模型数据和地图依赖。URL 保存年份、地点、年龄、详细分组开关、窗口显示和比较地点；从其他页面返回时，在可用的情况下利用会话存储恢复选择。

All four pages use relative links and can be published in one subdirectory. Only Explore loads model data and map dependencies. The URL preserves the year, location, age, age-detail toggle, footprint visibility and comparisons. Links back from other pages restore the selection using session storage where available.

## 3. 数据与解释 / Data and interpretation

### 年龄分组 / Age groups

- 默认国家分组为 **25–49、50–69、70+**，另列 **25+ 总计**。原始五岁分组及 80+ 可展开查看。
- 合并人数为原始分组之和；死亡率和可避免比例使用合并分子、分母重新计算。不要把 25+ 总计再次加到细分组中。舍入可能造成微小加总差异。
- 新合并年龄组不生成新的不确定区间。原始低/高字段表述为 GEMM 参数范围，不代表完整不确定性。

- Default country groups are **25–49, 50–69 and 70+**, with a separate **25+ total**. Original five-year groups and 80+ remain available in the detailed view.
- Counts are summed; rates and avoidable shares are recalculated using combined numerators and denominators. Do not add the 25+ total to its component groups. Source rounding may cause small differences in sums.
- Newly merged groups have no newly inferred uncertainty interval. Original low/high fields are described as GEMM parameter bounds, not full uncertainty.

### 下载与比较 / Downloads and comparison

- 国家 CSV：**3,808 行**，即 4 年 × 238 个区域 × 4 个年龄选项。
- 城市 CSV：**5,720 条城市年度记录**，覆盖 1,430 个窗口，均为 25+；沿用原始模型结果。
- 网站不提供敏感性分析 CSV；原始分析仍保留在原项目目录。
- 比较最多四个地点，全部使用 **25+** 并随年份更新，不跟随地图的细分年龄筛选。

- Country CSV: **3,808 rows** = 4 years × 238 areas × 4 age choices.
- City CSV: **5,720 city-year records** for 1,430 windows, all aged 25+; preserving the source model results.
- The sensitivity-analysis CSV is not offered on the website. The original analysis remains in its original project directory.
- Comparison supports up to four locations, always uses **25+**, and follows the selected year rather than the map's narrower age filter.

### 地理范围与指标 / Geography and indicators

- 可避免比例 = 可避免死亡 ÷ 当前 PM₂.₅ 归因死亡，**不是占全部死亡的比例**。
- 国家浓度按面积加权，城市窗口浓度按人口加权，界面分别标注。
- 城市使用 0.25° 网格上最近格点及周围八格，并非行政边界；窗口可重叠，不能直接加总为区域总量。
- 选中城市后可显示九格范围，并保留死亡人数圆；面板显示窗口面积和 25+ 人口。
- 缺少原始区域总量的地区仍可用于寻找城市，但不会用城市窗口之和代替区域总量。
- 所有年份固定使用 2020 年人口和 2015 年年龄结构，年际差异不是完整人口变化趋势。

- Avoidable share = avoidable deaths / current PM₂.₅-attributable deaths; it is **not the share of all deaths**.
- Country concentrations are area-weighted; city-window concentrations are population-weighted, with explicit labels.
- Cities use the nearest model cell and its eight neighbors on a 0.25° grid, not administrative boundaries. Windows can overlap and must not be summed into regional totals.
- A selected city's nine-cell footprint can be displayed alongside its mortality circle, window area and population aged 25+.
- Regions without an original total remain searchable for cities, but no regional total is synthesized from city windows.
- Population is fixed at 2020 and age structure at 2015; annual differences do not represent complete demographic trends.

`assets/data.js` 中的窗口边界依据原始未舍入城市坐标及模型预处理定义的格点中心生成，保持最近格点选择、经度环绕和纬度裁剪规则。所有窗口均与原始面积和格点数核对，该步骤不重算死亡人数。

Footprints in `assets/data.js` use original unrounded city coordinates and the grid centers defined by the model preprocessing, preserving nearest-cell selection, longitude wrapping and latitude clipping. All footprints are checked against source areas and cell counts; mortality is not recalculated.

## 4. 上传到新的 GitHub 仓库 / Upload to the new GitHub repository

将本目录 **里面的所有文件和子目录** 上传到 `pm2.5` 仓库根目录；不要再套一层 `pm25_v1` 或 `version5`。`index.html` 必须直接位于仓库根目录。可整体上传本目录内容，其中只有 README、CHANGELOG、VERSION 和 .gitignore 不属于网页运行依赖，保留它们便于维护。

Upload **all files and subdirectories inside this directory** to the root of the `pm2.5` repository. Do not nest them under `pm25_v1` or `version5`. Keep `index.html` directly at the repository root. README, CHANGELOG, VERSION and .gitignore are maintenance files rather than runtime dependencies; keeping them is recommended.

```text
pm2.5/
├── .gitignore
├── .nojekyll
├── README.md
├── CHANGELOG.md
├── VERSION
├── index.html
├── methods.html
├── data.html
├── about.html
├── styles.css
├── site.css
├── site.js
├── app.js
├── features.js
├── assets/
│   └── data.js
├── geo/
│   ├── wb_admin0_simplified.js
│   ├── wb_admin0_simplified.geojson
│   └── wb_ndlsa_simplified.js
├── vendor/
│   ├── d3.v7.min.js
│   └── d3-geo-projection.v4.min.js
└── downloads/
    ├── country_estimates_2020_2023.csv
    └── city_centered_estimates_2020_2023.csv
```

这里的 `d3-geo-projection.v4.min.js` 中 v4 是第三方库版本，不是本网站版本，不要改名。.nojekyll 用于直接发布静态资源；.gitignore 排除本机临时文件。GeoJSON 文件保留为现有边界脚本的加载备用。

The `v4` in `d3-geo-projection.v4.min.js` is the third-party library version, not the website version; do not rename it. `.nojekyll` enables plain static publication, and `.gitignore` excludes local temporary files. The GeoJSON file is retained as the boundary-loading fallback.

不需要上传整个研究项目、旧版本、模型输入输出或测试截图。本目录没有包含这些文件。保留第三方库原有版权/许可声明，数据来源与许可见 Methods 页面。

The research project, earlier versions, model inputs/outputs and test screenshots are not needed and are not included here. Preserve third-party copyright/license notices; data sources and licenses are listed on Methods.

## 5. 开启 GitHub Pages / Enable GitHub Pages

在仓库中设置 / In the repository, configure:

```text
Settings → Pages
Source: Deploy from a branch
Branch: main (or your actual branch / 或实际分支)
Folder: /(root)
```

保存后等待部署完成。若用户名为 `yifeiiii0129`、仓库名为 `pm2.5`，预期地址为：

Save and wait for deployment. For username `yifeiiii0129` and repository `pm2.5`, the expected URL is:

```text
https://yifeiiii0129.github.io/pm2.5/
```

该地址为预期地址，不表示已经上线。网站使用相对路径，不需要修改导航或数据路径；GitHub 无需执行 Python 构建。官方配置参考：[GitHub Pages publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)。

This is an expected URL, not confirmation of publication. Relative links require no navigation/data path changes, and GitHub does not need to run a Python build. See the official publishing-source documentation above.

首次上传后，可在 GitHub Releases 中创建标签 `v1.0.0`，发布名称可用 `PM₂.₅ Health Benefits 1.0.0`。`VERSION` 文件只是版本标识，并不自动创建 Git 标签。以后升级继续使用 `app.js` 和 `features.js`，通过 Git 提交及标签记录版本。

After uploading, you can create a GitHub Release with tag `v1.0.0` and title `PM₂.₅ Health Benefits 1.0.0`. The `VERSION` file does not create a Git tag. Future releases keep the filenames `app.js` and `features.js`; commits and tags track revisions.

## 6. 维护与验证 / Maintenance and verification

本目录包含网站源文件和预生成数据，不包含健康模型或依赖旧目录的构建脚本。页面可以直接修改；更新科学数据时，仍需在原研究工作流中重新生成和验证结果，再替换对应资源。静态部署不代表完整研究流程已随仓库发布。

This directory contains website source files and precomputed data, not the health model or build scripts that depend on the earlier research directories. Edit the pages directly. Scientific data updates still require regeneration and validation in the original research workflow before replacing the corresponding assets. A static deployment is not the complete research pipeline.

可用 Node.js 检查脚本语法 / Optional JavaScript syntax checks with Node.js:

```bash
node --check app.js
node --check features.js
node --check site.js
```

发布前后检查四页导航、地图、年龄分组、城市窗口、年份切换、四地点比较、CSV 下载、手机布局及页面返回时的状态保留。当前数据与原网站估计一致，本次整理没有重新计算死亡结果。

Before and after publication, check all four pages, the map, age groups, city footprints, year changes, four-location comparisons, CSV downloads, mobile layout and state restoration when returning to Explore. Existing health estimates are preserved; this release preparation does not recalculate mortality.


## 本轮上线说明 / Deployment notes for this update

目标地址 / Target: https://yifeiiii0129.github.io/PM2.5/

本轮已按此地址配置四页 canonical、Open Graph 和分享图片。大小写必须保持 `PM2.5`。首页筛选参数仍可分享，但 canonical 不包含筛选参数。
The four pages use this base URL for canonical and Open Graph metadata. Preserve the `PM2.5` capitalization. Explore filter URLs remain shareable; canonical URLs omit filters.

### 上传 / Upload

1. 打开 GitHub 的 `yifeiiii0129/PM2.5` 仓库，确认当前 Pages 发布分支和目录。
   Open `yifeiiii0129/PM2.5` and check the Pages publishing branch and folder.
2. 将本目录的内容上传到发布目录，与现有 `index.html` 同级；不要再套一层 `pm25_v1`。保留现有 Git 历史。
   Upload this directory's contents into the publishing folder, alongside `index.html`, without an extra `pm25_v1` wrapper. Preserve Git history.
3. 本轮更新：`index.html`, `methods.html`, `data.html`, `about.html`, `app.js`, `site.css`, `README.md`；新增：`assets/favicon.svg`, `assets/share-preview.png`。其他数据文件没有修改，已有同版本数据时无需重复上传。
   These are the changed/new files. Scientific datasets are unchanged and do not need re-uploading if the deployed copies already match.
4. 部署完成后检查四页、搜索错误提示、分享图片 URL，以及原有筛选链接。网站本轮尚未由本地工具发布。
   After deployment, verify all four pages, search feedback, the share-image URL and existing filter URLs. This local update has not been published by the tools.

### 性能核查 / Performance check

旧版目标站点两个大文件已返回 `Content-Encoding: gzip` 和 `Cache-Control: max-age=600`：结果数据 2,477,184 bytes，地图边界 5,274,092 bytes，合计约 7.75 MB。这是现有线上资源的响应头，不是新版发布后的测速。本轮没有声称缩短首屏时间；按年份加载仍是下一项独立优化。
The existing live resources already return gzip encoding and a 600-second cache lifetime: 2,477,184 bytes for results and 5,274,092 bytes for boundaries, approximately 7.75 MB combined. These are response headers for the existing deployment, not a speed measurement of this update. No first-load speed improvement is claimed in this patch; loading data by year remains a separate next step.

上线后重新检查 `Content-Encoding`、`Cache-Control`、浏览器 Network 中的传输体积和首次可交互时间。不要仅上传 `.gz` 文件就认为已启用压缩。
After deployment, recheck encoding/cache headers, transferred bytes and time until the map can be used. Uploading a `.gz` file alone does not configure HTTP compression.

参考 / Reference: https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Compression
分享字段 / Sharing metadata: https://ogp.me/
