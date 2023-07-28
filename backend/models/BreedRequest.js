import mongoose from "mongoose";
import Product from "./productModel.js";
import { ownerSchema } from "./productModel.js";

const breederSchema = mongoose.Schema(
	{
		breeder_id: { type: mongoose.Types.ObjectId, ref: "Product", required: true },
		// Individual rating
		breeder: { type: String, required: true },
    owner: ownerSchema
	},
	{
		timestamps: true,
	}
)

//  Create Breed Schema
const breedRequestSchema = mongoose.Schema(
  {
    breed: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    breeder: breederSchema
  },
  {
    timestamps: true,
  }
);

const BreedRequest = new mongoose.model("BreedRequest", breedRequestSchema);
export default BreedRequest;
