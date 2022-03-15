import { useEffect, useRef, useState, Dispatch, SetStateAction } from "react";
import maplibregl, { IControl } from "maplibre-gl";
import MapboxDraw, {
  DrawCreateEvent,
  DrawSelectionChangeEvent,
} from "@mapbox/mapbox-gl-draw";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";

function usePrevious(value: any) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

type Props = {
  // setRoutes: Dispatch<SetStateAction<GeoJSON.Feature[][]>>;
};

const DrawMap = ({}: Props) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const draw = useRef<MapboxDraw | null>(null);
  const [lng] = useState(139.753);
  const [lat] = useState(35.6844);
  const [zoom] = useState(14);
  const [API_KEY] = useState("9V8S1PVf6CfINuabJsSA");
  const [selected, setSelected] = useState<Array<GeoJSON.Feature>>([]);
  // const prevSelectedRef = useRef<Array<GeoJSON.Feature>>(null);
  const prev = usePrevious(selected);

  let prevId = "";

  useEffect(() => {
    if (map.current) return;
    if (mapContainer.current !== null) {
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: `https://api.maptiler.com/maps/basic/style.json?key=9V8S1PVf6CfINuabJsSA`,
        center: [lng, lat],
        zoom: zoom,
      });
      draw.current = new MapboxDraw({
        // this is used to allow for custom properties for styling
        // it appends the word "user_" to the property
        userProperties: true,
        controls: {
          combine_features: false,
          uncombine_features: false,
        },
      });
      // Map#addControl takes an optional second argument to set the position of the control.
      // If no position is specified the control defaults to `top-right`. See the docs
      // for more details: https://docs.mapbox.com/mapbox-gl-js/api/#map#addcontrol

      interface mymaplibre extends maplibregl.Map {
        addControl(
          control: IControl | MapboxDraw,
          position?: maplibregl.ControlPosition
        ): this;
      }
      // @ts-ignore
      map.current.addControl(draw.current, "top-left");

      map.current.on("load", function () {
        // ALL YOUR APPLICATION CODE
      });

      // @ts-ignore
      map.current.on("draw.create", function (e: DrawCreateEvent) {
        console.log("create");
      });

      //     map.current.on(
      //       "draw.selectionchange",
      //       function (e: DrawSelectionChangeEvent) {
      //         if (draw.current) {
      //           setSelected(e.features);
      //         }
      //       }
      //     );
    }
  }, []);

  // useEffect(() => {
  //   console.log(selected);
  //   if (!draw.current) return;

  //   if (selected.length > 0) {
  //     draw.current.setFeatureProperty("" + selected[0]?.id, "portWidth", 8);
  //   } else {
  //     console.log("else");
  //     // if (prevSelectedRef.current.length > 0) {
  //     if (prev) {
  //       console.log("current vorhanden");
  //       console.log(prev[0].id);
  //       draw.current.setFeatureProperty("" + prev[0]?.id, "portWidth", 2);
  //     }
  //     // }
  //   }
  //   // prevSelectedRef.current = selected;
  // }, [selected]);

  return (
    <div className="relative w-full h-(screen-20)">
      <div id="map" ref={mapContainer} className="absolute w-full h-full" />
    </div>
  );
};

export default DrawMap;
