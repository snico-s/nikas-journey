type routeData = {
  _id?: string;
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

type User = {
  name?: string;
  email: string;
  password: string;
};

interface mymaplibre extends maplibregl.Map {
  addControl(
    control: IControl | MapboxDraw,
    position?: maplibregl.ControlPosition
  ): this;
}
