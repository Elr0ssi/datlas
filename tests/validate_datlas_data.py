import json, pathlib, datetime
path = pathlib.Path(__file__).resolve().parents[1]/'src/data/conflits/moyen-orient/datlas-middle-east.json'
data = json.loads(path.read_text(encoding='utf8'))
ids=lambda arr:set(i['id'] for i in arr)
source_ids, place_ids, case_ids=ids(data['sources']),ids(data['places']),ids(data['conflicts'])
assert len(source_ids)==len(data['sources'])
assert len(place_ids)==len(data['places'])
assert len(case_ids)==len(data['conflicts'])
for p in data['places']:
 assert -90 <= p['lat'] <= 90 and -180 <= p['lng'] <= 180
 assert p['geographyOnly'] is True
 assert p['precision'] in {'city_center','region_centroid','chokepoint_approx','sea_centroid'}
for c in data['conflicts']:
 assert c['placeIds'] and set(c['placeIds']) <= place_ids
 assert set(c['sourceIds']) <= source_ids
 assert c['totalCombatantsEstimated'] is None
 datetime.date.fromisoformat(c['started'])
 for e in c['timeline']:
  datetime.date.fromisoformat(e['date'])
  assert e['sourceId'] in source_ids
 for m in c['metrics']:
  datetime.date.fromisoformat(m['asOf'])
  assert m['sourceId'] in source_ids and m['value'] >= 0
  assert m['periodStart'] and m['periodEnd'] and m['scope'] and m['notes']
for r in data['relationships']:
 assert r['fromConflictId'] in case_ids and r['toConflictId'] in case_ids
 assert r['fromPlaceId'] in place_ids and r['toPlaceId'] in place_ids
 assert r['sourceId'] in source_ids and r['type']
print(f"OK : {len(case_ids)} conflits, {len(place_ids)} lieux, {len(data['relationships'])} relations, {sum(len(c['timeline']) for c in data['conflicts'])} jalons, {len(source_ids)} sources")
