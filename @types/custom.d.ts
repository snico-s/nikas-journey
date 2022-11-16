import { TravelDay } from "@prisma/client";

type routeData = {
  _id?: string;
  date: string;
  title: string;
  text: string;
  outgoings: number;
  distance: number;
  route?: GeoJSON.Feature<LineString>;
};

type RouteFileData = {
  filename: string;
  date: string;
  truncated: Feature<LineString, GeoJsonProperties>;
  geoJson: Feature<LineString, GeoJsonProperties>;
  distance: number;
  uploaded: boolean | null; //UPLOADED, IN_PROGRESS, FAILED
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

interface TravelDayWithRoute extends TravelDay {
  route: Route[];
}
