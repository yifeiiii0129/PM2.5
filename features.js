/* Presentation features. Health estimates are read from precomputed data. */
let showDetailedAges = false;
let comparisonLocations = [];
let pendingSelection = {};

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}

function availableAgeGroups() {
  return showDetailedAges ? DATA.ageGroups : DATA.summaryAgeGroups;
}

function renderAgeSummaryTable(country) {
  if (!country || country.virtual) { els.ageBreakdown.replaceChildren(); return; }
  const header = '<thead><tr><th scope="col">Age</th><th scope="col">Current deaths</th><th scope="col">Avoidable deaths</th><th scope="col">Avoidable share</th></tr></thead>';
  const rows = availableAgeGroups().filter((group) => group.key !== 'post25').map((group) => {
    const metric = country.ages[group.key];
    return `<tr${ageKey === group.key ? ' class="selected-age"' : ''}><th scope="row">${escapeHtml(group.label)}</th><td>${formatDeaths(metric.currentDeaths)}</td><td>${formatDeaths(metric.avoidableDeaths)}</td><td>${formatPercent(metric.avoidableShare)}</td></tr>`;
  }).join('');
  const total = country.ages.post25;
  els.ageBreakdown.innerHTML = `<table class="data-table age-summary ${showDetailedAges ? 'age-detailed' : 'age-reduced'}"><caption>${showDetailedAges ? 'Detailed age groups · 5-year bands; 80+' : 'Summary age groups · 25–49, 50–69, 70+'}</caption>${header}<tbody>${rows}</tbody><tfoot><tr><th scope="row">25+ total</th><td>${formatDeaths(total.currentDeaths)}</td><td>${formatDeaths(total.avoidableDeaths)}</td><td>${formatPercent(total.avoidableShare)}</td></tr></tfoot></table>`;
}

function drawModeledArea() {
  const enabled = document.querySelector('#showModeledArea').checked;
  const window = selectedCity && DATA.cityWindows[selectedCity.id];
  const features = enabled && window ? window.cells.map(([west, south, east, north]) => rewindFeatureForD3({
    type: 'Feature', properties: {}, geometry: {
      type: 'Polygon', coordinates: [[[west, south], [east, south], [east, north], [west, north], [west, south]]],
    },
  })) : [];
  modeledAreaGroup.selectAll('path').data(features).join('path')
    .attr('class', 'modeled-cell').attr('d', geoPath)
    .attr('fill', '#337fb4').attr('fill-opacity', 0.22)
    .attr('stroke', '#145981').attr('stroke-width', 1)
    .attr('vector-effect', 'non-scaling-stroke');
  modeledAreaGroup.attr('aria-label', selectedCity ? `Modeled area for ${cityName(selectedCity)}` : '');
}

function currentLocationRef() {
  if (selectedCity) return { kind: 'city', id: selectedCity.id };
  if (selectedCountry && !selectedCountry.virtual) return { kind: 'country', id: selectedCountry.iso3 };
  return null;
}

function locationKey(ref) { return `${ref.kind}:${ref.id}`; }

