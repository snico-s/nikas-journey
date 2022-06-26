import { MultiLineString } from "geojson";

export const fromMultiLineToLineString = (
  feature: GeoJSON.Feature<MultiLineString>
) => {
  return {
    type: "Feature",
    geometry: {
      type: "LineString",
      coordinates: feature.geometry.coordinates.flat(),
    },
    properties: feature.properties,
  };
};
