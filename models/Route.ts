import mongoose from "mongoose";

/* RouteSchema will correspond to a collection in your MongoDB database. */
const RouteSchema = new mongoose.Schema<routeData>({
  title: {
    /* The title of this Route */

    type: String,
    required: [true, "Please provide a name for this Route."],
    maxlength: [20, "Name cannot be more than 60 characters"],
  },
  date: {
    /* The date of this Route */

    type: Date,
    required: [true, "Please provide the Route owner's name"],
    maxlength: [20, "Owner's Name cannot be more than 60 characters"],
  },
  text: {
    /* The text of this Route */

    type: String,
    required: [true, "Please specify the species of your Route."],
    maxlength: [500, "Species specified cannot be more than 500 characters"],
  },
  route: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      // enum: ["Feature"], // 'location.type' must be 'Point'
      required: true,
    },
    id: String,
    properties: {},
    geometry: {
      type: { type: String },
      coordinates: {},
    },
  },
});

export default mongoose.models.Route ||
  mongoose.model<routeData>("Route", RouteSchema);
