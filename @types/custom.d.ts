import { TravelDay } from "@prisma/client";
import { LineStringProperties } from "../lib/geoHelpers";

type routeData = {
  _id?: string;
  date: string;
  title: string;
  text: string;
  outgoings: number;
  distance: number;
  route?: GeoJSON.Feature<LineString>;
};

type TravelDayData = {
  date: Date;
  totalDistance: number;
  lineString: GeoJSON.Feature<LineString, LineStringProperties>;
  fileData: fileData[];
};

type FileData = {
  filename: string;
  date: Date;
  lineString: Feature<LineString, LineStringProperties>;
  distance: number;
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
