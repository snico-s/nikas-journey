type routeData = {
  date: string;
  title: string;
  text: string;
  outgoings: number;
  distance: number;
  route?: GeoJSON.Feature<LineString>;
};

type TimeLineData = {
  _id: number;
  day: number;
  date: string;
  title: string;
  content: string;
};