function updateFeaturePanel() {
  const city = selectedCity;
  const ref = currentLocationRef();
  const toggle = document.querySelector('#showModeledArea');
  toggle.disabled = !city;
  document.querySelector('#windowToggleNote').textContent = city ? 'Blue cells = modeled footprint' : 'Select a city';
  document.querySelector('#pm25Label').textContent = city ? 'Population-weighted mean PM₂.₅' : 'Area-weighted mean PM₂.₅';
  const age = DATA.ageGroups.concat(DATA.summaryAgeGroups).find((group) => group.key === ageKey)?.label || '25+';
  document.querySelector('#rateLabel').textContent = `PM₂.₅-attributable deaths per 100,000 people aged ${city ? '25+' : age.replace(' (total)', '')}`;
  if (city) {
    renderSelectionContext([
      { text: 'Adults 25+ · city-centered window' },
      { text: `Window area ${formatArea(city.windowAreaKm2)}`, highlight: true, prominent: true },
      { text: `Window population aged 25+: ${formatNumber(city.population25PlusInWindow)}`, highlight: true },
    ]);
  }
  const merged = !city && ['25_49', '50_69', '70plus'].includes(ageKey);
  if (merged) {
    [els.currentRateInterval, els.currentDeathsInterval, els.avoidableDeathsInterval].forEach((el) => { el.textContent = 'Merged age group: interval not calculated'; });
  }
  document.querySelector('#selectionNotice').innerHTML = selectedCountry?.virtual && !city
    ? 'Regional total unavailable. Select an available city; overlapping city windows are not summed into a regional total.'
    : comparisonLocations.length ? `<a href="#comparison">View comparison (${comparisonLocations.length}/4) ↓</a>` : '';
  const add = document.querySelector('#addComparison');
  const already = ref && comparisonLocations.some((item) => locationKey(item) === locationKey(ref));
  add.disabled = !ref || already || comparisonLocations.length >= 4;
  add.textContent = already ? 'Added to comparison' : comparisonLocations.length >= 4 ? 'Comparison full (4)' : 'Add to comparison';
  document.querySelector('#downloadSelection').disabled = !ref;
  els.sizeLegend.hidden = !selectedCountry;
  document.querySelector('#sizeLegendCaption').hidden = !selectedCountry;
  els.ageTableWrap.classList.toggle('is-hidden', !!city || !!selectedCountry?.virtual);
}

function resolveComparison(ref) {
  const item = ref.kind === 'country' ? countries().find((d) => d.iso3 === ref.id) : cities().find((d) => d.id === ref.id);
  if (!item) return { ref, item: null, metric: null, name: ref.id };
  return { ref, item, metric: ref.kind === 'country' ? item.ages.post25 : item,
    name: ref.kind === 'country' ? countryName(item) : `${cityName(item)}, ${cleanDisplayName(item.country)}` };
}

function renderComparison() {
  const target = document.querySelector('#comparisonTable');
  const entries = comparisonLocations.map(resolveComparison);
  document.querySelector('#downloadComparison').disabled = !entries.length;
  document.querySelector('#clearComparison').disabled = !entries.length;
  document.querySelector('#comparisonStatus').textContent = entries.length
    ? `${entries.length} of 4 locations · ${year} · adults 25+${entries.length === 4 ? ' · Remove a location to add another.' : ''}`
    : 'Select a location, then choose “Add to comparison”.';
  if (!entries.length) { target.innerHTML = '<div class="comparison-empty">Your selected locations will appear here.</div>'; return; }
  const head = entries.map(({ ref, name }) => `<th scope="col"><span>${escapeHtml(name)}</span><button class="remove-location" data-key="${escapeHtml(locationKey(ref))}" aria-label="Remove ${escapeHtml(name)} from comparison">Remove</button></th>`).join('');
  const row = (label, getter, rowClass = 'comparison-numeric') => `<tr class="${rowClass}"><th scope="row">${label}</th>${entries.map((entry) => `<td>${entry.item ? getter(entry) : 'Unavailable for this year'}</td>`).join('')}</tr>`;
  target.innerHTML = `<table class="data-table comparison-table"><caption class="sr-only">Location comparison for ${year}, adults aged 25+</caption><thead><tr><th scope="col">Measure</th>${head}</tr></thead><tbody>` +
    row('Geographic scope', (e) => e.ref.kind === 'city' ? 'City-centered window' : 'Country / area', 'comparison-description') +
    row('Avoidable deaths / year', (e) => `<strong>${formatDeaths(e.metric.avoidableDeaths)}</strong>`) +
    row('Current PM₂.₅-attributable deaths / year', (e) => formatDeaths(e.metric.currentDeaths)) +
    row('Avoidable share of PM₂.₅-attributable deaths', (e) => formatPercent(e.metric.avoidableShare)) +
    row('Avoidable deaths per 100,000 adults 25+', (e) => formatRate(e.metric.avoidableRatePer100k)) +
    row('Mean PM₂.₅ (μg/m³)', (e) => `${formatOne(e.item.pm25)}<small>${e.ref.kind === 'city' ? 'Population-weighted' : 'Area-weighted'}</small>`) +
    row('Population aged 25+', (e) => formatNumber(e.ref.kind === 'city' ? e.item.population25PlusInWindow : e.metric.populationDenominator)) +
    row('Modeled area (km²)', (e) => formatNumber(e.ref.kind === 'city' ? e.item.windowAreaKm2 : e.item.fractionalLandAreaKm2)) +
    '</tbody></table>';
}

