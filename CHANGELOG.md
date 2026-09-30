# 更新记录 / Changelog

## 1.1.0 — 人口加权浓度 / Population-weighted concentrations

本地更新，尚未部署 / Prepared locally; not yet deployed.

- 重算 2020–2023 年国家平均 PM₂.₅，使用 GPW 2020 全年龄人口及 World Bank 边界人口分配比例，与城市窗口的人口加权口径一致。
- 同步浓度标签、比较表、单地点及比较导出、完整国家 CSV、方法说明。
- 国家 CSV 浓度列由 `areaWeightedPm25UgM3` 改为 `populationWeightedPm25UgM3`；读取旧列名的脚本需要更新。
- Recalculate national PM₂.₅ for 2020–2023 using GPW 2020 total-population weights and World Bank boundary population fractions.
- Update labels, comparisons, exports, country CSV and methods. Rename the country CSV concentration column to `populationWeightedPm25UgM3` (consumers of the old column must update).
- City concentrations, mortality estimates, age groups and map geometry are retained. Missing concentration support is excluded from both weighted sums.

- 补齐全年龄浓度权重说明、导出元数据及独立方法章节；浓度不随死亡年龄筛选变化。
- Clarify all-age concentration weights across pages and exports; add a linked methods section and retain the export concentration alias.

- 增加首页方法摘要、圆点平方根缩放解释，并将手机和平板的地点搜索移至地图前。
- Add a brief homepage methods summary and circle-scaling explanation; move location search ahead of the map on compact screens.

- Methods 页保留直观解释和重要限制，将公式、数据步骤及参数技术细节放入可展开区域。
- Keep plain-language explanations and key limitations visible on Methods; place formulas, data steps and parameter details in native expandable sections.

## 1.0.0 — 首次发布版本 / Initial release version

此版本已在本地整理，发布状态以 GitHub 仓库和 Pages 部署记录为准。

This version is prepared locally. Publication status is determined by the GitHub repository and Pages deployment records.

- 四个独立页面及公共导航：Explore、Methods、Data、About。
- 国家年龄组默认简化为 25–49、50–69、70+，保留独立 25+ 总计及原始细分视图。
- 国家和城市 CSV 下载，当前选择和比较结果导出。
- 最多四地点比较，统一使用所选年份的 25+ 估计。
- 选中城市实际九格窗口、显示开关、窗口面积和 25+ 人口。
- URL 状态保留、页面返回恢复和响应式手机布局。
- 指标定义、数据来源、空间范围及参数区间说明。
- 脚本使用稳定名称 `app.js`、`features.js`，版本标识为 `1.0.0`。

- Four independent pages with shared navigation: Explore, Methods, Data and About.
- Summary country ages 25–49, 50–69 and 70+, with a separate 25+ total and detailed-age view.
- Country/city CSV downloads and exports for a selection or comparison.
- Comparison of up to four locations using 25+ estimates for the selected year.
- Actual nine-cell city footprints, visibility toggle, area and population aged 25+.
- URL state, return-navigation restoration and responsive mobile layout.
- Documentation of indicators, data sources, spatial scope and parameter bounds.
- Stable script names `app.js` and `features.js`, with version identifier `1.0.0`.

沿用既有研究结果；未重新运行健康模型或修改原始估计。

Existing research results are retained; the health model has not been rerun and original estimates have not been changed.
