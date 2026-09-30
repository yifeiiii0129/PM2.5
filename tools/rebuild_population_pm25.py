"""Rebuild displayed concentrations from local model inputs (not mortality).

Run with a Python environment containing numpy and xarray with a NetCDF backend.
Default input: ../../web_demo_version2 relative to this script's directory.
Country weights are GPW 2020 total population times World Bank population
fractions. Only finite, source-supported PM2.5 with positive population enters
the numerator and denominator. Missing support never becomes zero exposure.
"""
import argparse
import csv
import json
from pathlib import Path

import numpy as np
import xarray as xr


def country_means(pm, support, population, indices, fractions):
    size = int(indices.max()) + 1
    numerator = np.zeros(size)
    denominator = np.zeros(size)
    valid = np.isfinite(pm) & (pm >= 0) & np.isfinite(support) & (support > 0)
    valid &= np.isfinite(population) & (population > 0)
    for ids, fraction in zip(indices, fractions):
        keep = valid & (ids > 0) & np.isfinite(fraction) & (fraction > 0)
        weights = population[keep] * fraction[keep]
        numerator += np.bincount(ids[keep], weights=pm[keep] * weights, minlength=size)
        denominator += np.bincount(ids[keep], weights=weights, minlength=size)
    return np.divide(numerator, denominator, out=np.full(size, np.nan), where=denominator > 0), denominator


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    site_default = Path(__file__).resolve().parents[1]
    parser.add_argument('--site', type=Path, default=site_default)
    parser.add_argument('--inputs', type=Path, default=site_default.parent / 'web_demo_version2')
    parser.add_argument('--report', type=Path)
    args = parser.parse_args()
    source = args.site / 'assets/data.js'
    text = source.read_text(encoding='utf-8')
    prefix = text[:text.index('{')]
    data = json.loads(text[text.index('{'):].strip().rstrip(';'))
    report = {'countryChanges': [], 'citiesVerified': 0, 'missingCountryConcentrations': []}
    values = {}
    with xr.open_dataset(args.inputs / 'data/country mask/admin0/wb_admin0_fractional_masks_025x025.nc') as mask:
        population = mask.population_count.values.astype(float)
        indices = mask.country_index.values.astype(int)
        fractions = mask.population_fraction.values.astype(float)
        iso_by_id = dict(zip(mask.country.values.tolist(), mask.iso3.values.tolist()))
        for year, records in data['years'].items():
            with xr.open_dataset(args.inputs / f'model_inputs/pm25/PM25_{year}_025x025.nc') as grid:
                np.testing.assert_array_equal(mask.lat, grid.lat)
                np.testing.assert_array_equal(mask.lon, grid.lon)
                pm = grid.PM25.values.astype(float)
                support = grid.PM25_source_weight.values.astype(float)
                means, denominators = country_means(pm, support, population, indices, fractions)
                for country in records['countries']:
                    cid = country['countryIndex']
                    assert iso_by_id[cid] == country['iso3']
                    old = country['pm25']
                    value = float(means[cid])
                    country['pm25'] = round(value, 3) if np.isfinite(value) else None
                    country['excessPm25'] = round(max(value - data['whoPm25'], 0), 3) if np.isfinite(value) else None
                    values[(year, country['iso3'])] = country['pm25']
                    report['countryChanges'].append({'year': year, 'iso3': country['iso3'], 'previousPm25': old, 'populationWeightedPm25': country['pm25'], 'supportedPopulation': float(denominators[cid])})
                    if country['pm25'] is None:
                        report['missingCountryConcentrations'].append([year, country['iso3']])
                # Verify every existing city against its actual displayed grid footprint.
                for city in records['cities']:
                    cells = data['cityWindows'][city['id']]['cells']
                    ys = np.array([int(np.abs(grid.lat.values - (c[1] + c[3]) / 2).argmin()) for c in cells])
                    xs = np.array([int(np.abs(grid.lon.values - (c[0] + c[2]) / 2).argmin()) for c in cells])
                    concentration, weight = pm[ys, xs], population[ys, xs]
                    valid = np.isfinite(concentration) & (concentration >= 0) & np.isfinite(weight) & (weight > 0) & (support[ys, xs] > 0)
                    if valid.any():
                        expected = round(float(np.average(concentration[valid], weights=weight[valid])), 3)
                        assert abs(expected - city['pm25']) <= 0.00101, (year, city['id'], expected, city['pm25'])
                    else:
                        assert city['pm25'] is None, ('City requires missing-data handling', year, city['id'])
                    report['citiesVerified'] += 1
    data['notes']['countryPm25'] = 'Country PM2.5 is weighted by GPW 2020 total population allocated using World Bank population fractions, over source-supported populated cells. Missing concentration support is excluded from both numerator and denominator; no supported population yields an unavailable mean.'
    data['notes']['concentrationPopulation'] = 'Country and city PM2.5 concentrations use total population of all ages, fixed at 2020; mortality estimates cover adults 25+.'
    data['version'] = (args.site / 'VERSION').read_text(encoding='utf-8').strip()
    csv_path = args.site / 'downloads/country_estimates_2020_2023.csv'
    with csv_path.open(encoding='utf-8-sig', newline='') as handle:
        reader = csv.DictReader(handle)
        fields, rows = reader.fieldnames, list(reader)
    old_field = 'areaWeightedPm25UgM3'
    new_field = 'populationWeightedPm25UgM3'
    fields = [new_field if f == old_field else f for f in fields]
    for row in rows:
        row.pop(old_field, None)
        row[new_field] = values[(row['year'], row['iso3'])]
    # Write only after all input and city checks succeed.
    source.write_text(prefix + json.dumps(data, ensure_ascii=True, separators=(',', ':'), allow_nan=False) + ';\n', encoding='utf-8')
    with csv_path.open('w', encoding='utf-8-sig', newline='') as handle:
        writer = csv.DictWriter(handle, fields)
        writer.writeheader()
        writer.writerows(rows)
    if args.report:
        args.report.parent.mkdir(parents=True, exist_ok=True)
        args.report.write_text(json.dumps(report, indent=2), encoding='utf-8')
    print(f"Rebuilt {len(values)} country-year means and {len(rows)} CSV rows; verified {report['citiesVerified']} city-year means. Missing means: {report['missingCountryConcentrations']}")


if __name__ == '__main__':
    main()
