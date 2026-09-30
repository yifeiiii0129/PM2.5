# PM₂.₅ Health Benefits — v1.1.0

中文与 English · Release and deployment guide

探索 2020–2023 年室外 PM₂.₅ 降至 WHO 年均指南值 **5 μg/m³** 时，成人 **25+** 的潜在年度死亡减少收益。支持国家及城市中心窗口查询、年龄组查看、最多四地点比较与 CSV 下载。

Explore potential annual deaths avoided among adults aged **25+** if outdoor PM₂.₅ were reduced to the WHO annual guideline of **5 μg/m³**, using estimates for 2020–2023. Browse countries and city-centered windows, inspect age groups, compare up to four locations and download CSV data.

**Team / 团队:** Drew Shindell · Yifei Yan · Qianru Zhang — Duke University

- Website / 网站：[PM₂.₅ Health Benefits](https://yifeiiii0129.github.io/PM2.5/)
- Repository / 仓库：[yifeiiii0129/PM2.5](https://github.com/yifeiiii0129/PM2.5)
- Version / 文件版本：**1.1.0**；建议 Git 标签 / recommended Git tag：**v1.1.0**
- Publication / 发布状态：本文件描述准备发布的版本；是否已上线请以 GitHub 提交、Release 和 Pages 部署记录为准。This document describes the prepared release; commits, Releases and Pages deployment records determine publication status.

## 1. 1.1.0 与 1.0.0 的区别 / Changes from 1.0.0

这里的 1.0.0 指本次人口加权修改前保留的本地发布快照；没有假定远程仓库已经存在 `v1.0.0` 标签。上传前请核对仓库当前内容。版本号统一写为 `1.0.0`、`1.1.0`，而不是 `1.00`。

The baseline is the saved local release snapshot from before the population-weighting update. This comparison does not assume that a remote `v1.0.0` tag exists. Check the repository before uploading.

| 项目 / Item | 1.0.0 | 1.1.0 |
| --- | --- | --- |
| 国家平均浓度 / National mean PM₂.₅ | 面积加权 / Area-weighted | GPW 2020 全年龄人口加权，使用 World Bank 边界人口分配比例 / Weighted by GPW 2020 total population allocated using World Bank boundary population fractions |
| 城市平均浓度 / City mean PM₂.₅ | 人口加权 / Population-weighted | 保持原值，重新核验 / Values retained and verified |
| 年龄口径 / Age scope | 部分文字笼统标注 25+ / Some descriptions broadly stated 25+ | 明确死亡为 25+，浓度权重为全年龄 / Mortality covers 25+; concentration weights cover all ages |
| 国家 CSV / Country CSV | `areaWeightedPm25UgM3` | `populationWeightedPm25UgM3` |
| 单地点、比较导出 / Selection and comparison exports | 通用浓度字段及原加权标识 / Generic concentration field and original weighting labels | 保留 `pm25UgM3`，新增统一浓度字段和人口口径元数据 / Retain the generic field and add the common concentration field and population metadata |
| 手机、平板搜索 / Compact-screen search | 地图下方 / Below the map | 屏幕宽度 ≤980px 时移到地图前；桌面仍在右侧 / Before the map at widths ≤980px; desktop controls stay on the right |
| 首页方法摘要 / Homepage methods summary | 没有集中摘要 / No consolidated summary | 两句话概括数据、GEMM、成人范围及城市窗口 / Two sentences covering data, GEMM, adult scope and city windows |
| 圆点缩放 / Circle scaling | 仅标注 scaled symbols / Labeled as scaled symbols | 解释平方根缩放、最小圆点尺寸及年度标尺 / Explain square-root scaling, minimum radius and annual scale |
| Methods 阅读方式 / Methods reading flow | 技术细节全部展开 / All details expanded | 直观解释默认显示，五组技术内容可展开 / Plain-language explanations remain visible; five groups of technical details expand on demand |
| 浓度重建 / Concentration rebuild | 无独立发布版重建脚本 / No release-specific rebuild script | 新增 `tools/rebuild_population_pm25.py` / Added rebuild script |

### 1.1 数据结果变化 / Changes to data

- 重算 **952 个国家／地区—年份浓度**：238 个区域 × 2020–2023 四年；同步更新 **3,808 行国家 CSV**。
- 复核 **5,720 个城市—年份浓度**：1,430 个城市窗口 × 四年，原值保留。
- 死亡人数、可避免死亡、死亡率、可避免比例、年龄分组及地图几何保持原结果。它们按逐网格暴露计算，地区平均浓度只是展示用的汇总指标。

Recalculated **952 national concentration means** and updated **3,808 country CSV rows**. Verified all **5,720 city-year means** while retaining their values. Mortality, avoidable deaths, rates, avoidable shares, age groups and geography retain their existing results. Mortality calculations use grid-level exposure rather than the displayed regional mean.

2023 年示例 / Examples for 2023, μg/m³:

| Country / 国家 | 1.0.0：面积加权 / Area-weighted | 1.1.0：人口加权 / Population-weighted |
| --- | ---: | ---: |
| China / 中国 | 24.604 | 33.115 |
| United States / 美国 | 6.852 | 8.664 |
| India / 印度 | 42.704 | 49.468 |
| United Kingdom / 英国 | 6.964 | 7.851 |

这些是加权方式变化，不能解释为两版之间污染实际增加。These differences reflect weighting methods, not a real-world increase in pollution between releases.

### 1.2 下载字段迁移 / CSV migration

完整国家 CSV 将 `areaWeightedPm25UgM3` 改为 `populationWeightedPm25UgM3`；读取旧列名的分析脚本必须修改。这是需要注意的字段兼容性变化。城市 CSV 已经使用新列名，文件保持原样。

The full country CSV renames `areaWeightedPm25UgM3` to `populationWeightedPm25UgM3`. Scripts using the old name must be updated. The city CSV already uses the population-weighted field and is unchanged.

单地点和比较下载 / Selection and comparison downloads:

| Field | Meaning / 含义 |
| --- | --- |
| `populationWeightedPm25UgM3` | 人口加权平均浓度，μg/m³ / Population-weighted concentration |
| `pm25UgM3` | 同一数值的兼容别名 / Retained alias for the same value |
| `pm25Weighting` | `population` |
| `pm25PopulationBasis` | `all ages` |
| `pm25PopulationYear` | `2020` |
| `ageGroup`, `populationDenominator` | 死亡指标的年龄组和人口分母，不能作为浓度权重分母 / Mortality age group and denominator, not the concentration denominator |

### 1.3 已有功能与本轮范围 / Existing features and release scope

独立 Methods、Data、About 页面、合并年龄组、城市九格窗口、多地点比较和 CSV 下载均已在 1.0.0 存在，不是本轮新增。1.1.0 没有增加浓度地图、儿童健康结果或地图图片导出。

Separate Methods, Data and About pages, summary age groups, city footprints, location comparisons and CSV downloads already existed in 1.0.0. This release does not add a concentration map, child health outcomes or map-image export.

## 2. 科学解释 / Interpretation

- **Avoidable share:** 可避免死亡 ÷ 当前 PM₂.₅ 归因死亡，不是占全部死亡的比例。Avoidable deaths divided by current PM₂.₅-attributable deaths, not all deaths.
- **Concentrations:** 国家和城市均使用固定 GPW 2020 全年龄人口权重；仅纳入有效浓度支持且人口为正的网格。Both use fixed GPW 2020 all-age population weights over valid, source-supported populated cells.
- **Health model:** 使用 GEMM 和 GBD NCD+LRI 基线死亡率；不是直接下载的 GBD PM₂.₅ 死亡结果。GEMM with GBD NCD+LRI baseline mortality, not direct GBD PM₂.₅ mortality outputs.
- **Ages:** 当前参数和输入覆盖成人 25+；浓度不随死亡年龄筛选变化。Current mortality inputs cover adults 25+; concentration is independent of the mortality age filter.
- **Geography:** 国家按 World Bank 边界汇总；城市为 0.25° 网格上的 3×3 窗口，可能跨越边界或重叠，不能直接相加。Countries use World Bank boundaries; city windows may cross boundaries or overlap and should not be summed.
- **Time:** 人口固定在 2020 年，年龄结构固定在 2015 年；年际变化不是完整人口趋势。Population and age structure are fixed at 2020 and 2015 respectively.
- **Ranges:** GEMM 参数范围不是完整不确定性。GEMM parameter ranges do not capture all uncertainty.

完整方法、来源及许可见 [Methods](methods.html)。See [Methods](methods.html) for sources, licenses and limitations.

## 3. 需要上传哪些文件 / Files to upload

### 推荐：完整更新当前发布目录 / Recommended: update the full release directory

上传本目录里的文件和下列子目录，放到现有 Pages 发布目录，与现有 `index.html` 同级。**不要将外层 `pm25_v1` 文件夹整体套进去，也不要创建 `1.1.0/` 子目录。**保留仓库已有的 `.github/` 工作流、许可证等管理文件。

Upload the contents of this directory into the existing Pages publishing directory, alongside `index.html`. Do not add a `pm25_v1/` or `1.1.0/` wrapper. Preserve existing repository workflows and administrative files.

```text
PM2.5/
├── .gitignore
├── .nojekyll
├── README.md
├── CHANGELOG.md
├── VERSION
├── index.html
├── methods.html
├── data.html
├── about.html
├── app.js
├── features.js
├── site.js
├── styles.css
├── site.css
├── methods.css
├── data-about.css
├── assets/
│   ├── data.js
│   ├── favicon.svg
│   └── share-preview.png
├── downloads/
│   ├── country_estimates_2020_2023.csv
│   └── city_centered_estimates_2020_2023.csv
├── geo/
│   ├── wb_admin0_simplified.js
│   ├── wb_admin0_simplified.geojson
│   └── wb_ndlsa_simplified.js
├── vendor/
│   ├── d3.v7.min.js
│   └── d3-geo-projection.v4.min.js
└── tools/
    └── rebuild_population_pm25.py
```

`tools/` 用于研究输入到发布数据的重建，不是网页运行依赖，建议随源码保留。`vendor/` 中的版本是第三方库版本，不要改名。`geo/*.geojson` 保留为边界加载备用。

The rebuild tool is maintenance source, not a browser dependency. Keep third-party library filenames and the GeoJSON fallback unchanged.

**不要上传 / Exclude:** `__pycache__/`、`*.pyc`、测试截图、浏览器临时配置、`tmp/`、旧版本文件夹、原始 NetCDF 输入、整个研究项目。浏览器手动上传不会自动按 `.gitignore` 筛选，需自行避开这些文件。Manual browser uploads do not apply `.gitignore` automatically.

### 仅上传变更文件 / Changed-files-only update

仅在远程已完整保留同一份 1.0.0 依赖时使用以下清单。依据本地 1.0.0 快照比对，更新或新增这 **15 个文件**：

Use this list only if the repository already contains all matching 1.0.0 dependencies. Based on the local baseline, update or add these **15 files**:

```text
README.md
CHANGELOG.md
VERSION
index.html
methods.html
data.html
about.html
app.js
features.js
site.js
site.css
methods.css
assets/data.js
downloads/country_estimates_2020_2023.csv
tools/rebuild_population_pm25.py
```

**本次数据已经变化，必须上传 `assets/data.js` 和国家 CSV；只传 HTML/CSS 会出现新说明配旧数据。**

**Both the JavaScript dataset and country CSV must be updated with the pages.**

## 4. 上传步骤 / Upload steps

1. 打开 [仓库](https://github.com/yifeiiii0129/PM2.5)，先查看 **Settings → Pages** 的实际发布分支和目录。下文以 `main`、`/(root)` 为例；若已有工作流或 `/docs` 配置，沿用实际配置。
2. 在正确的分支和目录选择 **Add file → Upload files**。上传上述完整文件集，或按相同相对路径上传 15 个变更文件。文件夹路径要保持；例如 `assets/data.js` 必须进入 `assets/`。
3. 提交说明建议：`Release v1.1.0: population-weighted concentrations and usability updates`。
4. 提交后查看 Actions／Pages 部署结果，等待成功，再打开网站核验。
5. 确认新网页、新数据和下载文件一致后，再创建下面的标签与 Release。

Check the existing publishing source, upload files with their relative paths, commit the update, wait for Pages deployment and verify the live site before creating the release. GitHub Desktop is an alternative if browser folder uploads are inconvenient; open a clone of the existing repository and copy the release contents into its publishing directory, retaining its `.git` and workflows.

分支部署的常见配置 / Typical branch-based configuration:

```text
Settings → Pages
Source: Deploy from a branch
Branch: main
Folder: /(root)
```

这是示例配置，不是已核实的远程设置。创建 Release 不会替代 Pages 配置，也不需要重新命名仓库。参考 [GitHub Pages publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)。

This is an example, not a verified remote configuration. A Release does not replace Pages publishing configuration.

## 5. 怎样命名为 1.1.0 / Version, tag and Release

三个名称各有用途 / These are separate:

| Location / 位置 | Value / 值 | Purpose / 用途 |
| --- | --- | --- |
| `VERSION` 文件 | `1.1.0` | 源码版本标识，已设置 / Source version, already set |
| Git tag | `v1.1.0` | 指向此次发布的提交 / Identifies the release commit |
| GitHub Release title | `PM₂.₅ Health Benefits v1.1.0` | 供读者识别的发布名称 / Human-readable release title |

README 和数据版本也已使用 1.1.0。**修改 `VERSION` 不会自动生成 Git 标签或 Release。**本地文件夹仍可叫 `pm25_v1`，仓库仍叫 `PM2.5`，网站地址也保持不变。

README and dataset metadata already use 1.1.0. Editing `VERSION` does not create a tag or Release. Folder and repository names do not need to change.

### GitHub 网页操作 / GitHub web interface

1. 上传并核验更新后，打开仓库的 **Releases → Draft a new release**。
2. 在标签选择器输入 **`v1.1.0`**，创建新标签。
3. **Target** 选择包含本次全部更新的提交所在分支。若用 `main`，确认其最新提交就是要发布的版本；不要把标签指向旧版提交。
4. **Release title** 填 **`PM₂.₅ Health Benefits v1.1.0`**。
5. 说明粘贴下节发布说明，或使用 CHANGELOG 的 1.1.0 内容。
6. 正式版不要选 **Set as a pre-release**；确认无误后点击 **Publish release**。

After uploading, create a new Release with tag `v1.1.0`, target the updated commit/branch, enter the title and notes, and publish as a regular release. If the tag already exists, inspect its target before selecting it. Do not move a tag that already identifies a published release. See [GitHub: managing releases](https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository).

如果希望补一个 `v1.0.0`，它应指向更新前的旧提交，不能指向当前 1.1.0。已有旧标签则保留。If adding a historical `v1.0.0` tag, point it to the pre-update commit, not the new release.

## 6. 可复制的发布说明 / Suggested release notes

### 中文

1.1.0 将国家平均 PM₂.₅ 从面积加权调整为人口加权，与城市窗口统一使用 GPW 2020 全年龄人口。重算 952 个国家—年份浓度，更新国家 CSV，并核验全部城市浓度。死亡人数、可避免比例和地理范围保持原结果。

新增首页方法摘要和平方根缩放解释；手机和平板搜索入口移到地图前；Methods 将五组技术内容改为可展开阅读。同步更新页面、导出元数据和中英说明。

**CSV 兼容性提醒：**国家浓度列由 `areaWeightedPm25UgM3` 改为 `populationWeightedPm25UgM3`，读取旧列名的脚本需要更新。

### English

Version 1.1.0 changes national mean PM₂.₅ from area weighting to population weighting, aligning countries and city windows with GPW 2020 all-age population weights. It recalculates 952 national means, updates the country CSV and verifies all city means. Mortality results, avoidable shares and geography are retained.

The update adds a homepage methods summary and circle-scaling explanation, moves compact-screen location search ahead of the map, and introduces five expandable technical sections on Methods. Page wording, export metadata and documentation are aligned with the new concentration definition.

**CSV compatibility:** the country concentration column is renamed from `areaWeightedPm25UgM3` to `populationWeightedPm25UgM3`. Update scripts that use the old name.

## 7. 本地运行与上线核验 / Preview and verification

在本目录运行 / From this directory:

```powershell
python -B -m http.server 8765 --bind 127.0.0.1
```

打开 [local preview](http://127.0.0.1:8765/)。部署只需要静态文件，不需要在 GitHub 上运行 Python 或安装模型依赖。Serving the site does not require rebuilding the health model.

本地已完成数据一致性检查、2020–2023 国家浓度重算、城市浓度复核、桌面／手机交互、下载、方法折叠与键盘操作检查。**上线后仍需核验部署的实际文件。**

Local checks cover data consistency, concentration calculations, desktop/mobile interactions, downloads, native disclosures and keyboard access. Verify the deployed files after publication:

- [ ] 四页都能打开 / All four pages load.
- [ ] 选择中国、2023 年，浓度显示约 **33.1 μg/m³**；下载精度为 **33.115** / China 2023 matches the updated value.
- [ ] 年龄切换改变死亡结果，浓度不变 / Mortality age selection does not change concentration.
- [ ] 国家 CSV 包含 `populationWeightedPm25UgM3` / Updated country CSV header.
- [ ] 手机搜索在地图前，桌面在右侧 / Correct responsive search placement.
- [ ] Methods 技术细节可展开／收起 / Disclosures work.
- [ ] 下载、比较和现有分享链接可用 / Downloads, comparisons and shared links work.
- [ ] 页面与下载文件属于同一提交；若看见旧内容，刷新后重新核对 / Pages and datasets match the release commit.

## 8. 数据重建与回退 / Rebuild and rollback

浓度重建脚本需要原研究 NetCDF 输入及带 NetCDF 后端的 Python、numpy、xarray 环境。以下命令适用于本地目录布局；GitHub 部署不运行它。

The rebuild script requires original research NetCDF inputs and Python with numpy, xarray and a NetCDF backend. It is not part of Pages deployment.

```powershell
python tools/rebuild_population_pm25.py --inputs ../web_demo_version2
```

回退应通过新提交恢复旧版本文件，保留历史。若本次更新是单独一个提交，可在核实后使用 `git revert <update-commit>`；若跨多个提交，要将页面、脚本、数据及 CSV 一起恢复，并重新部署。删除 Release 不会自动回退 Pages。修改 `VERSION` 也不会恢复数据。

Restore an earlier version through a new commit. For an isolated update commit, `git revert <update-commit>` can reverse it after review. Multi-commit updates require restoring a consistent set of pages, scripts and data. Deleting a Release or editing `VERSION` does not roll back the deployed site.