function csvCell(value) {
  let text = value == null ? '' : String(value);
  // Keep names beginning with spreadsheet formula characters as plain text.
  if (typeof value === 'string' && /^[=+@-]/.test(text)) text = "'" + text;
  return /[",\r\n]/.test(text) ? '"' + text.replace(/"/g, '""') + '"' : text;
}

function downloadRows(rows, filename) {
  if (!rows.length) return;
  const fields = [...new Set(rows.flatMap(Object.keys))];
  const content = '\uFEFF' + [fields.map(csvCell).join(','), ...rows.map((row) => fields.map((key) => csvCell(row[key])).join(','))].join('\r\n');
  const url = URL.createObjectURL(new Blob([content], { type: 'text/csv;charset=utf-8;' }));
  const link = document.createElement('a');
  link.href = url; link.download = filename; document.body.append(link); link.click(); link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function exportLocation(ref, selectedAge = 'post25') {
  const entry = resolveComparison(ref);
  if (!entry.item) return { year, location: ref.id, status: 'Unavailable for this year' };
  const city = ref.kind === 'city';
  const metric = city ? entry.item : entry.item.ages[selectedAge];
  const ageLabel = city ? '25+' : (DATA.ageGroups.concat(DATA.summaryAgeGroups).find((group) => group.key === selectedAge)?.label || selectedAge);
  return {
    year, location: entry.name, locationType: ref.kind, id: ref.id, iso3: entry.item.iso3,
    ageGroup: ageLabel, scenarioPm25UgM3: 5,
    spatialScope: city ? 'City-centered model window, not city administrative boundaries' : 'World Bank country / area aggregation',
    pm25UgM3: entry.item.pm25, pm25Weighting: city ? 'population' : 'area',
    populationDenominator: city ? entry.item.population25PlusInWindow : metric.populationDenominator,
    modeledAreaKm2: city ? entry.item.windowAreaKm2 : entry.item.fractionalLandAreaKm2,
    currentDeaths: metric.currentDeaths, avoidableDeaths: metric.avoidableDeaths,
    currentRatePer100k: metric.currentRatePer100k, avoidableRatePer100k: metric.avoidableRatePer100k,
    avoidableShare: metric.avoidableShare,
    avoidableDeathsLow: metric.avoidableDeathsLow, avoidableDeathsHigh: metric.avoidableDeathsHigh,
    intervalNote: metric.avoidableDeathsLow == null ? 'Not calculated for merged age groups' : 'Source GEMM parameter bounds; not full uncertainty',
    populationYear: 2020, ageStructureYear: 2015, source: 'Duke PM2.5 Health Benefits v1.0.0; GEMM with GBD NCD+LRI baseline mortality',
  };
}

function saveExploreState() {
  const params = new URLSearchParams();
  params.set('year', year); params.set('age', ageKey);
  if (selectedCountry) params.set('country', selectedCountry.iso3);
  if (selectedCity) params.set('city', selectedCity.id);
  if (showDetailedAges) params.set('detail', '1');
  params.set('area', document.querySelector('#showModeledArea').checked ? '1' : '0');
  if (comparisonLocations.length) params.set('compare', comparisonLocations.map(locationKey).join(','));
  const url = './index.html?' + params.toString();
  try { history.replaceState(null, '', url + location.hash); } catch { /* file:// may limit History API */ }
  try { sessionStorage.setItem('pm25-health-explore-url', url); } catch { /* URL still preserves state */ }
  document.querySelectorAll('.site-header a').forEach((link) => {
    if (link.textContent === 'Explore' || link.classList.contains('brand')) link.href = url;
  });
}

function restoreExploreState() {
  const params = new URLSearchParams(location.search);
  if (DATA.years[params.get('year')]) year = params.get('year');
  showDetailedAges = params.get('detail') === '1';
  const wanted = params.get('age');
  if (availableAgeGroups().some((group) => group.key === wanted)) ageKey = wanted;
  document.querySelector('#detailedAges').checked = showDetailedAges;
  document.querySelector('#showModeledArea').checked = params.get('area') !== '0';
  pendingSelection = { country: params.get('country'), city: params.get('city') };
  const seen = new Set();
  comparisonLocations = (params.get('compare') || '').split(',').flatMap((token) => {
    const [kind, id] = token.split(':');
    if (!['country', 'city'].includes(kind) || !id || seen.has(token)) return [];
    const exists = Object.values(DATA.years).some((records) => kind === 'country'
      ? records.countries.some((item) => item.iso3 === id) : records.cities.some((item) => item.id === id));
    if (!exists) return [];
    seen.add(token); return [{ kind, id }];
  }).slice(0, 4);
}

function restoreSelection() {
  selectedCity = cities().find((city) => city.id === pendingSelection.city) || null;
  selectedCountry = countryByIso(selectedCity?.iso3 || pendingSelection.country);
  if (selectedCity) { ageKey = 'post25'; els.age.value = ageKey; }
  els.countrySearch.value = selectedCountry ? countryName(selectedCountry) : '';
  els.citySearch.value = selectedCity ? `${cityName(selectedCity)}, ${countryName(selectedCountry)}` : '';
}

function initFeatureEvents() {
  document.querySelector('#showModeledArea').addEventListener('change', () => {
    drawModeledArea();
    if (selectedCity && document.querySelector('#showModeledArea').checked) zoomToCity(selectedCity);
    saveExploreState();
  });
  document.querySelector('#detailedAges').addEventListener('change', (event) => {
    showDetailedAges = event.target.checked;
    if (!availableAgeGroups().some((group) => group.key === ageKey)) ageKey = 'post25';
    populateAges(); drawCountries(); renderPanel();
  });
  document.querySelector('#addComparison').addEventListener('click', () => {
    const ref = currentLocationRef();
    if (!ref || comparisonLocations.length >= 4 || comparisonLocations.some((item) => locationKey(item) === locationKey(ref))) return;
    comparisonLocations.push(ref); updateFeaturePanel(); renderComparison(); saveExploreState();
  });
  document.querySelector('#comparisonTable').addEventListener('click', (event) => {
    const button = event.target.closest('button[data-key]');
    if (!button) return;
    comparisonLocations = comparisonLocations.filter((item) => locationKey(item) !== button.dataset.key);
    updateFeaturePanel(); renderComparison(); saveExploreState();
    document.querySelector('#addComparison').focus();
  });
  document.querySelector('#clearComparison').addEventListener('click', () => {
    comparisonLocations = []; updateFeaturePanel(); renderComparison(); saveExploreState();
  });
  document.querySelector('#downloadSelection').addEventListener('click', () => {
    const ref = currentLocationRef();
    if (ref) downloadRows([exportLocation(ref, ageKey)], `pm25-${ref.id}-${year}-${selectedCity ? '25plus' : ageKey}.csv`);
  });
  document.querySelector('#downloadComparison').addEventListener('click', () => {
    downloadRows(comparisonLocations.map((ref) => exportLocation(ref)), `pm25-comparison-${year}-25plus.csv`);
  });
}
