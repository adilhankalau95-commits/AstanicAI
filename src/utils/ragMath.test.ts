import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateDistanceMeters,
  calculateWalkingMinutes,
  obfuscateCoordinates,
  calculateHybridScore,
  checkConfidenceStatus,
} from './ragMath.ts';

test('Haversine distance between Nur Alem EXPO and Mega Silk Way is ~750-850m', () => {
  const dist = calculateDistanceMeters(51.0902, 71.4181, 51.0892, 71.4078);
  assert.ok(dist >= 650 && dist <= 900, `Expected ~730m, got ${dist}m`);
});

test('Walking time calculation at 5 km/h (83.33 m/min)', () => {
  assert.equal(calculateWalkingMinutes(83), 1);
  assert.equal(calculateWalkingMinutes(500), 6);
  assert.equal(calculateWalkingMinutes(1000), 12);
});

test('Privacy Mode obfuscates exact GPS coordinates into a ~150m sector', () => {
  const exact = obfuscateCoordinates(51.090412, 71.418231, false);
  assert.equal(exact.lat, 51.090412);
  assert.equal(exact.lon, 71.418231);

  const blurred = obfuscateCoordinates(51.090412, 71.418231, true);
  assert.notEqual(blurred.lat, 51.090412);
  assert.ok(blurred.sectorLabel.includes('Privacy Blur'));
});

test('Hybrid RAG Score weights Distance (40%), Tag Match (40%), Rating (20%)', () => {
  const perfectMatch = calculateHybridScore({
    distanceMeters: 200,
    maxRadiusMeters: 2000,
    poiTags: ['wifi', 'sockets', 'quiet'],
    requiredTags: ['wifi', 'sockets'],
    rating: 4.9,
  });

  const farMismatch = calculateHybridScore({
    distanceMeters: 1900,
    maxRadiusMeters: 2000,
    poiTags: ['indoor'],
    requiredTags: ['wifi', 'sockets'],
    rating: 4.0,
  });

  assert.ok(
    perfectMatch.totalScore > farMismatch.totalScore,
    `Expected perfectMatch (${perfectMatch.totalScore}) > farMismatch (${farMismatch.totalScore})`
  );
  assert.equal(perfectMatch.tagScore, 100);
  assert.equal(farMismatch.tagScore, 0);
});

test('Confidence check marks verified hours as 95% and missing hours as 70% warning', () => {
  const verified = checkConfidenceStatus('10:00–20:00', false);
  assert.equal(verified.percentage, 95);
  assert.equal(verified.level, 'high');

  const unverified = checkConfidenceStatus(null, false);
  assert.equal(unverified.percentage, 70);
  assert.equal(unverified.level, 'medium');
  assert.ok(unverified.badgeText.includes('70%'));
});
