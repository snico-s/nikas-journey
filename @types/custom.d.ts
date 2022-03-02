type routeData = {
  date: string;
  title: string;
  text: string;
  outgoings: number;
  distance: number;
  route?: GeoJSON.Feature<LineString>;
};
