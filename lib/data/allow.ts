/**
 * Numeric strings in content/*.md that are not data, so scripts/check-figures.ts lets them stand as
 * literals. Each is an identifier, a specification, a citation or the unit of a rate.
 */
export const ALLOW: RegExp[] = [
  /\b(19|20)\d\d\b/, // a year
  /0726 766 800/, // Firefly's contact number on the cover
  /AES-256/, // an encryption standard
  /\b160[- ]characters?\b/, // the SMS message length limit
  /Article 180\(7\)/, // a constitutional citation
  /KECA 460/, // a law-report citation
  /per 1,000\b|1,000 reached/, // the unit of a rate, not a count
  /\| 10\d\.\d( \(|\s*\|)/, // an FM frequency in the station table (100.4, 102.2, 103.3, 105.3)
  /\b100(\.0+)?%/, // a completeness target: all of something
  /\b100\.00%/, // a cumulative share reaching the whole
  /\b0–100\b/, // the range of a 0-100 score
  /Ksh 500 notes/, // a quoted field report, not a figure
  />\s?10,000 views|>\s?100,000 views|5,000 impressions/, // thresholds in a response or ad rule
  /\b30–120\b/, // a response window, in minutes
];

